/**
 * Waits for a specified amount of time, returning a promise so this can be used
 * with async/await.
 * @param {number} ms - time in milliseconds to wait before resolving
 * @return {Promise}
 */
function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default wait;
