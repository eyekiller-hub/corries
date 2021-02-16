import Events from './object-events';
import Url from './object-url';
import throttle from './fn-throttle';

Events.on('productform:varianthistorystate', (variant) => {
  Url.update_param('variant', variant.id)
});
