const postcss = require('postcss');
const fs = require('fs');
const glob = require('glob');
const sanitizeArgs = require('./sanitizeArgs.js');
const flattenArray = require('./flattenArray.js');

function listCssSelectors(filenames) {
  filenames = sanitizeArgs(filenames);
  if (!filenames.length) return [];

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

module.exports = listCssSelectors;
