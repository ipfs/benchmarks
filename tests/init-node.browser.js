'use strict'

const { build } = require('./schema/results')
const run = require('./lib/runner')

async function initializeNodeBrowser (node, name, warmup, fileSet, version) {
  const page = node[0].page
  await page.waitFor(3000)
  const t = await page.waitFor('.init-node-browser-time_s')
  const element = await page.$('.init-node-browser-time_ms')
  const timeS = await page.evaluate(t => t.textContent, t)
  const timeMs = await page.evaluate(element => element.textContent, element)
  return build({
    name: name,
    wamrup: false,
    file: '',
    meta: { version: version },
    description: 'Initialize node without pre-generated key',
    file_set: '',
    duration: { s: parseInt(timeS),
      ms: parseInt(timeMs) / 1000000 }
  })
}

run(initializeNodeBrowser, 1, 'browser')
