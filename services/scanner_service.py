import os
import shutil
from fastapi import UploadFile
from nutrition.scanner_engine import detect_food_from_image

UPLOAD_DIR = "uploads"


def scan_food_image(file: UploadFile):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = detect_food_from_image(file.filename)

    return {
        "success": True,
        "filename": file.filename,
        "file_path": file_path,
        "scan_result": result,
    }