export const cities = [`New York`, `Saint-Petersburg`, `Tokyo`, `Pisa`];

export const filterNames = [`everything`, `future`, `past`];

export const sortItems = [
  {
    name: `Day`,
    sortable: false,
    [`non-clickable`]: true
  },
  {
    name: `Event`,
    sortable: false,
    [`non-clickable`]: false
  },
  {
    name: `Time`,
    sortable: true,
    [`non-clickable`]: false
  },
  {
    name: `Price`,
    sortable: true,
    [`non-clickable`]: false
  },
  {
    name: `Offers`,
    sortable: false,
    [`non-clickable`]: true
  },
];

export const eventTypes = [
  {
    name: `Taxi`,
    group: `Transfer`
  },
  {
    name: `Bus`,
    group: `Transfer`
  },
  {
    name: `Train`,
    group: `Transfer`
  },
  {
    name: `Ship`,
    group: `Transfer`
  },
  {
    name: `Transport`,
    group: `Transfer`
  },
  {
    name: `Drive`,
    group: `Transfer`
  },
  {
    name: `Flight`,
    group: `Transfer`
  },
  {
    name: `Check-in`,
    group: `Activity`
  },
  {
    name: `Sightseeing`,
    group: `Activity`
  },
  {
    name: `Restaurant`,
    group: `Activity`
  }
];


