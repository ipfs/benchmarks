## Test descriptions

Each test uses a small file ( 200 bytes ) and large file ( 1.2 MB ) and actions on empty repo vs populated repo.

### local-add:
The time it takes to add a file using unixFS.
```js
repo.files.add(fileStream)
```
### local-extract
The total time to get a file from a repo.
```js
repo.files.get(validCID)
```
### local-transfer
The total time it takes to transfer a fie from repo A to repo B
```js
repoB.files.cat(inserted[0].hash)
```
### multi-peer-transfer
With the same file inserted into 4 peers, this test captures the time for a 5th peer to retrieve file from swarm
```js
peerE.files.cat(inserted[0].hash)
```

### init-node
Test the time to spin up a node without using pre-generated key
```js
new IPFS({
      repo: `${repoPath}${Math.random()
        .toString()
        .substring(2, 8)}`,
      config: config,
      init: init 
    })
```

### Adding new tests

- Copy test.template and give the file the name of the test
- Add test fo the async function 
- Call run() with the name of you test as param
- Add the test name and subtests to the [config/index](config/index.json).

To Test it:

```bash
> node *test-name*
```
