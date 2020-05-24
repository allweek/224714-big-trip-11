import {FilterType} from "../const";

export const getPastEvents = (events) => {
  return events.filter((event) => event.dateEnd < Date.now());
};

export const getFutureEvents = (events) => {
  return events.filter((event) => event.dateStart.getTime() > Date.now());
};

export const getEventsByFilter = (events, filter) => {
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

