import {filterNames} from "./const";
import {render, RenderPosition} from "./utils.js";
import InfoComponent from "./components/trip-info";
import InfoMainComponent from "./components/trip-info-main";
import InfoCostComponent from "./components/trip-info-cost";
import MenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import SortComponent from "./components/sort";
import EventEditCimponent from "./components/event-edit";
import DaysComponent from "./components/days";
import DayComponent from "./components/day";
import EventComponent from "./components/event";
import {generateEvents} from "./mock/event";


const renderEvent = (eventListElement, event) => {
  const onEditButtonClick = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const eventComponent = new EventComponent(event);
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const eventEditComponent = new EventEditComponent(event);
  const editForm = eventEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(eventComponent.getElement(), eventListElement, RenderPosition.BEFOREEND);
};


const EVENT_COUNT = 15;

const events = generateEvents(EVENT_COUNT);

const tripMain = document.querySelector(`.trip-main`);
render(new InfoComponent().getElement(), tripMain, RenderPosition.AFTERBEGIN);

const tripInfo = tripMain.querySelector(`.trip-info`);
render(new InfoMainComponent().getElement(), tripInfo, RenderPosition.AFTERBEGIN);
render(new InfoCostComponent().getElement(), tripInfo, RenderPosition.BEFOREEND);

const tripControls = tripMain.querySelector(`.trip-controls`);
// render(new MenuComponent(), tripControls, RenderPosition.AFTERBEGIN);

render(new FilterComponent(filterNames), tripControls, RenderPosition.BEFOREEND);

const tripEvents = document.querySelector(`.trip-events`);
render(new SortComponent(), tripEvents, RenderPosition.BEFOREEND);
// render(createEventEditTemplate(events[0], true, 0), tripEvents, `beforeend`);
render(new DaysComponent(), tripEvents, `beforeend`);


const sortEvents = (eventsArray) => {
  const sortedEvents = [...eventsArray];
  return sortedEvents.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
};
const sortedEvents = sortEvents(events);


const getAllDays = (eventsList) => {
  const eventDays = new Set();
  eventsList.forEach((evt) => {
    const date = `${evt.dateStart.getFullYear()}.${evt.dateStart.getMonth()}.${evt.dateStart.getDate()}`;
    if (!eventDays.has(date)) {
      eventDays.add(date);
    }
  });
  return eventDays;
};


const allDays = getAllDays(sortedEvents);
const tripDays = tripEvents.querySelector(`.trip-days`);

let daysCount = 0;
for (const day of allDays) {
  daysCount++;
  const dayEvents = [];
  for (const event of sortedEvents) {
    const date = `${event.dateStart.getFullYear()}.${event.dateStart.getMonth()}.${event.dateStart.getDate()}`;
    if (day === date) {
      dayEvents.push(event);
    }
  }
  const dayTripEventsList = dayEvents.map((dayEvent) => createEventMarkup(dayEvent)).join(`\n`);
  const date = dayEvents[0][`dateStart`];
  render(new DayComponent(date, dayTripEventsList, daysCount), tripDays, `beforeend`);
}


const tripEventsList = tripDays.querySelector(`.trip-events__list`);

const tripEventsListElem = tripEventsList.querySelector(`.trip-events__item`);
tripEventsListElem.innerHTML = createEventEditTemplate(sortedEvents[0], false, 1);

