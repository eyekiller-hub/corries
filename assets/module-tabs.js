import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {};

function Button(element, events, options, module) {
  element.addEventListener('click', (event) => {
    event.preventDefault();
    events.trigger('button:click');
    events.trigger(`button:click:${options.id}`);
  });

  events.on('button:click', () => {
    if (options.active_class) {
      element.classList.remove(...options.active_class.split(' '));
    }
  });

  events.on(`button:click:${options.id}`, () => {
    if (options.active_class) {
      element.classList.add(...options.active_class.split(' '));
    }
  });
};

function Panel(element, events, options, module) {
  events.on('button:click', () => {
    element.style.display = 'none';
  });

  events.on(`button:click:${options.id}`, () => {
    element.style.display = 'block';
  });
};

function Tabs(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    button: element.querySelectorAll('[data-ref-button]'),
    panel: element.querySelectorAll('[data-ref-panel]')
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

  refs.button.forEach((element) => {
    var options = get_element_options(element, 'data-ref-button');

    Button(element, events, options, module);
  });

  refs.panel.forEach((element) => {
    var options = get_element_options(element, 'data-ref-panel');

    Panel(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-tabs]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-tabs');

  Tabs(element, options);
});
