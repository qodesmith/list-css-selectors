const postcss = require('postcss');
const fs = require('fs');
const glob = require('glob');
const sanitizeArgs = require('./sanitizeArgs.js');
const flattenArray = require('./flattenArray.js');
const scss = require('postcss-scss');
const less = require('postcss-less');
const what = require('css-what');


/*
  Takes a string or array of strings which represent css file names,
  parses those files, and returns an array of strings representing
  CSS selectors in those files.
*/
function listSelectors(filenames) {
  filenames = sanitizeArgs(filenames);
  if (!filenames.length) return [];

  const list = filenames.map(filename => {
    const ext = filename.split('.').pop();
    const data = fs.readFileSync(filename, 'utf-8');

    if (ext === 'scss' || ext === 'sass') return parseScss(data);
    if (ext === 'less') return parseLess(data);
    return parseCss(data);
  });

  // Remove duplicates from the results.
  return Array.from(new Set(flattenArray(list)));
}

function whatify(str) {
  const final = [];
  let selectors;

  try {
    selectors = flattenArray(what(str));
  } catch(e) {
    return null;
  }

  return selectors.map(selector => selector.reduce((acc, part) => {

  }, ''));
}

function parseCss(data) {
  console.log(postcss.parse(data).nodes[1])
  return postcss.parse(data).nodes.map(node => {
    // Regular selectors, such as `.some-class`.
    if (node.type === 'rule') return node.selector;

    // The keyframe animation name.
    if (node.type === 'atrule' && node.name === 'keyframes') return node.params;

    // Media queries - they can contain other rules & keyframes.
    if (node.type === 'atrule' && node.name === 'media') return parseCss(node.nodes);
  }).filter(Boolean);
}

function parseScss(data) {
  console.log(postcss)
  // const { nodes } = postcss.parse(data, { parse: scss });
  // console.log(nodes[0].nodes)
  // return processScssNodes(nodes);
}

function processScssNodes(nodes) {
  let final = [];

  nodes.forEach(node => {
    if (node.type === 'rule') {
      final.push(node.selector);
      if (node.nodes) final = final.concat(processScssNodes(node.nodes));
    }
    if (node.type === 'atrule' && node.name === 'keyframes') final.push(node.params);
    if (node.type === 'atrule' && node.name === 'media') final = final.concat(processScssNodes(node.nodes));
  });

  return final;
}

function parseLess(data) {
  const { nodes } = less.parse(data);
  return processLessNodes(nodes);
}

function processLessNodes(nodes) {
  let final = [];

  nodes.forEach(node => {
    if (node.empty) return;
    if (node.type === 'rule') {
      final.push(node.selector);
      if (node.nodes) final = final.concat(processLessNodes(node.nodes));
    }
    if (node.type === 'atrule' && node.name === 'keyframes') final.push(node.params);
    if (node.type === 'atrule' && node.name === 'media') final = final.concat(processLessNodes(node.nodes));
  });

  return final;
}

module.exports = listSelectors;
