import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';
import ResponsiveImages from './object-responsive-images';

function Self(element, events, options, module) {
  Events
    .on('cartchange:click', set_loading)
    .on('cartchange:success', render)
    .on('productform:success', (cart) => {
      render(cart);
    });

  function render(cart, render_options = {}) {
    fetch('/?section_id=header', { credentials: 'same-origin' })
      .then((res) => res.text())
      .then((res) => {
        var div = document.createElement('div');
        div.innerHTML = res;

        var new_element = div.querySelector('[data-module-mini-cart]');

        element.parentNode.replaceChild(new_element, element);

        element = new_element;

        ResponsiveImages.load_lazy(element);

        unset_loading();

        Events.trigger('minicart:self:rendersuccess');
      })
      .catch((err) => {
        console.log({err});
        unset_loading();
      });
  };

  function set_loading() {
    document.documentElement.classList.add('is-loading-mini-cart');
  };

  function unset_loading() {
    document.documentElement.classList.remove('is-loading-mini-cart');
  };
};

function MiniCart(element, options) {
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

var elements = document.querySelectorAll('[data-module-mini-cart]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-mini-cart');

  MiniCart(element, options);
});
