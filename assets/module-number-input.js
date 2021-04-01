import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {};

function Input(element, events, options, module) {
  events
    .on('decrement:click', () => {
      update(+(element.value) - 1);
    })
    .on('increment:click', () => {
      update(+(element.value) + 1);
    });

  function update(value) {
    var min = +(element.min);
    var max = +(element.max) || Infinity;

    element.value = Math.max(min, Math.min(value, max));
    element.dispatchEvent(new Event('change'));
  };
};

function Decrement(element, events, options, module) {
  element.addEventListener('click', () => events.trigger('decrement:click'));
};

function Increment(element, events, options, module) {
  element.addEventListener('click', () => events.trigger('increment:click'));
};

function NumberInput(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    number_input: element.querySelectorAll('[data-ref-number-input]'),
    decrement: element.querySelectorAll('[data-ref-decrement]'),
    increment: element.querySelectorAll('[data-ref-increment]')
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

  refs.number_input.forEach((element) => {
    var options = get_element_options(element, 'data-ref-number-input');

    Input(element, events, options, module);
  });

  refs.decrement.forEach((element) => {
    var options = get_element_options(element, 'data-ref-decrement');

    Decrement(element, events, options, module);
  });

  refs.increment.forEach((element) => {
    var options = get_element_options(element, 'data-ref-increment');

    Increment(element, events, options, module);
  });
};

init();

function init() {
  var elements = document.querySelectorAll('[data-module-number-input]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-number-input');

    NumberInput(element, options);
  });
};
