import {createOptionsMarkup} from "./option";
import {formatTime, formatTimeFromMs} from "../utils";

export const createEventMarkup = (event) => {
  const {eventType, city, eventOptions, price, dateStart, dateEnd} = event;
  const timeStartFormatted = formatTime(dateStart);
  const timeEndFormatted = formatTime(dateEnd);
  const durationFormatted = formatTimeFromMs(dateEnd - dateStart);
  console.log(dateEnd - dateStart);
  const preposition = eventType.group === `Transfer` ? `to` : `in`;
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
                 <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.name}.png" alt="Event type icon">
               </div>
        <h3 class="event__title">${eventType.name} ${preposition} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T14:30">${timeStartFormatted}</time>
                 &mdash;
            <time class="event__end-time" datetime="2019-03-18T16:05">${timeEndFormatted}</time>
          </p>
          <p class="event__duration">${durationFormatted}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

          ${createOptionsMarkup(eventOptions)}          

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
    </li>`
  );
};
