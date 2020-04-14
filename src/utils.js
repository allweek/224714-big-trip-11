const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatTimeFromMin = (minutes) => {
  console.log(minutes);
  let days = castTimeFormat(Math.floor(minutes / 60 / 24));
  let hours = castTimeFormat(Math.floor(minutes / 60) % 24);
  let mins = castTimeFormat(minutes - days * 24 * 60 - hours * 60);

  days = days !== `00` ? `${days}D` : ``;
  hours = hours !== `00` ? `${hours}H` : ``;
  mins = mins !== `00` ? `${mins}M` : ``;
  return `${days} ${hours} ${mins}`;
};


export {formatTime, formatTimeFromMin, castTimeFormat};


