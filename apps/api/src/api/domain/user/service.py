"""User service module."""

from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db
from api.core.security import get_password_hash, verify_password

from .models import User
from .repository import UserRepository
from .schemas import UserCreate, UserUpdate


class UserService(SQLAlchemyAsyncRepositoryService[User, UserRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = UserRepository

    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: int) -> User | None:
        """Get user by ID."""
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> User | None:
        """Get user by email."""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    @staticmethod
    async def create_user(db: AsyncSession, obj_in: UserCreate) -> User:
        """Create new user."""
        db_obj = User(
            email=obj_in.email,
            # username=obj_in.username,
            # avatar_url=obj_in.avatar_url,
            hashed_password=get_password_hash(obj_in.password),
            # full_name=obj_in.full_name,
            is_active=obj_in.is_active,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    @staticmethod
    async def update_user(db: AsyncSession, db_obj: User, obj_in: UserUpdate) -> User:
        """Update user."""
        update_data = obj_in.model_dump(exclude_unset=True)
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password

        for field, value in update_data.items():
            setattr(db_obj, field, value)

        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    @staticmethod
    async def authenticate(db: AsyncSession, email: str, password: str) -> User | None:
        """Authenticate user."""
        user = await UserService.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def is_active(user: User) -> bool:
        """Check if user is active."""
        return user.is_active if isinstance(user.is_active, bool) else False

    @staticmethod
    async def is_superuser(user: User) -> bool:
        """Check if user is superuser."""
        return user.is_superuser


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_users_service(db_session: DatabaseSession) -> AsyncGenerator[UserService, None]:
    """This provides the default Authors repository."""
    async with UserService.new(session=db_session) as service:
        yield service


Users = Annotated[UserService, Depends(provide_users_service)]
