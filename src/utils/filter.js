import {FilterType} from "../const";

export const getPastPoints = (points) => {
  return points.filter((point) => point.dateEnd.getTime() < Date.now());
};

export const getFuturePoints = (points) => {
  return points.filter((point) => point.dateStart.getTime() > Date.now());
};

export const getPointsByFilter = (points, filter) => {
  switch (filter) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points);
    case FilterType.PAST:
      return getPastPoints(points);
  }

  return points;
};

