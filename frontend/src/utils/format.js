export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function getErrorMessage(error) {
  if (error?.code === 'ECONNABORTED') {
    return 'The server is taking too long to respond (it may be waking up after being idle). Please try again in a moment.';
  }
  if (!error?.response && error?.request) {
    return 'Could not reach the server. Check your connection and try again.';
  }
  return error?.response?.data?.message || error?.message || 'Something went wrong';
}
