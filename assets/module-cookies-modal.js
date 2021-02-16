import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Cookies from 'js-cookie';

function Self(element, events, options, module) {
  if( !Cookies.get('cookiesmodal') ) {
    show();
  }

  events
    .on('cookiesmodalcta:click', function() {
      hide();
      Cookies.set('cookiesmodal', true);
    })
    .on('cookiesmodalclose:click', hide);

  function show() {
    document.documentElement.classList.add('is-active-cookies-modal');
  };

  function hide() {
    document.documentElement.classList.remove('is-active-cookies-modal');
  };
};

function Cta(element, events, options, module) {
  element.addEventListener('click', function() {
    events.trigger('cookiesmodalcta:click');
  });
};

function Close(element, events, options, module) {
  element.addEventListener('click', function() {
    events.trigger('cookiesmodalclose:click');
  });
};

function CookiesModal(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    cta:  element.querySelectorAll('[data-ref-cta]'),
    close:  element.querySelectorAll('[data-ref-close]')
  };

  var module = {
    element: element,
    options: options,
    refs: refs
  };

  refs.self.forEach(function(element) {
    var options = module.options;

    Self(element, events, options, module);
  });

  refs.cta.forEach(function(element) {
    var options = get_element_options(element, 'data-ref-cta');

    Cta(element, events, options, module);
  });

  refs.close.forEach(function(element) {
    var options = get_element_options(element, 'data-ref-close');

    Close(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-cookies-modal]');

elements.forEach(function(element) {
  var options = get_element_options(element, 'data-module-cookies-modal');

  CookiesModal(element, options);
});
