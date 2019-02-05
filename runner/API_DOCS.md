**Documentation endpoint**
----
  Returns a json list of benchmarks and clinic tools.

* **URL**

  /docs

* **Method:**

  `GET`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
```json
        {
  "benchmarks": {
    "tests": [
      {
        "name": "localTransfer_tcp_mplex",
        "file": "local-transfer.js -t tcp -m mplex"
      },
      {
        "name": "localTransfer_ws_mplex",
        "file": "local-transfer.js -t ws -m mplex"
      },
      ...
      {
        "name": "pubsubMessage",
        "file": "pubsub-message.js"
      }
    ],
    "txt": "Benchmarks run with their own set of files mandated by the type of test."
  },
  "clinic": {
    "operations": [
      "doctor",
      "flame",
      "bubbleProf"
    ],
    "filesets": [
      "One4MBFile",
      "One64MBFile"
    ],
    "txt": "For clinic runs you can request to run wit a specific fileset."
  }
}
}
```

* **Error Response:**

  None

* **Sample Call:**

  ```bash
    curl -k https://benchmarks.ipfs.team/runner/docs
  ```