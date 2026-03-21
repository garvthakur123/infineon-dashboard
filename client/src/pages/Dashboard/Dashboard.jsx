import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Pagination from '../../components/ui/Pagination';
import { fetchProjects } from '../../services/api';
import './Dashboard.css';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function statusBadge(status) {
  return 'badge badge-' + status.toLowerCase();
}

function formatBudget(val) {
  const num = Number(val);
  if (!val || isNaN(num)) return '—';
  return num.toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProjects({
      limit: rowsPerPage,
      offset: (currentPage - 1) * rowsPerPage,
      search,
      status: statusFilter,
    })
      .then((data) => {
        if (!cancelled) {
          setProjects(data.items);
          setTotal(data.total);
          setStatuses(data.statuses);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [currentPage, rowsPerPage, search, statusFilter]);

  const statusOptions = ['All', ...statuses];

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-body">
        <div className="dashboard-header">
          <div>
            <h1>Project Dashboard</h1>
            <p className="dashboard-subtitle">Overview of all engineering projects</p>
          </div>
          <button className="btn-upload" type="button">
            <UploadIcon />
            Upload CSV
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="filters-card">
          <div className="filters-card__inner">
            <div className="filter-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by project name, code, or lead…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Project list ── */}
        <div className="list-section">
          {loading ? (
            <div className="loading-state">Loading projects…</div>
          ) : error ? (
            <div className="error-state">
              <p>Failed to load projects</p>
              <span>{error}</span>
            </div>
          ) : (
            <>
              <div className="list-header">
                <span className="list-header__col list-header__col--code">Code</span>
                <span className="list-header__col list-header__col--name">Project Name</span>
                <span className="list-header__col list-header__col--lead">Lead</span>
                <span className="list-header__col list-header__col--status">Status</span>
                <span className="list-header__col list-header__col--budget">Budget</span>
                <span className="list-header__col list-header__col--comment">Comment</span>
                <span className="list-header__col list-header__col--arrow" />
              </div>

              <div className="list-rows">
                {projects.length === 0 ? (
                  <div className="empty-state">No projects match your filters.</div>
                ) : (
                  projects.map((p) => (
                    <div
                      key={p.project_code}
                      className="list-row"
                      onClick={() => navigate(`/dashboard/${p.project_code}`)}
                    >
                      <div className="list-row__col list-row__col--code">{p.project_code}</div>
                      <div className="list-row__col list-row__col--name">
                        <span className="project-name">{p.project_name}</span>
                      </div>
                      <div className="list-row__col list-row__col--lead">{p.project_lead_name}</div>
                      <div className="list-row__col list-row__col--status">
                        <span className={statusBadge(p.status)}>{p.status}</span>
                      </div>
                      <div className="list-row__col list-row__col--budget">{formatBudget(p.budget)}</div>
                      <div className="list-row__col list-row__col--comment">
                        <span className="comment-text">{p.comment || '—'}</span>
                      </div>
                      <div className="list-row__col list-row__col--arrow"><ChevronRight /></div>
                    </div>
                  ))
                )}
              </div>

              <Pagination
                totalItems={total}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onRowsChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;