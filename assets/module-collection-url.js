import Events from './object-events';
import Url from './object-url';
import throttle from './fn-throttle';

Events
  .once('collection-body--or:products:render:success', bind_scroll)
  .once('collection-body--and:products:render:success', bind_scroll)
  .on('collection-link:click', (url, document_element) => Url.update(url))
  .on('collection-filters--or:change', (active_tags) => {
    Url.update_param('active_tags', JSON.stringify(active_tags));
  })
  .on('collection-body--or:products:render:success', (collection_body_products_length, collection_body_options) => {
    Url.update_param('page', collection_body_options.page);
  })
  .on('collection-body--and:products:render:success', (collection_body_options) => {
    Url.update_param('page', collection_body_options.page);
  });

function bind_scroll() {
  window.addEventListener('scroll', throttle(() => {
    Url.update_param('scroll', window.scrollY)
  }, 500));
};
