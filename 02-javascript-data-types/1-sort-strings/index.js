/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortedArr = [...arr];
  const collator = new Intl.Collator(['ru', 'en'], { caseFirst: "upper" });

  const directions = {
    "asc": 1,
    "desc": -1
  };
     
  function customSort(a, b) {
    return directions[param] * collator.compare(a, b);
  }

  return sortedArr.sort(customSort);
}
