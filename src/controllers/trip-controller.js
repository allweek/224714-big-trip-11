import {render, remove, RenderPosition} from "../utils/render";
import {isSameDate, getDuration} from "../utils/common";
import EventController, {Mode as EventControllerMode, EmptyEvent} from "../controllers/event";
import SortComponent from "../components/sort";
import DaysController from "../controllers/days";
import DayComponent from "../components/day";
import Preloader from "../components/preloader";
import NoEventsComponent from "../components/no-events";
import {SortType} from "../const";

const sortEvents = (eventsArray) => {
  const sortedEvents = [...eventsArray];
  return sortedEvents.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
};

const renderEventsWithDays = (dayList, events, offers, destinations, onDataChange, onViewChange) => {
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

const renderEventsWithoutDays = (dayList, events, offers, destinations, onDataChange, onViewChange) => {
  const day = new DayComponent();
  render(day, dayList, RenderPosition.BEFOREEND);
  const eventsList = day.getElement().querySelector(`.trip-events__list`);

  return events.map((event) => {
    const eventController = new EventController(eventsList, offers, destinations, onDataChange, onViewChange, null);

    eventController.render(event, EventControllerMode.DEFAULT);

    return eventController;
  });
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = events;
      break;
    case SortType.TIME:
      sortedEvents = events.sort((a, b) => (getDuration(b.dateStart, b.dateEnd)) - (getDuration(a.dateStart, a.dateEnd)));
      break;
    case SortType.PRICE:
      sortedEvents = events.sort((a, b) => b.price - a.price);
      break;
  }

  return sortedEvents;
};

export default class TripController {
  constructor(container, eventsModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._offers = [];
    this._destinations = [];
    this._api = api;

    this._eventControllers = [];
    this._sortComponent = new SortComponent();
    this._preloader = new Preloader();
    this._noEventsComponent = new NoEventsComponent();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._creatingEvent = null;
    this._showingPreloader = null;
    this._showingNoEvents = null;

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    if (this._showingNoEvents) {
      this.removeNoEvents();
    }

    this._onViewChange(); // закрыть все открытые формы
    this._eventsModel.setEverythingFilter(); // снять фильтры

    const dayListElement = this._container.getElement().querySelector(`.trip-days`);
    this._creatingEvent = new EventController(dayListElement, this._offers, this._destinations, this._onDataChange, this._onViewChange, 0);
    this._creatingEvent.render(EmptyEvent, EventControllerMode.ADDING);

    // если список пуст и создается первый event
    if (!document.contains(this._sortComponent.getElement())) {
      render(this._sortComponent, this._container.getElement(), RenderPosition.AFTERBEGIN);
    }
  }

  render() {
    const container = this._container.getElement();
    const events = this._eventsModel.getEvents();

    if (this._showingPreloader) {
      this.removePreloader();
    }

    this._daysController = new DaysController(container);
    this._daysController.render();

    if (!events.length) {
      this.showNoEvents();
    } else {
      this.removeNoEvents();
      render(this._sortComponent, container, RenderPosition.AFTERBEGIN);

      this._renderEvents(events);
    }
  }

  _renderEvents(events) {
    const dayList = this._container.getElement().querySelector(`.trip-days`);

    this._daysController.clear();
    this._offers = this._eventsModel.getOffers();
    this._destinations = this._eventsModel.getDestinations();

    let newEvents;
    if (this._sortComponent.getSortType() === `sort-event`) {
      newEvents = renderEventsWithDays(dayList, events, this._offers, this._destinations, this._onDataChange, this._onViewChange);
    } else {
      newEvents = renderEventsWithoutDays(dayList, events, this._offers, this._destinations, this._onDataChange, this._onViewChange);
    }

    this._eventControllers = this._eventControllers.concat(newEvents);
  }

  _removeEvents() {
    this._eventControllers.forEach((eventController) => eventController.destroy());
    this._eventControllers = [];
  }

  _onViewChange() {
    this._eventControllers.forEach((eventController) => eventController.setDefaultView());
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
        eventController.unblockEditForm();
      } else {
        // добавление нового event
        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            this._updateEvents();
            eventController.unblockEditForm();
          })
          .catch(() => {
            eventController.shake();
          });

        // eventController.render(newData, EventControllerMode.DEFAULT);
        // this._eventControllers = [].concat(eventController, this._eventControllers);
      }
    } else if (newData === null) {
      // удаление event
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          this._updateEvents();
          eventController.unblockEditForm();
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
                eventController.unblockEditForm();
              } else {
                // если дата меняется, пересовываем весь список
                this._updateEvents();
                eventController.unblockEditForm();
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

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);

    this._removeEvents();
    this._renderEvents(sortedEvents);
  }

  showPreloader() {
    const container = this._container.getElement();
    this._showingPreloader = true;

    render(this._preloader, container, RenderPosition.BEFOREEND);
  }

  removePreloader() {
    remove(this._preloader);
    this._showingPreloader = false;
  }

  showNoEvents() {
    const container = this._container.getElement();
    this._showingNoEvents = true;

    render(this._noEventsComponent, container, RenderPosition.BEFOREEND);
  }

  removeNoEvents() {
    remove(this._noEventsComponent);
    this._showingNoEvents = false;
  }
}
