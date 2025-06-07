"""Security utilities."""

from datetime import datetime, timedelta, timezone
from typing import Any

import requests
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.auth.KeyCloak.BASE_URL}/protocol/openid-connect/token")


def get_keycloak_public_key():
    """Get the public key from Keycloak for token verification"""
    url = settings.auth.KeyCloak.BASE_URL
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()["public_key"]

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to fetch Keycloak public key",
    )


def decode_token(token: str) -> dict[str, Any]:
    """Decode and verify the JWT token"""
    try:
        public_key = get_keycloak_public_key()
        decoded_token = jwt.decode(
            token,
            f"-----BEGIN PUBLIC KEY-----\n{public_key}\n-----END PUBLIC KEY-----",
            algorithms=["RS256"],
            audience=settings.auth.KeyCloak.CLIENT_ID,
        )
        return decoded_token
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_token(token: str) -> bool:
    try:
        token_data = decode_token(token)
        return isinstance(token_data, dict) and "email" in token_data
    except Exception:
        return False


# async def create_current_user(token: str = Depends(
# settings.OAUTH2_TOKEN_URL), db: AsyncSession = Depends(get_async_db)) -> User:
#     """Get current user based on the JWT token"""
#     token_data = decode_token(token)
#     email = token_data.get("email", "")
#     user = crud_users.get(db=db, email=email, is_deleted=False)

#     return User(
#         username=token_data.get("preferred_username", ""),
#         email=token_data.get("email", ""),
#         full_name=token_data.get("name", ""),
#     )


def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    """Create JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.auth.JWT.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.auth.JWT.SECRET_KEY, algorithm=settings.auth.JWT.ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Get password hash."""
    return pwd_context.hash(password)
