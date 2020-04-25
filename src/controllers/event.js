import EventComponent from "../components/event";
import EventEditComponent from "../components/event-edit";
import {render, RenderPosition, replace} from "../utils/render";

export default class EventController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._eventComponent = null;
    this._eventEditComponent = null;
  }

  render(event, index) {
    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, false, index);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });
    this._eventEditComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.log(event);
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    render(this._eventComponent, this._container, RenderPosition.BEFOREEND);
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
  }
}