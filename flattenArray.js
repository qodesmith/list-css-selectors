function flattenArray(arr) {
  if (!Array.isArray(arr)) return arr;

  let finalArray = [];

  arr.forEach(thing => {
    if (Array.isArray(thing)) {
      finalArray = finalArray.concat(flattenArray(thing));
    } else {
      finalArray.push(thing);
    }
  });

  return finalArray;
}

module.exports = flattenArray;
