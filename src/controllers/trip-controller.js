import {render, remove, RenderPosition} from "../utils/render";
import {isSameDate} from "../utils/common";
import EventController, {Mode as EventControllerMode, EmptyEvent} from "../controllers/event";
import SortComponent from "../components/sort";
import DaysController from "../controllers/days";
import DayComponent from "../components/day";
import Preloader from "../components/preloader";


const renderEvents = (dayList, events, offers, destinations, onDataChange, onViewChange) => {
  const sortEvents = (eventsArray) => {
    const sortedEvents = [...eventsArray];
    return sortedEvents.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
  };
  const sortedEvents = sortEvents(events);
  let eventControllers = [];
  sortedEvents
    .reduce((eventsByDay, event) => {
      const date = new Date(event.dateStart);
      const lastDay = eventsByDay.length ? eventsByDay[eventsByDay.length - 1] : null;
      date.setHours(0, 0, 0, 0);
      if (!lastDay || lastDay.date.getTime() !== date.getTime()) {
        eventsByDay.push({date, events: [event]});
      } else {
        lastDay.events.push(event);
      }
      return eventsByDay;
    }, [])
    .forEach((eventsByDay, index) => {
      const date = eventsByDay.events[0].dateStart;
      const dayCount = index + 1;
      const day = new DayComponent(date, dayCount);
      render(day, dayList, RenderPosition.BEFOREEND);
      const eventsList = day.getElement().querySelector(`.trip-events__list`);
      eventControllers = [...eventControllers,
        ...(eventsByDay.events
          .map((event) => {
            const eventController = new EventController(eventsList, offers, destinations, onDataChange, onViewChange, dayCount);

            eventController.render(event, EventControllerMode.DEFAULT);

            return eventController;
          }))];
    });
  return eventControllers;
};


export default class TripController {
  constructor(container, eventsModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._offers = [];
    this._destinations = [];
    this._api = api;

    this._showedEventControllers = [];
    this._sortComponent = new SortComponent();
    this._preloader = new Preloader();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._creatingEvent = null;
    this._showingPreloader = null;

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    this._onViewChange(); // закрыть все открытые формы
    this._eventsModel.setEverythingFilter(); // снять фильтры
    const dayListElement = this._container.getElement().querySelector(`.trip-days`);
    this._creatingEvent = new EventController(dayListElement, this._offers, this._destinations, this._onDataChange, this._onViewChange, 0);
    this._creatingEvent.render(EmptyEvent, EventControllerMode.ADDING);
  }

  render() {
    const container = this._container.getElement();
    const events = this._eventsModel.getEvents();

    if (this._showingPreloader) {
      remove(this._preloader);
    }

    render(this._sortComponent, container, RenderPosition.BEFOREEND);
    this._daysController = new DaysController(container);
    this._daysController.render();

    this._renderEvents(events);
  }

  _renderEvents(events) {
    const dayList = this._container.getElement().querySelector(`.trip-days`);

    this._daysController.clear();
    this._offers = this._eventsModel.getOffers();
    this._destinations = this._eventsModel.getDestinations();
    const newEvents = renderEvents(dayList, events, this._offers, this._destinations, this._onDataChange, this._onViewChange);
    this._showedEventControllers = this._showedEventControllers.concat(newEvents);
  }

  _removeEvents() {
    this._showedEventControllers.forEach((eventController) => eventController.destroy());
    this._showedEventControllers = [];
  }

  _onViewChange() {
    this._showedEventControllers.forEach((eventController) => eventController.setDefaultView());
  }

  _updateEvents() {
    this._removeEvents();
    this._renderEvents(this._eventsModel.getEvents());
  }

  _onDataChange(eventController, oldData, newData, stayOnAddingMode) {
    if (oldData === EmptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        // при создании нового event пришли пустые данные
        eventController.destroy();
        this._updateEvents();
      } else {
        // добавление нового event
        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            this._updateEvents();
          })
          .catch(() => {
            eventController.shake();
          });

        // eventController.render(newData, EventControllerMode.DEFAULT);
        // this._showedEventControllers = [].concat(eventController, this._showedEventControllers);
      }
    } else if (newData === null) {
      // удаление event
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          this._updateEvents();
        })
        .catch(() => {
          eventController.shake();
        });
    } else {
      // изменение
      if (stayOnAddingMode) {
        // изменение данных без закрытия и сохранение формы, например добавление в избранное
        eventController.render(newData, EventControllerMode.ADDING);
      } else {
        // изменение данных с закрытием формы
        this._api.updateEvent(oldData.id, newData)
          .then((eventModel) => {
            const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);
            if (isSuccess) {
              if (isSameDate(oldData, newData)) {
                // если дата не меняется перерисовываем только данное событие
                eventController.render(eventModel, EventControllerMode.DEFAULT);
              } else {
                // если дата меняется, пересовываем весь список
                this._updateEvents();
              }
            }
          })
          .catch(() => {
            eventController.shake();
          });
      }
    }
  }

  _onFilterChange() {
    this._creatingEvent = null;
    this._updateEvents();
  }

  showPreloader() {
    const container = this._container.getElement();
    this._showingPreloader = true;

    render(this._preloader, container, RenderPosition.BEFOREEND);
  }
}
