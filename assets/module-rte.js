import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  var iframes = element.querySelectorAll('iframe');

  iframes.forEach((iframe) => {
    var wrapper = document.createElement('div');

    wrapper.classList.add('video-container');

    iframe.parentNode.insertBefore(wrapper, iframe);

    wrapper.appendChild(iframe);
  });
};

function Rte(element, options) {
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

document.addEventListener('shopify:section:load', init);

function init() {
  var elements = document.querySelectorAll('[data-module-rte]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-rte');

    Rte(element, options);
  });
};
