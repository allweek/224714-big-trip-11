import AbstractComponent from "./abstract-component";
import {getMonthShortName} from "../utils/common";


const createTripInfoMain = (points) => {
  let max = -Infinity;
  let min = Infinity;
  let newestPoint;
  let oldestPoint;
  points.forEach((point) => {
    if (point.dateEnd.getTime() > max) {
      newestPoint = point;
      max = point.dateEnd.getTime();
    }
    if (point.dateStart.getTime() < min) {
      oldestPoint = point;
      min = point.dateStart.getTime();
    }
  });
  const pointsLength = points.length;
  const oldestPointCity = oldestPoint ? oldestPoint.city : ``;
  let newestPointCity = !newestPoint || pointsLength === 1 ? `` : newestPoint.city;

  let citySeparator = ``;
  switch (pointsLength) {
    case 1:
      citySeparator = ``;
      break;
    case 2:
      citySeparator = `&nbsp;&mdash;&nbsp;`;
      if (newestPointCity === oldestPointCity) {
        newestPointCity = ``;
        citySeparator = ``;
      }
      break;
    case 3:
      const middleCityPoint = points.find((point) => ((point.id !== oldestPoint.id) && (point.id !== newestPoint.id)));
      citySeparator = `&mdash;&nbsp;${middleCityPoint.city}&nbsp;&mdash;`;
      break;
    default:
      citySeparator = `&mdash;&nbsp;...&nbsp;&mdash;`;
  }

  const oldestPointMonth = oldestPoint ? getMonthShortName(oldestPoint.dateStart) : ``;
  const oldestPointDay = oldestPoint ? oldestPoint.dateStart.getDate() : ``;
  const newestPointMonth = newestPoint ? getMonthShortName(newestPoint.dateEnd) : ``;
  const newestPointMonthVisible = newestPointMonth === oldestPointMonth ? `` : `${newestPointMonth}&nbsp`;
  const newestPointDay = newestPoint ? newestPoint.dateEnd.getDate() : ``;

  return (`
      <h1 class="trip-info__title">${oldestPointCity} ${citySeparator} ${newestPointCity}</h1>

      <p class="trip-info__dates">${oldestPointMonth} ${oldestPointDay}&nbsp;&mdash;&nbsp;${newestPointMonthVisible}${newestPointDay}</p>`
  );
};


const calculateTotalSum = (points) => {
  return points.reduce((accumulator, point) => {
    let offersSum = 0;
    if (point.offersChecked.length) {
      offersSum = point.offersChecked.reduce((sum, offer) => {
        return sum + offer.price;
      }, 0);
    }
    const pointSum = point.price + offersSum;
    return accumulator + pointSum;
  }, 0);
};


const createTripInfo = (points) => {
  const tripTotalSum = points && points.length ? calculateTotalSum(points) : 0;
  const tripInfoMain = points && points.length ? createTripInfoMain(points) : ``;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${tripInfoMain}
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalSum}</span>
      </p>     
    </section>`
  );
};


export default class TripInfo extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return createTripInfo(this._points);
  }
}
