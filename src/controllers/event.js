import EventComponent from "../components/event";
import EventEditComponent from "../components/event-edit";
import {render, RenderPosition, replace, remove} from "../utils/render";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {};

export default class EventController {
  constructor(container, onDataChange, onViewChange, dayCount) {
    this._container = container;
    this._dayCount = dayCount;
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

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, this._dayCount);

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._eventEditComponent.getData();
      this._onDataChange(this, event, data);
    });

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setFavoritesButtonClickHandler((evt) => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, event, null);
    });

    if (oldEventComponent && oldEventEditComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
      this._replaceEditToEvent();
    } else {
      render(this._eventComponent, this._container, RenderPosition.BEFOREEND);
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
