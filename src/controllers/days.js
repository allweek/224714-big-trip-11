import DaysComponent from "../components/days";
import {render, RenderPosition} from "../utils/render";


export default class DaysController {
  constructor(container) {
    this._container = container;

    this._daysComponent = null;
  }

  render() {
    const container = this._container;

    this._daysComponent = new DaysComponent();

    render(this._daysComponent, container, RenderPosition.BEFOREEND);
  }

  clear() {
    this._daysComponent.clearChildrenElements();
  }
}
