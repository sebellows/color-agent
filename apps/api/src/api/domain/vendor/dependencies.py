from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import Vendor
from .repository import VendorRepository


def provide_vendor_repository(
    db: AsyncSession = Depends(get_db),
) -> VendorRepository:
    """Dependency to provide VendorRepository instance."""
    return VendorRepository(
        session=db,
        statement=select(Vendor).where(Vendor.is_deleted.is_(False)),
    )
