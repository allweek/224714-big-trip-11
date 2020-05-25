import PointComponent from "../components/point";
import PointEditComponent from "../components/point-edit";
import PointModel from "../models/point";
import {formatFromStringToDate} from "../utils/common";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {defaultPointType} from "../const";


const parseFormData = (form, offersList, destinations) => {
  const formData = form.getData();
  const dateStartString = formData.get(`event-start-time`);
  const dateStart = formatFromStringToDate(dateStartString);
  const dateEndString = formData.get(`event-end-time`);
  const dateEnd = formatFromStringToDate(dateEndString);

  const city = formData.get(`event-destination`);
  const destination = Object.assign({}, destinations.find((destinationItem) => destinationItem.name === city));
  const offersTitles = formData.getAll(`event-offer`);
  const checkedOffersList = offersList
    .reduce((checkedOffers, offersListItem) => {
      const offers = offersListItem.offers;
      offersTitles.forEach((offerTitle) => {
        const matchedOffer = offers.find((offer) => offerTitle === offer.title);
        if (matchedOffer) {
          checkedOffers.push(matchedOffer);
        }
      });
      return checkedOffers;
    }, []);

  return new PointModel({
    "base_price": Number(formData.get(`event-price`)),
    "date_from": dateStart ? dateStart : null,
    "date_to": dateEnd ? dateEnd : null,
    "destination": destination,
    "is_favorite": !!formData.get(`event-favorite`),
    "offers": checkedOffersList ? checkedOffersList : null,
    "type": formData.get(`event-type`)
  });
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  pointType: defaultPointType,
  destination: null,
  price: null,
  dateStart: new Date(),
  dateEnd: new Date(),
  isFavorite: false
};


export default class PointController {
  constructor(container, offers, destinations, onDataChange, onViewChange, dayCount) {
    this._container = container;
    this._dayCount = dayCount;
    this._offers = offers;
    this._destinations = destinations;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;
  }
  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    const isCreatingNew = point === EmptyPoint;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, this._offers, this._destinations, this._dayCount, isCreatingNew);

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._pointEditComponent.removeFormErrorBorder();
      const form = this._pointEditComponent;
      const data = parseFormData(form, this._offers, this._destinations);

      this._pointEditComponent.setButtonTextData({
        saveButtonText: `Saving...`,
      });


      this._pointEditComponent.blockEditForm();

      this._onDataChange(this, point, data, false);
    });

    this._pointComponent.setRollupButtonClickHandler(() => {

      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setFavoritesButtonClickHandler(() => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;

      this._onDataChange(this, point, newPoint, true);
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => {
      if (isCreatingNew) {
        // cancel button
        this._onDataChange(this, EmptyPoint, null, false);
      } else {
        // delete button
        this._pointEditComponent.setButtonTextData({
          deleteButtonText: `Deleting...`,
        });

        this._pointEditComponent.blockEditForm();

        this._onDataChange(this, point, null, false);
      }
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(this._pointComponent, this._container, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointComponent && oldPointEditComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._pointEditComponent, this._container, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._pointEditComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._pointEditComponent.shake();
  }

  unblockEditForm() {
    this._pointEditComponent.unblockEditForm();
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
    this._pointEditComponent.applyFlatpickr();
    this._mode = Mode.EDIT;
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEditComponent.reset();
    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._mode !== Mode.ADDING) {
        // при редактировании event
        this._replaceEditToPoint();
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      } else {
        // при добавлении event
        this._onDataChange(this, EmptyPoint, null, false);
      }
    }
  }
}
