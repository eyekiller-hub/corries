import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';
import Swiper from 'swiper';

function Self(element, events, options, module) {};

function Container(element, events, options, module) {
  var swiper_options = {
    autoHeight: true
  };

  var swiper = new Swiper(element, swiper_options);

  swiper.on('slideChange', () => {
    if (swiper.activeIndex == 0) {
      return Events.trigger('slide-panels:change:inactive');
    }

    Events.trigger('slide-panels:change:active');
  });

  Events.on('accordion:button:click', () => {
    swiper.updateAutoHeight();
  });

  Events.on('slide-panels-link:click', (html) => {
    var slide_html = `<div class="swiper-slide">${html}</div>`;

    swiper.appendSlide(slide_html);
    swiper.slideNext();

    Events.trigger('slide-panels:append');
  });

  Events.on('module-slide-panels-back:click', () => {
    var index = swiper.activeIndex;

    swiper.slidePrev();

    setTimeout(() => swiper.removeSlide(index), 300);
  });
};

function SlidePanels(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    container: element.querySelectorAll('[data-ref-container]')
  };

  var module = {
    element: element,
    options: options,
    refs: refs
  };

  refs.self.forEach((element) => {
    var options = module.options;

    Self(element, events, options, module);
  });

  refs.container.forEach((element) => {
    var options = get_element_options(element, 'data-ref-container');

    Container(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-slide-panels]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-slide-panels');

  SlidePanels(element, options);
});
