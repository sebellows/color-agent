"""Database module."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import redis.asyncio as redis
from advanced_alchemy.base import orm_registry
from advanced_alchemy.extensions.fastapi import AdvancedAlchemy, AsyncSessionConfig
from advanced_alchemy.extensions.starlette import SQLAlchemyAsyncConfig
from core.config import RedisCacheSettings, Settings, settings
from core.logger import log_request_middleware, setup_logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services import Cache, Queue
from sqlalchemy.ext.asyncio import AsyncSession


setup_logging(
    json_logs=settings.logger.LOG_JSON_FORMAT,
    log_level=settings.logger.LOG_LEVEL,
)


async def provide_db_session(request: Request) -> AsyncSession:
    """Provide a DB session."""
    return alchemy.get_async_session(request)


# async def on_startup() -> None:
#     """Initializes the database."""
#     if sqlalchemy_config.create_all:
#         async with sqlalchemy_config.get_engine().begin() as conn:
#             await conn.run_sync(orm_registry.metadata.create_all)
# async def create_tables() -> None:
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)

cache = Cache.instance()
queue = Queue.instance()


async def create_redis_cache_pool(config: Settings) -> None:
    """Create Redis client and pool."""
    cache.pool = redis.ConnectionPool.from_url(config.redis.REDIS_URL)
    cache.client = redis.Redis.from_pool(cache.pool)  # type: ignore


async def close_redis_cache_pool() -> None:
    """Close Redis client and pool."""
    await cache.client.aclose()  # type: ignore


async def create_redis_queue_pool() -> None:
    """Create Arq Redis queue pool."""
    await queue.create_pool()


async def close_redis_queue_pool() -> None:
    """Clost the Arq Redis queue pool."""
    await queue.pool.aclose()  # type: ignore


@asynccontextmanager
async def lifespan(app_instance: FastAPI) -> AsyncGenerator:
    app_config = app_instance.state.config

    if isinstance(settings.redis, RedisCacheSettings):
        await create_redis_cache_pool(app_config)

    # if isinstance(settings.queue, RedisQueueSettings):
    #     await create_redis_queue_pool()

    yield

    if isinstance(settings.redis, RedisCacheSettings):
        await close_redis_cache_pool()

    # if isinstance(settings.queue, RedisQueueSettings):
    #     await close_redis_queue_pool()


session_config = AsyncSessionConfig(expire_on_commit=False)

sqlalchemy_config = SQLAlchemyAsyncConfig(
    connection_string=settings.db.DB_URL,
    session_config=session_config,
    create_all=True,
)  # Create 'db_session' dependency.

is_non_prod = settings.app.ENVIRONMENT != "production"

app = FastAPI(
    # lifespan=lifespan,
    title=settings.app.APP_TITLE,
    description=settings.app.APP_DESCRIPTION,
    version=settings.app.APP_VERSION,
    debug=settings.db.DB_ECHO_LOG,
    openapi_url="/openapi.json" if is_non_prod else None,
    docs_url="/docs" if is_non_prod else None,
    redoc_url="/redoc" if is_non_prod else None,
    # on_startup=[on_startup],
)

app.state.config = settings

# TODO: Add proper setting for initial locale
app.state.locale = {
    "id": "019755df-b0f0-7881-bb92-fa849016fd7a",
    "country_code": "US",
    "language_code": "en",
    "currency_code": "USD",
    "currency_symbol": "$",
    "currency_decimal_spaces": 2,
    "display_name": "United States",
    "locale": "en-US",
}

alchemy = AdvancedAlchemy(config=sqlalchemy_config, app=app)


def provide_service(service: str | None = None):
    return alchemy.provide_session(service)


# for router in domain_routers:
#     api.include_router(router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=[
        "Content-Type",
        "Set-Cookie",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin",
        "Authorization",
    ],
)

# # Add logging middleware
app.middleware("http")(log_request_middleware())


# Reference: https://docs.astral.sh/ruff/rules/asyncio-dangling-task/
# _background_tasks = set()

# app: FastAPI | None = None
# alchemy: AdvancedAlchemy | None = None
# logger: BoundLogger | None = None

# cache = Cache.instance()
# queue = Queue.instance()


# async def create_tables() -> None:
#     """Create database tables."""
#     async with engine.begin() as conn:
#         print("Creating database tables...", orm_registry.metadata.tables)
#         await conn.run_sync(orm_registry.metadata.create_all)


# async def create_redis_cache_pool() -> None:
#     """Create Redis client and pool."""
#     cache.pool = redis.ConnectionPool.from_url(settings.redis.REDIS_URL)
#     cache.client = redis.Redis.from_pool(cache.pool)  # type: ignore


# async def close_redis_cache_pool() -> None:
#     """Close Redis client and pool."""
#     await cache.client.aclose()  # type: ignore


# async def create_redis_queue_pool() -> None:
#     """Create Arq Redis queue pool."""
#     await queue.create_pool()


# async def close_redis_queue_pool() -> None:
#     """Clost the Arq Redis queue pool."""
#     await queue.pool.aclose()  # type: ignore


# def lifespan_factory(settings: Settings, create_tables_on_start: bool = True):
#     """Factory for lifespan context manager."""

#     @asynccontextmanager
#     async def lifespan(_app: FastAPI) -> AsyncGenerator:
#         if not isinstance(settings, Settings):
#             raise ValueError("Configuration settings must be an instance of Settings")

#         if settings.db and create_tables_on_start:
#             await create_tables()

#         if isinstance(settings.redis, RedisCacheSettings):
#             await create_redis_cache_pool()

#         if isinstance(settings.queue, RedisQueueSettings):
#             await create_redis_queue_pool()

#         yield

#         if isinstance(settings.redis, RedisCacheSettings):
#             await close_redis_cache_pool()

#         if isinstance(settings.queue, RedisQueueSettings):
#             await close_redis_queue_pool()

#     return lifespan


# def create_app(
#     settings: Settings,
#     router: APIRouter | None = None,
#     create_tables_on_start: bool = True,
# ):
#     global app

#     setup_logging(json_logs=settings.logger.LOG_JSON_FORMAT, log_level=settings.logger.LOG_LEVEL)

#     logger = get_logger(__name__)

#     isprod = settings.app.ENVIRONMENT == "production" and router is not None

#     lifespan = lifespan_factory(settings=settings, create_tables_on_start=create_tables_on_start)

#     sqlalchemy_config = SQLAlchemyAsyncConfig(
#         connection_string=settings.db.DB_URL,
#         session_config=AsyncSessionConfig(expire_on_commit=False),
#         create_all=True,
#         commit_mode="autocommit",
#     )

#     app = FastAPI(
#         lifespan=lifespan,
#         title=settings.app.APP_TITLE,
#         description=settings.app.APP_DESCRIPTION,
#         version=settings.app.APP_VERSION,
#         debug=settings.db.DB_ECHO_LOG,
#         openapi_url="/api/openapi.json" if not isprod else None,
#         docs_url="/api/docs" if not isprod else None,
#         redoc_url="/api/redoc" if not isprod else None,
#     )

#     alchemy = AdvancedAlchemy(config=sqlalchemy_config, app=app)

#     if router:
#         app.include_router(router)

#     # Configure CORS
#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=["*"],
#         allow_credentials=True,
#         allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
#         allow_headers=[
#             "Content-Type",
#             "Set-Cookie",
#             "Access-Control-Allow-Headers",
#             "Access-Control-Allow-Origin",
#             "Authorization",
#         ],
#     )

#     # Add logging middleware
#     app.middleware("http")(log_request_middleware())

#     logger.info("Color Agent API initialized!")

#     return app, alchemy


# class AsyncSessionHandler:
#     """SQLAlchemy async binder and handler."""

#     engine: AsyncEngine
#     scoped_session: async_scoped_session[AsyncSession]

#     create_tables_on_start = False  # Set to False to skip table creation on app start

#     def __init__(self):
#         # Create async engine
#         self.engine = create_async_engine(
#             settings.db.DB_URL, echo=settings.db.DB_ECHO_LOG, future=True
#         )
#         session_factory = async_sessionmaker(
#             bind=self.engine, expire_on_commit=False, class_=AsyncSession
#         )
#         self.scoped_session = async_scoped_session(
#             session_factory, scopefunc=asyncio.current_task
#         )

#     @property
#     def app(self) -> FastAPI:
#         """Instantiated the FastAPI application for use in the application."""
#         if app is None:
#             raise RuntimeError("Application not initialized. Call create_app() first.")
#         return app

#     @property
#     def logger(self) -> BoundLogger:
#         """Instantiated the logger for use in the application."""
#         global logger
#         if logger is None:
#             # Configure logging
#             setup_logging(json_logs=settings.logger.LOG_JSON_FORMAT, log_level=settings.logger.LOG_LEVEL)
#             logger = get_logger(__name__)
#         return logger

#     @property
#     def cache(self):
#         """Instantiated the redis cache decorator for use in the application."""
#         return cache

#     @property
#     def queue(self):
#         return Queue.instance()


#     def __del__(self):
#         if not getattr(self, "scoped_session", None):
#             return

#         try:
#             loop = asyncio.get_event_loop()
#             if loop.is_running():
#                 task = loop.create_task(self.scoped_session.remove())
#                 # Add task to the set. This creates a strong reference.
#                 _background_tasks.add(task)

#                 # To prevent keeping references to finished tasks forever,
#                 # make each task remove its own reference from the set after
#                 # completion:
#                 task.add_done_callback(_background_tasks.discard)
#             else:
#                 loop.run_until_complete(self.scoped_session.remove())
#         except RuntimeError:
#             asyncio.run(self.scoped_session.remove())

#     async def create_tables(self) -> None:
#         """Create database tables."""
#         async with self.engine.begin() as conn:
#             await conn.run_sync(Base.metadata.create_all)

#     async def create_redis_cache_pool(self) -> None:
#         """Create Redis client and pool."""
#         self.cache.pool = redis.ConnectionPool.from_url(settings.redis.Cache.REDIS_URL)
#         self.cache.client = redis.Redis.from_pool(cache.pool)  # type: ignore

#     async def close_redis_cache_pool(self) -> None:
#         """Close Redis client and pool."""
#         await self.cache.client.aclose()  # type: ignore

#     async def create_redis_queue_pool(self) -> None:
#         """Create Arq Redis queue pool."""
#         await self.queue.create_pool()

#     async def close_redis_queue_pool(self) -> None:
#         """Clost the Arq Redis queue pool."""
#         await self.queue.pool.aclose()  # type: ignore

#     @asynccontextmanager
#     async def get_session(self) -> AsyncGenerator[AsyncSession]:
#         """Get session."""
#         session = self.scoped_session()
#         try:
#             session.begin()
#             yield session
#             await session.commit()
#         except Exception:
#             await session.rollback()
#             raise
#         finally:
#             await session.close()


#     def lifespan_factory(
#           self,
#           settings: Settings,
#           create_tables_on_start: bool = True
#       ) -> Callable[[FastAPI], CoroutineType]:
#         """Factory for lifespan context manager."""

#         @asynccontextmanager
#         async def lifespan(app: FastAPI):
#             await func()
#             yield

#         return lifespan

#     async def create_app(
#         self,
#         router: APIRouter,
#         settings: Settings,
#     ) -> FastAPI:
#         global app

#         isprod = settings.app.ENVIRONMENT == "production"

#         lifespan = lifespan_factory(self.create_tables)

#         app = FastAPI(
#             lifespan=lifespan,
#             title=settings.app.APP_TITLE,
#             description=settings.app.APP_DESCRIPTION,
#             version=settings.app.APP_VERSION,
#             debug=settings.db.DB_ECHO_LOG,
#             openapi_url="/api/openapi.json" if not isprod else None,
#             docs_url="/api/docs" if not isprod else None,
#             redoc_url="/api/redoc" if not isprod else None,
#         )

#         app.include_router(router)

#         # Configure CORS
#         app.add_middleware(
#             CORSMiddleware,
#             allow_origins=["*"],
#             allow_credentials=True,
#             allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
#             allow_headers=[
#                 "Content-Type",
#                 "Set-Cookie",
#                 "Access-Control-Allow-Headers",
#                 "Access-Control-Allow-Origin",
#                 "Authorization",
#             ],
#         )

#         # Add logging middleware
#         app.middleware("http")(log_request_middleware())

#         self.logger.info("Color Agent API initialized!")

#         return app
