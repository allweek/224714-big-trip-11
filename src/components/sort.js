import AbstractComponent from "./abstract-component";
import {SortItems} from "../const";
import {capitalizeWord} from "../utils/common";

const createSortItemMarkup = (sortItem) => {

  if (!sortItem[`sortable`]) {
    return (
      `<span class="trip-sort__item  trip-sort__item--${sortItem.name}">${capitalizeWord(sortItem.name)}</span>`
    );
  } else {
    return (
      `<div class="trip-sort__item  trip-sort__item--${sortItem.name}">
          <input 
            id="sort-${sortItem.name}" 
            class="trip-sort__input  visually-hidden" 
            type="radio" 
            name="trip-sort" 
            value="sort-${sortItem.name}"            
          />
          <label class="trip-sort__btn" for="sort-${sortItem.name}">
            ${capitalizeWord(sortItem.name)}
            
            ${
      sortItem.sortable ?
        `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
              </svg>` : ``
      }
           </label>
        </div>`
    );
  }
};

const createTripSort = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SortItems.map((sortItem) => createSortItemMarkup(sortItem)).join(`\n`)}
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = `sort-event`;
  }

  getTemplate() {
    return createTripSort();
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      evt.preventDefault();

      const sortType = evt.target.value;

      console.log(sortType);

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;


      handler(this._currenSortType);
    });
  }
}

