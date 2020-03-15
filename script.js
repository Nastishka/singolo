const makeLinkActive = (parentContainer, link) => {
  let currentActiveLink = document.querySelector(`${parentContainer} a.active`);
  if (currentActiveLink) {
    currentActiveLink.classList.remove('active');
  }
  link.classList.add('active');
}
const addEventListenersForLinks = (parentContainer, interactivityFunction) => {
  let navLinks = document.querySelectorAll(`${parentContainer} a`);
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (interactivityFunction) {
        interactivityFunction(link);
      }
      makeLinkActive(parentContainer, link);
    });
  });
}

const scrollPage = (selectedLink) => {
  let sectionId = selectedLink.hash;
  if (sectionId && sectionId.length > 1) {
    let section = document.querySelector(sectionId);
    if (section) {
      let headerHeight = document.querySelector('header.header').clientHeight;
      window.location.hash = sectionId;
      window.scroll(0, section.offsetTop - headerHeight);
      return;
    }
  }
  window.location.hash = '#';
  window.scroll(0, 0);
}

const rearangePortfolioImages = (selectedLink) => {
  if (!selectedLink.classList.contains('active')) {
    let imageList = document.querySelectorAll('.portfolio-image');
    imageList.forEach((image) => {
      let currentClassNames = image.className.match(/image\d+/);
      if (currentClassNames && currentClassNames.length == 1) {
        let currentClassName = currentClassNames[0];
        let imageId = parseInt(currentClassName.match(/\d+/)[0]);
        let imageIdNew = imageId < 12 ? ++imageId : 1;
        let newClassName = 'image' + imageIdNew;
        image.classList.add(newClassName);
        image.classList.remove(currentClassName);
      }
    });
  }
}

const fixForScrolling = () => {
  // scroll to the top of the section if hash tag exist
  if (window.location.hash && window.location.hash.length > 1) {
    let linkStub = { hash: window.location.hash };
    scrollPage(linkStub);
  }
}

activateCurrentNavLink = (parentContainer) => {
  let currentHash = window.location.hash || '#';
  let currentActiveLink = document.querySelector(
    `${parentContainer} a[href='${currentHash}']`
  );
  makeLinkActive(parentContainer, currentActiveLink)
}

document.addEventListener("DOMContentLoaded", () => {
  fixForScrolling();
  activateCurrentNavLink('.nav-container');
  addEventListenersForLinks('.nav-container', scrollPage);
  addEventListenersForLinks('.portfolio-action-links', rearangePortfolioImages);
});
