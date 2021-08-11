import superagent from "superagent";

class API {
  constructor() {
    this.defaultHeaders = {};
    this.host = process.env.REACT_APP_API_HOST;
  }

  _request(method, path, headers, body, config) {
    // Generic request method (intended for internal use)
    const url = `${this.host}${path}`;
    let req = superagent[method](url);
    if (headers) {
      req.set({
        ...this.defaultHeaders,
        ...headers,
      });
    }
    if (body) {
      req.send(body);
    }
    return req;
  }

  get(path, headers, config = {}) {
    // GET request
    return this._request("get", path, headers, null, config);
  }

  post(path, headers, body, config = {}) {
    // POST request
    return this._request("post", path, headers, body, config);
  }

  put(path, headers, body, config = {}) {
    // PUT request
    return this._request("put", path, headers, body, config);
  }

  delete(path, headers, config = {}) {
    // DELETE request
    return this._request("delete", path, headers, null, config);
  }

  // Helper methods

  setDefaultHeaders(headers) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  isSuccessResponse(res) {
    return res.status >= 200 && res.status < 300;
  }

  isErrorResponse(res) {
    return res.status < 200 || res.status >= 300;
  }
}

export default new API();
