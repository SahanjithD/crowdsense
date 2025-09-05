# Testing Admin Dashboard Endpoints with Thunder Client

## Setup
1. Install Thunder Client extension in VS Code if not already installed
2. Make sure your backend server is running (`npm run dev` in backend folder)
3. Base URL: `http://localhost:8080`
4. Environment Variables:
   - Create a new Environment in Thunder Client
   - Add variable `token` after signing in

## Authentication
### Sign In (Get JWT Token)
- **Method**: POST
- **URL**: `http://localhost:8080/api/auth/signin`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "email": "admin@crowdsense.dev",
    "password": "your_admin_password"
  }
  ```
- **Response**: Copy the `token` from the response, you'll need it for other requests

## Admin Endpoints

### Get All Feedback
- **Method**: GET
- **URL**: `http://localhost:8080/api/feedback/admin/all`
- **Headers**:
  ```
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json
  ```
- **Expected Response**:
  ```json
  [
    {
      "feedback_id": "...",
      "space_name": "...",
      "rating": 5,
      "comment": "...",
      "created_at": "..."
    }
  ]
  ```

### Get Admin Stats
- **Method**: GET
- **URL**: `http://localhost:8080/api/feedback/admin/stats`
- **Headers**:
  ```
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json
  ```
- **Expected Response**:
  ```json
  {
    "total_spaces": 10,
    "total_feedback": 25,
    "total_users": 50
  }
  ```

### Get All Spaces
- **Method**: GET
- **URL**: `http://localhost:8080/api/feedback/spaces`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- Note: This endpoint doesn't require authentication
- **Expected Response**:
  ```json
  [
    {
      "space_id": "...",
      "name": "...",
      "space_type": "...",
      "latitude": 0,
      "longitude": 0,
      "address": "...",
      "avg_rating": 4.5,
      "total_feedback_count": 10
    }
  ]
  ```

## Testing Flow
1. First, make the signin request to get your JWT token
2. Copy the token from the response
3. Use this token in the Authorization header for the admin endpoints
4. Test each endpoint and verify the responses match the expected format

### User Management Endpoints

### Get All Users
- **Method**: GET
- **URL**: `http://localhost:8080/api/admin/users`
- **Headers**:
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Expected Response**:
  ```json
  [
    {
      "user_id": "...",
      "email": "...",
      "firstName": "...",
      "lastName": "...",
      "role": "admin|user|moderator",
      "created_at": "2025-09-01T...",
      "last_login": "2025-09-01T...",
      "status": "active|inactive"
    }
  ]
  ```

### Update User Role
- **Method**: PUT
- **URL**: `http://localhost:8080/api/admin/users/:userId/role`
- **Headers**:
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "role": "user" // or "admin" or "moderator"
  }
  ```
- **Expected Response**:
  ```json
  {
    "message": "User role updated successfully"
  }
  ```

### Update User Status
- **Method**: PUT
- **URL**: `http://localhost:8080/api/admin/users/:userId/status`
- **Headers**:
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "isActive": true // or false
  }
  ```
- **Expected Response**:
  ```json
  {
    "message": "User status updated successfully"
  }
  ```

## Testing Flow
1. First, make the signin request to get your JWT token
2. Copy the token from the response
3. In Thunder Client, create a new Environment
4. Add a variable named `token` and paste your JWT token
5. Use `{{token}}` in your Authorization headers for admin endpoints
6. Test each endpoint and verify the responses match the expected format

## User Profile Endpoints

### Get User Profile
- **Method**: GET
- **URL**: `http://localhost:8080/api/users/profile`
- **Headers**:
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Expected Response**:
  ```json
  {
    "success": true,
    "user": {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```

### Update User Profile
- **Method**: PUT
- **URL**: `http://localhost:8080/api/users/profile`
- **Headers**:
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Expected Response**:
  ```json
  {
    "success": true,
    "user": {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```
- **Error Responses**:
  ```json
  {
    "error": "First name and last name are required"
  }
  ```
  ```json
  {
    "error": "User not found"
  }
  ```

## Common Issues
- If you get a 401 error, your token might be expired. Get a new one by signing in again
- If you get a 403 error, make sure you're using an admin account
- Make sure to include the "Bearer " prefix before your token in the Authorization header
- When updating user role, ensure the role is one of: "admin", "moderator", or "user"
- When updating user status, isActive must be a boolean (true/false)
- For profile updates, both firstName and lastName are required fields
