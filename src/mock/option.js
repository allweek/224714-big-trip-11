import {getRandomArrayElem} from "../utils";

const offersByEventsType = {
  flight: [
    {
      name: `Add luggage`,
      price: 50
    },
    {
      name: `Switch to comfort`,
      price: 100
    },
    {
      name: `Add meal`,
      price: `100`
    },
    {
      name: `Choose seats`,
      price: 5
    },
    {
      name: `Travel by train`,
      price: 40
    }
  ],
  drive: [
    {
      name: `Rent a car`,
      price: 200
    }
  ],
  [`check-in`]: [
    {
      name: `Add breakfast`,
      price: 50
    }
  ],
  sightseeing: [
    {
      name: `Book tickets`,
      price: 40
    },
    {
      name: `Lunch in city`,
      price: 30
    }
  ],
  taxi: [
    {
      name: `Order Uber`,
      price: 20
    }
  ]
};


const generateOptions = (event) => {
  return offersByEventsType[event] || null;
};

// const generateOptions = () => {
//   return new Array()
//     .fill(``)
//     .map(generateOption(`flight`));
// };
//
// console.log(generateOptions());
//
export {generateOptions};
