function debounce(fn, wait, immediate) {
  var timeout;

  wait || (wait = 100);

  return function () {
    var context = this, args = arguments;

    var later = function() {
      timeout = null;

      if ( !immediate ) {
        fn.apply(context, args);
      }
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if ( callNow ) {
      fn.apply(context, args);
    }
  };
};

export default debounce;
