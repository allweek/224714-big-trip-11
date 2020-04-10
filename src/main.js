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
console.log(events[0]);
render(createEventEditTemplate(events[0]), tripEvents, `beforeend`);
render(createTripSort(), tripEvents, `beforeend`);
render(createTripDays(), tripEvents, `beforeend`);

const tripDays = tripEvents.querySelector(`.trip-days`);
render(createTripDay(), tripDays, `beforeend`);

const tripEventsList = tripDays.querySelector(`.trip-events__list`);
for (let i = 1; i < events.length; i++) {
  render(createEventMarkup(events[i]), tripEventsList, `beforeend`);
}
