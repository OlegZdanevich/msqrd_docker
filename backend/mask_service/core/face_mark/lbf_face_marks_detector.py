from typing import List

import cv2
import numpy as np

from core.face.face import Face
from core.face_mark.face_marks import FaceMarks
from core.face_mark.face_marks_detector import FaceMarksDetector


class LBFFaceMarksDetector(FaceMarksDetector):
    def __init__(self, detector: cv2.face_Facemark):
        self._detector = detector

    def __call__(self, faces: List[Face]) -> List[FaceMarks]:
        if not faces:
            return []
        grayscale_image = faces[0].image.read_grayscale()
        faces_matrix = self._faces_to_matrix(faces)
        res, marks_arr = self._detector.fit(grayscale_image, faces_matrix)
        return [FaceMarks(f, m[0]) for f, m in zip(faces, marks_arr)]

    @staticmethod
    def _faces_to_matrix(faces: List[Face]) -> np.ndarray:
        return np.array([f.rect.as_array() for f in faces])
