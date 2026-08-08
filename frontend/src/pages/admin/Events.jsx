import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { eventService } from '../../services/api.js';
import { formatDate, getErrorMessage } from '../../utils/format.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

const emptyEvent = {
  title: '',
  description: '',
  starts_at: '',
  ends_at: '',
  location: '',
  link_url: '',
  cover_url: '',
  is_active: true
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await eventService.list();
      setEvents(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createEvent = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null
      };
      const { data } = await eventService.create(payload);
      setEvents((current) => [data, ...current]);
      setForm(emptyEvent);
      toast({ type: 'success', message: `Event "${data.title}" created.` });
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (eventRow) => {
    try {
      const { data } = await eventService.update(eventRow.id, { is_active: !eventRow.is_active });
      setEvents((current) => current.map((e) => (e.id === data.id ? data : e)));
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await eventService.remove(pendingDelete.id);
      setEvents((current) => current.filter((e) => e.id !== pendingDelete.id));
      toast({ type: 'success', message: `Event "${pendingDelete.title}" deleted.` });
      setPendingDelete(null);
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <PageHeader title="Events" description="Announcements shown on the homepage." />

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <form className="card-elevated p-6" onSubmit={createEvent}>
          <h2 className="font-semibold text-slate-950 dark:text-white">Create event</h2>
          <div className="mt-5 grid gap-3">
            <div>
              <label className="field-label">
                Event title <span className="text-red-500">*</span>
              </label>
              <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label">
                  Starts at <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="field"
                  value={form.starts_at}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="field-label">Ends at</label>
                <input
                  type="datetime-local"
                  className="field"
                  value={form.ends_at}
                  onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="field-label">Location</label>
              <input className="field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Link URL</label>
              <input className="field" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Cover image URL</label>
              <input className="field" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Description</label>
              <textarea
                className="field min-h-24"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Active (visible on homepage)
            </label>
            <button className="btn-primary" disabled={saving}>
              {saving ? 'Adding…' : 'Add event'}
            </button>
          </div>
        </form>

        <DataTable
          loading={loading}
          error={error}
          onRetry={load}
          data={events}
          searchPlaceholder="Search events…"
          searchKeys={['title', 'location']}
          emptyMessage="No events yet."
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'starts_at', label: 'Starts', render: (row) => formatDate(row.starts_at) },
            { key: 'location', label: 'Location', render: (row) => row.location || '—' },
            {
              key: 'is_active',
              label: 'Status',
              render: (row) => (
                <button onClick={() => toggleActive(row)}>
                  {row.is_active ? <Badge tone="success">Active</Badge> : <Badge>Inactive</Badge>}
                </button>
              )
            }
          ]}
          renderActions={(row) => (
            <button
              className="inline-flex rounded-clay-sm bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white dark:bg-red-950/30"
              onClick={() => setPendingDelete(row)}
              aria-label={`Delete ${row.title}`}
            >
              <Trash2 size={15} />
            </button>
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete event"
        description={`"${pendingDelete?.title}" will be removed from the homepage.`}
        confirmLabel="Delete event"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
