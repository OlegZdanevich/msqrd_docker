from typing import Tuple

import cv2
import numpy as np


class Image:
    def __init__(self, pixels: np.ndarray):
        self._pixels = pixels

    @classmethod
    def from_file(cls, file: str) -> 'Image':
        return Image(
            cv2.imread(file, cv2.IMREAD_COLOR)
        )

    @classmethod
    def from_layer(cls, image_layer: 'ImageLayer') -> 'Image':
        return Image(image_layer._pixels)

    @classmethod
    def from_bytes(cls, buffer: bytes) -> 'Image':
        encoded = np.frombuffer(buffer, dtype=np.uint8)
        encoded = encoded.reshape(len(encoded), 1)
        pixels = cv2.imdecode(encoded, flags=cv2.IMREAD_COLOR)
        return Image(pixels)

    @property
    def size(self) -> Tuple[int, int]:
        return self._pixels.shape[0], self._pixels.shape[1]

    @property
    def shape(self) -> Tuple[int, int, int]:
        return tuple(self._pixels.shape)

    def read(self) -> np.ndarray:
        return np.copy(self._pixels)

    def read_grayscale(self) -> np.ndarray:
        return cv2.cvtColor(self._pixels, cv2.COLOR_BGR2GRAY)

    def as_layer(self) -> 'ImageLayer':
        return ImageLayer(self.read())

    def save_to_file(self, path: str):
        cv2.imwrite(path, self._pixels)

    def to_bytes(self) -> bytes:
        return bytes(
            cv2.imencode('.jpg', self._pixels)[1]
        )


class ImageLayer:
    def __init__(self, pixels: np.ndarray):
        self._pixels = pixels

    def read(self):
        return np.copy(self._pixels)

    def apply(self, top_layer: 'ImageLayer') -> 'ImageLayer':
        mask = np.zeros(self._pixels.shape[-1], dtype=np.int8)
        merge_positions = top_layer._pixels == mask
        merged_pixels = np.copy(top_layer._pixels)
        merged_pixels[merge_positions] = self._pixels[merge_positions]
        return ImageLayer(merged_pixels)
