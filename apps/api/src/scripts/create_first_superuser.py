import asyncio
import logging
import uuid
from datetime import UTC, datetime

from core.config import settings
from core.database import AsyncSession, async_engine, async_session_factory
from core.security import get_password_hash
from domain.user import User
from sqlalchemy import Boolean, Column, DateTime, Integer, MetaData, String, Table, insert, select
from sqlalchemy.dialects.postgresql import UUID


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_first_user(session: AsyncSession) -> None:
    try:
        name = settings.admin.ADMIN_NAME
        email = settings.admin.ADMIN_EMAIL
        username = settings.admin.ADMIN_USERNAME
        hashed_password = get_password_hash(settings.admin.ADMIN_PASSWORD)

        query = select(User).filter_by(email=email)
        result = await session.execute(query)
        user = result.scalar_one_or_none()

        if user is None:
            metadata = MetaData()
            user_table = Table(
                "user",
                metadata,
                Column("id", Integer, primary_key=True, autoincrement=True, nullable=False),
                Column("name", String(30), nullable=False),
                Column("username", String(20), nullable=False, unique=True, index=True),
                Column("email", String(50), nullable=False, unique=True, index=True),
                Column("hashed_password", String, nullable=False),
                Column("profile_image_url", String, default="https://profileimageurl.com"),
                Column("uuid", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True),
                Column("created_at", DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False),
                Column("updated_at", DateTime),
                Column("deleted_at", DateTime),
                Column("is_deleted", Boolean, default=False, index=True),
                Column("is_superuser", Boolean, default=False),
                # Column("tier_id", Integer, ForeignKey("tier.id"), index=True),
            )

            data = {
                "name": name,
                "email": email,
                "username": username,
                "hashed_password": hashed_password,
                "is_superuser": True,
            }

            stmt = insert(user_table).values(data)
            async with async_engine.connect() as conn:
                await conn.execute(stmt)
                await conn.commit()

            logger.info(f"Admin user {username} created successfully.")

        else:
            logger.info(f"Admin user {username} already exists.")

    except Exception as e:
        logger.error(f"Error creating admin user: {e}")


async def main():
    async with async_session_factory() as session:
        await create_first_user(session)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
