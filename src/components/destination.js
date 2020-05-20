import AbstractComponent from "./abstract-component";

const createDestinationPhotoMarkup = (destinationPhotos) => {
  return destinationPhotos
    .map((photo) => {
      return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
    }).join(`\n`);
};

const createDestinationMarkup = (destination) => {
  return (
    `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
  
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createDestinationPhotoMarkup(destination.pictures)}           
            </div>
          </div>
        </section>
      </section>`
  );
};

export default class Destination extends AbstractComponent {
  constructor(destination) {
    super();

    this._destination = destination;
  }
  getTemplate() {
    return createDestinationMarkup(this._destination);
  }
}
