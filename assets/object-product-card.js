import transform_liquid_attributes from './fn-transform-liquid-attributes';
import money from './fn-money';

var ProductCard = { render };

function render({
  product,
  template,
  collection,
  money_format,
  grid_item_class_name_template,
}) {
  var variant = product.first_available_variant || product.variants[0];

  var from = product.price_varies ? window.theme_locales.products.product.from : '';

  var copy = `${(product.metafields && product.metafields.card && `${from} ${product.metafields.card.copy}`) || ''}`;

  var promo_badge_copy = (product.metafields && product.metafields.promo_badge && product.metafields.promo_badge.copy) || '';

  var tag_badge_html = product.custom.product_tag_badge ? `
    <img data-src="${product.custom.product_tag_badge.image_url}" alt="${product.custom.product_tag_badge.image_alt}" />
  ` : '';

  var bis_product_data = {
    id: product.id,
    handle: product.handle,
    available: product.available,
    tags: product.tags,
    variants: product.variants.map((variant) => {
      return {
        id: variant.id,
        available: variant.available,
        title: variant.title,
        inventory_quantity: variant.inventory_quantity,
        inventory_management: variant.inventory_management
      };
    })
  };

  bis_product_data = JSON.stringify(bis_product_data)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');


  var product_card = transform_liquid_attributes(template, {
    url: `/collections/${collection.handle}${product.url}`,
    image_url: product.featured_image.src,
    image_alt: product.featured_image.alt,
    image_box_ratio: `${product.featured_image.height / product.featured_image.width * 100}%`,
    image_attributes: '',
    title: product.title,
    price: money(product.price, money_format),
    compare_at_price_min: money(product.compare_at_price_min, money_format),
    price_varies: money(product.price_varies, money_format),
    price_min: money(product.price_min, money_format),
    from: from,
    copy: copy,
    copy_class: copy ? '' : 'hide',
    price_class: product.compare_at_price_min > product.price_min ? 'text-color-red' : '',
    compare_at_price_min_class: product.compare_at_price_min > product.price_min ? '' : 'hide',
    product_json: JSON.stringify(product).replaceAll("'", ''),
    first_available_variant_id: variant.id,
    product_id: product.id,
    submit_html: variant.available ? window.theme_locales.products.product.add_to_cart : window.theme_locales.products.product.sold_out,
    submit_class: variant.available ? '' : 'BIS_trigger',
    submit_attributes: variant.available ? '' : `data-product-data="${bis_product_data}"`,
    promo_badge_class: promo_badge_copy ? '' : 'hide',
    promo_badge_copy: promo_badge_copy,
    tag_badge_html: tag_badge_html,
    tag_badge_class: tag_badge_html ? '' : 'hide',
  });

  return `
    <div class="${grid_item_class_name_template}">
      ${product_card}
    </div>
  `;
}

export default ProductCard;
