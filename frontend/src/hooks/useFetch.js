import { useEffect, useState } from 'react';

export function useFetch(request, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);

    request()
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [request]);

  return { data, setData, loading, error };
}
