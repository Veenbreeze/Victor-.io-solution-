import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { userService } from '../../services/api.js';
import { formatDate, getErrorMessage } from '../../utils/format.js';
import PageHeader from '../../components/admin/PageHeader.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await userService.list();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (user, role) => {
    if (role === user.role) return;
    try {
      const { data } = await userService.update(user.id, { role });
      setUsers((current) => current.map((u) => (u.id === data.id ? data : u)));
      toast({ type: 'success', message: `${user.name} is now ${role}.` });
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await userService.remove(pendingDelete.id);
      setUsers((current) => current.filter((u) => u.id !== pendingDelete.id));
      toast({ type: 'success', message: `${pendingDelete.name} was deleted.` });
      setPendingDelete(null);
    } catch (err) {
      toast({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <PageHeader title="Users" description="Everyone with an account on Victor.io Solutions." />

      <DataTable
        loading={loading}
        error={error}
        onRetry={load}
        data={users}
        searchPlaceholder="Search users…"
        searchKeys={['name', 'email', 'role']}
        emptyMessage="No users found."
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          {
            key: 'role',
            label: 'Role',
            render: (row) => (
              <select
                className="rounded-clay-sm border bg-transparent px-2 py-1 text-xs font-semibold"
                style={{ borderColor: 'var(--clay-border)' }}
                value={row.role}
                onChange={(e) => changeRole(row, e.target.value)}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            )
          },
          {
            key: 'created_at',
            label: 'Joined',
            render: (row) => formatDate(row.created_at)
          },
          {
            key: 'provider',
            label: 'Provider',
            render: (row) => <Badge tone="neutral">{row.provider || 'email'}</Badge>
          }
        ]}
        renderActions={(row) => (
          <button
            className="inline-flex rounded-clay-sm bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white dark:bg-red-950/30"
            onClick={() => setPendingDelete(row)}
            aria-label={`Delete ${row.name}`}
          >
            <Trash2 size={15} />
          </button>
        )}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete user"
        description={`This permanently removes ${pendingDelete?.name}'s account. This cannot be undone.`}
        confirmLabel="Delete user"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
