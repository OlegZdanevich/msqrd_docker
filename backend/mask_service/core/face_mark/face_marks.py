import numpy as np

from core.face.face import Face


class FaceMarks:
    def __init__(self, face: Face, marks: np.ndarray):
        self._face = face
        self._marks = marks

    @property
    def face(self) -> Face:
        return self._face

    def as_array(self) -> np.ndarray:
        return self._marks

    def __repr__(self):
        return f"Face marks: {str(self._marks)}"
