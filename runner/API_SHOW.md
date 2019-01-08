**Show tasks**
----
  Returns a json list of tasks.

* **URL**

  /

* **Method:**

  `GET`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
```json
        {
          "1584093487785384": {
            "jobId": "1584093487785384",
            "work": {
              "commit": "b6a7ab63",
              "doctor": "on",
              "remote": true
            },
            "status": "started",
            "queued": "Tue Jan 08 2019 16:51:36 GMT+0000 (Coordinated Universal Time)",
            "started": "Tue Jan 08 2019 16:51:36 GMT+0000 (Coordinated Universal Time)"
          }
}
```

* **Error Response:**

  None

* **Sample Call:**

  ```bash
    curl -k https://benchmarks.ipfs.team/runner
  ```