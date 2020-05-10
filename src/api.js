import Event from "./models/event";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
    this._headers = this._createHeaders();
  }

  _createHeaders() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return headers;
  }

  getEvents() {
    const headers = this._headers;
    return fetch(`https://11.ecmascript.pages.academy/big-trip/points`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Event.parseEvents);
  }

  updateEvent(id, data) {
    const headers = this._headers;
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data.toRAW()),
      headers,
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  getDestinations() {
    const headers = this._headers;
    return fetch(`https://11.ecmascript.pages.academy/big-trip/destinations`, {headers})
      .then(checkStatus)
      .then((response) => response.json());
  }

  getOffers() {
    const headers = this._headers;
    return fetch(`https://11.ecmascript.pages.academy/big-trip/offers`, {headers})
      .then(checkStatus)
      .then((response) => response.json());
  }
};

export default API;
