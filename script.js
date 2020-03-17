const MODAL_WINDOW_SELECTOR = '.modal-window';
const ACTIVE_LINK_CLASS_NAME = 'active';
const VISIBLE_CLASS_NAME = 'visible';
const HASH_SIGN = '#';

const makeListItemActive = (parentContainer, target, deactivateOnSecondClick) => {
  let isCurrentListItemActive = target ?
    target.parentElement.classList.contains(ACTIVE_LINK_CLASS_NAME) : false;
  let currentActiveLink = document.querySelector(
    `${parentContainer} li.${ACTIVE_LINK_CLASS_NAME}`);
  if (currentActiveLink) {
    currentActiveLink.classList.remove(ACTIVE_LINK_CLASS_NAME);
  }
  if (target) {
    if (!(isCurrentListItemActive && deactivateOnSecondClick)) {
      target.parentElement.classList.add(ACTIVE_LINK_CLASS_NAME);
    }
  }
}

const addEventListenersForLinks = (parentContainer, interactivityFunction, deactivateOnSecondClick) => {
  let navLinks = document.querySelectorAll(`${parentContainer} a`);
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (interactivityFunction) {
        interactivityFunction(link);
      }
      makeListItemActive(parentContainer, link, deactivateOnSecondClick);
    });
  });
}

const addEventListenerForFormSubmit = (formId, submitAction) => {
  let form = document.querySelector(`#${formId}`);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitAction(e.target);
  });
}

const addEventListenerForModalWindow = () => {
  let modalWindow = document.querySelector(MODAL_WINDOW_SELECTOR);
  let closeBtns = document.querySelectorAll(`${MODAL_WINDOW_SELECTOR}-close`);

  closeBtns.forEach(closeBtn => {
    closeBtn.addEventListener('click', function (e) {
      modalWindow.classList.remove(VISIBLE_CLASS_NAME);
    });
  });

  window.addEventListener('click', function (e) {
    if (e.target === modalWindow) {
      modalWindow.classList.remove(VISIBLE_CLASS_NAME);
    }
  });
}

const openModalWindow = (header, content) => {
  let modalWindow = document.querySelector(MODAL_WINDOW_SELECTOR);
  let modalWindowHeader = document.querySelector(`${MODAL_WINDOW_SELECTOR}-header h3`);
  let modalWindowContent = document.querySelector(`${MODAL_WINDOW_SELECTOR}-content`);
  modalWindowHeader.innerHTML = header;
  modalWindowContent.innerHTML = '';
  modalWindowContent.appendChild(content);
  modalWindow.classList.add(VISIBLE_CLASS_NAME);
}

const generateContentForModalWindow = (quotesForm) => {
  let subject = quotesForm['subject'].value.trim();
  let subjectHeader = subject ? 'Subject:' : 'Without subject';
  let details = quotesForm['details'].value.trim();
  let detailsHeader = details ? 'Description:' : 'Without description';

  let appendDLitem = (dlElement, dt, dd, classNameForDD) => {
    let dtElement = document.createElement('dt');
    dlElement.appendChild(dtElement);
    if (dd) {
      dtElement.innerText = `${dt}`;
      let ddElement = document.createElement('dd');
      let preElement = document.createElement('pre');
      preElement.innerText = dd;
      ddElement.append(preElement);
      if (classNameForDD) {
        ddElement.setAttribute('class', classNameForDD);
      }
      dlElement.appendChild(ddElement);
    } else{
      dtElement.innerText = `${dt}`;
    }
  };

  let dlElement = document.createElement('dl');
  appendDLitem(dlElement, subjectHeader, subject);
  appendDLitem(dlElement, detailsHeader, details, 'description');
  return dlElement;
}

const onSubmitQuotesForm = (quotesForm) => {
  let content = generateContentForModalWindow(quotesForm);
  openModalWindow('The letter was sent', content);
  quotesForm.reset();
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
  window.location.hash = HASH_SIGN;
  window.scroll(0, 0);
}

const rearangePortfolioImages = (selectedLink) => {
  if (!selectedLink.parentElement.classList.contains(ACTIVE_LINK_CLASS_NAME)) {
    makeListItemActive('.portfolio-images');
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
  // scroll to the top of the section if hash tag exists
  if (window.location.hash && window.location.hash.length > 1) {
    let linkStub = { hash: window.location.hash };
    scrollPage(linkStub);
  }
}

const activateCurrentNavLink = (parentContainer) => {
  let currentHash = window.location.hash || HASH_SIGN;
  let currentActiveLink = document.querySelector(
    `${parentContainer} a[href='${currentHash}']`
  );
  makeListItemActive(parentContainer, currentActiveLink);
}

document.addEventListener("DOMContentLoaded", () => {
  fixForScrolling();
  activateCurrentNavLink('.nav-container');
  addEventListenersForLinks('.nav-container', scrollPage);
  addEventListenersForLinks('.portfolio-action-links', rearangePortfolioImages);
  addEventListenersForLinks('.portfolio-images', null, true);
  addEventListenerForFormSubmit('get-quote-form', onSubmitQuotesForm);
  addEventListenerForModalWindow();
});
