class AppException(Exception):

    status_code: int = 400

    def __init__(self, message: str, details: str | None = None):
        self.message = message
        self.details = details
        super().__init__(message)
