const app = document.querySelector(`.app`);

export default (view) => {
  const main = app.querySelector(`.main`);
  if (main && main.parentElement === app) {
    app.removeChild(main);
    app.appendChild(view.element);
  }
};
