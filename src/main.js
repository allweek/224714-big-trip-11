import API from "./api.js";
import BoardComponent from "./components/board.js";
import EventsModel from "./models/events.js";
import FilterController from "./controllers/filter";
import InfoComponent from "./components/trip-info";
import InfoMainComponent from "./components/trip-info-main";
import InfoCostComponent from "./components/trip-info-cost";
import MenuComponent from "./components/menu";
import {render, RenderPosition} from "./utils/render.js";
import TripController from "./controllers/trip-controller.js";

const AUTHORIZATION = `Basic eo0w590ik213891a=`;
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
newEventButton.addEventListener(`click`, function () {
  tripController.createEvent();
});

const filterController = new FilterController(tripControls, eventsModel);
filterController.render();

const boardComponent = new BoardComponent();
const tripController = new TripController(boardComponent, eventsModel, api);
tripController.showPreloader();
newEventButton.disabled = true;

const container = document.querySelectorAll(`.page-body__container`)[1];
render(boardComponent, container, RenderPosition.BEFOREEND);


api.getOffers()
  .then((offers) => {
    eventsModel.setOffers(offers);
    return api.getDestinations()
      .then((destinations) => {
        eventsModel.setDestinations(destinations)
        return api.getEvents()
          .then((events) => {
            eventsModel.setEvents(events);
            tripController.render();
            newEventButton.disabled = false;
          });
      });
  });


