import AbstractComponent from "./abstract-component";
import OptionsComponent from "./option";
import {formatTime, formatTimeFromMs} from "../utils/common.js";
import {generateOptions} from "../mock/option";


const createEventMarkup = (event) => {
  const {eventType, city, price, dateStart, dateEnd} = event;
  const eventNameToCapitalize = eventType.name ? eventType.name.charAt(0).toUpperCase() + eventType.name.slice(1) : ``;
  const timeStartFormatted = formatTime(dateStart);
  const timeEndFormatted = formatTime(dateEnd);
  const durationFormatted = formatTimeFromMs(dateEnd - dateStart);
  const preposition = eventType.group === `Transfer` ? `to` : `in`;
  const dateTimeStart = dateStart.toISOString().slice(0, 13);
  const dateTimeEnd = dateEnd.toISOString().slice(0, 13);
  const eventOptions = generateOptions(eventType.name);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
                 <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.name}.png" alt="Event type icon">
               </div>
        <h3 class="event__title">${eventNameToCapitalize} ${preposition} ${city}</h3>

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

          ${(new OptionsComponent(eventOptions)).getTemplate()}          

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
    </li>`
  );
};


export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventMarkup(this._event);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
