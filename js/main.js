import show from './utils/show';
import getGreetingEl from './components/greeting';
import initGame from './utils/initialize-game';

initGame();

const greetingEl = getGreetingEl();
show(greetingEl);
