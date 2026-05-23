// ─── PANTRY ITEM with qty bar ────────────────────────────────────────────

function PantryItem({item, onEdit, onDelete}){
  const [editing, setEditing]=useState(false);
  const [val,setVal]=useState(String(item.qty));
  const pct=Math.max(0,Math.min(100,(item.qty/item.max)*100));
  const isEmpty=item.qty<=0;
  const isLow=!isEmpty&&item.qty<=item.low;
  const barColor=isEmpty?'#C4A0A0':isLow?'#E8855A':pct>60?'#6B8C6E':'#D4A843';

  const save=()=>{
    const n=parseFloat(val);
    if(!isNaN(n)&&n>=0) onEdit(item.id,n);
    setEditing(false);
  };

  return (
    <div className={`shi ${isLow?'low':''} ${isEmpty?'empty':''}`}>
      <span style={{fontSize:'1.1rem'}}>{item.e}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:500,color:'var(--brn)',fontSize:'.8rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.n}</div>
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          {editing?(
            <input className="shi-edit-inp" autoFocus value={val}
              onChange={e=>setVal(e.target.value)}
              onBlur={save} onKeyDown={e=>{if(e.key==='Enter')save();if(e.key==='Escape')setEditing(false);}}/>
          ):(
            <span className="shi-qty">{isEmpty?'нет':item.qty}</span>
          )}
          <span className="shi-unit">{item.unit}</span>
        </div>
        <div className="qty-bar-wrap">
          <div className="qty-bar" style={{width:`${pct}%`,background:barColor}}/>
        </div>
      </div>
      <button className="shi-edit-btn" onClick={()=>{setVal(String(item.qty));setEditing(true);}}>✏️</button>
      {onDelete&&<button className="shi-del" onClick={e=>{e.stopPropagation();onDelete(item.id);}}>✕</button>}
    </div>
  );
}

// ─── EDIT RECIPE MODAL ───────────────────────────────────────────────────

function EditRecipeModal({recipe, onClose, onSave, onDelete}){
  const [form,setForm]=useState({
    name:recipe.name||'',
    emoji:recipe.emoji||'🍽️',
    cat:recipe.cat||'Ужин',
    time:String(recipe.time||30),
    notes:recipe.notes||'',
    kcal:String(recipe.kcal||0),
    b:String(recipe.b||0),
    f:String(recipe.f||0),
    u:String(recipe.u||0),
    safefood:recipe.safefood||false,
  });
  const [ings,setIngs]=useState((recipe.ingredients||[]).map((i,idx)=>({...i,_k:idx})));
  const [steps,setSteps]=useState((recipe.steps||[]).map((s,idx)=>({text:s,_k:idx})));
  const [confirmDel,setConfirmDel]=useState(false);

  const setF=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  const addIng=()=>setIngs(p=>[...p,{n:'',amt:'',unit:'г',_k:Date.now()}]);
  const setIng=(k,field,val)=>setIngs(p=>p.map(i=>i._k===k?{...i,[field]:val}:i));
  const rmIng=k=>setIngs(p=>p.filter(i=>i._k!==k));

  const addStep=()=>setSteps(p=>[...p,{text:'',_k:Date.now()}]);
  const setStep=(k,val)=>setSteps(p=>p.map(s=>s._k===k?{...s,text:val}:s));
  const rmStep=k=>setSteps(p=>p.filter(s=>s._k!==k));

  const save=()=>{
    const updated={
      ...recipe,
      ...form,
      time:parseInt(form.time)||0,
      kcal:parseInt(form.kcal)||0,
      b:parseFloat(form.b)||0,
      f:parseFloat(form.f)||0,
      u:parseFloat(form.u)||0,
      ingredients:ings.filter(i=>i.n).map(({_k,...i})=>({...i,amt:parseFloat(i.amt)||0})),
      steps:steps.filter(s=>s.text).map(s=>s.text),
    };
    onSave(updated);
    onClose();
  };

  const EMOJI_LIST=['🍝','🥗','🍲','🥘','🍜','🍛','🫕','🥞','🍳','🥚','🥩','🍗','🐟','🦐','🥦','🥕','🧆','🫔','🥙','🍱','🥟','🍰','🎂','🍮','🍩','🍪','🫖','🍵','🥤','🧃'];

  return (
    <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="edit-modal">
        <div className="mhdr">
          <span className="m-emoji">{form.emoji}</span>
          <div className="m-title" style={{fontSize:'1.1rem'}}>
            {recipe.id?'Редактировать рецепт':'Новый рецепт'}
          </div>
          <button className="m-close" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">

          {/* Эмодзи */}
          <div style={{marginBottom:16}}>
            <label className="form-label">Эмодзи блюда</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {EMOJI_LIST.map(e=>(
                <button key={e} onClick={()=>setForm(p=>({...p,emoji:e}))}
                  style={{background:form.emoji===e?'var(--rosebg)':'var(--cream)',
                    border:`1.5px solid ${form.emoji===e?'var(--rose3)':'var(--brd)'}`,
                    borderRadius:10,padding:'4px 7px',fontSize:'1.1rem',cursor:'pointer',transition:'all .15s'}}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Название */}
          <div style={{marginBottom:14}}>
            <label className="form-label">Название *</label>
            <input className="form-inp" value={form.name} onChange={setF('name')} placeholder="Название рецепта..."/>
          </div>

          {/* Категория и время */}
          <div className="form-row" style={{marginBottom:14}}>
            <div style={{flex:1}}>
              <label className="form-label">Категория</label>
              <select className="form-inp" value={form.cat} onChange={setF('cat')}
                style={{cursor:'pointer'}}>
                {CATS.filter(c=>c!=='Все').map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Время (мин)</label>
              <input className="form-inp-sm" value={form.time} onChange={setF('time')} type="number" min="0"/>
            </div>
            <div style={{display:'flex',alignItems:'flex-end',paddingBottom:4}}>
              <label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',fontFamily:"'Lora',serif",fontSize:'.82rem',fontStyle:'italic',color:'var(--txt2)'}}>
                <input type="checkbox" checked={form.safefood} onChange={e=>setForm(p=>({...p,safefood:e.target.checked}))}/>
                safe food
              </label>
            </div>
          </div>

          {/* КБЖУ */}
          <div style={{marginBottom:16}}>
            <label className="form-label">КБЖУ (на порцию)</label>
            <div className="form-row">
              {[['kcal','🔥 ккал'],['b','Б г'],['f','Ж г'],['u','У г']].map(([k,lbl])=>(
                <div key={k} style={{flex:1}}>
                  <input className="form-inp-sm" style={{width:'100%'}} value={form[k]}
                    onChange={setF(k)} type="number" min="0" placeholder={lbl}/>
                  <div style={{textAlign:'center',fontFamily:"'Lora',serif",fontSize:'.7rem',color:'var(--txt3)',fontStyle:'italic',marginTop:3}}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ингредиенты */}
          <div style={{marginBottom:16}}>
            <label className="form-label">Ингредиенты</label>
            {ings.map(ing=>(
              <div key={ing._k} className="ing-edit-row">
                <input className="form-inp" style={{flex:2}} value={ing.n}
                  onChange={e=>setIng(ing._k,'n',e.target.value)} placeholder="Название..."/>
                <input className="form-inp-sm" value={ing.amt}
                  onChange={e=>setIng(ing._k,'amt',e.target.value)} placeholder="Кол-во" type="number" min="0"/>
                <input className="form-inp-sm" value={ing.unit}
                  onChange={e=>setIng(ing._k,'unit',e.target.value)} placeholder="г / мл / шт"/>
                <button className="rm-btn" onClick={()=>rmIng(ing._k)}>✕</button>
              </div>
            ))}
            <button className="add-row-btn" onClick={addIng}>+ добавить ингредиент</button>
          </div>

          {/* Шаги */}
          <div style={{marginBottom:16}}>
            <label className="form-label">Шаги приготовления</label>
            {steps.map((s,idx)=>(
              <div key={s._k} className="step-edit-row">
                <div className="step-num-sm">{idx+1}</div>
                <textarea className="form-ta" style={{minHeight:52,flex:1}} value={s.text}
                  onChange={e=>setStep(s._k,e.target.value)} placeholder="Описание шага..."/>
                <button className="rm-btn" onClick={()=>rmStep(s._k)}>✕</button>
              </div>
            ))}
            <button className="add-row-btn" onClick={addStep}>+ добавить шаг</button>
          </div>

          {/* Заметки */}
          <div style={{marginBottom:22}}>
            <label className="form-label">Заметки к рецепту</label>
            <textarea className="form-ta" value={form.notes} onChange={setF('notes')}
              placeholder="советы, хитрости, что изменить в следующий раз..."/>
          </div>

          {/* Кнопки */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
            {recipe.id&&!confirmDel&&(
              <button className="btn-danger" onClick={()=>setConfirmDel(true)}>🗑 удалить рецепт</button>
            )}
            {recipe.id&&confirmDel&&(
              <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <span style={{fontFamily:"'Lora',serif",fontSize:'.85rem',fontStyle:'italic',color:'#8B3040'}}>точно удалить?</span>
                <button className="btn-danger" onClick={()=>{onDelete(recipe.id);onClose();}}>да, удалить</button>
                <button onClick={()=>setConfirmDel(false)} style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'Lora',serif",fontSize:'.85rem',color:'var(--txt3)'}}>отмена</button>
              </div>
            )}
            {!recipe.id&&<div/>}
            <button className="btn-save" onClick={save}>сохранить ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RECIPE MODAL ────────────────────────────────────────────────────────

function StepTimer({text, stepIdx}){
  const [secs, setSecs] = useState(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const match = text.match(/(\d+)[\s-]*(мин|минут|час|часа|часов|сек)/i);
  if(!match) return <div className="step-txt">{text}</div>;

  const rawN = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const totalSecs = unit.startsWith('час') ? rawN*3600 : unit.startsWith('сек') ? rawN : rawN*60;

  const cur = secs !== null ? secs : totalSecs;
  const mm = String(Math.floor(cur/60)).padStart(2,'0');
  const ss = String(cur%60).padStart(2,'0');
  const urgent = cur <= 30 && cur > 0;

  useState(()=>{
    if(!running) return;
    if(cur<=0){ setDone(true); setRunning(false); return; }
    const t=setTimeout(()=>setSecs(s=>(s||totalSecs)-1), 1000);
    return ()=>clearTimeout(t);
  });

  const [,setTick]=useState(0);
  if(running){
    setTimeout(()=>setTick(t=>t+1),1000);
  }

  const handleStart=()=>{
    if(done){ setSecs(totalSecs); setDone(false); setRunning(false); return; }
    if(secs===null) setSecs(totalSecs);
    setRunning(r=>!r);
  };

  return (
    <div className="step-txt" style={{display:'flex',alignItems:'flex-start',gap:4,flexWrap:'wrap'}}>
      <span style={{flex:1}}>{text}</span>
      {running||secs!==null?(
        <span className={`step-timer-display ${urgent?'urgent':''}`}>
          {done?'✅ готово!':`⏱ ${mm}:${ss}`}
          <button onClick={handleStart}
            style={{background:'none',border:'none',cursor:'pointer',fontSize:'.8rem',padding:'0 2px',color:'inherit'}}>
            {done?'↺':running?'⏸':'▶'}
          </button>
        </span>
      ):(
        <button className={`step-timer-btn ${done?'done':''}`} onClick={handleStart}>
          ⏱ {rawN} {unit.startsWith('час')?'ч':unit.startsWith('сек')?'сек':'мин'}
        </button>
      )}
    </div>
  );
}

function IngRow({ing, scale, pantry}){
  const pm=matchPantry(ing.n,pantry);
  const have=!!pm&&pm.qty>0;
  const hasButLow=!!pm&&pm.qty>0&&pm.qty<=pm.low;
  return (
    <div className="ing-row" style={hasButLow?{background:'rgba(232,133,90,.08)'}:{}}>
      <div className={`ing-st ${have?'have':'need'}`}>{have?'✓':'+'}</div>
      <span className="ing-name">
        {ing.n}
        {hasButLow&&<span style={{fontSize:'.7rem',color:'var(--tr2)',marginLeft:5}}>⚠ мало</span>}
        {isInSeason(ing.n)&&<span className="season-badge">🌿 сезон</span>}
      </span>
      <span className="ing-amount">{fmt(ing.amt,ing.unit,scale)}</span>
      {pm&&<span style={{fontFamily:"'Caveat',cursive",fontSize:'.72rem',color:'var(--txt3)',marginLeft:4}}>/ есть {pm.qty}{pm.unit}</span>}
    </div>
  );
}

function HouseholdBtn({label, items, onAdd}){
  const name=label.replace(/^.\s/,'');
  const already=!!items.find(i=>i.name.toLowerCase()===name.toLowerCase());
  return (
    <button onClick={()=>onAdd(label)}
      style={{background:already?'rgba(107,140,110,.12)':'var(--parch)',
        border:`1px solid ${already?'var(--sage2)':'var(--brd)'}`,
        borderRadius:18,padding:'4px 12px',fontFamily:"'Caveat',cursive",fontSize:'.82rem',
        color:already?'var(--sage)':'var(--txt2)',cursor:'pointer',
        display:'flex',alignItems:'center',gap:4}}>
      {already&&<span style={{fontSize:'.7rem'}}>✓</span>}
      {label}
    </button>
  );
}

function ExpBar({m, maxTotal}){
  const h=Math.round((m.food+m.house)/maxTotal*90);
  const fh=Math.round((m.food/maxTotal)*90);
  const hh=Math.round((m.house/maxTotal)*90);
  return (
    <div className="exp-bar-group" title={m.month+': еда '+m.food+'₽ + быт '+m.house+'₽'}>
      <div className="exp-bar-stack" style={{height:h}}>
        <div className="exp-bar" style={{background:'var(--blush)',height:hh}}/>
        <div className="exp-bar" style={{background:m.current?'var(--tr)':'var(--sage2)',height:fh}}/>
      </div>
      <div className={`exp-label ${m.current?'cur':''}`}>{m.month}</div>
    </div>
  );
}

function ShelfSection({shelf, onEdit, onDelete}){
  return (
    <div className="shelf">
      <div className="sh2">
        <span style={{fontSize:'1.3rem'}}>{shelf.cat.split(' ')[0]}</span>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'var(--brn)',fontStyle:'italic'}}>{shelf.cat.slice(shelf.cat.indexOf(' ')+1)}</span>
        <span style={{marginLeft:'auto',fontFamily:"'Caveat',cursive",fontSize:'.85rem',color:'var(--txt3)'}}>{shelf.items.length} позиций</span>
      </div>
      <div className="shitems">
        {shelf.items.map(item=><PantryItem key={item.id} item={item} onEdit={onEdit} onDelete={onDelete}/>)}
      </div>
    </div>
  );
}

function RecipeModal({recipe:r, onClose, onRate, onAddMissing, pantry, onCook, onAddNote}){
  const [srv,setSrv]=useState(r.baseServ||2);
  const [cooked,setCooked]=useState(false);
  const [noteText,setNoteText]=useState('');
  const scale=srv/(r.baseServ||2);

  const cookResult = cooked ? r.ingredients.map(ing=>{
    const pm=matchPantry(ing.n,pantry);
    if(!pm) return null;
    const used=ing.amt*scale;
    return {name:pm.n,was:pm.qty,now:Math.max(0,pm.qty-used),unit:pm.unit};
  }).filter(Boolean) : [];

  const missing=r.ingredients.filter(i=>!matchPantry(i.n,pantry));

  const handleCook=()=>{
    onCook(r.ingredients,scale);
    setCooked(true);
  };

  return (
    <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal">
        <div className="mhdr">
          <span className="m-emoji">{r.emoji}</span>
          <div>
            <div className="m-title">{r.name}</div>
            <div style={{display:'flex',gap:6,marginTop:3,flexWrap:'wrap'}}>
              <span className="tag">{r.cat}</span>
              <span className="tag">⏱ {r.time} мин</span>
              {r.video&&<a href={r.video} target="_blank" rel="noreferrer" style={{textDecoration:'none'}}><span className="tag" style={{background:'rgba(192,85,42,.1)',borderColor:'var(--tr2)',color:'var(--tr)'}}>▶ видео</span></a>}
            </div>
          </div>
          <button className="m-close" onClick={onClose}>✕</button>
        </div>

        <div className="mbody">
          
          <div className="srv-wrap">
            <span className="srv-label">🍽️ Порции:</span>
            <div className="srv-btns">
              {[1,2,3,4].map(n=><button key={n} className={`srv-btn ${srv===n?'on':''}`} onClick={()=>setSrv(n)}>{n}</button>)}
            </div>
            <div className="srv-kbju">
              <span className="kc kal">🔥 {Math.round(r.kcal/r.baseServ*srv)} ккал</span>
              <span className="kc bel">Б {(r.b/r.baseServ*srv).toFixed(1)}г</span>
              <span className="kc jir">Ж {(r.f/r.baseServ*srv).toFixed(1)}г</span>
              <span className="kc ugl">У {(r.u/r.baseServ*srv).toFixed(1)}г</span>
            </div>
          </div>

          
          <div className="sec">🧺 Ингредиенты</div>
          <div className="ing-legend"><span>✓ есть в полочке</span><span style={{color:'var(--tr)'}}>+ нужно купить</span></div>
          <div className="ing-list">
            {r.ingredients.map((ing,i)=>(
              <IngRow key={i} ing={ing} scale={scale} pantry={pantry}/>
            ))}
          </div>

          {missing.length>0&&(
            <div className="add-miss" onClick={()=>{onAddMissing(missing,r.name);onClose();}}>
              <span style={{fontSize:'1.2rem'}}>🛒</span>
              <span style={{fontFamily:"'Caveat',cursive",fontSize:'.9rem',color:'var(--tr)'}}>Добавить {missing.length} недостающих в список покупок</span>
              <span style={{marginLeft:'auto'}}>→</span>
            </div>
          )}
          {missing.length===0&&(
            <div style={{background:'rgba(107,140,110,.1)',border:'1px solid var(--sage2)',borderRadius:10,padding:'10px 14px',marginBottom:20,fontFamily:"'Caveat',cursive",fontSize:'.9rem',color:'var(--sage)'}}>
              ✨ Все ингредиенты уже есть в полочке!
            </div>
          )}

          
          <div className="sec">📋 Приготовление</div>
          <div className="steps">
            {r.steps.map((s,i)=>(
              <div key={i} className="step">
                <div className="step-num">{i+1}</div>
                <StepTimer text={s} stepIdx={i}/>
              </div>
            ))}
          </div>
          {r.notes&&<div className="mnotes">{r.notes}</div>}

          
          {!cooked?(
            <button className="cook-btn" onClick={handleCook}>
              <span style={{fontSize:'1.3rem'}}>🍳</span> Приготовила! — списать продукты с полочки
            </button>
          ):(
            <div className="cook-success">
              <div style={{marginBottom:8,fontSize:'1rem'}}>✅ Готово! Полочка обновлена</div>
              {cookResult.map((cr,i)=>(
                <div key={i} style={{fontSize:'.82rem',opacity:.8}}>
                  {cr.name}: {cr.was} → <strong>{Math.max(0,Math.round(cr.now*10)/10)} {cr.unit}</strong>
                </div>
              ))}
            </div>
          )}

          
          <div style={{background:'var(--parch)',borderRadius:13,padding:'14px 16px',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:20}}>
            <span style={{fontFamily:"'Caveat',cursive",fontSize:'.95rem',color:'var(--txt2)'}}>Оценить:</span>
            <div className="rate-btns">
              {Object.entries(RATINGS).map(([key,val])=>(
                <button key={key} className={`rb ${r.rating===key?val.cls:''}`}
                  style={r.rating===key?{background:val.bg}:{}}
                  onClick={()=>onRate(r.id,key)}>
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          
          <div className="mynotes-wrap">
            <div className="sec">📓 Мои заметки</div>
            {(r.myNotes||[]).length===0&&(
              <div style={{fontFamily:"'Caveat',cursive",fontSize:'.88rem',color:'var(--txt3)',marginBottom:10,fontStyle:'italic'}}>
                пока пусто — напиши что получилось, что изменила, что попробовать в следующий раз...
              </div>
            )}
            {(r.myNotes||[]).map((n,i)=>(
              <div key={i} className="mynote-item">
                <div className="mynote-date">{n.date}</div>
                <div className="mynote-txt">{n.text}</div>
              </div>
            ))}
            <div className="mynote-add">
              <textarea className="mynote-ta" rows={2} placeholder="что-то получилось по-особенному, идея на следующий раз..."
                value={noteText} onChange={e=>setNoteText(e.target.value)}/>
              <button className="mynote-save" onClick={()=>{
                if(!noteText.trim()) return;
                const d=new Date();
                const months=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
                onAddNote(r.id,{date:`${d.getDate()} ${months[d.getMonth()]}`,text:noteText.trim()});
                setNoteText('');
              }}>
                сохранить ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RECIPE CARD ─────────────────────────────────────────────────────────

function RecipeCard({r,onClick,onEdit,onDelete}){
  return (
    <div className="rc" onClick={onClick}>
      <div className="rc-img">
        <span>{r.emoji}</span>
        <span className="rc-cat">{r.cat}</span>
        {r.video&&<span className="rc-vid">▶ видео</span>}
        {r.rating==='love'&&<span className="rc-love">🔥</span>}
        {r.safefood&&<span className="rc-safe">🫧 safe</span>}
        <div className="rc-actions">
          <button className="rc-act-btn" title="Редактировать"
            onClick={e=>{e.stopPropagation();onEdit&&onEdit(r);}}>✏️</button>
        </div>
      </div>
      <div className="rc-body">
        <div className="rc-name">{r.name}</div>
        <div className="kbju" style={{marginBottom:6}}>
          <span className="kc kal">🔥 {r.kcal}</span>
          <span className="kc bel">Б {r.b}г</span>
          <span className="kc jir">Ж {r.f}г</span>
          <span className="kc ugl">У {r.u}г</span>
        </div>
        {r.rating&&<div className="rc-rat">{RATINGS[r.rating]?.label}</div>}
      </div>
    </div>
  );
}
function GrainOverlay(){
  return (
    <svg style={{position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:9999,opacity:.032}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)"/>
    </svg>
  );
}

function Stars(){
  const pos=[
    {t:'8%',l:'12%',s:'.8rem'},{t:'15%',l:'88%',s:'.6rem'},{t:'32%',l:'5%',s:'.5rem'},
    {t:'45%',l:'96%',s:'.9rem'},{t:'68%',l:'8%',s:'.6rem'},{t:'75%',l:'92%',s:'.7rem'},
    {t:'88%',l:'15%',s:'.5rem'},{t:'22%',l:'50%',s:'.45rem'},{t:'55%',l:'78%',s:'.55rem'},
  ];
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
      {pos.map((p,i)=>(
        <span key={i} style={{position:'absolute',top:p.t,left:p.l,fontSize:p.s,
          color:'rgba(200,160,48,.25)',userSelect:'none',lineHeight:1,
          animation:`twinkle ${2+i*.4}s ease-in-out infinite alternate`}}>
          {i%3===0?'✦':i%3===1?'✶':'·'}
        </span>
      ))}
      <style>{`@keyframes twinkle{from{opacity:.15}to{opacity:.45}}`}</style>
    </div>
  );
}

function DecorLine(){
  return (
    <div style={{textAlign:'center',margin:'6px 0',fontFamily:"'Special Elite',cursive",
      fontSize:'.68rem',color:'rgba(200,160,48,.4)',letterSpacing:'6px',userSelect:'none'}}>
      ✦ · · · ✦ · · · ✦
    </div>
  );
}
