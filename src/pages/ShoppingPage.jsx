function ShoppingPage({items, setItems}){
  const [nw,setNw]=useState('');
  const [newCat,setNewCat]=useState('🥬 Овощи и фрукты');
  const [showHousehold,setShowHousehold]=useState(false);
  const budget=3000;
  const total=items.reduce((s,i)=>s+i.price,0);
  const spent=items.filter(i=>i.done).reduce((s,i)=>s+i.price,0);
  const toggle=id=>setItems(p=>p.map(i=>i.id===id?{...i,done:!i.done}:i));
  const remove=id=>setItems(p=>p.filter(i=>i.id!==id));
  const add=()=>{if(!nw.trim())return;setItems(p=>[...p,{id:Date.now(),name:nw,amount:'',price:0,cat:newCat,done:false}]);setNw('');};
  const addHousehold=(label)=>{
    const name=label.replace(/^.\s/,'');
    setItems(p=>{
      if(p.find(i=>i.name.toLowerCase()===name.toLowerCase())) return p;
      return[...p,{id:Date.now(),name,amount:'1 шт',price:0,cat:'🧹 Бытовое',done:false}];
    });
  };
  const byCat=items.reduce((a,i)=>{(a[i.cat]=a[i.cat]||[]).push(i);return a;},[]);
  return (
    <div>
      <div className="pt">🛒 Список продуктов</div>
      <div className="ps">что купить и сколько потратить</div>
      <div className="div"/>
      <div className="bw">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:10}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'var(--brn)'}}>Бюджет на неделю</span>
          <span style={{fontFamily:"'Caveat',cursive",fontSize:'1.15rem'}}><span style={{color:'var(--tr)'}}>{total} ₽</span><span style={{color:'var(--txt3)'}}> / {budget} ₽</span></span>
        </div>
        <div className="bb"><div className="bf" style={{width:`${Math.min((total/budget)*100,100)}%`}}/></div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:5,fontFamily:"'Caveat',cursive",fontSize:'.8rem',color:'var(--txt3)'}}>
          <span>✅ куплено на {spent} ₽</span><span>осталось {budget-total} ₽</span>
        </div>
      </div>
      <div className="sl2">
        <div className="slc">
          <div className="slh">
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:'.95rem',color:'var(--brn)',fontStyle:'italic'}}>Список покупок</span>
            <span style={{fontFamily:"'Caveat',cursive",fontSize:'.82rem',color:'var(--txt3)'}}>{items.filter(i=>i.done).length}/{items.length}</span>
          </div>
          {items.map(item=>(
            <div key={item.id} className="si2">
              <div className={`scb ${item.done?'ck':''}`} onClick={()=>toggle(item.id)}>{item.done&&'✓'}</div>
              <span className={`sn ${item.done?'dn':''}`}>{item.name}</span>
              <span className="sa">{item.amount}</span>
              <span className="sp">{item.price>0?`${item.price} ₽`:'—'}</span>
            </div>
          ))}
          <div className="air" style={{flexDirection:'column',gap:8}}>
            <div style={{display:'flex',gap:7,width:'100%'}}>
              <input className="inp" placeholder="добавить продукт..." value={nw} onChange={e=>setNw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/>
              <button className="ab" onClick={add}>+</button>
            </div>
            <select value={newCat} onChange={e=>setNewCat(e.target.value)}
              style={{width:'100%',border:'1px solid var(--brd)',borderRadius:8,padding:'6px 10px',fontFamily:"'Caveat',cursive",fontSize:'.9rem',background:'var(--cream)',color:'var(--txt2)',outline:'none',cursor:'pointer'}}>
              {SHOP_CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          
          <div style={{borderTop:'1px solid var(--brd)'}}>
            <button onClick={()=>setShowHousehold(h=>!h)}
              style={{width:'100%',background:'none',border:'none',padding:'12px 18px',display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontFamily:"'Caveat',cursive",fontSize:'.9rem',color:'var(--txt2)'}}>
              <span style={{fontSize:'1.1rem'}}>🧹</span>
              <span>Быстро добавить бытовое</span>
              <span style={{marginLeft:'auto'}}>{showHousehold?'▲':'▼'}</span>
            </button>
            {showHousehold&&(
              <div style={{padding:'0 14px 14px',display:'flex',flexWrap:'wrap',gap:7}}>
                {HOUSEHOLD_QUICK.map(label=>(
                  <HouseholdBtn key={label} label={label} items={items} onAdd={addHousehold}/>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="sside">
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'.95rem',color:'var(--brn)',fontStyle:'italic',marginBottom:14}}>По категориям</div>
          {Object.entries(byCat).map(([c,ci])=>(
            <div key={c} style={{marginBottom:13}}>
              <div style={{fontFamily:"'Caveat',cursive",fontSize:'.88rem',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5,paddingBottom:3,borderBottom:'1px solid var(--brd)'}}>{c}</div>
              {ci.map(item=>(
                <div key={item.id} style={{display:'flex',alignItems:'center',gap:7,fontSize:'.78rem',color:'var(--txt2)',padding:'3px 4px',borderRadius:5,cursor:'pointer'}}
                  onClick={()=>toggle(item.id)}
                  onMouseOver={e=>e.currentTarget.style.background='var(--parch)'}
                  onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                  <span>{item.done?'✓':'○'}</span>
                  <span style={{textDecoration:item.done?'line-through':'none',opacity:item.done?.5:1}}>{item.name}</span>
                  <span style={{marginLeft:'auto',fontFamily:"'Caveat',cursive",color:'var(--txt3)'}}>{item.amount}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="exp-wrap">
        <div className="sec">📈 История расходов</div>
        <div className="exp-bars">
          {EXPENSE_HISTORY.map((m,i)=>(
            <ExpBar key={i} m={m} maxTotal={Math.max(...EXPENSE_HISTORY.map(x=>x.food+x.house))}/>
          ))}
        </div>
        <div className="exp-legend">
          <div className="exp-legend-item"><div className="exp-dot" style={{background:'var(--sage2)'}}/> Еда</div>
          <div className="exp-legend-item"><div className="exp-dot" style={{background:'var(--blush)'}}/> Бытовое</div>
          <div style={{marginLeft:'auto',fontFamily:"'Caveat',cursive",fontSize:'.82rem',color:'var(--txt3)'}}>
            средняя: {Math.round(EXPENSE_HISTORY.slice(0,-1).reduce((s,m)=>s+m.food+m.house,0)/5)} ₽/мес
          </div>
        </div>
      </div>
    </div>
  );
}
