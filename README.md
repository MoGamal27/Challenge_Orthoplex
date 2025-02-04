# User Management API

## live Preview
link: https://documenter.getpostman.com/view/37843029/2sAYX5KN1r
## Project Setup
1. Clone the repository
2. Install dependencies:
```bash
 npm install
 ```

2. **Add your .env file like .example.env**

3. **Commands**
    ```bash
    npm run db:start // to init tables
    npm run start
    ```
## API Endpoints
### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - User login
- POST /api/auth/verifyOtp - Verify OTP

### User Management
- GET /api/users - Get all users with filters and pagination
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user
- GET /api/users/top - Get top 3 users by login frequency
- GET /api/users/inactive - Get inactive users

## Testing
- Unit tests are located in the test folder.
- To run tests, use the following command:
```bash
npm test
```
## Project Structure
- routes/: Contains all the endpoints definitions for the project.
- controller/: Contains the business logic and interactions with the database.
- database/: Contains the database models and schemas.  
-middleware/: Contains the middleware functions used for authentication and authorization.
- utils/: Contains utility functions and helpers shared across different parts of the application.

## Postman Collection 
- file: "Orthoplex_Challenge.postman_collection" 
- import it to postman