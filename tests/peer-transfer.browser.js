'use strict'

const { build } = require('./schema/results')
const run = require('./lib/runner')
const { file } = require('./lib/fixtures')

async function peerTransferBrowser (node, name, warmup, fileSet, version) {
  const filePath = await file(fileSet)
  const page = node[0].page
  await page.reload()
  page.on('console', msg => console.log('PAGE LOG:', msg._text))
  const elementHandle = await page.$('.peerTransfer')
  await elementHandle.uploadFile(filePath)
  const t = await page.waitFor('.peerTransfer_s_ready', { timeout: 200000 })
  const element = await page.waitFor('.peerTransfer_ms_ready')
  const timeS = await page.evaluate(t => t.textContent, t)
  const timeMs = await page.evaluate(element => element.textContent, element)
  return build({
    name: name,
    warmup: 'off',
    file: filePath,
    meta: { version: version },
    description: 'Transfer file between peers in the browser',
    file_set: fileSet,
    duration: { s: parseInt(timeS.split(':')[1]),
      ms: parseInt(timeMs.split(':')[1]) / 1000000 }
  })
}

run(peerTransferBrowser, 1, 'browser')
