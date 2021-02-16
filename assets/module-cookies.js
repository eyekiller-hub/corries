import Cookies from 'js-cookie';

pathnames();

products();

function pathnames() {
  var recently_viewed_pathnames = JSON.parse(Cookies.get('recently-viewed-pathnames') || '[]');

  recently_viewed_pathnames = [window.location.pathname, ...recently_viewed_pathnames];

  recently_viewed_pathnames = [...new Set(recently_viewed_pathnames)];

  recently_viewed_pathnames = recently_viewed_pathnames.slice(0, 20);

  Cookies.set('recently-viewed-pathnames', recently_viewed_pathnames);
};


function products() {
  var recently_viewed_products = JSON.parse(Cookies.get('recently-viewed-products') || '[]');

  if (window.location.pathname.includes('/products/')) {
    var product_handle = window.location.pathname.split('/').pop().split('?')[0];

    recently_viewed_products = [product_handle, ...recently_viewed_products];
  }

  recently_viewed_products = [...new Set(recently_viewed_products)];

  recently_viewed_products = recently_viewed_products.slice(0, 20);

  Cookies.set('recently-viewed-products', recently_viewed_products);
};
