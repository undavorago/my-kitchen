function CassetteCard({ch, onEdit, onDelete}){
  const [body,label,labelTxt,notch,win]=PALETTES[ch.pi];
  return (
    <div className="cwrap" style={{cursor:'pointer'}}>
      <div className="cshell">
        <div className="cbody" style={{background:body}}/>
        <div className="cnotch" style={{background:notch}}/>
        <div className="clabel" style={{background:label}}>
          <div className="cls" style={{top:'30%'}}/><div className="cls" style={{top:'68%'}}/>
          <div className="cchn" style={{color:labelTxt}}>{ch.name}</div>
          <div className="cctp" style={{color:labelTxt}}>◉ {ch.type}</div>
        </div>
        <div className="cwin" style={{background:win}}>
          <div className="reel" style={{background:win}}/><div className="reel" style={{background:win}}/>
        </div>
        <div className="ctape"/>
        <div className="cscr tl"/><div className="cscr tr"/><div className="cscr bl"/><div className="cscr br"/>
      </div>
      <div className="cinfo">
        <div className="cname">{ch.name}</div>
        <div className="cdesc">{ch.desc}</div>
        <div className="ctags">{ch.tags.map(t=><span key={t} className="ctag">#{t}</span>)}</div>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <a className="clink" href={ch.url} target="_blank" rel="noreferrer">▶ открыть</a>
          <div className="cinfo-actions">
            <button className="c-act-btn" onClick={()=>onEdit&&onEdit(ch)}>✏️ изменить</button>
            <button className="c-act-btn del" onClick={()=>onDelete&&onDelete(ch.id)}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditCassetteModal({ch, onClose, onSave}){
  const [form,setForm]=useState({
    name:ch?.name||'',type:ch?.type||'YouTube',
    desc:ch?.desc||'',url:ch?.url||'',
    tags:ch?.tags?.join(', ')||'',pi:ch?.pi??0,
  });
  const setF=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(!form.name.trim()||!form.url.trim()) return;
    onSave({
      ...(ch||{}),
      id:ch?.id||Date.now(),
      name:form.name,type:form.type,
      desc:form.desc,url:form.url,
      tags:form.tags.split(',').map(t=>t.trim()).filter(Boolean),
      pi:form.pi,
    });
    onClose();
  };
  return (
    <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="edit-modal" style={{maxWidth:480}}>
        <div className="mhdr">
          <span className="m-emoji">📼</span>
          <div className="m-title" style={{fontSize:'1.1rem'}}>{ch?.id?'Редактировать кассету':'Новая кассета'}</div>
          <button className="m-close" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div style={{marginBottom:14}}>
            <label className="form-label">Цвет кассеты</label>
            <div style={{display:'flex',gap:8}}>
              {PALETTES.map(([body],i)=>(
                <button key={i} onClick={()=>setForm(p=>({...p,pi:i}))}
                  style={{width:28,height:28,borderRadius:'50%',background:body,border:`3px solid ${form.pi===i?'var(--rose)':'transparent'}`,cursor:'pointer',transition:'border .15s'}}/>
              ))}
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <label className="form-label">Название *</label>
            <input className="form-inp" value={form.name} onChange={setF('name')} placeholder="Название канала или сайта..."/>
          </div>
          <div style={{display:'flex',gap:10,marginBottom:12}}>
            <div style={{flex:1}}>
              <label className="form-label">Тип</label>
              <select className="form-inp" value={form.type} onChange={setF('type')} style={{cursor:'pointer'}}>
                {['YouTube','Сайт','Блог'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <label className="form-label">Ссылка *</label>
            <input className="form-inp" value={form.url} onChange={setF('url')} placeholder="https://..."/>
          </div>
          <div style={{marginBottom:12}}>
            <label className="form-label">Описание</label>
            <textarea className="form-ta" style={{minHeight:52}} value={form.desc} onChange={setF('desc')} placeholder="Коротко о чём..."/>
          </div>
          <div style={{marginBottom:18}}>
            <label className="form-label">Теги (через запятую)</label>
            <input className="form-inp" value={form.tags} onChange={setF('tags')} placeholder="выпечка, десерты, техники..."/>
          </div>
          <button className="btn-save" onClick={save}>сохранить ✓</button>
        </div>
      </div>
    </div>
  );
}

function CassettesPage({channels, setChannels}){
  const [filter,setFilter]=useState('Все');
  const [editCh,setEditCh]=useState(null);   // null | {} для новой | объект для редакт.
  const [showEdit,setShowEdit]=useState(false);

  const list=filter==='Все'?channels:channels.filter(c=>c.type===filter);

  const saveCh=ch=>{
    setChannels(p=>{
      const idx=p.findIndex(c=>c.id===ch.id);
      if(idx===-1) return [...p,ch];
      return p.map(c=>c.id===ch.id?ch:c);
    });
  };
  const delCh=id=>setChannels(p=>p.filter(c=>c.id!==id));
  const openNew=()=>{setEditCh({});setShowEdit(true);};
  const openEdit=ch=>{setEditCh(ch);setShowEdit(true);};

  return (
    <div>
      <div className="pt">📼 Полочка с кассетами</div>
      <div className="ps">каналы и сайты, где я нахожу вдохновение</div>
      <div className="div"/>
      <div className="cf">
        {['Все','YouTube','Сайт','Блог'].map(t=>(
          <button key={t} className={`cfb ${filter===t?'on':''}`} onClick={()=>setFilter(t)}>
            {t==='YouTube'?'▶ ':t==='Сайт'?'🌐 ':t==='Блог'?'📝 ':''}{t}
          </button>
        ))}
      </div>
      <div className="cgrid">
        {list.map(ch=><CassetteCard key={ch.id} ch={ch} onEdit={openEdit} onDelete={delCh}/>)}
        <div className="add-cc" onClick={openNew}><span style={{fontSize:'2.2rem'}}>📼</span><span>добавить канал</span></div>
      </div>
      <div className="decor" style={{marginTop:28}}>~ нажми на кассету, чтобы открыть канал ~</div>
      {showEdit&&<EditCassetteModal ch={editCh} onClose={()=>setShowEdit(false)} onSave={saveCh}/>}
    </div>
  );
}
