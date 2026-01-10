"""
Database transaction management for complex operations
"""

from typing import Callable, Any
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status

from src.db.session import AsyncSessionLocal


@asynccontextmanager
async def get_db_session():
    """
    Context manager for database sessions with automatic rollback on exception.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except SQLAlchemyError as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error occurred: {str(e)}"
            )
        except Exception as e:
            await session.rollback()
            raise e


async def execute_in_transaction(func: Callable[[AsyncSession], Any]):
    """
    Execute a function within a database transaction.
    If the function raises an exception, the transaction will be rolled back.
    """
    async with AsyncSessionLocal() as session:
        try:
            result = await func(session)
            await session.commit()
            return result
        except SQLAlchemyError as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database transaction failed: {str(e)}"
            )
        except Exception as e:
            await session.rollback()
            raise e


async def batch_operation(session: AsyncSession, operations: list):
    """
    Execute multiple database operations in a single transaction.
    """
    results = []
    for operation in operations:
        try:
            result = await operation(session)
            results.append(result)
        except Exception as e:
            # Log the error but continue with other operations
            # In a real implementation, you might want to handle this differently
            print(f"Batch operation error: {str(e)}")
            results.append(None)
    
    return results