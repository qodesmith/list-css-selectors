function flattenArray(arr) {
  const isArray = Array.isArray(arr);
  if (!isArray) return arr;

  let finalArray = [];

  arr.forEach(thing => {
    if (isArray) {
      finalArray = finalArray.concat(flattenArray(thing));
    } else {
      finalArray.push(thing);
    }
  });

  return finalArray;
}

module.exports = flattenArray;
