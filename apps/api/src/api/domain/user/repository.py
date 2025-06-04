from uuid import UUID

from advanced_alchemy.repository import SQLAlchemyAsyncRepository

from .models import User


class UserRepository(SQLAlchemyAsyncRepository[User]):
    """Repository for User model."""

    model_type = User

    @staticmethod
    def filter_users(
        users: list[User],
        user_name_substring: str | None = None,
        user_id: UUID | None = None,
    ) -> list[User]:
        """Filter users"""

        filtered_users_name = []
        filtered_users_id = []

        if user_name_substring is None:
            filtered_users_name = users
        else:
            for user in users:
                if user.username and user_name_substring in user.username:
                    filtered_users_name.append(user)

        if user_id is None:
            filtered_users_id = filtered_users_name
        else:
            for user in filtered_users_name:
                if user.id and user.id.__str__() in user_id.__str__():
                    filtered_users_id.append(user)

        return filtered_users_id

    def add_tenant(self, tenant: str) -> None:
        """Add tenant to user's attribute 'tenants'."""
        tenants_key = "tenants"
        if self.attributes is None or self.attributes.get(tenants_key) is None:
            self.attributes = {tenants_key: []}
        if tenant not in self.attributes[tenants_key]:
            self.attributes[tenants_key].append(tenant)

    def remove_tenant(self, tenant: str) -> None:
        """Remove tenant from user's attribute 'tenants'."""
        tenants_key = "tenants"
        if self.attributes:
            user_tenants = self.attributes.get(tenants_key, [])
            if tenant in user_tenants:
                user_tenants.remove(tenant)
