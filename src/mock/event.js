import {getRandomArrayElem} from "../utils";
import {getRandomIntegerNumber} from "../utils";
import {eventTypes, cities} from "../const";
import {generateOptions} from "./option";
import {generateDestination} from "./destination";
import {formatTime} from "../utils";


const generateEvent = () => {
  const type = getRandomArrayElem(eventTypes).name;

  const date = new Date();
  const dayRange = getRandomIntegerNumber(0, 3);
  const day = date.getDate();
  date.setDate(day + dayRange);

  const hourRange = getRandomIntegerNumber(12, 20);
  date.setHours(hourRange);

  const timeStart = formatTime(date);
  const duration = getRandomIntegerNumber(15, 300);

  const price = Math.floor(getRandomIntegerNumber(20, 600) / 10) * 10;

  return {
    eventType: type,
    city: getRandomArrayElem(cities),
    eventOptions: generateOptions(type.toLowerCase()),
    destination: generateDestination(),
    price,
    date,
    timeStart,
    duration
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents};
