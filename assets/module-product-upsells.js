import EventEmitter from "wolfy87-eventemitter";
import Events from "./object-events";
import get_element_options from "./fn-get-element-options";
import ResponsiveImages from './object-responsive-images';
import transform_liquid_attributes from './fn-transform-liquid-attributes';

function Self(element, events, options, module) {
  var url = `${window.theme_route_urls.product_recommendations_url}?section_id=product-upsells&product_id=${options.product_id}&limit=${options.limit}`;

  fetch(url, { credentials: 'same-origin' })
    .then((res) => res.text())
    .then((res) => {
      var html = transform_liquid_attributes(res, {
        product_title: options.product_title
      });

      element.outerHTML = html;

      ResponsiveImages.load();
    })
    .catch((err) => {
      console.log({err});
    });
};

function ProductUpsells(element, options) {
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

var elements = document.querySelectorAll("[data-module-product-upsells]");

elements.forEach((element) => {
  var options = get_element_options(element, "data-module-product-upsells");

  ProductUpsells(element, options);
});
