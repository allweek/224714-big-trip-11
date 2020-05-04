import moment from "moment";

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatTimeWithSlash = (date) => {
  return moment(date).format(`DD/MM/YY HH:MM`);
};

export const formatTimeFromMs = (ms) => {
  const minutes = ms / 1000 / 60;
  let days = castTimeFormat(Math.floor(minutes / 60 / 24));
  let hours = castTimeFormat(Math.floor(minutes / 60) % 24);
  let mins = castTimeFormat(minutes - days * 24 * 60 - hours * 60);

  days = days !== `00` ? `${days}D` : ``;
  hours = hours !== `00` ? `${hours}H` : ``;
  mins = mins !== `00` ? `${mins}M` : ``;
  return `${days} ${hours} ${mins}`;
};
