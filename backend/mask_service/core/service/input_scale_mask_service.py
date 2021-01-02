import cv2
import numpy as np

from core.image import Image
from core.service.mask_service import MaskService


class InputScaleMaskService(MaskService):
    def __init__(self, decorated_service: MaskService,
                 max_dim_scale: int = 800):
        self._decorated_service = decorated_service
        self._max_dim_scale = max_dim_scale

    def apply_masks(self, image: Image) -> Image:
        scaled_image = self._downscale_image(image)
        scaled_result = self._decorated_service.apply_masks(scaled_image)
        return self._upscale_image(scaled_result, image.size)

    def _downscale_image(self, image: Image) -> Image:
        scale_size = self._calculate_scaled_size(image.size)
        inv_scale_size = self._inverse_tuple(scale_size)
        scaled_pixels = cv2.resize(image._pixels, inv_scale_size,
                                   interpolation=cv2.INTER_LINEAR)
        return Image(scaled_pixels)

    def _upscale_image(self, image: Image, original_size: tuple) -> Image:
        inv_size = self._inverse_tuple(original_size)
        upscaled_pixels = cv2.resize(image._pixels, inv_size,
                                     interpolation=cv2.INTER_LANCZOS4)
        return Image(upscaled_pixels)

    def _calculate_scaled_size(self, input_size: tuple):
        max_arg = np.argmax(input_size)
        min_arg = np.argmin(input_size)
        scale_shape = [0, 0]
        scale_shape[max_arg] = self._max_dim_scale
        aspect_ratio = input_size[min_arg] / input_size[max_arg]
        scale_shape[min_arg] = int(self._max_dim_scale * aspect_ratio)
        return tuple(scale_shape)

    @staticmethod
    def _inverse_tuple(t: tuple) -> tuple:
        return t[1], t[0]
