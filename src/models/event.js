export default class Event {
  constructor(data) {
    this.id = data[`id`];
    this.eventType = {
      name: data[`type`],
      group: `Transfer`
    };
    this.city = data[`destination`][`name`];
    this.price = data[`base_price`];
    this.dateStart = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.dateEnd = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      "base_price": this.price,
      "date_from": this.dateStart ? this.dateStart.toISOString() : null,
      "date_to": this.dateStart ? this.dateStart.toISOString() : null,
      "destination": `Destination`,
      "id": this.id,
      "is_favorite": this.isFavorite,
      "offers": `Offers`,
      "type": this.eventType.name
    };
  }

  static parseEvent(data) {
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}
