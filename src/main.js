import API from "./api.js";
import TripComponent from "./components/trip.js";
import EventsModel from "./models/events.js";
import FilterController from "./controllers/filter";
import InfoComponent from "./components/trip-info";
import InfoMainComponent from "./components/trip-info-main";
import InfoCostComponent from "./components/trip-info-cost";
import StatComponent from "./components/stat";
import MenuComponent from "./components/menu";
import {MenuItem} from "./const";
import {render, RenderPosition} from "./utils/render.js";
import Trip from "./controllers/trip.js";


const AUTHORIZATION = `Basic eo0w590ik21389a=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel();


const tripMain = document.querySelector(`.trip-main`);
render(new InfoComponent(), tripMain, RenderPosition.AFTERBEGIN);

const tripInfo = tripMain.querySelector(`.trip-info`);
render(new InfoMainComponent(), tripInfo, RenderPosition.AFTERBEGIN);
render(new InfoCostComponent(), tripInfo, RenderPosition.BEFOREEND);

const tripControls = tripMain.querySelector(`.trip-controls`);
const menuComponent = new MenuComponent();
render(menuComponent, tripControls, RenderPosition.AFTERBEGIN);

const newEventButton = tripMain.querySelector(`.trip-main__event-add-btn`);

const filterController = new FilterController(tripControls, eventsModel);
filterController.render();

const tripComponent = new TripComponent();
const tripController = new Trip(tripComponent, eventsModel, api);
tripController.showPreloader();
newEventButton.disabled = true;

const container = document.querySelectorAll(`.page-body__container`)[1];
render(tripComponent, container, RenderPosition.BEFOREEND);

const statComponent = new StatComponent({events: eventsModel});
render(statComponent, container, RenderPosition.BEFOREEND);
statComponent.hide();

newEventButton.addEventListener(`click`, function () {
  statComponent.hide();
  menuComponent.setActiveItem(MenuItem.TABLE)
  tripController.show();
  tripController.createEvent();
});

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATISTICS:
      menuComponent.setActiveItem(MenuItem.STATISTICS);
      tripController.hide();
      statComponent.show();
      break;
  }
});

api.getOffers()
  .then((offers) => {
    eventsModel.setOffers(offers);
    return api.getDestinations()
      .then((destinations) => {
        eventsModel.setDestinations(destinations);
        return api.getEvents()
          .then((events) => {
            eventsModel.setEvents(events);
            tripController.render();
            newEventButton.disabled = false;
          });
      });
  });


