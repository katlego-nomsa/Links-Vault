import type { LinkItem } from '../types';
import LinkCard from './LinkCard';
import Button from './button';
import './LinkGrid.css';

interface LinkGridProps {
  links: LinkItem[];
  hasAnyLinks: boolean;
  onEdit: (link: LinkItem) => void;
  onDelete: (link: LinkItem) => void;
  onTagClick: (tag: string) => void;
  onAdd: () => void;
}

export default function LinkGrid({
  links,
  hasAnyLinks,
  onEdit,
  onDelete,
  onTagClick,
  onAdd,
}: LinkGridProps) {
  if (links.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">{hasAnyLinks ? '🔍' : '🗂️'}</span>
        <h3>{hasAnyLinks ? 'No matching links' : 'Your vault is empty'}</h3>
        <p>
          {hasAnyLinks
            ? 'Try a different search term or clear the search.'
            : 'Save your first link to start building your collection.'}
        </p>
        {!hasAnyLinks && (
          <Button variant="primary" onClick={onAdd}>
            + Add your first link
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="link-grid">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onEdit={() => onEdit(link)}
          onDelete={() => onDelete(link)}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}