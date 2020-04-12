const getRandomIntegerNumber = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomArrayElem = (array) => {
  const index = getRandomIntegerNumber(0, array.length - 1);
  return array[index];
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 24);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatTimeFromMin = (minutes) => {
  let hours = castTimeFormat(Math.floor(minutes / 60));
  hours = hours !== `00` ?  hours + `H` : ``;
  const min = castTimeFormat(minutes % 60);

  return `${hours} ${min}M`;
};


export {getRandomIntegerNumber, getRandomArrayElem, formatTime, formatTimeFromMin, castTimeFormat};


