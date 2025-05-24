"""Database module."""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from .config import settings

# Create async engine
async_engine = create_async_engine(
    settings.db.DB_URL, echo=settings.db.DB_ECHO_LOG, future=True
)

# Create async session factory
async_session_factory = async_sessionmaker(
    async_engine, expire_on_commit=False, class_=AsyncSession
)


async def get_db() -> AsyncGenerator[AsyncSession]:
    """Get database session."""
    async with async_session_factory() as session:
        try:
            session.begin()
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
