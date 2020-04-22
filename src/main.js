import {filterNames} from "./const";
import {render, replace, RenderPosition} from "./utils/render";
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
import BoardComponent from "./components/board";


const renderEvent = (eventListElement, event, index) => {
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const eventComponent = new EventComponent(event);
  const eventEditComponent = new EventEditComponent(event, false, index);
  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
  });

  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
  });

  render(eventComponent, eventListElement, RenderPosition.BEFOREEND);
};


const EVENT_COUNT = 15;

const renderBoard = (boardComponent, events) => {

  render(new SortComponent(), boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(new DaysComponent(), boardComponent.getElement(), RenderPosition.BEFOREEND);

  const sortEvents = (eventsArray) => {
    const sortedEvents = [...eventsArray];
    return sortedEvents.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
  };
  const sortedEvents = sortEvents(events);
  const dayList = boardComponent.getElement().querySelector(`.trip-days`);
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
};


const tripMain = document.querySelector(`.trip-main`);
render(new InfoComponent(), tripMain, RenderPosition.AFTERBEGIN);

const tripInfo = tripMain.querySelector(`.trip-info`);
render(new InfoMainComponent(), tripInfo, RenderPosition.AFTERBEGIN);
render(new InfoCostComponent(), tripInfo, RenderPosition.BEFOREEND);

const tripControls = tripMain.querySelector(`.trip-controls`);
render(new MenuComponent(), tripControls, RenderPosition.AFTERBEGIN);

render(new FilterComponent(filterNames), tripControls, RenderPosition.BEFOREEND);

const events = generateEvents(EVENT_COUNT);

const boardComponent = new BoardComponent();
const container = document.querySelectorAll(`.page-body__container`)[1];

render(boardComponent, container, RenderPosition.BEFOREEND);
renderBoard(boardComponent, events);

// const tripController = new TripController(boardComponent);
