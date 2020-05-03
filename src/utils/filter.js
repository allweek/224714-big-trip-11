import {FilterType} from "../const";

export const getPastEvents = (events) => {
  return events.filter((event) => event.dateStart < Date.now());
};

export const getFutureEvents = (events) => {
  return events.filter((event) => event.dateStart.getTime() > Date.now());
};

export const getFavoriteEvents = (events) => {
  return events.filter((event) => event.isFavorite);
};

export const getEventsByFilter = (events, filter) => {
  console.log(`getEventsByFilter in utils\filter.js`);
  switch (filter) {
    case FilterType.EVERYTHING:
      return events;
    case FilterType.FUTURE:
      return getFutureEvents(events);
    case FilterType.PAST:
      return getPastEvents(events);
  }

  return events;
};
