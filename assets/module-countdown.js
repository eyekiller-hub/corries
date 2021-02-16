import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {
  var second = 1000;
  var minute = second * 60;
  var hour = minute * 60;
  var day = hour * 24;

  var count_down = new Date(options.date).getTime();

  var x = setInterval(() => {
    var now = new Date().getTime();
    var distance = count_down - now;

    events.trigger('self:days', [Math.floor(distance / (day))]);
    events.trigger('self:hours', [Math.floor((distance % (day)) / (hour))]);
    events.trigger('self:minutes', [Math.floor((distance % (hour)) / (minute))]);
    events.trigger('self:seconds', [Math.floor((distance % (minute)) / second)]);

    if (distance < 0) {
      clearInterval(x);
      events.trigger('self:days', [0]);
      events.trigger('self:hours', [0]);
      events.trigger('self:minutes', [0]);
      events.trigger('self:seconds', [0]);
    }

  }, second);
};

function Days(element, events, options, module) {
  events.on('self:days', (value) => element.innerHTML = value);
};

function Hours(element, events, options, module) {
  events.on('self:hours', (value) => element.innerHTML = value);
};

function Minutes(element, events, options, module) {
  events.on('self:minutes', (value) => element.innerHTML = value);
};

function Seconds(element, events, options, module) {
  events.on('self:seconds', (value) => element.innerHTML = value);
};

function Countdown(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    days: element.querySelectorAll('[data-ref-days]'),
    hours: element.querySelectorAll('[data-ref-hours]'),
    minutes: element.querySelectorAll('[data-ref-minutes]'),
    seconds: element.querySelectorAll('[data-ref-seconds]')
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

  refs.days.forEach((element) => {
    var options = get_element_options(element, 'data-ref-days');

    Days(element, events, options, module);
  });

  refs.hours.forEach((element) => {
    var options = get_element_options(element, 'data-ref-hours');

    Hours(element, events, options, module);
  });

  refs.minutes.forEach((element) => {
    var options = get_element_options(element, 'data-ref-minutes');

    Minutes(element, events, options, module);
  });

  refs.seconds.forEach((element) => {
    var options = get_element_options(element, 'data-ref-seconds');

    Seconds(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-countdown]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-countdown');

  Countdown(element, options);
});
