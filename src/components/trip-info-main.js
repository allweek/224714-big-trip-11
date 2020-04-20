import {createElement} from "../utils";

const createTripInfoMain = () => {
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>`
  );
};

export default class InfoMain {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInfoMain();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(), true);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
