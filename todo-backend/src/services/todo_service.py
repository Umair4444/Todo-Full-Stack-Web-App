from sqlmodel import Session, select
from typing import List, Optional
from ..models.todo_model import TodoItem, TodoItemCreate, TodoItemUpdate, TodoItemResponse


class TodoService:
    @staticmethod
    def create_todo(session: Session, todo_item: TodoItemCreate) -> TodoItemResponse:
        """
        Creates a new todo item in the database.
        """
        db_todo = TodoItem.model_validate(todo_item)
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
        
        # Convert to response model
        response = TodoItemResponse(
            id=db_todo.id,
            title=db_todo.title,
            description=db_todo.description,
            is_completed=db_todo.is_completed,
            created_at=db_todo.created_at,
            updated_at=db_todo.updated_at
        )
        return response

    @staticmethod
    def get_todo(session: Session, todo_id: int) -> Optional[TodoItemResponse]:
        """
        Retrieves a todo item by its ID.
        """
        db_todo = session.get(TodoItem, todo_id)
        if db_todo is None:
            return None
        
        response = TodoItemResponse(
            id=db_todo.id,
            title=db_todo.title,
            description=db_todo.description,
            is_completed=db_todo.is_completed,
            created_at=db_todo.created_at,
            updated_at=db_todo.updated_at
        )
        return response

    @staticmethod
    def get_todos(
        session: Session, 
        offset: int = 0, 
        limit: int = 100,
        completed: Optional[bool] = None
    ) -> List[TodoItemResponse]:
        """
        Retrieves a list of todo items with optional filtering and pagination.
        """
        query = select(TodoItem)
        
        # Apply filters
        if completed is not None:
            query = query.where(TodoItem.is_completed == completed)
        
        # Apply pagination
        query = query.offset(offset).limit(limit)
        
        db_todos = session.exec(query).all()
        
        # Convert to response models
        response_list = []
        for db_todo in db_todos:
            response = TodoItemResponse(
                id=db_todo.id,
                title=db_todo.title,
                description=db_todo.description,
                is_completed=db_todo.is_completed,
                created_at=db_todo.created_at,
                updated_at=db_todo.updated_at
            )
            response_list.append(response)
        
        return response_list

    @staticmethod
    def update_todo(session: Session, todo_id: int, todo_update: TodoItemUpdate) -> Optional[TodoItemResponse]:
        """
        Updates an existing todo item.
        """
        db_todo = session.get(TodoItem, todo_id)
        if db_todo is None:
            return None
        
        # Update fields that are provided
        update_data = todo_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_todo, field, value)
        
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
        
        # Convert to response model
        response = TodoItemResponse(
            id=db_todo.id,
            title=db_todo.title,
            description=db_todo.description,
            is_completed=db_todo.is_completed,
            created_at=db_todo.created_at,
            updated_at=db_todo.updated_at
        )
        return response

    @staticmethod
    def delete_todo(session: Session, todo_id: int) -> bool:
        """
        Deletes a todo item by its ID.
        """
        db_todo = session.get(TodoItem, todo_id)
        if db_todo is None:
            return False
        
        session.delete(db_todo)
        session.commit()
        return True