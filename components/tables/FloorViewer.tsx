'use client';

import { useRef, useState, useEffect } from 'react';
import type { FloorViewerProps, TableItem } from '@/types/tables';
import { Field } from '@/components/ui/card';
import { inputCls, textareaCls } from '@/components/ui/styles';
import { useLocale } from '@/contexts/LocaleContext';

type Editing = { table: TableItem | null; pos?: { x: number; y: number }; isPortalAdd?: boolean };

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function FloorViewer({ scene, allScenes, panoramaEnabled, onChange, onNavigate, onPanoramaToggle, onSave, saved }: FloorViewerProps) {
  const t = useLocale().tables;

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const txRef      = useRef(0);
  const tyRef      = useRef(0);
  const zoomRef    = useRef(1);
  const addModeRef       = useRef(false);
  const addPortalModeRef = useRef(false);
  const uiTouchRef       = useRef(false);
  const drag       = useRef({ on: false, sx: 0, sy: 0, stx: 0, sty: 0, vx: 0, vy: 0, lx: 0, ly: 0, raf: 0, moved: false });
  const pinch      = useRef({ on: false, dist: 0, sz: 1 });

  const [uiAddMode,      setUiAddMode]      = useState(false);
  const [uiAddPortalMode,setUiAddPortalMode]= useState(false);
  const [uiZoom,         setUiZoom]         = useState(100);
  const [isPreview, setIsPreview] = useState(false);
  const [editing,   setEditing]   = useState<Editing | null>(null);
  const [formName,  setFormName]  = useState('');
  const [formDesc,  setFormDesc]  = useState('');
  const [formCap,   setFormCap]   = useState(4);
  const [formLink,  setFormLink]  = useState<string>('');
  const [infoTable, setInfoTable] = useState<TableItem | null>(null);

  useEffect(() => { addModeRef.current = uiAddMode || uiAddPortalMode; }, [uiAddMode, uiAddPortalMode]);
  useEffect(() => { addPortalModeRef.current = uiAddPortalMode; }, [uiAddPortalMode]);

  useEffect(() => {
    if (imgRef.current?.naturalWidth) resetView(panoramaEnabled);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  // auto-fill name from linked scene
  useEffect(() => {
    if (!formLink) return;
    const linked = allScenes.find(s => s.id === formLink);
    if (linked) setFormName(linked.name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formLink]);

  /* ── transform ── */
  function applyTransform() {
    const wrap = wrapRef.current; if (!wrap) return;
    wrap.style.transform = `translate(${txRef.current}px,${tyRef.current}px) scale(${zoomRef.current})`;
  }

  function clampView() {
    const box = containerRef.current, wrap = wrapRef.current; if (!box || !wrap) return;
    const ww = (parseInt(wrap.style.width,  10)||0) * zoomRef.current;
    const wh = (parseInt(wrap.style.height, 10)||0) * zoomRef.current;
    const cw = box.clientWidth, ch = box.clientHeight;
    txRef.current = ww <= cw ? (cw-ww)/2 : Math.max(cw-ww, Math.min(0, txRef.current));
    tyRef.current = wh <= ch ? (ch-wh)/2 : Math.max(ch-wh, Math.min(0, tyRef.current));
  }

  function setBaseSize(panoramic: boolean): boolean {
    const img = imgRef.current, box = containerRef.current, wrap = wrapRef.current;
    if (!img || !box || !wrap || !img.naturalWidth) return false;
    if (!box.clientWidth || !box.clientHeight) return false;
    let w: number, h: number;
    if (panoramic) {
      // panorama ON: fill height — image may overflow width, user pans horizontally
      const s = box.clientHeight / img.naturalHeight;
      w = Math.round(img.naturalWidth * s); h = box.clientHeight;
    } else {
      // panorama OFF: fill width — image always spans full container width,
      // so resizing the browser window always resizes the image (تغییر عرض با موس)
      const s = box.clientWidth / img.naturalWidth;
      w = box.clientWidth; h = Math.round(img.naturalHeight * s);
    }
    img.style.width  = `${w}px`; img.style.height = `${h}px`;
    wrap.style.width = `${w}px`; wrap.style.height = `${h}px`;
    return true;
  }

  function resetView(panoramic: boolean) {
    if (!setBaseSize(panoramic)) return;
    zoomRef.current = 1;
    txRef.current = 0; tyRef.current = 0;
    clampView(); // centres if image smaller than container, otherwise keeps at origin
    applyTransform(); setUiZoom(100);
  }

  function zoomAt(px: number, py: number, factor: number) {
    const oldZ = zoomRef.current;
    const newZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, oldZ * factor));
    if (newZ === oldZ) return;
    txRef.current = px - (px - txRef.current) * (newZ / oldZ);
    tyRef.current = py - (py - tyRef.current) * (newZ / oldZ);
    zoomRef.current = newZ; clampView(); applyTransform();
    setUiZoom(Math.round(newZ * 100));
  }

  function zoomCenter(factor: number) {
    const box = containerRef.current; if (!box) return;
    zoomAt(box.clientWidth / 2, box.clientHeight / 2, factor);
  }

  // delay one frame so the container is laid out before reading clientWidth/Height
  function onImgLoad() {
    requestAnimationFrame(() => resetView(panoramaEnabled));
  }

  useEffect(() => {
    if (!scene.imageUrl || !imgRef.current?.naturalWidth) return;
    const id = requestAnimationFrame(() => resetView(panoramaEnabled));
    return () => cancelAnimationFrame(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panoramaEnabled, scene.imageUrl]);

  /* ── document mouse ── */
  useEffect(() => {
    function onMM(e: MouseEvent) {
      if (!drag.current.on) return;
      if (Math.abs(e.clientX-drag.current.sx)>4||Math.abs(e.clientY-drag.current.sy)>4) drag.current.moved=true;
      drag.current.vx=e.clientX-drag.current.lx; drag.current.vy=e.clientY-drag.current.ly;
      drag.current.lx=e.clientX; drag.current.ly=e.clientY;
      txRef.current=drag.current.stx+(e.clientX-drag.current.sx);
      tyRef.current=drag.current.sty+(e.clientY-drag.current.sy);
      clampView(); applyTransform();
    }
    function onMU() {
      if (!drag.current.on) return; drag.current.on=false;
      let vx=drag.current.vx, vy=drag.current.vy;
      const go=()=>{ if(Math.abs(vx)<0.5&&Math.abs(vy)<0.5)return; txRef.current+=vx; tyRef.current+=vy; vx*=0.9; vy*=0.9; clampView(); applyTransform(); drag.current.raf=requestAnimationFrame(go); };
      drag.current.raf=requestAnimationFrame(go);
    }
    document.addEventListener('mousemove',onMM); document.addEventListener('mouseup',onMU);
    return ()=>{ document.removeEventListener('mousemove',onMM); document.removeEventListener('mouseup',onMU); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── touch + wheel ── */
  useEffect(() => {
    const box=containerRef.current; if (!box) return;
    function dst(t:TouchList){const dx=t[0].clientX-t[1].clientX,dy=t[0].clientY-t[1].clientY;return Math.sqrt(dx*dx+dy*dy);}
    function mid(t:TouchList){const r=box!.getBoundingClientRect();return{x:(t[0].clientX+t[1].clientX)/2-r.left,y:(t[0].clientY+t[1].clientY)/2-r.top};}
    function onTS(e:TouchEvent){
      uiTouchRef.current=!!(e.target as Element).closest('button,[data-pin]');
      if(uiTouchRef.current){drag.current.moved=false;return;}
      if(e.touches.length===2){
        e.preventDefault();
        drag.current.on=false;pinch.current={on:true,dist:dst(e.touches),sz:zoomRef.current};
      } else {
        if(addModeRef.current){drag.current.moved=false;return;} // let tap fire click
        e.preventDefault();
        pinch.current.on=false;cancelAnimationFrame(drag.current.raf);
        const x=e.touches[0].clientX,y=e.touches[0].clientY;
        drag.current={...drag.current,on:true,sx:x,sy:y,stx:txRef.current,sty:tyRef.current,vx:0,vy:0,lx:x,ly:y,moved:false};
      }
    }
    function onTM(e:TouchEvent){
      if(uiTouchRef.current)return;
      e.preventDefault();
      if(e.touches.length===2&&pinch.current.on){const nd=dst(e.touches),m=mid(e.touches),newZ=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,pinch.current.sz*(nd/pinch.current.dist))),oldZ=zoomRef.current;txRef.current=m.x-(m.x-txRef.current)*(newZ/oldZ);tyRef.current=m.y-(m.y-tyRef.current)*(newZ/oldZ);zoomRef.current=newZ;clampView();applyTransform();}
      else if(drag.current.on){const x=e.touches[0].clientX,y=e.touches[0].clientY;if(Math.abs(x-drag.current.sx)>4||Math.abs(y-drag.current.sy)>4)drag.current.moved=true;drag.current.vx=x-drag.current.lx;drag.current.vy=y-drag.current.ly;drag.current.lx=x;drag.current.ly=y;txRef.current=drag.current.stx+(x-drag.current.sx);tyRef.current=drag.current.sty+(y-drag.current.sy);clampView();applyTransform();}
    }
    function onTE(){
      if(uiTouchRef.current){uiTouchRef.current=false;return;}
      if(pinch.current.on){pinch.current.on=false;setUiZoom(Math.round(zoomRef.current*100));return;}
      if(!drag.current.on)return;drag.current.on=false;
      let vx=drag.current.vx,vy=drag.current.vy;
      const go=()=>{if(Math.abs(vx)<0.5&&Math.abs(vy)<0.5)return;txRef.current+=vx;tyRef.current+=vy;vx*=0.9;vy*=0.9;clampView();applyTransform();drag.current.raf=requestAnimationFrame(go);};
      drag.current.raf=requestAnimationFrame(go);
    }
    function onWheel(e:WheelEvent){e.preventDefault();const r=box!.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,e.deltaY<0?1.12:1/1.12);}
    box.addEventListener('touchstart',onTS,{passive:false});box.addEventListener('touchmove',onTM,{passive:false});box.addEventListener('touchend',onTE);box.addEventListener('wheel',onWheel,{passive:false});
    return()=>{box.removeEventListener('touchstart',onTS);box.removeEventListener('touchmove',onTM);box.removeEventListener('touchend',onTE);box.removeEventListener('wheel',onWheel);};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.imageUrl]);

  /* ── ResizeObserver ── */
  useEffect(() => {
    const box=containerRef.current; if(!box||!scene.imageUrl)return;
    const ro=new ResizeObserver(()=>{if(!imgRef.current?.naturalWidth)return;setBaseSize(panoramaEnabled);clampView();applyTransform();});
    ro.observe(box); return()=>ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.imageUrl, panoramaEnabled]);

  function onMD(e: React.MouseEvent) {
    if (addModeRef.current) return;
    cancelAnimationFrame(drag.current.raf);
    drag.current={...drag.current,on:true,sx:e.clientX,sy:e.clientY,stx:txRef.current,sty:tyRef.current,vx:0,vy:0,lx:e.clientX,ly:e.clientY,moved:false};
  }

  function onContainerClick(e: React.MouseEvent) {
    if (!addModeRef.current || drag.current.moved) return;
    const img=imgRef.current; if(!img)return;
    const rect=img.getBoundingClientRect();
    const xp=((e.clientX-rect.left)/rect.width)*100;
    const yp=((e.clientY-rect.top)/rect.height)*100;
    if(xp<0||xp>100||yp<0||yp>100)return;
    if (addPortalModeRef.current) {
      setUiAddPortalMode(false);
      const firstScene = allScenes.find(s => s.id !== scene.id);
      setFormLink(firstScene?.id ?? '');
      setFormName(firstScene?.name ?? '');
      setFormDesc(''); setFormCap(4);
      setEditing({table:null, pos:{x:xp, y:yp}, isPortalAdd:true});
    } else {
      setUiAddMode(false);
      setFormName(`${t.labels.tableLabel} ${scene.tables.length+1}`);
      setFormDesc(''); setFormCap(4); setFormLink('');
      setEditing({table:null, pos:{x:xp, y:yp}});
    }
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0]; if(!file)return;
    e.target.value='';
    const reader=new FileReader();
    reader.onload=(ev)=>onChange({...scene, imageUrl:ev.target?.result as string});
    reader.readAsDataURL(file);
  }

  /* ── CRUD ── */
  function confirmAdd() {
    if (!editing?.pos) return;
    const isPortal=!!formLink;
    const linkedScene=isPortal?allScenes.find(s=>s.id===formLink):undefined;
    const newTable: TableItem = {
      id:`t_${Date.now()}`,
      name: isPortal?(linkedScene?.name??formName):(formName||`${t.labels.tableLabel} ${scene.tables.length+1}`),
      description: !isPortal&&formDesc?formDesc:undefined,
      capacity: isPortal?0:formCap,
      x:editing.pos.x, y:editing.pos.y,
      status:'free',
      linkedSceneId:formLink||undefined,
    };
    onChange({...scene, tables:[...scene.tables, newTable]});
    // re-enter the same mode so user can place next hotspot immediately
    setEditing(null);
    if (editing.isPortalAdd) setUiAddPortalMode(true);
    else setUiAddMode(true);
  }

  function confirmEdit() {
    if (!editing?.table) return;
    const isPortal=!!formLink;
    const linkedScene=isPortal?allScenes.find(s=>s.id===formLink):undefined;
    onChange({...scene, tables:scene.tables.map(tb=>
      tb.id===editing.table!.id
        ?{...tb,
          name:isPortal?(linkedScene?.name??formName):formName,
          description:!isPortal&&formDesc?formDesc:undefined,
          capacity:isPortal?0:formCap,
          linkedSceneId:formLink||undefined}
        :tb
    )});
    setEditing(null);
  }

  function deleteTable(id: string) {
    onChange({...scene, tables:scene.tables.filter(tb=>tb.id!==id)});
    setEditing(null);
  }

  /* ── Upload placeholder ── */
  if (!scene.imageUrl) {
    return (
      <div className="space-y-4">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload}
          style={{position:'fixed',top:'-200%',left:'-200%',opacity:0,width:0,height:0}}/>
        <div role="button" tabIndex={0}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-600 transition-colors flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500"
          style={{minHeight:280}}
          onClick={()=>fileInputRef.current?.click()}
          onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' ')fileInputRef.current?.click();}}>
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
          <span className="text-sm font-medium">{t.labels.uploadFloor}</span>
          <span className="text-xs">{t.labels.uploadFormats}</span>
        </div>
      </div>
    );
  }

  const isPortalForm = !!formLink;
  const otherScenes  = allScenes.filter(s => s.id !== scene.id);

  /* ── Viewer ── */
  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload}
        style={{position:'fixed',top:'-200%',left:'-200%',opacity:0,width:0,height:0}}/>

      <div ref={containerRef}
        className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 select-none"
        style={{height:'clamp(300px, calc(100vh - 14rem), 520px)', cursor:isPreview?'default':((uiAddMode||uiAddPortalMode)?'crosshair':'grab'), touchAction:'none'}}
        onMouseDown={onMD}
        onClick={isPreview?()=>setInfoTable(null):onContainerClick}>

        <div ref={wrapRef} className="absolute top-0 left-0" style={{transformOrigin:'top left',willChange:'transform'}}>
          <img ref={imgRef} src={scene.imageUrl} alt="floor" draggable={false} onLoad={onImgLoad} className="block pointer-events-none"/>

          {scene.tables.map((table, i) => (
            <div key={table.id}
              data-pin="true"
              className="absolute cursor-pointer group"
              style={{left:`${table.x}%`, top:`${table.y}%`}}
              onMouseDown={(e)=>{e.stopPropagation(); drag.current.moved=false;}}
              onTouchStart={(e)=>e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (drag.current.moved && !isPreview) return;
                if (isPreview) {
                  if (table.linkedSceneId) { onNavigate(table.linkedSceneId); return; }
                  setInfoTable(table); return;
                }
                setFormName(table.name); setFormDesc(table.description??''); setFormCap(table.capacity); setFormLink(table.linkedSceneId??'');
                setEditing({table});
              }}>
              {/* pin: circle + name label, centered at click position */}
              <div className="flex flex-col items-center gap-1" style={{transform:'translate(-50%,-50%)'}}>
                <div className={`w-10 h-10 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-110 ${table.status==='busy'?'bg-red-500':table.linkedSceneId?'bg-amber-500':'bg-teal-500'}`}>
                  {table.linkedSceneId
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                    : i+1}
                </div>
                {/* name label – always visible on map */}
                <span className="text-[11px] font-semibold text-white bg-black/70 rounded-md px-1.5 py-0.5 backdrop-blur-sm border border-white/10 whitespace-nowrap max-w-[6rem] truncate text-center leading-tight">
                  {table.linkedSceneId
                    ? (allScenes.find(s=>s.id===table.linkedSceneId)?.name ?? '→')
                    : table.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview banner */}
        {isPreview && (
          <div className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none" style={{zIndex:15}}>
            <div className="bg-amber-500/90 text-white text-xs font-semibold px-4 py-1.5 rounded-b-xl">{t.labels.previewMode}</div>
          </div>
        )}

        {/* Add mode tip */}
        {!isPreview && (uiAddMode || uiAddPortalMode) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{zIndex:10}}>
            <div className={`bg-black/80 border-2 rounded-xl px-6 py-3 text-sm font-medium ${uiAddPortalMode?'border-amber-500 text-amber-400':'border-teal-500 text-teal-400'}`}>
              {uiAddPortalMode?t.labels.addPortalTip:t.labels.addTip}
            </div>
          </div>
        )}

        {/* Preview info card */}
        {isPreview && infoTable && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/10" style={{zIndex:20}}
            onClick={(e)=>e.stopPropagation()} onTouchStart={(e)=>e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{infoTable.name}</p>
                <p className="text-xs text-slate-300 mt-0.5">{infoTable.capacity} {t.labels.persons}</p>
                {infoTable.description && <p className="text-xs text-slate-400 mt-1">{infoTable.description}</p>}
              </div>
              <div className={`px-2 py-1 text-[11px] font-medium rounded-lg flex-shrink-0 ${infoTable.status==='free'?'bg-teal-500/30 text-teal-300':'bg-red-500/30 text-red-300'}`}>
                {infoTable.status==='free'?t.labels.free:t.labels.busy}
              </div>
            </div>
          </div>
        )}

        {/* Zoom */}
        <div className="absolute top-3 start-3 flex items-center gap-1" style={{zIndex:10}} onMouseDown={(e)=>e.stopPropagation()} onTouchStart={(e)=>e.stopPropagation()}>
          <button type="button" onClick={(e)=>{e.stopPropagation();zoomCenter(1/1.2);}} className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm text-white border border-white/20 hover:bg-black/80 transition-colors text-lg font-bold leading-none">−</button>
          <button type="button" onClick={(e)=>{e.stopPropagation();resetView(panoramaEnabled);}} className="px-2 h-8 rounded-lg bg-black/60 backdrop-blur-sm text-white border border-white/20 hover:bg-black/80 transition-colors text-xs tabular-nums min-w-[3.5rem] text-center">{uiZoom}%</button>
          <button type="button" onClick={(e)=>{e.stopPropagation();zoomCenter(1.2);}} className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm text-white border border-white/20 hover:bg-black/80 transition-colors text-lg font-bold leading-none">+</button>
        </div>

        {/* Top-right: change image */}
        <div className="absolute top-3 end-3 flex items-center gap-1.5" style={{zIndex:10}} onClick={(e)=>e.stopPropagation()} onMouseDown={(e)=>e.stopPropagation()} onTouchStart={(e)=>e.stopPropagation()}>
          <button type="button" onClick={()=>fileInputRef.current?.click()}
            className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 hover:bg-black/80 transition-colors">
            {t.labels.changeImage}
          </button>
        </div>

      </div>

      {/* Add buttons — below image so full image area stays pannable */}
      {!isPreview && (
        <div className="flex gap-2">
          <button type="button" onClick={()=>{setUiAddMode(v=>!v);setUiAddPortalMode(false);setEditing(null);}}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${uiAddMode?'bg-teal-500 text-white border-teal-500':'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border-teal-400 dark:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20'}`}>
            {uiAddMode?`✕ ${t.labels.cancel}`:`+ ${t.labels.addMode}`}
          </button>
          {otherScenes.length > 0 && (
            <button type="button" onClick={()=>{setUiAddPortalMode(v=>!v);setUiAddMode(false);setEditing(null);}}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${uiAddPortalMode?'bg-amber-500 text-white border-amber-500':'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border-amber-400 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}>
              {uiAddPortalMode?`✕ ${t.labels.cancel}`:`→ ${t.labels.linkedScene}`}
            </button>
          )}
        </div>
      )}

      {/* Edit / Add form */}
      {!isPreview && editing && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{editing.table?t.labels.editTable:t.labels.newTable}</p>
            <button type="button" onClick={()=>setEditing(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none">✕</button>
          </div>

          {/* Link selector (shown first — controls form mode) */}
          {otherScenes.length > 0 && (
            <Field label={t.labels.linkedScene}>
              <select value={formLink} onChange={(e)=>setFormLink(e.target.value)} className={inputCls}>
                <option value="">{t.labels.noScene}</option>
                {otherScenes.map(s=>(
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {isPortalForm && <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">{t.labels.linkedSceneDesc}</p>}
            </Field>
          )}

          {/* Name + capacity + description — only when NOT a portal */}
          {!isPortalForm && (
            <>
              <Field label={t.fields.name} required>
                <input autoFocus className={inputCls} value={formName} onChange={(e)=>setFormName(e.target.value)} placeholder={t.placeholders.tableName}/>
              </Field>

              <Field label={t.fields.capacity} required>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={()=>setFormCap(v=>Math.max(1,v-1))} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">−</button>
                  <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 min-w-[2ch] text-center tabular-nums">{formCap}</span>
                  <button type="button" onClick={()=>setFormCap(v=>Math.min(20,v+1))} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">+</button>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t.labels.persons}</span>
                </div>
              </Field>

              <Field label={t.fields.description}>
                <textarea className={`${textareaCls} resize-none`} rows={2}
                  value={formDesc} onChange={(e)=>setFormDesc(e.target.value)}
                  placeholder={t.placeholders.tableDesc}/>
              </Field>
            </>
          )}

          <div className="flex gap-2 pt-1">
            {editing.table && (
              <button type="button" onClick={()=>deleteTable(editing.table!.id)} className="px-4 py-2.5 text-sm text-red-500 border border-red-200 dark:border-red-900 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">{t.labels.deleteTable}</button>
            )}
            <button type="button" onClick={()=>setEditing(null)} className="flex-1 py-2.5 text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t.labels.cancel}</button>
            <button type="button" onClick={editing.table?confirmEdit:confirmAdd} className="flex-1 py-2.5 text-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors">{t.labels.confirm}</button>
          </div>
        </div>
      )}

      {/* Panorama toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.labels.enablePanorama}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t.labels.enablePanoramaDesc}</p>
        </div>
        <button type="button" role="switch" aria-checked={panoramaEnabled} onClick={()=>onPanoramaToggle(!panoramaEnabled)}
          className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors ${panoramaEnabled?'bg-teal-500':'bg-slate-200 dark:bg-slate-600'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${panoramaEnabled?'translate-x-6':'translate-x-0'}`}/>
        </button>
      </div>

      <button type="button"
        onClick={() => { setEditing(null); setUiAddMode(false); setUiAddPortalMode(false); setIsPreview(false); setInfoTable(null); onSave(); }}
        className={`w-full py-3 text-sm font-semibold rounded-2xl transition-colors ${saved?'bg-green-500 text-white':'bg-teal-500 hover:bg-teal-600 text-white'}`}>
        {saved?`✓ ${t.labels.saved}`:t.labels.save}
      </button>

    </div>
  );
}
