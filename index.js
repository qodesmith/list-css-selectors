const postcss = require('postcss');
const fs = require('fs');
const sanitizeArgs = require('./sanitizeArgs.js');
const flattenArray = require('./flattenArray.js');

function listCssSelectors(filenames) {
  // Uses `glob` to create an array of absolute paths for the files.
  filenames = sanitizeArgs(filenames);
  if (!filenames.length) return [];

  const list = filenames.map(filename => {
    const css = fs.readFileSync(filename, 'utf-8');
    const parsed = postcss.parse(css);
    return parsePostcssNodes(parsed.nodes);
  });

  return flattenArray(list)
    .map(item => item && item.trim && item.trim())
    .filter(Boolean);
}

function parsePostcssNodes(nodes) {
  return nodes.map(node => {
    /*
      Some selectors come back with new line characters in them.
      These are left as is. You can use a package like `css-what`
      to further parse things like that. The package is a companion
      to `purgecss-whitelister` which uses `css-what` under the hood.
    */

    // Regular selectors such as `.some-class`, `#some-id`, etc.
    if (node.type === 'rule') return node.selector;

    if (node.type === 'atrule') {
      switch (node.name) {
        // The keyframe animation name.
        case 'keyframes':
          return node.params;

        /*
          https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
          Nested @ rules that can contain other rules & keyframes.
          Media & supports queries - can contain other rules & keyframes.
        */
        case 'media':
        case 'supports':
        case 'document':
          return parsePostcssNodes(node.nodes);
        default:
          return null;
      }
    }
  });
}

module.exports = listCssSelectors;
