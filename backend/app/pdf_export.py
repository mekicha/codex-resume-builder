from io import BytesIO

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas

from .models import ResumeData


TOP_Y = 760
BOTTOM_Y = 60
X_MARGIN = 50


def generate_resume_pdf(data: ResumeData) -> bytes:
    """Generate a multi-page ATS-friendly PDF by default."""
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=LETTER)
    y = TOP_Y

    def ensure_space(required_gap: int = 16):
        nonlocal y
        if y - required_gap < BOTTOM_Y:
            pdf.showPage()
            y = TOP_Y

    def line(text: str, size: int = 11, gap: int = 16, bold: bool = False):
        nonlocal y
        if not text:
            return
        ensure_space(gap)
        font = "Helvetica-Bold" if bold else "Helvetica"
        pdf.setFont(font, size)
        pdf.drawString(X_MARGIN, y, text)
        y -= gap

    basics = data.basics

    line(basics.full_name or "Your Name", size=18, gap=24, bold=True)
    line(
        " | ".join(part for part in [basics.title, basics.location, basics.email, basics.phone] if part),
        size=10,
        gap=22,
    )

    if data.summary:
        line("PROFESSIONAL SUMMARY", size=12, gap=18, bold=True)
        for segment in data.summary.split("\n"):
            line(segment.strip(), size=11, gap=14)
        y -= 6

    if data.skills:
        line("SKILLS", size=12, gap=18, bold=True)
        line(", ".join(skill.strip() for skill in data.skills if skill.strip()), size=10, gap=14)
        y -= 6

    if data.experience:
        line("EXPERIENCE", size=12, gap=18, bold=True)
        for item in data.experience:
            heading = f"{item.role} — {item.company}".strip(" —")
            line(heading, size=11, gap=14, bold=True)
            if item.start_date or item.end_date:
                line(f"{item.start_date} - {item.end_date}".strip(" -"), size=10, gap=14)
            for h in item.highlights:
                line(f"- {h.strip()}", size=10, gap=13)
            y -= 4

    if data.education:
        line("EDUCATION", size=12, gap=18, bold=True)
        for item in data.education:
            degree_line = f"{item.degree} {f'in {item.field_of_study}' if item.field_of_study else ''}".strip()
            line(degree_line, size=11, gap=14, bold=True)
            line(item.school, size=10, gap=14)
            if item.start_date or item.end_date:
                line(f"{item.start_date} - {item.end_date}".strip(" -"), size=10, gap=14)
            y -= 4

    if data.certifications:
        line("CERTIFICATIONS", size=12, gap=18, bold=True)
        for item in data.certifications:
            line(item.name, size=11, gap=14, bold=True)
            line(" | ".join(part for part in [item.issuer, item.issue_date] if part), size=10, gap=13)

    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer.read()
