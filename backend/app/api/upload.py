from fastapi import APIRouter, UploadFile, File
import os


from app.ingestion.pipeline import run_pipeline

router = APIRouter()

UPLOAD_DIR = "data/uploads"

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Run ingestion pipeline
    run_pipeline(file_path)

    return {
        "message": f"{file.filename} uploaded successfully"
    }