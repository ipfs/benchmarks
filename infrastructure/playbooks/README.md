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

## Controller
### Host access
Since the runner is not dockerized the nginx proxy running inside docker needs to be allowed access to the host, where the `Runner`is running. This is done by creating a docker interface named `my-bridge` and opening the firewall port 9000 on the host for traffic from that bridge.

### Runner process
The runner is managed with [systemd](https://wiki.debian.org/systemd) and the proper files are installed by this playbook. When the process fails, it's automatically restarted. The `redeploy`ment part of the playbook uses systemctl to restart the runner after the new code has been copied and `npm install` was run. The deployment command used by CircleCI is:
```
ansible-playbook -i infrastructure/inventory/inventory.yaml infrastructure/playbooks/controller.yaml --skip-tags "prepare"
```
When you log in to the VM you can tail the logs with:
```
journalctl -u runner -f
```

### Minion
The runner uses the `benchmarks` playbook to provision minions to be able to run benchmark tests. The `controller` playbook takes care of provisioning the Controller so the Runner has all the tools needed to carry out this task.

The playbook installs:
* Node.js
* Rsync the testing code

The code for the tests is copied including the node_modules directory. Also Node.js is installed as a normal user via [nvm](https://github.com/creationix/nvm). The entire testing processes run under a normal user account.