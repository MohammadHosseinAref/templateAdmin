'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import type { Scene, TableItem } from '@/types/tables';
import { useLocale } from '@/contexts/LocaleContext';

interface Props {
  scenes: Scene[];
  startIndex?: number;
  onClose: () => void;
}

export default function ScenePreviewModal({ scenes, startIndex = 0, onClose }: Props) {
  const t = useLocale().tables;

  const [currentIdx, setCurrentIdx] = useState(startIndex);
  const [infoTable,  setInfoTable]  = useState<TableItem | null>(null);

  const scene = scenes[currentIdx] ?? scenes[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const txRef  = useRef(0);
  const tyRef  = useRef(0);
  const zoomRef = useRef(1);
  const drag   = useRef({ on: false, sx: 0, sy: 0, stx: 0, sty: 0, lx: 0, ly: 0, vx: 0, vy: 0, raf: 0, moved: false });
  const pinch  = useRef({ on: false, dist: 0, sz: 1 });
  const uiTouchRef = useRef(false);

  function applyTransform() {
    const w = wrapRef.current; if (!w) return;
    w.style.transform = `translate(${txRef.current}px,${tyRef.current}px) scale(${zoomRef.current})`;
  }

  function clampView() {
    const box = containerRef.current, wrap = wrapRef.current; if (!box || !wrap) return;
    const ww = (parseInt(wrap.style.width,  10) || 0) * zoomRef.current;
    const wh = (parseInt(wrap.style.height, 10) || 0) * zoomRef.current;
    const cw = box.clientWidth, ch = box.clientHeight;
    txRef.current = ww <= cw ? (cw - ww) / 2 : Math.max(cw - ww, Math.min(0, txRef.current));
    tyRef.current = wh <= ch ? (ch - wh) / 2 : Math.max(ch - wh, Math.min(0, tyRef.current));
  }

  function resetView() {
    const img = imgRef.current, box = containerRef.current, wrap = wrapRef.current;
    if (!img || !box || !wrap || !img.naturalWidth || !box.clientWidth) return;
    const s = box.clientWidth / img.naturalWidth;
    const w = box.clientWidth, h = Math.round(img.naturalHeight * s);
    img.style.width  = `${w}px`; img.style.height  = `${h}px`;
    wrap.style.width = `${w}px`; wrap.style.height = `${h}px`;
    zoomRef.current = 1; txRef.current = 0; tyRef.current = 0;
    clampView(); applyTransform();
  }

  // reset view when scene changes
  useEffect(() => {
    setInfoTable(null);
    if (imgRef.current?.naturalWidth) requestAnimationFrame(resetView);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  // ── ResizeObserver (handles orientation change on mobile) ──
  useEffect(() => {
    const box = containerRef.current; if (!box) return;
    const ro = new ResizeObserver(() => {
      if (!imgRef.current?.naturalWidth) return;
      const img = imgRef.current, wrap = wrapRef.current; if (!wrap) return;
      const s = box.clientWidth / img.naturalWidth;
      const w = box.clientWidth, h = Math.round(img.naturalHeight * s);
      img.style.width  = `${w}px`; img.style.height  = `${h}px`;
      wrap.style.width = `${w}px`; wrap.style.height = `${h}px`;
      clampView(); applyTransform();
    });
    ro.observe(box);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Mouse drag (desktop) ──
  function onMD(e: React.MouseEvent) {
    cancelAnimationFrame(drag.current.raf);
    drag.current = { ...drag.current, on: true, sx: e.clientX, sy: e.clientY, stx: txRef.current, sty: tyRef.current, vx: 0, vy: 0, lx: e.clientX, ly: e.clientY, moved: false };
  }

  const onMM = useCallback((e: MouseEvent) => {
    if (!drag.current.on) return;
    if (Math.abs(e.clientX - drag.current.sx) > 4 || Math.abs(e.clientY - drag.current.sy) > 4) drag.current.moved = true;
    drag.current.vx = e.clientX - drag.current.lx; drag.current.vy = e.clientY - drag.current.ly;
    drag.current.lx = e.clientX; drag.current.ly = e.clientY;
    txRef.current = drag.current.stx + (e.clientX - drag.current.sx);
    tyRef.current = drag.current.sty + (e.clientY - drag.current.sy);
    clampView(); applyTransform();
  }, []);

  const onMU = useCallback(() => {
    if (!drag.current.on) return; drag.current.on = false;
    let vx = drag.current.vx, vy = drag.current.vy;
    const go = () => { if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) return; txRef.current += vx; tyRef.current += vy; vx *= 0.9; vy *= 0.9; clampView(); applyTransform(); drag.current.raf = requestAnimationFrame(go); };
    drag.current.raf = requestAnimationFrame(go);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMM);
    document.addEventListener('mouseup',   onMU);
    return () => { document.removeEventListener('mousemove', onMM); document.removeEventListener('mouseup', onMU); cancelAnimationFrame(drag.current.raf); };
  }, [onMM, onMU]);

  // ── Touch + wheel ──
  useEffect(() => {
    const box = containerRef.current; if (!box) return;

    function dst(t: TouchList) { const dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY; return Math.sqrt(dx*dx + dy*dy); }
    function mid(t: TouchList) { const r = box!.getBoundingClientRect(); return { x: (t[0].clientX + t[1].clientX)/2 - r.left, y: (t[0].clientY + t[1].clientY)/2 - r.top }; }

    function onTS(e: TouchEvent) {
      const isUi = !!(e.target as Element).closest('button,[data-pin]');
      uiTouchRef.current = isUi;
      if (isUi) { drag.current.moved = false; return; }
      e.preventDefault();
      if (e.touches.length === 2) {
        drag.current.on = false;
        pinch.current = { on: true, dist: dst(e.touches), sz: zoomRef.current };
      } else {
        pinch.current.on = false;
        cancelAnimationFrame(drag.current.raf);
        const x = e.touches[0].clientX, y = e.touches[0].clientY;
        drag.current = { ...drag.current, on: true, sx: x, sy: y, stx: txRef.current, sty: tyRef.current, vx: 0, vy: 0, lx: x, ly: y, moved: false };
      }
    }

    function onTM(e: TouchEvent) {
      e.preventDefault();
      if (e.touches.length === 2 && pinch.current.on) {
        const nd = dst(e.touches), m = mid(e.touches);
        const newZ = Math.max(1, Math.min(4, pinch.current.sz * (nd / pinch.current.dist)));
        const oldZ = zoomRef.current;
        txRef.current = m.x - (m.x - txRef.current) * (newZ / oldZ);
        tyRef.current = m.y - (m.y - tyRef.current) * (newZ / oldZ);
        zoomRef.current = newZ; clampView(); applyTransform();
      } else if (drag.current.on) {
        const x = e.touches[0].clientX, y = e.touches[0].clientY;
        if (Math.abs(x - drag.current.sx) > 4 || Math.abs(y - drag.current.sy) > 4) drag.current.moved = true;
        drag.current.vx = x - drag.current.lx; drag.current.vy = y - drag.current.ly;
        drag.current.lx = x; drag.current.ly = y;
        txRef.current = drag.current.stx + (x - drag.current.sx);
        tyRef.current = drag.current.sty + (y - drag.current.sy);
        clampView(); applyTransform();
      }
    }

    function onTE() {
      if (uiTouchRef.current) { uiTouchRef.current = false; return; }
      if (pinch.current.on) { pinch.current.on = false; return; }
      if (!drag.current.on) return; drag.current.on = false;
      let vx = drag.current.vx, vy = drag.current.vy;
      const go = () => { if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) return; txRef.current += vx; tyRef.current += vy; vx *= 0.9; vy *= 0.9; clampView(); applyTransform(); drag.current.raf = requestAnimationFrame(go); };
      drag.current.raf = requestAnimationFrame(go);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const r = box!.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      const f = e.deltaY < 0 ? 1.12 : 1/1.12, oldZ = zoomRef.current, newZ = Math.max(1, Math.min(4, oldZ * f));
      if (newZ === oldZ) return;
      txRef.current = px - (px - txRef.current) * (newZ / oldZ);
      tyRef.current = py - (py - tyRef.current) * (newZ / oldZ);
      zoomRef.current = newZ; clampView(); applyTransform();
    }

    box.addEventListener('touchstart', onTS, { passive: false });
    box.addEventListener('touchmove',  onTM, { passive: false });
    box.addEventListener('touchend',   onTE);
    box.addEventListener('wheel',      onWheel, { passive: false });
    return () => {
      box.removeEventListener('touchstart', onTS);
      box.removeEventListener('touchmove',  onTM);
      box.removeEventListener('touchend',   onTE);
      box.removeEventListener('wheel',      onWheel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Keyboard ──
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && scenes.length > 1) setCurrentIdx(i => (i + 1) % scenes.length);
      if (e.key === 'ArrowLeft'  && scenes.length > 1) setCurrentIdx(i => (i - 1 + scenes.length) % scenes.length);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, scenes.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.88)' }}>

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
        <p className="flex-1 text-sm font-semibold text-white truncate">{scene.name}</p>
        <span className="text-xs text-slate-400">{scene.tables.length} {t.labels.tableLabel}</span>

        {/* Scene tabs (if multiple) */}
        {scenes.length > 1 && (
          <div className="flex gap-1 mx-2">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentIdx ? 'bg-amber-400' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center text-lg leading-none flex-shrink-0"
        >✕</button>
      </div>

      {/* Viewer */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden select-none"
        style={{ cursor: 'grab', touchAction: 'none' }}
        onMouseDown={onMD}
        onClick={() => setInfoTable(null)}
      >
        <div ref={wrapRef} className="absolute top-0 left-0" style={{ transformOrigin: 'top left', willChange: 'transform' }}>
          <img
            ref={imgRef}
            src={scene.imageUrl}
            alt={scene.name}
            draggable={false}
            onLoad={() => requestAnimationFrame(resetView)}
            className="block pointer-events-none"
          />

          {scene.tables.map((table, i) => (
            <div
              key={table.id}
              data-pin="true"
              className="absolute cursor-pointer group"
              style={{ left: `${table.x}%`, top: `${table.y}%` }}
              onClick={e => {
                e.stopPropagation();
                if (drag.current.moved) return;
                if (table.linkedSceneId) {
                  const idx = scenes.findIndex(s => s.id === table.linkedSceneId);
                  if (idx !== -1) setCurrentIdx(idx);
                  return;
                }
                setInfoTable(prev => prev?.id === table.id ? null : table);
              }}
            >
              <div className="flex flex-col items-center gap-1" style={{ transform: 'translate(-50%,-50%)' }}>
                <div className={`w-10 h-10 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-110 ${table.status === 'busy' ? 'bg-red-500' : table.linkedSceneId ? 'bg-amber-500' : 'bg-teal-500'}`}>
                  {table.linkedSceneId
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                    : i + 1}
                </div>
                <span className="text-[11px] font-semibold text-white bg-black/70 rounded-md px-1.5 py-0.5 backdrop-blur-sm border border-white/10 whitespace-nowrap max-w-[6rem] truncate text-center leading-tight">
                  {table.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview banner + scene name */}
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center pointer-events-none" style={{ zIndex: 15 }}>
          <div className="bg-amber-500/90 text-white text-xs font-semibold px-4 py-1.5 rounded-b-xl">{t.labels.previewMode}</div>
          <p className="mt-1.5 text-sm font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{scene.name}</p>
        </div>

        {/* Prev / Next arrows */}
        {scenes.length > 1 && (
          <>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setCurrentIdx(i => (i - 1 + scenes.length) % scenes.length); }}
              className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              style={{ zIndex: 15 }}
            >‹</button>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setCurrentIdx(i => (i + 1) % scenes.length); }}
              className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              style={{ zIndex: 15 }}
            >›</button>
          </>
        )}

        {/* Info card */}
        {infoTable && (
          <div
            className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/10"
            style={{ zIndex: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{infoTable.name}</p>
                <p className="text-xs text-slate-300 mt-0.5">{infoTable.capacity} {t.labels.persons}</p>
                {infoTable.description && <p className="text-xs text-slate-400 mt-1">{infoTable.description}</p>}
              </div>
              <div className={`px-2 py-1 text-[11px] font-medium rounded-lg flex-shrink-0 ${infoTable.status === 'free' ? 'bg-teal-500/30 text-teal-300' : 'bg-red-500/30 text-red-300'}`}>
                {infoTable.status === 'free' ? t.labels.free : t.labels.busy}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
