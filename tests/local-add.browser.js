'use strict'

const { build } = require('./schema/results')
const run = require('./lib/runner')
const { file } = require('./lib/fixtures')

async function unixFsAddBrowser (node, name, warmup, fileSet, version) {
  const filePath = await file(fileSet)
  const page = node[0].page
  await page.reload()
  const elementHandle = await page.$('.addLocalFile')
  await elementHandle.uploadFile(filePath)
  const t = await page.waitFor('.addLocalFile_s_ready')
  const element = await page.waitFor('.addLocalFile_ms_ready')
  const timeS = await page.evaluate(t => t.textContent, t)
  const timeMs = await page.evaluate(element => element.textContent, element)
  return build({
    name: name,
    warmup: 'off',
    file: filePath,
    meta: { version: version },
    description: 'Initialize node in browser without pre-generated key',
    file_set: fileSet,
    duration: { s: parseInt(timeS.split(':')[1]),
      ms: parseInt(timeMs.split(':')[1]) / 1000000 }
  })
}

run(unixFsAddBrowser, 1, 'browser')
