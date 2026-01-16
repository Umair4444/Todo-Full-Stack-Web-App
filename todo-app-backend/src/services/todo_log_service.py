from sqlmodel import Session, select
from typing import List
from uuid import UUID
from src.models.todo_log_model import TodoLog, TodoLogCreate


def create_todo_log(db: Session, log_data: TodoLogCreate) -> TodoLog:
    """
    Create a new log entry.
    """
    log_entry = TodoLog(
        action=log_data.action,
        todo_id=log_data.todo_id,
        user_id=log_data.user_id,
        previous_state=log_data.previous_state,
        new_state=log_data.new_state
    )

    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)

    return log_entry


def get_todo_logs(
    db: Session,
    user_id: UUID,
    skip: int = 0,
    limit: int = 100,
    action: str = None
) -> List[TodoLog]:
    """
    Retrieve log entries for the authenticated user with optional filtering.
    """
    query = select(TodoLog).where(TodoLog.user_id == user_id)

    # Apply action filter if provided
    if action:
        query = query.where(TodoLog.action == action)

    # Apply pagination and sort by timestamp descending
    query = query.offset(skip).limit(limit).order_by(TodoLog.timestamp.desc())

    logs = db.exec(query).all()
    return logs


def get_user_logs_count(db: Session, user_id: UUID) -> int:
    """
    Get the total count of logs for a user.
    """
    from sqlmodel import func
    count = db.exec(
        select(func.count(TodoLog.id)).where(TodoLog.user_id == user_id)
    ).one()
    return count