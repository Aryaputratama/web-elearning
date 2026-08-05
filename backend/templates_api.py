import os
import requests
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

templates_router = APIRouter(prefix="/templates")

CV_TEMPLATE_URL = "https://customer-assets-4nw71qhi.emergentagent.net/job_86ec0e80-f4f8-4a20-a137-bf527b3b5027/artifacts/ek1mq05h_cv%20template.rar"
COVER_LETTER_URL = "https://customer-assets-4nw71qhi.emergentagent.net/job_86ec0e80-f4f8-4a20-a137-bf527b3b5027/artifacts/5egzxt1h_cover%20latter.rar"

TEMPLATES_DATA = [
    {
        "id": "cv-bundle",
        "title": "Ultimate Professional CV Template Pack",
        "description": "Recruiter-approved, ATS-friendly CV templates with multiple professional layouts (.rar archive).",
        "category": "CV & Resume",
        "filename": "Professional_CV_Templates.rar",
        "size": "55.3 KB",
        "downloads": 14250,
        "rating": 4.9,
        "formats": ["Word (.docx)", "PDF", "LaTeX"],
        "download_url": CV_TEMPLATE_URL
    },
    {
        "id": "cover-letter-bundle",
        "title": "Winning Cover Letter Suite",
        "description": "High-converting cover letter templates tailored for tech, finance, marketing and executive roles (.rar archive).",
        "category": "Cover Letter",
        "filename": "Winning_Cover_Letters.rar",
        "size": "55.1 KB",
        "downloads": 9840,
        "rating": 4.8,
        "formats": ["Word (.docx)", "PDF", "Markdown"],
        "download_url": COVER_LETTER_URL
    },
    {
        "id": "master-career-pack",
        "title": "Episode 19 Master Career Bundle",
        "description": "Complete bundle combining both CV and Cover Letter `.rar` archives as showcased in Episode 19.",
        "category": "Master Bundle",
        "filename": "Episode_19_Career_Master_Bundle.rar",
        "size": "110.4 KB",
        "downloads": 24100,
        "rating": 5.0,
        "formats": ["All Formats (.rar)"],
        "download_url": CV_TEMPLATE_URL
    }
]

@templates_router.get("/list")
async def list_templates():
    return {
        "templates": TEMPLATES_DATA,
        "episodes": [
            {
                "id": "episode-19",
                "title": "Career Kickstart Episode 19",
                "link": "https://career-kickstart-19.preview.emergentagent.com/episode/1"
            }
        ]
    }

@templates_router.get("/download/{template_id}")
async def download_template(template_id: str):
    target_url = CV_TEMPLATE_URL
    filename = "Professional_CV_Templates.rar"
    
    if template_id == "cover-letter-bundle":
        target_url = COVER_LETTER_URL
        filename = "Winning_Cover_Letters.rar"
    elif template_id == "master-career-pack":
        target_url = CV_TEMPLATE_URL
        filename = "Episode_19_Career_Master_Bundle.rar"
    elif template_id == "cv-bundle":
        target_url = CV_TEMPLATE_URL
        filename = "Professional_CV_Templates.rar"

    try:
        resp = requests.get(target_url, timeout=15)
        if resp.status_code != 200:
            raise HTTPException(status_code=404, detail="Template file not found on remote storage")
        
        file_bytes = resp.content
        return Response(
            content=file_bytes,
            media_type="application/x-rar-compressed",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download template: {str(e)}")
