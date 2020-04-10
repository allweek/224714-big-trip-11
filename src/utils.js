const getRandomIntegerNumber = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomArrayElem = (array) => {
  const index = getRandomIntegerNumber(0, array.length - 1);
  return array[index];
};

export {getRandomIntegerNumber, getRandomArrayElem};


