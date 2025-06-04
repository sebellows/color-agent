from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .repository import LocaleRepository


def provide_locale_repository(
    db: AsyncSession = Depends(get_db),
) -> LocaleRepository:
    """Dependency to provide ProductVariantRepository instance."""
    return LocaleRepository(session=db)
