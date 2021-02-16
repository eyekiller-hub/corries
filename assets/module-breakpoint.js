import debounce from './fn-debounce';
import Breakpoint from './object-breakpoint';
import Events from './object-events';

window.addEventListener('resize', debounce(() => {
  Events.trigger('breakpoint', [Breakpoint.current]);
}, 100));
