import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Cookies from 'js-cookie';
import Events from './object-events';
import ResponsiveImages from './object-responsive-images';

function Self(element, events, options, module) {
  var product_handle = window.location.pathname.split('/').pop().split('?')[0];

  var recently_viewed_products = JSON.parse(Cookies.get('recently-viewed-products') || '[]');

  var product_handles = recently_viewed_products.filter((product) => product != product_handle);

  if (!product_handles.length) {
    return;
  }

  product_handles = product_handles.slice(0, options.limit);

  var query = product_handles
    .map((product_handle) => (`handle:"${product_handle}"`))
    .join(' OR ');

  var url = `${window.theme_route_urls.search_url}?view=recently-viewed-products&type=product`;

  fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: query
    })
  })
    .then((res) => res.text())
    .then((res) => {
      element.outerHTML = res;
      ResponsiveImages.load();
      Events.trigger('recentlyviewedproducts:rendersuccess');
    });
};

function RecentlyViewedProducts(element, options) {
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

var elements = document.querySelectorAll('[data-module-recently-viewed-products]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-recently-viewed-products');

  RecentlyViewedProducts(element, options);
});
