export function setQueryParameter(parameter, value) {
  // Construct URLSearchParams object instance from current URL querystring.
  const queryParams = new URLSearchParams(window.location.search);

  // Set new or modify existing parameter value.
  queryParams.set(parameter, value);

  // Replace current querystring with the new one.
  history.replaceState(null, null, '?'+queryParams.toString());
}
