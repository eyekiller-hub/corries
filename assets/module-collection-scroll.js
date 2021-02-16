import Events from './object-events';
import throttle from './fn-throttle';

var url_params = new URLSearchParams(window.location.search);

var url_scroll = url_params.get('scroll');

if (url_scroll) {
  Events
    .once('collection-body--or:products:render:success', scroll_to_url_position)
    .once('collection-body--and:products:render:success', scroll_to_url_position);
}

Events.once( 'collection-body--or:products:init', (collection_body_products_element) => {
  Events.on('collection-pagination--or:part-link:click', () => {
    window.scroll({ top: collection_body_products_element.offsetTop });
  });
});

Events.on('collection-link:click:scroll-to-top', (collection_body_products_element) => {
  window.scroll({ top: collection_body_products_element.offsetTop });
});

(() => {
  Events
    .on('collection-body--or:products:start', on_start)
    .off('collection-body--or:products:finish', on_start);

  function on_start(collection_body_options, collection_body_products_element) {
    if (collection_body_options.pagination_type != 'infinite') {
      return;
    }

    setTimeout(() => on_scroll());

    window.addEventListener('scroll', on_scroll);

    Events.once('collection-body--or:products:finish', () => {
      window.removeEventListener('scroll', on_scroll);
    });

    function on_scroll() {
      var element = collection_body_products_element;

      var element_bottom_inview = (window.pageYOffset + window.innerHeight + 500) >= (element.offsetTop + element.offsetHeight);

      if (element_bottom_inview) {
        window.removeEventListener('scroll', on_scroll);
        Events.trigger('scroll:collection-body--or:products:bottom-in-view');
      }
    };
  };
})();

(() => {
  Events
    .on('collection-body--and:products:start', on_start)
    .off('collection-body--and:products:finish', on_start);

  function on_start(collection_body_options, collection_body_products_element) {
    if (collection_body_options.pagination_type != 'infinite') {
      return;
    }

    setTimeout(() => on_scroll());

    window.addEventListener('scroll', on_scroll);

    Events.once('collection-body--and:products:finish', () => {
      window.removeEventListener('scroll', on_scroll);
    });

    function on_scroll() {
      var element = collection_body_products_element;

      var element_bottom_inview = (window.pageYOffset + window.innerHeight + 500) >= (element.offsetTop + element.offsetHeight);

      if (element_bottom_inview) {
        window.removeEventListener('scroll', on_scroll);
        Events.trigger('scroll:collection-body--and:products:bottom-in-view');
      }
    };
  };
})();

function scroll_to_url_position() {
  window.scroll({ top: url_scroll });
};
