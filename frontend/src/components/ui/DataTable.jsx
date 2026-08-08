import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Inbox, Loader2, Search } from 'lucide-react';

function getValue(row, key) {
  return key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), row);
}

export default function DataTable({
  columns,
  data,
  getRowId = (row) => row.id,
  searchPlaceholder = 'Search…',
  searchKeys,
  renderActions,
  loading = false,
  error = '',
  onRetry,
  emptyMessage = 'No records found.',
  pageSize = 10
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [page, setPage] = useState(1);

  const keysForSearch = searchKeys || columns.map((c) => c.key).filter(Boolean);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((row) =>
      keysForSearch.some((key) => String(getValue(row, key) ?? '').toLowerCase().includes(q))
    );
  }, [data, query, keysForSearch]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = getValue(a, sort.key);
      const bv = getValue(b, sort.key);
      if (av == null && bv == null) return 0;
      if (av == null) return -1;
      if (bv == null) return 1;
      if (typeof av === 'number' && typeof bv === 'number') return av - bv;
      return String(av).localeCompare(String(bv));
    });
    if (sort.dir === 'desc') copy.reverse();
    return copy;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (key) => {
    setPage(1);
    setSort((current) => {
      if (current.key !== key) return { key, dir: 'asc' };
      if (current.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: 'asc' };
    });
  };

  return (
    <div className="mt-6">
      <div className="relative max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="field pl-9"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="clay mt-4 overflow-hidden rounded-clay">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead
              className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400"
              style={{ background: 'var(--clay-surface-alt)' }}
            >
              <tr>
                {columns.map((col) => (
                  <th key={col.key || col.label} className="px-5 py-3 font-semibold">
                    {col.sortable === false || !col.key ? (
                      col.label
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 transition hover:text-slate-900 dark:hover:text-white"
                        onClick={() => toggleSort(col.key)}
                      >
                        {col.label}
                        {sort.key === col.key ? (
                          sort.dir === 'asc' ? (
                            <ArrowUp size={13} />
                          ) : (
                            <ArrowDown size={13} />
                          )
                        ) : (
                          <ArrowUpDown size={13} className="opacity-40" />
                        )}
                      </button>
                    )}
                  </th>
                ))}
                {renderActions && <th className="px-5 py-3 font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--clay-border)' }}>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-5 py-12 text-center text-slate-500">
                    <Loader2 size={20} className="mx-auto mb-2 animate-spin" />
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-5 py-12 text-center text-slate-500">
                    <AlertTriangle size={20} className="mx-auto mb-2 text-red-500" />
                    <p className="font-medium text-slate-700 dark:text-slate-200">{error}</p>
                    {onRetry && (
                      <button className="btn-ghost mt-3" onClick={onRetry}>
                        Try again
                      </button>
                    )}
                  </td>
                </tr>
              ) : pageRows.length ? (
                pageRows.map((row) => (
                  <tr key={getRowId(row)} className="align-top">
                    {columns.map((col) => (
                      <td key={col.key || col.label} className="max-w-xs px-5 py-3.5 text-slate-700 dark:text-slate-200">
                        {col.render ? col.render(row) : getValue(row, col.key)}
                      </td>
                    ))}
                    {renderActions && <td className="px-5 py-3.5">{renderActions(row)}</td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-5 py-12 text-center text-slate-500">
                    <Inbox size={20} className="mx-auto mb-2 opacity-50" />
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && sorted.length > pageSize && (
          <div
            className="flex items-center justify-between border-t px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400"
            style={{ borderColor: 'var(--clay-border)' }}
          >
            <span>
              Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="rounded-clay-sm px-2.5 py-1.5 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/5"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
              >
                Previous
              </button>
              <span>
                Page {safePage} of {totalPages}
              </span>
              <button
                className="rounded-clay-sm px-2.5 py-1.5 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/5"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
