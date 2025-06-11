"""Script to set up the database and import data."""

import asyncio
import logging
from pathlib import Path

from .create_tables import create_tables
from scripts.import_data_modified import import_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def setup_and_import():
    """Set up database and import data."""
    # Create tables
    await create_tables()

    # Import data
    json_path = Path(__file__).parent.parent.parent.parent.parent / "examples" / "data-sample-01.json"
    await import_data(json_path)


if __name__ == "__main__":
    asyncio.run(setup_and_import())
