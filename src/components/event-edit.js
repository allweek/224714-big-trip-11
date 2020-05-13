import AbstractSmartComponent from "./abstract-smart-component.js";
import {Cities} from "../const";
import {EventTypes} from "../const";
import flatpickr from "flatpickr";
import OffersComponent from "./offer";
import "flatpickr/dist/flatpickr.min.css";

const createCitiesListElem = (citiesList) => {
  return citiesList
    .map((city) => {
      return (
        `<option value="${city}"></option>`
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

const createEventTypeMarkup = (eventType, dayCount, isChecked) => {
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${eventType.name}-${dayCount}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType.name}" ${isChecked ? `checked` : ``}
      />
      <label
        class="event__type-label
        event__type-label--${eventType.name}"
        for="event-type-${eventType.name}-${dayCount}">${capitalizeWord(eventType.name)}
      </label>
    </div>`
  );
};

const createEventTypeGroupsMarkup = (events, dayCount, checkedType) => {
  const fieldSetsMarkup = [];
  for (const group of eventTypesGroups) {
    const eventTypeMarkups = [];
    events.forEach((event) => {
      const isChecked = checkedType === event.name;
      if (event.group === group) {
        eventTypeMarkups.push(
            createEventTypeMarkup(event, dayCount, isChecked)
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

const createDestinationPhotoMarkup = (destinationPhotos) => {
  return destinationPhotos
    .map((photo) => {
      return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
    }).join(`\n`);
};

const createDestinationMarkup = (destination) => {
  return (
    `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
  
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createDestinationPhotoMarkup(destination.pictures)}           
            </div>
          </div>
        </section>
      </section>`
  );
};

const isValidFormData = (city, dateStart, dateEnd, price) => city && city.length && (dateStart instanceof Date) && (dateEnd instanceof Date) && (dateStart.getTime() <= dateEnd.getTime()) && (price && price >= 0);


const createEventEditTemplate = (event, offers, destinations, dayCount, isCreatingNew) => {
  const {eventType, city, price, dateStart, dateEnd, isFavorite, offersChecked, destination} = event;




  const citiesList = createCitiesListElem(Cities);

  const eventNameToCapitalize = eventType.name ? capitalizeWord(eventType.name) : ``;

  const preposition = eventType.group === `Transfer` ? `to` : `in`;

  const offerGroupByType = offers.find((offerGroup) => offerGroup.type === eventType.name);
  const allOffers = offerGroupByType.offers;

  const isOffersShown = !!(allOffers && allOffers.length);
  const offersWithCheckedFlag = allOffers.map((offer) => {
    const index = offersChecked.findIndex((offerChecked) => offerChecked.title === offer.title);
    if (index !== -1) {
      return {offer, checked: true};
    } else {
      return {offer, checked: false};
    }
  });
  const offersComponent = new OffersComponent(offersWithCheckedFlag, dayCount);
  const offersMarkup = allOffers ? offersComponent.getTemplate() : ``;


  const eventTypesGroupsMarkup = createEventTypeGroupsMarkup(EventTypes, dayCount, eventType.name);


  const destinationMarkup = destination ? createDestinationMarkup(destination) : ``;
  const isBlockSaveButton = !isValidFormData(city, dateStart, dateEnd, price);

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
          <input class="event__input  event__input--destination" id="event-destination-${dayCount}" type="text" name="event-destination" value="${city ? city : ``}" list="destination-list-${dayCount}">
          <datalist id="destination-list-${dayCount}">
            ${citiesList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${dayCount}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${dayCount}" type="text" name="event-start-time" value="">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${dayCount}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${dayCount}" type="text" name="event-end-time" value="">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${dayCount}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${dayCount}" type="text" name="event-price" value="${price ? price : ``}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton ? `
disabled` : ``}>Save</button>
        <button class="event__reset-btn" type="reset">${isCreatingNew ? `Cancel` : `Delete`}</button>

        ${!isCreatingNew ? `<input id="event-favorite-${dayCount}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${dayCount}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>` : ``}
        

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
      
      ${destinationMarkup}
      
    </form>`
  );
};


export default class EventEdit extends AbstractSmartComponent {
  constructor(event, offers, destinations, dayCount, isCreatingNew) {
    super();

    this._event = event;
    this._offers = offers;
    this._destinations = destinations;
    this._dayCount = dayCount;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._rollupButtonClickHandler = null;
    this._favoriteButtonHandler = null;
    // this._formDataChangeHandler = null;
    this._flatpickrFrom = null;
    this._flatpickrTo = null;
    this._isCreatingNew = isCreatingNew;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, this._offers, this._destinations, this._dayCount, this._isCreatingNew);
  }

  // восстановить слушатели после rerender
  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._favoriteButtonHandler);
    // this.setFormDataChangeHandler(this._formDataChangeHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    this.rerender();
  }

  _flatPickrDestroy(flatpckrObject) {
    if (flatpckrObject) {
      flatpckrObject.destroy();
      flatpckrObject = null;
    }
  }

  _applyFlatpickr() {
    this._flatPickrDestroy(this._flatpickrFrom);
    this._flatPickrDestroy(this._flatpickrTo);

    const dateStartElement = this.getElement().querySelector(`[name="event-start-time"]`);
    const dateEndElement = this.getElement().querySelector(`[name="event-end-time"]`);
    this._flatpickrFrom = flatpickr(dateStartElement, {
      allowInput: true,
      defaultDate: this._event.dateStart || `today`,
      dateFormat: `d/m/y H:i`
    });
    this._flatpickrTo = flatpickr(dateEndElement, {
      allowInput: true,
      defaultDate: this._event.dateEnd || `today`,
      dateFormat: `d/m/y H:i`
    });
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  getOffersData() {
    const offers = [];
    Array.from(this.getElement().querySelectorAll(`.event__offer-selector`)).filter((offerSelector) => offerSelector.querySelector(`.event__offer-checkbox`).checked === true).forEach((offerSelector) => {
      const title = offerSelector.querySelector(`.event__offer-checkbox`);
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    Array.from(element.querySelectorAll(`.event__type-group`)).forEach((fieldset) => {
      fieldset.addEventListener(`change`, (evt) => {
        const eventName = evt.target.value;
        this._event.eventType = Object.assign({}, EventTypes.find((event) => event.name === eventName));

        this.rerender();
      });
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const cityFromInput = evt.target.value;
      if (Cities.indexOf(cityFromInput) === -1) {
        evt.target.value = ``;
      }
      // TODO в дальнейшем скорее всего в зависимости от города, будет меняться объект destination
      // this.rerender();
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      if (isNaN(evt.target.value)) {
        evt.target.value = ``;
      }
    });

    // валидация формы и активация кнопки save
    element.addEventListener(`change`, () => {
      const {city, dateStart, dateEnd, price} = this.getData();
      element.querySelector(`.event__save-btn`).disabled = !isValidFormData(city, dateStart, dateEnd, price);
    });
  }

  setSubmitHandler(handler) {
    this.getElement()
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._rollupButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    if (!this._isCreatingNew) {
      this.getElement().querySelector(`.event__favorite-checkbox`)
        .addEventListener(`change`, handler);

      this._favoriteButtonHandler = handler;
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  // setFormDataChangeHandler(handler) {
  //   const element = this.getElement();
  //
  //   Array.from(element.querySelectorAll(`.event__type-group`)).forEach((fieldset) => {
  //     fieldset.addEventListener(`change`, () => {
  //       handler();
  //     });
  //   });
  //
  //   this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, handler);
  //
  //   this._formDataChangeHandler = handler;
  // }
}
