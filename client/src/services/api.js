const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchProjects({ limit, offset, search, status } = {}) {
  const params = new URLSearchParams();
  if (limit !== undefined) params.set('limit', limit);
  if (offset !== undefined) params.set('offset', offset);
  if (search) params.set('search', search);
  if (status && status !== 'All') params.set('status', status);

  const query = params.toString();
  const url = `${BASE_URL}/projects${query ? '?' + query : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`);
  return res.json();
}

export async function suggestComment(projectCode) {
  const res = await fetch(`${BASE_URL}/projects/${projectCode}/comment-suggestion`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Failed to generate suggestion (${res.status})`);
  return res.json();
}

export async function updateProjectComment(projectCode, comment) {
  const res = await fetch(`${BASE_URL}/projects/${projectCode}/comment`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) throw new Error(`Failed to save comment (${res.status})`);
  return res.json();
}
