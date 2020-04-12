import {sortItems} from "../const";

const createSortItemMarkup = (sortItem, isChecked) => {

  if (sortItem[`non-clickable`]) {
    return (
      `<span class="trip-sort__item  trip-sort__item--${sortItem.name.toLowerCase()}">${sortItem.name}</span>`
    );
  } else {
    return (
      `<div class="trip-sort__item  trip-sort__item--${sortItem.name.toLowerCase()}">
          <input 
            id="sort-${sortItem.name.toLowerCase()}" 
            class="trip-sort__input  visually-hidden" 
            type="radio" 
            name="trip-sort" 
            value="sort-${sortItem.name.toLowerCase()}"
            ${isChecked ? `checked` : ``}
          />
          <label class="trip-sort__btn" for="sort-${sortItem.name.toLowerCase()}">
            ${sortItem.name}
            
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

export const createTripSort = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems.map((it) => createSortItemMarkup(it, false)).join(`\n`)}
    </form>`
  );
};
