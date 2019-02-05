## Runner
The [runner](../runner/) also exposes an API to schedule runs and other operations. It's available [here](https://benchmarks.ipfs.team/runner).
A queue is implemented to ensure no two benchmarks will run at the same time.

### Security
For operations, the API requires an api key in the header of the request that
has to match the apikey in the server.
```
x-ipfs-benchmarks-api-key
```

### Methods
* GET / - [show tasks](API_SHOW.md)
* GET /docs - [show test information](API_DOCS.md)
* POST / - [add task](API_ADD.md)
* POST /drain - [drain the queue](API_DRAIN.md)
* POST /restart - [schedule a restart of the runner](API_RESTART.md)

#### Continuous Deployment
The runner is managed by `systemd`, which ensures the process is restarted when it crashes or exits. Continuous Integration and Deployment is [in place](https://circleci.com/gh/ipfs/benchmarks/tree/master) for this project. The CI server will deploy the new code and then schedule a restart in the queue. Any scheduled tasks will be completed before the `/restart` task exits the runner process. The runner will be restarted with the new code and continue executing tasks from the queue which is persisted on disk.