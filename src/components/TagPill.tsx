import './TagPill.css';

interface TagPillProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
}

// Small pill used for read-only tags on a card
// and for removable tags inside the add/edit form.
export default function TagPill({ label, onRemove, onClick, active }: TagPillProps) {
  return (
    <span
      className={`tag-pill ${onClick ? 'clickable' : ''} ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      #{label}
      {onRemove && (
        <button
          type="button"
          className="tag-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove tag ${label}`}
        >
          ✕
        </button>
      )}
    </span>
  );
}