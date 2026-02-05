# Data Model: ChatKit Agent Integration

## ChatHistory Model

### Entity Definition
- **Name**: ChatHistory
- **Description**: Stores the conversation history between users and the AI agent

### Fields
- **id**: UUID (Primary Key, Default: uuid4)
- **user_id**: UUID (Foreign Key: User.id, Index: true)
- **user_query**: TEXT (Not Null)
- **agent_response**: TEXT (Not Null)
- **task_performed**: VARCHAR(100) (Nullable, Values: "CREATE_TODO", "UPDATE_TODO", "DELETE_TODO", "TOGGLE_TODO", "GENERAL_QUERY")
- **timestamp**: DATETIME (Default: datetime.utcnow, Index: true)

### Relationships
- **user**: Many-to-One relationship with User model (user_id → User.id)

### Validation Rules
- user_query must not be empty
- agent_response must not be empty
- task_performed must be one of the allowed values if provided
- user_id must reference an existing user

## AgentSession Model (Optional)

### Entity Definition
- **Name**: AgentSession
- **Description**: Tracks active agent sessions for users (only needed if implementing persistent sessions)

### Fields
- **id**: UUID (Primary Key, Default: uuid4)
- **user_id**: UUID (Foreign Key: User.id, Index: true)
- **session_token**: VARCHAR(255) (Unique, Not Null)
- **created_at**: DATETIME (Default: datetime.utcnow)
- **expires_at**: DATETIME (Not Null)
- **is_active**: BOOLEAN (Default: true)

### Relationships
- **user**: Many-to-One relationship with User model (user_id → User.id)

### Validation Rules
- session_token must be unique
- expires_at must be in the future
- Only one active session per user

## TodoOperationLog Model (Optional)

### Entity Definition
- **Name**: TodoOperationLog
- **Description**: Logs specific todo operations performed by the agent

### Fields
- **id**: UUID (Primary Key, Default: uuid4)
- **chat_history_id**: UUID (Foreign Key: ChatHistory.id, Index: true)
- **operation_type**: VARCHAR(50) (Not Null, Values: "CREATE", "UPDATE", "DELETE", "TOGGLE")
- **todo_id**: UUID (Foreign Key: TodoItem.id, Nullable)
- **previous_state**: JSON (Nullable)
- **new_state**: JSON (Nullable)
- **timestamp**: DATETIME (Default: datetime.utcnow)

### Relationships
- **chat_history**: One-to-Many relationship with ChatHistory model (chat_history_id → ChatHistory.id)
- **todo_item**: Many-to-One relationship with TodoItem model (todo_id → TodoItem.id, Nullable)

### Validation Rules
- operation_type must be one of the allowed values
- chat_history_id must reference an existing chat history record