"""User schema module."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from .mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr
    full_name: str | None = None
    is_active: bool = True


class UserCreate(UserBase):
    """User creation schema."""

    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update schema."""

    email: EmailStr | None = None
    full_name: str | None = None
    password: str | None = Field(None, min_length=8)
    is_active: bool | None = None


class UserDelete(BaseModel, SoftDeletionSchema):
    """User delete schema"""

    pass


class UserInDBBase(UserBase, TimestampSchema):
    """Base user schema for DB representation."""

    id: UUID

    class Config:
        """Pydantic config."""

        from_attributes = True


class User(UserInDBBase):
    """User schema for API responses."""

    pass


class UserInDB(UserInDBBase):
    """User schema with password hash."""

    hashed_password: str
