export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortItems = [
  {
    name: `day`,
    sortable: false
  },
  {
    name: `event`,
    sortable: true
  },
  {
    name: `time`,
    sortable: true
  },
  {
    name: `price`,
    sortable: true
  },
  {
    name: `offers`,
    sortable: false
  },
];

export const EventTypes = [
  {
    name: `taxi`,
    group: `Transfer`
  },
  {
    name: `bus`,
    group: `Transfer`
  },
  {
    name: `train`,
    group: `Transfer`
  },
  {
    name: `ship`,
    group: `Transfer`
  },
  {
    name: `transport`,
    group: `Transfer`
  },
  {
    name: `drive`,
    group: `Transfer`
  },
  {
    name: `flight`,
    group: `Transfer`
  },
  {
    name: `check-in`,
    group: `Activity`
  },
  {
    name: `sightseeing`,
    group: `Activity`
  },
  {
    name: `restaurant`,
    group: `Activity`
  }
];

export const defaultEventType = EventTypes[0];
