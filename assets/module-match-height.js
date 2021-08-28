import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';

function Self(element, events, options, module) {
  setTimeout(() => {
    if (options.context == 'source') {
      Events.trigger(`matchheight:${options.id}`, [element.offsetHeight]);
    }
  });

  if (options.context == 'target') {
    Events.on(`matchheight:${options.id}`, (sourceHeight) => {
      var style_key = options.min ? 'minHeight' : 'height';
      element.style[style_key] = `${sourceHeight}px`;
    });
  }
};

function MatchHeight(element, options) {
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

var elements = document.querySelectorAll('[data-module-match-height]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-match-height');

  MatchHeight(element, options);
});
