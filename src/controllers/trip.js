import {render, remove, RenderPosition} from "../utils/render";
import {isSameDate, getDuration} from "../utils/common";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "../controllers/point";
import SortComponent from "../components/sort";
import DaysController from "../controllers/days";
import DayComponent from "../components/day";
import PreloaderComponent from "../components/preloader";
import NoPointsComponent from "../components/no-points";
import {SortType} from "../const";

const sortPoints = (points) => {
  const sortedPoints = [...points];
  return sortedPoints.sort((a, b)=> a.dateStart.getTime() - b.dateStart.getTime());
};

const renderPointsWithDays = (dayList, points, offers, destinations, onDataChange, onViewChange) => {
  const sortedPoints = sortPoints(points);
  let pointControllers = [];
  sortedPoints
    .reduce((pointsByDay, point) => {
      const date = new Date(point.dateStart);
      const lastDay = pointsByDay.length ? pointsByDay[pointsByDay.length - 1] : null;
      date.setHours(0, 0, 0, 0);
      if (!lastDay || lastDay.date.getTime() !== date.getTime()) {
        pointsByDay.push({date, points: [point]});
      } else {
        lastDay.points.push(point);
      }
      return pointsByDay;
    }, [])
    .forEach((pointsByDay, index) => {
      const date = pointsByDay.points[0].dateStart;
      const dayCount = index + 1;
      const day = new DayComponent(date, dayCount);
      render(day, dayList, RenderPosition.BEFOREEND);
      const pointsList = day.getElement().querySelector(`.trip-events__list`);
      pointControllers = [...pointControllers,
        ...(pointsByDay.points
          .map((point) => {
            const pointController = new PointController(pointsList, offers, destinations, onDataChange, onViewChange, dayCount);

            pointController.render(point, PointControllerMode.DEFAULT);

            return pointController;
          }))];
    });
  return pointControllers;
};

const renderPointsWithoutDays = (dayList, points, offers, destinations, onDataChange, onViewChange) => {
  const day = new DayComponent();
  render(day, dayList, RenderPosition.BEFOREEND);
  const pointsList = day.getElement().querySelector(`.trip-events__list`);

  return points.map((point) => {
    const pointController = new PointController(pointsList, offers, destinations, onDataChange, onViewChange, null);

    pointController.render(point, PointControllerMode.DEFAULT);

    return pointController;
  });
};

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  switch (sortType) {
    case SortType.EVENT:
      sortedPoints = points;
      break;
    case SortType.TIME:
      sortedPoints = points.sort((a, b) => (getDuration(b.dateStart, b.dateEnd)) - (getDuration(a.dateStart, a.dateEnd)));
      break;
    case SortType.PRICE:
      sortedPoints = points.sort((a, b) => b.price - a.price);
      break;
  }

  return sortedPoints;
};

export default class Trip {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._offers = [];
    this._destinations = [];
    this._api = api;

    this._pointControllers = [];
    this._sortComponent = new SortComponent();
    this._preloader = new PreloaderComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._setSortType = this._setSortType.bind(this);
    this._creatingPoint = null;
    this._showingPreloader = null;
    this._showingNoPoints = null;
    this._sortTypeBeforeCreatePoint = null;


    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  createPoint(newPointButton) {

    if (this._creatingPoint) {
      return;
    }

    this._newPointButton = newPointButton;

    this._onPointCreate();

    const dayListElement = this._container.getElement().querySelector(`.trip-days`);
    this._creatingPoint = new PointController(dayListElement, this._offers, this._destinations, this._onDataChange, this._onViewChange, 0);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);

    // если список пуст и создается первый event
    if (!document.contains(this._sortComponent.getElement())) {
      render(this._sortComponent, this._container.getElement(), RenderPosition.AFTERBEGIN);
    }
  }

  render() {
    const container = this._container.getElement();
    const points = this._pointsModel.getPoints();

    if (this._showingPreloader) {
      this.removePreloader();
    }

    this._daysController = new DaysController(container);
    this._daysController.render();

    if (!points.length) {
      this.showNoPoints();
    } else {
      this.removeNoPoints();
      render(this._sortComponent, container, RenderPosition.AFTERBEGIN);

      this._renderPoints(points);
    }
  }

  _renderPoints(points) {
    const dayList = this._container.getElement().querySelector(`.trip-days`);

    this._daysController.clear();
    this._offers = this._pointsModel.getOffers();
    this._destinations = this._pointsModel.getDestinations();

    let newPoints;
    if (this._sortComponent.getSortType() === SortType.EVENT) {
      newPoints = renderPointsWithDays(dayList, points, this._offers, this._destinations, this._onDataChange, this._onViewChange);
    } else {
      newPoints = renderPointsWithoutDays(dayList, points, this._offers, this._destinations, this._onDataChange, this._onViewChange);
    }

    this._pointControllers = this._pointControllers.concat(newPoints);
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
  }

  _onViewChange() {
    this._pointControllers.forEach((pointController) => pointController.setDefaultView());
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
      this._newPointButton.disabled = false;
    }
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
  }

  _onDataChange(pointController, oldData, newData, stayOnAddingMode) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        // при создании нового event пришли пустые данные
        pointController.destroy();
        this._setSortType(this._sortTypeBeforeCreatePoint);
        pointController.unblockEditForm();
        this._newPointButton.disabled = false;
      } else {
        // добавление нового event
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            this._setSortType(this._sortTypeBeforeCreatePoint);
            pointController.unblockEditForm();
            this._newPointButton.disabled = false;
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      // удаление существующего event
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
          pointController.unblockEditForm();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      // изменение event
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);
          if (isSuccess) {
            if (isSameDate(oldData, newData)) {
              // если дата не меняется перерисовываем только данное событие
              if (stayOnAddingMode) {
                // изменение данных без закрытия и сохранения формы, например добавление в избранное
                pointController.render(newData, PointControllerMode.ADDING);
              } else {
                // изменение данных с закрытием формы
                pointController.render(pointModel, PointControllerMode.DEFAULT);
              }
            } else {
              // если дата меняется, пересовываем весь список
              this._updatePoints();
            }
            pointController.unblockEditForm();
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onFilterChange() {
    this._creatingPoint = null;
    this._updatePoints();
  }

  _onPointCreate() {
    if (this._showingNoPoints) {
      this.removeNoPoints();
    }
    this._onViewChange(); // закрыть все открытые формы

    this._pointsModel.setEverythingFilter(); // снять фильтры

    this._sortTypeBeforeCreatePoint = this._sortComponent.getSortType();
    this.setDefaultSortType(); // сброс сортировки
  }

  _onSortTypeChange(sortType) {
    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), sortType);

    this._removePoints();
    this._renderPoints(sortedPoints);
  }

  _setSortType(sortType) {
    this._sortComponent.setSortType(sortType);
    this._onSortTypeChange(sortType);
  }

  setDefaultSortType() {
    this._setSortType(SortType.EVENT);
  }

  showPreloader() {
    const container = this._container.getElement();
    this._showingPreloader = true;

    render(this._preloader, container, RenderPosition.BEFOREEND);
  }

  removePreloader() {
    remove(this._preloader);
    this._showingPreloader = false;
  }

  showNoPoints() {
    const container = this._container.getElement();
    this._showingNoPoints = true;

    render(this._noPointsComponent, container, RenderPosition.BEFOREEND);
  }

  removeNoPoints() {
    remove(this._noPointsComponent);
    this._showingNoPoints = false;
  }
}
