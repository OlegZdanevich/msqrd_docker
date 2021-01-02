import numpy as np
import skimage
import skimage.transform

from core.face.face_detector import FaceDetector
from core.face_mark.face_marks import FaceMarks
from core.face_mark.face_marks_detector import FaceMarksDetector
from core.image import Image, ImageLayer


class Mask:
    def __init__(self, origin_image: Image, mask_marks: FaceMarks):
        self._cached_image = origin_image.read()
        self._mask_marks = mask_marks

    @classmethod
    def from_image(cls, origin_image: Image,
                   face_detector: FaceDetector,
                   face_marks_detector: FaceMarksDetector) -> 'Mask':
        mask_faces = face_detector(origin_image)
        mask_marks = face_marks_detector(mask_faces)[0]
        return Mask(origin_image, mask_marks)

    def apply(self, face_marks: FaceMarks) -> ImageLayer:
        transform = skimage.transform.PiecewiseAffineTransform()
        transform.estimate(face_marks.as_array(), self._mask_marks.as_array())

        img_dst_shape = face_marks.face.image.shape
        mask_on_face_pixels = self._warp_image(transform, img_dst_shape)
        mask_on_face_pixels = skimage.img_as_ubyte(mask_on_face_pixels)

        return ImageLayer(mask_on_face_pixels)

    def _warp_image(self, transform, image_shape) -> np.ndarray:
        return skimage.transform.warp(self._cached_image,
                                      transform,
                                      output_shape=image_shape)
