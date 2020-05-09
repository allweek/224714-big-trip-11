import AbstractComponent from "./abstract-component";

const createMenu = () => {
  return (
    `<h2 class="visually-hidden">Switch trip view</h2>
     <nav class="trip-controls__trip-tabs  trip-tabs">
       <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" menu-item="table">Table</a>
       <a class="trip-tabs__btn" href="#" menu-item="stats">Stats</a>
     </nav>`
  );
};


export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenu();
  }

  setActiveItem(menuItem) {
    Array.from(this.getElement().querySelectorAll(`.trip-controls__trip-tabs`)).forEach((menuElem) => {
      menuElem.classList.remove(`trip-tabs__btn--active`);
    });

    const item = this.getElement().querySelector(`[menu-item = "${menuItem}"]`);

    if (item) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  setOnChange(handler) {
    Array.from(this.getElement().querySelectorAll(`.trip-controls__trip-tabs`)).forEach((menuElem) => {
      menuElem.addEventListener(`click`, (evt) => {
        const menuItem = evt.target.getAttribute(`menu-item`);

        handler(menuItem);
      });
    });
  }
}
