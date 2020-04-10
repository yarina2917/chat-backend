# GH chat. Routes v1

### <b>NOTE:</b> `x-api-key` header is required to each request.

**Get contacts**
----

* **URL**

   /contacts
   
* **Method:**

   GET

* **Headers**
    
    x-api-key: [string]  
        
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
        [{
          "_id": "5e906f8387f5990a5f554f38",
          "username": "testUser"
        }]
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]
      
**Check if user exists in contact**
----

* **URL**

   /contacts/:id
   
* **Method:**

   GET

* **Headers**
    
    x-api-key: [string]  
        
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
        {"data": "true | false"}
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]
      
**Get contacts**
----

* **URL**

   /contacts/:username
   
* **Method:**

   POST

* **Headers**
    
    x-api-key: [string]  
     
        
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
        [{
          "_id": "5e906f8387f5990a5f554f38",
          "username": "testUser"
        }]
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]
      
**Delete contact**
----

* **URL**

   /contacts/:id
   
* **Method:**

   DELETE

* **Headers**
    
    x-api-key: [string]  
        
* **Success Response:**

   **Code:** 200
   
   **Content:** 
   ```json
        { "message": "Success" }
   ```
   
*  **Failure Response:**
   
      **Code:** [number]
      
      **Content:** [string]      
