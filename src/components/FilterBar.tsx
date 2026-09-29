import { useMemo, useState } from 'react';
import './FilterBar.css';

interface FilterBarProps {
  tags: string[]; // every tag across all saved links (with duplicates)
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (order: 'newest' | 'oldest') => void;
  totalCount: number;
}

const VISIBLE_LIMIT = 6;

export default function FilterBar({
  tags,
  activeTag,
  onSelectTag,
  sortOrder,
  onSortChange,
  totalCount,
}: FilterBarProps) {
  const [showAll, setShowAll] = useState(false);

  // Count how many links each tag appears on, sorted by count descending
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [tags]);

  const visibleTags = showAll ? tagCounts : tagCounts.slice(0, VISIBLE_LIMIT);
  const hiddenCount = tagCounts.length - visibleTags.length;

  if (tagCounts.length === 0) return null; // nothing to filter by yet

  return (
    <div className="filter-bar">
      <div className="filter-pills">
        <span className="filter-label">Filter</span>

        <button
          className={`filter-pill ${activeTag === null ? 'active' : ''}`}
          onClick={() => onSelectTag(null)}
        >
          All · {totalCount}
        </button>

        {visibleTags.map(([tag, count]) => (
          <button
            key={tag}
            className={`filter-pill ${activeTag === tag ? 'active' : ''}`}
            onClick={() => onSelectTag(tag)}
          >
            #{tag} · {count}
          </button>
        ))}

        {hiddenCount > 0 && (
          <button className="filter-pill more" onClick={() => setShowAll(true)}>
            … +{hiddenCount} more
          </button>
        )}
      </div>

      <select
        className="sort-select"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest')}
        aria-label="Sort links"
      >
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
      </select>
    </div>
  );
}