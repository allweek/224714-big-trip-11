import {createElement} from "../utils.js";

const createTripDay = (date, eventsList, index) => {
  const monthShortName = date.toLocaleString(`en`, {month: `short`});
  const dateTime = date.toISOString().slice(0, 10);
  const dayOfMonth = date.getDate();
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${dateTime}">${monthShortName} ${dayOfMonth}</time>
      </div>

      <ul class="trip-events__list">    
        ${eventsList}
      </ul>
    </li>`
  );
};

export default class Day {
  constructor(date, eventsList, index) {
    this._date = date;
    this._eventsList = eventsList;
    this._index = index;

    this._element = null;
  }

  getTemplate() {
    return createTripDay(this._date, this._eventsList, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
