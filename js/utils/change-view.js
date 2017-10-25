const app = document.querySelector(`.app`);

export default (view) => {
  const main = app.querySelector(`.main`);
  app.removeChild(main);
  app.appendChild(view.element);
};
