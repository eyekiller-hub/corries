import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';
import transform_liquid_attributes from './fn-transform-liquid-attributes';
import money from './fn-money';
import ResponsiveImages from './object-responsive-images';
import get_document_element from './fn-get-document-element';

function Self(element, events, options, module) {
  var url_params = new URLSearchParams(window.location.search);

  var url_page = url_params.get('page');

  options.page = +(url_page) || 1;

  get_html()
    .then((res) => {
      events.trigger('self:get-html:success', [res]);
    })
    .catch((err) => {
      console.log(err);
    });

  Events.on('collection-link:click', (url, document_element, products_append) => {
    var collection_link_url_params = new URLSearchParams(url.split('?')[1]);

    var collection_link_url_page = collection_link_url_params.get('page') || 1;

    var new_element = document_element.querySelector('[data-module-collection-body--and]');

    var new_options = get_element_options(new_element, 'data-module-collection-body--and');

    if (collection_link_url_page) {
      options.page = +(collection_link_url_page);
    }

    options.collection.products_count = new_options.collection.products_count;
  });

  Events.on('scroll:collection-body--and:products:bottom-in-view', () => {
    module.options.page += 1;

    var sort_by = url_params.get('sort_by') || '';

    var url_suffix = `&sort_by=${sort_by}`;

    var url = `${window.location.pathname}?page=${module.options.page}${url_suffix}`;

    get_document_element(url)
      .then((document_element) => {
        var new_products_element = document_element.querySelector('[data-ref-products]');

        var html = new_products_element.innerHTML;

        events.trigger('self:get-html:success', [html, true]);
      });
  });

  function get_html() {
    var pagination_limit = module.options.limit;

    var page = url_params.get('page') || 1;

    var sort_by = url_params.get('sort_by') || '';

    var url_suffix = `&sort_by=${sort_by}`;

    var pages = Math.ceil(pagination_limit * page / pagination_limit);

    var promises = Array.from({length: pages}, (item, index) => {
      var url = `${window.location.pathname}?page=${index + 1}${url_suffix}`;

      return fetch(url, { credentials: 'same-origin' })
        .then((res) => res.text());
    });

    return Promise.all(promises)
      .then((res) => {
        return res.reduce((acc, res_item) => {
          var document_element = document.createElement('div');

          document_element.innerHTML = res_item;

          var html = document_element.querySelector('[data-ref-products]');

          acc = acc.concat(html.innerHTML);

          return acc;
        }, []);
      });
  };
};

function ProductsWrap(element, events, options, module) {
  events.on('products:empty', () => {
    element.style.display = 'none';
  });

  events.on('products:filled', () => {
    element.style.display = 'block';
  });
};

function Products(element, events, options, module) {
  setTimeout(() => Events.trigger('collection-body--and:products:init', [element]));

  events.on('self:get-html:success', render);

  Events.on('collection-link:click', (url, document_element, products_append) => {
    var new_element = document_element.querySelector('[data-ref-products]');

    if (!new_element.children.length) {
      return events.trigger('products:empty');
    }

    events.trigger('products:filled');

    var html = new_element.innerHTML;

    render(html, products_append);
  });

  function render(html, products_append) {
    var paginate_items_count = module.options.page * module.options.limit;

    if (products_append) {
      element.insertAdjacentHTML('beforeend', html);
    } else {
      element.innerHTML = html;
    }

    ResponsiveImages.load_lazy(element);

    setTimeout(() => Events.trigger('collection-body--and:products:render:success', [module.options]));

    if (paginate_items_count >= module.options.collection.products_count) {
      Events.trigger('collection-body--and:products:finish', [module.options, element]);
    } else {
      Events.trigger('collection-body--and:products:start', [module.options, element]);
    }
  };
};

function AllProductsCount(element, events, options, module) {
  Events.on('collection-link:click', render);

  function render(url, document_element) {
    var new_element = document_element.querySelector('[data-ref-all-products-count]');

    element.innerHTML = new_element.innerHTML;
  };
};

function Empty(element, events, options, module) {
  events.on('products:empty', () => {
    element.style.display = 'block';
    element.innerHTML = module.options.empty_template;
  });

  events.on('products:filled', () => {
    element.style.display = 'none';
    element.innerHTML = '';
  });
};

function CollectionBodyAnd(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    products_wrap: element.querySelectorAll('[data-ref-products-wrap]'),
    products: element.querySelectorAll('[data-ref-products]'),
    all_products_count: element.querySelectorAll('[data-ref-all-products-count]'),
    empty: element.querySelectorAll('[data-ref-empty]')
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

  refs.products_wrap.forEach((element) => {
    var options = get_element_options(element, 'data-ref-products-wrap');

    ProductsWrap(element, events, options, module);
  });

  refs.products.forEach((element) => {
    var options = get_element_options(element, 'data-ref-products');

    Products(element, events, options, module);
  });

  refs.all_products_count.forEach((element) => {
    var options = get_element_options(element, 'data-ref-all-products-count');

    AllProductsCount(element, events, options, module);
  });

  refs.empty.forEach((element) => {
    var options = get_element_options(element, 'data-ref-empty');

    Empty(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-collection-body--and]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-collection-body--and');

  CollectionBodyAnd(element, options);
});
