from typing import TypedDict


languages = {
    "ca": "Castillano",
    "da": "Dansk",
    "de": "Deutsch",
    "en": "English",
    "es": "Español",
    "fi": "Suomi",
    "fr": "Français",
    "it": "Italiano",
    "jp": "日本語",
    "nl": "Nederlands",
    "nn": "Norsk",
    "pl": "Polski",
    "sv": "Svenska",
}

countries = {
    "AT": "Austria",
    "AU": "Australia",
    "BE": "Belgium",
    "CA": "Canada",
    "CH": "Switzerland",
    "DE": "Germany",
    "DK": "Denmark",
    "ES": "Spain",
    "FI": "Finland",
    "FR": "France",
    "GB": "United Kingdom",
    "IE": "Ireland",
    "JP": "Japan",
    "NL": "Netherlands",
    "NO": "Norway",
    "NZ": "New Zealand",
    "PL": "Poland",
    "SE": "Sweden",
    "US": "United States",
}


class LocaleConfig(TypedDict):
    name: str  # Exonym
    endonyms: dict[str, str]  # Language code to endonym mapping
    language_code: str  # Primary language code
    supported_languages: list[str]  # List of supported language codes
    country_code: str  # ISO country code
    currency_code: str  # ISO currency code
    currency_decimal_spaces: int  # Decimal places for the currency
    currency_symbol: str  # Currency symbol


locales: list[LocaleConfig] = [
    {
        "name": "Austria",  # i.e., "exonym"
        "endonyms": {
            "de": "Österreich",
        },
        "language_code": "de",
        "supported_languages": ["de"],
        "country_code": "AT",
        "currency_code": "EUR",
        "currency_decimal_spaces": 2,
        "currency_symbol": "€",
    },
    {
        "name": "Australia",  # i.e., "exonym"
        "endonyms": {
            "en": "Australia",
        },
        "language_code": "en",
        "supported_languages": ["en"],
        "country_code": "AU",
        "currency_code": "AUD",
        "currency_decimal_spaces": 2,
        "currency_symbol": "$",
    },
    {
        "name": "Belgium",  # i.e., "exonym"
        "endonyms": {"fr": "Belgique", "nl": "België"},
        "language_code": "fr",
        "supported_languages": ["fr", "nl"],
        "country_code": "BE",
        "currency_code": "EUR",
        "currency_decimal_spaces": 2,
        "currency_symbol": "€",
    },
    {
        "name": "Canada",  # i.e., "exonym"
        "endonyms": {
            "en": "Canada",
            "fr": "Canada",
        },
        "language_code": "en",
        "supported_languages": ["en", "fr"],
        "country_code": "CA",
        "currency_code": "CAD",
        "currency_decimal_spaces": 2,
        "currency_symbol": "$",
    },
    {
        "name": "Switzerland",  # i.e., "exonym"
        "endonyms": {
            "de": "Schweiz",
            "fr": "Suisse",
            "it": "Svizzera",
        },
        "language_code": "de",
        "supported_languages": ["de", "fr", "it"],
        "country_code": "CH",
        "currency_code": "CHF",
        "currency_decimal_spaces": 2,
        "currency_symbol": "F",
    },
    {
        "name": "Germany",  # i.e., "exonym"
        "endonyms": {
            "de": "Deutschland",
        },
        "language_code": "de",
        "supported_languages": ["de"],
        "country_code": "DE",
        "currency_code": "EUR",
        "currency_decimal_spaces": 2,
        "currency_symbol": "€",
    },
    {
        "name": "Denmark",  # i.e., "exonym"
        "endonyms": {
            "da": "Danmark",
        },
        "language_code": "da",
        "supported_languages": ["da"],
        "country_code": "DK",
        "currency_code": "DKK",
        "currency_decimal_spaces": 2,
        "currency_symbol": "kr",
    },
    {
        "name": "Spain",  # i.e., "exonym"
        "endonyms": {
            "ca": "Espanya",
            "es": "España",
            "eu": "Espainia",
            "gi": "España",
        },
        "language_code": "es",
        "supported_languages": [
            "ca",
            "es",
            "eu",
            "gi",
        ],  # ca = Catalan, eu = Basque, gi = Galician
        "country_code": "ES",
        "currency_code": "EUR",
        "currency_decimal_spaces": 2,
        "currency_symbol": "€",
    },
    {
        "name": "Finland",  # i.e., "exonym"
        "endonyms": {
            "fi": "Suomi",
            # Northern Sámi, Inari Sámi, Skolt Sámi
            "se": "Suopma|Suomâ|Sääʹmjânnam",
            "sv": "Finland",
        },
        "language_code": "fi",
        "supported_languages": ["fi", "se", "sv"],  # se = Sami language variations
        "country_code": "FI",
        "currency_code": "EUR",
        "currency_decimal_spaces": 2,
        "currency_symbol": "€",
    },
    {
        "name": "France",  # i.e., "exonym"
        "endonyms": {
            "fr": "France",
        },
        "language_code": "fr",
        "supported_languages": ["fr"],
        "country_code": "CH",
        "currency_code": "EUR",
        "currency_decimal_spaces": 2,
        "currency_symbol": "€",
    },
    {
        "name": "United Kingdom",  # i.e., "exonym"
        "endonyms": {
            "en": "United Kingdom",
            "cy": "Teyrnas Unedig",
        },
        "language_code": "en",
        "supported_languages": ["cy", "en"],  # cy = Welsh
        "country_code": "GB",
        "currency_code": "GBP",
        "currency_decimal_spaces": 2,
        "currency_symbol": "£",
    },
    {
        "name": "Ireland",  # i.e., "exonym"
        "endonyms": {
            "en": "Ireland",
        },
        "language_code": "en",
        "supported_languages": ["en"],
        "country_code": "IE",
        "currency_code": "EUR",
        "currency_decimal_spaces": 2,
        "currency_symbol": "€",
    },
    {
        "name": "Japan",  # i.e., "exonym"
        "endonyms": {
            "ja": "日本",
        },
        "language_code": "ja",
        "supported_languages": ["ja"],
        "country_code": "JP",
        "currency_code": "JPY",
        "currency_decimal_spaces": 0,
        "currency_symbol": "¥",
    },
    {
        "name": "Netherlands",  # i.e., "exonym"
        "endonyms": {
            "nl": "Nederland",
        },
        "language_code": "nl",
        "supported_languages": ["nl"],
        "country_code": "NL",
        "currency_code": "EUR",
        "currency_decimal_spaces": 2,
        "currency_symbol": "€",
    },
    {
        "name": "Norway",  # i.e., "exonym"
        "endonyms": {
            "nb": "Norge",
            "nn": "Noreg",
            # Northern Sámi, Inari Sámi, Skolt Sámi
            "se": "Norga|Norga|Nuōrjj",
        },
        "language_code": "nn",
        "supported_languages": [
            "nb",
            "nn",
            "se",
        ],  # nb = Bokmål language, se = Sámi language variations
        "country_code": "NO",
        "currency_code": "NOK",
        "currency_decimal_spaces": 2,
        "currency_symbol": "kr",
    },
    {
        "name": "New Zealand",  # i.e., "exonym"
        "endonyms": {
            "en": "New Zealand",
            "mi": "Aotearoa",
        },
        "language_code": "en",
        "supported_languages": ["en", "mi"],  # mi = Maori language
        "country_code": "NZ",
        "currency_code": "NZD",
        "currency_decimal_spaces": 2,
        "currency_symbol": "$",
    },
    {
        "name": "Poland",  # i.e., "exonym"
        "endonyms": {
            "pl": "Polska",
        },
        "language_code": "pl",
        "supported_languages": ["pl"],
        "country_code": "PL",
        "currency_code": "PLN",  # Złoty
        "currency_decimal_spaces": 2,
        "currency_symbol": "zł",
    },
    {
        "name": "Sweden",  # i.e., "exonym" # NOTE: language code is 'sv'
        "endonyms": {
            # Northern Sámi, Inari Sámi, Skolt Sámi
            "se": "Ruoŧŧa|Ruoččȃ|Ruočč",
            "sv": "Sverige",
        },
        "language_code": "sv",
        "supported_languages": ["se", "sv"],  # se = Sami language variations
        "country_code": "SE",
        "currency_code": "SEK",  # The "krona"
        "currency_decimal_spaces": 2,
        "currency_symbol": "kr",
    },
    {
        "name": "United States of America",  # i.e., "exonym"
        "endonyms": {"en": "United States of America"},
        "language_code": "en",
        "supported_languages": ["en"],
        "country_code": "US",
        "currency_code": "USD",
        "currency_decimal_spaces": 2,
        "currency_symbol": "$",
    },
]
