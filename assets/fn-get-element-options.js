function get_element_options(element, attribute) {
  var options = element.getAttribute(attribute);

  if (!options) {
    if (element.firstElementChild) {
      if (element.firstElementChild.tagName == 'SCRIPT') {
        if (element.firstElementChild.type == 'text/template') {
          options = element.firstElementChild.innerHTML;
        }
      }
    }
  }

  options = JSON.parse(options || '{}');

  return options;
};

export default get_element_options;
