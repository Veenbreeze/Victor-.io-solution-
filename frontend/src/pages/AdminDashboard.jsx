import { useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  CalendarDays,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Trash2,
  Users
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
  adminService,
  eventService,
  messageService,
  portfolioService,
  serviceService,
  userService
} from '../services/api.js';
import { formatDate, getErrorMessage } from '../utils/format.js';
import { availableIconNames } from '../utils/iconResolver.js';

const emptyService = { title: '', description: '', icon: 'Sparkles', price: '', is_featured: false };
const emptyPortfolio = { title: '', description: '', image_url: '', technologies: '', github_url: '', live_url: '' };
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [stats, setStats] = useState({ users: 0, services: 0, portfolio: 0, messages: 0 });
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [portfolioForm, setPortfolioForm] = useState(emptyPortfolio);
  const [eventForm, setEventForm] = useState(emptyEvent);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes, servicesRes, portfolioRes, messagesRes, eventsRes] = await Promise.all([
        adminService.stats(),
        userService.list(),
        serviceService.list(),
        portfolioService.list(),
        messageService.list(),
        eventService.list()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setServices(servicesRes.data);
      setPortfolio(portfolioRes.data);
      setMessages(messagesRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  const createService = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await serviceService.create(serviceForm);
      setServices((current) => [data, ...current]);
      setServiceForm(emptyService);
      flash(`Service "${data.title}" created.`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const createPortfolio = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const payload = {
        ...portfolioForm,
        technologies: portfolioForm.technologies
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      };
      const { data } = await portfolioService.create(payload);
      setPortfolio((current) => [data, ...current]);
      setPortfolioForm(emptyPortfolio);
      flash(`Portfolio item "${data.title}" created.`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const createEvent = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const payload = {
        ...eventForm,
        starts_at: eventForm.starts_at ? new Date(eventForm.starts_at).toISOString() : null,
        ends_at: eventForm.ends_at ? new Date(eventForm.ends_at).toISOString() : null
      };
      const { data } = await eventService.create(payload);
      setEvents((current) => [data, ...current]);
      setEventForm(emptyEvent);
      flash(`Event "${data.title}" created and now showing on the homepage.`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const toggleEventActive = async (eventRow) => {
    try {
      const { data } = await eventService.update(eventRow.id, { is_active: !eventRow.is_active });
      setEvents((current) => current.map((e) => (e.id === data.id ? data : e)));
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
      if (kind === 'event') {
        await eventService.remove(id);
        setEvents((current) => current.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const tabs = [
    ['overview', LayoutDashboard, 'Overview'],
    ['users', Users, 'Users'],
    ['services', BriefcaseBusiness, 'Services'],
    ['portfolio', ImageIcon, 'Portfolio'],
    ['events', CalendarDays, 'Events'],
    ['messages', Inbox, 'Messages']
  ];

  if (loading) return <LoadingSpinner label="Loading admin workspace" />;

  return (
    <section className="py-12">
      <div className="container-pad">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Manage Veenbreeze operations
            </h1>
          </div>
          <button className="btn-secondary" onClick={loadData}>
            Refresh data
          </button>
        </div>

        {notice && (
          <p className="mt-6 rounded-xl border border-brand-300/40 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 dark:border-brand-900/40 dark:bg-brand-900/20 dark:text-brand-200">
            {notice}
          </p>
        )}
        {error && (
          <p className="mt-6 rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
            {error}
          </p>
        )}

        <div className="mt-8 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
          {tabs.map(([key, Icon, label]) => (
            <button
              key={key}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                activeTab === key
                  ? 'bg-brand-gradient text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
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
              <article key={label} className="stat-tile">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <p className="mt-4 text-4xl font-black text-slate-950 dark:text-white">{value}</p>
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
            <form className="card-elevated p-6" onSubmit={createService}>
              <h2 className="font-bold text-slate-950 dark:text-white">Create service</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                New services appear instantly in the homepage Services section.
              </p>
              <div className="mt-5 grid gap-3">
                <input
                  className="field"
                  placeholder="Title"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  required
                />
                <select
                  className="field"
                  value={serviceForm.icon}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                >
                  {availableIconNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <input
                  className="field"
                  placeholder="Price (e.g. From Tsh. 500,000)"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                />
                <textarea
                  className="field min-h-28"
                  placeholder="Description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={serviceForm.is_featured}
                    onChange={(e) => setServiceForm({ ...serviceForm, is_featured: e.target.checked })}
                  />
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
            <form className="card-elevated p-6" onSubmit={createPortfolio}>
              <h2 className="font-bold text-slate-950 dark:text-white">Create portfolio item</h2>
              <div className="mt-5 grid gap-3">
                <input
                  className="field"
                  placeholder="Title"
                  value={portfolioForm.title}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  required
                />
                <input
                  className="field"
                  placeholder="Image URL"
                  value={portfolioForm.image_url}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, image_url: e.target.value })}
                />
                <input
                  className="field"
                  placeholder="Technologies, comma separated"
                  value={portfolioForm.technologies}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, technologies: e.target.value })}
                />
                <input
                  className="field"
                  placeholder="GitHub URL"
                  value={portfolioForm.github_url}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, github_url: e.target.value })}
                />
                <input
                  className="field"
                  placeholder="Live URL"
                  value={portfolioForm.live_url}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, live_url: e.target.value })}
                />
                <textarea
                  className="field min-h-28"
                  placeholder="Description"
                  value={portfolioForm.description}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                  required
                />
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

        {activeTab === 'events' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[400px_1fr]">
            <form className="card-elevated p-6" onSubmit={createEvent}>
              <h2 className="font-bold text-slate-950 dark:text-white">Create event</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Active events pop up on the homepage and appear in the Upcoming Events section.
              </p>
              <div className="mt-5 grid gap-3">
                <input
                  className="field"
                  placeholder="Event title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Starts at</label>
                    <input
                      type="datetime-local"
                      className="field"
                      value={eventForm.starts_at}
                      onChange={(e) => setEventForm({ ...eventForm, starts_at: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label">Ends at (optional)</label>
                    <input
                      type="datetime-local"
                      className="field"
                      value={eventForm.ends_at}
                      onChange={(e) => setEventForm({ ...eventForm, ends_at: e.target.value })}
                    />
                  </div>
                </div>
                <input
                  className="field"
                  placeholder="Location (optional)"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                />
                <input
                  className="field"
                  placeholder="Link URL (optional)"
                  value={eventForm.link_url}
                  onChange={(e) => setEventForm({ ...eventForm, link_url: e.target.value })}
                />
                <input
                  className="field"
                  placeholder="Cover image URL (optional)"
                  value={eventForm.cover_url}
                  onChange={(e) => setEventForm({ ...eventForm, cover_url: e.target.value })}
                />
                <textarea
                  className="field min-h-24"
                  placeholder="Short description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={eventForm.is_active}
                    onChange={(e) => setEventForm({ ...eventForm, is_active: e.target.checked })}
                  />
                  Active (visible on homepage)
                </label>
                <button className="btn-primary">Add event</button>
              </div>
            </form>

            <DataTable
              columns={['Title', 'Starts', 'Location', 'Active', 'Action']}
              rows={events.map((evt) => [
                evt.title,
                formatDate(evt.starts_at),
                evt.location || '—',
                <button
                  key={`toggle-${evt.id}`}
                  onClick={() => toggleEventActive(evt)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                    evt.is_active
                      ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {evt.is_active ? 'On' : 'Off'}
                </button>,
                <DeleteButton onClick={() => remove('event', evt.id)} />
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
    <button
      className="inline-flex rounded-md bg-coral/10 p-2 text-coral transition hover:bg-coral hover:text-white"
      onClick={onClick}
      aria-label="Delete record"
    >
      <Trash2 size={16} />
    </button>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-bold">
                  {column}
                </th>
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
                <td className="px-5 py-8 text-center text-slate-500" colSpan={columns.length}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
