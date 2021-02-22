import EventEmitter from 'wolfy87-eventemitter';
import * as Images from '@shopify/theme-images';
import get_element_options from './fn-get-element-options';
import Events from './object-events';
import transform_liquid_attributes from './fn-transform-liquid-attributes';
import ResponsiveImages from './object-responsive-images';
import money from './fn-money';

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
      if (!options.value) {
        return;
      }

      show();
    })
    .on('self:focusout', hide);

  Events
    .on(`search-form-input:${options.search_form_input_id}:change`, (value) => {
      options.value = value;
      show();
    })
    .on(`search-form-input:${options.search_form_input_id}:empty`, () => {
      options.value = '';
      hide();
    })
    .on(`search-form-input:${options.search_form_input_id}:change`, render);

  function show() {
    element.classList.add('is-active');
  };

  function hide() {
    element.classList.remove('is-active');
  };

  function render(query) {
    get_results(query)
      .then((res) => {
        if (!res.resources.results.products.length) {
          return events.trigger('self:empty', [query]);
        }

        events.trigger('self:results', [query, res.resources.results]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function get_results(query) {
    var url = `/search/suggest.json?q=${query}&resources[type]=product&limit=4`;

    return fetch(url, {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });
  }
};

function Body(element, events, options, module) {
  events
    .on('self:empty', render_empty)
    .on('self:results', render_results);

  function render_empty(query) {
    var html = transform_liquid_attributes(module.options.empty_template, {
      query: query
    });

    element.innerHTML = html;
  };

  function render_results(query, results) {
    var results_html = results.products
      .map((product) => {
        var compare_at_price_html = '';

        var image_url = product.featured_image.url || window.theme_settings.misc_images_fallback_image_url;

        var image_alt = product.featured_image.alt || window.theme_settings.misc_images_fallback_image_alt;

        var from = '';

        if (+(product.price_max) != +(product.price_min)) {
          from = window.theme_locales.products.product.from;
        }

        if (+(product.compare_at_price_min)) {
          compare_at_price_html = transform_liquid_attributes(module.options.result_compare_at_price_template, {
            compare_at_price: money(product.compare_at_price_min)
          });
        }

        return transform_liquid_attributes(module.options.result_template, {
          url: product.url,
          title: product.title,
          from: from,
          price: money(product.price_min),
          compare_at_price: compare_at_price_html,
          image_url: Images.getSizedImageUrl(image_url, '100x'),
          image_alt: image_alt
        });
      })
      .join('');

    var html = transform_liquid_attributes(module.options.results_template, {
      query: query,
      results: results_html,
      result_count: results.products.length
    });

    element.innerHTML = html;

    ResponsiveImages.load();
  };
};

function SearchFormPredictiveResults(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    body: element.querySelectorAll('[data-ref-body]')
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

  refs.body.forEach((element) => {
    var options = get_element_options(element, 'data-ref-body');

    Body(element, events, options, module);
  });
};

var elements = document.querySelectorAll('[data-module-search-form-predictive-results]');

elements.forEach((element) => {
  var options = get_element_options(element, 'data-module-search-form-predictive-results');

  SearchFormPredictiveResults(element, options);
});
