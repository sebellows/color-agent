from .app_exceptions import ColorAgentError


class CacheIdentificationInferenceError(ColorAgentError):
    def __init__(self, message: str = "Could not infer id for resource being cached.") -> None:
        self.message = message
        super().__init__(self.message)


class InvalidRequestError(ColorAgentError):
    def __init__(self, message: str = "Type of request not supported.") -> None:
        self.message = message
        super().__init__(self.message)


class MissingClientError(ColorAgentError):
    def __init__(self, message: str = "Client is None.") -> None:
        self.message = message
        super().__init__(self.message)
