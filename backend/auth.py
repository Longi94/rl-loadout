import bcrypt


def hash_password(password: str) -> str:
    """Hash a password for storing."""
    password = password.encode('utf-8')
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')


def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verify a stored password against one provided by user"""
    provided_password = provided_password.encode('utf-8')
    stored_password = stored_password.encode('utf-8')
    return bcrypt.checkpw(provided_password, stored_password)
