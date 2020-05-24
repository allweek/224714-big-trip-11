import {matchPointType} from "../utils/common";

export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.pointType = matchPointType(data[`type`]);
    this.city = data[`destination`][`name`];
    this.price = data[`base_price`];
    this.dateStart = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.dateEnd = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.destination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offersChecked = data[`offers`];
  }

  toRAW() {
    return {
      "base_price": this.price,
      "date_from": this.dateStart ? this.dateStart.toISOString() : null,
      "date_to": this.dateEnd ? this.dateEnd.toISOString() : null,
      "destination": this.destination,
      "id": this.id,
      "is_favorite": this.isFavorite,
      "offers": this.offersChecked,
      "type": this.pointType.name
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
