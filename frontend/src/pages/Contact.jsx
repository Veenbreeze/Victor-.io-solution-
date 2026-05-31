import { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import { messageService } from '../services/api.js';
import { getErrorMessage } from '../utils/format.js';

const initialState = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await messageService.send(form);
      setStatus('Message sent successfully. We will respond soon.');
      setForm(initialState);
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container-pad grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeader
            eyebrow="Contact"
            title="Tell us what you want to build, improve, or launch."
            description="Share the essentials and the team will follow up with the right next step."
          />
          <div className="mt-8 grid gap-4">
            <p className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Mail className="text-brand-600" size={20} /> hello@veenbreeze.com
            </p>
            <p className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <MapPin className="text-brand-600" size={20} /> Dar es Salaam, Tanzania
            </p>
          </div>
        </div>
        <form className="glass rounded-lg p-6" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="field" name="name" placeholder="Your name" value={form.name} onChange={update} required />
            <input className="field" name="email" type="email" placeholder="Email address" value={form.email} onChange={update} required />
          </div>
          <input className="field mt-4" name="subject" placeholder="Subject" value={form.subject} onChange={update} />
          <textarea
            className="field mt-4 min-h-40 resize-y"
            name="message"
            placeholder="Project details"
            value={form.message}
            onChange={update}
            required
          />
          {status && <p className="mt-4 text-sm font-semibold text-brand-700 dark:text-brand-100">{status}</p>}
          <button className="btn-primary mt-6 w-full" disabled={loading}>
            <Send size={18} /> {loading ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  );
}
