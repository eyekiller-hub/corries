var min_breakpoints = {
  'medium': 768,
  'large': 1024,
  'xlarge': 1161
};

var max_breakpoints = {
  'xsmall': 480,
  'small': 767,
  'medium-down': 1023,
  'large-down': 1160
};

var Breakpoint = {
  get small() {
    return matchMedia('(max-width: ' + max_breakpoints.small + 'px)').matches;
  },

  get medium() {
    return matchMedia('(min-width: ' + min_breakpoints.medium + 'px)').matches;
  },

  get medium_down() {
    return matchMedia('(max-width: ' + max_breakpoints['medium-down'] + 'px)').matches;
  },

  get large() {
    return matchMedia('(min-width: ' + min_breakpoints.large + 'px)').matches;
  },

  get large_down() {
    return matchMedia('(max-width: ' + max_breakpoints['large-down'] + 'px)').matches;
  },

  get xlarge() {
    return matchMedia('(min-width: ' + min_breakpoints.xlarge + 'px)').matches;
  },

  get current() {
    var viewport = window.innerWidth;
    var current = [];

    for ( var breakpoint in min_breakpoints ) {
      if ( viewport >= min_breakpoints[breakpoint] ) {
        current.push(breakpoint);
      }
    }

    for ( var breakpoint in max_breakpoints ) {
      if ( viewport <= max_breakpoints[breakpoint] ) {
        current.push(breakpoint);
      }
    }

    return current;
  },

  max: function (width) {
    return matchMedia('(max-width: ' + width + ')').matches;
  },

  min: function (width) {
    return matchMedia('(min-width: ' + width + ')').matches;
  },

  min_breakpoints: min_breakpoints,

  max_breakpoints: max_breakpoints,

  all_breakpoints: Object.assign({}, min_breakpoints, max_breakpoints)
};

export default Breakpoint;
