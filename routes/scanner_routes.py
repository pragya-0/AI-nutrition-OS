from fastapi import APIRouter, UploadFile, File
from services.scanner_service import scan_food_image

router = APIRouter()


@router.get("/scanner-test")
def scanner_test():
    return {
        "message": "Scanner route working 📸"
    }


@router.post("/scan-food")
def scan_food(file: UploadFile = File(...)):
    return scan_food_image(file)