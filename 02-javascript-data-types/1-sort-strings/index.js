/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let sortedArr = [...arr];
  const collator = new Intl.Collator(['ru', 'en'], { caseFirst: "upper" });
  function ascSort(a, b) {
    return collator.compare(a, b);
  }
     
  function descSort(a, b) {
    return collator.compare(b, a);
  }

  if (param === 'desc') {
    return sortedArr.sort(descSort);
  } else {
    return sortedArr.sort(ascSort);
  }
}
