from abc import ABC, abstractmethod


class CategoryRepositoryContract(ABC):
    @abstractmethod
    async def get():
        raise NotImplementedError

    @abstractmethod
    async def get_all():
        raise NotImplementedError


class VendorRepositoryContract(ABC):
    @abstractmethod
    async def create():
        raise NotImplementedError

    @abstractmethod
    async def get():
        raise NotImplementedError

    @abstractmethod
    async def get_all():
        raise NotImplementedError

    @abstractmethod
    async def update():
        raise NotImplementedError

    @abstractmethod
    async def delete():
        raise NotImplementedError

    @abstractmethod
    async def get_product_line_by_name():
        raise NotImplementedError

    @abstractmethod
    async def add_product_line():
        raise NotImplementedError

    @abstractmethod
    async def delete_product_line():
        raise NotImplementedError

    @abstractmethod
    async def update_product_line():
        raise NotImplementedError


class ProductLineRepositoryContract(ABC):
    @abstractmethod
    async def create():
        raise NotImplementedError

    @abstractmethod
    async def get():
        raise NotImplementedError

    @abstractmethod
    async def get_all():
        raise NotImplementedError

    @abstractmethod
    async def update():
        raise NotImplementedError

    @abstractmethod
    async def delete():
        raise NotImplementedError

    @abstractmethod
    async def get_product_by_id():
        raise NotImplementedError

    @abstractmethod
    async def get_product_by_name():
        raise NotImplementedError

    @abstractmethod
    async def get_products():
        raise NotImplementedError


class ProductRepositoryContract(ABC):
    @abstractmethod
    async def create():
        raise NotImplementedError

    @abstractmethod
    async def get():
        raise NotImplementedError

    @abstractmethod
    async def update():
        raise NotImplementedError

    @abstractmethod
    async def delete():
        raise NotImplementedError


class UserRepositoryContract(ABC):
    @abstractmethod
    async def get_user_by_email():
        raise NotImplementedError

    @abstractmethod
    async def register_user():
        raise NotImplementedError

    @abstractmethod
    async def delete_user():
        raise NotImplementedError

    @abstractmethod
    async def update_user():
        raise NotImplementedError
