import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';
import ResponsiveImages from './object-responsive-images';
import ProductCard from './object-product-card';

function Self(element, events, options, module) {
  var url_params = new URLSearchParams(window.location.search);

  var url_page = url_params.get('page');

  var url_active_tags = url_params.get('active_tags');

  options.page = +(url_page) || 1;

  options.active_tags = JSON.parse(url_active_tags || '[]');

  get_products()
    .then((products) => {
      options.products = products;
      events.trigger('self:get-products:success');
      Events.trigger('collection-body--or:get-products:success', [options.products]);
    })
    .catch((err) => {
      console.log(err);
    });

  function get_products() {
    var pagination_limit = 100;

    var sort_by = url_params.get('sort_by') || '';

    var url_suffix = `&sort_by=${sort_by}`;

    if (options.collection.products_count <= pagination_limit) {
      var url = `${window.location.pathname}?view=json${url_suffix}`;

      return fetch(url, { credentials: 'same-origin' })
        .then((res) => res.json())
        .then((res) => res.products);
    }

    var pages = Math.ceil(options.collection.products_count / pagination_limit);

    var promises = Array.from({length: pages}, (item, index) => {
      var url = `${window.location.pathname}?view=json&page=${index + 1}${url_suffix}`;

      return fetch(url, { credentials: 'same-origin' })
        .then((res) => res.json());
    });

    return Promise.all(promises)
      .then((res) => {
        return res.reduce((acc, item) => {
          acc = acc.concat(item.products);
          return acc;
        }, []);
      });
  };
};

function Products(element, events, options, module) {
  setTimeout(() => Events.trigger('collection-body--or:products:init', [element]));

  events.on('self:get-products:success', () => {
    render();

    Events.on('collection-filters--or:change', (active_tags) => {
      module.options.active_tags = active_tags;
      module.options.page = 1;
      render();
    });

    Events.on('collection-load-more--or:click', () => {
      module.options.page += 1;
      render();
    });

    Events.on('scroll:collection-body--or:products:bottom-in-view', () => {
      module.options.page += 1;
      render();
    });

    Events.on('collection-pagination--or:part-link:click', (page) => {
      module.options.page = page;
      render();
    });
  });

  function get_active_products() {
    if (!module.options.active_tags.length) {
      return module.options.products;
    }

    return module.options.products.filter((product) => {
      return product.tags.some((tag) => module.options.active_tags.includes(tag));
    });
  };

  function render() {
    var products = get_active_products();

    var paginate_items_count = module.options.page * module.options.limit;

    var begin = module.options.pagination_type == 'default' ? paginate_items_count - module.options.limit : 0;

    var html = products
      .slice(begin, paginate_items_count)
      .map((product) => {
        return ProductCard.render({
          product: product,
          template: module.options.product_card_template,
          collection: module.options.collection,
          money_format: module.options.money_format,
          grid_item_class_name_template: module.options.product_card_grid_item_class_name_template
        });
      })
      .join('');

    element.innerHTML = html;

    ResponsiveImages.load();
    ResponsiveImages.load_lazy(element);

    events.trigger('products:render:success', [products.length, module.options, element]);
    Events.trigger('collection-body--or:products:render:success', [products.length, module.options, element]);

    if (paginate_items_count >= products.length) {
      Events.trigger('collection-body--or:products:finish', [module.options, element]);
    } else {
      Events.trigger('collection-body--or:products:start', [module.options, element]);
    }
  };
};

function AllProductsCount(element, events, options, module) {
  events.on('products:render:success', (collection_body_products_length, collection_body_options) => {
    element.innerHTML = collection_body_products_length;
  });
};

function CollectionBodyOr(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    products: element.querySelectorAll('[data-ref-products]'),
    all_products_count: element.querySelectorAll('[data-ref-all-products-count]')
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

  refs.products.forEach((element) => {
    var options = get_element_options(element, 'data-ref-products');

    Products(element, events, options, module);
  });

  refs.all_products_count.forEach((element) => {
    var options = get_element_options(element, 'data-ref-all-products-count');

    AllProductsCount(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-collection-body--or]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-collection-body--or');

  CollectionBodyOr(element, options);
});
