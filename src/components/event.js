import OptionsComponent from "./option";
import {createElement, formatTime, formatTimeFromMs} from "../utils.js";


const createEventMarkup = (event) => {
  const {eventType, city, eventOptions, price, dateStart, dateEnd} = event;
  const eventNameLowerCase = eventType.name.toLowerCase();
  const timeStartFormatted = formatTime(dateStart);
  const timeEndFormatted = formatTime(dateEnd);
  const durationFormatted = formatTimeFromMs(dateEnd - dateStart);
  const preposition = eventType.group === `Transfer` ? `to` : `in`;
  const dateTimeStart = dateStart.toISOString().slice(0, 13);
  const dateTimeEnd = dateEnd.toISOString().slice(0, 13);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
                 <img class="event__type-icon" width="42" height="42" src="img/icons/${eventNameLowerCase}.png" alt="Event type icon">
               </div>
        <h3 class="event__title">${eventType.name} ${preposition} ${city}</h3>

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

          ${new OptionsComponent(eventOptions)}          

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
    </li>`
  );
};


export default class Event {
  constructor(event) {
    this._event = event;

    this._element = null;
  }

  getTemplate() {
    return createEventMarkup(this._event);
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
