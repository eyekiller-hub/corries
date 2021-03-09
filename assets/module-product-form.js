import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  var initial_variant = options.product.variants.find((variant) => {
    return variant.id == options.variant_id;
  });

  var initial_variant_options = initial_variant.options.slice();

  events.on('input:change', ({position, value}) => {
    initial_variant_options[(position - 1)] = value;

    var variant_options = initial_variant_options;

    var variant = options.product.variants.find((variant) => {
      return JSON.stringify(variant.options) == JSON.stringify(variant_options);
    });

    options.variant_id = variant && variant.id;

    var map = {
      'variantchange': variant,
      'variantchangeunavailable': !variant,
      'variantchangeavailable': variant && variant.available,
      'variantchangesoldout': variant && !variant.available,
      'variantchangeonsale': variant && (variant.compare_at_price > variant.price),
      'varianthistorystate': variant && options.history_state
    };

    Object.keys(map).forEach((key) => {
      if (map[key]) {
        events.trigger(`self:${key}`, [variant]);
        Events.trigger(`productform:${key}`, [variant]);
        Events.trigger(`productform:${options.product.id}:${key}`, [variant]);
      }
    });
  });

  Events.on(`productquantity:${module.options.product.id}:change`, (value) => {
    options.quantity = value;
  });

  element.addEventListener('submit', submit);

  function submit(event) {
    event.preventDefault();

    fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            id: options.variant_id,
            quantity: options.quantity
          }
        ]
      })
    })
      .then((res) => res.json())
      .then((res) => {
        Events.trigger('productform:success', [res, options]);
        Events.trigger(`productform:success:${options.product.id}`, [res, options]);
      })
      .catch((err) => {
        console.log({err});
      });
  };
};

function Input(element, events, options, module) {
  element.addEventListener('change', (event) => {
    if (element.tagName == 'SELECT') {
      options.value = element.options[element.selectedIndex].value;
    }

    events.trigger('input:change', [options]);
  });
};

function Id(element, events, options, module) {
  events.on('self:variantchange', (variant) => {
    element.value = variant.id;
  });
};

function ProductForm(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    input: element.querySelectorAll('[data-ref-input]'),
    id: element.querySelectorAll('[data-ref-id]')
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

  refs.input.forEach((element) => {
    var options = get_element_options(element, 'data-ref-input');

    Input(element, events, options, module);
  });

  refs.id.forEach((element) => {
    var options = get_element_options(element, 'data-ref-id');

    Id(element, events, options, module);
  });
};

init();

Events
  .on('collection-body--or:products:render:success', init)
  .on('collection-body--and:products:render:success', init)
  .on('product-upsells:render:success', init);

function init() {
  var elements = document.querySelectorAll('[data-module-product-form]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-product-form');

    ProductForm(element, options);

    element.removeAttribute('data-module-product-form');
  });
};
