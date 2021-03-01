import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import transform_liquid_attributes from './fn-transform-liquid-attributes';
import Events from './object-events';
import ResponsiveImages from './object-responsive-images';

function Self(element, events, options, module) {
  var observer = new MutationObserver((mutationsList, observer) => {
    for (var mutation of mutationsList) {
      if (element.innerHTML.includes('instafeed-container')) {
        events.trigger('self:app:loaded');
      }
    }
  });

  observer.observe(element, {
    attributes: true,
    childList: true,
    subtree: true
  });

  events.once('self:app:loaded', () => {
    observer.disconnect();

    var app_elements = element.querySelectorAll('#insta-feed a');

    if (!app_elements.length) {
      return;
    }

    var items = Array.from(app_elements)
      .map((app_element) => {
        var url = app_element.href;

        var image_url = app_element.querySelector('img').getAttribute('data-src');

        var image_alt = app_element.querySelector('img').alt;

        return transform_liquid_attributes(options.item_template, {
          url: url,
          image_url: image_url,
          image_alt: image_alt
        });
      })
      .join('');

    var html = transform_liquid_attributes(options.template, {
      items: items
    });

    element.innerHTML = html;

    ResponsiveImages.load();

    Events.trigger('insta-feed:load');
  });
};

function InstaFeed(element, options) {
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
  var elements = document.querySelectorAll('[data-module-insta-feed]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-insta-feed');

    InstaFeed(element, options);
  });
};
