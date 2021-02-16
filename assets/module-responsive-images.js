import debounce from './fn-debounce';
import throttle from './fn-throttle';
import ResponsiveImages from './object-responsive-images';

var is_theme_customiser = window.location.href.includes('design_theme_id=');

ResponsiveImages.load();

window.addEventListener('scroll', throttle(() => {
  ResponsiveImages.load();
}));

window.addEventListener('resize', debounce(() => {
  ResponsiveImages.load();
}));

if (is_theme_customiser) {
  document.querySelectorAll('*').forEach((element) => {
    element.addEventListener('shopify:section:load', () => {
      ResponsiveImages.load();
    })
  });
}
