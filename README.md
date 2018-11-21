# IPFS Benchmarks

A set of benchmark tests to track IPFS performance.

## Local Setup

Clone Benchmark tests and install:

```bash
>  git clone https://github.com/ipfs/benchmarks.git
>  cd benchmarks/tests
>  npm install
```

## Run tests locally

From the benchmark/tests directory:
```bash
> node local-add
> node loca-extract
> node local-transfer
```
    
Run all benchamrks:
```bash
> npm run benchmark
```

## Run sub tests
TODO:

##  Results

Results will be writen to out directory under /tests

## Setup Grafana and send results to InfluxDB

```bash
> docker-compose -f infrastructure/local/docker-compose.yaml up
```

Keep docker running and in another tab run:
```bash
> STAGE=local LOG_PRETTY=true node runner/index.js
```

To view the Grafan dashboard: http://localhost:3000/

Use the default account admin/admin to login

## Test description

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
