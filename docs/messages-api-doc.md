# GH chat. Routes v1

### <b>NOTE:</b> `x-api-key` header is required to each request.

**Get messages**
----

* **URL**

   /messages/:chatId
   
* **Method:**

   GET

* **Query params**

    lastMessageDate = [string]
    
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
       [{ "_id": "5e906f8387f5990a5f554f38",
          "message": "New chat was created by userTest",
          "date": "2020-04-10T13:07:15.265Z",
          "selected": false,
          "chatId": "5e906f8387f5990a5f554f37",
          "messageType": "REPORT | MESSAGE",
          "createdAt": "2020-04-10T13:07:15.265Z",
          "user": { "_id": "5e8991ada23cef04a4c6012b",
             "username": "userTest",
             "avatar": "null | string",
             "selected": false
          }
       }]
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string] 
