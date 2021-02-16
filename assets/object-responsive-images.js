import W from './object-window';
import Breakpoint from './object-breakpoint';

function ResponsiveImage(element) {
  this.element = element;
}

ResponsiveImage.prototype.src = function () {
  var src = this.element.getAttribute('data-src');
  var attribute = null;

  for ( var breakpoint in Breakpoint ) {
    if ( Breakpoint[breakpoint] ) {
      attribute = 'data-src-' + breakpoint.replace('_', '-');
      src = this.element.getAttribute(attribute) || src;
    }
  }

  return src;
};

ResponsiveImage.prototype.load = function (callback) {
  var self = this;
  var element = this.element;
  var src = this.src();
  var image = new Image();

  image.onload = function () {
    if ( element.nodeName == 'IMG' ) {
      element.src = src;
    } else {
      element.style.backgroundImage = 'url(' + src + ')';
    }

    callback.call(self);
  };

  image.src = src;
};

var ResponsiveImages = (() => {
  var offset = W.height() * (Breakpoint.medium_down ? 3 : 1.5);

  var load = (element = document) => {
    Array.prototype.slice.call(element.querySelectorAll('[data-src]'))
      .filter(function (img) {
        return !img.hasAttribute('data-lazy');
      })
      .filter(function (img) {
        return W.inview(img, offset)
      })
      .map(function (img) {
        return new ResponsiveImage(img);
      })
      .forEach(function (img, index) {
        img.load(function () {
          this.element.classList.add('is-loaded');
        });
      });
  };

  var load_lazy = (element) => {
    var image_elements = element.querySelectorAll('[data-src][data-lazy]');

    image_elements.forEach((image_element) => {
      image_element.removeAttribute('data-lazy');
    });

    load(element);
  };

  var load_lazy_swiper = (swiper) => {
    Array.from(swiper.slides).forEach((slide) => {
      if (slide.classList.contains('swiper-slide-visible')) {
        ResponsiveImages.load_lazy(slide);
      }
    });
  };

  return {
    offset: offset,
    load: load,
    load_lazy: load_lazy,
    load_lazy_swiper: load_lazy_swiper
  };
})();

export default ResponsiveImages;
