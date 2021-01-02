import typing

import numpy as np


class Rect(typing.NamedTuple):
    x: int
    y: int
    w: int
    h: int

    @classmethod
    def from_array(cls, arr: np.ndarray) -> 'Rect':
        return cls._make(arr)

    def as_array(self) -> np.ndarray:
        return np.array((self.x, self.y, self.w, self.h))

    def as_tl_br(self) -> typing.Tuple[np.ndarray, np.ndarray]:
        top_left = np.array((self.x, self.y))
        bottom_right = np.array((self.x + self.w, self.y + self.h))
        return top_left, bottom_right
