import type { LinkItem } from '../types';
import TagPill from './TagPill';
import './LinkCard.css';

interface LinkCardProps {
  link: LinkItem;
  onEdit: () => void;
  onDelete: () => void;
  onTagClick: (tag: string) => void;
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export default function LinkCard({ link, onEdit, onDelete, onTagClick }: LinkCardProps) {
  return (
    <article className="link-card">
      <div className="link-card-top">
        <img
          className="favicon"
          src={`https://www.google.com/s2/favicons?sz=64&domain=${hostname(link.url)}`}
          alt=""
          onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
        />
        <div className="link-card-titles">
          <a href={link.url} target="_blank" rel="noreferrer" className="link-title">
            {link.title}
          </a>
          <a href={link.url} target="_blank" rel="noreferrer" className="link-host">
            {hostname(link.url)} ↗
          </a>
        </div>
      </div>

      {link.description && <p className="link-desc">{link.description}</p>}

      {link.tags.length > 0 && (
        <div className="link-tags">
          {link.tags.map((tag) => (
            <TagPill key={tag} label={tag} onClick={() => onTagClick(tag)} />
          ))}
        </div>
      )}

      <div className="link-card-actions">
        <button className="link-action" onClick={onEdit}>
          Edit
        </button>
        <button className="link-action danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}