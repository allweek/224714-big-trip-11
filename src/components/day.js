import AbstractComponent from "./abstract-component";
import {getMonthShortName, formatDateWithHypen} from "../utils/common.js";

const createTripDay = (date, index) => {
  const monthShortName = getMonthShortName(date);
  const dateTime = formatDateWithHypen(date);
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

export default class Day extends AbstractComponent {
  constructor(date, index) {
    super();

    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createTripDay(this._date, this._index);
  }
}
