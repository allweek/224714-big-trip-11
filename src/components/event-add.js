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

export const createEventAddTemplate = (event, addNew) => {
  const {eventType, city, eventOptions, destination, price, timeStart, timeEnd} = event;

  const citiesList = createCitiesListElem(cities);

  const offersMarkup = eventOptions ? createOfferMarkup(eventOptions) : ``;

  const eventTypesGroupsMarkup = createEventTypeGroupsMarkup(eventTypes);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            ${eventTypesGroupsMarkup}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
             ${eventType} to
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
          <datalist id="destination-list-1">
            ${citiesList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}            
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              <img class="event__photo" src="${destination.photo}" alt="Event photo">           
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};


