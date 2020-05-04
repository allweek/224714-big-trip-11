import moment from "moment";

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDateWithHypen = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const formatDuraion = (date) => {
  return moment(date).format(`dd:hh:mm`);
};

export const getMonthShortName = (date) => {
  return moment(date).format(`MMM`);
};
