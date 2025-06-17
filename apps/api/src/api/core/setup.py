"""Database module."""

from collections.abc import Callable
from contextlib import _AsyncGeneratorContextManager, asynccontextmanager
from typing import Any

import redis.asyncio as redis
from advanced_alchemy.extensions.fastapi import AdvancedAlchemy, AsyncSessionConfig
from advanced_alchemy.extensions.starlette import SQLAlchemyAsyncConfig
from core.config import RedisCacheSettings, Settings, settings

# from core.logger import log_request_middleware
from fastapi import FastAPI

# from fastapi.middleware.cors import CORSMiddleware
from services import Cache, Queue


async def on_startup() -> Callable[[FastAPI], _AsyncGeneratorContextManager[Any, None]]:
    cache = Cache.instance()
    queue = Queue.instance()

    # async def create_tables() -> None:
    #     async with engine.begin() as conn:
    #         await conn.run_sync(Base.metadata.create_all)

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
    async def lifespan(app_instance: FastAPI):
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

    return lifespan


session_config = AsyncSessionConfig(expire_on_commit=False)

sqlalchemy_config = SQLAlchemyAsyncConfig(
    connection_string=settings.db.DB_URL,
    session_config=session_config,
    commit_mode="autocommit",
    # create_all=True,
)  # Create 'db_session' dependency.

is_non_prod = settings.app.ENVIRONMENT != "production"

app = FastAPI(
    # lifespan=lifespan,
    title=settings.app.APP_TITLE,
    description=settings.app.APP_DESCRIPTION,
    version=settings.app.APP_VERSION,
    debug=settings.db.DB_ECHO_LOG,
    openapi_url="/api/openapi.json" if is_non_prod else None,
    docs_url="/api/docs" if is_non_prod else None,
    redoc_url="/api/redoc" if is_non_prod else None,
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

# Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
#     allow_headers=[
#         "Content-Type",
#         "Set-Cookie",
#         "Access-Control-Allow-Headers",
#         "Access-Control-Allow-Origin",
#         "Authorization",
#     ],
# )

# # # Add logging middleware
# app.middleware("http")(log_request_middleware())

alchemy = AdvancedAlchemy(config=sqlalchemy_config, app=app)

# import importlib
# import pathlib
#
# def _init_mappers_(self) -> None:
#     """Preloads all `modules` found by a given `glob.pattern`.

#     This is useful when working with many models and relationships in `sqlalchemy`.
#     Relationships are prone to circular imports therefore PEP 563 styled imports for
#     relational model should be used. But these imports do not actually set up the classes
#     at import time which may break `sqlalchemy`s mappers once the first module is accessed#
#     for real. This than results in `InvalidRequestError`s where the mappers can not find the
#     annotated classes.

#     A solution for this problem is to pre load all modules before they are accessed directly
#     and this is what dis hook tries to automate.

#     `sqlalchemy` does not yet provide something like this.
#     """
#     cwd = pathlib.Path.cwd()
#     app = pathlib.Path(__file__).parent.parent
#     module_paths = cwd.glob("**/domain/**/models.py")
#     module_names = map(lambda x: ".".join(x.relative_to(app).parts).replace(".py", ""), module_paths)
#     _, *_ = map(lambda x: importlib.import_module(x), module_names)
#
# def __post_init__(self, dependency_key: str) -> None:
#     config = SQLAlchemyAsyncConfig(
#         session_dependency_key=dependency_key,
#         engine_instance=_engine,
#         session_maker=_async_session_factory,
#         before_send_handler=autocommit_before_send_handler,
#     )
#     plugin = SQLAlchemyInitPlugin(config=config)
#     object.__setattr__(self, "config", config)
#     object.__setattr__(self, "plugin", plugin)
#     self._init_mappers_()

# @property
# def on_app_init(self) -> Callable[[AppConfig], AppConfig]:
#     """Forwards `litestar's` plugins `on_app_init`."""
#     return self.plugin.on_app_init

# async def on_startup(self) -> None:
#     """Initializes the database."""
#     async with self.config.get_engine().begin() as conn:
#         # await conn.run_sync(UUIDBase.metadata.drop_all)
#         await conn.run_sync(UUIDBase.metadata.create_all)
