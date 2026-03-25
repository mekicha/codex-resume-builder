import type { TemplateInfo } from '../types/resume';

type Props = {
  templates: TemplateInfo[];
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
};

export function TemplateSelector({ templates, selectedTemplate, onSelect }: Props) {
  return (
    <section>
      <h2>1) Choose Template</h2>
      <div className="template-grid">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'active' : ''}`}
            onClick={() => onSelect(template.id)}
            type="button"
          >
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
