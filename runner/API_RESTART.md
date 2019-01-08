**Restart runner**
----
  Returns a json of the task that queued.

* **URL**

  /restart

* **Method:**

  `POST`

* **Data Params**

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
```json
        {
          "restart":true,
          "id":1584094588480952
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
    curl -XPOST -H "x-ipfs-benchmarks-api-key: somesecret" -k https://benchmarks.ipfs.team/runner/restart
  ```