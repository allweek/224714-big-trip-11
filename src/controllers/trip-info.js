import TripInfoComponent from "../components/trip-info";
import {render, replace, RenderPosition} from "../utils/render";


export default class TripInfo {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allPoints = this._pointsModel.getPointsAll();

    const oldComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoComponent(allPoints);

    if (oldComponent) {
      replace(this._tripInfoComponent, oldComponent);
    } else {
      render(this._tripInfoComponent, container, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
