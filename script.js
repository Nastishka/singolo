const makeLinkActive = (parentContainer, link) => {
  let currentActiveLink = document.querySelector(`${parentContainer} a.active`);
  if (currentActiveLink){
    currentActiveLink.classList.remove('active')
  }
  link.classList.add('active');
}
const addEventListenersForLinks = (parentContainer, interactivityFunction) => {
  let navLinks = document.querySelectorAll(`${parentContainer} a`);
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      makeLinkActive(parentContainer, link);
      if (interactivityFunction){
        interactivityFunction(link);
      }
    });
  });
}

const scrollPage = (selectedLink) => {
  console.log('Put scrolling mechanism here');
}

const rearangePortfolioImages = (selectedLink) => {
  console.log('Put rearanging portfolio items here');
}


document.addEventListener("DOMContentLoaded", () => {
  addEventListenersForLinks('.nav-container', scrollPage);
  addEventListenersForLinks('.portfolio-action-links', rearangePortfolioImages);
});
