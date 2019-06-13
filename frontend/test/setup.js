const jsdom = require('jsdom').jsdom;
const fetch = require('isomorphic-fetch');

const exposedProperties = ['window', 'navigator', 'document'];
const baseDOM = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>';

global.document = jsdom(baseDOM);
global.window = document.defaultView;
global.navigator = window.navigator;
global.fetch = fetch;

global.localStorage = global.sessionStorage = {
  getItem: function (key) {
    return this[key];
  },
  setItem: function (key, value) {
    this[key] = value;
  },
  removeItem: function (key) {
    delete this[key];
  }
};

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

function noop() {
  return null;
}

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.md'] = noop;
require.extensions['.png'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.gif'] = noop;
