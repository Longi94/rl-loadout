class HttpException(Exception):

    def __init__(self, code: int, message: str):
        self.code = code
        self.message = message


class BadRequestException(HttpException):

    def __init__(self, message: str):
        super(BadRequestException, self).__init__(400, message)


class UnauthorizedException(HttpException):

    def __init__(self, message: str):
        super(UnauthorizedException, self).__init__(401, message)


class NotFoundException(HttpException):

    def __init__(self, message: str):
        super(NotFoundException, self).__init__(404, message)


class InternalServerErrorException(HttpException):

    def __init__(self, message: str):
        super(InternalServerErrorException, self).__init__(500, message)
