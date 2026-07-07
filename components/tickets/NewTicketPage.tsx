'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { useTickets } from '@/contexts/TicketsContext';
import type { TicketType, TicketPriority } from '@/types/tickets';
import { TICKET_TYPES, TICKET_PRIORITIES, TYPE_RING, PRIORITY_RING, PILL_DEFAULT, INPUT_BASE } from './helpers';

export default function NewTicketPage() {
  const t      = useLocale();
  const tr     = t.tickets;
  const router = useRouter();
  const { addTicket } = useTickets();

  const [type,        setType]        = useState<TicketType>('support');
  const [priority,    setPriority]    = useState<TicketPriority>('medium');
  const [subject,     setSubject]     = useState('');
  const [description, setDescription] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [phone,       setPhone]       = useState('');
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!subject.trim())     e.subject     = tr.labels.subjectRequired;
    if (!description.trim()) e.description = tr.labels.descriptionRequired;
    if (!submittedBy.trim()) e.submittedBy = tr.labels.submittedByRequired;
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const id = addTicket({
      type, priority,
      subject: subject.trim(),
      description: description.trim(),
      submittedBy: submittedBy.trim(),
      phone: phone.trim() || undefined,
    });
    router.push(`/tickets/${id}`);
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">

      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <button
          type="button"
          onClick={() => router.push('/tickets')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
        >
          {tr.title}
        </button>
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span>{tr.newTicket}</span>
      </div>

      {/* form card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400" />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {tr.fields.type}
            </label>
            <div className="flex gap-2 flex-wrap">
              {TICKET_TYPES.map((tp) => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => setType(tp)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                    type === tp ? `${TYPE_RING[tp]} ring-2` : PILL_DEFAULT
                  }`}
                >
                  {tr.types[tp]}
                </button>
              ))}
            </div>
          </div>

          {/* priority */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {tr.fields.priority}
            </label>
            <div className="flex gap-2 flex-wrap">
              {TICKET_PRIORITIES.map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setPriority(pr)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                    priority === pr ? `${PRIORITY_RING[pr]} ring-2` : PILL_DEFAULT
                  }`}
                >
                  {tr.priorities[pr]}
                </button>
              ))}
            </div>
          </div>

          {/* subject */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {tr.fields.subject}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: '' })); }}
              placeholder={tr.placeholders.subject}
              className={`${INPUT_BASE} ${errors.subject ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'}`}
            />
            {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
          </div>

          {/* submittedBy + phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {tr.fields.submittedBy}
              </label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => { setSubmittedBy(e.target.value); setErrors((p) => ({ ...p, submittedBy: '' })); }}
                placeholder={tr.placeholders.submittedBy}
                className={`${INPUT_BASE} ${errors.submittedBy ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'}`}
              />
              {errors.submittedBy && <p className="text-xs text-rose-500 mt-1">{errors.submittedBy}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {tr.fields.phone}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tr.placeholders.phone}
                className={`${INPUT_BASE} border-slate-200 dark:border-slate-600`}
              />
            </div>
          </div>

          {/* description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {tr.fields.description}
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
              placeholder={tr.placeholders.description}
              rows={6}
              className={`${INPUT_BASE} resize-none ${errors.description ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'}`}
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => router.push('/tickets')}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {tr.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              {tr.submit}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
