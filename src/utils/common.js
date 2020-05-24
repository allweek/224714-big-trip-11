import moment from "moment";
import {PointTypes} from "../const";

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDateWithHyphen = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const formatDateWithHyphenTime = (date) => {
  return moment(date).format(`YYYY-MM-DDTHH:mm`);
};

export const formatFromStringToDate = (date) => {
  return moment(date, `DD/MM/YY HH:mm`).toDate();
};

export const isSameDate = (oldData, newData) => {
  return ((formatDateWithHyphen(oldData.dateStart) === formatDateWithHyphen(newData.dateStart)) && (formatDateWithHyphen(oldData.dateEnd) === formatDateWithHyphen(newData.dateEnd)));
};

export const getDuration = (start, end) => {
  const diff = moment(end).diff(moment(start));
  return moment.duration(diff);
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getDurationFormatted = (start, end) => {
  const diff = moment(end).diff(moment(start));
  const duration = moment.duration(diff);

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  const daysFormatted = days !== 0 ? `${castTimeFormat(days)}D` : ``;
  const hoursFormatted = hours !== 0 ? `${castTimeFormat(hours)}H` : ``;
  const minutesFormatted = minutes !== 0 ? `${castTimeFormat(minutes)}M` : ``;
  return `${daysFormatted} ${hoursFormatted} ${minutesFormatted}`;
};

export const getMonthShortName = (date) => {
  return moment(date).format(`MMM`);
};

export const matchPointType = (pointName) => {
  return Object.assign({}, PointTypes.find((point) => point.name === pointName));
};

export const capitalizeWord = (string) => string.charAt(0).toUpperCase() + string.slice(1);
