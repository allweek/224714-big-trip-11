export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
