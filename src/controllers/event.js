import EventComponent from "../components/event";
import EventEditComponent from "../components/event-edit";
import EventModel from "../models/event";
import {formatFromStringToDate} from "../utils/common";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {defaultEventType, EventTypes} from "../const";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};


const parseFormData = (form, offersList, destinations) => {
  const formData = form.getData();
  const dateStartString = formData.get(`event-start-time`);
  const dateStart = formatFromStringToDate(dateStartString);
  const dateEndString = formData.get(`event-end-time`);
  const dateEnd = formatFromStringToDate(dateEndString);

  const city = formData.get(`event-destination`);
  const destination = destinations.find((destinationItem) => destinationItem.name === city);
  console.log(destination);
  const offersTitles = formData.getAll(`event-offer`);
  const checkedOffers = offersList
    .reduce((checkedOffersArray, offersListItem) => {
      const offers = offersListItem.offers;
      offersTitles.forEach((offerTitle) => {
        const matchedOffer = offers.find((offer) => offerTitle === offer.title);
        if (matchedOffer) {
          checkedOffersArray.push(matchedOffer);
        }
      });
      return checkedOffersArray;
    }, []);

  return new EventModel({
    "base_price": Number(formData.get(`event-price`)),
    "date_from": dateStart ? dateStart : null,
    "date_to": dateEnd ? dateEnd : null,
    "destination": destination,
    "is_favorite": !!formData.get(`event-favorite`),
    "offers": checkedOffers ? checkedOffers : null,
    "type": formData.get(`event-type`)
  });
};

export const EmptyEvent = {
  eventType: defaultEventType,
  destination: ``,
  price: null,
  dateStart: new Date(),
  dateEnd: new Date(),
  isFavorite: false
};

export default class EventController {
  constructor(container, offers, destinations, onDataChange, onViewChange, dayCount) {
    this._container = container;
    this._dayCount = dayCount;
    this._offers = offers;
    this._destinations = destinations;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._eventEditComponent = null;
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;

    const isCreatingNew = event === EmptyEvent;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, this._offers, this._destinations, this._dayCount, isCreatingNew);

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const form = this._eventEditComponent;
      const data = parseFormData(form, this._offers, this._destinations);

      this._eventEditComponent.setData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, event, data, false);
    });

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, event, newEvent, true);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._eventEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._onDataChange(this, event, null, false);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._eventComponent, this._container, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEventComponent && oldEventEditComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        render(this._eventEditComponent, this._container, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
  }

  shake() {
    console.log(`shake`)
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.border = `1px solid red`;

    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;
      this._eventEditComponent.getElement().style.border = ``;
    }, SHAKE_ANIMATION_TIMEOUT);

    this._eventEditComponent.setData({
      saveButtonText: `Save`,
      deleteButtonText: `Delete`,
    });
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    this._eventEditComponent.reset();

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }
}
