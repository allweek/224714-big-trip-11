export const createOptionsMarkup = (events) => {
  if (events && events.length) {
    const options = events
      .slice(0, 3)
      .map((event) =>
        `<li class="event__offer">
            <span class="event__offer-title">${event.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${event.price}</span>
        </li>`
      )
      .join(`\n`);
    return (
      `<h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
         ${options}
       </ul>`
    );
  } else {
    return ``;
  }
};
