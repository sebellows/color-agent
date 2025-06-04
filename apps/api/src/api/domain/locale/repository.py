from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import Locale


class LocaleRepository(
    SQLAlchemyAsyncSlugRepository[Locale], SQLAlchemyAsyncRepository[Locale]
):
    """
    Repository for managing locale data.
    """

    model_type = Locale

    async def get_locale_by_country_code(self, code: str) -> Locale | None:
        """
        Retrieve a locale by its country code.
        """
        return await self.get_one(
            filters=[Locale.country_code == code],
        )
