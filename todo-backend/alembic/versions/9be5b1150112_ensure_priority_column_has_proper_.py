"""ensure priority column has proper string values

Revision ID: 9be5b1150112
Revises: 4f637488a4e0
Create Date: 2026-01-12 20:21:25.907188

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '9be5b1150112'
down_revision: Union[str, None] = '4f637488a4e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Update any remaining priority values to ensure they are proper strings
    # This handles cases where the migration might not have properly converted all values
    conn = op.get_bind()

    # Update any remaining numeric values to their string equivalents
    # First, try to update any values that might still be numeric
    # Since the column is now a string, we'll check if they look like numbers
    conn.execute(sa.text("""
        UPDATE todoitem
        SET priority = CASE
            WHEN priority IN ('1', '2') THEN 'low'
            WHEN priority = '3' THEN 'medium'
            WHEN priority IN ('4', '5') THEN 'high'
            ELSE 'low'  -- Default to low if value is unexpected
        END
        WHERE priority IN ('1', '2', '3', '4', '5')
    """))

    # Handle any remaining cases where priority might be null, empty, or invalid
    conn.execute(sa.text("""
        UPDATE todoitem
        SET priority = 'low'
        WHERE priority IS NULL OR priority = '' OR priority = 'None' OR priority = 'null'
    """))


def downgrade() -> None:
    # Convert string values back to numeric values for downgrade
    conn = op.get_bind()

    conn.execute(sa.text("""
        UPDATE todoitem
        SET priority = CASE
            WHEN priority = 'low' THEN '1'
            WHEN priority = 'medium' THEN '3'
            WHEN priority = 'high' THEN '5'
            ELSE '1'  -- Default to 1 if value is unexpected
        END
    """))