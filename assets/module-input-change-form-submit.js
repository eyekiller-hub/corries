import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  element.addEventListener('change', () => element.closest('form').submit());
};

function InputChangeFormSubmit(element, options) {
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

var elements = document.querySelectorAll('[data-module-input-change-form-submit]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-input-change-form-submit');

  InputChangeFormSubmit(element, options);
});
