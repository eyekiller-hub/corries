import debounce from './fn-debounce';
import throttle from './fn-throttle';
import ResponsiveImages from './object-responsive-images';

ResponsiveImages.load();

window.addEventListener('scroll', throttle(() => {
  ResponsiveImages.load();
}));

window.addEventListener('resize', debounce(() => {
  ResponsiveImages.load();
}));

document.addEventListener('shopify:section:load', () => {
  ResponsiveImages.load();
});
