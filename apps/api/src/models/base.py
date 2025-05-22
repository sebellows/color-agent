from datetime import datetime, time
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass


class Base(AsyncAttrs, MappedAsDataclass, DeclarativeBase):
    """Base class for all SQLAlchemy models"""

    def to_dict(self):
        json_exclude = getattr(self, "__json_exclude__", set())
        class_dict = {
            key: value
            for key, value in self.__dict__.items()
            if not key.startswith("_") and key not in json_exclude
        }

        for key, value in class_dict.items():
            if isinstance(value, time) or isinstance(value, datetime):
                class_dict[key] = str(
                    value.isoformat(" ")
                )  # format time and make it a str

        return class_dict

    def to_repr(self, column_names: list[str] = []):
        model_name = self.__class__.__name__
        column_names.extend(
            ["id", "created_at", "updated_at", "deleted_at", "is_deleted"]
        )
        fields = [
            f"{col.name}={getattr(self, col.name)}"
            for col in self.__table__.columns
            if col.name in column_names
        ]
        return f"{model_name}({', '.join(fields)})"

    # created_at: Mapped[datetime] = mapped_column(
    #     default=func.now(),
    #     server_default=func.now(),
    # )
    # updated_at: Mapped[datetime] = mapped_column(
    #     default=func.now(),
    #     server_default=func.now(),
    #     onupdate=func.now(),
    # )
