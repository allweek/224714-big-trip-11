import {createElement} from "../utils";

const createTripInfo = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">     
    </section>`
  );
};


export default class Info {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInfo();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(), false);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
