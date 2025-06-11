from typing import Annotated, AsyncGenerator

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends

from api.core.setup import app
from api.domain.dependencies import DatabaseSession

from .locales import languages, locales
from .models import Locale


class LocaleService(SQLAlchemyAsyncRepositoryService[Locale]):
    """Service for managing blog posts with automatic schema validation."""

    class LocaleRepository(SQLAlchemyAsyncSlugRepository[Locale], SQLAlchemyAsyncRepository[Locale]):
        """
        Repository for managing locale data.
        """

        model_type = Locale

        async def get_by_locale(self, locale: str) -> Locale | None:
            """
            Retrieve a locale by its country code.
            """
            lang, country = locale.split("-")
            return await self.get_one(
                filters=[Locale.country_code == country, Locale.language_code == lang],
            )

    repository_type = LocaleRepository

    _current_locale: Locale = app.state.locale

    @property
    def current_locale(self) -> Locale:
        """Get the current locale."""
        return self._current_locale

    @current_locale.setter
    def current_locale(self, locale: Locale):
        """Set the current locale."""
        if locale is not None and not isinstance(locale, Locale):
            raise TypeError("Current locale must be an instance of Locale.")

        self._current_locale = locale

    async def create_all(self):
        """Get or create a locale by its code."""

        models = []
        locale_set = set()

        for locale_config in locales:
            endonyms = locale_config.get("endonyms", {locale_config["language_code"]: locale_config["name"]})
            for language_code, endonym in endonyms.items():
                if language_code not in languages:
                    continue
                locale = f"{language_code}-{locale_config['country_code']}"
                if locale in locale_set:
                    continue
                locale_set.add(locale)
                data = {
                    "country_code": locale_config["country_code"],
                    "country_name": locale_config["name"],
                    "currency_code": locale_config["currency_code"],
                    "currency_decimal_spaces": locale_config["currency_decimal_spaces"],
                    "currency_symbol": locale_config["currency_symbol"],
                    "display_name": endonym,
                    "language_code": language_code,
                    "locale": locale,
                }

                models.append(data)

        locale_models = await super().create_many(models)
        return locale_models


async def provide_locales_service(db_session: DatabaseSession) -> AsyncGenerator[LocaleService, None]:
    """This provides the default Authors repository."""
    async with LocaleService.new(session=db_session) as service:
        yield service


Locales = Annotated[LocaleService, Depends(provide_locales_service)]


def get_current_locale(locales_service: Locales) -> Locale:
    """Get the current locale."""
    return locales_service.current_locale
