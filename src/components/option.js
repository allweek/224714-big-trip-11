import {createElement} from "../utils";

const createOptionsMarkup = (events) => {
  if (events && events.length) {
    const options = events
      .slice(0, 3)
      .map((event) =>
        `<li class="event__offer">
            <span class="event__offer-title">${event.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${event.price}</span>
        </li>`
      )
      .join(`\n`);

    return (
      `<h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
         ${options}
       </ul>`
    );
  } else {
    return ``;
  }
};


export default class Options {
  constructor(events) {
    this._events = events;

    this._element = null;
  }

  getTemplate() {
    return createOptionsMarkup(this._events);
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
