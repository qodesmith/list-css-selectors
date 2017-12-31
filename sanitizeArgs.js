const glob = require('glob');
const flattenArray = require('./flattenArray.js');

function sanitizeArgs(arr) {
  if (!Array.isArray(arr)) arr = [arr];
  arr = arr.filter(Boolean);

  // Avoids errors if an empty array, no arguments, or falsey things are passed.
  if (!arr.length) {
    console.log('\n\nNo items for processing. Moving right along...\n\n');
    return [];
  }

  // Each thing in the array must be a string.
  if (arr.some(s => !s.split)) throw `Oops! Something passed wasn't a string.`;

  // If globs were passed, boil everything down to a flat array of absolute paths.
  arr = flattenArray(arr.map(name => glob.sync(name, { absolute: true })));

  // If, at the end of it all, we have nothing, left empty-handed.
  if (!arr.length) {
    console.log('\n\nNo matching files found.\n\n');
    return [];
  }

  return arr;
}

module.exports = sanitizeArgs;
