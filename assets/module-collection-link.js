import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';
import get_document_element from './fn-get-document-element';

function Self(element, events, options, module) {
  Events.on('collection-link:init', () => {
    element.removeEventListener('click', on_click);
  });

  element.addEventListener('click', on_click);

  function on_click(event) {
    event.preventDefault();

    var url = element.href;

    get_document_element(url)
      .then((document_element) => {
        Events.trigger('collection-link:click', [url, document_element, options.products_append]);

        if (options.scroll_to_top) {
          Events.trigger('collection-link:click:scroll-to-top', [options.collection_body_products_element]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

function CollectionLink(element, options) {
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

Events.on('collection-body--and:products:init', (collection_body_and_products_element) => {
  init();

  Events
    .on('collection-filters--and:render:success', init)
    .on('collection-pagination--and:render:success', init)
    .on('collection-load-more--and:render:success', init);

  function init() {
    Events.trigger('collection-link:init');

    var elements = document.querySelectorAll('[data-module-collection-link]');

    elements.forEach((element) => {
      var options = get_element_options(element, 'data-module-collection-link');

      options.collection_body_products_element = collection_body_and_products_element;

      CollectionLink(element, options);
    });
  };
});
