class InvalidModelError(Exception):
    """
    Raised when an invalid model is passed to a Repository object or class.

    e.g.:
     * Trying to instantiate a repository with a non SQLAlchemy model
     * Trying to save a model belonging to another Repository class
    """

    pass


class ModelNotFoundError(Exception):
    """
    Raised when a Repository is not able to find a model using the provided primary key.
    """

    pass


class UnmappedPropertyError(Exception):
    """
    Raised when trying to execute queries using un-mapped column names.
    (i.e. passing a non-existing column to `search_params` or `order_by`
    parameters when invoking `find()`)
    """

    pass
