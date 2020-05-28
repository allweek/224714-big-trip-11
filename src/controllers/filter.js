import FilterComponent from "../components/filter";
import {render, replace, RenderPosition} from "../utils/render";
import {FilterType} from "../const";


export default class Filter {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._setActiveFilterCheckbox = this._setActiveFilterCheckbox.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
    this._pointsModel.setFilterChangeHandlerInComponent(this._setActiveFilterCheckbox);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._filterComponent, container, RenderPosition.BEFOREEND);
    }
  }

  _setActiveFilterCheckbox() {
    this._activeFilterType = this._pointsModel._activeFilterType;
    this._filterComponent.setActiveFilterCheckbox(this._activeFilterType);
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
