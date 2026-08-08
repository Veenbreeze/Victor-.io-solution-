import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { serviceService } from '../../services/api.js';
import { getErrorMessage } from '../../utils/format.js';
import { availableIconNames } from '../../utils/iconResolver.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

const emptyService = { title: '', description: '', icon: 'Sparkles', price: '', is_featured: false };

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await serviceService.list();
      setServices(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createService = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await serviceService.create(form);
      setServices((current) => [data, ...current]);
      setForm(emptyService);
      toast({ type: 'success', message: `Service "${data.title}" created.` });
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
      await serviceService.remove(pendingDelete.id);
      setServices((current) => current.filter((s) => s.id !== pendingDelete.id));
      toast({ type: 'success', message: `Service "${pendingDelete.title}" deleted.` });
      setPendingDelete(null);
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <PageHeader title="Services" description="The service catalog shown on the public Services page." />

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <form className="card-elevated p-6" onSubmit={createService}>
          <h2 className="font-semibold text-slate-950 dark:text-white">Create service</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            New services appear instantly on the homepage.
          </p>
          <div className="mt-5 grid gap-3">
            <div>
              <label className="field-label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className="field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Icon</label>
              <select className="field" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {availableIconNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Price</label>
              <input
                className="field"
                placeholder="e.g. From Tsh. 500,000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
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
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              Featured
            </label>
            <button className="btn-primary" disabled={saving}>
              {saving ? 'Adding…' : 'Add service'}
            </button>
          </div>
        </form>

        <DataTable
          loading={loading}
          error={error}
          onRetry={load}
          data={services}
          searchPlaceholder="Search services…"
          searchKeys={['title', 'price']}
          emptyMessage="No services yet. Add your first one."
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'price', label: 'Price' },
            {
              key: 'is_featured',
              label: 'Featured',
              render: (row) => (row.is_featured ? <Badge tone="success">Featured</Badge> : <Badge>Standard</Badge>)
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
        title="Delete service"
        description={`"${pendingDelete?.title}" will be removed from the public site.`}
        confirmLabel="Delete service"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
