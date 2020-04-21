import {createElement, castTimeFormat} from "../utils.js";
import {monthShortNames} from "../const";

const createTripDay = (date, index) => {
  const monthShortName = monthShortNames[date.getMonth()];
  const dateTime = `${date.getFullYear()}-${castTimeFormat(date.getMonth() + 1)}-${castTimeFormat(date.getDate())}`;
  const dayOfMonth = date.getDate();
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${dateTime}">${monthShortName} ${dayOfMonth}</time>
      </div>

      <ul class="trip-events__list">       
      </ul>
    </li>`
  );
};

export default class Day {
  constructor(date, index) {
    this._date = date;
    this._index = index;

    this._element = null;
  }

  getTemplate() {
    return createTripDay(this._date, this._index);
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
