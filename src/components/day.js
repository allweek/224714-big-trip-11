import AbstractComponent from "./abstract-component";
import {getMonthShortName, formatDateWithHypen} from "../utils/common.js";

const createTripDay = (date, dayCount) => {
  const monthShortName = date ? getMonthShortName(date) : ``;
  const dateTime = date ? formatDateWithHypen(date) : ``;
  const dayOfMonth = date ? date.getDate() : ``;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${date ? `<span class="day__counter">${dayCount}</span>
          <time class="day__date" datetime="${dateTime}">${monthShortName} ${dayOfMonth}</time>` : ``}       
      </div>

      <ul class="trip-events__list">       
      </ul>
    </li>`
  );
}

export default class Day extends AbstractComponent {
  constructor(date, dayCount) {
    super();

    this._date = date ? date : ``;
    this._dayCount = dayCount ? dayCount : ``;
  }

  getTemplate() {
    return createTripDay(this._date, this._dayCount);
  }
}
