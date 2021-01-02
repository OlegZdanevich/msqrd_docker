import abc

from core.image import Image


class MaskService(abc.ABC):
    @abc.abstractmethod
    def apply_masks(self, image: Image) -> Image:
        ...
