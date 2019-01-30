**Add task**
----
  Returns a json of the task that was added.

* **URL**

  /

* **Method:**

  `POST`

* **Data Params**

  * **commit**: Commit SHA from [js-ipfs](https://github.com/ipfs/js-ipfs)
  * **clinic**: 'on' or 'off' controls whether clinic tools are included in the run.

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
```json
        {
          "commit":"b6a7ab63",
          "clinic":"on",
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
    curl -XPOST -d '{"commit":"b6a7ab63", "clinic": "on"}' -H "Content-Type: application/json" -H "x-ipfs-benchmarks-api-key: somesecret" -k https://benchmarks.ipfs.team/runner
  ```