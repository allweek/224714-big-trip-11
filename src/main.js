import {filterNames} from "./const";
import {render, remove, replace, RenderPosition} from "./utils/render";
import InfoComponent from "./components/trip-info";
import InfoMainComponent from "./components/trip-info-main";
import InfoCostComponent from "./components/trip-info-cost";
import MenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import SortComponent from "./components/sort";
import EventEditComponent from "./components/event-edit";
import DaysComponent from "./components/days";
import DayComponent from "./components/day";
import EventComponent from "./components/event";
import {generateEvents} from "./mock/event";


const renderEvent = (eventListElement, event, index) => {
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEditButtonClick = () => {
    replaceEventToEdit();
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    replaceEditToEvent();
  };

  const eventComponent = new EventComponent(event);
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const eventEditComponent = new EventEditComponent(event, false, index);
  const editForm = eventEditComponent.getElement();
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(eventComponent, eventListElement, RenderPosition.BEFOREEND);
};


const EVENT_COUNT = 15;

const events = generateEvents(EVENT_COUNT);

const tripMain = document.querySelector(`.trip-main`);
render(new InfoComponent(), tripMain, RenderPosition.AFTERBEGIN);

const tripInfo = tripMain.querySelector(`.trip-info`);
render(new InfoMainComponent(), tripInfo, RenderPosition.AFTERBEGIN);
render(new InfoCostComponent(), tripInfo, RenderPosition.BEFOREEND);

const tripControls = tripMain.querySelector(`.trip-controls`);
render(new MenuComponent(), tripControls, RenderPosition.AFTERBEGIN);

render(new FilterComponent(filterNames), tripControls, RenderPosition.BEFOREEND);

const tripEvents = document.querySelector(`.trip-events`);
render(new SortComponent(), tripEvents, RenderPosition.BEFOREEND);
render(new DaysComponent(), tripEvents, RenderPosition.BEFOREEND);


const sortEvents = (eventsArray) => {
  const sortedEvents = [...eventsArray];
  return sortedEvents.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
};
const sortedEvents = sortEvents(events);
const dayList = tripEvents.querySelector(`.trip-days`);
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


