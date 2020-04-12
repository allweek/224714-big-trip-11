export const createOptionsMarkup = (event) => {
  if (event) {
    const options = event
      .slice(0, 3)
      .map((it) =>
        `<li class="event__offer">
            <span class="event__offer-title">${it.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
        </li>`
      ).join(`\n`);
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

