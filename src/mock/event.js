import {getRandomIntegerNumber, getRandomArrayElem} from "./temporary-functions-for-mocks";
import {eventTypes, cities} from "../const";
import {generateOptions} from "./option";
import {generateDestination} from "./destination";


const generateEvent = () => {
  const type = getRandomArrayElem(eventTypes);
  const dateStart = new Date();
  const dayRange = getRandomIntegerNumber(-40, 40);
  const day = dateStart.getDate();
  dateStart.setDate(day + dayRange);

  const hoursRange = getRandomIntegerNumber(0, 23);
  dateStart.setHours(hoursRange);

  const durationMinutes = getRandomIntegerNumber(15, 3000);
  const dateEnd = new Date(dateStart.getTime());
  dateEnd.setMinutes(dateEnd.getMinutes() + durationMinutes);


  const price = getRandomIntegerNumber(2, 60) * 10;

  return {
    eventType: type,
    city: getRandomArrayElem(cities),
    eventOptions: generateOptions(type.name.toLowerCase()),
    destination: generateDestination(),
    price,
    dateStart,
    dateEnd
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents};
