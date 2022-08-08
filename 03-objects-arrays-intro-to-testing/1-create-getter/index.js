/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const parseUrl = path.split('.');

  return obj => {
    for (const item of parseUrl) {
      if (!obj) {
        break;
      }
      obj = obj[item];
    }
    return obj;
  };
}
