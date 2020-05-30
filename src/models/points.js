import {getPointsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Points {
  constructor() {
    this._points = [];
    this._offers = [];
    this._destinations = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._changeComponentFilterCheckbox = [];
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  getPointsAll() {
    return this._points;
  }

  setPoints(points) {
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
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

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setEverythingFilter() {
    this._activeFilterType = FilterType.EVERYTHING;
    this._callHandlers(this._changeComponentFilterCheckbox);
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((evt) => evt.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removePoint(id) {
    const index = this._points.findIndex((evt) => evt.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
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
