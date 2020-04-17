export const createTripDay = (date, eventsList, index) => {
  const monthShortName = date.toLocaleString(`en`, {month: `short`});
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${date.toISOString().slice(0, 10)}">${monthShortName} ${date.getDate()}</time>
      </div>

      <ul class="trip-events__list">    
        ${eventsList}
      </ul>
    </li>`
  );
};
