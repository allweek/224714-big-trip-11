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

export const createFilters = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<h2 class="visually-hidden">Filter events</h2>
     <form class="trip-filters" action="#" method="get">
       ${filtersMarkup}  
      <!--<div class="trip-filters__filter">-->
        <!--<input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">-->
        <!--<label class="trip-filters__filter-label" for="filter-future">Future</label>-->
      <!--</div>-->
  <!---->
      <!--<div class="trip-filters__filter">-->
        <!--<input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">-->
        <!--<label class="trip-filters__filter-label" for="filter-past">Past</label>-->
      <!--</div>-->
  
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
