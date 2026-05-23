function KBJUDayBar({d, isToday}){
  const pctB=Math.min((d.b/KBJU_TARGET.b)*100,100);
  const pctF=Math.min((d.f/KBJU_TARGET.f)*100,100);
  const pctU=Math.min((d.u/KBJU_TARGET.u)*100,100);
  const over=d.kcal>KBJU_TARGET.kcal*1.15;
  return (
    <div className="wkbju-day">
      <div className={`wkbju-day-label ${isToday?'today':''}`}>{d.day}</div>
      <div className="wkbju-bar-wrap">
        <div className="wkbju-mini-bar"><div className="wkbju-mini-fill" style={{width:d.done?`${pctB}%`:'0%',background:'var(--tr)'}}/></div>
        <div className="wkbju-mini-bar"><div className="wkbju-mini-fill" style={{width:d.done?`${pctF}%`:'0%',background:'var(--gold2)'}}/></div>
        <div className="wkbju-mini-bar"><div className="wkbju-mini-fill" style={{width:d.done?`${pctU}%`:'0%',background:'var(--rose)'}}/></div>
      </div>
      <div className={`wkbju-kcal-val ${over?'over':''} ${!d.done?'empty':''}`}>{d.done?d.kcal:'—'}</div>
    </div>
  );
}

function KBJUTotalCard({l,v,tgt,c}){
  const pct=Math.round((parseInt(v)/parseInt(tgt))*100)||0;
  const onTrack=pct>=80&&pct<=115;
  return (
    <div className="wkbju-total-card">
      <div className="wkbju-total-val" style={{color:c}}>{v}</div>
      <div className="wkbju-total-lbl">{l}</div>
      <div className="wkbju-total-pct" style={{color:onTrack?'var(--sage)':'var(--tr2)'}}>{pct}% от плана</div>
    </div>
  );
}

function WeeklyKBJU(){
  const ti=getTodayIdx();
  const filledDays=WEEK_KBJU.filter(d=>d.done);
  const totKcal=filledDays.reduce((s,d)=>s+d.kcal,0);
  const totB=filledDays.reduce((s,d)=>s+d.b,0);
  const totF=filledDays.reduce((s,d)=>s+d.f,0);
  const totU=filledDays.reduce((s,d)=>s+d.u,0);
  const wKcal=KBJU_TARGET.kcal*7;
  const avgKcal=filledDays.length?Math.round(totKcal/filledDays.length):0;
  const pctWeek=Math.round((totKcal/wKcal)*100);
  const isSunday=new Date().getDay()===0;
  const verdictIco=pctWeek>=90&&pctWeek<=115?'🌿':pctWeek<90?'🫧':'✨';
  const verdictTxt=pctWeek>=90&&pctWeek<=115?'Неделя прошла отлично!':pctWeek<90?'Немного недоела на этой неделе':'Эта неделя была чуть более сытной';
  const verdictSub=`Среднее ${avgKcal} ккал/день`;

  return (
    <div className="wkbju-wrap">
      <div className="sec">
        📊 КБЖУ за неделю
        {isSunday&&<span className="tag" style={{background:'rgba(192,85,42,.1)',color:'var(--tr)',borderColor:'var(--tr2)',marginLeft:8}}>воскресенье — итог!</span>}
      </div>
      <div className="wkbju-days">
        {WEEK_KBJU.map((d,i)=><KBJUDayBar key={i} d={d} isToday={i===ti}/>)}
      </div>
      <div className="wkbju-totals">
        <KBJUTotalCard l="Калории"  v={String(totKcal)}   tgt={String(wKcal)}              c="var(--tr)"/>
        <KBJUTotalCard l="Белки"    v={totB+'г'}          tgt={KBJU_TARGET.b*7+'г'}         c="var(--sage)"/>
        <KBJUTotalCard l="Жиры"     v={totF+'г'}          tgt={KBJU_TARGET.f*7+'г'}         c="var(--gold)"/>
        <KBJUTotalCard l="Углеводы" v={totU+'г'}          tgt={KBJU_TARGET.u*7+'г'}         c="var(--rose)"/>
      </div>
      {filledDays.length>=5?(
        <div className="wkbju-verdict">
          <span className="wkbju-verdict-ico">{verdictIco}</span>
          <div>
            <div className="wkbju-verdict-txt">{verdictTxt}</div>
            <div className="wkbju-verdict-sub">{verdictSub}</div>
          </div>
        </div>
      ):(
        <div style={{fontFamily:"'Caveat',cursive",fontSize:'.88rem',color:'var(--txt3)',textAlign:'center',padding:'8px 0'}}>
          итог появится в воскресенье 🌙
        </div>
      )}
    </div>
  );
}

function KBJUPage(){
  return (
    <div>
      <div className="pt">📊 КБЖУ за неделю</div>
      <div className="ps">выполняю ли я план — смотрю здесь</div>
      <div className="div"/>
      <WeeklyKBJU/>
    </div>
  );
}
