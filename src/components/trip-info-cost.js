import {createElement} from "../utils";

const createTripInfoCost = () => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
    </p>`
  );
};

export default class InfoCost {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInfoCost();
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
