import {getRandomInteger} from "../utils";
import {eventTypes} from "../const";

const getRandomEvent = () => {
  const index = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[index];
};

const generateOption = () => {
  return {
    name: 'Add luggage',
    eventType: getRandomEvent(),
    price: '50'
    // dueDate: Math.random() > 0.5 ? new Date() : null,
  };
};

const generateOptions = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateOption);
};

console.log(generateOptions(2));

export {generateOption, generateOptions};
