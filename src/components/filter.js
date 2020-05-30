import AbstractSmartComponent from "./abstract-smart-component";

const FILTER_ID_PREFIX = `filter_`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterMarkup = (filter) => {
  const {name, isChecked, isDisabled} = filter;
  return (
    `<div class="trip-filters__filter">
       <input 
         id="filter-${name}" 
         class="trip-filters__filter-input visually-hidden" type="radio" 
         name="trip-filter" 
         value="${name}"  
         ${isChecked ? `checked` : ``}
         ${isDisabled ? `disabled` : ``} 
       />
       <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
     </div>`
  );
};

const createFilters = (filters) => {
  const filtersMarkup = Object.values(filters).map((filter) => createFilterMarkup(filter)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
       ${filtersMarkup}  
       <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`
  );
};

export default class Filter extends AbstractSmartComponent {
  constructor(filters) {
    super();

    this._filters = filters;
    this._filterChangeHandler = null;
  }

  getTemplate() {
    return createFilters(this._filters);
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
  }

  setFilterChangeHandler(handler) {
    const filtersForm = this.getElement();
    filtersForm.addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
    this._filterChangeHandler = handler;
  }

  setActiveFilterCheckbox(filterName) {
    this.rerender();
    this.getElement().querySelector(`#filter-${filterName}`).checked = true;
  }
}
