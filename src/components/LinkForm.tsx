import { useState } from 'react';
import type { FormEvent } from 'react';
import type { LinkDraft, LinkItem } from '../types/index.ts';
import Button from './Button.tsx';
import TagPill from './TagPill.tsx';
import './LinkForm.css';

interface LinkFormProps {
  initial?: LinkItem;
  onSubmit: (draft: LinkDraft) => void;
  onCancel: () => void;
}

// One form reused for creating and editing a link.
export default function LinkForm({ initial, onSubmit, onCancel }: LinkFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [url, setUrl] = useState(initial?.url ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  const addTag = () => {
    const clean = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const isValidUrl = (value: string) => {
    try {
      new URL(value.match(/^https?:\/\//) ? value : `https://${value}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: { title?: string; url?: string } = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    if (!url.trim()) nextErrors.url = 'Link URL is required';
    else if (!isValidUrl(url.trim())) nextErrors.url = 'Enter a valid URL';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const normalizedUrl = url.match(/^https?:\/\//) ? url.trim() : `https://${url.trim()}`;

    onSubmit({
      title: title.trim(),
      url: normalizedUrl,
      description: description.trim(),
      tags,
    });
  };

  return (
    <form className="link-form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. React Documentation"
          autoFocus
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label className="field">
        <span>Link (URL)</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g. https://react.dev"
        />
        {errors.url && <span className="field-error">{errors.url}</span>}
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this link about?"
          rows={3}
        />
      </label>

      <label className="field">
        <span>Tags (optional)</span>
        <div className="tag-input-row">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Type a tag and press Enter"
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="tag-list">
            {tags.map((tag) => (
              <TagPill key={tag} label={tag} onRemove={() => removeTag(tag)} />
            ))}
          </div>
        )}
      </label>

      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initial ? 'Save Changes' : 'Save Link'}
        </Button>
      </div>
    </form>
  );
}