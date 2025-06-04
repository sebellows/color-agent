from __future__ import annotations

from enum import Enum
from typing import Any
from uuid import UUID

from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field

from api.core.config import settings
from api.core.logger import get_logger
from api.utils.string import camelize

from .address import Address


logger = get_logger(__name__)
# logger.setLevel(os.getenv("LOG_LEVEL", "INFO"))


class UserConsent(BaseModel):
    client_id: str | None = None
    created_date: int | None = None
    granted_client_scopes: list[str] | None = None
    last_update_date: int | None = None

    class Config:
        """Pydantic config."""

        alias_generator = camelize
        str_strip_whitespace = True
        populate_by_name = True


class Credential(BaseModel):
    created_date: int | None = None
    credential_data: str | None = None
    id: str | None = None
    priority: int | None = None
    secret_data: str | None = None
    temporary: bool | None = None
    type: str | None = None
    user_label: str | None = None
    value: str | None = None

    class Config:
        """Pydantic config."""

        alias_generator = camelize
        str_strip_whitespace = True
        populate_by_name = True


class UserProfile(BaseModel):
    access: dict[str, Any] | None = None
    attributes: dict[str, Any] | None = None
    client_consents: list[UserConsent] | None = None
    client_roles: dict[str, Any] | None = None
    created_timestamp: int | None = None
    credentials: list[Credential] | None = None
    disableable_credential_types: list[str] | None = None
    email: EmailStr | None = None
    email_verified: bool | None = None
    enabled: bool | None = None
    federated_identities: list[FederatedIdentity] | None = None
    federation_link: str | None = None
    first_name: str | None = None
    groups: list[str] | None = None
    id: UUID | None = None
    last_name: str | None = None
    not_before: int | None = None
    origin: str | None = None
    realm_roles: list[str] | None = None
    required_actions: list[str] | None = None
    self: str | None = None
    service_account_client_id: str | None = None
    username: str | None = None

    class Config:
        """Pydantic config."""

        alias_generator = camelize
        from_attributes = True
        str_strip_whitespace = True
        populate_by_name = True


class FederatedIdentity(BaseModel):
    identity_provider: str | None = None
    user_id: str | None = None
    user_name: str | None = None

    class Config:
        """Pydantic config."""

        alias_generator = camelize
        str_strip_whitespace = True
        populate_by_name = True


class Group(BaseModel):
    """GroupRepresentation."""

    access: dict[str, Any] | None = None
    attributes: dict[str, Any] | None = None
    clientRoles: dict[str, Any] | None = None
    id: str | None = None
    name: str | None = None
    path: str | None = None
    realm_roles: list[str] | None = None
    sub_groups: list[Group] | None = None

    class Config:
        """Pydantic config."""

        alias_generator = camelize
        str_strip_whitespace = True
        populate_by_name = True


Group.model_rebuild()


class Permission(BaseModel):
    claims: dict[str, Any] | None = None
    rsid: str | None = None
    rsname: str | None = None
    scopes: list[str] | None = None

    class Config:
        """Pydantic config."""

        str_strip_whitespace = True


class AccessTokenAuthorization(BaseModel):
    permissions: list[Permission] | None = None


class AccessTokenCategory(str, Enum):
    INTERNAL = "INTERNAL"
    ACCESS = "ACCESS"
    ID = "ID"
    ADMIN = "ADMIN"
    USERINFO = "USERINFO"
    LOGOUT = "LOGOUT"
    AUTHORIZATION_RESPONSE = "AUTHORIZATION_RESPONSE"


class AccessTokenAccess(BaseModel):
    roles: list[str] | None = None
    verify_caller: bool | None = None

    class Config:
        """Pydantic config."""

        str_strip_whitespace = True


class AccessToken(BaseModel):
    acr: str | None = None
    address: Address | None = None
    allowed_origins: list[str] | None = Field(None, alias="allowed-origins")
    at_hash: str | None = None
    auth_time: int | None = None
    authorization: AccessTokenAuthorization | None = None
    azp: str | None = None
    birthdate: str | None = None
    c_hash: str | None = None
    category: AccessTokenCategory | None = None
    claims_locales: str | None = None
    cnf: str | None = Field(None, alias="x5t#S256")
    email: str | None = None
    email_verified: bool | None = None
    exp: int | None = None
    family_name: str | None = None
    gender: str | None = None
    given_name: str | None = None
    iat: int | None = None
    iss: str | None = None
    jti: str | None = None
    locale: str | None = None
    middle_name: str | None = None
    name: str | None = None
    nbf: int | None = None
    nickname: str | None = None
    nonce: str | None = None
    other_claims: dict[str, Any] | None = Field(None, alias="otherClaims")
    phone_number: str | None = None
    phone_number_verified: bool | None = None
    picture: str | None = None
    preferred_username: str | None = None
    profile: str | None = None
    realm_access: AccessTokenAccess | None = None
    s_hash: str | None = None
    scope: str | None = None
    session_state: str | None = None
    sid: str | None = None
    sub: str | None = None
    tenants: list[str] | None = None
    trusted_certs: list[str] | None = Field(None, alias="trusted-certs")
    typ: str | None = None
    updated_at: int | None = None
    website: str | None = None
    zoneinfo: str | None = None

    class Config:
        """Pydantic config."""

        str_strip_whitespace = True
        populate_by_name = True


class TokenResponse(BaseModel):
    """Represent Keycloak token response."""

    access_token: str
    expires_in: int | None = None
    refresh_expires_in: int | None = None
    refresh_token: str | None = None
    token_type: str
    id_token: str | None = None
    not_before_policy: int | None = Field(None, alias="not-before-policy")
    session_state: str | None = None
    scope: str | None = None

    class Config:
        """Pydantic config."""

        str_strip_whitespace = True
        populate_by_name = True


class OAuthRequest(BaseModel):
    """Base class for authorization requests"""

    client_id: str | None = None
    grant_type: str
    client_secret: str | None = None


class TokenRequest(OAuthRequest):
    """Represent Keycloak token request."""

    username: str
    password: str
    grant_type: str = "password"
    scope: str | None = None

    class Config:
        """Pydantic config."""

        str_strip_whitespace = True

    @staticmethod
    def from_fastapi_form(
        request_form: OAuth2PasswordRequestForm,
    ) -> TokenRequest:
        """Create model from FastAPI OAuth2 Request Form."""
        scope = request_form.scopes[0] if request_form.scopes else None
        grant_type = request_form.grant_type or "password"
        return TokenRequest(
            username=request_form.username,
            password=request_form.password,
            client_id=request_form.client_id,
            grant_type=grant_type,
            client_secret=request_form.client_secret,
            scope=scope,
        )


class RefreshTokenRequest(OAuthRequest):
    """Represents Keycloak token refreshment request"""

    refresh_token: str
    client_id = settings.auth.KeyCloak.CLIENT_ID
    grant_type = "refresh_token"


class RealmAccess(BaseModel):
    roles: list[str] = Field(default_factory=list)


class ResourceAccessItem(BaseModel):
    roles: list[str] = Field(default_factory=list)


class IntrospectTokenResponse(BaseModel):
    exp: int | None = None
    iat: int | None = None
    jti: str | None = None
    iss: str | None = None
    sub: str | None = None
    typ: str | None = None
    azp: str | None = None
    session_state: str | None = None
    preferred_username: str | None = None
    email: str | None = None
    email_verified: bool | None = None
    acr: str | None = None
    realm_access: RealmAccess | None = None
    resource_access: dict[str, ResourceAccessItem] | None = None
    scope: str | None = None
    sid: str | None = None
    tenants: list[str] | None = None
    client_id: str | None = None
    name: str | None = None
    family_name: str | None = None
    given_name: str | None = None
    username: str | None = None
    auth_time: int | None = None
    active: bool
