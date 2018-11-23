# IPFS Benchmarks

This A set of benchmark tests to track IPFS performance.

## Links
* Reference on how this [Repository](docs/repo.md) is organized
* Using the [Runner](docs/runner.md) to manage benchmark runs remotely
* Description of [tests](docs/tests.md)

## Quickstart

Clone Benchmark tests and install:

```bash
>  git clone https://github.com/ipfs/benchmarks.git
>  cd benchmarks/tests
>  npm install
>  cd ../benchmarks/runner
>  npm install
```

### Run tests locally

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

### Run sub tests
TODO:

###  Results

Results will be written to out directory under /tests
