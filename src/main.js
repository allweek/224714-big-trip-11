import {filterNames} from "./const";
import {render, RenderPosition} from "./utils.js";
import InfoComponent from "./components/trip-info";
import InfoMainComponent from "./components/trip-info-main";
import InfoCostComponent from "./components/trip-info-cost";
import MenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import SortComponent from "./components/sort";
import EventEditComponent from "./components/event-edit";
import DaysComponent from "./components/days";
import DayComponent from "./components/day";
import EventListComponent from "./components/event-list";
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
  const editForm = eventEditComponent.getElement();
  editForm.addEventListener(`submit`, onEditFormSubmit);

  // day
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
render(new MenuComponent().getElement(), tripControls, RenderPosition.AFTERBEGIN);

render(new FilterComponent(filterNames).getElement(), tripControls, RenderPosition.BEFOREEND);

const tripEvents = document.querySelector(`.trip-events`);
render(new SortComponent().getElement(), tripEvents, RenderPosition.BEFOREEND);
// render(createEventEditTemplate(events[0], true, 0), tripEvents, `beforeend`);
render(new DaysComponent().getElement(), tripEvents, RenderPosition.BEFOREEND);


const sortEvents = (eventsArray) => {
  const sortedEvents = [...eventsArray];
  return sortedEvents.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
};
const sortedEvents = sortEvents(events);
const dayList = tripEvents.querySelector(`.trip-days`);
const putEventsIntoDays = sortedEvents
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
    render(day.getElement(), dayList, RenderPosition.BEFOREEND);
    const eventsList = day.getElement().querySelector(`.trip-events__list`);
    eventsByDay.events
      .forEach((event) => {
        renderEvent(eventsList, event);
      });
  });


console.log(putEventsIntoDays);

// const getAllDays = (eventsList) => {
//   const eventDays = new Set();
//   eventsList.forEach((evt) => {
//     const date = `${evt.dateStart.getFullYear()}.${evt.dateStart.getMonth()}.${evt.dateStart.getDate()}`;
//     if (!eventDays.has(date)) {
//       eventDays.add(date);
//     }
//   });
//   return eventDays;
// };
//
//
// const allDays = getAllDays(sortedEvents);
// const tripDays = tripEvents.querySelector(`.trip-days`);
//
//
// let daysCount = 0;
// for (const day of allDays) {
//   daysCount++;
//   const dayEvents = [];
//   const dayElement = new DayComponent(new Date(), 1);
//   const eventListElement = dayElement.getElement().querySelector(`.trip-events__list`);
//   for (const event of sortedEvents) {
//     const date = `${event.dateStart.getFullYear()}.${event.dateStart.getMonth()}.${event.dateStart.getDate()}`;
//     if (day === date) {
//       renderEvent(eventListElement, event);
//     }
//   }
//   // const dayTripEventsList = dayEvents.map((dayEvent) => (console.log(new EventComponent(dayEvent)))).join(`\n`);
//   // const date = dayEvents[0][`dateStart`];
//   // render(new DayComponent(date, dayTripEventsList, daysCount), tripDays, `beforeend`);
// }


// const tripEventsList = tripDays.querySelector(`.trip-events__list`);
// const tripEventsListElem = tripEventsList.querySelector(`.trip-events__item`);
// tripEventsListElem.innerHTML = createEventEditTemplate(sortedEvents[0], false, 1);

