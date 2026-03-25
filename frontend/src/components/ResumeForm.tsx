import type { ResumeData } from '../types/resume';

type Props = {
  value: ResumeData;
  onChange: (next: ResumeData) => void;
};

export function ResumeForm({ value, onChange }: Props) {
  const exp = value.experience[0];
  const edu = value.education[0];
  const cert = value.certifications[0];

  return (
    <section>
      <h2>2) Fill Resume Details</h2>
      <div className="form-grid">
        <input
          placeholder="Full name"
          value={value.basics.full_name}
          onChange={(e) => onChange({ ...value, basics: { ...value.basics, full_name: e.target.value } })}
        />
        <input
          placeholder="Professional title"
          value={value.basics.title}
          onChange={(e) => onChange({ ...value, basics: { ...value.basics, title: e.target.value } })}
        />
        <input
          placeholder="Email"
          value={value.basics.email}
          onChange={(e) => onChange({ ...value, basics: { ...value.basics, email: e.target.value } })}
        />
        <input
          placeholder="Phone"
          value={value.basics.phone}
          onChange={(e) => onChange({ ...value, basics: { ...value.basics, phone: e.target.value } })}
        />
        <input
          placeholder="Location"
          value={value.basics.location}
          onChange={(e) => onChange({ ...value, basics: { ...value.basics, location: e.target.value } })}
        />
      </div>

      <textarea
        rows={4}
        placeholder="Professional summary"
        value={value.summary}
        onChange={(e) => onChange({ ...value, summary: e.target.value })}
      />

      <textarea
        rows={3}
        placeholder="Skills (comma-separated)"
        value={value.skills.join(', ')}
        onChange={(e) =>
          onChange({
            ...value,
            skills: e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
      />

      <h3>Experience (first role)</h3>
      <div className="form-grid">
        <input
          placeholder="Company"
          value={exp?.company ?? ''}
          onChange={(e) =>
            onChange({ ...value, experience: [{ ...(exp ?? defaultExperience), company: e.target.value }] })
          }
        />
        <input
          placeholder="Role"
          value={exp?.role ?? ''}
          onChange={(e) =>
            onChange({ ...value, experience: [{ ...(exp ?? defaultExperience), role: e.target.value }] })
          }
        />
        <input
          placeholder="Start date"
          value={exp?.start_date ?? ''}
          onChange={(e) =>
            onChange({ ...value, experience: [{ ...(exp ?? defaultExperience), start_date: e.target.value }] })
          }
        />
        <input
          placeholder="End date"
          value={exp?.end_date ?? ''}
          onChange={(e) =>
            onChange({ ...value, experience: [{ ...(exp ?? defaultExperience), end_date: e.target.value }] })
          }
        />
      </div>
      <textarea
        rows={4}
        placeholder="Highlights (one per line)"
        value={(exp?.highlights ?? []).join('\n')}
        onChange={(e) =>
          onChange({
            ...value,
            experience: [
              {
                ...(exp ?? defaultExperience),
                highlights: e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean),
              },
            ],
          })
        }
      />

      <h3>Education (first entry)</h3>
      <div className="form-grid">
        <input
          placeholder="School"
          value={edu?.school ?? ''}
          onChange={(e) =>
            onChange({ ...value, education: [{ ...(edu ?? defaultEducation), school: e.target.value }] })
          }
        />
        <input
          placeholder="Degree"
          value={edu?.degree ?? ''}
          onChange={(e) =>
            onChange({ ...value, education: [{ ...(edu ?? defaultEducation), degree: e.target.value }] })
          }
        />
        <input
          placeholder="Field of study"
          value={edu?.field_of_study ?? ''}
          onChange={(e) =>
            onChange({ ...value, education: [{ ...(edu ?? defaultEducation), field_of_study: e.target.value }] })
          }
        />
        <input
          placeholder="Start - End"
          value={`${edu?.start_date ?? ''}${edu?.end_date ? ` - ${edu.end_date}` : ''}`}
          onChange={(e) => {
            const [start, end] = e.target.value.split(' - ');
            onChange({
              ...value,
              education: [{ ...(edu ?? defaultEducation), start_date: start ?? '', end_date: end ?? '' }],
            });
          }}
        />
      </div>

      <h3>Certification (first entry)</h3>
      <div className="form-grid">
        <input
          placeholder="Certification name"
          value={cert?.name ?? ''}
          onChange={(e) =>
            onChange({ ...value, certifications: [{ ...(cert ?? defaultCertification), name: e.target.value }] })
          }
        />
        <input
          placeholder="Issuer"
          value={cert?.issuer ?? ''}
          onChange={(e) =>
            onChange({ ...value, certifications: [{ ...(cert ?? defaultCertification), issuer: e.target.value }] })
          }
        />
        <input
          placeholder="Issue date"
          value={cert?.issue_date ?? ''}
          onChange={(e) =>
            onChange({ ...value, certifications: [{ ...(cert ?? defaultCertification), issue_date: e.target.value }] })
          }
        />
      </div>
    </section>
  );
}

const defaultExperience = {
  company: '',
  role: '',
  start_date: '',
  end_date: '',
  highlights: [],
};

const defaultEducation = {
  school: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
};

const defaultCertification = {
  name: '',
  issuer: '',
  issue_date: '',
};
