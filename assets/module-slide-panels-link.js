import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  var new_options = Object.assign({}, options, { init: true });

  if (options.init) {
    return;
  }

  element.addEventListener('click', (event) => {
    event.preventDefault();
    Events.trigger('slide-panels-link:click', [options.html]);
  });

  element.setAttribute('data-module-slide-panels-link', JSON.stringify(new_options));
};

function SlidePanelsLink(element, options) {
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

Events.on('slide-panels:append', init);

function init() {
  var elements = document.querySelectorAll('[data-module-slide-panels-link]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-slide-panels-link');

    SlidePanelsLink(element, options);
  });
};
