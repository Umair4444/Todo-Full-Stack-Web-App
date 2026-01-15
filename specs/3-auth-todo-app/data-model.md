# Data Model: Better Auth Integration – Todo Application

## User Entity

### Fields
- `id`: UUID (Primary Key)
  - Type: UUID
  - Constraints: Unique, Not Null, Primary Key
  - Description: Unique identifier for the user
  
- `email`: String (Unique, Indexed)
  - Type: VARCHAR(255)
  - Constraints: Unique, Not Null, Indexed
  - Description: User's email address used for login
  
- `password_hash`: String
  - Type: VARCHAR(255)
  - Constraints: Not Null
  - Description: Hashed password using bcrypt or similar
  
- `first_name`: String (Optional)
  - Type: VARCHAR(100)
  - Constraints: Nullable
  - Description: User's first name
  
- `last_name`: String (Optional)
  - Type: VARCHAR(100)
  - Constraints: Nullable
  - Description: User's last name
  
- `created_at`: DateTime (Indexed)
  - Type: TIMESTAMP
  - Constraints: Not Null, Indexed
  - Description: Timestamp when user account was created
  
- `updated_at`: DateTime
  - Type: TIMESTAMP
  - Constraints: Not Null
  - Description: Timestamp when user account was last updated
  
- `is_active`: Boolean
  - Type: BOOLEAN
  - Constraints: Not Null, Default: True
  - Description: Indicates if the user account is active

### Relationships
- One-to-many: User → Todo (user_id foreign key in Todo)
- One-to-many: User → TodoLog (user_id foreign key in TodoLog)

## Todo Entity

### Fields
- `id`: UUID (Primary Key)
  - Type: UUID
  - Constraints: Unique, Not Null, Primary Key
  - Description: Unique identifier for the todo item
  
- `title`: String
  - Type: VARCHAR(255)
  - Constraints: Not Null
  - Description: Title of the todo item
  
- `description`: Text (Optional)
  - Type: TEXT
  - Constraints: Nullable
  - Description: Detailed description of the todo item
  
- `is_completed`: Boolean
  - Type: BOOLEAN
  - Constraints: Not Null, Default: False
  - Description: Indicates if the todo item is completed
  
- `user_id`: UUID (Foreign Key to User.id, Indexed)
  - Type: UUID
  - Constraints: Not Null, Foreign Key to User.id, Indexed
  - Description: Reference to the user who owns this todo
  
- `created_at`: DateTime (Indexed)
  - Type: TIMESTAMP
  - Constraints: Not Null, Indexed
  - Description: Timestamp when todo was created
  
- `updated_at`: DateTime
  - Type: TIMESTAMP
  - Constraints: Not Null
  - Description: Timestamp when todo was last updated
  
- `completed_at`: DateTime (Optional)
  - Type: TIMESTAMP
  - Constraints: Nullable
  - Description: Timestamp when todo was marked as completed

### Relationships
- Many-to-one: Todo → User (user_id foreign key references User.id)
- One-to-many: Todo → TodoLog (todo_id foreign key in TodoLog)

## TodoLog Entity

### Fields
- `id`: UUID (Primary Key)
  - Type: UUID
  - Constraints: Unique, Not Null, Primary Key
  - Description: Unique identifier for the log entry
  
- `action`: String (Enum: 'CREATE', 'UPDATE', 'DELETE')
  - Type: VARCHAR(10)
  - Constraints: Not Null, Check: IN ('CREATE', 'UPDATE', 'DELETE')
  - Description: Type of action performed on a todo
  
- `todo_id`: UUID (Foreign Key to Todo.id, Optional)
  - Type: UUID
  - Constraints: Nullable, Foreign Key to Todo.id
  - Description: Reference to the todo that was affected (nullable for user actions not tied to specific todo)
  
- `user_id`: UUID (Foreign Key to User.id, Indexed)
  - Type: UUID
  - Constraints: Not Null, Foreign Key to User.id, Indexed
  - Description: Reference to the user who performed the action
  
- `timestamp`: DateTime (Indexed)
  - Type: TIMESTAMP
  - Constraints: Not Null, Indexed
  - Description: Timestamp when the action was performed
  
- `previous_state`: JSON (Optional)
  - Type: JSONB
  - Constraints: Nullable
  - Description: Previous state of the todo before the action (for UPDATE actions)
  
- `new_state`: JSON (Optional)
  - Type: JSONB
  - Constraints: Nullable
  - Description: New state of the todo after the action (for CREATE/UPDATE actions)

### Relationships
- Many-to-one: TodoLog → User (user_id foreign key references User.id)
- Many-to-one: TodoLog → Todo (todo_id foreign key references Todo.id, nullable)

## Validation Rules

### User Validation
- Email must be a valid email format
- Password must meet complexity requirements (min 8 chars with upper, lower, number, special)
- Email must be unique across all users
- First and last name must not exceed 100 characters

### Todo Validation
- Title must not exceed 255 characters
- Title must not be empty
- Description must not exceed 10000 characters
- User ID must reference an existing user
- Only the owner can modify or delete a todo

### TodoLog Validation
- Action must be one of 'CREATE', 'UPDATE', 'DELETE'
- User ID must reference an existing user
- Todo ID (if provided) must reference an existing todo
- Timestamp must be current or past time

## Indexes

### User Table
- Primary Key: id
- Unique: email
- Index: email (for login queries)
- Index: created_at (for sorting/filtering by creation date)

### Todo Table
- Primary Key: id
- Index: user_id (for filtering todos by user)
- Index: is_completed (for filtering completed/incomplete todos)
- Index: created_at (for sorting by creation date)
- Index: completed_at (for sorting by completion date)

### TodoLog Table
- Primary Key: id
- Index: user_id (for filtering logs by user)
- Index: todo_id (for filtering logs by todo)
- Index: action (for filtering logs by action type)
- Index: timestamp (for chronological ordering)