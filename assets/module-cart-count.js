import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';

function Self(element, events, options, module) {
  Events
    .on('cartchange:success', render)
    .on('productform:success', render);

  function render(res) {
    if (res.item_count) {
      return element.innerHTML = res.item_count;
    }

    fetch('/cart.js', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((res) => {
        element.innerHTML = res.item_count;
      })
      .catch((err) => {
        console.log({err});
      });
  };
};

function CartCount(element, options) {
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

var elements = document.querySelectorAll('[data-module-cart-count]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-cart-count');

  CartCount(element, options);
});
