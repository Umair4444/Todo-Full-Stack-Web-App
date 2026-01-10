# How-To Guides for Common Operations

This document provides step-by-step instructions for performing common operations in the Todo Full-Stack Web Application.

## Table of Contents
1. [Setting Up the Development Environment](#setting-up-the-development-environment)
2. [Running the Application Locally](#running-the-application-locally)
3. [Managing User Accounts](#managing-user-accounts)
4. [Creating and Managing Todos](#creating-and-managing-todos)
5. [Customizing the Application](#customizing-the-application)
6. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Setting Up the Development Environment

### Prerequisites
- Node.js (version 18.x or higher)
- npm (version 8.x or higher)
- Python 3.11 or higher
- PostgreSQL database (or Docker for containerized setup)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file with the required environment variables:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/todo_db
   SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   NEON_DATABASE_URL=postgresql+asyncpg://username:password@ep-xxx.us-east-1.aws.neon.tech/todo_db?sslmode=require
   AUTH_SECRET=your-better-auth-secret
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the required environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=Todo App
   ```

## Running the Application Locally

### Running the Backend
1. Make sure you're in the backend directory and your virtual environment is activated
2. Run the backend server:
   ```bash
   uvicorn src.main:app --reload
   ```
3. The backend will be available at `http://localhost:8000`

### Running the Frontend
1. Make sure you're in the todo-app directory
2. Run the development server:
   ```bash
   npm run dev
   ```
3. The frontend will be available at `http://localhost:3000`

### Running with Docker
1. Navigate to the backend directory
2. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

## Managing User Accounts

### Registering a New User
1. Navigate to the registration page (usually `/register`)
2. Fill in the registration form with:
   - Email address
   - Password (must meet complexity requirements)
   - Name (optional)
3. Click the "Register" button
4. You'll be redirected to the login page after successful registration

### Logging In
1. Navigate to the login page (usually `/login`)
2. Enter your email and password
3. Click the "Sign In" button
4. You'll be redirected to the todo application page after successful login

### Updating User Profile
1. Click on your profile icon in the top-right corner
2. Select "Profile" from the dropdown menu
3. Update your information as needed
4. Save your changes

### Logging Out
1. Click on your profile icon in the top-right corner
2. Select "Log out" from the dropdown menu
3. You'll be redirected to the home page

## Creating and Managing Todos

### Creating a New Todo
1. Navigate to the todo application page
2. Click on the "Add New Task" card
3. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Priority (low, medium, high)
4. Click the "Add Task" button
5. The new task will appear in your todo list

### Updating a Todo
1. Find the todo you want to update in your list
2. Click the edit icon (pencil) next to the task
3. Modify the task details as needed
4. Click the save icon (checkmark) to save changes
5. The task will be updated in your list

### Completing a Todo
1. Find the todo you want to mark as complete
2. Click the checkbox next to the task title
3. The task will be visually marked as completed
4. The completion status will be saved automatically

### Deleting a Todo
1. Find the todo you want to delete
2. Click the delete icon (trash can) next to the task
3. Confirm the deletion if prompted
4. The task will be removed from your list

### Filtering and Searching Todos
1. Use the search bar to filter todos by title or description
2. Use the status filter to show all, active, or completed tasks
3. Use the priority filter to show tasks by priority level
4. Use pagination controls to navigate through multiple pages of tasks

## Customizing the Application

### Changing Themes
1. Click the theme toggle button (usually in the top navigation bar)
2. Choose between light and dark themes
3. The theme preference will be saved automatically

### Changing Languages
1. Click the language selector (usually in the top navigation bar)
2. Choose between English and Urdu
3. The language preference will be saved automatically

### Managing Notifications
1. Go to your profile settings
2. Toggle the "Enable notifications" option on or off
3. Changes will be saved automatically

## Troubleshooting Common Issues

### Backend Issues

#### Database Connection Issues
- Ensure PostgreSQL is running
- Verify your database URL in the `.env` file
- Check that the database exists and has the correct permissions

#### Authentication Issues
- Verify that your secret keys are properly set in the `.env` file
- Ensure JWT tokens are being properly generated and validated
- Check that the token expiration time is appropriate

### Frontend Issues

#### API Connection Issues
- Verify that the backend server is running
- Check that `NEXT_PUBLIC_API_URL` is set correctly in your `.env.local` file
- Ensure CORS settings allow requests from your frontend domain

#### State Management Issues
- Clear browser storage if experiencing inconsistent state
- Check that Zustand store is properly configured
- Verify that state updates are happening as expected

### General Issues

#### Slow Performance
- Check for unnecessary re-renders in React components
- Optimize database queries if backend is slow
- Consider implementing caching strategies

#### Build Failures
- Ensure all dependencies are properly installed
- Check for syntax errors in your code
- Verify that environment variables are properly set

### Getting Help
If you encounter issues not covered in this guide:
1. Check the application logs for error messages
2. Review the API documentation for endpoint details
3. Consult the project's issue tracker for similar problems
4. Reach out to the development team for assistance