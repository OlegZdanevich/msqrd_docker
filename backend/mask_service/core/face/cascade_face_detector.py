import typing

import cv2

from core.face.face import Face
from core.face.face_detector import FaceDetector
from core.image import Image
from core.rect import Rect


class CascadeFaceDetector(FaceDetector):
    def __init__(self, classifier: cv2.CascadeClassifier):
        self._classifier = classifier

    def __call__(self, image: Image,
                 scale_factor: float = 1.2,
                 min_neighbors: int = 7) -> typing.List[Face]:
        grayscale_image = image.read_grayscale()
        face_rects = self._classifier.detectMultiScale(grayscale_image,
                                                       scale_factor,
                                                       min_neighbors)
        rects = map(Rect.from_array, face_rects)
        return [Face(image, r) for r in rects]
