from core.setup import provide_service
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing_extensions import Annotated


DatabaseSession = Annotated[AsyncSession, Depends(provide_service())]
