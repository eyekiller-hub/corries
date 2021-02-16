function get_document_element(url) {
  return fetch(url, { credentials: 'same-origin' })
    .then((res) => res.text())
    .then((res) => {
      var document_element = document.createElement('div');

      document_element.innerHTML = res;

      return document_element;
    });
};

export default get_document_element;
