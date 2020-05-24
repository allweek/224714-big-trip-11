import AbstractComponent from "./abstract-component";
import OptionsComponent from "./option";
import {formatTime, getDurationFormatted, formatDateWithHyphenTime, capitalizeWord} from "../utils/common.js";


const createPointMarkup = (point) => {
  const {pointType, city, price, dateStart, dateEnd, offersChecked} = point;
  const pointNameToCapitalize = pointType.name ? capitalizeWord(pointType.name) : ``;
  const timeStartFormatted = formatTime(dateStart);
  const timeEndFormatted = formatTime(dateEnd);
  const durationFormatted = getDurationFormatted(dateStart, dateEnd);

  const preposition = pointType.group === `Transfer` ? `to` : `in`;
  const dateTimeStart = formatDateWithHyphenTime(dateStart);
  const dateTimeEnd = formatDateWithHyphenTime(dateEnd);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
                 <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType.name}.png" alt="Event type icon">
               </div>
        <h3 class="event__title">${pointNameToCapitalize} ${preposition} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateTimeStart}">${timeStartFormatted}</time>
                 &mdash;
            <time class="event__end-time" datetime="${dateTimeEnd}">${timeEndFormatted}</time>
          </p>
          <p class="event__duration">${durationFormatted}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

          ${(new OptionsComponent(offersChecked)).getTemplate()}          

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
    </li>`
  );
};


export default class Point extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createPointMarkup(this._point);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
