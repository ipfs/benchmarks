**Drain tasks**
----
  Returns a json of the task that was already started, if any.

* **URL**

  /drain

* **Method:**

  `POST`

* **Data Params**

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
```json
        {
          "1584094330333739":
          {
            "jobId":"1584094330333739",
            "work":
            {
              "commit":"b6a7ab63",
              "clinic":"on",
              "remote":true
            },
            "status":"started",
            "queued":"Tue Jan 08 2019 17:05:19 GMT+0000 (Coordinated Universal Time)",
            "started":"Tue Jan 08 2019 17:05:19 GMT+0000 (Coordinated Universal Time)"
          }
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
    curl -XPOST -H "x-ipfs-benchmarks-api-key: somesecret" -k https://benchmarks.ipfs.team/runner/drain
  ```