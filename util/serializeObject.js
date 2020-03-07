/**
 * Takes an object and returns a URL query string of its key/value pairs.
 * @param {Object} obj
 * @return {String}
 */
function serializeObject(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      const v = typeof value === 'object' ? JSON.stringify(value) : value;
      return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
    })
    .join('&');
}
export default serializeObject;
