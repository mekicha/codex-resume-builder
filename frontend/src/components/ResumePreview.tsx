import type { ResumeData } from '../types/resume';

type Props = {
  data: ResumeData;
};

export function ResumePreview({ data }: Props) {
  const exp = data.experience[0];
  const edu = data.education[0];
  const cert = data.certifications[0];

  return (
    <section>
      <h2>3) Live Preview ({data.template_id})</h2>
      <article className={`preview ${data.template_id}`}>
        <h1>{data.basics.full_name || 'Your Name'}</h1>
        <p className="subhead">
          {[data.basics.title, data.basics.location, data.basics.email, data.basics.phone].filter(Boolean).join(' | ')}
        </p>

        <h3>Summary</h3>
        <p>{data.summary || 'Your summary will appear here.'}</p>

        <h3>Skills</h3>
        <p>{data.skills.length ? data.skills.join(', ') : 'Add skills to preview them here.'}</p>

        <h3>Experience</h3>
        {exp ? (
          <div>
            <strong>
              {exp.role} {exp.company ? `— ${exp.company}` : ''}
            </strong>
            <div className="muted">
              {exp.start_date} {exp.end_date ? `- ${exp.end_date}` : ''}
            </div>
            <ul>
              {exp.highlights.map((h, idx) => (
                <li key={`${h}-${idx}`}>{h}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="muted">Add experience to preview it here.</p>
        )}

        <h3>Education</h3>
        {edu ? (
          <p>
            <strong>{edu.degree}</strong> {edu.field_of_study ? `in ${edu.field_of_study}` : ''} — {edu.school}
          </p>
        ) : (
          <p className="muted">Add education to preview it here.</p>
        )}

        <h3>Certifications</h3>
        {cert ? (
          <p>
            <strong>{cert.name}</strong> — {cert.issuer} {cert.issue_date ? `(${cert.issue_date})` : ''}
          </p>
        ) : (
          <p className="muted">Add certifications to preview them here.</p>
        )}
      </article>
    </section>
  );
}
