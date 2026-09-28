import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export default function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search by title, URL, description or tag…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search links"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
          ✕
        </button>
      )}
      {value && (
        <span className="search-count">
          {resultCount} of {totalCount}
        </span>
      )}
    </div>
  );
}