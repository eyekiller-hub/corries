function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 100);

  var last = null;
  var deferTimer = null;

  return function () {
    var context = scope || this;
    var now = +new Date;
    var args = arguments;

    if ( last && now < last + threshhold ) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};

export default throttle;
