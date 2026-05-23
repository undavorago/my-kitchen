function DiaryDayRow({day, entries, target}){
  const total=entries.reduce((s,e)=>s+e.kcal,0);
  const pct=Math.min(total/target*100,100);
  const color=pct>=85&&pct<=115?'var(--sage)':pct<85?'var(--gold2)':'var(--tr2)';
  const dayLabel=DAYS_RU[day.getDay()];
  const isToday=day.toDateString()===new Date().toDateString();
  return (
    <div className="diary-week-row">
      <div className="diary-week-day" style={{color:isToday?'var(--tr)':'var(--txt3)',fontWeight:isToday?700:400}}>
        {dayLabel}
      </div>
      <div className="diary-week-fill">
        <div className="diary-week-bar" style={{width:`${pct}%`,background:color}}/>
      </div>
      <div style={{fontFamily:"'Caveat',cursive",fontSize:'.82rem',color:total?color:'var(--brd)',minWidth:70,textAlign:'right'}}>
        {total?`${total} ккал`:'—'}
      </div>
    </div>
  );
}

function DiaryQuickBtn({item, onAdd}){
  return (
    <button onClick={()=>onAdd(item)}
      style={{background:'var(--parch)',border:'1px solid var(--brd)',borderRadius:18,
        padding:'5px 12px',fontFamily:"'Caveat',cursive",fontSize:'.82rem',
        color:'var(--txt2)',cursor:'pointer',display:'flex',alignItems:'center',gap:5,
        transition:'all .15s'}}
      onMouseOver={e=>e.currentTarget.style.borderColor='var(--tr2)'}
      onMouseOut={e=>e.currentTarget.style.borderColor='var(--brd)'}>
      {item.e} {item.n}
    </button>
  );
}

function DiaryPage({entries, setEntries}){
  const [weekOffset,setWeekOffset]=useState(0);
  const [custom,setCustom]=useState('');
  const [customKcal,setCustomKcal]=useState('');
  const [showQuick,setShowQuick]=useState(true);
  const target=1800;

  const weekDays=getWeekDays(weekOffset);
  const todayKey=new Date().toDateString();
  const [selectedDay,setSelectedDay]=useState(todayKey);

  const dayEntries=entries[selectedDay]||[];
  const dayKcal=dayEntries.reduce((s,e)=>s+e.kcal,0);
  const dayB=dayEntries.reduce((s,e)=>s+(e.b||0),0);
  const dayF=dayEntries.reduce((s,e)=>s+(e.f||0),0);
  const dayU=dayEntries.reduce((s,e)=>s+(e.u||0),0);
  const pct=Math.min(Math.round(dayKcal/target*100),100);
  const barColor=pct>=85&&pct<=115?'var(--sage)':pct<85?'var(--gold2)':'var(--tr2)';

  const addEntry=item=>{
    setEntries(prev=>({...prev,[selectedDay]:[...(prev[selectedDay]||[]),{...item,id:Date.now()}]}));
  };
  const removeEntry=id=>{
    setEntries(prev=>({...prev,[selectedDay]:(prev[selectedDay]||[]).filter(e=>e.id!==id)}));
  };
  const addCustom=()=>{
    if(!custom.trim()||!customKcal) return;
    addEntry({n:custom,e:'🍽️',kcal:parseInt(customKcal)||0,b:0,f:0,u:0});
    setCustom(''); setCustomKcal('');
  };

  const selDate=new Date(selectedDay);
  const selLabel=`${DAYS_RU[selDate.getDay()]}, ${selDate.getDate()} ${MONTHS_RU[selDate.getMonth()]}`;

  return (
    <div>
      <div className="pt">📓 Дневник питания</div>
      <div className="ps">что реально съела сегодня</div>
      <div className="div"/>

      <div className="diary-nav">
        <button className="diary-nav-btn" onClick={()=>setWeekOffset(w=>w-1)}>‹</button>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'var(--brn)',fontStyle:'italic'}}>
          {weekDays[0].getDate()} — {weekDays[6].getDate()} {MONTHS_RU[weekDays[6].getMonth()]}
        </span>
        <button className="diary-nav-btn" onClick={()=>setWeekOffset(w=>w+1)}>›</button>
      </div>

      <div className="diary-week-card">
        {weekDays.map((day,i)=>(
          <div key={i} onClick={()=>setSelectedDay(day.toDateString())}
            style={{cursor:'pointer',background:day.toDateString()===selectedDay?'rgba(192,85,42,.05)':'transparent',
              borderRadius:8,margin:'2px -4px',padding:'0 4px'}}>
            <DiaryDayRow day={day} entries={entries[day.toDateString()]||[]} target={target}/>
          </div>
        ))}
      </div>

      <div style={{background:'var(--ww)',border:'1px solid var(--brd)',borderRadius:15,padding:18,boxShadow:'0 2px 10px var(--sh)'}}>
        <div className="diary-day-header">
          <span className="diary-day-label">{selLabel}</span>
          <div className="diary-kbju-bar">
            <span className="diary-k" style={{color:'var(--tr)'}}>🔥 {dayKcal} / {target}</span>
            <span className="diary-k" style={{color:'var(--sage)'}}>Б {dayB}г</span>
            <span className="diary-k" style={{color:'var(--gold)'}}>Ж {dayF}г</span>
            <span className="diary-k" style={{color:'var(--rose)'}}>У {dayU}г</span>
          </div>
        </div>

        <div className="diary-goal-bar">
          <div className="diary-goal-fill" style={{width:`${pct}%`,background:barColor}}/>
        </div>
        <div style={{fontFamily:"'Caveat',cursive",fontSize:'.78rem',color:'var(--txt3)',marginBottom:14}}>
          {pct<85?`ещё ${target-dayKcal} ккал до цели`:pct<=115?'цель выполнена ✨':'немного превысила цель'}
        </div>

        {dayEntries.length>0&&(
          <div className="diary-entries">
            {dayEntries.map(e=>(
              <div key={e.id} className="diary-entry">
                <span className="diary-entry-emoji">{e.e}</span>
                <span className="diary-entry-name">{e.n}</span>
                <span className="diary-entry-kcal">🔥 {e.kcal}</span>
                {e.b>0&&<span style={{fontFamily:"'Caveat',cursive",fontSize:'.78rem',color:'var(--txt3)'}}>Б{e.b} Ж{e.f} У{e.u}</span>}
                <button className="diary-entry-del" onClick={()=>removeEntry(e.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
        {dayEntries.length===0&&(
          <div style={{fontFamily:"'Caveat',cursive",fontSize:'.9rem',color:'var(--brd)',textAlign:'center',padding:'16px 0',marginBottom:14}}>
            пока ничего не записано
          </div>
        )}

        <div style={{borderTop:'1px solid var(--brd)',paddingTop:14}}>
          <div style={{fontFamily:"'Caveat',cursive",fontSize:'.88rem',color:'var(--txt2)',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span>Быстро добавить</span>
            <button onClick={()=>setShowQuick(q=>!q)}
              style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'Caveat',cursive",fontSize:'.82rem',color:'var(--txt3)'}}>
              {showQuick?'скрыть ▲':'показать ▼'}
            </button>
          </div>
          {showQuick&&(
            <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:14}}>
              {DIARY_QUICK.map(item=>(
                <DiaryQuickBtn key={item.n} item={item} onAdd={addEntry}/>
              ))}
            </div>
          )}
          <div className="diary-add-row">
            <input className="inp" placeholder="своё блюдо..." value={custom} onChange={e=>setCustom(e.target.value)} style={{flex:2}}/>
            <input className="inp" placeholder="ккал" value={customKcal} onChange={e=>setCustomKcal(e.target.value)} style={{flex:1,maxWidth:80}} type="number"/>
            <button className="btn btn-p" onClick={addCustom}>+ добавить</button>
          </div>
        </div>
      </div>
    </div>
  );
}
