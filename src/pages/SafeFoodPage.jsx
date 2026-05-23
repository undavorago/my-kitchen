function SafeFoodPage({recipes,onOpen}){
  const safe=recipes.filter(r=>r.safefood);
  return (
    <div>
      <div className="pt">🫧 Safe Food</div>
      <div className="ps">еда, которая обнимает изнутри</div>
      <div className="div"/>
      <div style={{background:'linear-gradient(135deg,rgba(107,140,110,.1),rgba(212,147,122,.08))',border:'1px solid var(--sage2)',borderRadius:16,padding:20,marginBottom:24}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:'var(--sage)',marginBottom:6,fontStyle:'italic'}}>Твой уголок комфортной еды 🌿</div>
        <div style={{fontSize:'.84rem',lineHeight:1.6,color:'var(--txt2)'}}>Здесь собраны рецепты, которые не требуют усилий и всегда приносят уют. Для тех дней, когда всё сложно — просто поешь что-нибудь тёплое и своё.</div>
      </div>
      <div className="safe-grid">
        {safe.map(r=>(
          <div key={r.id} className="safe-card" onClick={()=>onOpen(r)}>
            <div className="safe-img">
              <span>{r.emoji}</span>
              {r.rating==='love'&&<span style={{position:'absolute',top:8,right:8,fontSize:'.9rem',background:'rgba(255,255,255,.85)',borderRadius:'50%',width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center'}}>🔥</span>}
            </div>
            <div style={{padding:'11px 13px 13px'}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'.9rem',color:'var(--sage)',fontStyle:'italic',marginBottom:4}}>{r.name}</div>
              {r.safeWhy&&<div style={{fontFamily:"'Caveat',cursive",fontSize:'.72rem',color:'var(--sage)',fontStyle:'italic',marginTop:3}}>"{r.safeWhy}"</div>}
              <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
                <span className="tag">⏱ {r.time} мин</span>
                <span className="kc kal" style={{borderRadius:6,padding:'2px 7px',fontSize:'.65rem'}}>🔥 {r.kcal} ккал</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="decor" style={{marginTop:20}}>~ всё будет хорошо. просто поешь чего-нибудь тёплого ~</div>
    </div>
  );
}
