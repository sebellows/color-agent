from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, StringConstraints
from schemas.auth import UserProfile
from schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)
from typing_extensions import Annotated


class FilterRole(BaseModel):
    field: str = "role"
    operator: str = "eq"
    value: str = "role-annotator"


class FilterUserUserID(BaseModel):
    value: list[str] = Field(default_factory=list)
    field: str = "id"
    operator: str = "in"


class FilterUserUserName(BaseModel):
    field: str = "name"
    operator: str = "like"
    value: Annotated[str, StringConstraints(min_length=1)]  # type: ignore


class UserBase(UserProfile):
    """Base user schema."""

    # email: EmailStr
    # full_name: str | None = None
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


class UserRead(UserBase, TimestampSchema, SoftDeletionSchema):
    """Read-only user schema for API responses."""

    id: Annotated[UUID, Field(description="Unique identifier")]


class UserResponse(UserBase, TimestampSchema, SoftDeletionSchema):
    """Base user schema for DB representation."""

    id: Annotated[UUID, Field(description="Unique identifier")]


class UserInDBBase(UserBase, TimestampSchema, SoftDeletionSchema):
    """Base user schema for DB representation."""

    pass


class UserInDB(UserInDBBase):
    """User schema with password hash."""

    id: Annotated[UUID, Field(description="Unique identifier")]
    hashed_password: str
