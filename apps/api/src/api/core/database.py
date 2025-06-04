"""Database module."""

from typing import AsyncGenerator

from advanced_alchemy.base import orm_registry
from sqlalchemy import ForeignKeyConstraint, MetaData, Table, inspect
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.schema import DropConstraint, DropTable

from .config import settings


class DB:
    """Singleton class for managing database connections."""

    _instance: "DB | None" = None

    """Create async engine"""
    _engine: AsyncEngine | None = None

    """Create async session factory"""
    _session_factory: async_sessionmaker | None = None

    @property
    def engine(self) -> AsyncEngine:
        """Get the async engine."""
        if (engine := self._engine) is not None:
            return engine
        raise ValueError("Database engine is not initialized.")

    @property
    def session_factory(self) -> async_sessionmaker:
        """Get the async session factory."""
        if (session := self._session_factory) is not None:
            return session
        raise ValueError("Database session factory cannot be initialized.")

    @property
    def metadata(self) -> MetaData:
        """Get the metadata for the database schema."""
        return orm_registry.metadata

    def __init__(self):
        """Initialize the database connection."""
        if self._instance is not None:
            raise RuntimeError("Call instance() instead")
        self._instance = self

    @classmethod
    def instance(cls) -> "DB":
        """Get the singleton instance of the DB class."""
        if cls._instance is None:
            cls._instance = cls.__new__(cls)
            async_engine = create_async_engine(settings.db.DB_URL, echo=settings.db.DB_ECHO_LOG, future=True)
            cls._instance._engine = async_engine
            cls._instance._session_factory = async_sessionmaker(
                async_engine, expire_on_commit=False, class_=AsyncSession
            )

        return cls._instance

    @classmethod
    async def get_session(cls) -> AsyncGenerator[AsyncSession]:
        """Get a database session."""
        db = cls.instance()

        async with db.session_factory() as session:
            try:
                await session.begin()
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

    @classmethod
    async def create_all(cls):
        """Create all tables in the database."""
        db = cls.instance()

        async with db.engine.begin() as conn:
            await conn.run_sync(db.metadata.create_all, checkfirst=True)

    @classmethod
    async def drop_all(cls) -> None:
        db = cls.instance()

        async with db.engine.begin() as conn:
            table_names = await conn.run_sync(lambda sync_conn: inspect(sync_conn).get_table_names())
            tables = []
            all_fkeys = []
            for table_name in table_names:
                fkeys = []
                foreign_keys = await conn.run_sync(
                    lambda sync_conn: inspect(sync_conn).get_foreign_keys(
                        table_name  # noqa: B023
                    )  # noqa: E501
                )
                for fkey in foreign_keys:
                    if not fkey["name"]:
                        continue
                    fkeys.append(ForeignKeyConstraint((), (), name=fkey["name"]))

                for tablekey in db.metadata.tables:
                    if tablekey == table_name:
                        table = db.metadata.tables[tablekey]
                        await conn.run_sync(table.drop)

                tables.append(Table(table_name, db.metadata, *fkeys))
                all_fkeys.extend(fkeys)

            for fkey in all_fkeys:
                await conn.execute(DropConstraint(fkey))

            for table in tables:
                await conn.execute(DropTable(table))
            await conn.commit()


# Create async engine
async_engine = create_async_engine(settings.db.DB_URL, echo=settings.db.DB_ECHO_LOG, future=True)

# Create async session factory
async_session_factory = async_sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)


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
