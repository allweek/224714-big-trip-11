export const Cities = [`New York`, `Saint-Petersburg`, `Tokyo`, `Pisa`];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortItems = [
  {
    name: `Day`,
    sortable: false,
    nonClickable: true
  },
  {
    name: `Event`,
    sortable: false,
    nonClickable: false
  },
  {
    name: `Time`,
    sortable: true,
    nonClickable: false
  },
  {
    name: `Price`,
    sortable: true,
    nonClickable: false
  },
  {
    name: `Offers`,
    sortable: false,
    nonClickable: true
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
