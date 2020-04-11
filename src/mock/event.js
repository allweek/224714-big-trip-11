import {getRandomArrayElem} from "../utils";
import {eventTypes, cities} from "../const";
import {generateOptions} from "./option";
import {generateDestination} from "./destination";


const generateEvent = () => {
  const type = getRandomArrayElem(eventTypes).name;
  return {
    eventType: type,
    city: getRandomArrayElem(cities),
    eventOptions: generateOptions(type.toLowerCase()),
    destination: generateDestination(),
    price: 100, // пока поставил фиксированную
    timeStart: `11:20`,
    timeEnd: `16:05`
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents};
