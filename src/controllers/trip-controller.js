import {render, RenderPosition} from "../utils/render";
import {isSameDate} from "../utils/common";
import EventController, {Mode as EventControllerMode, EmptyEvent} from "../controllers/event";
import SortComponent from "../components/sort";
import DaysController from "../controllers/days";
import DayComponent from "../components/day";


const renderEvents = (dayList, events, onDataChange, onViewChange) => {
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
      const day = new DayComponent(date, index + 1);
      render(day, dayList, RenderPosition.BEFOREEND);
      const eventsList = day.getElement().querySelector(`.trip-events__list`);
      eventControllers = [...eventControllers,
        ...(eventsByDay.events
          .map((event) => {
            const eventController = new EventController(eventsList, onDataChange, onViewChange, index + 1);

            eventController.render(event, EventControllerMode.DEFAULT);

            return eventController;
          }))];
    });
  return eventControllers;
};


export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._showedEventControllers = [];
    this._sortComponent = new SortComponent();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._creatingEvent = null;

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const dayListElement = this._container.getElement().querySelector(`.trip-days`);
    this._creatingEvent = new EventController(dayListElement, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(EmptyEvent, EventControllerMode.ADDING);
  }

  render() {
    const container = this._container.getElement();

    const events = this._eventsModel.getEvents();
    render(this._sortComponent, container, RenderPosition.BEFOREEND);
    this._daysController = new DaysController(container);
    this._daysController.render();

    this._renderEvents(events);
  }

  _renderEvents(events) {
    const dayList = this._container.getElement().querySelector(`.trip-days`);

    this._daysController.clear();
    const newEvents = renderEvents(dayList, events, this._onDataChange, this._onViewChange);
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
        this._eventsModel.addEvent(newData);
        this._updateEvents();
        // eventController.render(newData, EventControllerMode.DEFAULT);
        //
        // this._showedEventControllers = [].concat(eventController, this._showedEventControllers);
      }
    } else if (newData === null) {
      // удаление event
      this._eventsModel.removeEvent(oldData.id);
      this._updateEvents();
    } else {
      // изменение
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        if (stayOnAddingMode) {
          // изменение данных без закрытия формы, например добавление в избранное
          eventController.render(newData, EventControllerMode.ADDING);
        } else {
          // изменение данных с закрытием формы

          if (isSameDate(oldData, newData)) {
            eventController.render(newData, EventControllerMode.DEFAULT);
          } else {
            this._updateEvents();
          }
        }
      }
    }
  }

  _onFilterChange() {
    this._removeEvents();
    this._renderEvents(this._eventsModel.getEvents());
  }
}
