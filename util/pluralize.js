/**
 * Pluralization copy helper.
 * @param {string} word - singular version of word to pluralize
 * @param {number} val - count to determine whether this is plural
 * @param {?string} pluralVersion - plural version of the desired word for when
 *   adding an "s" isn't right, e.g. man => men
 * @returns {string} 's' or nothing
 */
const pluralize = (word, val, pluralVersion = null) => {
  if (val === 1) {
    return word;
  }
  if (pluralVersion) {
    return pluralVersion;
  }
  return `${word}s`;
};

export default pluralize;
