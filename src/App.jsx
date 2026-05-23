// ─── APP ─────────────────────────────────────────────────────────────────

const TABS=[
  {k:'home',     l:'Главная',  i:'🏠'},
  {k:'recipes',  l:'Рецепты',  i:'📖'},
  {k:'safe',     l:'Safe Food',i:'🫧'},
  {k:'ratings',  l:'Оценки',   i:'⭐'},
  {k:'plan',     l:'Меню',     i:'📅'},
  {k:'kbju',     l:'КБЖУ',     i:'📊'},
  {k:'diary',    l:'Дневник',  i:'📓'},
  {k:'shopping', l:'Список',   i:'🛒'},
  {k:'pantry',   l:'Полочки',  i:'🗄️'},
  {k:'wishlist', l:'Хочу',     i:'✨'},
  {k:'cassettes',l:'Кассеты',  i:'📼'},
];

const COLLECTION_DEFAULTS={
  recipes:()=>BASE_RECIPES,
  pantry:()=>INIT_PANTRY,
  customCategories:()=>INIT_CUSTOM_CATS,
  shopping:()=>INIT_SHOP,
  wishes:()=>WISHES_DATA,
  channels:()=>CHANNELS,
  diary:()=>({}),
};

const isEmptyCollection=(name,value)=>{
  if(name==='diary') return !value||Object.keys(value).length===0;
  return !Array.isArray(value)||value.length===0;
};

const normalizeCollection=(name,value,useDefaults)=>{
  if(name==='diary') return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
  if(Array.isArray(value)) return value;
  return useDefaults?COLLECTION_DEFAULTS[name]():[];
};

function App(){
  const [tab,setTab]=useState('home');
  const [recipes,setRecipes]=useState(BASE_RECIPES);
  const [pantry,setPantry]=useState(INIT_PANTRY);
  const [customCats,setCustomCats]=useState(INIT_CUSTOM_CATS);
  const [shoppingItems,setShoppingItems]=useState(INIT_SHOP);
  const [wishes,setWishes]=useState(WISHES_DATA);
  const [channels,setChannels]=useState(CHANNELS);
  const [diaryEntries,setDiaryEntries]=useState({});
  const [openRecipe,setOpenRecipe]=useState(null);
  const [editRecipe,setEditRecipe]=useState(null);  // null | {} новый | объект для редакт.
  const [loading,setLoading]=useState(true);
  const [saveStatus,setSaveStatus]=useState('загрузка...');
  const hydrated=useRef(false);
  const saveTimers=useRef({});

  const replaceCollection=(name,payload)=>fetch(`/api/${name}`,{
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload),
  }).then(res=>{
    if(!res.ok) throw new Error(`Failed to save ${name}`);
    return res.json();
  });

  const queueSave=(name,payload)=>{
    if(!hydrated.current) return;
    clearTimeout(saveTimers.current[name]);
    setSaveStatus('сохранение...');
    saveTimers.current[name]=setTimeout(()=>{
      replaceCollection(name,payload)
        .then(()=>setSaveStatus('сохранено'))
        .catch(()=>setSaveStatus('ошибка сохранения'));
    },400);
  };

  useEffect(()=>{
    let cancelled=false;
    fetch('/api/bootstrap')
      .then(res=>{
        if(!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then(data=>{
        if(cancelled) return;
        const names=Object.keys(COLLECTION_DEFAULTS);
        const firstRun=names.every(name=>isEmptyCollection(name,data?.[name]));
        const next=Object.fromEntries(names.map(name=>[
          name,
          firstRun?COLLECTION_DEFAULTS[name]():normalizeCollection(name,data?.[name],false),
        ]));

        setRecipes(next.recipes);
        setPantry(next.pantry);
        setCustomCats(next.customCategories);
        setShoppingItems(next.shopping);
        setWishes(next.wishes);
        setChannels(next.channels);
        setDiaryEntries(next.diary);
        hydrated.current=true;
        setLoading(false);
        setSaveStatus(firstRun?'сохранение...':'сохранено');

        if(firstRun){
          Promise.all(names.map(name=>replaceCollection(name,next[name])))
            .then(()=>!cancelled&&setSaveStatus('сохранено'))
            .catch(()=>!cancelled&&setSaveStatus('ошибка сохранения'));
        }
      })
      .catch(()=>{
        if(cancelled) return;
        hydrated.current=true;
        setLoading(false);
        setSaveStatus('нет связи с API');
      });
    return ()=>{
      cancelled=true;
      Object.values(saveTimers.current).forEach(clearTimeout);
    };
  },[]);

  useEffect(()=>queueSave('recipes',recipes),[recipes]);
  useEffect(()=>queueSave('pantry',pantry),[pantry]);
  useEffect(()=>queueSave('customCategories',customCats),[customCats]);
  useEffect(()=>queueSave('shopping',shoppingItems),[shoppingItems]);
  useEffect(()=>queueSave('wishes',wishes),[wishes]);
  useEffect(()=>queueSave('channels',channels),[channels]);
  useEffect(()=>queueSave('diary',diaryEntries),[diaryEntries]);

  const rate=(id,rating)=>setRecipes(p=>p.map(r=>r.id===id?{...r,rating:r.rating===rating?null:rating}:r));
  const addNote=(id,note)=>setRecipes(p=>p.map(r=>r.id===id?{...r,myNotes:[...(r.myNotes||[]),note]}:r));

  const saveRecipe=updated=>{
    setRecipes(p=>{
      const idx=p.findIndex(r=>r.id===updated.id);
      if(idx===-1) return [...p,{...updated,id:Date.now(),baseServ:updated.baseServ||2,myNotes:[]}];
      return p.map(r=>r.id===updated.id?updated:r);
    });
  };
  const deleteRecipe=id=>setRecipes(p=>p.filter(r=>r.id!==id));

  const addMissing=(missing,recipeName)=>{
    const newItems=missing.map((ing,i)=>({
      id:Date.now()+i,name:ing.n,amount:`для: ${recipeName}`,price:0,cat:'Из рецепта',done:false
    }));
    setShoppingItems(p=>{
      const existing=new Set(p.map(i=>i.name.toLowerCase()));
      return [...p,...newItems.filter(i=>!existing.has(i.name.toLowerCase()))];
    });
    setTab('shopping');
  };

  const cookRecipe=(ingredients,scale)=>{
    setPantry(prev=>prev.map(p=>{
      const used=ingredients.find(i=>
        p.n.toLowerCase().includes(i.n.toLowerCase())||i.n.toLowerCase().includes(p.n.toLowerCase())
      );
      if(!used) return p;
      return {...p, qty:Math.max(0, Math.round((p.qty - used.amt*scale)*10)/10)};
    }));
  };

  const editPantryQty=(id,newQty)=>setPantry(prev=>prev.map(p=>p.id===id?{...p,qty:newQty}:p));
  const addPantryItem=item=>setPantry(prev=>[...prev,item]);
  const deletePantryItem=id=>setPantry(prev=>prev.filter(p=>p.id!==id));

  const currentRecipe=openRecipe?recipes.find(r=>r.id===openRecipe.id)||openRecipe:null;

  return (
    <div>
      <style>{S}</style>
      <GrainOverlay/>
      <Stars/>
      <div className="app">
        <header className="hdr">
          <div className="hdr-in">
            <div className="logo">
              🌸 моя кухня <span>· уютно · вкусно ·</span>
            </div>
            <span className="tag" style={{whiteSpace:'nowrap'}}>{saveStatus}</span>
            <nav className="nav">
              {TABS.map(t=>(
                <button key={t.k} className={`nb ${tab===t.k?'on':''}`} onClick={()=>setTab(t.k)}>
                  {t.i} {t.l}
                </button>
              ))}
            </nav>
          </div>
        </header>
        <main className="main">
          {loading&&(
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',color:'var(--brown)',fontStyle:'italic'}}>
              Загружаю кухню...
            </div>
          )}
          {!loading&&tab==='home'      && <HomePage recipes={recipes} pantry={pantry} channels={channels} setTab={setTab} onOpen={r=>setOpenRecipe(r)}/>}
          {!loading&&tab==='recipes'   && <RecipesPage recipes={recipes} onOpen={r=>setOpenRecipe(r)}
                                  onEdit={r=>setEditRecipe(r)} onDelete={deleteRecipe}
                                  onAdd={()=>setEditRecipe({})}
                                  customCats={customCats} onUpdateCats={setCustomCats}/>}
          {!loading&&tab==='safe'      && <SafeFoodPage recipes={recipes} onOpen={r=>setOpenRecipe(r)}/>}
          {!loading&&tab==='ratings'   && <RatingsPage recipes={recipes} onOpen={r=>setOpenRecipe(r)}/>}
          {!loading&&tab==='plan'      && <PlanPage/>}
          {!loading&&tab==='kbju'      && <KBJUPage/>}
          {!loading&&tab==='diary'     && <DiaryPage entries={diaryEntries} setEntries={setDiaryEntries}/>}
          {!loading&&tab==='shopping'  && <ShoppingPage items={shoppingItems} setItems={setShoppingItems}/>}
          {!loading&&tab==='pantry'    && <PantryPage pantry={pantry} onEditQty={editPantryQty}
                                  onAddItem={addPantryItem} onDeleteItem={deletePantryItem}/>}
          {!loading&&tab==='wishlist'  && <WishlistPage wishes={wishes} setWishes={setWishes}/>}
          {!loading&&tab==='cassettes' && <CassettesPage channels={channels} setChannels={setChannels}/>}
        </main>
      </div>

      {currentRecipe&&(
        <RecipeModal
          recipe={currentRecipe}
          onClose={()=>setOpenRecipe(null)}
          onRate={rate}
          onAddMissing={addMissing}
          pantry={pantry}
          onCook={cookRecipe}
          onAddNote={addNote}
        />
      )}

      {editRecipe!==null&&(
        <EditRecipeModal
          recipe={editRecipe}
          onClose={()=>setEditRecipe(null)}
          onSave={saveRecipe}
          onDelete={deleteRecipe}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
