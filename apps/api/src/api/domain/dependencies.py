from core.setup import alchemy
from domain.services import ServicesContainer
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing_extensions import Annotated


DatabaseSession = Annotated[AsyncSession, Depends(alchemy.provide_async_session())]


async def get_services(
    session: DatabaseSession,
):
    try:
        yield ServicesContainer(session)
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()


Services = Annotated[ServicesContainer, Depends(get_services)]
