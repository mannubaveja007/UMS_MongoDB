# User Management System

A RESTful API for User Management with features like user registration, authentication, profile management, and admin capabilities.

## Features

- User Registration with name, email, password, and phone number
- User Authentication using JWT
- Profile Management (view and update)
- Account Deactivation
- Admin Dashboard to view all users
- Input validation and error handling
- Secure password storage using bcrypt
- Role-based access control

## Project Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login

### User Routes (Protected)
- GET /api/users/me - Get user profile
- PATCH /api/users/update - Update user profile
- PATCH /api/users/deactivate - Deactivate account

### Admin Routes (Protected, Admin Only)
- GET /api/admin/users - Get all users

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation using express-validator
- Role-based access control
- Account deactivation instead of deletion for data preservation

## Design Decisions

1. **Super Admin Implementation**:
   - Super admin is created through the regular registration process
   - The role field in the User model determines admin status
   - First registered user can be manually set as admin in the database

2. **Account Deactivation**:
   - Users are not deleted but marked as inactive
   - Preserves user data for audit purposes
   - Prevents re-registration with same email
   - Deactivated users cannot login

3. **Validation**:
   - Email format validation
   - Password minimum length (8 characters)
   - Phone number format validation
   - Unique email constraint
   - Input sanitization

## Frontend

A simple HTML/CSS frontend is included with:
- Login/Register forms
- User profile management
- Admin dashboard
- Responsive design
- Token-based authentication

## Error Handling

- Graceful error messages for:
  - Invalid credentials
  - Duplicate email registration
  - Invalid input formats
  - Unauthorized access
  - Server errors