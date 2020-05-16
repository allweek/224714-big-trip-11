import AbstractComponent from "./abstract-component";

const createOfferMarkup = (eventOffers, dayCount) => {
  return eventOffers
    .map((eventOffer, index) => {
      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox visually-hidden" 
            id="event-offer-${dayCount}${index}" 
            type="checkbox" 
            name="event-offer"           
            value="${eventOffer.offer.title}"
            ${eventOffer.checked ? `checked` : ``}
          /> 
          <label 
            class="event__offer-label" 
            for="event-offer-${dayCount}${index}">
            <span class="event__offer-title">${eventOffer.offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${eventOffer.offer.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};


export default class Offers extends AbstractComponent {
  constructor(eventOptions, dayCount) {
    super();

    this._options = eventOptions;
    this._dayCount = dayCount;
  }

  getTemplate() {
    return createOfferMarkup(this._options, this._dayCount);
  }
}
