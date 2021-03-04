var ScrollLock = (() => {
  var scroll = 0;

  function enable() {
    scroll = window.pageYOffset;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.top = 0;
    document.documentElement.style.left = 0;
    document.documentElement.style.right = 0;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scroll}px`;
    document.body.style.left = 0;
    document.body.style.right = 0;
  };

  function disable() {
    document.documentElement.style.overflow = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.left = '';
    document.documentElement.style.right = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';

    scroll && window.scrollTo(0, scroll);

    scroll = 0;
  };

  return { enable, disable };
})();

export default ScrollLock;
