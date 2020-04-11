# GH chat. Routes v1

### <b>NOTE:</b> `x-api-key` header is required to each request.

**Get list of all user chats**
----
* **URL**

    /chats

* **Method:**

    `GET`

* **Headers:**

    `x-api-key: [string]` 
       
*   **Success Response:**
    *   **Code:** 200 <br/>
        **Content:** 
    ```json
     [
         {
             "_id": "5e90cc0e72539400128870af",
             "recipientId": "5e90cbe4585b8800126b9af8",
             "chatName": "test6",
             "description": "",
             "chatType": "DIALOG",
             "avatar": {
               "url": null
             },
             "author": "5e90cc0564c76900125780d4",
             "users": [
                 "5e90cbe4585b8800126b9af8",
                 "5e90cc0564c76900125780d4"
             ],
             "admins": [
                 "5e90cc0564c76900125780d4"
             ],
             "createdAt": "2020-04-10T19:42:06.890Z",
             "lastMessage": {
                 "messageType": "MESSAGE",
                 "_id": "5e90cc1772539400128870b2",
                 "authorId": {
                     "avatar": {
                         "url": null
                     },
                     "chats": [
                         "5e90cc0e72539400128870af"
                     ],
                     "contacts": [
                         "5e90cbe4585b8800126b9af8"
                     ],
                     "_id": "5e90cc0564c76900125780d4",
                     "username": "test7",
                     "password": "U2FsdGVkX1+9nHRvGuG8hm20f/CvAy5lVZDBf7hdncw=",
                     "apiKey": "b392b349-6119-415a-bf08-8178b91dd995",
                     "createdAt": "2020-04-10T19:41:57.645Z",
                     "updatedAt": "2020-04-10T19:42:13.052Z",
                     "__v": 2
                 },
                 "chatId": "5e90cc0e72539400128870af",
                 "message": "test message",
                 "createdAt": "2020-04-10T19:42:15.768Z",
                 "updatedAt": "2020-04-10T19:42:15.768Z",
                 "__v": 0
             }
         }
     ]
    ```

*   **Failure Response:**
 *   **Code:** 401 <br/>
        **Content:** 
        
        `Unauthorized`
        
        
**Get one chat**
----
* **URL**

    /chats/:id

* **Method:**

    `GET`

* **Headers:**

    `x-api-key: [string]` 
       
*   **Success Response:**
    *   **Code:** 200 <br/>
        **Content:** 
    ```json
    {
        "_id": "5e90cc0e72539400128870af",
        "recipientId": "5e90cbe4585b8800126b9af8",
        "chatName": "test6",
        "description": "",
        "chatType": "DIALOG",
        "avatar": {
            "url": null
        },
        "author": "5e90cc0564c76900125780d4",
        "users": [
            {
                "avatar": {
                    "url": null
                },
                "chats": [
                    "5e90cc0e72539400128870af"
                ],
                "contacts": [
                    "5e90cc0564c76900125780d4"
                ],
                "_id": "5e90cbe4585b8800126b9af8",
                "username": "test6",
                "password": "U2FsdGVkX1+SEEJFaperYQcF15H83v6TbzdZJDMyY+I=",
                "apiKey": "6514f6fa-4901-4db8-893e-9c354856fe8c",
                "createdAt": "2020-04-10T19:41:24.297Z",
                "updatedAt": "2020-04-10T19:42:06.945Z",
                "__v": 2
            },
            {
                "avatar": {
                    "url": null
                },
                "chats": [
                    "5e90cc0e72539400128870af"
                ],
                "contacts": [
                    "5e90cbe4585b8800126b9af8"
                ],
                "_id": "5e90cc0564c76900125780d4",
                "username": "test7",
                "password": "U2FsdGVkX1+9nHRvGuG8hm20f/CvAy5lVZDBf7hdncw=",
                "apiKey": "b392b349-6119-415a-bf08-8178b91dd995",
                "createdAt": "2020-04-10T19:41:57.645Z",
                "updatedAt": "2020-04-10T19:42:13.052Z",
                "__v": 2
            }
        ],
        "admins": [
            "5e90cc0564c76900125780d4"
        ],
        "createdAt": "2020-04-10T19:42:06.890Z"
    }
    ```

*   **Failure Response:**
 *   **Code:** 401 <br/>
        **Content:** 
        
        `Unauthorized`
        
        
**Create chat**
----
* **URL**

    /chats

* **Method:**

    `POST`

* **Headers:**

    `x-api-key: [string]` 
       
* **Data params**

    `chatName=[string]`

    `chatType=[string] DIALOG|CHANNEL|GROUP`
    
    `users=[string][]`
    
    `description=[string]`
    
*   **Success Response:**
    *   **Code:** 200 <br/>
        **Content:** 
    ```json
    {
        "message": "Chat already exist!",
        "chat": {
            "_id": "5e90cc0e72539400128870af",
            "recipientId": "5e90cbe4585b8800126b9af8",
            "chatName": "test6",
            "description": "",
            "chatType": "DIALOG",
            "avatar": {
                "url": null
            },
            "author": "5e90cc0564c76900125780d4",
            "users": [
                "5e90cbe4585b8800126b9af8",
                "5e90cc0564c76900125780d4"
            ],
            "admins": [
                "5e90cc0564c76900125780d4"
            ],
            "createdAt": "2020-04-10T19:42:06.890Z"
        }
    }
    ```

*   **Failure Response:**
 *   **Code:** 401 <br/>
        **Content:** 
        
        `Unauthorized`
        
**Update chat**
----
* **URL**

    /chats/id

* **Method:**

    `PUT`

* **Headers:**

    `x-api-key: [string]` 
       
* **Data params**

    `chatName=[string]`

    `chatType=[string] DIALOG|CHANNEL|GROUP`
    
    `users=[string][]`
    
    `description=[string]`
    
*   **Success Response:**
    *   **Code:** 200 <br/>
        **Content:** 
    ```json
    {
        "_id": "5e90cc0e72539400128870af",
        "chatName": "b7c5bc03-62e7-4315-a106-b2b598777e27",
        "description": "",
        "chatType": "DIALOG",
        "avatar": {
            "url": null
        },
        "author": "5e90cc0564c76900125780d4",
        "users": [
            "5e90cbe4585b8800126b9af8",
            "5e90cc0564c76900125780d4"
        ],
        "admins": [
            "5e90cc0564c76900125780d4"
        ],
        "createdAt": "2020-04-10T19:42:06.890Z"
    }
    ```

*   **Failure Response:**
 *   **Code:** 401 <br/>
        **Content:** 
        
        `Unauthorized`
        
**Delete chat**
----
* **URL**

    /chats/id

* **Method:**

    `DELETE`

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
