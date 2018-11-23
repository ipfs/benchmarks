## Test descriptions

Each test uses a small file ( 200 bytes ) and large file ( 1.2 MB ) and actions on empty repo vs populated repo.

### local-add:
The time it takes to add a file using unixFS.
```
repo.files.add(fileStream)
```
### local-extract
The total time to get a file from a repo.
```
repo.files.get(validCID)
```
### local-transfer
The total time it takes to transfer a fie from repo A to repo B
```
repoB.files.cat(inserted[0].hash)
```

## Adding new tests
TBD