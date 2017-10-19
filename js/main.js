import show from './utils/show';
import getGreetingView from './components/greeting';

const greetingView = getGreetingView();
show(greetingView.element);
