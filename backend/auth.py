import bcrypt


def hash_password(password):
    """Hash a password for storing."""
    return bcrypt.hashpw(password, bcrypt.gensalt())


def verify_password(stored_password, provided_password):
    """Verify a stored password against one provided by user"""
    return bcrypt.checkpw(provided_password, stored_password)
