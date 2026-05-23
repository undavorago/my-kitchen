function WishlistPage({wishes, setWishes}){
  const [nw,setNw]=useState('');
  const [editingId,setEditingId]=useState(null);
  const [editVal,setEditVal]=useState('');
  const toggle=id=>setWishes(p=>p.map(w=>w.id===id?{...w,done:!w.done}:w));
  const del=id=>setWishes(p=>p.filter(w=>w.id!==id));
  const add=()=>{if(!nw.trim())return;setWishes(p=>[...p,{id:Date.now(),n:nw,cat:'Другое',e:'🍽️',done:false}]);setNw('');};
  const startEdit=(w)=>{setEditingId(w.id);setEditVal(w.n);};
  const saveEdit=id=>{
    if(editVal.trim()) setWishes(p=>p.map(w=>w.id===id?{...w,n:editVal.trim()}:w));
    setEditingId(null);
  };
  const done=wishes.filter(w=>w.done).length;
  return (
    <div>
      <div className="pt">✨ Хочу приготовить</div>
      <div className="ps">список мечт на {getMonthRu().toLowerCase()}</div>
      <div className="div"/>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',color:'var(--brn)',fontStyle:'italic'}}>{getMonthRu()}</span>
        <span className="tag">✅ {done} из {wishes.length}</span>
        <div style={{flex:1,height:6,background:'var(--parch)',borderRadius:6,overflow:'hidden',maxWidth:180}}>
          <div style={{height:'100%',width:`${wishes.length?(done/wishes.length)*100:0}%`,background:'linear-gradient(90deg,var(--sage),var(--sage2))',borderRadius:6,transition:'width .4s'}}/>
        </div>
      </div>
      <div className="wgrid">
        {wishes.map(w=>(
          <div key={w.id} className={`wc ${w.done?'dn':''}`}>
            <span style={{fontSize:'1.8rem'}}>{w.e}</span>
            <div style={{flex:1}}>
              {editingId===w.id?(
                <input className="wish-edit-inp" autoFocus value={editVal}
                  onChange={e=>setEditVal(e.target.value)}
                  onBlur={()=>saveEdit(w.id)}
                  onKeyDown={e=>{if(e.key==='Enter')saveEdit(w.id);if(e.key==='Escape')setEditingId(null);}}/>
              ):(
                <div className="wn2" onDoubleClick={()=>startEdit(w)}>{w.n}</div>
              )}
              <div className="wcat">{w.cat}</div>
            </div>
            <button className="wish-del-btn" title="Редактировать" onClick={()=>startEdit(w)}>✏️</button>
            <button className="wish-del-btn" title="Удалить" onClick={()=>del(w.id)}>🗑</button>
            <button className={`wtog ${w.done?'dn':''}`} onClick={()=>toggle(w.id)}>{w.done?'✓':''}</button>
          </div>
        ))}
      </div>
      <div className="wadd">
        <span style={{fontSize:'1.3rem'}}>✨</span>
        <input className="inp" placeholder="что хочу приготовить в этом месяце..." value={nw} onChange={e=>setNw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/>
        <button className="btn btn-p" onClick={add}>добавить</button>
      </div>
      <div className="decor" style={{marginTop:16}}>~ готовить — это искусство, и ты в нём прекрасна ~</div>
    </div>
  );
}
