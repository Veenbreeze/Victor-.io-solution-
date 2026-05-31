export function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Something went wrong';
}
