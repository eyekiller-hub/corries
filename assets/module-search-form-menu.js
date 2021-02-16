import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';

function Self(element, events, options, module) {
  Events
    .on(`search-form-input:${options.search_form_input_id}:focusin`, () => {
      events.trigger('self:focusin');
    })
    .on(`search-form-input:${options.search_form_input_id}:focusout`, (clicked_element) => {
      if (element.contains(clicked_element)) {
        events.trigger('self:focusin');

        document.addEventListener('click', bind_focusout);

        function bind_focusout(event) {
          if (!element.contains(event.target)) {
            events.trigger('self:focusout');
            document.removeEventListener('click', bind_focusout);
          }
        };

        return;
      }

      events.trigger('self:focusout');
    });

  events
    .on('self:focusin', () => {
      if (options.value) {
        return;
      }

      show();
    })
    .on('self:focusout', hide);

  Events
    .on(`search-form-input:${options.search_form_input_id}:change`, (value) => {
      options.value = value;
      hide();
    })
    .on(`search-form-input:${options.search_form_input_id}:empty`, () => {
      options.value = '';
      show();
    });

  function show() {
    element.classList.add('is-active');
  };

  function hide() {
    element.classList.remove('is-active');
  };
};

function SearchFormMenu(element, options) {
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

var elements = document.querySelectorAll('[data-module-search-form-menu]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-search-form-menu');

  SearchFormMenu(element, options);
});
