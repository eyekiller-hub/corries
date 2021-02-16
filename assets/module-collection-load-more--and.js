import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  Events.on('collection-link:click', render);

  function render(url, document_element) {
    var new_element = document_element.querySelector('[data-module-collection-load-more--and]');

    if (!new_element) {
      return element.style.display = 'none';
    }

    element.style.display = 'block';

    element.innerHTML = new_element.innerHTML;

    Events.trigger('collection-load-more--and:render:success');
  };
};

function CollectionLoadMoreAnd(element, options) {
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

var elements = document.querySelectorAll('[data-module-collection-load-more--and]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-collection-load-more--and');

  CollectionLoadMoreAnd(element, options);
});
