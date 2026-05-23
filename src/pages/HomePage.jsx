function HomePage({recipes, pantry, channels, setTab, onOpen}){
  const dp=PLAN[getTodayIdx()]||{};
  const loved=recipes.filter(r=>r.rating==='love');
  const stats=[
    {i:'📖',v:recipes.length,    l:'рецептов',     hint:'открыть рецепты', tab:'recipes'},
    {i:'🔥',v:loved.length,      l:'обожаемых',    hint:'смотреть оценки', tab:'ratings'},
    {i:'🫧',v:recipes.filter(r=>r.safefood).length,l:'safe food',hint:'открыть safe food',tab:'safe'},
    {i:'🗄️',v:pantry.length,     l:'в полочке',    hint:'смотреть полочки',tab:'pantry'},
    {i:'📼',v:channels.length,   l:'каналов',      hint:'смотреть кассеты',tab:'cassettes'},
  ];
  return (
    <div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.1rem',color:'var(--brn)',marginBottom:4}}>
        Привет, <em style={{color:'var(--tr)',fontStyle:'italic'}}>котёнок!</em> 🌿
      </div>
      <div style={{fontFamily:"'Caveat',cursive",fontSize:'1.05rem',color:'var(--txt3)',marginBottom:22}}>{getDayRu()}</div>

      <div className="stats">
        {stats.map((s,i)=>(
          <div key={i} className="sc" onClick={()=>setTab(s.tab)}>
            <div className="si">{s.i}</div>
            <div className="sv">{s.v}</div>
            <div className="sl">{s.l}</div>
            <div className="sc-hint">{s.hint} →</div>
          </div>
        ))}
      </div>

      <div className="sec">☀️ Меню на сегодня</div>
      <div className="tmg">
        {[{l:'Завтрак',k:0,e:'☀️'},{l:'Обед',k:1,e:'🌿'},{l:'Ужин',k:2,e:'🌙'}].map(m=>(
          <div key={m.k} className={`ms ${dp[m.k]?'':'empty'}`}>
            <div className="ml">{m.e} {m.l}</div>
            {dp[m.k]?<div><div className="mn">{dp[m.k]}</div><div className="mk">~320 ккал</div></div>:<div className="mn">не запланировано</div>}
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={{background:'var(--ww)',border:'1.5px solid var(--gold2)',borderRadius:15,padding:18,cursor:'pointer',boxShadow:'0 2px 10px var(--sh)'}} onClick={()=>setTab('ratings')}>
          <div className="sec">🔥 Пушечные рецепты</div>
          {loved.slice(0,3).map(r=>(
            <div key={r.id} style={{display:'flex',alignItems:'center',gap:9,padding:'7px 0',borderBottom:'1px solid var(--brd)'}} onClick={e=>{e.stopPropagation();onOpen(r);}}>
              <span style={{fontSize:'1.2rem'}}>{r.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'.88rem',color:'var(--brn)',fontStyle:'italic'}}>{r.name}</div>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:'.72rem',color:'var(--txt3)'}}>{r.cat} · {r.time} мин</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:'var(--ww)',border:'1px solid var(--brd)',borderRadius:15,padding:18,boxShadow:'0 2px 10px var(--sh)'}}>
          <div className="sec">🍽️ КБЖУ за сегодня</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
            {[{l:'Калории',v:'1240',m:'1800',c:'var(--tr)'},{l:'Белки',v:'52 г',m:'80 г',c:'var(--sage)'},{l:'Жиры',v:'38 г',m:'60 г',c:'var(--gold)'},{l:'Углеводы',v:'164 г',m:'220 г',c:'var(--rose)'}].map((n,i)=>(
              <div key={i} style={{background:'var(--parch)',borderRadius:9,padding:11}}>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:'.78rem',color:'var(--txt3)',marginBottom:3}}>{n.l}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',color:n.c,fontWeight:700}}>{n.v}</div>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:'.7rem',color:'var(--txt3)'}}>из {n.m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="decor" style={{marginTop:20}}>~ сделано с любовью, только для тебя ~</div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:18}}>
        <div style={{background:'linear-gradient(135deg,rgba(107,140,110,.08),rgba(168,197,171,.05))',border:'1px solid var(--sage2)',borderRadius:15,padding:18}}>
          <div className="sec" style={{marginBottom:10}}>🌿 Сейчас в сезоне</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {(SEASONS[CUR_MONTH]||[]).map(s=>(
              <span key={s.n} style={{
                background:s.peak?'rgba(107,140,110,.18)':'rgba(107,140,110,.07)',
                border:`1px solid ${s.peak?'var(--sage)':'var(--sage2)'}`,
                borderRadius:20,padding:'4px 12px',
                fontFamily:"'Caveat',cursive",fontSize:'.86rem',
                color:s.peak?'var(--sage)':'var(--txt3)',
                display:'flex',alignItems:'center',gap:4}}>
                {s.e} {s.n}{s.peak&&<span style={{fontSize:'.65rem',opacity:.7}}>★</span>}
              </span>
            ))}
          </div>
          <div style={{fontFamily:"'Caveat',cursive",fontSize:'.75rem',color:'var(--txt3)',marginTop:10}}>
            ★ пик сезона · в рецептах сезонные ингредиенты помечены 🌿
          </div>
        </div>
        <MoonWidget/>
      </div>
    </div>
  );
}
