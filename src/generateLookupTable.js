module.exports = (rulestring) => {
  const bornWhen = rulestring.split('/')[0].slice(1, Infinity).split('').map(a => parseInt(a))
  const deadWhen = rulestring.split('/')[1].slice(1, Infinity).split('').map(a => parseInt(a))

  const lookupTable = []
  for (let k = 0; k < 512; k++) {
    // Get binary num
    let binary = k.toString(2)
    binary = '0'.repeat(9 - binary.length) + binary

    const selfAlive = binary[4] === '1'
    const aliveNeigh = binary.split('1').length - 1 - (selfAlive ? 1 : 0)

    let result = null
    // Use rulestring to determine result
    if (!selfAlive) {
      result = bornWhen.indexOf(aliveNeigh) !== -1
    } else {
      result = deadWhen.indexOf(aliveNeigh) !== -1
    }

    lookupTable.push(result)
  }
  return lookupTable
}
