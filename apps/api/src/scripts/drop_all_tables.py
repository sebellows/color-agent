import sys
from pathlib import Path


sys.path.append(str(Path(__file__).parent.parent))

import asyncio

from api.core.database import DB
from api.core.logger import get_logger


logger = get_logger(__name__)


async def drop_all_tables() -> None:
    db = DB.instance()

    async with db.session_factory() as session:
        try:
            session.begin()
            await db.drop_all()
            await session.commit()
        except Exception as e:
            logger.error(f"Error during table dropping: {e}")
            await session.rollback()
            await db.engine.dispose()
            raise
        finally:
            await session.close()
            await db.engine.dispose()
            logger.info("All tables dropped successfully!")


if __name__ == "__main__":
    asyncio.run(drop_all_tables())

# async def drop_all_tables(engine: AsyncEngine) -> None:
#     async with engine.begin() as conn:
#         table_names = await conn.run_sync(lambda sync_conn: sa.inspect(sync_conn).get_table_names())
#         meta = MetaData()
#         tables = []
#         all_fkeys = []
#         for table_name in table_names:
#             fkeys = []
#             foreign_keys = await conn.run_sync(
#                 lambda sync_conn: sa.inspect(sync_conn).get_foreign_keys(
#                     table_name  # noqa: B023
#                 )  # noqa: E501
#             )
#             for fkey in foreign_keys:
#                 if not fkey["name"]:
#                     continue
#                 fkeys.append(ForeignKeyConstraint((), (), name=fkey["name"]))
#             tables.append(Table(table_name, meta, *fkeys))
#             all_fkeys.extend(fkeys)

#         for fkey in all_fkeys:
#             await conn.execute(DropConstraint(fkey))

#         for table in tables:
#             await conn.execute(DropTable(table))
#         await conn.commit()
