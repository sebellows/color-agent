from contextlib import asynccontextmanager
from typing import (
    Any,
    AsyncIterator,
    Generic,
    Iterable,
    List,
    Literal,
    Mapping,
    Tuple,
    Type,
    Union,
)

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.src.services.paginator import Paginator

from ..core.setup import AsyncSessionHandler
from ..models.base import ModelT, PrimaryKeyT
from ..schemas.base import PageResponse

from ..exceptions import ModelNotFoundError
from .base_repository import (
    BaseRepository,
)


class SQLAlchemyAsyncRepository(
    Generic[ModelT],
    BaseRepository[ModelT],
):
    _session_handler: AsyncSessionHandler
    _external_session: Union[AsyncSession, None]

    def __init__(
        self,
        session: Union[AsyncSession, None] = None,
        model_class: Union[Type[ModelT], None] = None,
    ) -> None:
        super().__init__(model_class=model_class)
        self._external_session = session
        self._session_handler = AsyncSessionHandler()

    async def get(self, identifier: PrimaryKeyT) -> ModelT:
        """
        Get a model by primary key.

        PARAMS:
        -------
        identifier: The primary key
        :return: A model instance
        :raises ModelNotFoundError: No model has been found using the primary key
        """
        async with self._get_session() as session:
            model = await session.get(self._model, identifier)
        if model is None:
            raise ModelNotFoundError("No rows found for provided primary key.")
        return model

    async def get_many(self, identifiers: Iterable[PrimaryKeyT]) -> List[ModelT]:
        """
        Get a list of models by primary keys.

        PARAMS:
        -------
            identifiers: A list of primary keys

        RETURNS:
        --------
            A list of models
        """
        stmt = select(self._model).where(
            getattr(self._model, self._model_pk()).in_(identifiers)
        )

        async with self._get_session() as session:
            return [x for x in (await session.execute(stmt)).scalars()]

    async def save(self, instance: ModelT) -> ModelT:
        """
        Persist a model.

        PARAMS:
        -------
            instance: A mapped object instance to be persisted

        RETURNS:
        --------
            The model instance after being persisted
        """
        self._fail_if_invalid_models([instance])
        async with self._get_session() as session:
            session.add(instance)
        return instance

    async def save_many(
        self,
        instances: Iterable[ModelT],
    ) -> Iterable[ModelT]:
        """
        Persist many models in a single database get_session.

        PARAMS:
        -------
            instances: A list of mapped objects to be persisted

        RETURNS:
        --------
            The model instances after being persisted
        """
        self._fail_if_invalid_models(instances)
        async with self._get_session() as session:
            session.add_all(instances)
        return instances

    async def delete(self, instance: ModelT) -> None:
        """Deletes a model.

        PARAMS:
        -------
        instance: The model instance
        """
        self._fail_if_invalid_models([instance])
        async with self._get_session() as session:
            await session.delete(instance)

    async def delete_many(self, instances: Iterable[ModelT]) -> None:
        """Deletes a collection of models in a single transaction.

        PARAMS:
        -------
        instances: The model instances
        """
        self._fail_if_invalid_models(instances)
        async with self._get_session() as session:
            for instance in instances:
                await session.delete(instance)

    async def find(
        self,
        search_params: Union[None, Mapping[str, Any]] = None,
        order_by: Union[
            None,
            Iterable[Union[str, Tuple[str, Literal["asc", "desc"]]]],
        ] = None,
    ) -> List[ModelT]:
        """
        Find models using filters.

        EXAMPLES:
        ---------
            # find all models with name = John
            find(search_params={"name":"John"})

            # find all models ordered by `name` column
            find(order_by=["name"])

            # find all models with reversed order by `name` column
            find(order_by=[("name", "desc")])

        PARAMS:
        -------
            param search_params: A mapping containing equality filters
            order_by: A list of columns to order by. Each column can be a string or a tuple.

        RETURNS:
        --------
            A collection of models
        """
        stmt = self._find_query(search_params, order_by)

        async with self._get_session() as session:
            result = await session.execute(stmt)
            return [x for x in result.scalars()]

    async def paginated_find(
        self,
        items_per_page: int,
        page: int = 1,
        search_params: Union[None, Mapping[str, Any]] = None,
        order_by: Union[
            None,
            Iterable[Union[str, Tuple[str, Literal["asc", "desc"]]]],
        ] = None,
    ) -> PageResponse[ModelT]:
        """
        Find models using filters and limit/offset pagination. Returned results
        do include pagination metadata.

        EXAMPLES:
        ---------
            # find all models with name = John
            paginated_find(search_params={"name":"John"})

            # find first 50 models with name = John
            paginated_find(50, search_params={"name":"John"})

            # find 50 models with name = John, skipping 2 pages (100)
            paginated_find(50, 3, search_params={"name":"John"})

            # find all models ordered by `name` column
            paginated_find(order_by=["name"])

            # find all models with reversed order by `name` column
            paginated_find(order_by=[("name", "desc")])

        PARAMS:
        -------
            order_by: A list of columns to order by. Each column can be a string or a tuple.
            items_per_page: Number of models to retrieve
            page: Page to retrieve
            search_params: A mapping containing equality filters

        RETURNS:
        --------
            A collection of models
        """
        find_stmt = self._find_query(search_params, order_by)
        paginated_stmt = self._paginate_query_by_page(find_stmt, page, items_per_page)

        async with self._get_session() as session:
            total = (await session.execute(self._count_query(find_stmt))).scalar() or 0
            result_items = [
                item for item in (await session.execute(paginated_stmt)).scalars()
            ]

            return Paginator.paginate(
                result_items=result_items,
                total=total,
                page=page,
                items_per_page=self._sanitised_query_limit(items_per_page),
            )

    @asynccontextmanager
    async def _get_session(self) -> AsyncIterator[AsyncSession]:
        if not self._external_session:
            async with self._session_handler.get_session() as _session:
                yield _session
        else:
            yield self._external_session
