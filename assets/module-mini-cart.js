import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';
import ResponsiveImages from './object-responsive-images';

function Self(element, events, options, module) {
  bind_hover_events();

  Events
    .on('cartchange:click', set_loading)
    .on('cartchange:success', render)
    .on('productform:success', (cart) => {
      render(cart, { reveal: true });
    });

  function render(cart, render_options = {}) {
    fetch('/?section_id=header', { credentials: 'same-origin' })
      .then((res) => res.text())
      .then((res) => {
        var div = document.createElement('div');
        div.innerHTML = res;

        var new_element = div.querySelector('[data-module-mini-cart]');

        element.parentNode.replaceChild(new_element, element);

        ResponsiveImages.load();

        element = new_element;

        unset_loading();

        bind_hover_events();

        Events.trigger('minicart:self:rendersuccess');

        if (render_options.reveal) {
          reveal();
        }
      })
      .catch((err) => {
        console.log({err});
        unset_loading();
      });
  };

  function bind_hover_events() {
    element.addEventListener('mouseover', show);
    element.addEventListener('mouseout', hide);
  };

  function show() {
    document.documentElement.classList.add('is-active-mini-cart');
  };

  function hide() {
    document.documentElement.classList.remove('is-active-mini-cart');
  };

  function reveal() {
    show();

    setTimeout(() => {
      hide();
    }, options.reveal_timeout);
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
