from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .repository import TagRepository


def provide_tag_repository(
    db: AsyncSession = Depends(get_db),
) -> TagRepository:
    """Dependency to provide TagRepository instance."""
    return TagRepository(session=db)
