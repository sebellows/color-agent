"""Script to create database tables."""

import asyncio
import logging
from sqlalchemy.ext.asyncio import create_async_engine

from ..core.config import settings
from ..models.base import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_tables():
    """Create database tables."""
    logger.info("Creating database tables...")

    engine = create_async_engine(settings.DATABASE_URL)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    await engine.dispose()

    logger.info("Database tables created successfully!")


if __name__ == "__main__":
    asyncio.run(create_tables())
