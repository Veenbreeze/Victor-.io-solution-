import { useEffect, useState } from 'react';
import { Archive, MailOpen, Trash2 } from 'lucide-react';
import { messageService } from '../../services/api.js';
import { formatDate, getErrorMessage } from '../../utils/format.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const STATUS_TONE = { new: 'brand', read: 'neutral', archived: 'warning' };

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const { can } = useAuth();
  const canDelete = can('messages.delete');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await messageService.list();
      setMessages(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (row, status) => {
    try {
      const { data } = await messageService.updateStatus(row.id, status);
      setMessages((current) => current.map((m) => (m.id === data.id ? data : m)));
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await messageService.remove(pendingDelete.id);
      setMessages((current) => current.filter((m) => m.id !== pendingDelete.id));
      toast({ type: 'success', message: 'Message deleted.' });
      setPendingDelete(null);
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <PageHeader title="Messages" description="Inbound inquiries submitted through the Contact page." />

      <DataTable
        loading={loading}
        error={error}
        onRetry={load}
        data={messages}
        searchPlaceholder="Search messages…"
        searchKeys={['name', 'email', 'subject', 'message']}
        emptyMessage="No messages yet."
        columns={[
          { key: 'name', label: 'From', render: (row) => `${row.name} (${row.email})` },
          { key: 'subject', label: 'Subject' },
          {
            key: 'message',
            label: 'Message',
            sortable: false,
            render: (row) => <span className="line-clamp-2">{row.message}</span>
          },
          {
            key: 'status',
            label: 'Status',
            render: (row) => <Badge tone={STATUS_TONE[row.status] || 'neutral'}>{row.status}</Badge>
          },
          { key: 'created_at', label: 'Received', render: (row) => formatDate(row.created_at) }
        ]}
        renderActions={(row) => (
          <div className="flex items-center gap-1.5">
            {row.status !== 'read' && (
              <button
                className="rounded-clay-sm p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/5"
                onClick={() => setStatus(row, 'read')}
                aria-label="Mark as read"
                title="Mark as read"
              >
                <MailOpen size={15} />
              </button>
            )}
            {row.status !== 'archived' && (
              <button
                className="rounded-clay-sm p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/5"
                onClick={() => setStatus(row, 'archived')}
                aria-label="Archive"
                title="Archive"
              >
                <Archive size={15} />
              </button>
            )}
            {canDelete && (
              <button
                className="inline-flex rounded-clay-sm bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white dark:bg-red-950/30"
                onClick={() => setPendingDelete(row)}
                aria-label={`Delete message from ${row.name}`}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message"
        description={`This permanently deletes the message from ${pendingDelete?.name}.`}
        confirmLabel="Delete message"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
