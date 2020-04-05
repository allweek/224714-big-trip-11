import {createTripInfo} from "./components/trip-info";
import {createTripInfoMain} from "./components/trip-info-main";
import {createTripInfoCost} from "./components/trip-info-cost";
import {createMenu} from "./components/menu";
import {createFilters} from "./components/filters";
import {createAddEventForm} from "./components/addEvent";
import {createTripSort} from "./components/sort";
import {createTripDays} from "./components/days";
import {createTripDay} from "./components/day";
import {createTripEvent} from "./components/event";


const TRIP_POINT_COUNT = 3;

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
render(createFilters(), tripControls, `beforeend`);

const tripEvents = document.querySelector(`.trip-events`);
render(createAddEventForm(), tripEvents, `beforeend`);
render(createTripSort(), tripEvents, `beforeend`);
render(createTripDays(), tripEvents, `beforeend`);

const tripDays = tripEvents.querySelector(`.trip-days`);
render(createTripDay(), tripDays, `beforeend`);

const tripEventsList = tripDays.querySelector(`.trip-events__list`);
for (let i = 0; i < TRIP_POINT_COUNT; i++) {
  render(createTripEvent(), tripEventsList, `beforeend`);
}

