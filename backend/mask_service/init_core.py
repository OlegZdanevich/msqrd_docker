import urllib.request

import cv2

from core.face.cascade_face_detector import CascadeFaceDetector, FaceDetector
from core.face_mark.face_marks_detector import FaceMarksDetector
from core.face_mark.lbf_face_marks_detector import LBFFaceMarksDetector
from core.image import Image
from core.mask.mask_library import MasksLibrary
from core.service.input_scale_mask_service import InputScaleMaskService
from core.service.mask_service import MaskService
from core.service.random_selected_mask_service import RandomSelectedMaskService


def init_face_detector() -> FaceDetector:
    return CascadeFaceDetector(
        cv2.CascadeClassifier('models/face_detectors/'
                              'haarcascade_frontalface_default.xml')
    )


def init_marks_detector() -> FaceMarksDetector:
    facemark_lbf = cv2.face.createFacemarkLBF()
    facemark_lbf.loadModel('models/lbfmodel.yaml')
    return LBFFaceMarksDetector(facemark_lbf)


def load_mask_lib(face_detector, marks_detector) -> MasksLibrary:
    return MasksLibrary.load_from_dir("masks", face_detector, marks_detector)


def init_service(face_detector, marks_detector, mask_lib) -> MaskService:
    return InputScaleMaskService(
        RandomSelectedMaskService(face_detector, marks_detector, mask_lib),
        900
    )


def generate_mask_worker(service: MaskService):
    def mask_worker(photo_link: str) -> Image:
        photo_path, header = urllib.request.urlretrieve(photo_link)
        image = Image.from_file(photo_path)
        return service.apply_masks(image)

    return mask_worker
