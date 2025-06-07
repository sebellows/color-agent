from datetime import datetime
from typing import Annotated, Any
from uuid import UUID

from pydantic import Field, field_serializer
from uuid_utils import uuid7


class UUIDSchema:
    id = Annotated[UUID, Field(default_factory=uuid7)]


class CreatedTimestampSchema:
    created_at: Annotated[datetime, Field(description="Creation timestamp")]

    @field_serializer("created_at")
    def serialize_dt(self, created_at: datetime | None, _info: Any) -> str | None:
        if created_at is not None:
            return created_at.isoformat(" ")

        return None


class UpdatedTimestampSchema:
    updated_at: Annotated[datetime, Field(description="Last update timestamp")]

    @field_serializer("updated_at")
    def serialize_updated_at(self, updated_at: datetime | None, _info: Any) -> str | None:
        if updated_at is not None:
            return updated_at.isoformat(" ")

        return None


class TimestampSchema(CreatedTimestampSchema, UpdatedTimestampSchema):
    pass


class SoftDeletionSchema:
    deleted_at: Annotated[datetime | None, Field(default=None, description="Last update timestamp")]
    is_deleted: bool = False

    @field_serializer("deleted_at")
    def serialize_dates(self, deleted_at: datetime | None, _info: Any) -> str | None:
        if deleted_at is not None:
            return deleted_at.isoformat(" ")

        return None
