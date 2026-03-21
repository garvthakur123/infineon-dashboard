import './Pagination.css';

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

const PER_PAGE_OPTIONS = [10, 15, 20];

function buildPageRange(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  pages.push(1);

  if (currentPage > 3) pages.push('…');

  const start = Math.max(2, currentPage - 1);
  const end   = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (currentPage < totalPages - 2) pages.push('…');

  pages.push(totalPages);
  return pages;
}

function Pagination({
  totalItems,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startItem  = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem    = Math.min(currentPage * rowsPerPage, totalItems);

  const pages = buildPageRange(currentPage, totalPages);

  return (
    <div className="pagination">
      <span className="pagination__info">
        Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems}</strong> projects
      </span>

      <div className="pagination__controls">
        <div className="pagination__per-page">
          <span className="pagination__per-page-label">Rows per page</span>
          <select
            className="pagination__per-page-select"
            value={rowsPerPage}
            onChange={(e) => onRowsChange(Number(e.target.value))}
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="pagination__pages">
          <button
            className="pagination__btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>

          {pages.map((p, i) =>
            p === '…' ? (
              <span key={'e' + i} className="pagination__ellipsis">…</span>
            ) : (
              <button
                key={p}
                className={
                  'pagination__btn' + (p === currentPage ? ' pagination__btn--active' : '')
                }
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="pagination__btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
