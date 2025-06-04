from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK, HTTP_204_NO_CONTENT, HTTP_201_CREATED

from .dependencies import provide_product_type_repository
from .models import ProductType
from .repository import ProductTypeRepository
from .schemas import (
    ProductType as ProductTypeSchema,
    ProductTypeCreate,
    ProductTypeUpdate,
)

router = APIRouter(
    prefix="/product-type",
    tags=["product_types"],
)


# ProductType routes
@router.post(
    "",
    response_model=ProductTypeSchema,
    status_code=HTTP_201_CREATED,
)
async def create_product_type(
    product_type_in: ProductTypeCreate,
    repository: ProductTypeRepository = Depends(provide_product_type_repository),
):
    """Create a new product type"""
    product_type_data = product_type_in.model_dump(exclude_unset=True)
    product_type = ProductType(**product_type_data)
    await repository.add(product_type)
    return ProductTypeSchema.model_validate(product_type)


@router.get(
    "/{product_type_id}", response_model=ProductTypeSchema, status_code=HTTP_200_OK
)
async def get_product_type(
    product_type_id: int,
    repository: ProductTypeRepository = Depends(provide_product_type_repository),
):
    """Get a product type by ID"""
    product_type = await repository.get(ProductType.id == product_type_id)
    return ProductTypeSchema.model_validate(product_type)


@router.get("", response_model=list[ProductTypeSchema], status_code=HTTP_200_OK)
async def list_product_types(
    repository: ProductTypeRepository = Depends(provide_product_type_repository),
):
    """List all product types"""
    product_types = await repository.list()
    return [ProductTypeSchema.model_validate(pt) for pt in product_types]


@router.put(
    "/{product_type_id}", response_model=ProductTypeSchema, status_code=HTTP_200_OK
)
async def update_product_type(
    product_type_id: int,
    product_type_in: ProductTypeUpdate,
    repository: ProductTypeRepository = Depends(provide_product_type_repository),
):
    """Update a product type"""
    product_type = await repository.get_and_update(
        ProductType.id == product_type_id,
        data=product_type_in.model_dump(exclude_unset=True),
    )

    return ProductTypeSchema.model_validate(product_type)


@router.delete("/{product_type_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_type(
    product_type_id: int,
    repository: ProductTypeRepository = Depends(provide_product_type_repository),
):
    """Delete a product type"""
    await repository.delete(ProductType.id == product_type_id)
    return None
