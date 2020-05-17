import AbstractComponent from "./abstract-component";


const createNoEventsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};


export default class Preloader extends AbstractComponent {
  getTemplate() {
    return createNoEventsTemplate();
  }
}
