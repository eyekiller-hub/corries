import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';

function Self(element, events, options, module) {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    Events.trigger('cartchange:click');

    fetch('/cart/update.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates: {
          [options.key]: options.quantity
        }
      })
    })
      .then((res) => res.json())
      .then((res) => {
        Events.trigger('cartchange:success', [res]);
      })
      .catch((err) => {
        console.log({err});
      });
  });
};

function CartChange(element, options) {
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

Events.on('minicart:self:rendersuccess', init);

function init() {
  var elements = document.querySelectorAll('[data-module-cart-change]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-cart-change');

    CartChange(element, options);
  });
};
