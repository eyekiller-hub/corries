import EventEmitter from 'wolfy87-eventemitter';
import Events from './object-events';
import get_element_options from './fn-get-element-options';
import transform_liquid_attributes from './fn-transform-liquid-attributes';
import pagination from './fn-pagination';

function Self(element, events, options, module) {
  Events.once('collection-body--or:products:render:success', render);

  function render(collection_body_products_length, collection_body_options) {
    var pages = Math.ceil(collection_body_products_length / collection_body_options.limit);

    var parts = pagination(collection_body_options.page, pages);

    var parts_html = parts
      .map((part) => {
        var part_url = `${window.location.pathname}?page=${part}`;

        var part_title = part;

        var part_active = part == collection_body_options.page;

        var part_class_name = part_active ? options.part_active_class_name_template : options.part_inactive_class_name_template;

        var part_attributes = '';

        if (part == '...') {
          part_url = window.location.pathname;
        }

        return transform_liquid_attributes(options.part_template, {
          part_url: part_url,
          part_title: part_title,
          part_class_name: part_class_name,
          part_attributes: part_attributes
        });
      })
      .join('');

    var html = transform_liquid_attributes(options.template, {
      parts: parts_html
    });

    element.innerHTML = html;

    setTimeout(() => Events.trigger('collection-pagination--or:render:success'));
  };
};

function PartLink(element, events, options, module) {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    var page = +(element.href.split('?page=').pop().split('&')[0]);

    if (!page) {
      return;
    }

    Events.trigger('collection-pagination--or:part-link:click', [page]);
  });
};

function CollectionPaginationOr(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    part_link: element.querySelectorAll('[data-ref-part-link]')
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

  refs.part_link.forEach((element) => {
    var options = get_element_options(element, 'data-ref-part-link');

    PartLink(element, events, options, module);
  });
};

Events.once('collection-body--or:products:init', () => {
  init();

  Events.on('collection-pagination--or:render:success', init);
});

function init() {
  var elements = document.querySelectorAll('[data-module-collection-pagination--or]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-collection-pagination--or');

    CollectionPaginationOr(element, options);
  });
};
