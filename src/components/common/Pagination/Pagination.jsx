import { useMemo } from 'react';
import './Pagination.css';

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const pages = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  return (
    <nav className={`pagination ${className}`} aria-label="Phân trang">
      <button
        className="pagination__button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Trang trước"
      >
        ‹
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={`pagination__button${page === currentPage ? ' pagination__button--active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Trang ${page}`}
          >
            {page}
          </button>
        ),
      )}

      <button
        className="pagination__button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Trang sau"
      >
        ›
      </button>

      <span className="pagination__info">
        Trang {currentPage} / {totalPages}
      </span>
    </nav>
  );
};
