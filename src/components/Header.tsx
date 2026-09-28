import Button from './Button';
import SearchBar from './SearchBar';
import './Header.css';

interface HeaderProps {
  onAdd: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export default function Header({
  onAdd,
  search,
  onSearchChange,
  resultCount,
  totalCount,
}: HeaderProps) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Links Vault</span>
        </div>

        <nav className="navbar-links">
          <span className="nav-link active">All Links</span>
        </nav>

        <div className="navbar-actions">
          <div className="navbar-search">
            <SearchBar
              value={search}
              onChange={onSearchChange}
              resultCount={resultCount}
              totalCount={totalCount}
            />
          </div>

          <Button variant="primary" onClick={onAdd} className="navbar-add-btn">
            + Add Link
          </Button>
        </div>
      </div>
    </header>
  );
}