import abc
from typing import List

from core.face.face import Face
from core.face_mark.face_marks import FaceMarks


class FaceMarksDetector(abc.ABC):
    @abc.abstractmethod
    def __call__(self, faces: List[Face]) -> List[FaceMarks]:
        ...
