const BASE = `${import.meta.env.VITE_API_URL}/api/tasks`;

async function request(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getWeeklySummary = () =>
  request(`${BASE}/summary/weekly?tz=${encodeURIComponent(timezone)}`);

export const getTasks = (params = {}) =>
  request(`${BASE}?${new URLSearchParams(params)}`);

export const createTask = (body) =>
  request(BASE, { method: 'POST', body: JSON.stringify(body) });

export const updateTask = (id, body) =>
  request(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteTask = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });