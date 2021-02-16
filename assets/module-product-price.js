import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';
import money from './fn-money';

function Self(element, events, options, module) {};

function Retail(element, events, options, module) {
  Events.on(`productform:${module.options.product_id}:variantchange`, (variant) => {
    element.innerHTML = money(variant.price, module.options.money_format);
  });
};

function Compare(element, events, options, module) {
  Events
    .on(`productform:${module.options.product_id}:variantchange`, (variant) => {
      element.innerHTML = '';
      element.style.display = 'none';
    })
    .on(`productform:${module.options.product_id}:variantchangeonsale`, (variant) => {
      element.innerHTML = money(variant.compare_at_price, module.options.money_format);
      element.style.display = '';
    });
};

function ProductPrice(element, options) {
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

  refs.retail.forEach((element) => {
    var options = get_element_options(element, 'data-ref-retail');

    Retail(element, events, options, module);
  });

  refs.compare.forEach((element) => {
    var options = get_element_options(element, 'data-ref-compare');

    Compare(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-product-price]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-product-price');

  ProductPrice(element, options);
});
