import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';
import ResponsiveImages from './object-responsive-images';

function Self(element, events, options, module) {
  var class_name = `is-active-offcanvas-${options.id}`;

  var offcanvas_element = document.querySelector(`#off-canvas-${options.id}`);

  element.addEventListener('click', (event) => {
    event.preventDefault();

    var active = !document.documentElement.classList.contains(class_name);

    var event_key = active ? 'self:active' : 'self:inactive';

    Events.trigger('offcanvastrigger:active');

    events.trigger(event_key, [options.id]);
  });

  if (options.active_event) {
    Events.on(options.active_event, () => events.trigger('self:active'));
  }

  Events.on('offcanvastrigger:active', () => events.trigger('self:inactive'));

  events
    .on('self:active', (id) => {
      options.scroll = window.pageYOffset;

      document.documentElement.classList.add(class_name);

      document.body.style.top = `-${options.scroll}px`;
    })
    .on('self:inactive', (id) => {
      document.documentElement.classList.remove(class_name);

      document.body.style.top = '';

      if (options.scroll) {
        window.scrollTo(0, options.scroll);
      }

      delete options.scroll;
    });

  if (offcanvas_element) {
    events.once('self:active', (id) => {
      ResponsiveImages.load_lazy(offcanvas_element);
    });
  }
};

function Icon(element, events, options, module) {
  element.style.display = options.type == 'hide' ? 'none' : '';

  events
    .on('self:active', () => {
      element.style.display = options.type == 'show' ? 'none' : 'block';
    })
    .on('self:inactive', () => {
      element.style.display = options.type == 'hide' ? 'none' : 'block';
    });
};

function OffcanvasTrigger(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    icon: element.querySelectorAll('[data-ref-icon]')
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

  refs.icon.forEach((element) => {
    var options = get_element_options(element, 'data-ref-icon');

    Icon(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-offcanvas-trigger]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-offcanvas-trigger');

  OffcanvasTrigger(element, options);
});
