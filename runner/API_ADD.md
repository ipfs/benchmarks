**Add task**
----
  Returns a json of the task that was added.

* **URL**

  /

* **Method:**

  `POST`

* **Data Params**

  * **commit**: Commit SHA from [js-ipfs](https://github.com/ipfs/js-ipfs)
  * **clinic**:
    * **enabled**: 'on' or 'off' controls whether clinic tools are included in the run.
  * **benchmarks**:
    * **tests**: Array of benchmark names retrievable from `/docs`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
```json
        {
          "commit":"b6a7ab63",
          "clinic": {
            "enabled"; true
          },
          "benchmarks": {
            "tests": ["localTransfer_tcp_mplex", "unixFsAdd"]
          }
          "remote":true,
          "id":1584093487785384
        }
```

* **Error Response:**

```json
    {
      "statusCode":400,
      "error":"Bad Request",
      "message":"headers['x-ipfs-benchmarks-api-key'] should be equal to constant"
    }
```

* **Sample Call:**

  ```bash
    curl -XPOST -d '{"commit":"", "clinic": { "enabled": false },  "benchmarks": { "tests": ["localTransfer_tcp_mplex", "unixFsAdd"]}}' -H "Content-Type: application/json" -H "x-ipfs-benchmarks-api-key: somesecret" -k https://benchmarks.ipfs.team/runner
  ```