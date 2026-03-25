import { useEffect, useState } from 'react';
import { createResume, exportResumePdf, fetchTemplates, updateResume } from './api/client';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { TemplateSelector } from './components/TemplateSelector';
import type { ResumeData, TemplateInfo } from './types/resume';

const initialResume: ResumeData = {
  template_id: 'classic',
  basics: {
    full_name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
  },
  summary: '',
  experience: [],
  education: [],
  certifications: [],
  skills: [],
};

export default function App() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    fetchTemplates().then(setTemplates).catch(() => setStatus('Failed to load templates'));
  }, []);

  async function saveResume(): Promise<string | null> {
    try {
      setStatus('Saving...');
      if (!resumeId) {
        const created = await createResume(resume);
        setResumeId(created.id);
        setStatus('Saved');
        return created.id;
      } else {
        await updateResume(resumeId, resume);
        setStatus('Saved');
        return resumeId;
      }
    } catch {
      setStatus('Save failed');
      return null;
    }
  }

  async function downloadPdf() {
    try {
      const id = resumeId ?? (await saveResume());
      if (!id) {
        setStatus('Please save first');
        return;
      }
      setStatus('Preparing PDF...');
      const blob = await exportResumePdf(id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'resume.pdf';
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus('PDF downloaded');
    } catch {
      setStatus('Export failed');
    }
  }

  return (
    <main>
      <h1>Resume Builder (Local MVP)</h1>
      <p className="muted">Choose a template, edit details, save locally, and export ATS-friendly PDF.</p>

      <TemplateSelector
        templates={templates}
        selectedTemplate={resume.template_id}
        onSelect={(template_id) => setResume({ ...resume, template_id })}
      />
      <ResumeForm value={resume} onChange={setResume} />
      <ResumePreview data={resume} />

      <div className="action-row">
        <button type="button" onClick={saveResume}>
          Save Resume
        </button>
        <button type="button" onClick={downloadPdf}>
          Export PDF
        </button>
        <span className="muted">{status}</span>
      </div>

      {resumeId && <p className="muted">Resume ID: {resumeId}</p>}
    </main>
  );
}
