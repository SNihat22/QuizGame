### Installation

_Install NPM packages_

1. Navigate to the **_frontend_** folder via a terminal and run

   ```javascript
   npm install
   ```

2. Navigate to the **_backend_** folder via a terminal and run

   ```javascript
   npm install
   ```

   **_Note:_** In order to use the database, create a **.env** file in the **_backend_** folder and add an enviromental variable **MONGO_ATLAS_URI** and set it equal to URI provided by MongoDB Atlas.

3. ###database connection: Go to backend folder> config folder> database.js and replace your connection string with the string there

## Usage

1. To run the backend navigate to the **_backend_** folder and run

   ```javascript
   node app.js
   ```

2. To run the frontend navigate to the **_frontend_** folder and run
   ```javascript
   npm start
   ```
