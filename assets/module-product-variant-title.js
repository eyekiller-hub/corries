import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  Events.on('productform:variantchange', (variant) => {
    element.innerHTML = variant.title;
  });
};

function ProductVariantTitle(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    retail: element.querySelectorAll('[data-ref-retail]'),
    compare: element.querySelectorAll('[data-ref-compare]')
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

var elements = document.querySelectorAll('[data-module-product-variant-title]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-product-variant-title');

  ProductVariantTitle(element, options);
});
