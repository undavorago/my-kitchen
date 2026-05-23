function PantryPage({pantry, onEditQty, onAddItem, onDeleteItem}){
  const cats=[...new Set(pantry.map(p=>p.cat))];
  const low=pantry.filter(p=>p.qty<=p.low&&p.qty>0);
  const empty=pantry.filter(p=>p.qty<=0);
  const [showAdd,setShowAdd]=useState(false);
  const [newItem,setNewItem]=useState({n:'',e:'🥫',qty:'',max:'',unit:'г',cat:cats[0]||'Крупы и консервы',low:''});
  const setNI=k=>e=>setNewItem(p=>({...p,[k]:e.target.value}));
  const PANTRY_EMOJI=['🥫','🌾','🍚','🍝','🧂','🫒','🍯','🥛','🥚','🧀','🧈','🍋','🥕','🧄','🧅','🥦','🍅','🥩','🐟','🫘','🌶️','🫙','🍵','☕','🧃'];

  const saveNew=()=>{
    if(!newItem.n.trim()) return;
    const item={
      id:'u'+Date.now(),
      n:newItem.n,e:newItem.e,
      qty:parseFloat(newItem.qty)||0,
      max:parseFloat(newItem.max)||parseFloat(newItem.qty)||100,
      unit:newItem.unit||'г',
      cat:newItem.cat,
      low:parseFloat(newItem.low)||10,
    };
    onAddItem(item);
    setNewItem({n:'',e:'🥫',qty:'',max:'',unit:'г',cat:cats[0]||'Крупы и консервы',low:''});
    setShowAdd(false);
  };

  return (
    <div>
      <div className="pt">🗄️ Мои полочки</div>
      <div className="ps">что есть дома прямо сейчас · нажми ✏️ чтобы изменить количество</div>
      <div className="div"/>

      <div style={{display:'flex',gap:9,marginBottom:14,flexWrap:'wrap'}}>
        {low.length>0&&<span className="tag" style={{background:'rgba(232,133,90,.1)',borderColor:'var(--tr2)',color:'var(--tr)'}}>⚠ почти кончается: {low.map(p=>p.n).join(', ')}</span>}
        {empty.length>0&&<span className="tag" style={{background:'rgba(200,120,120,.1)',borderColor:'#C4A0A0',color:'#8B3030'}}>✕ закончилось: {empty.map(p=>p.n).join(', ')}</span>}
        <span className="tag">📦 всего {pantry.length} позиций</span>
      </div>

      <div className="pantry-legend">
        <span><span className="pl-dot" style={{background:'var(--sage2)'}}/> в наличии</span>
        <span><span className="pl-dot" style={{background:'#D4A843'}}/> меньше половины</span>
        <span><span className="pl-dot" style={{background:'var(--tr2)'}}/> почти кончается</span>
        <span><span className="pl-dot" style={{background:'#C4A0A0'}}/> закончилось</span>
      </div>

      <button className="pantry-add-btn" onClick={()=>setShowAdd(s=>!s)}>
        <span style={{fontSize:'1.2rem'}}>＋</span> добавить продукт на полочку
      </button>

      {showAdd&&(
        <div style={{background:'var(--ww)',border:'1.5px solid var(--rose3)',borderRadius:16,padding:18,marginBottom:18,boxShadow:'0 2px 10px var(--shadow)'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'var(--brown)',fontStyle:'italic',marginBottom:14}}>Новый продукт</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:12}}>
            {PANTRY_EMOJI.map(e=>(
              <button key={e} onClick={()=>setNewItem(p=>({...p,e}))}
                style={{background:newItem.e===e?'var(--rosebg)':'var(--cream)',border:`1.5px solid ${newItem.e===e?'var(--rose3)':'var(--brd)'}`,borderRadius:8,padding:'3px 6px',fontSize:'1rem',cursor:'pointer'}}>
                {e}
              </button>
            ))}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:12}}>
            <input className="form-inp" style={{flex:2,minWidth:140}} value={newItem.n} onChange={setNI('n')} placeholder="Название продукта..."/>
            <input className="form-inp-sm" value={newItem.qty} onChange={setNI('qty')} placeholder="Кол-во" type="number" min="0"/>
            <input className="form-inp-sm" value={newItem.unit} onChange={setNI('unit')} placeholder="г/мл/шт"/>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:14}}>
            <div style={{flex:1}}>
              <label className="form-label">Категория</label>
              <select className="form-inp" value={newItem.cat} onChange={setNI('cat')} style={{cursor:'pointer'}}>
                {[...cats,'+ новая'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Макс. количество</label>
              <input className="form-inp-sm" value={newItem.max} onChange={setNI('max')} placeholder="Макс" type="number" min="0"/>
            </div>
            <div>
              <label className="form-label">Порог «мало»</label>
              <input className="form-inp-sm" value={newItem.low} onChange={setNI('low')} placeholder="Порог" type="number" min="0"/>
            </div>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn-save" onClick={saveNew}>добавить ✓</button>
            <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'Lora',serif",fontSize:'.9rem',color:'var(--txt3)'}}>отмена</button>
          </div>
        </div>
      )}

      {cats.map(cat=>(
        <ShelfSection key={cat} shelf={{cat, items:pantry.filter(p=>p.cat===cat)}} onEdit={onEditQty} onDelete={onDeleteItem}/>
      ))}
    </div>
  );
}
