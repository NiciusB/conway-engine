# conway-engine [![npm version](https://badge.fury.io/js/conway-engine.svg)](https://badge.fury.io/js/conway-engine) [![Size](https://img.shields.io/bundlephobia/min/conway-engine.svg)](https://niciusb.github.io/conway-engine/dist/index.js) [![License](https://img.shields.io/npm/l/conway-engine.svg)](https://github.com/NiciusB/conway-engine/blob/master/LICENSE)

A moderately performant engine for Conway's Game of Life

## Installation

[npm][]:

```bash
npm install conway-engine
```

## Usage

conway-engine can be used both on node and on the browser. In the browser, loading it from a script tag will add it to the global scoped under the name of `ConwayEngine`


```javascript
const ConwayEngine = require('conway-engine')
const conwaysGame = new ConwayEngine()

conwaysGame.tick()
console.log(conwaysGame)
```

## Examples

See the examples folder to get a better understanding on how the library works: https://niciusb.github.io/conway-engine/examples/

## API

### `constructor([options])`


##### `options`

###### `options.width`

Number of columns the world will have

###### `options.height`

Number of rows the world will have

###### `options.initialWorld`

Describes how the world should look like at generation 0. Can be an array or a function.

If it's an array, it must be an array with `height` children, which must be arrays with `width` children, being those a boolean determining whether the cell is alive 

If it's a function, it must return a boolean determining whether the cell is alive. The first argument will be the y coordinate, and the second one the x coordinate

###### `options.seed`

If no initialWorld is provided, the engine will use a pseudorandom number generator to create the initial world, with a 20% chance of a cell being alive. The seed can be a string or a number

###### `options.rulestring`

The rulestring will be used to determine how the cells are born and die. It uses B/S notation. Check http://www.conwaylife.com/wiki/Rulestring to learn more

###### `options.enableLastTickInfo`

When enabled, cells will have a aliveLastTick property which is useful to avoid unnecessary redraws, but it reduces performance when advancing generations

###### `options.wrapOnEdges`

When enabled, the edges of the world will be treated as if they were adjactent to the other side

### `tick()`

Advances to next generation

## License

[MIT][license] © [Nuno Balbona][author]

<!-- Definitions -->

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: https://balnbona.me
