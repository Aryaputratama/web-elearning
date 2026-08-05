import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

templates_router = APIRouter(prefix="/templates", tags=["Templates Hub"])

# Create a directory for templates if it doesn't exist
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "..", "storage", "templates")
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# Generate mock .rar files if they don't exist
CV_RAR_PATH = os.path.join(TEMPLATES_DIR, "Professional_CV_Templates.rar")
COVER_RAR_PATH = os.path.join(TEMPLATES_DIR, "Winning_Cover_Letters.rar")

def ensure_sample_rar_files():
    if not os.path.exists(CV_RAR_PATH):
        with open(CV_RAR_PATH, "wb") as f:
            f.write(b"Rar! Mock CV Templates Archive (ATS Friendly, Executive, Modern)")
    if not os.path.exists(COVER_RAR_PATH):
        with open(COVER_RAR_PATH, "wb") as f:
            f.write(b"Rar! Mock Cover Letter Templates Archive (Tech, Finance, Creative)")

ensure_sample_rar_files()

@templates_router.get("/list")
async def get_templates():
    return {
        "templates": [
            {
                "id": "cv-bundle",
                "title": "Ultimate Professional CV Template Pack",
                "description": "ATS-optimized CV and Resume templates in Word, InDesign, and LaTeX formats (.rar).",
                "category": "CV Templates",
                "filename": "Professional_CV_Templates.rar",
                "size": "14.2 MB",
                "downloads": 4820,
                "rating": 4.9,
                "badge": "Most Popular",
                "formats": ["DOCX", "PDF", "LaTeX", "INDD"]
            },
            {
                "id": "cover-letter-bundle",
                "title": "High-Conversion Cover Letter Suite",
                "description": "Tailored cover letter frameworks for FAANG, Fortune 500, and fast-growing startups (.rar).",
                "category": "Cover Letter Templates",
                "filename": "Winning_Cover_Letters.rar",
                "size": "8.5 MB",
                "downloads": 3910,
                "rating": 4.8,
                "badge": "Recruiter Approved",
                "formats": ["DOCX", "TXT", "Markdown"]
            },
            {
                "id": "portfolio-bundle",
                "title": "Creative Portfolio & Case Study Kit",
                "description": "Design layouts and Notion templates for product designers, engineers, and marketers.",
                "category": "Portfolio Kit",
                "filename": "Professional_CV_Templates.rar",
                "size": "22.1 MB",
                "downloads": 2150,
                "rating": 4.7,
                "badge": "New Edition",
                "formats": ["Figma", "Notion", "HTML"]
            }
        ],
        "episodes": [
            {
                "number": 19,
                "title": "Career Kickstart & Episode 19 Masterclass",
                "link": "https://career-kickstart-19.preview.emergentagent.com/episode/1",
                "description": "Mastering the job market, resume optimization, and high-response outreach."
            }
        ]
    }

@templates_router.get("/download/{template_type}")
async def download_template(template_type: str):
    if template_type == "cv" or template_type == "Professional_CV_Templates.rar":
        file_path = CV_RAR_PATH
        download_name = "Professional_CV_Templates.rar"
    elif template_type == "cover-letter" or template_type == "Winning_Cover_Letters.rar":
        file_path = COVER_RAR_PATH
        download_name = "Winning_Cover_Letters.rar"
    else:
        file_path = CV_RAR_PATH
        download_name = "Career_Templates_Bundle.rar"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Template archive not found")

    return FileResponse(
        path=file_path,
        filename=download_name,
        media_type="application/x-rar-compressed"
    )
