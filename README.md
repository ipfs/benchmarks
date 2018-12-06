 # js-ipfs Benchmarks [![CircleCI](https://circleci.com/gh/ipfs/benchmarks.svg?style=svg)](https://circleci.com/gh/ipfs/benchmarks)


This is a set of benchmarks tests to track [js-ipfs](https://github.com/ipfs/js-ipfs) Benchmarks in a Grafana [Dashboard](https://benchmarks.ipfs.team).

## Purpose
The IPFS team needs a historical view of various performance metrics around `js-ipfs`
and how it compares to the reference implementation written in `go`. This project
implements benchmark tests for `js-ipfs` and publishes the results in a dashboard.
The artifacts are also made available on the IPFS network. Over time the historical
view will expose how `js-ipfs` is hopefully approaching the `go` implementation
and which areas need improvement.

![Architecture](architecture.png)

The goal is to provide immediate feedback and long-term tracking around performance
to developers and the community with an extremely low barrier.
The CI system integrating code changes will trigger benchmark runs as well a scheduled
run every night. Each run will provide a URL where the results will be visible.

This project also provides a possibility to run tests locally on a development
version of `js-ipfs`. Developers can then examine individual output files before
submitting code to the community.

## Documentation Index
* The [dashboard](infrastructure/grafana/README.md) documentation
* [Architecture](infrastructure/README.md) of the `js-ipfs` benchmark system
* Reference on how this [Repository](REPOSITORY.md) is organized
* Using the [Runner](runner/README.md) to manage benchmark runs remotely
* Description of [tests](tests/README.md)
* Convenience [scripts](scripts/README.md) for the docker-compose [deployment](infrastructure/deploy/README.md)

## Benchmarks on the web
The dashboard is available at [https://benchmarks.ipfs.team](https://benchmarks.ipfs.team) and can be viewed without a user account.
A `Continuous Integration` server can trigger benchmark runs using the endpoint exposed on [https://benchmarks.ipfs.team/runner](https://benchmarks.ipfs.team/runner). A commit from the [js-ipfs](https://github.com/ipfs/js-ipfs) repository can be supplied to run the benchmarks against. An api key is also required to be able to trigger a run. Please check [Runner](runner/README.md) docs on how to configure an api key for the runner. An example invocation using curl is provided below.

```bash
> curl -XPOST -d '{"commit":"adfy3hk"}' \
  -H "Content-Type: application/json" \
  -H "x-ipfs-benchmarks-api-key: <api-key>" \
  https://benchmarks.ipfs.team/runner
```
The response provides links to the output produced by the benchmark tests:
```
TBD
```
For more details about the dashboard see the [Grafana](infrastructure/grafana/README.md) doc

## Quickstart

Clone Benchmark tests and install:

```bash
>  git clone https://github.com/ipfs/benchmarks.git
>  cd benchmarks/tests
>  npm install
>  cd ../benchmarks/runner
>  npm install
```
### Gnerate test files
The files are defined in (fixutres)[tests/lib/fuxtures.js]

```bash
> npm run generateFiles
```
### Add test files

Here is the file object for a single test:
```js
{ size: KB, name: 'OneKBFile' }
```
To add mutiple test files add a count property:

```js
{ size: KB, name: 'OneHundredKBFile', count: 100 }
```

### Run tests locally

From the benchmark/tests directory:
```bash
> node local-add
> node loca-extract
> node local-transfer
```

Run all benchmarks:
```bash
> npm run benchmark
```
Create a pre-generated key:
```bash
> node lib/create-privateKey
```

### FILESET:  
Use env vairable TESTCLASS to run test just agianst that class.  Options of TestClass are define in the config.
```bash
> FILESET="One64MBFile" node local-add
```

### SUBTEST:  
Use env vairable SUBTEST to run the specfic subTest.  Options of subTest are define in the config.
```bash
> SUBTEST="empty-repo" node local-add
```


### Adding new tests

See README under test

###  Results

Results will be written to out directory under /tests

* `name`: Name of test
* `subtest`: Name of subtest
* `description`: Description of benchmark
* `fileSet`: Set of files to be used in a test
* `date`: Date of benchmark
* `file`: Name of file used in benchmark
* `meta`.`project`: Repo that are benchmarked
* `meta`.`commit`: Commit used to trigger benchmark
* `meta`.`version`: Version of js-ipfs
* `duration`.`s`: The number of seconds for benchmark
* `duration`.`ms`: The number of millisecs the benchmark took.
* `cpu`: Information about cpu benchmark was run on.
* `loadAvg`: The load average of machine.

