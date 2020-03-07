export default (str = '') =>
  str.replace(/\/\*.*\*\//g, ' ').replace(/\s+/g, ' ');
