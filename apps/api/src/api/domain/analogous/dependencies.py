from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .repository import AnalogousRepository


def provide_analogous_repository(
    db: AsyncSession = Depends(get_db),
) -> AnalogousRepository:
    """Dependency to provide AnalogousRepository instance."""
    return AnalogousRepository(session=db)
