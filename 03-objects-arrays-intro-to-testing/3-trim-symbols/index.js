/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let counter = 0;
  let currentEl = string[0];
  let resultString = "";

  if (size === undefined) {
    return string;
  }

  for (let i = 0; i < string.length; i++) {
    if (currentEl === string[i]) {
      counter++;
    } else {
      counter = 1;
    }

    if (counter <= size) {
      resultString += string[i];
    }

    currentEl = string[i];
  }

  return resultString;
}
