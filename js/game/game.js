import GameModel from '../views/game-model';
import GameView from '../views/game-view';
import getRandomData from '../data/random-data';

const randomData = getRandomData();


class GameScreen {
  constructor(data = randomData) {
    this.model = new GameModel(data);
    this.view = new GameView(this.model);
  }

  init(state) {

  }
}

export default new GameScreen();
