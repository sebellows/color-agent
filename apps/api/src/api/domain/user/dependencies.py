from typing import Annotated

import requests
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_500_INTERNAL_SERVER_ERROR

from api.core.config import settings
from api.core.database import get_db
from api.core.logger import logging
from api.exceptions import ForbiddenException

from .models import User
from .repository import UserRepository


logger = logging.getLogger(__name__)


def provide_user_repository(
    db: AsyncSession = Depends(get_db),
) -> UserRepository:
    """Dependency to provide UserRepository instance."""
    return UserRepository(
        session=db,
        statement=select(User).where(User.is_deleted.is_(False)),
    )


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=settings.auth.KeyCloak.BASE_URL)

keycloak_settings = settings.auth.KeyCloak

keycloak_token_url = f"{keycloak_settings.API_URL}/token"


def get_client_token():
    url = f"{keycloak_settings.API_URL}/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": keycloak_settings.CLIENT_ID,
        "client_secret": keycloak_settings.CLIENT_SECRET,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(url, data=data, headers=headers)
    response.raise_for_status()
    return response.json()["access_token"]


def introspect_user_token(user_token):
    client_token = get_client_token()  # Use client credentials to get the token

    introspection_url = f"{keycloak_settings.API_URL}/token/introspect"
    data = {
        "token": user_token,
        "client_id": keycloak_settings.CLIENT_ID,
        "client_secret": keycloak_settings.CLIENT_SECRET,
    }
    headers = {
        "Authorization": f"Bearer {client_token}",  # Use the client token here
        "Content-Type": "application/x-www-form-urlencoded",
    }
    response = requests.post(introspection_url, data=data, headers=headers)
    response.raise_for_status()
    return response.json()


def get_user_info_from_token(token):
    """
    This function is used to get the details of a user from a token

    Parameters
    ----------
    token: str
        token of the user

    Returns
    -------
    user_info: dict
        details of the user
    """
    try:
        user_keycloak = introspect_user_token(token)
        # If the response is successful
        # Extract the relevant information from the response
        return {
            "id": user_keycloak.get("sub"),
            "username": user_keycloak.get("preferred_username"),
            "email": user_keycloak.get("profile email"),
            "first_name": user_keycloak.get("given_name"),
            "last_name": user_keycloak.get("family_name"),
        }
    except Exception as _e:
        return {"error": "Could not validate credentials"}


def get_current_user(token: str | None = Depends(oauth2_scheme)):
    """
    The `get_current_user` function retrieves the current user's details using a
        provided token.
    If the token is valid, the function returns the user details as a dictionary.
    If the credentials cannot be validated, a 401 Unauthorized exception is raised.
    In case of other errors, a 500 Internal Server Error exception is raised.
    """
    # Define an exception to be raised if the credentials cannot be validated
    credentials_exception = HTTPException(
        status_code=HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    print("token:", token)
    try:
        # Get the user information using the provided token
        user = get_user_info_from_token(token)
    except Exception as _e:
        # Raise the credentials exception if an error occurs while getting the
        # user information
        raise credentials_exception

    # Check if the user information contains an error
    if "error" in user:
        if user["error"] == "Could not validate credentials":
            # Raise the credentials exception if the error is due to invalid
            # credentials
            raise credentials_exception
        else:
            # Raise a 500 Internal Server Error exception for other errors
            raise HTTPException(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server Error - Please try to authenticate again",
                headers={"WWW-Authenticate": "Bearer"},
            )
    else:
        # Return the user details if there are no errors
        return user


# async def _get_current_user(
#     token: Annotated[str, Depends(oauth2_scheme)],
#     db: Annotated[AsyncSession, Depends(get_db)],
# ) -> dict[str, Any] | None:
#     token_data = await verify_token(token, db)
#     if token_data is None:
#         raise UnauthorizedException("User not authenticated.")

#     if "@" in token_data.username_or_email:
#         user: dict | None = await crud_users.get(
#             db=db, email=token_data.username_or_email, is_deleted=False
#         )
#     else:
#         user = await crud_users.get(
#             db=db, username=token_data.username_or_email, is_deleted=False
#         )

#     if user:
#         return user

#     raise UnauthorizedException("User not authenticated.")


# async def get_optional_user(
#     request: Request, db: AsyncSession = Depends(get_db)
# ) -> dict | None:
#     token = request.headers.get("Authorization")
#     if not token:
#         return None

#     try:
#         token_type, _, token_value = token.partition(" ")
#         if token_type.lower() != "bearer" or not token_value:
#             return None

#         token_data = await verify_token(token_value, db)
#         if token_data is None:
#             return None

#         return await get_current_user(token_value, db=db)

#     except HTTPException as http_exc:
#         if http_exc.status_code != 401:
#             logger.error(
#                 f"Unexpected HTTPException in get_optional_user: {http_exc.detail}"
#             )
#         return None

#     except Exception as exc:
#         logger.error(f"Unexpected error in get_optional_user: {exc}")
#         return None


async def get_current_superuser(
    current_user: Annotated[dict, Depends(get_current_user)],
) -> dict:
    if not current_user["is_superuser"]:
        raise ForbiddenException("You do not have enough privileges.")

    return current_user
