function PlanPage(){
  const ti=getTodayIdx();
  const rows=['Завтрак','Обед','Ужин'];
  const icons=['☀️','🌿','🌙'];
  return (
    <div>
      <div className="pt">📅 Меню на неделю</div>
      <div className="ps">план — это не скучно, это уютно</div>
      <div className="div"/>
      <div className="wn">
        <button className="wn-btn">‹</button>
        <span className="wn-lbl">19 — 25 мая 2026</span>
        <button className="wn-btn">›</button>
      </div>
      <div style={{overflowX:'auto',paddingBottom:8}}>
        <div className="pgrid" style={{minWidth:520}}>
          <div/>
          {DAYS.map((d,i)=>(
            <div key={d} className={`ph ${i===ti?'td':''}`}>{d}</div>
          ))}
          {rows.map((row,ri)=>(
            <React.Fragment key={row}>
              <div className="prl">{icons[ri]} {row}</div>
              {DAYS.map((d,di)=>(
                <div key={di} className={`pc ${PLAN[di]?.[ri]?'ok':''}`}>
                  {PLAN[di]?.[ri]||'+'}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{marginTop:16,fontFamily:"'Caveat',cursive",fontSize:'.88rem',color:'var(--txt3)',textAlign:'center'}}>
        недельный отчёт КБЖУ — на вкладке 📊
      </div>
    </div>
  );
}

const SHOP_CATS=['🥬 Овощи и фрукты','🌾 Крупы','🥛 Молочное','🥩 Мясо и рыба','🫖 Напитки','🧹 Бытовое','🐱 Для Эльзы','📦 Другое'];
