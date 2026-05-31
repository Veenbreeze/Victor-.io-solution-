import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Inbox, LayoutDashboard, Trash2, Users } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { adminService, messageService, portfolioService, serviceService, userService } from '../services/api.js';
import { formatDate, getErrorMessage } from '../utils/format.js';

const emptyService = { title: '', description: '', icon: 'Sparkles', price: '', is_featured: false };
const emptyPortfolio = { title: '', description: '', image_url: '', technologies: '', github_url: '', live_url: '' };

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ users: 0, services: 0, portfolio: 0, messages: 0 });
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [messages, setMessages] = useState([]);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [portfolioForm, setPortfolioForm] = useState(emptyPortfolio);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes, servicesRes, portfolioRes, messagesRes] = await Promise.all([
        adminService.stats(),
        userService.list(),
        serviceService.list(),
        portfolioService.list(),
        messageService.list()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setServices(servicesRes.data);
      setPortfolio(portfolioRes.data);
      setMessages(messagesRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createService = async (event) => {
    event.preventDefault();
    try {
      const { data } = await serviceService.create(serviceForm);
      setServices((current) => [data, ...current]);
      setServiceForm(emptyService);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const createPortfolio = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...portfolioForm,
        technologies: portfolioForm.technologies.split(',').map((item) => item.trim()).filter(Boolean)
      };
      const { data } = await portfolioService.create(payload);
      setPortfolio((current) => [data, ...current]);
      setPortfolioForm(emptyPortfolio);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const remove = async (kind, id) => {
    try {
      if (kind === 'user') {
        await userService.remove(id);
        setUsers((current) => current.filter((item) => item.id !== id));
      }
      if (kind === 'service') {
        await serviceService.remove(id);
        setServices((current) => current.filter((item) => item.id !== id));
      }
      if (kind === 'portfolio') {
        await portfolioService.remove(id);
        setPortfolio((current) => current.filter((item) => item.id !== id));
      }
      if (kind === 'message') {
        await messageService.remove(id);
        setMessages((current) => current.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const tabs = [
    ['overview', LayoutDashboard, 'Overview'],
    ['users', Users, 'Users'],
    ['services', BriefcaseBusiness, 'Services'],
    ['portfolio', BriefcaseBusiness, 'Portfolio'],
    ['messages', Inbox, 'Messages']
  ];

  if (loading) return <LoadingSpinner label="Loading admin workspace" />;

  return (
    <section className="py-12">
      <div className="container-pad">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-950 dark:text-white">Manage Veenbreeze operations</h1>
          </div>
          <button className="btn-secondary" onClick={loadData}>Refresh data</button>
        </div>

        {error && <p className="mt-6 rounded-md bg-coral/10 p-4 text-sm font-semibold text-coral">{error}</p>}

        <div className="mt-8 flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
          {tabs.map(([key, Icon, label]) => (
            <button
              key={key}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition ${
                activeTab === key ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stats).map(([label, value]) => (
              <article key={label} className="glass rounded-lg p-6">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-4 text-4xl font-black text-brand-700 dark:text-brand-100">{value}</p>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <DataTable
            columns={['Name', 'Email', 'Role', 'Created', 'Action']}
            rows={users.map((user) => [
              user.name,
              user.email,
              user.role,
              formatDate(user.created_at),
              <DeleteButton onClick={() => remove('user', user.id)} />
            ])}
          />
        )}

        {activeTab === 'services' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
            <form className="glass rounded-lg p-6" onSubmit={createService}>
              <h2 className="font-bold">Create service</h2>
              <div className="mt-5 grid gap-3">
                <input className="field" placeholder="Title" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required />
                <input className="field" placeholder="Icon name" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} />
                <input className="field" placeholder="Price" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} />
                <textarea className="field min-h-28" placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} required />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={serviceForm.is_featured} onChange={(e) => setServiceForm({ ...serviceForm, is_featured: e.target.checked })} />
                  Featured
                </label>
                <button className="btn-primary">Add service</button>
              </div>
            </form>
            <DataTable
              columns={['Title', 'Price', 'Featured', 'Action']}
              rows={services.map((service) => [
                service.title,
                service.price,
                service.is_featured ? 'Yes' : 'No',
                <DeleteButton onClick={() => remove('service', service.id)} />
              ])}
            />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
            <form className="glass rounded-lg p-6" onSubmit={createPortfolio}>
              <h2 className="font-bold">Create portfolio item</h2>
              <div className="mt-5 grid gap-3">
                <input className="field" placeholder="Title" value={portfolioForm.title} onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })} required />
                <input className="field" placeholder="Image URL" value={portfolioForm.image_url} onChange={(e) => setPortfolioForm({ ...portfolioForm, image_url: e.target.value })} />
                <input className="field" placeholder="Technologies, comma separated" value={portfolioForm.technologies} onChange={(e) => setPortfolioForm({ ...portfolioForm, technologies: e.target.value })} />
                <input className="field" placeholder="GitHub URL" value={portfolioForm.github_url} onChange={(e) => setPortfolioForm({ ...portfolioForm, github_url: e.target.value })} />
                <input className="field" placeholder="Live URL" value={portfolioForm.live_url} onChange={(e) => setPortfolioForm({ ...portfolioForm, live_url: e.target.value })} />
                <textarea className="field min-h-28" placeholder="Description" value={portfolioForm.description} onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })} required />
                <button className="btn-primary">Add project</button>
              </div>
            </form>
            <DataTable
              columns={['Title', 'Technologies', 'Action']}
              rows={portfolio.map((item) => [
                item.title,
                (item.technologies || []).join(', '),
                <DeleteButton onClick={() => remove('portfolio', item.id)} />
              ])}
            />
          </div>
        )}

        {activeTab === 'messages' && (
          <DataTable
            columns={['Name', 'Email', 'Subject', 'Message', 'Action']}
            rows={messages.map((message) => [
              message.name,
              message.email,
              message.subject,
              message.message,
              <DeleteButton onClick={() => remove('message', message.id)} />
            ])}
          />
        )}
      </div>
    </section>
  );
}

function DeleteButton({ onClick }) {
  return (
    <button className="inline-flex rounded-md bg-coral/10 p-2 text-coral transition hover:bg-coral hover:text-white" onClick={onClick} aria-label="Delete record">
      <Trash2 size={16} />
    </button>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-bold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.length ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="max-w-xs px-5 py-4 align-top text-slate-700 dark:text-slate-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-8 text-center text-slate-500" colSpan={columns.length}>No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
