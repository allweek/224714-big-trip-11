import AbstractComponent from "./abstract-component";

const createOffersMarkup = (pointOffers, dayCount) => {
  return pointOffers
    .map((pointOffer, index) => {
      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox visually-hidden" 
            id="event-offer-${dayCount}${index}" 
            type="checkbox" 
            name="event-offer"           
            value="${pointOffer.offer.title}"
            ${pointOffer.checked ? `checked` : ``}
          /> 
          <label 
            class="event__offer-label" 
            for="event-offer-${dayCount}${index}">
            <span class="event__offer-title">${pointOffer.offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${pointOffer.offer.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};


export default class Offers extends AbstractComponent {
  constructor(pointOptions, dayCount) {
    super();

    this._options = pointOptions;
    this._dayCount = dayCount;
  }

  getTemplate() {
    return createOffersMarkup(this._options, this._dayCount);
  }
}
