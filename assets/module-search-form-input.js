import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';
import debounce from './fn-debounce';

function Self(element, events, options, module) {
  var clicked_element;

  document.addEventListener('mousedown', (event) => {
    clicked_element = event.target;
  });

  document.addEventListener('mouseup', (event) => {
    clicked_element = null;
  });

  element.addEventListener('focusin', (event) => {
    Events.trigger(`search-form-input:${options.id}:focusin`, [event]);
  });

  element.addEventListener('focusout', () => {
    Events.trigger(`search-form-input:${options.id}:focusout`, [clicked_element]);
  });

  element.addEventListener('keyup', debounce(() => {
    if (element.value) {
      Events.trigger(`search-form-input:${options.id}:change`, [element.value]);
    } else {
      Events.trigger(`search-form-input:${options.id}:empty`);
    }
  }, 250));
};

function SearchFormInput(element, options) {
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

var elements = document.querySelectorAll('[data-module-search-form-input]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-search-form-input');

  SearchFormInput(element, options);
});
