import AbstractComponent from "./abstract-component";


const createTripDays = () => {
  return (
    `<ul class="trip-days">       
    </ul>`
  );
};

export default class Days extends AbstractComponent {
  getTemplate() {
    return createTripDays();
  }

  clearChildrenElements() {
    if (this.getElement().querySelectorAll(`.trip-days__item`).length) {
      this.getElement().innerHTML = ``;
    }
  }
}
