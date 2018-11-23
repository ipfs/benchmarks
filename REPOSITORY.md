## repository organization
```
├── docs
├── infrastructure
│   ├── grafana
│   ├── inventory
│   ├── local
│   └── playbooks
├── runner
├── scripts
└── tests
```
### docs
Documentation and images for usage of this repository
### infrastructure
* _grafana_: Any [Grafana](https://grafana.com/) configurations for dashboards and such.
* _inventory_: Defines the hosts this project is targeting for production
* _local_: Any infrastructure parts needed to run this in a local system. Requires `docker-compose` to be installed. It will run containers for [Grafana](https://grafana.com/) and [InfluxDB](https://www.influxdata.com/time-series-platform/influxdb/). See below for more details.
* _playbooks_: [Ansible](https://www.ansible.com/) playbooks run by the runner to provision the target benchmark system.
### runner
Houses the `runner` code and configuration.
### scripts
Various convenience scripts to make running things a bit easier
### tests
Houses the code for the benchmarks.