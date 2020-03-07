/**
 * @typedef SelectOption
 * @property {string} label
 * @property {string} value
 */

/**
 * Takes an array of either strings or objects with label & value properties and
 * returns an array that is entirely label & value objects. For use in various
 * form controls.
 * @param {Array<string|SelectOption>} options
 * @retrn
 */
const mapOptions = options =>
  options.map(item =>
    typeof item !== 'object' ? { label: item, value: item } : item
  );

export default mapOptions;
