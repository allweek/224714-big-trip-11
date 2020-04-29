import BoardComponent from "./components/board.js";
import TripController from "./controllers/trip-controller.js";
import FilterComponent from "./components/filter.js";
import {generateEvents} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";
import InfoComponent from "./components/trip-info";
import InfoMainComponent from "./components/trip-info-main";
import InfoCostComponent from "./components/trip-info-cost";
import MenuComponent from "./components/menu";
import {filterNames} from "./const";
import EventsModel from "./models/events.js";

const EVENT_COUNT = 15;


const tripMain = document.querySelector(`.trip-main`);
render(new InfoComponent(), tripMain, RenderPosition.AFTERBEGIN);

const tripInfo = tripMain.querySelector(`.trip-info`);
render(new InfoMainComponent(), tripInfo, RenderPosition.AFTERBEGIN);
render(new InfoCostComponent(), tripInfo, RenderPosition.BEFOREEND);

const tripControls = tripMain.querySelector(`.trip-controls`);
render(new MenuComponent(), tripControls, RenderPosition.AFTERBEGIN);

render(new FilterComponent(filterNames), tripControls, RenderPosition.BEFOREEND);

const events = generateEvents(EVENT_COUNT);
const eventsModel = new EventsModel();
eventsModel.setTasks(events);

const boardComponent = new BoardComponent();
const tripController = new TripController(boardComponent, eventsModel);
const container = document.querySelectorAll(`.page-body__container`)[1];

render(boardComponent, container, RenderPosition.BEFOREEND);
tripController.render(events);
