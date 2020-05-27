import AbstractSmartComponent from "./abstract-smart-component.js";
import DestinationComponent from "./destination";
import OffersComponent from "./offers";
import {encode} from "he";
import {PointTypes} from "../const";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {formatFromStringToDate, matchPointType, capitalizeWord} from "../utils/common";

const SHAKE_ANIMATION_TIMEOUT = 900;

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
  cancelButtonText: `Cancel`
};

const createCitiesListElem = (citiesList) => {
  return citiesList
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    })
    .join(`\n`);
};

const getAllPointTypes = (types) => {
  const pointTypesGroups = new Set();
  types.forEach((item) => {
    pointTypesGroups.add(item.group);
  });
  return pointTypesGroups;
};

const pointTypesGroups = getAllPointTypes(PointTypes);

const createPointTypeMarkup = (pointType, dayCount, isChecked) => {
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${pointType.name}-${dayCount}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${pointType.name}" ${isChecked ? `checked` : ``}
      />
      <label
        class="event__type-label
        event__type-label--${pointType.name}"
        for="event-type-${pointType.name}-${dayCount}">${capitalizeWord(pointType.name)}
      </label>
    </div>`
  );
};

const createPointTypeGroupsMarkup = (points, dayCount, checkedType) => {
  const fieldSetsMarkup = [];
  for (const group of pointTypesGroups) {
    const pointTypeMarkups = [];
    points.forEach((point) => {
      const isChecked = checkedType === point.name;
      if (point.group === group) {
        pointTypeMarkups.push(
            createPointTypeMarkup(point, dayCount, isChecked)
        );
      }
    });
    fieldSetsMarkup.push(
        `<fieldset class="event__type-group">
              <legend class="visually-hidden">${group}</legend>
              ${pointTypeMarkups.join(`\n`)}
        </fieldset>`
    );
  }
  return fieldSetsMarkup.join(`\n`);
};

const isValidFormData = (city, dateStart, dateEnd, price) => city && city.length && (dateStart instanceof Date) && (dateEnd instanceof Date) && (dateStart.getTime() <= dateEnd.getTime()) && (price && price >= 0);


const createPointEditTemplate = (currentPoint, offers, destinations, externalData, dayCount, isCreatingNew) => {

  const {destination, pointType, offersChecked, price, dateStart, dateEnd, isFavorite} = currentPoint;

  const city = destination ? encode(destination.name) : ``;

  const priceSanitized = price ? encode(price.toString()) : ``;

  const citiesList = destinations.map((destinationItem) => destinationItem.name);
  const citiesListMarkup = createCitiesListElem(citiesList);

  const pointNameToCapitalize = pointType.name ? capitalizeWord(pointType.name) : ``;

  const preposition = pointType.group === `Transfer` ? `to` : `in`;

  const offerGroupByType = offers.find((offerGroup) => offerGroup.type === pointType.name);
  const allOffers = offerGroupByType.offers;

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;
  const cancelButtonText = externalData.cancelButtonText;

  let offersMarkup = ``;
  if (offers) {
    const offersWithCheckedFlag = allOffers.map((offer) => {
      const index = offersChecked ? offersChecked.findIndex((offerChecked) => offerChecked.title === offer.title) : -1;
      if (index !== -1) {
        return {offer, checked: true};
      }

      return {offer, checked: false};
    });
    if (offersWithCheckedFlag) {
      const offersComponent = new OffersComponent(offersWithCheckedFlag, dayCount);
      offersMarkup = offersComponent.getTemplate();
    }
  }


  const pointTypesGroupsMarkup = createPointTypeGroupsMarkup(PointTypes, dayCount, pointType.name);


  const destinationMarkup = destination ? new DestinationComponent(destination).getTemplate() : ``;
  const isBlockSaveButton = !isValidFormData(city, dateStart, dateEnd, price);

  return (
    `<form class="trip-events__item event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${dayCount}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType.name}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-${dayCount}" type="checkbox">

          <div class="event__type-list">
            ${pointTypesGroupsMarkup}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${dayCount}">
            ${pointNameToCapitalize} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${dayCount}" type="text" name="event-destination" value="${city ? city : ``}" list="destination-list-${dayCount}">
          <datalist id="destination-list-${dayCount}">
            ${citiesListMarkup}
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
          <input class="event__input  event__input--price" id="event-price-${dayCount}" type="text" name="event-price" value="${priceSanitized}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton ? `
disabled` : ``}>${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${isCreatingNew ? cancelButtonText : deleteButtonText}</button>

        ${!isCreatingNew ? `<input id="event-favorite-${dayCount}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${dayCount}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>` : ``}
        
        ${!isCreatingNew ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ``}
      </header>
      
      ${offersMarkup ? `<section class="event__details">
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


export default class PointEdit extends AbstractSmartComponent {
  constructor(point, offers, destinations, dayCount, isCreatingNew) {
    super();

    this._point = point;
    this._currentPoint = JSON.parse(JSON.stringify(point));
    this._offers = offers;
    this._destinations = destinations;
    this._dayCount = dayCount;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._rollupButtonClickHandler = null;
    this._favoriteButtonHandler = null;
    this._externalData = DefaultData;
    this._flatpickrFrom = null;
    this._flatpickrTo = null;
    this._isCreatingNew = isCreatingNew;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createPointEditTemplate(
        this._currentPoint,
        this._offers,
        this._destinations,
        this._externalData,
        this._dayCount,
        this._isCreatingNew
    );
  }

  // восстановить слушатели после rerender
  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._favoriteButtonHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this.applyFlatpickr();
  }

  reset() {
    this._currentPoint = JSON.parse(JSON.stringify(this._point));

    this.rerender();
  }

  _flatPickrDestroy(flatpckr) {
    if (flatpckr) {
      flatpckr.destroy();
      flatpckr = null;
    }
  }

  applyFlatpickr() {
    this._flatPickrDestroy(this._flatpickrFrom);
    this._flatPickrDestroy(this._flatpickrTo);

    const dateStartElement = this.getElement().querySelector(`[name="event-start-time"]`);
    const dateEndElement = this.getElement().querySelector(`[name="event-end-time"]`);
    this._flatpickrFrom = flatpickr(dateStartElement, {
      allowInput: true,
      defaultDate: this._currentPoint.dateStart || `today`,
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      [`time_24hr`]: true
    });
    this._flatpickrTo = flatpickr(dateEndElement, {
      allowInput: true,
      defaultDate: this._currentPoint.dateEnd || `today`,
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      [`time_24hr`]: true,
      minDate: this._currentPoint.dateStart
    });
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const citiesList = this._destinations.map((destinationItem) => destinationItem.name);

    Array.from(element.querySelectorAll(`.event__type-group`)).forEach((fieldset) => {
      fieldset.addEventListener(`change`, (evt) => {
        const pointName = evt.target.value;
        this._currentPoint.pointType = matchPointType(pointName);

        this.rerender();
      });
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const cityFromInput = evt.target.value;
      if (!cityFromInput || citiesList.indexOf(cityFromInput) === -1) {
        evt.target.value = ``;
        return;
      }

      this._currentPoint.destination = Object.assign({}, this._destinations.find((destination) => destination.name === cityFromInput));

      this.rerender();
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      if (isNaN(evt.target.value)) {
        evt.target.value = ``;
      } else {
        evt.target.value = parseInt(evt.target.value, 10);
      }
      this._currentPoint.price = evt.target.value;
    });

    Array.from(element.querySelectorAll(`.event__offer-checkbox`)).forEach((offerCheckbox) => {
      offerCheckbox.addEventListener(`change`, (evt) => {
        const offerTitle = evt.target.value;

        const offerGroupByType = Object.assign({}, this._offers.find((offerGroup) => offerGroup.type === this._currentPoint.pointType.name));
        const offerByTitle = Object.assign({}, offerGroupByType.offers.find((offerGroup) => offerGroup.title === offerTitle));

        if (this._currentPoint.offersChecked) {
          // при редактировании
          const index = this._currentPoint.offersChecked.findIndex((offerChecked) => offerChecked.title === offerByTitle.title);
          if (index !== -1) {
            this._currentPoint.offersChecked.splice(index, 1);
          } else {
            this._currentPoint.offersChecked.push(offerByTitle);
          }
        } else {
          // при добавлении event
          this._currentPoint.offersChecked = [];
          this._currentPoint.offersChecked.push(offerByTitle);
        }
      });
    });

    element.querySelector(`[name="event-start-time"]`).addEventListener(`change`, (evt) => {
      this._currentPoint.dateStart = evt.target.value;
      this._flatpickrTo.set(`minDate`, this._currentPoint.dateStart);
    });

    element.querySelector(`[name="event-end-time"]`).addEventListener(`change`, (evt) => {
      this._currentPoint.dateEnd = evt.target.value;
    });

    // валидация формы и активация кнопки save
    element.addEventListener(`change`, () => {
      const formData = this.getData();
      const city = formData.get(`event-destination`);
      const dateStartString = formData.get(`event-start-time`);
      const dateStart = formatFromStringToDate(dateStartString);
      const dateEndString = formData.get(`event-end-time`);
      const dateEnd = formatFromStringToDate(dateEndString);
      const price = Number(formData.get(`event-price`));
      element.querySelector(`.event__save-btn`).disabled = !isValidFormData(city, dateStart, dateEnd, price);
    });
  }

  setSubmitHandler(handler) {
    this.getElement()
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    if (!this._isCreatingNew) {
      this.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);

      this._rollupButtonClickHandler = handler;
    }
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

  setButtonTextData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  shake() {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this.unblockEditForm();
    this.getElement().style.border = `1px solid red`;
    setTimeout(() => {
      this.getElement().animation = ``;

      this.setButtonTextData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  blockEditForm() {
    Array.from(this.getElement().querySelectorAll(`input`)).forEach((input) => {
      input.disabled = true;
    });
    this.getElement().querySelector(`.event__save-btn`).disabled = true;
  }

  unblockEditForm() {
    Array.from(this.getElement().querySelectorAll(`input`)).forEach((input) => {
      input.disabled = false;
    });
    this.getElement().querySelector(`.event__save-btn`).disabled = false;
  }

  removeFormErrorBorder() {
    this.getElement().style.border = ``;
  }
}
