import {getEventsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Events {
  constructor() {
    this._events = [];
    this._offers = [];
    this._destinations = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._changeComponentFilterCheckbox = [];
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setEverythingFilter() {
    this._activeFilterType = FilterType.EVERYTHING;
    this._callHandlers(this._changeComponentFilterCheckbox);
  }

  setOffers(offers) {
    this._offers = Array.from(offers);
  }

  getOffers() {
    return this._offers;
  }

  setDestinations(destinations) {
    this._destinations = Array.from(destinations);
  }

  getDestinations() {
    return this._destinations;
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((evt) => evt.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeEvent(id) {
    const index = this._events.findIndex((evt) => evt.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._callHandlers(this._dataChangeHandlers);
  }

  // обработчик при установке фильтра через модель, для сброса фильтров при создании новой точки
  setFilterChangeHandlerInComponent(handler) {
    this._changeComponentFilterCheckbox.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
