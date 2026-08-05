import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')

def test_templates_list():
    response = requests.get(f"{BASE_URL}/api/templates/list")
    assert response.status_code == 200
    data = response.json()
    assert "templates" in data
    assert "episodes" in data
    
    templates = data["templates"]
    assert len(templates) >= 2
    
    # Check CV bundle
    cv_bundle = next((t for t in templates if t["id"] == "cv-bundle"), None)
    assert cv_bundle is not None
    assert cv_bundle["filename"] == "Professional_CV_Templates.rar"
    
    # Check Cover Letter bundle
    cover_bundle = next((t for t in templates if t["id"] == "cover-letter-bundle"), None)
    assert cover_bundle is not None
    assert cover_bundle["filename"] == "Winning_Cover_Letters.rar"

def test_download_cv_bundle():
    response = requests.get(f"{BASE_URL}/api/templates/download/cv-bundle")
    assert response.status_code == 200
    assert "application/x-rar-compressed" in response.headers.get("content-type", "") or "octet-stream" in response.headers.get("content-type", "")
    assert "Professional_CV_Templates.rar" in response.headers.get("content-disposition", "")
    assert len(response.content) > 1000

def test_download_cover_letter_bundle():
    response = requests.get(f"{BASE_URL}/api/templates/download/cover-letter-bundle")
    assert response.status_code == 200
    assert "Winning_Cover_Letters.rar" in response.headers.get("content-disposition", "")
    assert len(response.content) > 1000
