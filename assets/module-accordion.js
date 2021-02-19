import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Breakpoint from './object-breakpoint';
import debounce from './fn-debounce';
import Events from './object-events';

function Self(element, events, options, module) {};

function Button(element, events, options, module) {
  element.addEventListener('click', (event) => {
    event.preventDefault();
    events.trigger('button:click', [options.index]);
    events.trigger(`button:click:${options.index}`);
    Events.trigger('accordion:button:click');
  });

  window.addEventListener('resize', debounce(() => {
    var active = is_active();

    if (active) {
      events.trigger(`button:resizeactive:${options.index}`);
    } else {
      events.trigger(`button:resizeinactive:${options.index}`);
    }
  }));

  var active = is_active();

  if (active) {
    setTimeout(() => events.trigger(`button:active:${options.index}`));
  }

  function is_active() {
    var active = options.active && !Array.isArray(options.active);

    if (Array.isArray(options.active)) {
      active = options.active.some((breakpoint) => Breakpoint[breakpoint]);
    }

    return active;
  };
};

function Icon(element, events, options, module) {
  events
    .on(`button:click:${options.index}`, toggle)
    .on(`button:active:${options.index}`, toggle);

  function toggle() {
    var display = window.getComputedStyle(element).display == 'block' ? 'none' : 'block';
    element.style.display = display;
  };

  function hide() {
    element.style.display = 'none';
  };

  function show() {
    element.style.display = 'block';
  };

  return { toggle, hide, show };
};

function IconShow(element, events, options, module) {
  var icon = Icon(element, events, options, module);

  events
    .on('button:click', (index) => {
      if (index != options.index) {
        element.style.display = '';
      }
    })
    .on(`button:resizeactive:${options.index}`, icon.hide)
    .on(`button:resizeinactive:${options.index}`, icon.show);
};

function IconHide(element, events, options, module) {
  var icon = Icon(element, events, options, module);

  element.style.display = 'none';

  events
    .on('button:click', (index) => {
      if (index != options.index) {
        element.style.display = 'none';
      }
    })
    .on(`button:resizeactive:${options.index}`, icon.show)
    .on(`button:resizeinactive:${options.index}`, icon.hide);
};

function Panel(element, events, options, module) {
  element.style.display = 'none';

  events
    .on('button:click', (index) => {
      if (index != options.index) {
        element.style.display = 'none';
      }
    })
    .on(`button:click:${options.index}`, toggle)
    .on(`button:active:${options.index}`, toggle)
    .on(`button:resizeactive:${options.index}`, show)
    .on(`button:resizeinactive:${options.index}`, hide);

  function toggle() {
    var display = window.getComputedStyle(element).display == 'block' ? 'none' : 'block';
    element.style.display = display;
  };

  function hide() {
    element.style.display = 'none';
  };

  function show() {
    element.style.display = 'block';
  };
};

function Accordion(element, options) {
  var defaults = {
    buttons: []
  };

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    button: element.querySelectorAll('[data-ref-button]'),
    icon_show: element.querySelectorAll('[data-ref-icon-show]'),
    icon_hide: element.querySelectorAll('[data-ref-icon-hide]'),
    panel: element.querySelectorAll('[data-ref-panel]')
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

  refs.button.forEach((element) => {
    var options = get_element_options(element, 'data-ref-button');

    Button(element, events, options, module);
  });

  refs.icon_show.forEach((element) => {
    var options = get_element_options(element, 'data-ref-icon-show');

    IconShow(element, events, options, module);
  });

  refs.icon_hide.forEach((element) => {
    var options = get_element_options(element, 'data-ref-icon-hide');

    IconHide(element, events, options, module);
  });

  refs.panel.forEach((element) => {
    var options = get_element_options(element, 'data-ref-panel');

    Panel(element, events, options, module);
  });
};

init();

Events.on('slide-panels:change:active', init);

function init() {
  var elements = document.querySelectorAll('[data-module-accordion]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-accordion');

    Accordion(element, options);
  });
};
