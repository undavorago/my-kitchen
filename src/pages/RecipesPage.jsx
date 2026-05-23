function Highlight({text, query}){
  if(!query) return <span>{text}</span>;
  const idx=text.toLowerCase().indexOf(query.toLowerCase());
  if(idx===-1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0,idx)}
      <span className="search-highlight">{text.slice(idx,idx+query.length)}</span>
      {text.slice(idx+query.length)}
    </span>
  );
}

function RecipeCardSearch({r, onClick, query, onEdit}){
  return (
    <div className="rc" onClick={onClick}>
      <div className="rc-img">
        <span>{r.emoji}</span>
        <span className="rc-cat">{r.cat}</span>
        {r.video&&<span className="rc-vid">▶ видео</span>}
        {r.rating==='love'&&<span className="rc-love">🔥</span>}
        {r.safefood&&<span className="rc-safe">🫧 safe</span>}
        {onEdit&&(
          <div className="rc-actions">
            <button className="rc-act-btn" title="Редактировать"
              onClick={e=>{e.stopPropagation();onEdit();}}>✏️</button>
          </div>
        )}
      </div>
      <div className="rc-body">
        <div className="rc-name"><Highlight text={r.name} query={query}/></div>
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

function CustomCatChip({cc, active, onClick}){
  const p=CAT_PALETTE[cc.pi%CAT_PALETTE.length];
  return (
    <button className={`custcat-chip ${active?'active':''}`}
      style={active
        ?{background:p.border,borderColor:p.border,color:'white'}
        :{background:p.bg,borderColor:p.border,color:p.text}}
      onClick={onClick}>
      {cc.emoji} {cc.name}
      {active&&<span style={{fontSize:'.8rem',marginLeft:2}}>({cc.recipes.length})</span>}
    </button>
  );
}

const EMOJI_OPTIONS=['⚡','🕯️','🌱','🎉','❤️','🌙','☀️','🏠','🍰','🥗','🍲','🌶️','🧁','🫖','💪','👩‍🍳'];

function RecipesPage({recipes, onOpen, onEdit, onDelete, onAdd, customCats, onUpdateCats}){
  const [cat,setCat]=useState('Все');
  const [activeCustCat,setActiveCustCat]=useState(null);
  const [query,setQuery]=useState('');
  const [showCatManager,setShowCatManager]=useState(false);
  const [newCatName,setNewCatName]=useState('');
  const [newCatEmoji,setNewCatEmoji]=useState('⚡');
  const [newCatPi,setNewCatPi]=useState(0);
  const [assignMode,setAssignMode]=useState(null);

  let list=recipes;
  if(activeCustCat){
    const cc=customCats.find(c=>c.id===activeCustCat);
    list=cc?recipes.filter(r=>cc.recipes.includes(r.id)):recipes;
  } else if(cat!=='Все'){
    list=recipes.filter(r=>r.cat===cat);
  }
  if(query.trim()){
    const q=query.toLowerCase();
    list=list.filter(r=>
      r.name.toLowerCase().includes(q)||
      r.cat.toLowerCase().includes(q)||
      (r.tags||[]).some(t=>t.toLowerCase().includes(q))||
      (r.notes||'').toLowerCase().includes(q)
    );
  }

  const addCat=()=>{
    if(!newCatName.trim()) return;
    const nc={id:'cc'+Date.now(),name:newCatName.trim(),emoji:newCatEmoji,pi:newCatPi,recipes:[]};
    onUpdateCats([...customCats,nc]);
    setNewCatName(''); setNewCatEmoji('⚡'); setNewCatPi(0);
  };
  const deleteCat=id=>onUpdateCats(customCats.filter(c=>c.id!==id));
  const toggleRecipeInCat=(catId,recipeId)=>{
    onUpdateCats(customCats.map(c=>c.id!==catId?c:{
      ...c,recipes:c.recipes.includes(recipeId)?c.recipes.filter(x=>x!==recipeId):[...c.recipes,recipeId]
    }));
  };

  return (
    <div>
      <div className="pt">📖 Рецепты</div>
      <div className="ps">нажми на карточку, чтобы открыть полный рецепт</div>
      <div className="div"/>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search-inp" placeholder="поиск по названию, категории, тегу..."
          value={query} onChange={e=>setQuery(e.target.value)}/>
        {query&&<button className="search-clear" onClick={()=>setQuery('')}>✕</button>}
      </div>

      {!query&&(
        <div>
          <div className="ctabs">
            {CATS.map(c=>(
              <button key={c} className={`ct ${cat===c&&!activeCustCat?'on':''}`}
                onClick={()=>{setCat(c);setActiveCustCat(null);}}>
                {CEMOJI[c]} {c}
              </button>
            ))}
          </div>

          {customCats.length>0&&(
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16,alignItems:'center'}}>
              <span style={{fontFamily:"'Caveat',cursive",fontSize:'.82rem',color:'var(--txt3)'}}>мои папки:</span>
              {customCats.map(cc=>(
                <CustomCatChip key={cc.id} cc={cc}
                  active={activeCustCat===cc.id}
                  onClick={()=>setActiveCustCat(activeCustCat===cc.id?null:cc.id)}/>
              ))}
              <button onClick={()=>setShowCatManager(m=>!m)}
                style={{background:'none',border:'1px dashed var(--brd)',borderRadius:18,
                  padding:'4px 12px',fontFamily:"'Caveat',cursive",fontSize:'.82rem',
                  color:'var(--txt3)',cursor:'pointer'}}>
                {showCatManager?'✕ закрыть':'+ управление'}
              </button>
            </div>
          )}

          {showCatManager&&(
            <div className="custcat-section">
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'var(--brn)',fontStyle:'italic',marginBottom:12}}>
                Создать новую папку
              </div>
              <div className="custcat-emoji-pick">
                {EMOJI_OPTIONS.map(e=>(
                  <button key={e} className={`ep-btn ${newCatEmoji===e?'on':''}`}
                    onClick={()=>setNewCatEmoji(e)}>{e}</button>
                ))}
              </div>
              <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
                {CAT_PALETTE.map((p,i)=>(
                  <button key={i} onClick={()=>setNewCatPi(i)}
                    style={{width:24,height:24,borderRadius:'50%',background:p.border,
                      border:`3px solid ${newCatPi===i?'var(--brn)':'transparent'}`,
                      cursor:'pointer',transition:'border .15s'}}/>
                ))}
              </div>
              <div className="custcat-add">
                <input className="inp" placeholder="название папки..." value={newCatName}
                  onChange={e=>setNewCatName(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&addCat()}/>
                <button className="btn btn-p" onClick={addCat}>создать</button>
              </div>
              {customCats.length>0&&(
                <div style={{marginTop:14}}>
                  <div style={{fontFamily:"'Caveat',cursive",fontSize:'.85rem',color:'var(--txt3)',marginBottom:8}}>существующие папки:</div>
                  <div className="custcat-list">
                    {customCats.map(cc=>{
                      const p=CAT_PALETTE[cc.pi%CAT_PALETTE.length];
                      return (
                        <span key={cc.id} className="custcat-chip"
                          style={{background:p.bg,borderColor:p.border,color:p.text,cursor:'default'}}>
                          {cc.emoji} {cc.name} ({cc.recipes.length})
                          <button className="custcat-del" onClick={()=>deleteCat(cc.id)}>✕</button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {!customCats.length&&(
            <div style={{marginBottom:16}}>
              <button onClick={()=>setShowCatManager(true)}
                style={{background:'none',border:'1px dashed var(--brd)',borderRadius:18,
                  padding:'5px 14px',fontFamily:"'Caveat',cursive",fontSize:'.84rem',
                  color:'var(--txt3)',cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                📁 создать свою папку с рецептами
              </button>
            </div>
          )}
        </div>
      )}

      {query&&<div className="search-count">найдено: {list.length} рецептов</div>}

      {activeCustCat&&!query&&(
        <div style={{marginBottom:14,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:"'Caveat',cursive",fontSize:'.88rem',color:'var(--txt3)'}}>
            нажми на карточку чтобы открыть · или
          </span>
          <button onClick={()=>setAssignMode(assignMode?null:activeCustCat)}
            style={{background:assignMode?'var(--tr)':'var(--parch)',border:'1px solid var(--brd)',
              borderRadius:18,padding:'4px 14px',fontFamily:"'Caveat',cursive",fontSize:'.84rem',
              color:assignMode?'white':'var(--txt2)',cursor:'pointer',transition:'all .15s'}}>
            {assignMode?'✕ готово':'+ добавить рецепты в папку'}
          </button>
        </div>
      )}

      <div className="rgrid">
        {list.map(r=>{
          const inCat=assignMode&&customCats.find(c=>c.id===assignMode)?.recipes.includes(r.id);
          return (
            <div key={r.id} style={{position:'relative'}}>
              {assignMode&&(
                <div onClick={()=>toggleRecipeInCat(assignMode,r.id)}
                  style={{position:'absolute',inset:0,zIndex:10,borderRadius:15,
                    border:`2.5px solid ${inCat?'var(--sage)':'var(--brd)'}`,
                    background:inCat?'rgba(107,140,110,.08)':'transparent',
                    cursor:'pointer',display:'flex',alignItems:'flex-start',
                    justifyContent:'flex-end',padding:8}}>
                  <div style={{width:22,height:22,borderRadius:'50%',
                    background:inCat?'var(--sage)':'white',
                    border:`2px solid ${inCat?'var(--sage)':'var(--brd)'}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:'white',fontSize:'.8rem',fontWeight:700}}>
                    {inCat&&'✓'}
                  </div>
                </div>
              )}
              <RecipeCardSearch r={r} onClick={()=>!assignMode&&onOpen(r)} query={query}
                onEdit={!assignMode?()=>onEdit&&onEdit(r):null}/>
            </div>
          );
        })}
        {!assignMode&&<button className="add-rc" onClick={()=>onAdd&&onAdd()}><span style={{fontSize:'1.7rem'}}>＋</span><span>новый рецепт</span></button>}
      </div>

      {list.length===0&&(
        <div style={{textAlign:'center',padding:'40px 20px',fontFamily:"'Caveat',cursive",fontSize:'1rem',color:'var(--txt3)'}}>
          {query?`ничего не нашлось по «${query}» 🔍`:'в этой папке пока пусто'}
        </div>
      )}
    </div>
  );
}
