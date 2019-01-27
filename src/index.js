const generateLookupTable = require('./generateLookupTable')
const Cell = require('./Cell')
const Alea = require('alea')

function GameOfLife (options = {}) {
  this.options = options
  if (this.options.width === undefined) this.options.width = 100
  if (this.options.height === undefined) this.options.height = 100
  if (this.options.seed === undefined) this.options.seed = Date.now()
  if (this.options.initialWorld === undefined) this.options.initialWorld = false
  if (this.options.rulestring === undefined) this.options.rulestring = 'B3/S23'
  if (this.options.enableLastTickInfo === undefined) this.options.enableLastTickInfo = false
  if (this.options.wrapOnEdges === undefined) this.options.wrapOnEdges = false

  this.__initializeWorld = function (width, height) {
    this.lookupTable = generateLookupTable(this.options.rulestring)
    let prng = null
    if (!this.options.initialWorld) prng = new Alea(this.options.seed)

    // Generate world
    this.world = []
    for (let y = 0; y < height; y++) {
      this.world.push([])
      for (let x = 0; x < width; x++) {
        // Determine wheter the cell is initially alive
        let alive = null
        if (this.options.initialWorld) {
          // initialWorld can take a function or an array
          if (typeof this.options.initialWorld === 'function') alive = this.options.initialWorld(y, x)
          else if (Array.isArray(this.options.initialWorld[y]) && this.options.initialWorld[y][x] !== 'undefined') alive = this.options.initialWorld[y][x]
          else throw new Error('[conway-engine] Invalid initialWorld option')
        } else alive = prng() < 0.2
        this.world[y].push(new Cell(x, y, alive))
      }
    }

    // Generate oldState to avoid creating new arrays every tick
    this.__oldState = []
    for (let y = 0; y < height + 2; y++) {
      this.__oldState.push([])
      for (let x = 0; x < width + 2; x++) {
        this.__oldState[y].push(false)
      }
    }
  }

  this.__set_oldState_withWrap = function () {
    for (let y = 0; y < this.height + 2; y++) {
      let worldY = y - 1
      if (y === 0) worldY = this.height - 1
      else if (y === this.height + 1) worldY = 0
      if (!this.world[worldY]) continue
      for (let x = 0; x < this.width + 2; x++) {
        let worldX = x - 1
        if (x === 0) worldX = this.width - 1
        else if (x === this.width + 1) worldX = 0
        if (!this.world[worldY][worldX]) continue
        this.__oldState[y][x] = this.world[worldY][worldX].alive
      }
    }
  }

  this.__set_oldState_noWrap = function () {
    for (let y = 1; y <= this.height; y++) {
      for (let x = 1; x <= this.width; x++) {
        const worldCell = this.world[y - 1][x - 1]
        if (worldCell) this.__oldState[y][x] = worldCell.alive
      }
    }
  }

  this.tick = function () {
    if (this.options.wrapOnEdges) this.__set_oldState_withWrap()
    else this.__set_oldState_noWrap()

    if (this.options.enableLastTickInfo) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.world[y][x].aliveLastTick = this.world[y][x].alive
        }
      }
    }

    // "environment" algorithm taken from https://codereview.stackexchange.com/a/42790
    for (let y = 1; y <= this.height; y++) {
      let environment =
        (this.__oldState[y - 1][0] ? 32 : 0) + (this.__oldState[y - 1][1] ? 4 : 0) +
        (this.__oldState[y][0] ? 16 : 0) + (this.__oldState[y][1] ? 2 : 0) +
        (this.__oldState[y + 1][0] ? 8 : 0) + (this.__oldState[y + 1][1] ? 1 : 0)
      for (let x = 1; x <= this.width; x++) {
        environment =
          ((environment % 64) * 8) +
          (this.__oldState[y - 1][x + 1] ? 4 : 0) +
          (this.__oldState[y][x + 1] ? 2 : 0) +
          (this.__oldState[y + 1][x + 1] ? 1 : 0)
        this.world[y - 1][x - 1].alive = this.lookupTable[environment]
      }
    }
  }

  this.width = this.options.width
  this.height = this.options.height
  this.__initializeWorld(this.width, this.height)
}

module.exports = GameOfLife
