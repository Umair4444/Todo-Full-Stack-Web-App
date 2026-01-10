# Data Model: FastAPI Todo Backend

## Entity: User

### Fields:
- id: UUID (Primary Key, auto-generated)
- email: String (max 255 characters, unique, indexed, required)
- name: String (max 100 characters, optional)
- created_at: DateTime (timestamp, auto-generated)
- updated_at: DateTime (timestamp, auto-generated, updated on change)

### Relationships:
- todos: One-to-Many (User has many Todos)

### Validation Rules:
- Email must be a valid email format
- Email must be unique across all users
- Name length must not exceed 100 characters

## Entity: Todo

### Fields:
- id: UUID (Primary Key, auto-generated)
- title: String (max 100 characters, required)
- description: String (max 500 characters, optional)
- completed: Boolean (default: false)
- user_id: UUID (Foreign Key to User, required)
- created_at: DateTime (timestamp, auto-generated)
- updated_at: DateTime (timestamp, auto-generated, updated on change)
- version: Integer (for optimistic locking, starts at 1)

### Relationships:
- user: Many-to-One (Todo belongs to one User)

### Validation Rules:
- Title length must be between 1 and 100 characters
- Description length must not exceed 500 characters
- user_id must reference an existing User
- version must be incremented on each update

### State Transitions:
- New Todo: completed = false by default
- Todo completion: completed = true when toggled
- Todo reactivation: completed = false when toggled from completed state

## Database Indexes:
- User.email: Unique index for fast lookups and uniqueness enforcement
- Todo.user_id: Index for efficient filtering by user
- Todo.created_at: Index for chronological sorting