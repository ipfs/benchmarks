# Ansible playbooks

There are two main playbooks:
1. [controller.yml](/infrastructure/playbooks/controller.yaml)
2. [benchmarks.yml](/infrastructure/playbooks/benchmarks.yaml)

The controller playbook prepares a host with the following components:
* Node.js
* Docker
* Ansible
* Directories with proper rights to support the `Runner`

The controller playbook is also used by CI to deploy a new runner. For this purpose all tasks tagged with `prepare` are skipped. To prepare or upgrade a Controller VM, run the playbook in its entirety.
```
ansible-playbook -i infrastructure/inventory/inventory.yaml infrastructure/playbooks/controller.yaml
```
Tags can be skipped by adding this to the command line:
```
--skip-tags "prepare"
```

## Host access
Since the runner is not dockerized the nginx proxy running inside docker needs to be allowed access to the host, where the `Runner`is running. This is done by creating a docker interface named `my-bridge` and opening the firewall port 9000 on the host for traffic from that bridge.