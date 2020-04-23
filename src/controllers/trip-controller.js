import {render, RenderPosition, replace} from "../utils/render";
import EventComponent from "../components/event";
import EventEditComponent from "../components/event-edit";
import SortComponent from "../components/sort";
import DaysComponent from "../components/days";
import DayComponent from "../components/day";


const renderEvent = (eventListElement, event, index) => {
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const eventComponent = new EventComponent(event);
  const eventEditComponent = new EventEditComponent(event, false, index);
  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
  });

  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
  });

  render(eventComponent, eventListElement, RenderPosition.BEFOREEND);
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortComponent();
    this._daysComponent = new DaysComponent();
  }

  render(events) {
    const container = this._container.getElement();

    render(this._sortComponent, container, RenderPosition.BEFOREEND);
    render(this._daysComponent, container, RenderPosition.BEFOREEND);

    const sortEvents = (eventsArray) => {
      const sortedEvents = [...eventsArray];
      return sortedEvents.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
    };
    const sortedEvents = sortEvents(events);
    const dayList = container.querySelector(`.trip-days`);
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
          .forEach((event) => {
            renderEvent(eventsList, event, index + 1);
          });
      });
  }
}
