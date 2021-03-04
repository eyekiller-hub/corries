import EventEmitter from "wolfy87-eventemitter";
import Events from "./object-events";
import get_element_options from "./fn-get-element-options";

function Self(element, events, options, module) {
  var text = element.innerHTML;

  var map = {
    [`productform:${options.product_id}:variantchangeavailable`]: {
      text: options.available,
      disabled: false
    },
    [`productform:${options.product_id}:variantchangeunavailable`]: {
      text: options.unavailable,
      disabled: true
    },
    [`productform:${options.product_id}:variantchangesoldout`]: {
      text: options.sold_out,
      disabled: true
    }
  };

  Object.keys(map).forEach((key) => {
    Events.on(key, () => {
      text = map[key].text;
      element.innerHTML = map[key].text;
      element.disabled = map[key].disabled;
    });
  });

  Events.on(`productform:success:${options.product_id}`, () => {
    element.innerHTML = options.added;

    setTimeout(() => {
      element.innerHTML = text;
    }, 2000);
  });
};

function ProductSubmit(element, options) {
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

Events
  .on('collection-body--or:products:render:success', init)
  .on('collection-body--and:products:render:success', init)
  .on('product-upsells:render:success', init);

function init() {
  var elements = document.querySelectorAll("[data-module-product-submit]");

  elements.forEach((element) => {
    var options = get_element_options(element, "data-module-product-submit");

    ProductSubmit(element, options);
  });
};
