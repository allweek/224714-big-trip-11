import AbstractComponent from "./abstract-component";

const createOptionsMarkup = (offersChecked) => {
  if (offersChecked && offersChecked.length) {
    const optionsMarkup = offersChecked
      .slice(0, 3)
      .map((option) =>
        `<li class="event__offer">
            <span class="event__offer-title">${option.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
        </li>`
      )
      .join(`\n`);

    return (
      `<h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
         ${optionsMarkup}
       </ul>`
    );
  }

  return ``;
};


export default class Options extends AbstractComponent {
  constructor(options) {
    super();

    this._options = options;
  }

  getTemplate() {
    return createOptionsMarkup(this._options);
  }
}
