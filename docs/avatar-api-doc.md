# GH chat. Routes v1

### <b>NOTE:</b> `x-api-key` header is required to each request.

**Upload avatar**
----
* **URL**

    /avatars/id

* **Method:**

    `PUT`

* **Headers:**

    `x-api-key: [string]` 
    `content-type: [string]` 
       
* **Query params**

    `type: [string]` 
        
* **Data params**

    `<Buffer>`
    
*   **Success Response:**
    *   **Code:** 200 <br/>
        **Content:** 
    ```json
    {
        "_id": "5e90cfe364c76900125780d7",
        "key": "avatars/af94418f-66cd-4497-8f81-61eb4da089bf.png",
        "url": "https://storage.googleapis.com/gh-chat/avatars/af94418f-66cd-4497-8f81-61eb4da089bf.png",
        "ext": "png",
        "originalName": "0.image.jpeg",
        "createdAt": "2020-04-10T19:58:27.013Z",
        "updatedAt": "2020-04-10T19:58:27.013Z",
    }
    ```

*   **Failure Response:**
 *   **Code:** 401 <br/>
        **Content:** 
        
        `Unauthorized`

**Delete avatar**
----
* **URL**

    /avatar/id

* **Method:**

    `DELETE`

* **Query params**

    `type: [string]` 

* **Headers:**

    `x-api-key: [string]` 
    
*   **Success Response:**
    *   **Code:** 200 <br/>
        **Content:** 
    ```json
    {
      "message": "Success"
    }
    ```

*   **Failure Response:**
 *   **Code:** 401 <br/>
        **Content:** 
        
        `Unauthorized`
