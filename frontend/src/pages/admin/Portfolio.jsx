import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { portfolioService } from '../../services/api.js';
import { getErrorMessage } from '../../utils/format.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

const emptyPortfolio = { title: '', description: '', image_url: '', technologies: '', github_url: '', live_url: '' };

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyPortfolio);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await portfolioService.list();
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPortfolio = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      };
      const { data } = await portfolioService.create(payload);
      setItems((current) => [data, ...current]);
      setForm(emptyPortfolio);
      toast({ type: 'success', message: `Portfolio item "${data.title}" created.` });
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await portfolioService.remove(pendingDelete.id);
      setItems((current) => current.filter((i) => i.id !== pendingDelete.id));
      toast({ type: 'success', message: `"${pendingDelete.title}" deleted.` });
      setPendingDelete(null);
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <PageHeader title="Portfolio" description="Case studies shown on the public Portfolio page." />

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <form className="card-elevated p-6" onSubmit={createPortfolio}>
          <h2 className="font-semibold text-slate-950 dark:text-white">Add project</h2>
          <div className="mt-5 grid gap-3">
            <div>
              <label className="field-label">
                Title <span className="text-red-500">*</span>
              </label>
              <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Image URL</label>
              <input
                className="field"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Technologies</label>
              <input
                className="field"
                placeholder="Comma separated"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">GitHub URL</label>
              <input className="field" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Live URL</label>
              <input className="field" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
            </div>
            <div>
              <label className="field-label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="field min-h-28"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <button className="btn-primary" disabled={saving}>
              {saving ? 'Adding…' : 'Add project'}
            </button>
          </div>
        </form>

        <DataTable
          loading={loading}
          error={error}
          onRetry={load}
          data={items}
          searchPlaceholder="Search portfolio…"
          searchKeys={['title']}
          emptyMessage="No portfolio items yet."
          columns={[
            { key: 'title', label: 'Title' },
            {
              key: 'technologies',
              label: 'Technologies',
              sortable: false,
              render: (row) => (row.technologies || []).join(', ') || '—'
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
        title="Delete portfolio item"
        description={`"${pendingDelete?.title}" will be removed from the public site.`}
        confirmLabel="Delete item"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
