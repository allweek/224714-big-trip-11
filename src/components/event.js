import {createOptionsMarkup} from "./option";
import {formatTime, formatTimeFromMin} from "../utils";

export const createEventMarkup = (event) => {
  const {eventType, city, eventOptions, destination, price, date, timeStart, duration} = event;
  date.setMinutes(date.getMinutes() + duration);
  const timeEnd = formatTime(date);
  const durationFormated = formatTimeFromMin(duration);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
                 <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
               </div>
        <h3 class="event__title">${eventType} to ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T14:30">${timeStart}</time>
                 &mdash;
            <time class="event__end-time" datetime="2019-03-18T16:05">${timeEnd}</time>
          </p>
          <p class="event__duration">${durationFormated}</p>
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
