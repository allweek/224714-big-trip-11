import API from "./api.js";
import TripComponent from "./components/trip.js";
import PointsModel from "./models/points.js";
import FilterController from "./controllers/filter";
import StatsComponent from "./components/stats";
import MenuComponent from "./components/menu";
import {MenuItem} from "./const";
import {render, RenderPosition} from "./utils/render.js";
import Trip from "./controllers/trip.js";


const AUTHORIZATION = `Basic eo0w590ik22659a=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();


const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const menuComponent = new MenuComponent();
render(menuComponent, tripControls, RenderPosition.AFTERBEGIN);

const newPointButton = tripMain.querySelector(`.trip-main__event-add-btn`);

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripComponent = new TripComponent();
const tripController = new Trip(tripComponent, pointsModel, api);
tripController.showPreloader();
newPointButton.disabled = true;

const container = document.querySelectorAll(`.page-body__container`)[1];
render(tripComponent, container, RenderPosition.BEFOREEND);

const statComponent = new StatsComponent({points: pointsModel});
render(statComponent, container, RenderPosition.BEFOREEND);
statComponent.hide();

newPointButton.addEventListener(`click`, () => {
  statComponent.hide();
  menuComponent.setActiveItem(MenuItem.TABLE);
  tripController.show();
  newPointButton.disabled = true;
  tripController.createPoint(newPointButton);
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
      tripController.setDefaultSortType();
      statComponent.show();
      break;
  }
});

Promise.all([api.getOffers(), api.getDestinations(), api.getPoints()]).then((data) => {
  const [offers, destinations, points] = data;
  pointsModel.setOffers(offers);
  pointsModel.setDestinations(destinations);
  pointsModel.setPoints(points);
  tripController.render();
  newPointButton.disabled = false;
});

