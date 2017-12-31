const postcss = require('postcss');
const fs = require('fs');
const glob = require('glob');

function listCssSelectors(filenames) {
  if (!Array.isArray(filenames)) filenames = [filenames];
  if (!filenames.length) throw 'You gave me an empty array. I feel so empty inside...';
  if (filenames.some(s => !s.split)) throw `Oops! Something passed wasn't a string.`;

  // If globs were passed, boil everything down to a flat array of absolute paths.
  filenames = flattenArray(filenames.map(name => glob.sync(name, { absolute: true })));
  if (!filenames.length) {
    console.log('\n\nNo matching files found for whitelisting.');
    console.log('Proceeding with an empty array.\n\n');
    return [];
  }

  const list = filenames.map(filename => {
    const css = fs.readFileSync(filename, 'utf-8');
    const parsed = postcss.parse(css);
    return parsePostcssNodes(parsed.nodes);
  });

  return flattenArray(list);
}

function parsePostcssNodes(nodes) {
  return nodes.map(node => {
    // Regular selectors, such as `.some-class`.
    if (node.type === 'rule') return node.selector;

    // The keyframe animation name.
    if (node.type === 'atrule' && node.name === 'keyframes') return node.params;

    // Media queries - they can contain other rules & keyframes.
    if (node.type === 'atrule' && node.name === 'media') return parsePostcssNodes(node.nodes);
  }).filter(Boolean);
}

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

module.exports = listCssSelectors;
