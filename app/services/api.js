import fetch from 'isomorphic-fetch';

class RequestError extends Error {
  constructor(response) {
    super(response.statusText);
    this.status = response.status;
    this.response = response;
  }
}

export const requestApi = (apiUrl) => async (method, path, params, headers = {}) => {
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: params && JSON.stringify(params),
  };

  const response = await fetch(`${apiUrl}/${path}`, options);
  if (response.status >= 200 && response.status < 300) {
    const json = await response.json();
    return json;
  }

  if (response.status < 500) {
    throw new RequestError(response);
  }

  throw new Error('Server error');
};

