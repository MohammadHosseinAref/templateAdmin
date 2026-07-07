'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useTickets } from '@/contexts/TicketsContext';
import type { TicketType, TicketPriority, NewTicketFormProps } from '@/types/tickets';

import { TICKET_TYPES, TICKET_PRIORITIES, TYPE_COLORS, PRIORITY_COLORS } from './helpers';

export default function NewTicketForm({ onCreated, onCancel }: NewTicketFormProps) {
  const t  = useLocale();
  const tr = t.tickets;
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
    const id = addTicket({ type, priority, subject: subject.trim(), description: description.trim(), submittedBy: submittedBy.trim(), phone: phone.trim() || undefined });
    onCreated(id);
  }


  return (
    <div className="flex flex-col h-full">

      {/* header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex-shrink-0 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">{tr.newTicket}</h3>
        <button type="button" onClick={onCancel} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          {tr.cancel}
        </button>
      </div>

      {/* form */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          {/* type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tr.fields.type}</label>
            <div className="flex gap-2 flex-wrap">
              {TICKET_TYPES.map((tp: TicketType) => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => setType(tp)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    type === tp
                      ? `${TYPE_COLORS[tp]} ring-2`
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tr.types[tp]}
                </button>
              ))}
            </div>
          </div>

          {/* priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tr.fields.priority}</label>
            <div className="flex gap-2 flex-wrap">
              {TICKET_PRIORITIES.map((pr: TicketPriority) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setPriority(pr)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    priority === pr
                      ? `${PRIORITY_COLORS[pr]} ring-2`
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tr.priorities[pr]}
                </button>
              ))}
            </div>
          </div>

          {/* subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tr.fields.subject}</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: '' })); }}
              placeholder={tr.placeholders.subject}
              className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                errors.subject ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.subject && <p className="text-xs text-rose-500">{errors.subject}</p>}
          </div>

          {/* submittedBy + phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tr.fields.submittedBy}</label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => { setSubmittedBy(e.target.value); setErrors((p) => ({ ...p, submittedBy: '' })); }}
                placeholder={tr.placeholders.submittedBy}
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                  errors.submittedBy ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
                }`}
              />
              {errors.submittedBy && <p className="text-xs text-rose-500">{errors.submittedBy}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tr.fields.phone}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tr.placeholders.phone}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tr.fields.description}</label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
              placeholder={tr.placeholders.description}
              rows={5}
              className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none ${
                errors.description ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            {tr.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
