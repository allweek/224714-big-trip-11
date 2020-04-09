const cities = [`New York`, `Saint-Petersburg`, `Tokyo`, `Pisa`];

import {getRandomArrayElem} from "../utils";
import {eventTypes} from "../const";
import {generateOptions} from "./event-option";
import {generateDestination} from "./destination";

const generateEvent = () => {
  return {
    eventType: getRandomArrayElem(eventTypes),
    city: getRandomArrayElem(cities),
    eventOptions: generateOptions(),
    destination: generateDestination(),
    price: `100`,
    timeStart: `11:20`,
    timeEnd: `16:05`
    //остальные данные их ТЗ
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents};
