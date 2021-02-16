import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  Events
    .on('collection-body--or:products:finish', () => {
      element.style.display = 'none';
    })
    .on('collection-body--or:products:start', () => {
      element.style.display = 'block';
    });
};

function LoadMoreButton(element, events, options, module) {
  element.addEventListener('click', (event) => {
    event.preventDefault();
    Events.trigger('collection-load-more--or:click', [element.href]);
  });
};

function CollectionLoadMoreOr(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    load_more_button: element.querySelectorAll('[data-ref-load-more-button]')
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

  refs.load_more_button.forEach((element) => {
    var options = get_element_options(element, 'data-ref-load-more-button');

    LoadMoreButton(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-collection-load-more--or]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-collection-load-more--or');

  CollectionLoadMoreOr(element, options);
});
