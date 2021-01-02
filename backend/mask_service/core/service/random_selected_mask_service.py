from typing import List

from core.face.face_detector import FaceDetector
from core.face_mark.face_marks_detector import FaceMarksDetector
from core.image import Image, ImageLayer
from core.mask.mask_library import MasksLibrary
from core.service.mask_service import MaskService


class RandomSelectedMaskService(MaskService):
    def __init__(self, face_detector: FaceDetector,
                 face_marks_detector: FaceMarksDetector,
                 mask_library: MasksLibrary):
        self._face_detector = face_detector
        self._face_marks_detector = face_marks_detector
        self._mask_lib = mask_library

    def apply_masks(self, image: Image) -> Image:
        faces = self._face_detector(image)
        marks = self._face_marks_detector(faces)
        selected_masks = self._mask_lib.select_randomly(len(faces))
        masks_layers = self._apply_masks(selected_masks, marks)
        return self._merge_to_image(image, masks_layers)

    @staticmethod
    def _apply_masks(masks, marks) -> List[ImageLayer]:
        output = []
        size = len(masks)
        for i in range(size):
            output.append(masks[i].apply(marks[i]))
        return output

    @staticmethod
    def _merge_to_image(image, layers) -> Image:
        background = image.as_layer()
        for top_layer in layers:
            background = background.apply(top_layer)
        return Image.from_layer(background)
