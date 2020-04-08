import {generateOption} from "../components/event-option";

const generateDestination = () => {
  return {
    description: `dsafasf`,
    photos: `http://picsum.photos/248/152?r=${Math.random()}`
  };
};

const generateDestinations = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateDestination);
};

const generateEvent = () => {
  return {
    eventType: `drive`,
    city: `New York`,
    eventOptions: generateOption(),
    desination: generateDestinations(),
    //остальные данные их ТЗ
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents};
