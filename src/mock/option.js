const offersByEventsType = {
  flight: [
    {
      name: `luggage`,
      title: `Add luggage`,
      price: 50
    },
    {
      name: `comfort`, // ...class в одном месте фраза длиннее
      title: `Switch to comfort`,
      price: 100
    },
    {
      name: `meal`,
      title: `Add meal`,
      price: `100`
    },
    {
      name: `seats`,
      title: `Choose seats`,
      price: 5
    },
    {
      name: `train`,
      title: `Travel by train`,
      price: 40
    }
  ],
  drive: [
    {
      name: `car`,
      title: `Rent a car`,
      price: 200
    }
  ],
  [`check-in`]: [
    {
      name: `breakfast`,
      title: `Add breakfast`,
      price: 50
    }
  ],
  sightseeing: [
    {
      name: `tickets`,
      title: `Book tickets`,
      price: 40
    },
    {
      name: `lunch`,
      title: `Lunch in city`,
      price: 30
    }
  ],
  taxi: [
    {
      name: `uber`,
      title: `Order Uber`,
      price: 20
    }
  ]
};


const generateOptions = (event) => {
  return offersByEventsType[event] || null;
};

export {generateOptions};
