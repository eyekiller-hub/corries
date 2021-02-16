import EventEmitter from "wolfy87-eventemitter";
import Events from "./object-events";
import ResponsiveImages from "./object-responsive-images";
import get_element_options from "./fn-get-element-options";
import Swiper from "swiper";

function Self(element, events, options, module) {
  module.options.slides_variant_ids = [];
};

function Slider(element, events, options, module) {
  var swiper = new Swiper(element, {
    autoHeight: true,
    navigation: {
      prevEl: module.refs.previous,
      nextEl: module.refs.next,
      disabledClass: "is-disabled"
    },
    pagination: {
      el: module.refs.slide.length > 1 && module.refs.pagination,
      clickable: true
    },
    watchSlidesVisibility: true,
    on: {
      init: function() { ResponsiveImages.load_lazy_swiper(this) },
      slideChange: function() { ResponsiveImages.load_lazy_swiper(this) }
    }
  });

  events.on("slide:active", (index) => {
    swiper.slideTo(index);
  });
};

function Slide(element, events, options, module) {
  module.options.slides_variant_ids[options.index] = options.variant_ids;

  Events.on(`productform:${module.options.product_id}:variantchange`, (variant) => {
    if (options.variant_ids.includes(variant.id)) {
      events.trigger("slide:active", [options.index]);
    }
  });
};

function ImageGallerySlider(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    slider: element.querySelectorAll("[data-ref-slider]"),
    slide: element.querySelectorAll("[data-ref-slide]"),
    previous: element.querySelectorAll("[data-ref-previous]"),
    next: element.querySelectorAll("[data-ref-next]"),
    pagination: element.querySelectorAll("[data-ref-pagination]")
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

  refs.slider.forEach((element) => {
    var options = get_element_options(element, "data-ref-slider");

    Slider(element, events, options, module);
  });

  refs.slide.forEach((element) => {
    var options = get_element_options(element, "data-ref-slide");

    Slide(element, events, options, module);
  });
};

var elements = document.querySelectorAll("[data-module-image-gallery-slider]");

elements.forEach((element) => {
  var options = get_element_options(element, "data-module-image-gallery-slider");

  ImageGallerySlider(element, options);
});
