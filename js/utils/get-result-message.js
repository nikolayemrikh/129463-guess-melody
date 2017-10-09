export default (playerResult, otherPlayersResults) => {
  if (!Array.isArray(otherPlayersResults)) {
    throw new TypeError(`Second passed argument is not instance of Array`);
  }

  if (!playerResult) {
    throw new Error(`Object with player's result wasn't being passed`);
  }

  if (!playerResult.isWin) {
    if (playerResult.remainingTimeInSec === 0) {
      return `Время вышло! Вы не успели отгадать все мелодии`;
    } else if (playerResult.remainingNotes === 0) {
      return `У вас закончились все попытки. Ничего, повезёт в следующий раз!`;
    } else {
      throw new Error(`Player neither did win, nor did lost, something goes wrong...`);
    }
  } else {
    otherPlayersResults.push(playerResult.score);
    otherPlayersResults.sort((a, b) => b - a); // Сортируем в порядке убывания
    const positionNumber = otherPlayersResults.indexOf(playerResult.score) + 1;
    let percent = (otherPlayersResults.length - positionNumber) / otherPlayersResults.length;
    percent = percent.toFixed(2);
    return `Вы заняли ${positionNumber}-ое место из ${otherPlayersResults.length} \
игроков. Это лучше, чем у ${percent}% игроков`;
  }
};
