"""Database module."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
import asyncio
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_scoped_session,
    async_sessionmaker,
    create_async_engine,
)
from .config import settings

# Reference: https://docs.astral.sh/ruff/rules/asyncio-dangling-task/
_background_tasks = set()


class AsyncSessionHandler:
    """SQLAlchemy async binder and handler."""

    scoped_session: async_scoped_session[AsyncSession]

    def __init__(self):
        # Create async engine
        engine = create_async_engine(
            settings.db.DB_URL, echo=settings.db.DB_ECHO_LOG, future=True
        )
        session_factory = async_sessionmaker(
            bind=engine, expire_on_commit=False, class_=AsyncSession
        )
        self.scoped_session = async_scoped_session(
            session_factory, scopefunc=asyncio.current_task
        )

    def __del__(self):
        if not getattr(self, "scoped_session", None):
            return

        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                task = loop.create_task(self.scoped_session.remove())
                # Add task to the set. This creates a strong reference.
                _background_tasks.add(task)

                # To prevent keeping references to finished tasks forever,
                # make each task remove its own reference from the set after
                # completion:
                task.add_done_callback(_background_tasks.discard)
            else:
                loop.run_until_complete(self.scoped_session.remove())
        except RuntimeError:
            asyncio.run(self.scoped_session.remove())

    @asynccontextmanager
    async def get_session(self) -> AsyncGenerator[AsyncSession]:
        """Get session."""
        session = self.scoped_session()
        try:
            session.begin()
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
