import {getRandomIntegerNumber} from "./temporary-functions-for-mocks";

const destinationDesriptions = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const DESCRIPTION_SENTENCES_COUNT = 5;

const generateDestinationDescription = () => {
  const descriptions = destinationDesriptions.split(`.`).map((it) => it.trim()).filter((it) => it !== ``);
  const count = getRandomIntegerNumber(1, DESCRIPTION_SENTENCES_COUNT);
  let destinationDescription = ``;
  let i = 1;
  while (i <= count) {
    let random = getRandomIntegerNumber(0, descriptions.length - 1);
    const randomSentence = descriptions.splice(random, 1);
    destinationDescription += randomSentence + `. `;
    i++;
  }
  return destinationDescription.trim();
};

const generateDestination = () => {
  return {
    description: generateDestinationDescription(),
    photo: `http://picsum.photos/248/152?r=${Math.random()}`
  };
};

export {generateDestination};
