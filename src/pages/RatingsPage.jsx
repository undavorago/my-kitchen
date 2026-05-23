function RatingsPage({recipes,onOpen}){
  const loved=recipes.filter(r=>r.rating==='love');
  const groups=Object.entries(RATINGS).map(([key,val])=>({key,...val,items:recipes.filter(r=>r.rating===key)}));
  return (
    <div>
      <div className="pt">⭐ Оценки рецептов</div>
      <div className="ps">рецепты, разложенные по папочкам</div>
      <div className="div"/>
      <div className="love-sec" style={{marginBottom:24}}>
        <div className="love-hdr">
          <span style={{fontSize:'1.4rem'}}>🔥</span>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',color:'var(--gold)',fontStyle:'italic'}}>Пушка бомба ракета — лучшее</span>
          <span style={{marginLeft:'auto',fontFamily:"'Caveat',cursive",fontSize:'.85rem',color:'var(--txt3)'}}>{loved.length} рецептов</span>
        </div>
        {loved.length===0?(
          <div className="rat-empty">ещё ни одного — открой рецепт и поставь 🔥</div>
        ):(
          <div style={{padding:14,display:'flex',flexWrap:'wrap',gap:9}}>
            {loved.map(r=>(
              <div key={r.id} onClick={()=>onOpen(r)} style={{background:'#FFF8E0',border:'1px solid var(--gold2)',borderRadius:11,padding:'9px 14px',display:'flex',alignItems:'center',gap:9,cursor:'pointer',transition:'transform .15s'}}
                onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseOut={e=>e.currentTarget.style.transform=''}>
                <span style={{fontSize:'1.3rem'}}>{r.emoji}</span>
                <div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'.88rem',color:'var(--brn)',fontStyle:'italic'}}>{r.name}</div>
                  <div style={{fontFamily:"'Caveat',cursive",fontSize:'.72rem',color:'var(--txt3)'}}>{r.cat}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="rat-grid">
        {groups.map(g=>(
          <div key={g.key} className="rat-sec">
            <div className="rat-hdr" style={{background:g.bg+'55'}}>
              <span style={{fontSize:'1.3rem'}}>{g.label.split(' ')[0]}</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'var(--brn)',fontStyle:'italic'}}>{g.label.slice(g.label.indexOf(' ')+1)}</span>
              <span style={{marginLeft:'auto',fontFamily:"'Caveat',cursive",fontSize:'.85rem',color:'var(--txt3)'}}>{g.items.length}</span>
            </div>
            {g.items.length===0?<div className="rat-empty">пусто</div>:(
              <div className="rat-items">
                {g.items.map(r=>(
                  <div key={r.id} className="rat-item" style={{background:g.bg+'33'}} onClick={()=>onOpen(r)}>
                    <span style={{fontSize:'1.2rem'}}>{r.emoji}</span>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:'.88rem',color:'var(--brn)',fontStyle:'italic',flex:1}}>{r.name}</span>
                    <span style={{fontFamily:"'Caveat',cursive",fontSize:'.75rem',color:'var(--txt3)'}}>⏱{r.time}м</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="decor">~ открой рецепт и поставь оценку внутри ~</div>
    </div>
  );
}
