# User Management System API

A RESTful API for User Management with features like user registration, authentication, profile management, and admin capabilities.

## Table of Contents
- [Features](#features)
- [Project Setup](#project-setup)
- [API Documentation](#api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [Security Features](#security-features)
- [Design Decisions](#design-decisions)
- [Error Handling](#error-handling)

## Features

- User Registration and Authentication
- Profile Management
- Account Deactivation
- Admin Dashboard
- Role-based Access Control
- Input Validation
- Secure Password Storage
- JWT-based Authentication

## Project Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```
   For development:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "1234567890"
  }
  ```
- **Success Response**: 
  - Status: 201
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "1234567890"
    }
  }
  ```
- **Error Response**:
  - Status: 400
  ```json
  {
    "message": "User already exists"
  }
  ```

#### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  - Status: 200
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "1234567890",
      "role": "user"
    }
  }
  ```
- **Error Response**:
  - Status: 401
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### User Endpoints

#### Get User Profile
- **URL**: `/api/users/me`
- **Method**: `GET`
- **Headers**: 
  - Authorization: Bearer {token}
- **Success Response**:
  - Status: 200
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "1234567890"
    }
  }
  ```

#### Update Profile
- **URL**: `/api/users/update`
- **Method**: `PATCH`
- **Headers**: 
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "name": "John Smith",
    "phoneNumber": "9876543210"
  }
  ```
- **Success Response**:
  - Status: 200
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": "user_id",
      "name": "John Smith",
      "email": "john@example.com",
      "phoneNumber": "9876543210"
    }
  }
  ```

#### Deactivate Account
- **URL**: `/api/users/deactivate`
- **Method**: `PATCH`
- **Headers**: 
  - Authorization: Bearer {token}
- **Success Response**:
  - Status: 200
  ```json
  {
    "message": "Account deactivated successfully"
  }
  ```

### Admin Endpoints

#### Get All Users
- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Headers**: 
  - Authorization: Bearer {token}
- **Success Response**:
  - Status: 200
  ```json
  {
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "1234567890",
        "role": "user",
        "isActive": true,
        "createdAt": "2023-09-20T12:00:00.000Z"
      }
    ]
  }
  ```
- **Error Response**:
  - Status: 403
  ```json
  {
    "message": "You do not have permission to perform this action"
  }
  ```

## Security Features

- **Password Security**:
  - Passwords are hashed using bcrypt
  - Minimum length: 8 characters
  - Never stored in plain text

- **Authentication**:
  - JWT-based token system
  - Tokens expire after 30 days
  - Protected routes require valid token

- **Input Validation**:
  - Email format validation
  - Phone number format validation
  - Input sanitization
  - Schema-level constraints

- **Access Control**:
  - Role-based permissions
  - Admin-only routes
  - Middleware protection

## Design Decisions

### Super Admin Implementation
- Created through regular registration
- Role field in User model (`user` or `admin`)
- First admin set manually in database
- No separate admin table needed

### Account Deactivation
- Soft delete approach
- User data preserved
- `isActive` flag controls access
- Prevents duplicate emails
- Historical data maintained

## Error Handling

The API provides detailed error messages for:
- Invalid credentials
- Duplicate registration
- Validation failures
- Unauthorized access
- Server errors
- Permission denied

Each error response includes:
- Appropriate HTTP status code
- Clear error message
- Additional details when relevant
