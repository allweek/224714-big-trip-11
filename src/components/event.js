const cities = [`New York`, `Saint-Petersburg`, `Tokyo`, `Pize`];

const destinationInfo = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];

const createPhoto = () => {
  return (`http://picsum.photos/248/152?r=${Math.random()}`);
};

export const createTripEvent = (event) => {
  const {eventType, city, eventOptions, desination} = event;
  console.log(event);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
                 <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
               </div>
        <h3 class="event__title">${eventType} to ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T14:30">14:30</time>
                 &mdash;
            <time class="event__end-time" datetime="2019-03-18T16:05">16:05</time>
          </p>
          <p class="event__duration">1H 35M</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">160</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            <li class="event__offer">
              <span class="event__offer-title">Rent a car</span>
                 &plus;
                 &euro;&nbsp;<span class="event__offer-price">200</span>
              </li>
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
    </li>`
  );
};
