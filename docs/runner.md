## Runner
The runner is the component that kicks off the tests and stores the results in a time series database for visualization.

### Initial Setup Grafana InfluxDB
```bash
> docker-compose -f infrastructure/local/docker-compose.yaml up
```
Open http://localhost:3000/ in a browser. The default username/password combination is `admin/admin`. You will be asked to change that password after initial login. Setup the datasource with type `influxDB`and use `http://influxdb:8086` as the URL. Next import the dashboard from `infrastructure/grafana/dashboard.json` by hovering over the `+` icon on the left of your screen.

![Grafana import dashboard](./docs/images/import-hover.png)

* All of the Grafana configuration is stored in a folder adjacent to the this project's folder named `/data/grafana`.
* The data for influxDB is stored in a folder adjacent to the this project's folder named `/data/influxdb`.

### Run dashboard and the `runner` locally and send results to InfluxDB

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

### Production architecture

The diagram below describes the production setup.

![Production diagram](./docs/images/prod-infrastructure.png)

