# List CSS Selectors

A simple way to list all the selectors used in your CSS file(s).

## Installation

Via [npm](https://www.npmjs.com/package/list-css-selectors):
```
npm i list-css-selectors
```


## Usage

Your CSS file:
```css
div { display: block; }

#some-id { color: red; }
.some-class { color: white; }
.hover:hover { color: blue; }

[data-noval] { opacity: 0; }
[data-test='ok'] { opacity: 1; }

@keyframes softblink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

@media screen and (min-width: 768px) and (max-width: 1024px) {
  .selector-in-media-query { width: 100%; }
}

```


Run **list-css-selectors**:
```javascript
const listSelectors = require('list-css-selectors');
const { resolve } = require('path');
const pathToMyFile = resolve(resolve(), './styles.css');
const selectors = listSelectors(pathToMyFile);
```

The results of `selectors` will be:
```javascript
[
  'div',
  '#some-id',
  '.some-class',
  '.hover::hover',
  '[data-noval]',
  '[data-test=\'ok\']',
  'softblink',
  '.selector-in-media-query'
]
```
