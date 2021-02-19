import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  element.addEventListener('click', () => Events.trigger('module-slide-panels-back:click'));

  Events
    .on('slide-panels:change:inactive', hide)
    .on('slide-panels:change:active', show);

  function show() {
    element.classList.add('is-active');
  };

  function hide() {
    element.classList.remove('is-active');
  };
};

function SlidePanelsBack(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element]
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
};

init();

Events.on('slide-panels:change:active', init);

function init() {
  var elements = document.querySelectorAll('[data-module-slide-panels-back]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-slide-panels-back');

    SlidePanelsBack(element, options);
  });
};
