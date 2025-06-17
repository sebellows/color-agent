"""User service module."""

import hashlib

# from typing import Annotated, AsyncGenerator
from urllib.parse import urlencode
from uuid import UUID

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService

# from domain.dependencies import DatabaseSession
# from fastapi import Depends
from .models import User


# from sqlalchemy import select

# from core.security import get_password_hash, verify_password
# from .schemas import UserCreate, UserUpdate


def get_avatar(email: str) -> str:
    """Generate a Gravatar URL for a user based on their email."""

    # Set your variables here
    default = "https://www.example.com/default.jpg"
    size = 240

    # Encode the email to lowercase and then to bytes
    email_encoded = email.lower().encode("utf-8")

    # Generate the SHA256 hash of the email
    email_hash = hashlib.sha256(email_encoded).hexdigest()

    # Construct the URL with encoded query parameters
    query_params = urlencode({"d": default, "s": str(size)})
    gravatar_url = f"https://www.gravatar.com/avatar/{email_hash}?{query_params}"
    return gravatar_url


class UserService(SQLAlchemyAsyncRepositoryService[User]):
    """Service for managing blog posts with automatic schema validation."""

    class Repo(SQLAlchemyAsyncRepository[User]):
        """Repository for User model."""

        model_type = User

        @staticmethod
        def filter_users(
            users: list[User],
            user_name_substring: str | None = None,
            user_id: UUID | None = None,
        ) -> list[User]:
            """Filter users"""

            filtered_users_name = []
            filtered_users_id = []

            if user_name_substring is None:
                filtered_users_name = users
            else:
                for user in users:
                    if user.username and user_name_substring in user.username:
                        filtered_users_name.append(user)

            if user_id is None:
                filtered_users_id = filtered_users_name
            else:
                for user in filtered_users_name:
                    if user.id and user.id.__str__() in user_id.__str__():
                        filtered_users_id.append(user)

            return filtered_users_id

        def add_tenant(self, tenant: str) -> None:
            """Add tenant to user's attribute 'tenants'."""
            tenants_key = "tenants"
            if self.attributes is None or self.attributes.get(tenants_key) is None:
                self.attributes = {tenants_key: []}
            if tenant not in self.attributes[tenants_key]:
                self.attributes[tenants_key].append(tenant)

        def remove_tenant(self, tenant: str) -> None:
            """Remove tenant from user's attribute 'tenants'."""
            tenants_key = "tenants"
            if self.attributes:
                user_tenants = self.attributes.get(tenants_key, [])
                if tenant in user_tenants:
                    user_tenants.remove(tenant)

    repository_type = Repo

    # async def create_user(self, user: User) -> User:
    #     user.password = hash_password(user.password)
    #     return await self.create(user, auto_commit=True)

    # @staticmethod
    # async def get_by_id(db: DatabaseSession, user_id: int) -> User | None:
    #     """Get user by ID."""
    #     result = await db.execute(select(User).where(User.id == user_id))
    #     return result.scalars().first()

    # @staticmethod
    # async def get_by_email(db: DatabaseSession, email: str) -> User | None:
    #     """Get user by email."""
    #     result = await db.execute(select(User).where(User.email == email))
    #     return result.scalars().first()

    # @staticmethod
    # async def create_user(db: DatabaseSession, obj_in: UserCreate) -> User:
    #     """Create new user."""
    #     db_obj = User(
    #         email=obj_in.email,
    #         # username=obj_in.username,
    #         # avatar_url=obj_in.avatar_url,
    #         hashed_password=get_password_hash(obj_in.password),
    #         # full_name=obj_in.full_name,
    #         is_active=obj_in.is_active,
    #     )
    #     db.add(db_obj)
    #     await db.commit()
    #     await db.refresh(db_obj)
    #     return db_obj

    # @staticmethod
    # async def update_user(db: DatabaseSession, db_obj: User, obj_in: UserUpdate) -> User:
    #     """Update user."""
    #     update_data = obj_in.model_dump(exclude_unset=True)
    #     if update_data.get("password"):
    #         hashed_password = get_password_hash(update_data["password"])
    #         del update_data["password"]
    #         update_data["hashed_password"] = hashed_password

    #     for field, value in update_data.items():
    #         setattr(db_obj, field, value)

    #     db.add(db_obj)
    #     await db.commit()
    #     await db.refresh(db_obj)
    #     return db_obj

    # @staticmethod
    # async def authenticate(db: DatabaseSession, email: str, password: str) -> User | None:
    #     """Authenticate user."""
    #     user = await UserService.get_by_email(db, email=email)
    #     if not user:
    #         return None
    #     if not verify_password(password, user.hashed_password):
    #         return None
    #     return user

    # @staticmethod
    # async def is_active(user: User) -> bool:
    #     """Check if user is active."""
    #     return user.is_active if isinstance(user.is_active, bool) else False

    # @staticmethod
    # async def is_superuser(user: User) -> bool:
    #     """Check if user is superuser."""
    #     return user.is_superuser


# async def provide_users_service(db_session: DatabaseSession) -> AsyncGenerator[UserService, None]:
#     """This provides the default User repository."""
#     async with UserService.new(session=db_session) as service:
#         yield service


# Users = Annotated[UserService, Depends(provide_users_service)]
