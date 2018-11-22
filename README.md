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

## Initial Setup Grafana InfluxDB
```bash
> docker-compose -f infrastructure/local/docker-compose.yaml up
```
Open http://localhost:3000/ in a browser. The default username/password combination is admin/admin. You will be asked to change that password after initial login. Setup the datasource with type `influxDB`and use `http://influxdb:8086` as the URL. Next import the dashboard from `infrastructure/grafana/dashboard.json` by hovering over the `+` icon on the left of your screen.

![Grafana import dashboard](./docs/images/import-hover.png)

All of the configuration will be stored in the Grafana docker image. The data for influxDB is stored outside of the InfluxDB docker image and resides in a folder adjacent to the `benchmarks` folder named `/data/influxdb`.

## Run dashboard locally and send results to InfluxDB

If you're not running it yet:
```bash
> docker-compose -f infrastructure/local/docker-compose.yaml up
```

Keep docker running and in another tab run:
```bash
> STAGE=local LOG_PRETTY=true node runner/index.js
```

To view the Grafana dashboard: http://localhost:3000/

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
