from io import BytesIO

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

from .models import ResumeData


TOP_Y = 760
BOTTOM_Y = 60
X_MARGIN = 50
MAX_WIDTH = 510


def wrap_text(text: str, font_name: str, font_size: int, max_width: int) -> list[str]:
    words = text.split()
    if not words:
        return []

    lines: list[str] = []
    current = words[0]

    for word in words[1:]:
        candidate = f"{current} {word}"
        if stringWidth(candidate, font_name, font_size) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word

    lines.append(current)
    return lines


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

    def write_wrapped(text: str, size: int = 11, gap: int = 16, bold: bool = False):
        nonlocal y
        if not text:
            return
        font = "Helvetica-Bold" if bold else "Helvetica"
        for line in wrap_text(text, font, size, MAX_WIDTH):
            ensure_space(gap)
            pdf.setFont(font, size)
            pdf.drawString(X_MARGIN, y, line)
            y -= gap

    basics = data.basics

    write_wrapped(basics.full_name or "Your Name", size=18, gap=24, bold=True)
    write_wrapped(
        " | ".join(part for part in [basics.title, basics.location, basics.email, basics.phone] if part),
        size=10,
        gap=18,
    )

    if data.summary:
        write_wrapped("PROFESSIONAL SUMMARY", size=12, gap=18, bold=True)
        for segment in data.summary.split("\n"):
            write_wrapped(segment.strip(), size=11, gap=14)
        y -= 6

    if data.skills:
        write_wrapped("SKILLS", size=12, gap=18, bold=True)
        write_wrapped(", ".join(skill.strip() for skill in data.skills if skill.strip()), size=10, gap=14)
        y -= 6

    if data.experience:
        write_wrapped("EXPERIENCE", size=12, gap=18, bold=True)
        for item in data.experience:
            heading = f"{item.role} — {item.company}".strip(" —")
            write_wrapped(heading, size=11, gap=14, bold=True)
            if item.start_date or item.end_date:
                write_wrapped(f"{item.start_date} - {item.end_date}".strip(" -"), size=10, gap=14)
            for h in item.highlights:
                write_wrapped(f"- {h.strip()}", size=10, gap=13)
            y -= 4

    if data.education:
        write_wrapped("EDUCATION", size=12, gap=18, bold=True)
        for item in data.education:
            degree_line = f"{item.degree} {f'in {item.field_of_study}' if item.field_of_study else ''}".strip()
            write_wrapped(degree_line, size=11, gap=14, bold=True)
            write_wrapped(item.school, size=10, gap=14)
            if item.start_date or item.end_date:
                write_wrapped(f"{item.start_date} - {item.end_date}".strip(" -"), size=10, gap=14)
            y -= 4

    if data.certifications:
        write_wrapped("CERTIFICATIONS", size=12, gap=18, bold=True)
        for item in data.certifications:
            write_wrapped(item.name, size=11, gap=14, bold=True)
            write_wrapped(" | ".join(part for part in [item.issuer, item.issue_date] if part), size=10, gap=13)

    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer.read()
