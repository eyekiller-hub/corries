import EventEmitter from 'wolfy87-eventemitter';
import ResponsiveImages from './object-responsive-images';
import get_element_options from './fn-get-element-options';
import Swiper from 'swiper';
import Breakpoint from './object-breakpoint';
import Events from './object-events';

function Self(element, events, options, module) {
  if (!options.slide_product_variants) {
    return;
  }

  Events.on('productform:variantchange', (variant) => {
    var variant_slide_index = options.slide_product_variants.findIndex((slide_product_variants_set) => {
      var slide_product_variant_ids = slide_product_variants_set.map((slide_product_variants_set_item) => {
        return slide_product_variants_set_item.id;
      });

      return slide_product_variant_ids.includes(variant.id);
    });

    if (variant_slide_index >= 0) {
      events.trigger('self:product-variant:active', [variant_slide_index]);
    }
  });
};

function Container(element, events, options, module) {
  var default_swiper_options = {
    autoHeight: true,
    watchSlidesVisibility: true,
    on: {
      init: function() {
        setTimeout(() => events.trigger('container:init', [this.activeIndex]));
        setTimeout(() => events.trigger(`container:init:${this.activeIndex}`, [this.activeIndex]));
        ResponsiveImages.load_lazy_swiper(this);
      },
      slideChange: function() {
        events.trigger('container:slide-change', [this.activeIndex]);
        setTimeout(() => events.trigger(`container:slide-change:${this.activeIndex}`, [this.activeIndex]));
        ResponsiveImages.load_lazy_swiper(this);
      }
    },
    pagination: {
      el: module.refs.pagination,
      clickable: true
    },
    navigation: {
      prevEl: module.refs.previous,
      nextEl: module.refs.next
    }
  };

  var element_swiper_options = get_element_swiper_options();

  var swiper_options = Object.assign({}, default_swiper_options, element_swiper_options);

  var swiper = new Swiper(element, swiper_options);

  events
    .on('self:product-variant:active', (variant_slide_index) => {
      swiper.slideTo(variant_slide_index);
    })
    .on(`slide-to:click`, (slide_to_index) => {
      swiper.slideTo(slide_to_index);
    });

  if (module.options.breakpoints) {
    if (!Breakpoint.current.some((value) => module.options.breakpoints.includes(value))) {
      swiper_destroy();
    }
  }

  if (module.options.update_events) {
    module.options.update_events.forEach((update_event) => {
      Events.on(update_event, () => swiper.update());
    });
  }

  function get_element_swiper_options() {
    var element_swiper_options =  module.options.swiper || {};

    if (element_swiper_options.breakpoints) {
      Object.keys(element_swiper_options.breakpoints).forEach((key) => {
        var value = element_swiper_options.breakpoints[key];
        var breakpoint = Breakpoint.all_breakpoints[key];

        element_swiper_options.breakpoints[breakpoint] = value;

        delete element_swiper_options.breakpoints[key];
      });
    }

    var element_swiper_options_string = JSON.stringify(element_swiper_options, null, 2);

    var css_variable_map = element_swiper_options_string.match(/"var\(.*\)"/g) || [];

    if (!css_variable_map.length) {
      return element_swiper_options;
    }

    css_variable_map = css_variable_map
      .reduce((acc, css_variable_map_item) => {
        var css_variable_name = css_variable_map_item.split('var(').pop().split(')')[0];

        var css_variable_value = getComputedStyle(document.documentElement).getPropertyValue(css_variable_name);

        var div = document.createElement('div');
        div.style.visibility = 'hidden';
        div.style.position = 'absolute';
        div.style.height = css_variable_value;
        document.body.appendChild(div);
        acc[css_variable_map_item] = div.offsetHeight;
        div.remove();

        return acc;
      }, {});

    Object.keys(css_variable_map).forEach((css_variable_map_key) => {
      var css_variable_map_item = css_variable_map[css_variable_map_key];

      element_swiper_options_string = element_swiper_options_string
        .split(css_variable_map_key)
        .join(css_variable_map_item);
    });

    element_swiper_options = JSON.parse(element_swiper_options_string);

    return element_swiper_options;
  };

  function swiper_destroy() {
    swiper.destroy(true, true);
    element.classList.remove('swiper-container');
    element.firstElementChild.classList.remove('swiper-wrapper');

    Array.from(element.firstElementChild.children).forEach((slide_element) => {
      slide_element.classList.remove('swiper-slide');
    });
  };
};

function SlideTo(element, events, options, module) {
  element.addEventListener('click', (event) => {
    event.preventDefault();
    events.trigger(`slide-to:click`, [options.index]);
    events.trigger(`slide-to:click:${options.index}`, [options.index]);
  });

  events
    .on('container:init', is_inactive)
    .on('container:slide-change', is_inactive)
    .on(`container:init:${options.index}`, is_active)
    .on(`container:slide-change:${options.index}`, is_active);

  function is_inactive(activeIndex) {
    element.classList.remove('is-active');
  };

  function is_active(activeIndex) {
    element.classList.add('is-active');
  };
};

function Slider(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    container: element.querySelectorAll('[data-ref-container]'),
    pagination: element.querySelectorAll('[data-ref-pagination]'),
    previous: element.querySelectorAll('[data-ref-previous]'),
    next: element.querySelectorAll('[data-ref-next]'),
    slide_to: element.querySelectorAll('[data-ref-slide-to]')
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

  refs.container.forEach((element) => {
    var options = get_element_options(element, 'data-ref-container');

    Container(element, events, options, module);
  });

  refs.slide_to.forEach((element) => {
    var options = get_element_options(element, 'data-ref-slide-to');

    SlideTo(element, events, options, module);
  });
};

init();

document.addEventListener('shopify:section:load', init);

function init() {
  var elements = document.querySelectorAll('[data-module-slider]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-slider');

    Slider(element, options);
  });
};
