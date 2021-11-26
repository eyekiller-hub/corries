import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';
import Events from './object-events';

if ((typeof Shopify) === 'undefined') { window.Shopify = {}; }
  /* Get from cart.js returns the cart in JSON */
  if ((typeof Shopify.getCart) === 'undefined') {
  Shopify.getCart = function(callback, cart) {
    var promise = jQuery.Deferred();
    if( !callback){
      callback = promise.resolve;
    }
    if(!cart){    
      var o = (new Date).getTime();
      jQuery.ajax({
        type: "GET",
        url: "/cart.js?_=" + o,
        dataType: "json",
        async: false,
        success: function (cart, textStatus, xhr) {
          if ((typeof callback) === 'function') {
            return callback(cart,textStatus, xhr);
          }
          else if(typeof Shopify.onCartUpdate ==='function') {
            return Shopify.onCartUpdate(cart);
          }
        }
      })
    }else{
      if ((typeof callback) === 'function') {
      callback(cart);
    }else if(typeof Shopify.onCartUpdate ==='function') {
      Shopify.onCartUpdate(cart);
        }
    }
    return promise;
  }
}

function Self(element, events, options, module) {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    Events.trigger('cartchange:click');

    fetch('/cart/update.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates: {
          [options.key]: options.quantity
        }
      })
    })
      .then((res) => res.json())
      .then((res) => {
        Shopify.getCart(function(res){
          Events.trigger('cartchange:success', [res]);
        },res);
      })
      .catch((err) => {
        console.log({err});
      });
  });
};

function CartChange(element, options) {
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

init();

Events.on('minicart:self:rendersuccess', init);

function init() {
  var elements = document.querySelectorAll('[data-module-cart-change]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-cart-change');

    CartChange(element, options);
  });
};
