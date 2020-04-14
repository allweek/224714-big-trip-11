export const createTripDay = (day, eventsList, index) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="2019-03-18">MAR ${day}</time>
      </div>

      <ul class="trip-events__list">    
        ${eventsList}
      </ul>
    </li>`
  );
};
