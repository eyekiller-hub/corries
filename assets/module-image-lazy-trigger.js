import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import ResponsiveImages from './object-responsive-images';

function Self(element, events, options, module) {
  element.addEventListener(options.event, () => {
    ResponsiveImages.load_lazy(element);
  }, { once: true });
};

function ImageLazyTrigger(element, options) {
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

function init() {
  var elements = document.querySelectorAll('[data-module-image-lazy-trigger]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-image-lazy-trigger');

    ImageLazyTrigger(element, options);
  });
};
