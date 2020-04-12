import {flatpickr} from "flatpickr";
import {filterNames} from "./const";
import {createTripInfo} from "./components/trip-info";
import {createTripInfoMain} from "./components/trip-info-main";
import {createTripInfoCost} from "./components/trip-info-cost";
import {createMenu} from "./components/menu";
import {createFilters} from "./components/filter";
import {createEventEditTemplate} from "./components/event-edit";
import {createTripSort} from "./components/sort";
import {createTripDays} from "./components/days";
import {createTripDay} from "./components/day";
import {generateEvents} from "./mock/event";
import {createEventMarkup} from "./components/event";


const EVENT_COUNT = 15;

const events = generateEvents(EVENT_COUNT);

const render = (template, placeElem, position) => {
  placeElem.insertAdjacentHTML(position, template);
};

const tripMain = document.querySelector(`.trip-main`);
render(createTripInfo(), tripMain, `afterbegin`);

const tripInfo = tripMain.querySelector(`.trip-info`);
render(createTripInfoMain(), tripInfo, `afterbegin`);
render(createTripInfoCost(), tripInfo, `beforeend`);

const tripControls = tripMain.querySelector(`.trip-controls`);
render(createMenu(), tripControls, `afterbegin`);

render(createFilters(filterNames), tripControls, `beforeend`);

const tripEvents = document.querySelector(`.trip-events`);
render(createTripSort(), tripEvents, `beforeend`);
render(createEventEditTemplate(events[0], true, 0), tripEvents, `beforeend`);
render(createTripDays(), tripEvents, `beforeend`);

const tripDays = tripEvents.querySelector(`.trip-days`);
const date = `2019-03-18`;
render(createTripDay(date), tripDays, `beforeend`);

const tripEventsList = tripDays.querySelector(`.trip-events__list`);

for (let i = 1; i < events.length; i++) {
  render(createEventMarkup(events[i]), tripEventsList, `beforeend`);
}

const tripEventsListElem = tripEventsList.querySelector(`.trip-events__item`);
tripEventsListElem.innerHTML = createEventEditTemplate(events[0], false, 0);

