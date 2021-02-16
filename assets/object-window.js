var w = window;
var d = document.documentElement;

var W = {
  scroll_top: function () {
    return w.pageYOffset || d.scrollTop;
  },
  width: function () {
    return w.innerWidth || d.clientWidth;
  },
  height: function () {
    return w.innerHeight || d.clientHeight;
  },
  inview: function (element, offset) {
    var offset = offset || 200;
    var window_top = this.scroll_top();
    var window_bottom = window_top + w.innerHeight;
    var box = element.getBoundingClientRect();
    var box_top = box.top + window_top;
    var box_bottom = box.bottom + window_top;

    return box_bottom >= window_top - offset && box_top <= window_bottom + offset;
  }
};

export default W;
