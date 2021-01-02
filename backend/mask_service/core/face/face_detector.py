import abc
import typing

from core.face.face import Face
from core.image import Image


class FaceDetector(abc.ABC):
    @abc.abstractmethod
    def __call__(self, image: Image) -> typing.List[Face]:
        ...
