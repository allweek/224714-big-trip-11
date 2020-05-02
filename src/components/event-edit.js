import AbstractSmartComponent from "./abstract-smart-component.js";
import {Cities} from "../const";
import {EventTypes} from "../const";
import {castTimeFormat, formatTime} from "../utils/common.js";
import {generateOptions} from "../mock/option";
import {generateDestination} from "../mock/destination";

const createCitiesListElem = (citiesList) => {
  return citiesList
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    })
    .join(`\n`);
};

const createOfferMarkup = (eventOptions, dayCount) => {
  return eventOptions
    .map((option) => {
      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox visually-hidden" 
            id="event-offer-${option.name}-${dayCount}" 
            type="checkbox" 
            name="event-offer-${option.name}" 
            ${Math.random() > 0.5 ? `checked` : ``} 
          /> 
          <label 
            class="event__offer-label" 
            for="event-offer-${option.name}-${dayCount}">
            <span class="event__offer-title">${option.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
          </label>
        </div>` // возможно изначально все офферы должны быть не выбраны (без checked)?
      );
    })
    .join(`\n`);
};

const getAllEventTypes = (types) => {
  const eventTypesGroups = new Set();
  types.forEach((item) => {
    if (!eventTypesGroups.has(item.group)) {
      eventTypesGroups.add(item.group);
    }
  });
  return eventTypesGroups;
};

const eventTypesGroups = getAllEventTypes(EventTypes);

const capitalizeWord = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const createEventTypeMarkup = (eventType, dayCount) => {
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${eventType.name}-${dayCount}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType.name}"
      />
      <label
        class="event__type-label
        event__type-label--${eventType.name}"
        for="event-type-${eventType.name}-${dayCount}">${capitalizeWord(eventType.name)}
      </label>
    </div>`
  );
};

const createEventTypeGroupsMarkup = (events, dayCount) => {
  const fieldSetsMarkup = [];
  for (const group of eventTypesGroups) {
    const eventTypeMarkups = [];
    events.forEach((event) => {
      if (event.group === group) {
        eventTypeMarkups.push(
            createEventTypeMarkup(event, dayCount)
        );
      }
    });
    fieldSetsMarkup.push(
        `<fieldset class="event__type-group">
              <legend class="visually-hidden">${group}</legend>
              ${eventTypeMarkups.join(`\n`)}
        </fieldset>`
    );
  }
  return fieldSetsMarkup.join(`\n`);
};

const createDestinationMarkup = () => {
  const destination = generateDestination();
  return (
    `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
  
          <div class="event__photos-container">
            <div class="event__photos-tape">
              <img class="event__photo" src="${destination.photo}" alt="Event photo">           
            </div>
          </div>
        </section>
      </section>`
  );
};

const createEventEditTemplate = (event, dayCount) => {
  const {eventType, city, price, dateStart, dateEnd, isFavorite} = event;

  const citiesList = createCitiesListElem(Cities);

  const eventNameToCapitalize = capitalizeWord(eventType.name);

  const preposition = eventType.group === `Transfer` ? `to` : `in`;

  const eventOptions = generateOptions(eventType.name);
  const isOffersShown = eventOptions && eventOptions.length ? true : false;
  const offersMarkup = eventOptions ? createOfferMarkup(eventOptions, dayCount) : ``;


  const eventTypesGroupsMarkup = createEventTypeGroupsMarkup(EventTypes, dayCount);


  const getSlashedData = (date) => `${castTimeFormat(date.getDate())}/${castTimeFormat(date.getMonth() + 1)}/${(date.getFullYear() % 1000)}`;
  const dateStartText = getSlashedData(dateStart);
  const dateEndText = getSlashedData(dateEnd);
  const timeStartFormatted = formatTime(dateStart);
  const timeEndFormatted = formatTime(dateEnd);

  const destination = createDestinationMarkup();

  return (
    `<form class="trip-events__item event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${dayCount}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.name}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-${dayCount}" type="checkbox">

          <div class="event__type-list">
            ${eventTypesGroupsMarkup}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${dayCount}">
            ${eventNameToCapitalize} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${dayCount}" type="text" name="event-destination" value="${city}" list="destination-list-${dayCount}">
          <datalist id="destination-list-${dayCount}">
            ${citiesList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${dayCount}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${dayCount}" type="text" name="event-start-time" value="${dateStartText} ${timeStartFormatted}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${dayCount}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${dayCount}" type="text" name="event-end-time" value="${dateEndText} ${timeEndFormatted}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${dayCount}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${dayCount}" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-${dayCount}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${dayCount}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
        

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      
      ${isOffersShown ? `<section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>
      </section>` : ``}
      
      ${destination}
      
    </form>`
  );
};


export default class EventEdit extends AbstractSmartComponent {
  constructor(event, dayCount) {
    super();

    this._event = event;
    this._dayCount = dayCount;
    this._submitHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, this._dayCount);
  }

  // восстановить слушатели после rerender
  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this.rerender();
  }


  setSubmitHandler(handler) {
    this.getElement()
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    Array.from(element.querySelectorAll(`.event__type-group`)).forEach((fieldset) => {
      fieldset.addEventListener(`change`, (evt) => {
        const eventName = evt.target.value;
        const eventTypeObj = EventTypes.find((event) => event.name === eventName);
        this._event.eventType = {
          name: eventName,
          group: eventTypeObj.group
        };

        this.rerender();
      });
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, () => {
      // в дальнейшем скорее всего в зависимости от города, будет меняться объект destination
      this.rerender();
    });

  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, handler);
  }
}
