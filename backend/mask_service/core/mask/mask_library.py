import os
import random
from typing import Dict, Iterator, List

from core.face.face_detector import FaceDetector
from core.face_mark.face_marks_detector import FaceMarksDetector
from core.image import Image
from core.mask.mask import Mask


class MasksLibrary:
    def __init__(self):
        self._lib: Dict[str, Mask] = {}

    def __len__(self) -> int:
        return len(self._lib)

    def __getitem__(self, name: str) -> Mask:
        return self._lib[name]

    def __setitem__(self, name: str, mask: Mask):
        self._lib[name] = mask

    def __delitem__(self, name: str):
        self._lib.__delitem__(name)

    def __contains__(self, name: str) -> bool:
        return name in self._lib

    def __iter__(self) -> Iterator[Mask]:
        return self._lib.values().__iter__()

    def get(self, name: str) -> Mask:
        return self._lib[name]

    def get_all_masks_names(self) -> List[str]:
        return list(self._lib.keys())

    def select_randomly(self, n: int) -> List[Mask]:
        return random.choices(list(self), k=n)

    @classmethod
    def load_from_dir(cls, dir_path: str, face_detector: FaceDetector,
                      marks_detector: FaceMarksDetector) -> 'MasksLibrary':
        def get_mask_name_from(file_path: str) -> str:
            name = os.path.basename(file_path)
            name = os.path.splitext(name)[0]
            return name

        new_lib = MasksLibrary()
        image_paths = [os.path.join(dir_path, f) for f in os.listdir(dir_path)]
        for image_path in image_paths:
            try:
                image = Image.from_file(image_path)
                name = get_mask_name_from(image_path)
                mask = Mask.from_image(image, face_detector, marks_detector)
                new_lib[name] = mask
            except Exception as err:
                print(f"Error creating mask for {image_path}\nError: {err}")
                continue

        return new_lib
