import json
from pathlib import Path
from typing import Optional

from .models import ResumeData, ResumeRecord


DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "resumes"
DATA_DIR.mkdir(parents=True, exist_ok=True)


def _resume_path(resume_id: str) -> Path:
    return DATA_DIR / f"{resume_id}.json"


def save_resume(resume_id: str, data: ResumeData) -> ResumeRecord:
    record = ResumeRecord(id=resume_id, data=data)
    _resume_path(resume_id).write_text(record.model_dump_json(indent=2), encoding="utf-8")
    return record


def get_resume(resume_id: str) -> Optional[ResumeRecord]:
    path = _resume_path(resume_id)
    if not path.exists():
        return None
    raw = json.loads(path.read_text(encoding="utf-8"))
    return ResumeRecord.model_validate(raw)
