const MODAL_WINDOW_SELECTOR = '.modal-window';
const ACTIVE_ITEM_CLASS_NAME = 'active';
const VISIBLE_CLASS_NAME = 'visible';
const HASH_SIGN = '#';

const makeListItemActive = (parentContainer, target, deactivateOnSecondClick) => {
  let isCurrentListItemActive = target ?
    target.parentElement.classList.contains(ACTIVE_ITEM_CLASS_NAME) : false;
  let currentActiveLink = document.querySelector(
    `${parentContainer} li.${ACTIVE_ITEM_CLASS_NAME}`);
  if (currentActiveLink) {
    currentActiveLink.classList.remove(ACTIVE_ITEM_CLASS_NAME);
  }
  if (target) {
    if (!(isCurrentListItemActive && deactivateOnSecondClick)) {
      target.parentElement.classList.add(ACTIVE_ITEM_CLASS_NAME);
    }
  }
}

const addEventListenerOnWindowScroll = (navLinksSelector) => {
  let headerHeight = document.querySelector('header.header').clientHeight;
  let sectionStubs = [];
  let sections = document.querySelectorAll('main > section[id]');
  sectionStubs.push({
    startPosition: 0,
    endPosition: document.querySelector('aside.carousel').clientHeight / 3,
    relatedLink: document.querySelector(`${navLinksSelector} li a[href='#']`)
  });
  sections.forEach((section) => {
    let sectionId = section['id'];
    sectionStubs.push({
      startPosition: section.offsetTop - headerHeight,
      endPosition: section.offsetTop + section.clientHeight / 3,
      relatedLink: document.querySelector(`${navLinksSelector} li a[href='#${sectionId}']`)
    });
  });
  window.addEventListener('scroll', function (e) {
    console.log(e.target);
    let currentPosition = window.scrollY;
    sectionStubs.forEach((item) => {
      if (item.startPosition <= currentPosition && item.endPosition > currentPosition) {
        makeListItemActive(navLinksSelector, item.relatedLink);
      }
    });
  });
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

const addEventListenerOnFormSubmit = (formId, submitAction) => {
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

const addEventListenerOnSliderActionLinks = (sliderActionLinksSelector) => {
  let actionLinks = document.querySelectorAll(sliderActionLinksSelector);
  actionLinks.forEach((actionLink) => {
    actionLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (actionLink.classList.contains('left')) {
        showNewSlide(1, 'to-right', 'from-right');
      } else {
        showNewSlide(-1, 'to-left', 'from-left');
      }
    });
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
    } else {
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
  if (!selectedLink.parentElement.classList.contains(ACTIVE_ITEM_CLASS_NAME)) {
    makeListItemActive('.portfolio-images');
    let imagesContainer = document.querySelector('.portfolio-images');
    let removedChild = imagesContainer.removeChild(imagesContainer.firstElementChild);
    imagesContainer.appendChild(removedChild);
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

const showNewSlide = (slideOffset, directionForHiding, directionForShowing) => {
  let slides = document.querySelectorAll(".sliders > .slider");

  let isAnimationStarded = true;
  let currentSlideNumber = 0;
  let currentSlide = document.querySelector(`.sliders > .slider.${ACTIVE_ITEM_CLASS_NAME}`);
  if (currentSlide) {
    currentSlideNumber = parseInt(/\d+/.exec(/slider-\d+/.exec(currentSlide.className)[0])[0]);
    console.log(currentSlideNumber + 1);
    currentSlide.classList.add(directionForHiding);
    currentSlide.addEventListener('animationend', function (e) {
      this.classList.remove(ACTIVE_ITEM_CLASS_NAME, directionForHiding);
    });
  }

  let newSlideNumber = (currentSlideNumber - 1 + slideOffset + slides.length) % slides.length;
  console.log(newSlideNumber + 1);
  let newSlide = document.querySelector(`.sliders > .slider.slider-${newSlideNumber + 1}`);
  if (newSlide) {
    newSlide.classList.add('next', directionForShowing);
    newSlide.addEventListener('animationend', function (e) {
      this.classList.remove('next', directionForShowing);
      this.classList.add(ACTIVE_ITEM_CLASS_NAME);
      isAnimationStarded = false;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fixForScrolling();
  activateCurrentNavLink('.nav-container');
  addEventListenersForLinks('.nav-container', scrollPage);
  addEventListenersForLinks('.portfolio-action-links', rearangePortfolioImages);
  addEventListenersForLinks('.portfolio-images', null, true);
  addEventListenerOnFormSubmit('get-quote-form', onSubmitQuotesForm);
  addEventListenerOnSliderActionLinks('.slider-action');
  addEventListenerForModalWindow();
  addEventListenerOnWindowScroll('.nav-container');
});
