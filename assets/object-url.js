var Url = {
  update: (value) => history.replaceState(null, null, value),

  update_param: (key, value) => {
    var url_params = new URLSearchParams(window.location.search);

    url_params.set(key, value);

    history.replaceState(null, null, `?${url_params}`);
  }
};

export default Url;
