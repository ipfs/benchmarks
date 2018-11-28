'use strict'

const defaultConfig = require('../config/default-config.json')
const privateKey = 'CAASqAkwggSkAgEAAoIBAQDANawZ3qi0iU6I7Iw8JKCeNGgyQO7Ij2eHOSEZ4M5qX2hpECaQ5srS9tEhxhXly7yTv9q9CONizb4pJ6Q2ZWVEFSx5brkehCKw7gQlPFPGGZNRFKpvkjytVoh+TcECU8h+FzTmF0T99Ph2Uw1fOsJD/hlU3JJ6vzV1fQ5LzV+LH58KasDedNbolk/urvIkMlNYG2XQVC0HN2WNtVNe7sLoDGGapQeyj13hYEIRp1PzCPW7doQurzntRmKCM6i3J0+4cgaWcLX+KPtQHvCErarXH1TTmDOMBL1CwcNLuKamkQnvJA3HHcACPB/eRITssP9tti5IKRrjlzeH/gODWFzBAgMBAAECggEAWYKlOwbuGeU3pZxDUl7cTdCqFX0Xtl7SH68DM0H13qO/w+25iBFysvwuOEQ/Ply63TOjchUJj6GwxQmo94wQtLwHkiV2IDf4z9yIIa8OdFrEuCWfmYXIrBB4UBl1oNfTrqSwBdcgUgQbET9sIsUCYxeaRGLT9EXHZ4dteO+TZv3sFp0UnIWGV4r4f2+gPQRLI+b+OiDvZW8jUrWKYFfzikNteDRChjz6v/zEy+xhcDGxtD3zhO/98t7RQv0qSuhUAd8aS+vBw4F331kqD37wy/ayz0LGVGNHxo6StCldsLx5lJWL1D1vzFWxnhy9BZTkiEMT0A6LpQIfclHN4Hme4QKBgQDmvLRXYQ3h483vW9yfJ9FDJfZfJSa6mBuyjs5IP1/tuyNi6t5wJEjqS0qLxkfho4nfkiMZ1oWzPucdrlPq7cEgYyJZIQUl6MhmS5uo8i4k4WW9sRjYUZGh0WBXcQTR90GHC2nfU/ZpsWQTIHWr5OAehzkvLrI+Ug89Mg0pq6UaNwKBgQDVQRZX1APSN29Um+EoIoXm28O1Qz29iVukfGD+uhPu/eEUMkcSiRzFnLtq7mywJEFnCdtvsD1dUkQf1qNwJbYucURvsrO38v4/QKD+oAtuhDCkcDlA3RhZKakk+FP9zTh5r/9tx9PkwwIS4g7FarXimg+ENOPOg5ekikVmVpjkxwKBgQC6xTsRk91B4T1cKDawmfF48iy4nYD4/5FD+vadYrdK3vVo54dArQ5coK9p7wlWayN6VneVPaGiEyPPUcJZ4zQ1/Cjcjq71HbXBoCgTHF4fule5sbXTvEsu+iWLAlANiaCAKMv9W6CVs2K3XMoDZ1PHQlwWhiz/5zqwpWgkN+2ABwKBgGooLGcsM3rB/bmwnzTLeryhSZtCDcn8RpJrGB21o5ak6xaSsK6ZcqksjF9+sLw+UBBq58GBigqamS8AOfvpyfb0i4zO+IfpfoceNQaLxSUOyOgStW2EokpAYuL0e1ssfaCV7CFKCEEoki+0OIYtyL000+SML5ruBt7xtfprwVChAoGBAMUSUaxTAOf2A/xxY3KMwxNHUnAKbSGKJbyBvPdpcnzmXO3VqJrJaKj3LKXmEkfZKnYgtG1yPMVKdWaUdJJWEFjBwWVsSJVoz0TmVOA+PWUmRUnOEEvAQ96Cfgns5fr/10Q+neN1sSXquUiF6zV7LdxWtacq4bTM4dXij4/hQQNp"'
const { repoPath } = require('../package.json').config
const defaultInit = {
  empty: true,
  privateKey
}
module.exports = (config, init, IPFS) => {
  return new Promise((resolve, reject) => {
    const node = new IPFS({
      repo: `${repoPath}${Math.random()
        .toString()
        .substring(2, 8)}`,
      config: config || defaultConfig,
      init: init || defaultInit
    })
    node.on('ready', () => {
      resolve(node)
    })
    node.on('error', (e) => {
      reject(e)
    })
  })
}
