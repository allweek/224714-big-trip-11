import AbstractComponent from "./abstract-component";


const createFilterMarkup = (name, isChecked) => {
  return (
    `<div class="trip-filters__filter">
       <input 
         id="filter-${name}" 
         class="trip-filters__filter-input visually-hidden" type="radio" 
         name="trip-filter" 
         value="${name}"  
         ${isChecked ? `checked` : ``}      
       />
       <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
     </div>`
  );
};

const createFilters = (filters) => {
  const filtersMarkup = filters.map((filter, i) => createFilterMarkup(filter, i === 0)).join(`\n`);

  return (
    `<h2 class="visually-hidden">Filter events</h2>
     <form class="trip-filters" action="#" method="get">
       ${filtersMarkup}  
       <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilters(this._filters);
  }
}
