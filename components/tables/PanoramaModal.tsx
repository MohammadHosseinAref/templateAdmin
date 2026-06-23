'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { Scene } from '@/types/tables';

interface PanoramaModalProps {
  scene: Scene;
  onClose: () => void;
  onEdit: () => void;
  editLabel: string;
  noImageLabel: string;
}

export default function PanoramaModal({ scene, onClose, onEdit, editLabel, noImageLabel }: PanoramaModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const txRef        = useRef(0);
  const tyRef        = useRef(0);
  const zoomRef      = useRef(1);
  const drag         = useRef({ on: false, sx: 0, sy: 0, stx: 0, sty: 0, lx: 0, ly: 0, vx: 0, vy: 0, raf: 0 });

  function applyTransform() {
    const w = wrapRef.current; if (!w) return;
    w.style.transform = `translate(${txRef.current}px,${tyRef.current}px) scale(${zoomRef.current})`;
  }

  function clampView() {
    const box = containerRef.current, wrap = wrapRef.current; if (!box || !wrap) return;
    const ww = (parseInt(wrap.style.width, 10)||0)*zoomRef.current, wh = (parseInt(wrap.style.height,10)||0)*zoomRef.current;
    const cw = box.clientWidth, ch = box.clientHeight;
    txRef.current = ww<=cw?(cw-ww)/2:Math.max(cw-ww,Math.min(0,txRef.current));
    tyRef.current = wh<=ch?(ch-wh)/2:Math.max(ch-wh,Math.min(0,tyRef.current));
  }

  function resetView() {
    const img = imgRef.current, box = containerRef.current, wrap = wrapRef.current;
    if (!img||!box||!wrap||!img.naturalWidth) return;
    const s = box.clientHeight / img.naturalHeight;
    const w = Math.round(img.naturalWidth*s), h = box.clientHeight;
    img.style.width = `${w}px`; img.style.height = `${h}px`;
    wrap.style.width = `${w}px`; wrap.style.height = `${h}px`;
    zoomRef.current = 1; txRef.current = 0; tyRef.current = 0;
    applyTransform();
  }

  const onMM = useCallback((e: MouseEvent) => {
    if (!drag.current.on) return;
    drag.current.vx = e.clientX - drag.current.lx; drag.current.vy = e.clientY - drag.current.ly;
    drag.current.lx = e.clientX; drag.current.ly = e.clientY;
    txRef.current = drag.current.stx + (e.clientX - drag.current.sx);
    tyRef.current = drag.current.sty + (e.clientY - drag.current.sy);
    clampView(); applyTransform();
  }, []);

  const onMU = useCallback(() => {
    if (!drag.current.on) return; drag.current.on = false;
    let vx = drag.current.vx, vy = drag.current.vy;
    const go = () => { if (Math.abs(vx)<0.5&&Math.abs(vy)<0.5) return; txRef.current+=vx; tyRef.current+=vy; vx*=0.9; vy*=0.9; clampView(); applyTransform(); drag.current.raf=requestAnimationFrame(go); };
    drag.current.raf = requestAnimationFrame(go);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMM); document.addEventListener('mouseup', onMU);
    return () => { document.removeEventListener('mousemove', onMM); document.removeEventListener('mouseup', onMU); cancelAnimationFrame(drag.current.raf); };
  }, [onMM, onMU]);

  useEffect(() => {
    const box = containerRef.current; if (!box || !scene.imageUrl) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const r = box!.getBoundingClientRect(), px = e.clientX-r.left, py = e.clientY-r.top;
      const f = e.deltaY<0?1.12:1/1.12, oldZ = zoomRef.current, newZ = Math.max(1,Math.min(4,oldZ*f));
      if (newZ===oldZ) return;
      txRef.current = px-(px-txRef.current)*(newZ/oldZ);
      tyRef.current = py-(py-tyRef.current)*(newZ/oldZ);
      zoomRef.current = newZ; clampView(); applyTransform();
    }
    box.addEventListener('wheel', onWheel, {passive:false});
    return () => box.removeEventListener('wheel', onWheel);
  }, [scene.imageUrl]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.75)'}}>
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{maxHeight:'90vh'}}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <p className="flex-1 text-sm font-semibold text-white">{scene.name}</p>
          <button type="button" onClick={onEdit} className="text-xs px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 transition-colors">{editLabel}</button>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center text-lg leading-none">✕</button>
        </div>

        {/* Viewer */}
        <div ref={containerRef} className="relative flex-1 overflow-hidden select-none"
          style={{height:'60vh', cursor:'grab'}}
          onMouseDown={(e) => {
            cancelAnimationFrame(drag.current.raf);
            drag.current = {...drag.current,on:true,sx:e.clientX,sy:e.clientY,stx:txRef.current,sty:tyRef.current,vx:0,vy:0,lx:e.clientX,ly:e.clientY};
          }}>

          {scene.imageUrl ? (
            <div ref={wrapRef} className="absolute top-0 left-0" style={{transformOrigin:'top left',willChange:'transform'}}>
              <img ref={imgRef} src={scene.imageUrl} alt={scene.name} draggable={false} onLoad={resetView} className="block pointer-events-none"/>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">{noImageLabel}</div>
          )}
        </div>

      </div>
    </div>
  );
}
