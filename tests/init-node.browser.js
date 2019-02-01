'use strict'

const { build } = require('./schema/results')
const run = require('./lib/runner')

async function initializeNodeBrowser (node, name, warmup, fileSet, version) {
  const page = node[0].page
  await page.click('.initializeNode')
  const t = await page.waitFor('.initializeNode_s_ready')
  const element = await page.waitFor('.initializeNode_ms_ready')
  const timeS = await page.evaluate(t => t.textContent, t)
  const timeMs = await page.evaluate(element => element.textContent, element)
  return build({
    name: name,
    warmup: 'off',
    file: '',
    meta: { version: version },
    description: 'Node initialization',
    file_set: 'none',
    duration: { s: parseInt(timeS.split(':')[1]),
      ms: parseInt(timeMs.split(':')[1]) / 1000000 }
  })
}

run(initializeNodeBrowser, 1, 'browser')
