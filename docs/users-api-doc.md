# GH chat. Routes v1

**Create user**
----

* **URL**

   /users/create
   
* **Method:**

   POST

* **Data params**

    username = [string]
    
    password = [string] 
    
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
       {
           "apiKey": "9ca188ff-1285-451c-ac98-9f00a136aae4",
           "_id": "5dfa660287c5ba2d97a86b84",
           "username": "Test",
           "avatar": {"url": null}
       }
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string] 
   
**Login user**
----

* **URL**

   /users/login
   
* **Method:**

   POST

* **Data params**
    
    email = [string]
    
    password = [string] 
    
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
       {
           "apiKey": "9ca188ff-1285-451c-ac98-9f00a136aae4",
           "_id": "5dfa660287c5ba2d97a86b84",
           "username": "Test",
           "avatar": {"url": "null | string"}
       }
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]   
      
**Logout user**
----

* **URL**

   /users/logout
   
* **Method:**

   GET

* **Headers**
    
    x-api-key: [string]  
        
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
        {"message": "Success"}
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]   
      
**Get user**
----

* **URL**

   /users/:id
   
* **Method:**

   GET
         
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
       {
           "_id": "5dfa660287c5ba2d97a86b84",
           "username": "Test",
           "avatar": {"url": "null | string"}
       }
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]           
      
**Get user by token**
----

* **URL**

   /users/get-one
   
* **Method:**

   GET
   
* **Headers**
    
    x-api-key: [string]
         
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
       {
           "apiKey": "9ca188ff-1285-451c-ac98-9f00a136aae4",
           "_id": "5dfa660287c5ba2d97a86b84",
           "username": "Test",
           "avatar": {"url": "null | string"}
       }
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]         

**Update user**
----

* **URL**

   /users/:id
   
* **Method:**

   PUT
   
* **Headers**
    
    x-api-key: [string]  
    
* **Data params**

    username = [string]
    
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
       {
           "_id": "5dfa660287c5ba2d97a86b84",
           "username": "Test",
           "avatar": {"url": "null | string"}
       }
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]
