import abc

from core.image import Image
from core.rect import Rect


class Face(abc.ABC):
    def __init__(self, image: Image, rect: Rect):
        self._image = image
        self._rect = rect

    @property
    def image(self) -> Image:
        return self._image

    @property
    def rect(self) -> Rect:
        return self._rect

    def __repr__(self):
        return f"Face with {self.rect} on {self.image}"
