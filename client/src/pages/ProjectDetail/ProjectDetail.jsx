import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/common/Header';
import { fetchProjects, updateProjectComment, suggestComment } from '../../services/api';
import './ProjectDetail.css';

function statusBadge(status) {
  return 'badge badge-' + status.toLowerCase();
}

function formatBudget(val) {
  const num = Number(val);
  if (!val || isNaN(num)) return '—';
  return num.toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const MAX_COMMENT_LENGTH = 500;

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProjects()
      .then((data) => {
        const found = data.find((p) => p.project_code === id);
        if (found) {
          setProject(found);
          setComment(found.comment || '');
        } else {
          setError('not_found');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSuggest = async () => {
    setSuggesting(true);
    try {
      const data = await suggestComment(project.project_code);
      if (comment.trim()) {
        setSuggestion(data.suggestion);
      } else {
        setComment(data.suggestion);
      }
    } catch {
      toast.error('Failed to generate suggestion.');
    } finally {
      setSuggesting(false);
    }
  };

  const commentTooLong = comment.length > MAX_COMMENT_LENGTH;

  const handleSaveComment = async () => {
    if (!comment.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    if (commentTooLong) {
      toast.error(`Comment exceeds ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }
    setSaving(true);
    try {
      await updateProjectComment(project.project_code, comment);
      setProject((prev) => ({ ...prev, comment }));
      toast.success('Comment saved successfully.');
    } catch {
      toast.error('Failed to save comment.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <Header />
        <div className="detail-body"><div className="loading-state">Loading…</div></div>
      </div>
    );
  }

  if (error === 'not_found' || !project) {
    return (
      <div className="detail-page">
        <Header />
        <div className="detail-body">
          <button className="detail-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeftIcon /> Back to Dashboard
          </button>
          <div className="detail-not-found">
            <h2>Project not found</h2>
            <p>No project with code &ldquo;{id}&rdquo; exists.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <Header />
        <div className="detail-body">
          <button className="detail-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeftIcon /> Back to Dashboard
          </button>
          <div className="error-state"><p>Failed to load project</p><span>{error}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Header />
      <div className="detail-body">
        <button className="detail-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeftIcon /> Back to Dashboard
        </button>

        <div className="detail-card">
          <div className="detail-card-header">
            <div>
              <h1>{project.project_name}</h1>
              <p className="detail-id">{project.project_code}</p>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-field">
              <span className="detail-field-label">Project Lead</span>
              <span className="detail-field-value">{project.project_lead_name}</span>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Budget</span>
              <span className="detail-field-value">{formatBudget(project.budget)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Status</span>
              <span className={statusBadge(project.status)}>{project.status}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Comment</h2>
            <textarea
              className={'detail-comment-input' + (commentTooLong ? ' detail-comment-input--error' : '')}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment…"
              maxLength={MAX_COMMENT_LENGTH + 50}
            />
            <div className={'comment-char-count' + (commentTooLong ? ' comment-char-count--over' : '')}>
              {comment.length}/{MAX_COMMENT_LENGTH}
            </div>
            {suggestion && (
              <div className="suggestion-preview">
                <span className="suggestion-preview__label">Suggested Comment</span>
                <p className="suggestion-preview__text">{suggestion}</p>
                <div className="suggestion-preview__actions">
                  <button
                    className="btn-use-suggestion"
                    onClick={() => { setComment(suggestion); setSuggestion(null); }}
                  >
                    Use Suggestion
                  </button>
                  <button
                    className="btn-dismiss-suggestion"
                    onClick={() => setSuggestion(null)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="detail-comment-actions">
              <button
                className="btn-suggest-comment"
                onClick={handleSuggest}
                disabled={suggesting}
              >
                {suggesting ? 'Suggesting…' : 'Suggest Comment'}
              </button>
              <button
                className="btn-save-comment"
                onClick={handleSaveComment}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Comment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
