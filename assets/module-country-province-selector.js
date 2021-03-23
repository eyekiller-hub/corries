import EventEmitter from 'wolfy87-eventemitter';
import get_element_options from './fn-get-element-options';

function Self(element, events, options, module) {};

function Country(element, events, options, module) {
  element.addEventListener('change', () => {
    var provinces = JSON.parse(element.selectedOptions[0].dataset.provinces);

    if (!provinces.length) {
      return events.trigger('country:change:no-provinces');
    }

    events.trigger('country:change:provinces', [provinces]);
  });

  if (module.options.country) {
    element.value = module.options.country;
  }

  setTimeout(() => {
    element.dispatchEvent(new Event('change'));
  });
};

function ProvinceWrap(element, events, options, module) {
  events
    .on('country:change:no-provinces', () => {
      element.style.display = 'none';
    })
    .on('country:change:provinces', (provinces) => {
      element.style.display = 'block';
    });
};

function Province(element, events, options, module) {
  events
    .on('country:change:no-provinces', () => {
      element.innerHTML = '';
    })
    .on('country:change:provinces', (provinces) => {
      var html = provinces
        .map((province) => {
          var selected = province[0] == module.options.province;

          return `
            <option value="${province[0]}" ${selected ? 'selected' : ''}>
              ${province[1]}
            </option>
          `
        })
        .join('');

      element.innerHTML = html;
    });
};

function CountryProvinceSelector(element, options) {
  var defaults = {};

  options = Object.assign({}, defaults, options);

  var events = new EventEmitter();

  var refs = {
    self: [element],
    country: element.querySelectorAll('[data-ref-country]'),
    province_wrap: element.querySelectorAll('[data-ref-province-wrap]'),
    province: element.querySelectorAll('[data-ref-province]')
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

  refs.country.forEach((element) => {
    var options = get_element_options(element, 'data-ref-country');

    Country(element, events, options, module);
  });

  refs.province_wrap.forEach((element) => {
    var options = get_element_options(element, 'data-ref-province-wrap');

    ProvinceWrap(element, events, options, module);
  });

  refs.province.forEach((element) => {
    var options = get_element_options(element, 'data-ref-province');

    Province(element, events, options, module);
  });
};

init();

function init() {
  var elements = document.querySelectorAll('[data-module-country-province-selector]');

  elements.forEach((element) => {
    var options = get_element_options(element, 'data-module-country-province-selector');

    CountryProvinceSelector(element, options);
  });
};
