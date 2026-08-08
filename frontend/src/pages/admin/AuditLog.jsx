import { useEffect, useState } from 'react';
import { adminService } from '../../services/api.js';
import { formatDate, getErrorMessage } from '../../utils/format.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import Badge from '../../components/ui/Badge.jsx';

const ACTION_TONE = { CREATE: 'success', UPDATE: 'brand', DELETE: 'danger' };

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminService.auditLogs(150);
      setLogs(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <PageHeader
        title="Audit Log"
        description="An immutable record of who changed what, and when. Only visible to admins."
      />

      <DataTable
        loading={loading}
        error={error}
        onRetry={load}
        data={logs}
        getRowId={(row) => row.id}
        searchPlaceholder="Search audit log…"
        searchKeys={['actor_name', 'entity_type', 'entity_label', 'action']}
        emptyMessage="No admin actions recorded yet."
        pageSize={20}
        columns={[
          { key: 'actor_name', label: 'Actor' },
          {
            key: 'action',
            label: 'Action',
            render: (row) => <Badge tone={ACTION_TONE[row.action] || 'neutral'}>{row.action}</Badge>
          },
          {
            key: 'entity_type',
            label: 'Entity',
            render: (row) => (
              <span>
                <span className="capitalize">{row.entity_type}</span>
                {row.entity_label && <span className="text-slate-500"> — {row.entity_label}</span>}
              </span>
            )
          },
          {
            key: 'changes',
            label: 'Changes',
            sortable: false,
            render: (row) =>
              row.changes ? (
                <code className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {JSON.stringify(row.changes)}
                </code>
              ) : (
                '—'
              )
          },
          { key: 'created_at', label: 'When', render: (row) => formatDate(row.created_at) }
        ]}
      />
    </section>
  );
}
