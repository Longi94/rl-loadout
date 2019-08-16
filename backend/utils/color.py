from typing import List


def int_to_rgb_array(n: int) -> List[int] or None:
    if n is None:
        return None
    return [
        n >> 16 & 255,
        n >> 8 & 255,
        n & 255
    ]
