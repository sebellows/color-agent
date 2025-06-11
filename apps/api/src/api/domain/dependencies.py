from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing_extensions import Annotated

from api.core.setup import alchemy


DatabaseSession = Annotated[AsyncSession, Depends(alchemy.provide_session())]
