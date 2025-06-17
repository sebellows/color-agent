from functools import cached_property

from injector import Module as ServiceProvider
from sqlalchemy import select

from .analogous.service import AnalogousService
from .locale.service import LocaleService
from .product.service import ProductService
from .product_line.service import ProductLineService
from .product_swatch.service import ProductSwatchService
from .product_variant.service import ProductVariantService
from .tag.service import TagService
from .user.service import UserService
from .vendor.service import VendorService


class ServicesContainer(ServiceProvider):
    def __init__(self, session):
        self.session = session

    @cached_property
    def provide_analogous(self):
        model_type = AnalogousService.Repo.model_type

        return AnalogousService(session=self.session, statement=select(model_type))

    @cached_property
    def provide_locales(self):
        return LocaleService(session=self.session)

    @cached_property
    def provide_products(self):
        model_type = ProductService.Repo.model_type

        return ProductService(
            session=self.session, statement=select(model_type).where(model_type.is_deleted.is_(False))
        )

    @cached_property
    def provide_product_lines(self):
        model_type = ProductLineService.Repo.model_type

        return ProductLineService(
            session=self.session,
            statement=select(model_type).where(model_type.is_deleted.is_(False)),
        )

    @cached_property
    def provide_product_swatches(self):
        return ProductSwatchService(session=self.session)

    @cached_property
    def provide_product_variants(self):
        model = ProductVariantService.Repo.model_type

        return ProductVariantService(session=self.session, statement=select(model).where(model.is_deleted.is_(False)))

    @cached_property
    def provide_tags(self):
        return TagService(session=self.session)

    @cached_property
    def provide_users(self):
        model_type = UserService.Repo.model_type

        return UserService(session=self.session, statement=select(model_type).where(model_type.is_deleted.is_(False)))

    @cached_property
    def provide_vendors(self):
        model_type = VendorService.Repo.model_type

        return VendorService(session=self.session, statement=select(model_type).where(model_type.is_deleted.is_(False)))
