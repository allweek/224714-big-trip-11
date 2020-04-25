import {render, RenderPosition} from "../utils/render";
import EventController from "../controllers/event";
import SortComponent from "../components/sort";
import DaysComponent from "../components/days";
import DayComponent from "../components/day";


const renderEvents = (dayList, events, onDataChange) => {
  const sortEvents = (eventsArray) => {
    const sortedEvents = [...eventsArray];
    return sortedEvents.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
  };
  const sortedEvents = sortEvents(events);

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
      eventsByDay.events
        .map((event) => {
          const eventController = new EventController(eventsList, onDataChange);

          eventController.render(event, index + 1);

          return eventController; // зачем return ? работает и без него вроде
        });
    });
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._showedEventControllers = [];
    this._sortComponent = new SortComponent();
    this._daysComponent = new DaysComponent();
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(events) {
    this._events = events;

    const container = this._container.getElement();

    render(this._sortComponent, container, RenderPosition.BEFOREEND);
    render(this._daysComponent, container, RenderPosition.BEFOREEND);


    const dayList = container.querySelector(`.trip-days`);

    const newEvents = renderEvents(dayList, this._events, this._onDataChange);
    this._showedEventControllers = this._showedEventControllers.concat(newEvents); // по идее в учебном это для loadmore button
  }

  _onDataChange(eventController, oldData, newData) {
    const index = this._events.findIndex((event) => event === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    console.log(this._showedEventControllers);
    eventController.render(this._events[index]);
    console.log(newData);
  }
}
