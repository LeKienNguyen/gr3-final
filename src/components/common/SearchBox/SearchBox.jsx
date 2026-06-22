import './SearchBox.css';

const SearchIcon = () => (
  <svg className="search-box__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const SearchBox = ({
  value = '',
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
}) => (
  <div className={`search-box ${className}`}>
    <SearchIcon />
    <input
      type="text"
      className="search-box__input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
    {value && (
      <button
        className="search-box__clear"
        onClick={() => onChange('')}
        aria-label="Xóa tìm kiếm"
      >
        ×
      </button>
    )}
  </div>
);
