# IPFS Benchmarks

### Adding new tests

- Copy test.template and give the file the name of the test
- Add test fo the async function 
- Call run() with the name of you test as param
- Add the test name and subtests to the [config/index](config/index.js).
- Add the test to the runner config (`testAbstracts` array), in order to be available on the dashboard [runner/config.js](../runner/config.js)

To Test it:

```bash
> node *test-name*
```
## FLAGS

Below is a list of optional flags used by the tests to run a specific strategy or transport module in Libp2p.
- `-s` DAG strategy (balanced | trickle)
- `-t` Transport (tcp | ws)
- `-m` Stream Muxer (mplex, spdy)
- `-e` Connection encryption (secio)

Example:
```bash
> node local-transfer.js -t ws -m spdy -e secio
```
## ENVIROMENT VARIABLES:

### FILESET:
Use env variable FILESET to run test just against that specific set of file(s).  Options of FILESET are define in the config.
```bash
> FILESET="One64MBFile" node local-add
```

### VERIFYOFF
Use env variable VERIFYOFF=true to skip the pre-generation of test files.
```js
> VERIFYOFF=true node local-add
```

## Use case coverage

The following tables highlight tests that are present or missing:

* 🍏 - test exists
* 🍎 - test not exists

#### Transport and Storage

* balanced - use balanced DAG strategy (the default)
* trickle - use trickle DAG strategy
* tcp - libp2p transport over TCP [js-libp2p-tcp](https://github.com/libp2p/js-libp2p-tcp)
* websocket - libp2p transport over websockets [js-libp2p-websocket-star](https://github.com/libp2p/js-libp2p-websocket-star)
* webrtc - libp2p transport over webrtc [js-libp2p-webrtc-star](https://github.com/libp2p/js-libp2p-webrtc-star)
* mplex - libp2p multiplexer [js-libp2p-mplex](https://github.com/libp2p/js-libp2p-mplex)
* spdy - libp2p multiplexer [js-libp2p-spdy](https://github.com/libp2p/js-libp2p-spdy)
* secio - libp2p connection encryption channel [js-libp2p-secio](https://github.com/libp2p/js-libp2p-secio)

#### IPFS nodes

* js0 -> js0 - A local test from one JS IPFS node to the same node
* js0 -> js1 - A test between two JS IPFS nodes
* go0 -> go0 - For comparison with js0 -> js0
* go0 -> go1 - For comparison with js0 -> js1
* js0 -> go0 - A test between a JS IPFS node and a Go IPFS node
* go0 -> js0 - For comparison with js0 -> go0
* js01234 -> js5 - A test from multiple JS IPFS nodes to a single JS IPFS node
* go01234 -> go5 - For comparison with js01234 -> js5

#### Notes

IPFS nodes in benchmark tests should:

1. Not connect to bootstrap nodes (https://github.com/ipfs/js-ipfs#optionsconfig)
1. Have preloading disabled (https://github.com/ipfs/js-ipfs#optionspreload)
1. Disable discovery

For connecting peers you'll need to use the `ipfs.swarm.connect` API.

### Node.js and Go

| Test                                     | js0 -> js0 | js0 -> js1 | go0 -> go0 | go0 -> go1 | js0 -> go0 | go0 -> js0 | js01234 -> js5 | go01234 -> go5 |
|------------------------------------------|------------|------------|------------|------------|------------|------------|----------------|----------------|
| Node initialization                      | [🍏](init-node.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add small file (balanced)                | [🍏](local-add.js)         | n/a        | [🍏](local-add.go.js)         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add many small files (balanced)          | [🍏](add-multi-kb.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add large file (balanced)                | [🍏](local-add.js)         | n/a        | [🍏](local-add.go.js)         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add small file (trickle)                 | [🍏](local-add.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add many small files (trickle)           | [🍏](add-multi-kb.js)          | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add large file (trickle)                 | [🍏](local-add.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Cat small file (local)                   | [🍏](local-extract.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Cat small file (tcp, mplex)              | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | [🍏](extract-js2.go.js)          | [🍏](extract-go2.js)          | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat small file (websocket, mplex)        | n/a        | [🍏](local-transfer.js)          | n/a        | 🍎         | [🍏](extract-js2.go.js)         | [🍏](extract-go2.js)         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat small file (webrtc, mplex)           | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat small file (tcp, mplex, secio)       | n/a        | [🍏](local-transfer.js)          | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat small file (websocket, mplex, secio) | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat small file (webrtc, mplex, secio)    | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat small file (tcp, spdy)               | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat small file (websocket, spdy)         | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat small file (webrtc, spdy)            | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat small file (tcp, spdy, secio)        | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat small file (websocket, spdy, secio)  | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat small file (webrtc, spdy, secio)     | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat large file (local)                   | [🍏](local-extract.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Cat large file (tcp, mplex)              | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | [🍏](extract-js2.go.js)         | [🍏](extract-go2.js)         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat large file (websocket, mplex)        | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | [🍏](extract-js2.go.js)         | [🍏](extract-go2.js)         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat large file (webrtc, mplex)           | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat large file (tcp, mplex, secio)       | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat large file (websocket, mplex, secio) | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat large file (webrtc, mplex, secio)    | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat large file (tcp, spdy)               | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat large file (websocket, spdy)         | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat large file (webrtc, spdy)            | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat large file (tcp, spdy, secio)        | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat large file (websocket, spdy, secio)  | n/a        | [🍏](local-transfer.js)         | n/a        | 🍎         | 🍎         | 🍎         | [🍏](multi-peer-transfer.js)             | 🍎             |
| Cat large file (webrtc, spdy, secio)     | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| MFS write small file                     | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write many small files (10k+)        | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write large file                     | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write to dir with < 1,000 files      | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write to dir with > 1,000 files      | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write to deeply nested dir           | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS read a small file                    | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS read a large file                    | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS cp a file                            | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS mv a file                            | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS rm a file                            | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS stat a file                          | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Pubsub publish & receive a message       | n/a        | [🍏](pubsub-message.js)         | n/a        | 🍎         | 🍎          | 🍎         | n/a            | n/a            |
| Pubsub publish & receive 1k messages     | n/a        | 🍎         | n/a        | 🍎         | 🍎          | 🍎         | n/a            | n/a            |

### Browser

| Test                                     | js0 -> js0 | js0 -> js1 | go0 -> go0 | go0 -> go1 | js0 -> go0 | go0 -> js0 | js01234 -> js5 | go01234 -> go5 |
|------------------------------------------|------------|------------|------------|------------|------------|------------|----------------|----------------|
| Node initialization                      | [🍏](init-node.browser.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add small file (balanced)                | [🍏](local-add.browser.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add many small files (balanced)          | [🍏](add-multi-kb.browser.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add large file (balanced)                | [🍏](local-add.browser.js)         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add small file (trickle)                 | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add many small files (trickle)           | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Add large file (trickle)                 | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Cat small file (local)                   | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Cat small file (websocket, mplex)        | n/a        | [🍏](peer-transfer.browser.js)         | n/a        | 🍎         | 🍎         | 🍎         | 🍎             | 🍎             |
| Cat small file (webrtc, mplex)           | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat small file (websocket, mplex, secio) | n/a        | 🍎         | n/a        | 🍎         | 🍎         | 🍎         | 🍎             | 🍎             |
| Cat small file (webrtc, mplex, secio)    | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat small file (websocket, spdy)         | n/a        | 🍎         | n/a        | 🍎         | 🍎         | 🍎         | 🍎             | 🍎             |
| Cat small file (webrtc, spdy)            | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat small file (websocket, spdy, secio)  | n/a        | 🍎         | n/a        | 🍎         | 🍎         | 🍎         | 🍎             | 🍎             |
| Cat small file (webrtc, spdy, secio)     | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat large file (local)                   | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Cat large file (websocket, mplex)        | n/a        | [🍏](peer-transfer.browser.js)         | n/a        | 🍎         | 🍎         | 🍎         | 🍎             | 🍎             |
| Cat large file (webrtc, mplex)           | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat large file (websocket, mplex, secio) | n/a        | 🍎         | n/a        | 🍎         | 🍎         | 🍎         | 🍎             | 🍎             |
| Cat large file (webrtc, mplex, secio)    | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat large file (websocket, spdy)         | n/a        | 🍎         | n/a        | 🍎         | 🍎         | 🍎         | 🍎             | 🍎             |
| Cat large file (webrtc, spdy)            | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| Cat large file (websocket, spdy, secio)  | n/a        | 🍎         | n/a        | 🍎         | 🍎         | 🍎         | 🍎             | 🍎             |
| Cat large file (webrtc, spdy, secio)     | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a        | 🍎             | n/a            |
| MFS write small file                     | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write many small files (10k+)        | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write large file                     | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write to dir with < 1,000 files      | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write to dir with > 1,000 files      | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS write to deeply nested dir           | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS read a small file                    | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS read a large file                    | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS cp a file                            | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS mv a file                            | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS rm a file                            | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| MFS stat a file                          | 🍎         | n/a        | 🍎         | n/a        | n/a        | n/a        | n/a            | n/a            |
| Pubsub publish & receive a message       | n/a        | 🍎         | n/a        | 🍎         | 🍎          | 🍎         | n/a            | n/a            |
| Pubsub publish & receive 1k messages     | n/a        | 🍎         | n/a        | 🍎         | 🍎          | 🍎         | n/a            | n/a            |

For browser tests we need to run a rendezvous server:

* websockets - https://github.com/libp2p/js-libp2p-websocket-star-rendezvous#usage
* webrtc - https://github.com/libp2p/js-libp2p-webrtc-star/#rendezvous-server-aka-signalling-server

Instructions for enabling different transports in both browsers - for JS IPFS see https://github.com/ipfs/js-ipfs#optionslibp2p

### Future test suggestions

1. DHT (not yet in JS IPFS) - what would be a good way to test this?
1. Tests via a relay node
1. Tests for IPNS publish and resolve (not yet in JS IPFS)
