function transform_liquid_attributes(string, attributes) {
  var new_string = string;

  Object.keys(attributes).forEach((attribute) => {
    new_string = new_string
      .replace(new RegExp(`{{ ${attribute} }}`, 'g'), attributes[attribute]);
  });

  return new_string;
};

export default transform_liquid_attributes;
