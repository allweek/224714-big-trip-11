import {cities} from "../const";
import {eventTypes} from "../const";

const createCitiesListElem = (cities) => {
  return cities
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    }).join(`\n`);
};

const createOfferMarkup = (eventOptions) => {
  return eventOptions
    .map((option) => {
      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox  
            visually-hidden" 
            id="event-offer-${option.name}-1" 
            type="checkbox" 
            name="event-offer-${option.name}" 
            ${Math.random() > 0.5 ? `checked` : ``} 
          /> 
          <label 
            class="event__offer-label" 
            for="event-offer-${option.name}-1">
            <span class="event__offer-title">${option.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
          </label>
        </div>` // возможно изначально все офферы должны быть не выбраны (без checked)?
      );
    })
    .join(`\n`);
};

const getAllEventTypes = (eventTypes) => {
  const eventTypesGroups = new Set();
  eventTypes.forEach((item) => {
    if (!eventTypesGroups.has(item.group)) {
      eventTypesGroups.add(item.group);
    }
  });
  return eventTypesGroups;
};

const eventTypesGroups = getAllEventTypes(eventTypes);

const createEventTypeMarkup = (tt) => {
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${tt.name.toLowerCase()}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${tt.name.toLowerCase()}"
      />
      <label
        class="event__type-label
        event__type-label--${tt.name.toLowerCase()}"
        for="event-type-${tt.name.toLowerCase()}-1">${tt.name}
      </label>
    </div>`
  );
};

const createEventTypeGroupsMarkup = (eventTypes) => {
  const fieldsetsMarkup = [];
  for (const group of eventTypesGroups) {
    const eventTypeMarkups = [];
    eventTypes.forEach((item) => {
      if (item.group === group) {
        eventTypeMarkups.push(
            createEventTypeMarkup(item)
        );
      }
    });
    fieldsetsMarkup.push(
        `<fieldset class="event__type-group">
              <legend class="visually-hidden">${group}</legend>
              ${eventTypeMarkups.join(`\n`)}
        </fieldset>`
    );
  };
  return fieldsetsMarkup.join(`\n`);
};


export const createEventEditTemplate = (event) => {
  const {eventType, city, eventOptions, destination, price, timeStart, timeEnd} = event;

  const citiesList = createCitiesListElem(cities);

  const offersMarkup = eventOptions ? createOfferMarkup(eventOptions) : ``;

  const eventTypesGroupsMarkup = createEventTypeGroupsMarkup(eventTypes);

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
  
            <div class="event__type-list">
              ${eventTypesGroupsMarkup}
            </div>
          </div>
  
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventType} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${citiesList}
            </datalist>
          </div>
  
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
          </div>
  
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>
  
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
  
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
  
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
  
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
            <div class="event__available-offers">
              ${offersMarkup}
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};
