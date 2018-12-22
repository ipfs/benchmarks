'use strict'

const { build } = require('./schema/results')
const run = require('./lib/runner')

async function initializeNodeBrowser (node, name, warmup, fileSet, version) {
  const page = node[0].page
  await page.click('.initialize_node')
  const t = await page.waitFor('.initialize_node_s_ready')
  const element = await page.waitFor('.initialize_node_ms_ready')
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
