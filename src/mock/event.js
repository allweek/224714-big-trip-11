import {getRandomArrayElem} from "../utils";
import {eventTypes} from "../const";
import {generateOptions} from "./option";
import {generateDestination} from "./destination";
import {cities} from "../const";

const getTimeDiff = (timeStart, timeEnd) => {
  console.log(timeEnd - timeStart);
  return timeDiff;
};


const generateEvent = () => {
  const type = getRandomArrayElem(eventTypes);
  console.log();
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
