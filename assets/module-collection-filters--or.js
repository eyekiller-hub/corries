import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  var url_params = new URLSearchParams(window.location.search);

  var url_active_tags = url_params.get('active_tags');

  options.active_tags = JSON.parse(url_active_tags || '[]');

  events.on('filter:change', (checked, tag) => {
    if (checked) {
      if (!options.active_tags.includes(tag)) {
        options.active_tags = options.active_tags.concat(tag);
      }
    } else {
      options.active_tags = options.active_tags.filter((_tag) => _tag != tag);
    }

    Events.trigger('collection-filters--or:change', [options.active_tags]);
  });
};

function Filter(element, events, options, module) {
  if (module.options.active_tags.includes(options.tag)) {
    setTimeout(() => {
      events.trigger(`filter:active:${options.id}`);
    });
  }

  events
    .on(`input:change:${options.id}`, (checked) => {
      events.trigger('filter:change', [checked, options.tag]);
      events.trigger(`filter:change:${options.id}`, [checked, options.tag]);
    })
    .on(`productscount:empty:${options.id}`, () => {
      element.remove();
    });
};

function Input(element, events, options, module) {
  events
    .on(`filter:active:${options.filter_id}`, () => {
      element.checked = true;
    })
    .on(`filter:change:${options.filter_id}`, (checked) => {
      element.checked = checked;
    });

  element.addEventListener('change', () => {
    events.trigger(`input:change:${options.filter_id}`, [element.checked]);
  });
};

function ProductsCount(element, events, options, module) {
  var count = module.options.products.reduce((acc, product) => {
    if (product.tags.includes(options.tag)) {
      acc += 1;
    }

    return acc;
  }, 0);

  element.innerHTML = `(${count})`;

  if (!count) {
    events.trigger(`productscount:empty:${options.filter_id}`);
  }
};

function ActiveFilters(element, events, options, module) {
  init();

  events.on('filter:change', init);

  function init(checked, tag) {
    if (!module.options.active_tags.length) {
      return element.style.display = 'none';
    }

    element.style.display = 'block';
  };
};

function ActiveFilter(element, events, options, module) {
  init();

  events.on('filter:change', init);

  function init() {
    if (!module.options.active_tags.includes(options.tag)) {
      return element.style.display = 'none';
    }

    element.style.display = 'block';
  };
};

function CollectionFiltersOr(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    filter: element.querySelectorAll('[data-ref-filter]'),
    input: element.querySelectorAll('[data-ref-input]'),
    products_count: element.querySelectorAll('[data-ref-products-count]'),
    active_filters: element.querySelectorAll('[data-ref-active-filters]'),
    active_filter: element.querySelectorAll('[data-ref-active-filter]')
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

  refs.filter.forEach((element) => {
    var options = get_element_options(element, 'data-ref-filter');

    Filter(element, events, options, module);
  });

  refs.input.forEach((element) => {
    var options = get_element_options(element, 'data-ref-input');

    Input(element, events, options, module);
  });

  refs.products_count.forEach((element) => {
    var options = get_element_options(element, 'data-ref-products-count');

    ProductsCount(element, events, options, module);
  });

  refs.active_filters.forEach((element) => {
    var options = get_element_options(element, 'data-ref-active-filters');

    ActiveFilters(element, events, options, module);
  });

  refs.active_filter.forEach((element) => {
    var options = get_element_options(element, 'data-ref-active-filter');

    ActiveFilter(element, events, options, module);
  });
};

Events.on('collection-body--or:get-products:success', init);

function init(products) {
  var elements = document.querySelectorAll('[data-module-collection-filters--or]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-collection-filters--or');

    options.products = products;

    CollectionFiltersOr(element, options);
  });
};
