import moment from "moment";

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDateWithHypen = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const formatFromStringToDate = (date) => {
  return moment(date, `DD/MM/YY HH:mm`).toDate();
}

export const isSameDate = (oldData, newData) => {
  return ((formatDateWithHypen(oldData.dateStart) === formatDateWithHypen(newData.dateStart)) && (formatDateWithHypen(oldData.dateEnd) === formatDateWithHypen(newData.dateEnd)));
}

export const getDuration = (start, end) => {
  const diff = moment(end).diff(moment(start));
  const duration = moment.duration(diff);

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  const daysFormatted = days !== 0 ? `${days}D` : ``;
  const hoursFormatted = hours !== 0 ? `${hours}H` : ``;
  const minutesFormatted = minutes !== 0 ? `${minutes}M` : ``;
  return `${daysFormatted} ${hoursFormatted} ${minutesFormatted}`;
};

export const getMonthShortName = (date) => {
  return moment(date).format(`MMM`);
};
