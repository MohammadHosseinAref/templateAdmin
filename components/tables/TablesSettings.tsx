'use client';

import { useState, useId } from 'react';
import type { TablesData, Scene } from '@/types/tables';
import { TABLES_DEFAULTS } from '@/types/tables';
import { useLocale } from '@/contexts/LocaleContext';
import { inputCls } from '@/components/ui/styles';
import FloorViewer from './FloorViewer';
import ScenePreviewModal from './ScenePreviewModal';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

let _idSeq = 0;
function makeId() { return `sc_${++_idSeq}`; }
function newDraft(): Scene { return { id: makeId(), name: '', imageUrl: '', tables: [], order: 0 }; }

function reorder(scenes: Scene[]): Scene[] {
  return scenes.map((s, i) => ({ ...s, order: i }));
}

type TLabels = ReturnType<typeof useLocale>['tables'];

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <circle cx="4" cy="2.5" r="1.2"/><circle cx="10" cy="2.5" r="1.2"/>
      <circle cx="4" cy="7"   r="1.2"/><circle cx="10" cy="7"   r="1.2"/>
      <circle cx="4" cy="11.5" r="1.2"/><circle cx="10" cy="11.5" r="1.2"/>
    </svg>
  );
}

function SortableSceneCard({ scene, editId, t, onEdit, onDelete }: {
  scene: Scene;
  editId: string | null;
  t: TLabels;
  onEdit: (scene: Scene) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scene.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
      className={`bg-white dark:bg-slate-800 rounded-2xl border overflow-hidden ${
        editId === scene.id
          ? 'border-teal-400 dark:border-teal-500 ring-2 ring-teal-400/30'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Header: drag handle + name + count */}
      <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
        <button
          type="button"
          aria-label="drag"
          className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 p-0.5"
          {...attributes}
          {...listeners}
        >
          <GripIcon />
        </button>
        <p className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
          {scene.name}
        </p>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
          {scene.tables.length} {t.labels.tableLabel}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="relative w-full bg-slate-900 overflow-hidden" style={{ aspectRatio: '16/7' }}>
        {scene.imageUrl ? (
          <img src={scene.imageUrl} alt={scene.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(scene)}
          className="flex-1 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {t.labels.editScene}
        </button>
        <button
          type="button"
          onClick={() => onDelete(scene.id)}
          className="px-3 py-2 text-xs rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          {t.labels.deleteScene}
        </button>
      </div>
    </div>
  );
}

export default function TablesSettings() {
  const t      = useLocale().tables;
  const nameId = useId();

  const [data,        setData]        = useState<TablesData>(TABLES_DEFAULTS);
  const [draft,       setDraft]       = useState<Scene>(newDraft());
  const [editId,      setEditId]      = useState<string | null>(null);
  const [saved,       setSaved]       = useState(false);
  const [globalSaved, setGlobalSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setData(d => {
      const oldIdx = d.scenes.findIndex(s => s.id === active.id);
      const newIdx = d.scenes.findIndex(s => s.id === over.id);
      return { ...d, scenes: reorder(arrayMove(d.scenes, oldIdx, newIdx)) };
    });
  }

  function handleSave() {
    const finalScene: Scene = {
      ...draft,
      name: draft.name.trim() || `${t.labels.scenes} ${data.scenes.length + 1}`,
    };
    if (editId) {
      setData(d => ({ ...d, scenes: reorder(d.scenes.map(s => s.id === editId ? finalScene : s)) }));
      setEditId(null);
    } else {
      const savedId = makeId();
      setData(d => ({ ...d, scenes: reorder([...d.scenes, { ...finalScene, id: savedId }]) }));
    }
    setDraft(newDraft());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function startEdit(scene: Scene) {
    setDraft({ ...scene });
    setEditId(scene.id);
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setDraft(newDraft());
    setEditId(null);
  }

  function deleteScene(id: string) {
    setData(d => ({ ...d, scenes: d.scenes.filter(s => s.id !== id) }));
    if (editId === id) { setDraft(newDraft()); setEditId(null); }
  }

  function navigate(id: string) {
    const target = data.scenes.find(s => s.id === id);
    if (target) startEdit(target);
  }

  return (
    <div className="px-3 pt-2 pb-8 space-y-4 max-w-4xl mx-auto w-full">

      {/* Scene name header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor={nameId} className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex-1">
            {editId ? t.labels.editScene : t.labels.newScene}
          </label>
          {editId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {t.labels.cancel}
            </button>
          )}
        </div>
        <input
          id={nameId}
          className={inputCls}
          value={draft.name}
          onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
          placeholder={t.labels.sceneNamePlaceholder}
        />
      </div>

      {/* Floor Viewer */}
      <FloorViewer
        scene={draft}
        allScenes={data.scenes}
        panoramaEnabled={data.panoramaEnabled}
        onChange={setDraft}
        onNavigate={navigate}
        onPanoramaToggle={v => setData(d => ({ ...d, panoramaEnabled: v }))}
        onSave={handleSave}
        saved={saved}
      />

      {/* Saved scenes list */}
      {data.scenes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <p className="flex-1 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {t.labels.savedScenes}
            </p>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              {t.labels.preview}
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.scenes.map(s => s.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.scenes.map(scene => (
                  <SortableSceneCard
                    key={scene.id}
                    scene={scene}
                    editId={editId}
                    t={t}
                    onEdit={startEdit}
                    onDelete={deleteScene}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Global save button */}
      {data.scenes.length > 0 && (
        <button
          type="button"
          onClick={() => {
            console.log(data);
            setGlobalSaved(true);
            setTimeout(() => setGlobalSaved(false), 2500);
          }}
          className={`w-full py-3 text-sm font-semibold rounded-2xl transition-colors ${globalSaved ? 'bg-green-500 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
        >
          {globalSaved ? `✓ ${t.labels.saved}` : t.labels.save}
        </button>
      )}

      {/* Preview modal */}
      {previewOpen && data.scenes.length > 0 && (
        <ScenePreviewModal
          scenes={data.scenes}
          onClose={() => setPreviewOpen(false)}
        />
      )}

    </div>
  );
}
