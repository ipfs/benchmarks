# IPFS Benchmarks

A set of benchmark tests to track IPFS performance.

## Local Setup

    Clone Benchmark tests:

    ```
    git clone https://github.com/ipfs/benchmarks.git
    cd benchmarks/tests
    npm install
   ```

## Run tests locally

    From the benchmark/tests directory:
    ```
    node local-add
    node loca-extract
    node local-transfer
    ```
    
    Run all benchamrks:
    ```
    npm run benchmark
    ```
## Run sub tests
    TODO:

##  Results

  Results will be writen to out directory under /tests

## See results in Grafana
  
  Coming soon....

## Test description

### local-add:
  We want to know the time it takes to add a file using unixFS.
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
