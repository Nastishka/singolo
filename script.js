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

let allowActivatingNavItemsOnScroll = true;

const addEventListenerOnWindowScroll = (navLinksSelector) => {
  window.addEventListener('scroll', function (e) {
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

    if (allowActivatingNavItemsOnScroll) {
      let currentPosition = window.scrollY;
      sectionStubs.forEach((item) => {
        if (item.startPosition <= currentPosition && item.endPosition > currentPosition) {
          makeListItemActive(navLinksSelector, item.relatedLink);
        }
      });
    }
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

const addEventListenerForModalWindow = (quotesFormSelector) => {
  let modalWindow = document.querySelector(MODAL_WINDOW_SELECTOR);
  let closeBtns = document.querySelectorAll(`${MODAL_WINDOW_SELECTOR}-close`);
  let quotesForm = document.querySelector(quotesFormSelector);

  let onModalWindowClose = () => {
    modalWindow.classList.remove(VISIBLE_CLASS_NAME);
    quotesForm.reset();
  }

  closeBtns.forEach(closeBtn => {
    closeBtn.addEventListener('click', onModalWindowClose);
  });

  window.addEventListener('click', function (e) {
    if (e.target === modalWindow) {
      onModalWindowClose();
    }
  });
}

const addEventListenerForSliderActionLinks = (sliderActionLinksSelector) => {
  let actionLinks = document.querySelectorAll(sliderActionLinksSelector);
  actionLinks.forEach((actionLink) => {
    actionLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (actionLink.classList.contains('left')) {
        showNewSlide(1, 'to-right', 'from-right', sliderActionLinksSelector);
      } else {
        showNewSlide(-1, 'to-left', 'from-left', sliderActionLinksSelector);
      }
    });
  });
}

const addEventListenerForPhones = (phonesSelector) => {
  let phonesAndScreens = document.querySelectorAll(`${phonesSelector}>.base, ${phonesSelector}>.screen`);
  phonesAndScreens.forEach((phoneOrScreen) => {
    phoneOrScreen.addEventListener('click', function (e) {
      let screen = this.parentNode.querySelector('.screen');
      screen.classList.toggle('off');
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
}

const scrollWindow = (xPos, yPos) => {
  allowActivatingNavItemsOnScroll = false;
  window.scroll(xPos, yPos);
  setTimeout(() => {
    allowActivatingNavItemsOnScroll = true;
  }, 1000);

}

const scrollPage = (selectedLink) => {
  let sectionId = selectedLink.hash;
  if (sectionId && sectionId.length > 1) {
    let section = document.querySelector(sectionId);
    if (section) {
      let headerHeight = document.querySelector('header.header').clientHeight;
      window.location.hash = sectionId;
      scrollWindow(0, section.offsetTop - headerHeight);
      return;
    }
  }
  window.location.hash = HASH_SIGN;
  scrollWindow(0, 0);
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

const switchOnPhonesScreen = (slide) => {
  let screens = slide.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('off');
  })
}

const showSliderNavLinks = (currentSlideClassName, sliderActionLinksSelector) => {
  let actionLinks = document.querySelectorAll(sliderActionLinksSelector);
  actionLinks.forEach((actionLink) => {
    if (currentSlideClassName.includes('slider-2')) {
      actionLink.classList.add('blue');
    } else {
      actionLink.classList.remove('blue');
    }
    actionLink.classList.remove('hidden');
  });
};

const hideSliderNavLinks = (sliderActionLinksSelector) => {
  let actionLinks = document.querySelectorAll(sliderActionLinksSelector);
  actionLinks.forEach((actionLink) => {
    actionLink.classList.add('hidden');
  });
};


const showNewSlide = (slideOffset, directionForHiding, directionForShowing, sliderActionLinksSelector) => {
  let slides = document.querySelectorAll(".sliders > .slider");
  let currentSlideNumber = 0;
  let currentSlide = document.querySelector(`.sliders > .slider.${ACTIVE_ITEM_CLASS_NAME}`);
  if (currentSlide) {
    currentSlideNumber = parseInt(/\d+/.exec(/slider-\d+/.exec(currentSlide.className)[0])[0]);
    currentSlide.classList.add(directionForHiding);
    let hideSlide = function (e) {
      this.classList.remove(ACTIVE_ITEM_CLASS_NAME, directionForHiding);
      currentSlide.removeEventListener('animationend', hideSlide);
    }
    currentSlide.addEventListener('animationend', hideSlide);
  }

  let newSlideNumber = (currentSlideNumber - 1 + slideOffset + slides.length) % slides.length;
  let newSlide = document.querySelector(`.sliders > .slider.slider-${newSlideNumber + 1}`);
  if (newSlide) {
    switchOnPhonesScreen(newSlide);
    newSlide.classList.add('next', directionForShowing);
    let showSlide = function (e) {
      this.classList.remove('next', directionForShowing);
      this.classList.add(ACTIVE_ITEM_CLASS_NAME);
      showSliderNavLinks(newSlide.className, sliderActionLinksSelector);
      newSlide.removeEventListener('animationend', showSlide);
    }
    newSlide.addEventListener('animationend', showSlide);
  }
}

const addEventListenerOnBurgerMenuClick = (burgerMenuSelector) => {

  let burgerMenu = document.querySelector(burgerMenuSelector);
  let nav =  burgerMenu.parentNode.querySelector('nav');
  let animatingElements = [
    burgerMenu,
    burgerMenu.parentNode.querySelector('.logo'),
    nav
  ];
  burgerMenu.addEventListener('click', function (e) {

    let isNavDisplayed = window.getComputedStyle(nav).width !== '0px';
    if (!isNavDisplayed &&
      (nav.classList.contains('animating') || nav.classList.contains('paused'))) {
      this.classList.add('off');
      animatingElements.forEach(element => {
        element.classList.remove('animating');
      });
      animatingElements.forEach(element => {
        element.classList.remove('paused');
      });
    }
    let logo = this.parentNode.querySelector('.logo');
    if (this.classList.contains('off')) {
      animatingElements.forEach(element => {
        element.classList.add('animating');
      });
    } else {
      animatingElements.forEach(element => {
        element.classList.remove('paused');
      });
    }
    this.classList.toggle('off');
    e.stopPropagation();
  });

  animatingElements.forEach(element => {
    element.addEventListener("animationiteration", function (e) {
      e.target.classList.add('paused');
    }, false);

    element.addEventListener("animationend", function (e) {
      e.target.classList.remove('animating');
    }, false);
  });

  window.addEventListener('click', function (e) {
    let isBurgerMenuDisplayed = window.getComputedStyle(burgerMenu).display  === 'block';
    let isNavDisplayed = window.getComputedStyle(nav).width !== '0px';
    if (isBurgerMenuDisplayed && isNavDisplayed) {
      burgerMenu.click();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fixForScrolling();
  activateCurrentNavLink('.nav-container');
  addEventListenersForLinks('.nav-container', scrollPage);
  addEventListenersForLinks('.portfolio-action-links', rearangePortfolioImages);
  addEventListenersForLinks('.portfolio-images', null, true);
  addEventListenerOnFormSubmit('get-quote-form', onSubmitQuotesForm);
  addEventListenerForModalWindow('#get-quote-form');
  addEventListenerForSliderActionLinks('.slider-action');
  addEventListenerOnWindowScroll('.nav-container');
  addEventListenerForPhones('.iphone');
  addEventListenerOnBurgerMenuClick('.burger-menu');
});
