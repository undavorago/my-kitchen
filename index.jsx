const { useState, useEffect, useMemo } = React;



const DB_NAME='my-kitchen-db';
const DB_STORE='kv';
const STORAGE_KEY='my-kitchen-fallback-v1';

function openDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{req.result.createObjectStore(DB_STORE)};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

async function idbGet(key){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(DB_STORE,'readonly');
    const rq=tx.objectStore(DB_STORE).get(key);
    rq.onsuccess=()=>resolve(rq.result);
    rq.onerror=()=>reject(rq.error);
  });
}
async function idbSet(key,val){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(DB_STORE,'readwrite');
    tx.objectStore(DB_STORE).put(val,key);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
  });
}

function usePersistentState(key, initial){
  const [state,setState]=useState(initial);
  const [ready,setReady]=useState(false);
  useEffect(()=>{(async()=>{try{
    const idb=await idbGet(key);
    if(idb!==undefined) setState(idb);
    else {
      const raw=localStorage.getItem(STORAGE_KEY+':'+key);
      if(raw) setState(JSON.parse(raw));
    }
  }catch(e){
    const raw=localStorage.getItem(STORAGE_KEY+':'+key);
    if(raw) try{setState(JSON.parse(raw));}catch{}
  } finally {setReady(true);} })();},[key]);
  useEffect(()=>{if(!ready) return; (async()=>{try{await idbSet(key,state);}catch{} localStorage.setItem(STORAGE_KEY+':'+key,JSON.stringify(state));})();},[key,state,ready]);
  return [state,setState,ready];
}
const S = `
@import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600;700&family=Caveat:wght@400;600&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}

:root{
  --bg:#FDF6EE;
  --bg2:#F7EDE0;
  --parch:#F0E4D0;
  --ww:#FFFAF4;
  --dark:#3D2B1F;
  --dark2:#4A3020;
  --dark3:#5A3A28;
  --rust:#B84030;
  --rust2:#D45A40;
  --rust3:#E88070;
  --gold:#B89040;
  --gold2:#D4AA50;
  --gold3:#F0CC70;
  --sage:#6A9070;
  --sage2:#8AAE8A;
  --sage3:#AACCAA;
  --rose:#C89898;
  --rose2:#E0B8B0;
  --rose3:#F8EDED;
  --lavender:#B8A8C8;
  --lavender2:#D8CCE8;
  --lavender3:#EEE8F8;
  --txt:#2E1E12;
  --txt2:#5A3A28;
  --txt3:#8A6A50;
  --brd:#DEC8A8;
  --brd2:#C8A888;
  --sh:rgba(62,40,20,.10);
  --tr:#B84030;
  --tr2:#D45A40;
  --brn:#3D2B1F;
  --blush:#C89898;
  --cream:#FFFAF4;
}

body{
  background:var(--bg);
  font-family:'Cormorant Garamond',serif;
  color:var(--txt);
  min-height:100vh;
}

.app{
  min-height:100vh;
  position:relative;
  background:var(--bg);
  background-image:
    radial-gradient(ellipse at 15% 10%,rgba(212,170,80,.04) 0%,transparent 55%),
    radial-gradient(ellipse at 85% 90%,rgba(184,168,200,.04) 0%,transparent 55%);
}

/* ── HEADER ── */
.hdr{
  background:var(--ww);
  border-bottom:1.5px solid var(--brd);
  padding:0 22px;
  position:sticky;top:0;z-index:200;
  box-shadow:0 2px 18px rgba(62,40,20,.08);
}
.hdr::after{
  content:'';
  display:block;
  position:absolute;
  bottom:-14px;left:0;right:0;height:14px;
  background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2214%22%3E%3Cpath%20d%3D%22M0%200%20Q7%2014%2014%200%20Q21%2014%2028%200%22%20fill%3D%22%23FFFAF4%22%20stroke%3D%22%23DEC8A8%22%20stroke-width%3D%221.2%22%2F%3E%3C%2Fsvg%3E");
  background-repeat:repeat-x;
  background-size:28px 14px;
  pointer-events:none;
  z-index:201;
}
.hdr-in{
  max-width:1240px;margin:0 auto;
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 0;gap:14px;flex-wrap:wrap;
}

.logo{
  font-family:'Pinyon Script',cursive;
  font-size:2.3rem;color:var(--rust);
  display:flex;align-items:center;gap:10px;
  letter-spacing:.02em;
}
.logo span{
  font-family:'Raleway',sans-serif;
  font-weight:300;font-style:normal;
  font-size:.68rem;color:var(--txt3);
  letter-spacing:.2em;text-transform:uppercase;
}
.logo-reel{
  width:14px;height:14px;border-radius:50%;
  border:1.5px solid var(--brd2);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
.logo-reel::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--brd2);}
.logo-tape{font-size:.5rem;color:var(--brd);letter-spacing:.1em;margin:0 2px;}

.nav{display:flex;gap:5px;flex-wrap:wrap;}
.nb{
  background:transparent;
  border:1.5px solid var(--brd);
  border-radius:20px;padding:5px 12px;
  font-family:'Raleway',sans-serif;
  font-size:.66rem;font-weight:500;
  color:var(--txt2);cursor:pointer;
  transition:all .2s;
  display:flex;align-items:center;gap:4px;
  white-space:nowrap;letter-spacing:.05em;text-transform:uppercase;
}
.nb::before{display:none;}
.nb:hover{background:var(--rose3);border-color:var(--rose2);color:var(--rust);}
.nb.on{
  background:var(--rose3);border-color:var(--rose2);color:var(--rust);
  box-shadow:0 2px 8px rgba(184,64,48,.1);
}

/* ── MAIN ── */
.main{max-width:1240px;margin:0 auto;padding:38px 20px 70px;}

/* ── TYPOGRAPHY ── */
.pt{
  font-family:'Pinyon Script',cursive;
  font-size:3.2rem;color:var(--rust);
  margin-bottom:3px;
}
.pt::after{
  content:'✦';font-size:.72rem;
  font-family:'Cormorant Garamond',serif;
  color:var(--gold2);
  margin-left:10px;vertical-align:middle;opacity:.65;
}
.ps{
  font-family:'Cormorant Garamond',serif;
  font-size:1.1rem;color:var(--txt3);
  margin-bottom:22px;font-style:italic;
}
.sec{
  font-family:'Raleway',sans-serif;
  font-size:.76rem;font-weight:600;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--txt2);
  margin-bottom:12px;
  display:flex;align-items:center;gap:8px;
}
.div{
  display:flex;align-items:center;gap:10px;
  margin-bottom:28px;
}
.div::before{content:'❧';font-size:1.1rem;color:var(--rose2);}
.div::after{content:'─── ✦ ─── ✦ ───';font-size:.62rem;color:var(--brd);letter-spacing:3px;}

.tag{
  display:inline-flex;align-items:center;
  background:var(--rose3);border:1px solid var(--rose2);
  border-radius:20px;padding:2px 12px;
  font-size:.68rem;font-family:'Raleway',sans-serif;font-weight:500;
  color:var(--rust);letter-spacing:.04em;
}

.btn{border:none;border-radius:20px;padding:8px 20px;
  font-family:'Raleway',sans-serif;font-size:.8rem;font-weight:500;
  cursor:pointer;transition:all .2s;letter-spacing:.05em;text-transform:uppercase;}
.btn-p{
  background:var(--rust);color:#FFF5F0;
  border:1.5px solid var(--rust2);
  box-shadow:0 2px 8px rgba(184,64,48,.2);
}
.btn-p:hover{background:var(--rust2);box-shadow:0 4px 14px rgba(184,64,48,.28);}

.inp{
  flex:1;border:1.5px solid var(--brd);
  border-radius:20px;padding:8px 16px;
  font-family:'Cormorant Garamond',serif;font-size:1rem;
  background:var(--ww);color:var(--txt);outline:none;transition:border-color .2s;
}
.inp:focus{border-color:var(--rose2);}

.decor{
  font-family:'Caveat',cursive;font-size:.9rem;
  color:var(--txt3);text-align:center;
  opacity:.65;padding:8px;letter-spacing:.03em;
}

/* ── STAT CARDS ── */
.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:24px;}
@media(max-width:700px){.stats{grid-template-columns:1fr 1fr 1fr;}}
.sc{
  background:var(--ww);border:1.5px solid var(--brd);
  border-radius:18px;padding:16px 14px;text-align:center;
  box-shadow:0 2px 12px var(--sh);
  cursor:pointer;transition:all .2s;
  position:relative;overflow:hidden;
}
.sc::before{
  content:'';position:absolute;
  top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--rose2),var(--lavender2),var(--rose2));
}
.sc:hover{transform:translateY(-3px);box-shadow:0 6px 20px var(--sh);}
.si{font-size:1.5rem;margin-bottom:5px;}
.sv{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600;color:var(--dark);}
.sl{font-size:.64rem;color:var(--txt3);margin-top:2px;font-family:'Raleway',sans-serif;font-weight:500;letter-spacing:.06em;text-transform:uppercase;}
.sc-hint{font-family:'Caveat',cursive;font-size:.7rem;color:var(--rose);margin-top:4px;opacity:0;transition:opacity .2s;}
.sc:hover .sc-hint{opacity:1;}

/* ── TODAY MEALS ── */
.tmg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:26px;}
@media(max-width:600px){.tmg{grid-template-columns:1fr;}}
.ms{
  background:var(--ww);border:1.5px solid var(--brd);
  border-radius:16px;padding:16px;
  box-shadow:0 2px 10px var(--sh);
}
.ml{font-family:'Raleway',sans-serif;font-size:.65rem;font-weight:600;color:var(--txt3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.12em;}
.mn{font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:var(--dark);font-style:italic;}
.mk{font-size:.82rem;color:var(--txt3);margin-top:3px;}
.ms.empty .mn{color:var(--brd2);font-style:normal;font-size:.88rem;}

/* ── CAT TABS ── */
.ctabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:20px;}
.ct{
  background:var(--ww);border:1.5px solid var(--brd);
  border-radius:20px;padding:5px 16px;
  font-family:'Raleway',sans-serif;font-size:.67rem;font-weight:500;
  color:var(--txt2);cursor:pointer;transition:all .2s;
  display:flex;align-items:center;gap:5px;
  letter-spacing:.05em;text-transform:uppercase;
}
.ct:hover{border-color:var(--rose2);color:var(--rust);}
.ct.on{background:var(--rose3);border-color:var(--rose2);color:var(--rust);box-shadow:0 2px 8px rgba(184,64,48,.1);}

/* ── RECIPE GRID ── */
.rgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
@media(max-width:900px){.rgrid{grid-template-columns:1fr 1fr 1fr;}}
@media(max-width:580px){.rgrid{grid-template-columns:1fr 1fr;}}
.rc{
  background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;
  box-shadow:0 3px 14px var(--sh);cursor:pointer;transition:transform .2s,box-shadow .2s;
  position:relative;overflow:hidden;
}
.rc::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;}
.rc:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(62,40,20,.12);}
.rc-img{
  width:100%;height:130px;
  background:linear-gradient(135deg,var(--parch),var(--rose3));
  display:flex;align-items:center;justify-content:center;
  font-size:2.6rem;position:relative;
  border-bottom:1.5px solid var(--brd);
}
.rc-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(62,40,20,.07));pointer-events:none;}
.rc-cat{
  position:absolute;top:8px;right:8px;
  background:rgba(255,250,244,.92);color:var(--txt2);
  font-size:.6rem;padding:2px 9px;border-radius:20px;
  font-family:'Raleway',sans-serif;font-weight:500;letter-spacing:.05em;
  border:1px solid var(--brd);
}
.rc-vid{
  position:absolute;bottom:8px;right:8px;
  background:rgba(184,64,48,.88);color:#FFF5F0;
  font-size:.6rem;padding:2px 8px;border-radius:20px;
  font-family:'Raleway',sans-serif;letter-spacing:.04em;
}
.rc-love{
  position:absolute;top:8px;left:8px;
  background:rgba(255,250,244,.9);border-radius:50%;
  width:24px;height:24px;display:flex;align-items:center;justify-content:center;
  border:1px solid var(--brd);font-size:.9rem;
}
.rc-safe{
  position:absolute;bottom:8px;left:8px;
  background:rgba(106,144,112,.88);color:#E8F5E8;
  font-size:.58rem;padding:2px 7px;border-radius:20px;
  font-family:'Raleway',sans-serif;letter-spacing:.04em;
}
.rc-body{padding:12px 14px 15px;}
.rc-name{
  font-family:'Cormorant Garamond',serif;
  font-size:1.05rem;color:var(--dark);
  margin-bottom:6px;font-style:italic;font-weight:500;
}
.kbju{display:flex;gap:4px;flex-wrap:wrap;}
.kc{border-radius:20px;padding:2px 8px;font-size:.62rem;font-family:'Raleway',sans-serif;font-weight:500;letter-spacing:.02em;}
.kc.kal{background:rgba(184,64,48,.08);color:var(--rust);}
.kc.bel{background:rgba(106,144,112,.1);color:var(--sage);}
.kc.jir{background:rgba(184,144,64,.1);color:var(--gold);}
.kc.ugl{background:rgba(184,168,200,.2);color:#7A6890;}
.rc-rat{display:flex;align-items:center;gap:4px;margin-top:7px;font-size:.78rem;font-family:'Caveat',cursive;}
.add-rc{
  border:2px dashed var(--brd);background:transparent;border-radius:18px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:8px;cursor:pointer;padding:20px;min-height:200px;
  transition:all .2s;color:var(--txt3);
  font-family:'Caveat',cursive;font-size:.95rem;
}
.add-rc:hover{border-color:var(--rose2);color:var(--rust);background:rgba(212,160,160,.04);}

/* ── MODAL ── */
.overlay{
  position:fixed;inset:0;
  background:rgba(30,15,8,.55);z-index:500;
  display:flex;align-items:center;justify-content:center;padding:16px;
  backdrop-filter:blur(8px);animation:fadeIn .2s ease;
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{
  background:var(--ww);border-radius:22px;
  border:1.5px solid var(--brd);
  max-width:740px;width:100%;max-height:90vh;
  overflow-y:auto;
  box-shadow:0 20px 60px rgba(30,15,8,.2),0 0 0 6px rgba(222,200,168,.15);
  animation:slideUp .25s ease;
}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal::-webkit-scrollbar{width:5px;}
.modal::-webkit-scrollbar-thumb{background:var(--brd);border-radius:3px;}
.mhdr{
  position:sticky;top:0;background:var(--ww);
  border-bottom:1.5px solid var(--brd);
  padding:16px 20px;display:flex;align-items:center;gap:12px;z-index:10;
  border-radius:22px 22px 0 0;
}
.m-emoji{font-size:2.2rem;}
.m-title{
  font-family:'Pinyon Script',cursive;font-size:1.9rem;
  color:var(--rust);flex:1;
}
.m-close{
  background:var(--parch);border:1.5px solid var(--brd);
  border-radius:50%;width:32px;height:32px;cursor:pointer;
  font-size:1rem;display:flex;align-items:center;justify-content:center;
  transition:all .15s;flex-shrink:0;color:var(--txt2);
}
.m-close:hover{background:var(--rose3);border-color:var(--rose2);color:var(--rust);}
.mbody{padding:20px;}

.srv-wrap{
  background:var(--parch);border-radius:14px;padding:14px 16px;margin-bottom:20px;
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  border:1.5px solid var(--brd);
}
.srv-label{font-family:'Raleway',sans-serif;font-size:.74rem;font-weight:600;color:var(--txt2);letter-spacing:.06em;text-transform:uppercase;}
.srv-btns{display:flex;gap:6px;}
.srv-btn{
  background:var(--ww);border:1.5px solid var(--brd);border-radius:20px;
  padding:5px 13px;font-family:'Raleway',sans-serif;font-size:.74rem;font-weight:500;
  color:var(--txt2);cursor:pointer;transition:all .15s;
}
.srv-btn:hover{border-color:var(--rose2);color:var(--rust);}
.srv-btn.on{background:var(--rose3);border-color:var(--rose2);color:var(--rust);}
.srv-kbju{display:flex;gap:6px;flex-wrap:wrap;}

.ing-list{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
.ing-row{
  display:flex;align-items:center;gap:10px;
  padding:8px 14px;background:var(--bg);
  border-radius:12px;border-left:3px solid var(--brd);
}
.ing-st{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0;}
.ing-st.have{background:rgba(106,144,112,.15);color:var(--sage);}
.ing-st.need{background:rgba(184,64,48,.1);color:var(--rust);}
.ing-name{flex:1;font-size:.92rem;color:var(--txt);font-family:'Cormorant Garamond',serif;}
.ing-amount{font-family:'Raleway',sans-serif;font-size:.76rem;color:var(--txt2);font-weight:500;}
.ing-legend{display:flex;gap:12px;margin-bottom:10px;font-family:'Caveat',cursive;font-size:.84rem;color:var(--txt3);}
.add-miss{
  display:flex;align-items:center;gap:8px;margin-bottom:20px;
  background:rgba(184,64,48,.04);border:1.5px dashed rgba(184,64,48,.3);
  border-radius:12px;padding:11px 14px;cursor:pointer;transition:background .15s;
}
.add-miss:hover{background:rgba(184,64,48,.08);}

.steps{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
.step{display:flex;gap:12px;align-items:flex-start;}
.step-num{
  width:28px;height:28px;border-radius:50%;
  background:var(--rose3);border:2px solid var(--rose2);color:var(--rust);
  display:flex;align-items:center;justify-content:center;
  font-family:'Raleway',sans-serif;font-size:.8rem;font-weight:600;flex-shrink:0;margin-top:1px;
}
.step-txt{font-size:1rem;line-height:1.65;color:var(--txt);padding-top:4px;font-family:'Cormorant Garamond',serif;}
.mnotes{
  background:rgba(106,144,112,.06);border-left:3px solid var(--sage2);border-radius:0 12px 12px 0;
  padding:12px 14px;font-size:.98rem;line-height:1.6;
  color:var(--txt2);font-style:italic;margin-bottom:16px;
  font-family:'Cormorant Garamond',serif;
}

.cook-btn{
  width:100%;background:linear-gradient(135deg,var(--sage),#4A7050);
  color:#E8F5E8;border:none;border-radius:20px;padding:14px;
  font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-style:italic;
  cursor:pointer;transition:all .2s;
  display:flex;align-items:center;justify-content:center;gap:10px;
  margin-bottom:14px;box-shadow:0 4px 14px rgba(106,144,112,.25);
}
.cook-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(106,144,112,.35);}
.cook-success{
  background:rgba(106,144,112,.08);border:1.5px solid var(--sage2);
  border-radius:12px;padding:13px;text-align:center;
  font-family:'Caveat',cursive;font-size:.98rem;color:var(--sage);margin-bottom:14px;
}

.step-timer-btn{
  background:rgba(184,64,48,.08);border:1px solid rgba(184,64,48,.28);
  color:var(--rust);border-radius:20px;padding:2px 10px;
  font-family:'Raleway',sans-serif;font-size:.68rem;font-weight:500;
  cursor:pointer;transition:all .15s;margin-left:8px;white-space:nowrap;letter-spacing:.04em;
}
.step-timer-btn:hover{background:var(--rust);color:white;}
.step-timer-btn.running{background:var(--rust);color:white;animation:pulse 1s infinite;}
.step-timer-btn.done{background:rgba(106,144,112,.12);border-color:var(--sage2);color:var(--sage);}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
.step-timer-display{
  display:inline-flex;align-items:center;gap:6px;margin-left:8px;
  background:var(--parch);border:1.5px solid var(--brd);
  border-radius:20px;padding:2px 10px;
  font-family:'Raleway',sans-serif;font-size:.78rem;font-weight:500;color:var(--dark);
}
.step-timer-display.urgent{background:rgba(184,64,48,.08);border-color:var(--rust2);color:var(--rust);}

.rate-btns{display:flex;gap:7px;flex-wrap:wrap;}
.rb{
  background:var(--bg);border:1.5px solid var(--brd);
  border-radius:20px;padding:6px 14px;
  font-family:'Caveat',cursive;font-size:.9rem;cursor:pointer;
  transition:all .15s;display:flex;align-items:center;gap:5px;
}
.rb:hover{transform:translateY(-1px);}
.rb.on-nope{background:#F8ECEC;border-color:#D4A8A8;color:#8B3030;}
.rb.on-ok{background:#FFF4D8;border-color:#D4B870;color:#7A5800;}
.rb.on-good{background:#EAF5EA;border-color:#90C090;color:#2D5A2D;}
.rb.on-love{background:var(--rose3);border-color:var(--rose2);color:var(--rust);}

.mynotes-wrap{margin-top:20px;}
.mynote-item{
  background:rgba(184,144,64,.05);border-left:3px solid var(--gold2);
  border-radius:0 12px 12px 0;padding:10px 13px;margin-bottom:8px;
}
.mynote-date{font-family:'Raleway',sans-serif;font-size:.64rem;font-weight:500;color:var(--txt3);margin-bottom:3px;letter-spacing:.04em;text-transform:uppercase;}
.mynote-txt{font-size:.98rem;line-height:1.55;color:var(--txt);font-style:italic;font-family:'Cormorant Garamond',serif;}
.mynote-add{display:flex;gap:8px;align-items:flex-end;margin-top:10px;}
.mynote-ta{
  flex:1;border:1.5px solid var(--brd);border-radius:14px;padding:9px 14px;
  font-family:'Cormorant Garamond',serif;font-size:1rem;
  background:var(--bg);color:var(--txt);outline:none;resize:none;transition:border-color .15s;line-height:1.5;
}
.mynote-ta:focus{border-color:var(--rose2);}
.mynote-save{
  background:var(--gold);color:#FFF8E8;border:none;border-radius:20px;
  padding:9px 16px;font-family:'Raleway',sans-serif;font-size:.74rem;font-weight:600;
  cursor:pointer;transition:all .15s;white-space:nowrap;align-self:flex-end;
  box-shadow:0 2px 8px rgba(184,144,64,.2);letter-spacing:.04em;text-transform:uppercase;
}
.mynote-save:hover{background:var(--gold2);transform:translateY(-1px);}

.season-badge{
  background:rgba(106,144,112,.12);border:1px solid var(--sage2);
  border-radius:20px;padding:1px 8px;
  font-family:'Raleway',sans-serif;font-size:.6rem;font-weight:500;
  color:var(--sage);margin-left:5px;letter-spacing:.04em;
}

/* ── RATINGS ── */
.rat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:28px;}
@media(max-width:600px){.rat-grid{grid-template-columns:1fr;}}
.rat-sec{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;overflow:hidden;box-shadow:0 2px 10px var(--sh);}
.rat-hdr{padding:12px 16px;display:flex;align-items:center;gap:9px;border-bottom:1.5px solid var(--brd);}
.rat-items{padding:12px;display:flex;flex-direction:column;gap:7px;}
.rat-item{
  display:flex;align-items:center;gap:10px;padding:9px 11px;
  background:var(--bg);border-radius:10px;cursor:pointer;transition:all .15s;
  border-left:2px solid var(--brd);
}
.rat-item:hover{border-left-color:var(--rose2);}
.rat-empty{padding:20px;text-align:center;font-family:'Caveat',cursive;font-size:.98rem;color:var(--txt3);}
.love-sec{background:var(--ww);border:2px solid var(--gold2);border-radius:18px;overflow:hidden;box-shadow:0 3px 14px rgba(184,144,64,.12);margin-bottom:24px;}
.love-hdr{
  background:linear-gradient(135deg,var(--parch),var(--rose3));
  padding:14px 18px;display:flex;align-items:center;gap:10px;
  border-bottom:1.5px solid var(--brd);
}

/* ── SAFE FOOD ── */
.safe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
@media(max-width:700px){.safe-grid{grid-template-columns:1fr 1fr;}}
.safe-card{
  background:var(--ww);border:1.5px solid rgba(106,144,112,.35);
  border-radius:18px;overflow:hidden;cursor:pointer;
  transition:transform .2s,box-shadow .2s;
  box-shadow:0 3px 10px rgba(106,144,112,.08);
}
.safe-card:hover{transform:translateY(-4px);box-shadow:0 8px 20px rgba(106,144,112,.14);}
.safe-img{
  height:110px;
  background:linear-gradient(135deg,rgba(200,220,200,.3),rgba(106,144,112,.15));
  display:flex;align-items:center;justify-content:center;font-size:2.5rem;
  position:relative;border-bottom:1.5px solid rgba(106,144,112,.25);
}

/* ── PLANNER ── */
.wn{display:flex;align-items:center;gap:14px;margin-bottom:18px;}
.wn-btn{
  background:var(--ww);border:1.5px solid var(--brd);border-radius:20px;
  padding:5px 13px;cursor:pointer;font-size:.95rem;color:var(--dark);transition:all .15s;
}
.wn-btn:hover{border-color:var(--rose2);color:var(--rust);}
.wn-lbl{font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--dark);font-style:italic;}
.pgrid{display:grid;grid-template-columns:76px repeat(7,1fr);gap:5px;font-size:.78rem;}
@media(max-width:700px){.pgrid{grid-template-columns:52px repeat(7,1fr);font-size:.66rem;}}
.ph{
  font-family:'Raleway',sans-serif;font-size:.64rem;font-weight:600;text-align:center;
  padding:7px 3px;color:var(--txt2);background:var(--parch);
  border-radius:10px;letter-spacing:.06em;text-transform:uppercase;
}
.ph.td{background:var(--rose3);color:var(--rust);border:1.5px solid var(--rose2);}
.prl{font-family:'Raleway',sans-serif;font-size:.64rem;font-weight:500;color:var(--txt3);display:flex;align-items:center;padding:3px;letter-spacing:.04em;text-transform:uppercase;}
.pc{
  background:var(--ww);border:1px dashed var(--brd);border-radius:10px;
  padding:5px;min-height:50px;font-size:.72rem;color:var(--txt2);
  font-style:italic;cursor:pointer;transition:all .15s;
  font-family:'Cormorant Garamond',serif;
}
.pc:hover{border-color:var(--rose2);}
.pc.ok{border-style:solid;border-color:var(--sage2);background:rgba(106,144,112,.06);color:var(--sage);font-style:normal;}

/* ── SHOPPING ── */
.bw{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;padding:18px;margin-bottom:18px;box-shadow:0 2px 10px var(--sh);}
.bb{height:7px;background:var(--parch);border-radius:10px;overflow:hidden;}
.bf{height:100%;background:linear-gradient(90deg,var(--rose2),var(--lavender2));border-radius:10px;transition:width .6s;}
.sl2{display:grid;grid-template-columns:1fr 290px;gap:18px;align-items:start;}
@media(max-width:680px){.sl2{grid-template-columns:1fr;}}
.slc{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;overflow:hidden;box-shadow:0 2px 10px var(--sh);}
.slh{background:var(--parch);padding:12px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid var(--brd);}
.si2{display:flex;align-items:center;gap:10px;padding:10px 18px;border-bottom:1px solid rgba(222,200,168,.25);transition:background .15s;}
.si2:hover{background:var(--bg);}
.scb{width:17px;height:17px;border:2px solid var(--brd);border-radius:5px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:white;}
.scb.ck{background:var(--sage);border-color:var(--sage);color:white;}
.sn{flex:1;font-size:.92rem;font-family:'Cormorant Garamond',serif;}
.sn.dn{text-decoration:line-through;color:var(--txt3);}
.sa{font-family:'Raleway',sans-serif;font-size:.7rem;font-weight:500;color:var(--txt3);}
.sp{font-family:'Raleway',sans-serif;font-size:.78rem;font-weight:600;color:var(--rust);min-width:54px;text-align:right;}
.air{padding:11px 18px;display:flex;gap:7px;}
.ab{background:var(--rust);color:#FFF5F0;border:none;border-radius:20px;padding:7px 14px;cursor:pointer;font-size:.95rem;box-shadow:0 2px 6px rgba(184,64,48,.2);}
.ab:hover{background:var(--rust2);}
.sside{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;padding:18px;box-shadow:0 2px 10px var(--sh);}

/* ── PANTRY ── */
.shelf{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;margin-bottom:18px;overflow:hidden;box-shadow:0 2px 10px var(--sh);}
.sh2{
  background:linear-gradient(90deg,var(--parch),var(--rose3));
  padding:12px 18px;display:flex;align-items:center;gap:9px;
  border-bottom:1.5px solid var(--brd);
}
.shitems{padding:14px;display:flex;flex-wrap:wrap;gap:9px;}
.shi{
  background:var(--bg);border:1.5px solid var(--brd);
  border-radius:12px;padding:9px 12px;
  display:flex;align-items:center;gap:7px;font-size:.8rem;position:relative;
  cursor:pointer;transition:box-shadow .15s;
}
.shi:hover{box-shadow:0 3px 10px var(--sh);}
.shi.low{border-color:var(--rust2);background:rgba(184,64,48,.04);}
.shi.empty{border-color:#D4A8A8;background:rgba(212,168,168,.06);opacity:.7;}
.shi-qty{font-family:'Raleway',sans-serif;font-size:.8rem;font-weight:700;color:var(--dark);margin-top:1px;}
.shi-unit{font-family:'Raleway',sans-serif;font-size:.64rem;color:var(--txt3);}
.qty-bar-wrap{width:100%;height:4px;background:rgba(0,0,0,.05);border-radius:3px;margin-top:5px;overflow:hidden;}
.qty-bar{height:100%;border-radius:3px;transition:width .4s;}
.shi-edit-btn{position:absolute;top:5px;right:6px;background:none;border:none;font-size:.65rem;color:var(--txt3);cursor:pointer;opacity:0;transition:opacity .15s;}
.shi:hover .shi-edit-btn{opacity:1;}
.shi-edit-inp{width:60px;border:1.5px solid var(--rose2);border-radius:10px;padding:2px 6px;font-family:'Raleway',sans-serif;font-size:.82rem;text-align:center;outline:none;background:white;}
.pantry-legend{display:flex;gap:12px;margin-bottom:14px;font-family:'Raleway',sans-serif;font-size:.68rem;font-weight:500;color:var(--txt3);flex-wrap:wrap;letter-spacing:.03em;}
.pl-dot{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:4px;}

/* ── WISHLIST ── */
.wgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
@media(max-width:580px){.wgrid{grid-template-columns:1fr;}}
.wc{
  background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;
  padding:14px;display:flex;align-items:center;gap:12px;
  box-shadow:0 2px 10px var(--sh);transition:all .2s;
}
.wc:hover{transform:translateY(-3px);box-shadow:0 6px 18px var(--sh);}
.wc.dn{opacity:.6;background:var(--bg);}
.wn2{font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:var(--dark);font-style:italic;margin-bottom:2px;}
.wc.dn .wn2{text-decoration:line-through;}
.wcat{font-family:'Raleway',sans-serif;font-size:.64rem;color:var(--txt3);letter-spacing:.04em;font-weight:500;text-transform:uppercase;}
.wtog{width:26px;height:26px;border-radius:50%;border:2px solid var(--brd);background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;transition:all .2s;flex-shrink:0;}
.wtog.dn{background:var(--sage);border-color:var(--sage);color:white;}
.wadd{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;padding:14px;display:flex;gap:9px;align-items:center;box-shadow:0 2px 10px var(--sh);}

/* ── CASSETTES ── */
.cf{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:28px;}
.cfb{background:var(--ww);border:1.5px solid var(--brd);border-radius:20px;padding:5px 16px;font-family:'Raleway',sans-serif;font-size:.67rem;font-weight:500;color:var(--txt2);cursor:pointer;transition:all .2s;letter-spacing:.05em;text-transform:uppercase;}
.cfb:hover{border-color:var(--rose2);color:var(--rust);}
.cfb.on{background:var(--rose3);border-color:var(--rose2);color:var(--rust);}
.cgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
@media(max-width:840px){.cgrid{grid-template-columns:1fr 1fr;}}
@media(max-width:540px){.cgrid{grid-template-columns:1fr;}}
.cwrap:hover .cshell{transform:translateY(-5px) rotate(-1.5deg);filter:drop-shadow(0 12px 26px rgba(0,0,0,.35));}
.cshell{position:relative;width:100%;padding-bottom:62%;transition:transform .25s,filter .25s;filter:drop-shadow(0 4px 14px rgba(0,0,0,.22));}
.cbody{position:absolute;inset:0;border-radius:9px;overflow:hidden;}
.cnotch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:34%;height:11%;border-radius:0 0 7px 7px;z-index:4;}
.clabel{position:absolute;top:17%;left:8%;right:8%;height:35%;border-radius:5px;z-index:3;display:flex;flex-direction:column;justify-content:center;padding:0 10px;overflow:hidden;}
.cls{position:absolute;left:0;right:0;height:1px;opacity:.2;background:rgba(0,0,0,.8);}
.cchn{font-family:'Cormorant Garamond',serif;font-size:clamp(.5rem,1.5vw,.75rem);font-weight:700;letter-spacing:.04em;text-transform:uppercase;line-height:1.2;position:relative;z-index:4;}
.cctp{font-family:'Raleway',sans-serif;font-size:clamp(.38rem,1.1vw,.58rem);font-weight:500;opacity:.8;position:relative;z-index:4;margin-top:2px;letter-spacing:.06em;text-transform:uppercase;}
.cwin{position:absolute;bottom:9%;left:50%;transform:translateX(-50%);width:62%;height:27%;border-radius:6px;z-index:2;display:flex;align-items:center;justify-content:space-around;padding:0 8%;}
.reel{width:36%;aspect-ratio:1;border-radius:50%;border:2px solid rgba(0,0,0,.15);position:relative;display:flex;align-items:center;justify-content:center;}
.reel::before{content:'';width:30%;aspect-ratio:1;border-radius:50%;background:rgba(0,0,0,.2);position:absolute;}
.ctape{position:absolute;bottom:9%;left:50%;transform:translateX(-50%);width:62%;height:27%;z-index:3;pointer-events:none;}
.ctape::after{content:'';position:absolute;bottom:20%;left:22%;right:22%;height:3px;background:rgba(0,0,0,.1);border-radius:2px;}
.cscr{position:absolute;width:5%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);z-index:4;}
.cscr.tl{top:6%;left:5%;}.cscr.tr{top:6%;right:5%;}.cscr.bl{bottom:6%;left:5%;}.cscr.br{bottom:6%;right:5%;}
.cinfo{margin-top:12px;padding:0 2px;}
.cname{font-family:'Cormorant Garamond',serif;font-size:.95rem;color:var(--dark);font-style:italic;margin-bottom:4px;}
.cdesc{font-size:.84rem;color:var(--txt3);line-height:1.5;margin-bottom:9px;font-family:'Cormorant Garamond',serif;}
.ctags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:9px;}
.ctag{background:var(--bg);border:1px solid var(--brd);border-radius:20px;padding:2px 10px;font-family:'Raleway',sans-serif;font-size:.62rem;font-weight:500;color:var(--txt2);letter-spacing:.04em;}
.clink{display:inline-flex;align-items:center;gap:5px;background:var(--dark);border:1px solid var(--gold2);color:var(--gold3);border-radius:20px;padding:6px 14px;font-family:'Raleway',sans-serif;font-size:.7rem;font-weight:500;text-decoration:none;transition:all .15s;letter-spacing:.05em;text-transform:uppercase;}
.clink:hover{background:rgba(184,144,64,.15);color:var(--gold);}
.add-cc{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:2px dashed var(--brd);border-radius:18px;padding:28px 18px;cursor:pointer;color:var(--txt3);font-family:'Caveat',cursive;font-size:.95rem;transition:all .2s;min-height:190px;}
.add-cc:hover{border-color:var(--rose2);color:var(--rust);}

/* ── MOON ── */
.moon-widget{
  background:linear-gradient(135deg,#F4EFF8,#EDE8F5);
  border:1.5px solid var(--lavender2);border-radius:18px;padding:18px 20px;
  display:flex;align-items:center;gap:16px;
  box-shadow:0 3px 14px rgba(160,140,200,.1);
}
.moon-big{font-size:2.8rem;line-height:1;filter:drop-shadow(0 0 10px rgba(184,168,200,.5));}
.moon-info{flex:1;}
.moon-phase-name{font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:#5A4870;font-style:italic;margin-bottom:3px;}
.moon-tip{font-family:'Caveat',cursive;font-size:.9rem;color:#7A6888;line-height:1.4;}
.moon-date{font-family:'Raleway',sans-serif;font-size:.62rem;color:#9A88A8;margin-top:4px;letter-spacing:.06em;font-weight:500;text-transform:uppercase;}

/* ── WEEKLY KBJU ── */
.wkbju-wrap{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;padding:20px;margin-top:24px;box-shadow:0 2px 10px var(--sh);}
.wkbju-days{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:18px;}
.wkbju-day{display:flex;flex-direction:column;align-items:center;gap:5px;}
.wkbju-day-label{font-family:'Raleway',sans-serif;font-size:.64rem;font-weight:600;color:var(--txt3);letter-spacing:.06em;text-transform:uppercase;}
.wkbju-day-label.today{color:var(--rust);font-weight:700;}
.wkbju-bar-wrap{width:100%;display:flex;flex-direction:column;gap:3px;}
.wkbju-mini-bar{height:6px;border-radius:3px;background:var(--parch);overflow:hidden;}
.wkbju-mini-fill{height:100%;border-radius:3px;transition:width .5s;}
.wkbju-kcal-val{font-family:'Raleway',sans-serif;font-size:.62rem;font-weight:600;color:var(--txt2);text-align:center;}
.wkbju-kcal-val.over{color:var(--rust2);}
.wkbju-kcal-val.empty{color:var(--brd);}
.wkbju-totals{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.wkbju-total-card{background:var(--bg);border:1.5px solid var(--brd);border-radius:12px;padding:12px;text-align:center;}
.wkbju-total-val{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600;}
.wkbju-total-lbl{font-family:'Raleway',sans-serif;font-size:.62rem;font-weight:500;color:var(--txt3);margin-top:2px;letter-spacing:.04em;text-transform:uppercase;}
.wkbju-total-pct{font-family:'Caveat',cursive;font-size:.74rem;margin-top:3px;}
.wkbju-verdict{background:linear-gradient(135deg,rgba(106,144,112,.08),rgba(170,204,170,.05));border:1.5px solid var(--sage2);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;}
.wkbju-verdict-ico{font-size:2rem;}
.wkbju-verdict-txt{font-family:'Cormorant Garamond',serif;font-size:.98rem;color:var(--sage);font-style:italic;}
.wkbju-verdict-sub{font-family:'Raleway',sans-serif;font-size:.64rem;font-weight:500;color:var(--txt3);margin-top:3px;letter-spacing:.03em;text-transform:uppercase;}

/* ── EXPENSE CHART ── */
.exp-wrap{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;padding:18px;margin-top:18px;box-shadow:0 2px 10px var(--sh);}
.exp-bars{display:flex;align-items:flex-end;gap:10px;height:100px;margin-bottom:8px;}
.exp-bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;}
.exp-bar-stack{width:100%;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;}
.exp-bar{border-radius:6px 6px 0 0;min-height:3px;transition:height .4s;}
.exp-label{font-family:'Raleway',sans-serif;font-size:.62rem;font-weight:500;color:var(--txt3);letter-spacing:.04em;text-transform:uppercase;}
.exp-label.cur{color:var(--rust);font-weight:700;}
.exp-legend{display:flex;gap:14px;margin-top:8px;}
.exp-legend-item{display:flex;align-items:center;gap:5px;font-family:'Raleway',sans-serif;font-size:.66rem;font-weight:500;color:var(--txt2);}
.exp-dot{width:10px;height:10px;border-radius:3px;}

/* ── DIARY ── */
.diary-day-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px;}
.diary-day-label{font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--dark);font-style:italic;}
.diary-kbju-bar{display:flex;gap:8px;flex-wrap:wrap;}
.diary-k{background:var(--bg);border:1.5px solid var(--brd);border-radius:20px;padding:4px 12px;font-family:'Raleway',sans-serif;font-size:.68rem;font-weight:500;color:var(--txt2);display:flex;align-items:center;gap:4px;letter-spacing:.03em;}
.diary-entries{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.diary-entry{background:var(--bg);border:1.5px solid var(--brd);border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:12px;border-left:3px solid var(--rose2);}
.diary-entry-emoji{font-size:1.4rem;}
.diary-entry-name{flex:1;font-family:'Cormorant Garamond',serif;font-size:.92rem;color:var(--dark);font-style:italic;}
.diary-entry-kcal{font-family:'Raleway',sans-serif;font-size:.76rem;font-weight:600;color:var(--rust);}
.diary-entry-del{background:none;border:none;color:var(--brd2);cursor:pointer;font-size:.85rem;padding:2px 5px;border-radius:6px;transition:color .15s;}
.diary-entry-del:hover{color:var(--rust);}
.diary-add-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.diary-goal-bar{height:7px;background:var(--parch);border-radius:6px;overflow:hidden;margin-bottom:6px;}
.diary-goal-fill{height:100%;border-radius:6px;transition:width .4s;}
.diary-nav{display:flex;align-items:center;gap:12px;margin-bottom:22px;}
.diary-nav-btn{background:var(--ww);border:1.5px solid var(--brd);border-radius:20px;padding:5px 13px;cursor:pointer;font-size:.95rem;color:var(--dark);}
.diary-week-card{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;padding:14px;margin-bottom:10px;box-shadow:0 2px 10px var(--sh);}
.diary-week-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(222,200,168,.2);}
.diary-week-day{font-family:'Raleway',sans-serif;font-size:.7rem;font-weight:600;color:var(--txt3);width:28px;flex-shrink:0;letter-spacing:.04em;text-transform:uppercase;}
.diary-week-fill{flex:1;height:7px;background:var(--parch);border-radius:6px;overflow:hidden;}
.diary-week-bar{height:100%;border-radius:6px;transition:width .4s;}

/* ── SEARCH ── */
.search-wrap{position:relative;margin-bottom:16px;}
.search-inp{width:100%;border:1.5px solid var(--brd);border-radius:20px;padding:10px 18px 10px 44px;font-family:'Cormorant Garamond',serif;font-size:1rem;background:var(--ww);color:var(--txt);outline:none;transition:border-color .2s;}
.search-inp:focus{border-color:var(--rose2);}
.search-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:1rem;pointer-events:none;opacity:.4;}
.search-clear{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:var(--brd);border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:.7rem;display:flex;align-items:center;justify-content:center;color:var(--txt2);}
.search-clear:hover{background:var(--rose2);color:white;}
.search-count{font-family:'Raleway',sans-serif;font-size:.72rem;font-weight:500;color:var(--txt3);margin-bottom:14px;letter-spacing:.04em;}
.search-highlight{background:rgba(184,144,64,.18);border-radius:3px;padding:0 2px;}

/* ── CUSTOM CATEGORIES ── */
.custcat-section{background:var(--ww);border:1.5px solid var(--brd);border-radius:18px;padding:16px;margin-bottom:20px;box-shadow:0 2px 10px var(--sh);}
.custcat-list{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
.custcat-chip{display:flex;align-items:center;gap:6px;border-radius:20px;padding:5px 16px;font-family:'Raleway',sans-serif;font-size:.7rem;font-weight:500;cursor:pointer;transition:all .2s;border:1.5px solid;letter-spacing:.04em;text-transform:uppercase;}
.custcat-chip.active{color:white;}
.custcat-del{background:none;border:none;font-size:.7rem;cursor:pointer;opacity:.6;padding:0 0 0 2px;line-height:1;}
.custcat-del:hover{opacity:1;}
.custcat-add{display:flex;gap:8px;align-items:center;}
.custcat-emoji-pick{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;}
.ep-btn{background:var(--bg);border:1.5px solid var(--brd);border-radius:10px;padding:4px 8px;font-size:1rem;cursor:pointer;transition:all .15s;}
.ep-btn.on{border-color:var(--rose2);background:var(--rose3);}
.rc-custcats{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;}
`;

// ─── DATA ──────────────────────────────────────────────────────────────

const PALETTES=[
  ['#2D2420','#C0552A','#FFF4EC','#1A100C','#F2E8D0'],
  ['#1C2B1E','#7A9E7E','#1C2B1E','#111D12','#EDF5EE'],
  ['#26203A','#D4A843','#26203A','#1A1526','#FBF5E6'],
  ['#1A2535','#7EB3C4','#1A2535','#101820','#EBF5F9'],
  ['#2E1A1A','#D4937A','#2E1A1A','#1E0E0E','#FBF0EC'],
  ['#1E2830','#D4C080','#2A1F10','#121C22','#F9F4E0'],
];

// Числовые остатки в полочке: qty = текущее количество, max = сколько было изначально
const INIT_PANTRY = [
  // крупы
  {id:'ovs', n:'Овсянка',        qty:700, max:1000, unit:'г',  e:'🌾', cat:'Крупы и консервы', low:150},
  {id:'ris', n:'Рис',            qty:500, max:1000, unit:'г',  e:'🍚', cat:'Крупы и консервы', low:100},
  {id:'pst', n:'Паста',          qty:200, max:500,  unit:'г',  e:'🍝', cat:'Крупы и консервы', low:100},
  {id:'nut', n:'Нут',            qty:1,   max:3,    unit:'банка',e:'🫘',cat:'Крупы и консервы', low:1},
  {id:'lnz', n:'Чечевица',       qty:300, max:500,  unit:'г',  e:'🟤', cat:'Крупы и консервы', low:80},
  // специи
  {id:'slt', n:'Морская соль',   qty:350, max:500,  unit:'г',  e:'🧂', cat:'Специи и соусы',   low:50},
  {id:'oil', n:'Оливковое масло',qty:200, max:500,  unit:'мл', e:'🫒', cat:'Специи и соусы',   low:80},
  {id:'soy', n:'Соевый соус',    qty:240, max:300,  unit:'мл', e:'🍶', cat:'Специи и соусы',   low:50},
  {id:'hny', n:'Мёд',            qty:150, max:300,  unit:'г',  e:'🍯', cat:'Специи и соусы',   low:50},
  // холодильник
  {id:'mlk', n:'Молоко',         qty:500, max:1000, unit:'мл', e:'🥛', cat:'Холодильник',       low:200},
  {id:'egg', n:'Яйца',           qty:4,   max:10,   unit:'шт', e:'🥚', cat:'Холодильник',       low:3},
  {id:'che', n:'Сыр',            qty:80,  max:200,  unit:'г',  e:'🧀', cat:'Холодильник',       low:40},
  {id:'yog', n:'Йогурт',         qty:2,   max:4,    unit:'шт', e:'🥛', cat:'Холодильник',       low:1},
  {id:'but', n:'Масло',          qty:50,  max:200,  unit:'г',  e:'🧈', cat:'Холодильник',       low:40},
  // овощи
  {id:'lem', n:'Лимон',          qty:3,   max:5,    unit:'шт', e:'🍋', cat:'Фрукты и овощи',    low:1},
  {id:'car', n:'Морковь',        qty:4,   max:6,    unit:'шт', e:'🥕', cat:'Фрукты и овощи',    low:1},
  {id:'gar', n:'Чеснок',         qty:1,   max:3,    unit:'головка',e:'🧄',cat:'Фрукты и овощи', low:1},
  {id:'onion',n:'Лук',           qty:3,   max:5,    unit:'шт', e:'🧅', cat:'Фрукты и овощи',    low:1},
];

const matchPantry=(name,pantry)=>pantry.find(p=>
  p.n.toLowerCase().includes(name.toLowerCase())||name.toLowerCase().includes(p.n.toLowerCase())
);

// текущий месяц (0=янв)
const CUR_MONTH = new Date().getMonth();

const SEASONS = {
  0: [
    {n:'Мандарины',e:'🍊',peak:true},
    {n:'Апельсины',e:'🍊',peak:true},
    {n:'Грейпфрут',e:'🍋',peak:false},
    {n:'Лимоны',e:'🍋',peak:true},
    {n:'Гранат',e:'🫐',peak:true},
    {n:'Хурма',e:'🟠',peak:false},
    {n:'Свёкла',e:'🫚',peak:false},
    {n:'Морковь',e:'🥕',peak:false},
    {n:'Картофель',e:'🥔',peak:false},
    {n:'Капуста',e:'🥬',peak:false},
    {n:'Квашеная капуста',e:'🫙',peak:true},
    {n:'Яблоки зимние',e:'🍎',peak:false},
  ],
  1: [
    {n:'Мандарины',e:'🍊',peak:false},
    {n:'Апельсины',e:'🍊',peak:true},
    {n:'Лимоны',e:'🍋',peak:true},
    {n:'Грейпфрут',e:'🍋',peak:true},
    {n:'Гранат',e:'🫐',peak:false},
    {n:'Свёкла',e:'🫚',peak:false},
    {n:'Морковь',e:'🥕',peak:false},
    {n:'Картофель',e:'🥔',peak:false},
    {n:'Квашеная капуста',e:'🫙',peak:true},
  ],
  2: [
    {n:'Цитрусовые',e:'🍊',peak:true},
    {n:'Редис (теплица)',e:'🔴',peak:false},
    {n:'Зелёный лук',e:'🌿',peak:false},
    {n:'Укроп',e:'🌿',peak:false},
    {n:'Петрушка',e:'🌿',peak:false},
    {n:'Свёкла',e:'🫚',peak:false},
    {n:'Морковь',e:'🥕',peak:false},
    {n:'Картофель',e:'🥔',peak:false},
  ],
  3: [
    {n:'Редис',e:'🔴',peak:true},
    {n:'Щавель',e:'🌿',peak:true},
    {n:'Черемша',e:'🌿',peak:true},
    {n:'Шпинат',e:'🥬',peak:false},
    {n:'Зелёный лук',e:'🌿',peak:true},
    {n:'Ревень',e:'🔴',peak:false},
    {n:'Петрушка',e:'🌿',peak:true},
    {n:'Укроп',e:'🌿',peak:true},
  ],
  4: [
    {n:'Редис',e:'🔴',peak:true},
    {n:'Щавель',e:'🌿',peak:true},
    {n:'Черемша',e:'🌿',peak:false},
    {n:'Шпинат',e:'🥬',peak:true},
    {n:'Спаржа',e:'🌱',peak:true},
    {n:'Ревень',e:'🔴',peak:true},
    {n:'Горошек',e:'🟢',peak:false},
    {n:'Зелёный лук',e:'🌿',peak:true},
    {n:'Укроп, петрушка',e:'🌿',peak:true},
    {n:'Клубника (теплица)',e:'🍓',peak:false},
  ],
  5: [
    {n:'Клубника',e:'🍓',peak:true},
    {n:'Черешня',e:'🍒',peak:true},
    {n:'Горошек',e:'🟢',peak:true},
    {n:'Огурцы',e:'🥒',peak:false},
    {n:'Кабачки',e:'🥬',peak:false},
    {n:'Редис',e:'🔴',peak:false},
    {n:'Укроп, базилик',e:'🌿',peak:true},
    {n:'Руккола',e:'🌿',peak:true},
    {n:'Листовой салат',e:'🥬',peak:true},
  ],
  6: [
    {n:'Черника',e:'🫐',peak:true},
    {n:'Малина',e:'🍓',peak:true},
    {n:'Смородина',e:'🍇',peak:true},
    {n:'Вишня',e:'🍒',peak:true},
    {n:'Абрикосы',e:'🟠',peak:true},
    {n:'Помидоры',e:'🍅',peak:false},
    {n:'Огурцы',e:'🥒',peak:true},
    {n:'Кабачки',e:'🥬',peak:true},
    {n:'Молодой картофель',e:'🥔',peak:true},
    {n:'Перец болгарский',e:'🫑',peak:false},
    {n:'Зелень',e:'🌿',peak:true},
  ],
  7: [
    {n:'Малина',e:'🍓',peak:false},
    {n:'Ежевика',e:'🫐',peak:true},
    {n:'Черника',e:'🫐',peak:false},
    {n:'Помидоры',e:'🍅',peak:true},
    {n:'Перец болгарский',e:'🫑',peak:true},
    {n:'Баклажан',e:'🍆',peak:true},
    {n:'Кукуруза',e:'🌽',peak:true},
    {n:'Арбуз',e:'🍉',peak:true},
    {n:'Дыня',e:'🍈',peak:true},
    {n:'Сливы',e:'🟣',peak:true},
    {n:'Персики',e:'🍑',peak:true},
    {n:'Яблоки ранние',e:'🍎',peak:false},
  ],
  8: [
    {n:'Яблоки',e:'🍎',peak:true},
    {n:'Груши',e:'🍐',peak:true},
    {n:'Тыква',e:'🎃',peak:false},
    {n:'Виноград',e:'🍇',peak:true},
    {n:'Слива',e:'🟣',peak:false},
    {n:'Морковь',e:'🥕',peak:true},
    {n:'Свёкла',e:'🫚',peak:true},
    {n:'Картофель',e:'🥔',peak:true},
    {n:'Баклажан',e:'🍆',peak:false},
    {n:'Помидоры',e:'🍅',peak:false},
  ],
  9: [
    {n:'Тыква',e:'🎃',peak:true},
    {n:'Яблоки поздние',e:'🍎',peak:true},
    {n:'Груши',e:'🍐',peak:false},
    {n:'Айва',e:'🍐',peak:true},
    {n:'Клюква',e:'🔴',peak:false},
    {n:'Брюссельская капуста',e:'🥦',peak:true},
    {n:'Брокколи',e:'🥦',peak:true},
    {n:'Морковь',e:'🥕',peak:true},
    {n:'Свёкла',e:'🫚',peak:true},
    {n:'Пастернак',e:'🥕',peak:true},
  ],
  10: [
    {n:'Тыква',e:'🎃',peak:true},
    {n:'Клюква',e:'🔴',peak:true},
    {n:'Гранат',e:'🫐',peak:true},
    {n:'Хурма',e:'🟠',peak:true},
    {n:'Брюссельская капуста',e:'🥦',peak:false},
    {n:'Свёкла',e:'🫚',peak:true},
    {n:'Морковь',e:'🥕',peak:true},
    {n:'Картофель',e:'🥔',peak:true},
    {n:'Квашеная капуста',e:'🫙',peak:false},
  ],
  11: [
    {n:'Мандарины',e:'🍊',peak:true},
    {n:'Апельсины',e:'🍊',peak:false},
    {n:'Лимоны',e:'🍋',peak:true},
    {n:'Гранат',e:'🫐',peak:true},
    {n:'Хурма',e:'🟠',peak:true},
    {n:'Клюква',e:'🔴',peak:true},
    {n:'Свёкла',e:'🫚',peak:false},
    {n:'Морковь',e:'🥕',peak:false},
    {n:'Картофель',e:'🥔',peak:false},
    {n:'Квашеная капуста',e:'🫙',peak:true},
  ],
};

const isInSeason = (name) =>
  (SEASONS[CUR_MONTH]||[]).some(s=>
    s.n.toLowerCase().includes(name.toLowerCase())||name.toLowerCase().includes(s.n.toLowerCase().split(' ')[0])
  );

// КБЖУ по дням недели (пн=0 ... вс=6)
const WEEK_KBJU = [
  {day:'Пн', kcal:1680, b:64, f:52, u:208, done:true},
  {day:'Вт', kcal:1920, b:78, f:65, u:240, done:true},
  {day:'Ср', kcal:1540, b:58, f:48, u:192, done:true},
  {day:'Чт', kcal:2050, b:82, f:70, u:255, done:true},
  {day:'Пт', kcal:1750, b:70, f:57, u:218, done:true},
  {day:'Сб', kcal:1890, b:75, f:63, u:236, done:true},
  {day:'Вс', kcal:0,    b:0,  f:0,  u:0,   done:false},
];
const KBJU_TARGET = {kcal:1800, b:75, f:60, u:220};

// История расходов по месяцам
const EXPENSE_HISTORY = [
  {month:'Дек', food:4800, house:920},
  {month:'Янв', food:4200, house:840},
  {month:'Фев', food:3900, house:650},
  {month:'Мар', food:4500, house:780},
  {month:'Апр', food:4100, house:710},
  {month:'Май', food:2340, house:560, current:true},
];

function getMoonPhase(){
  const known=new Date(2000,0,6,18,14,0);
  const cycle=29.530588853;
  const diff=(new Date()-known)/(1000*60*60*24);
  const age=((diff%cycle)+cycle)%cycle;
  const pct=age/cycle;
  if(pct<0.03||pct>0.97) return {emoji:'🌑',name:'Новолуние',tip:'Время планировать меню на неделю и составлять списки покупок',age:Math.round(age)};
  if(pct<0.22) return {emoji:'🌒',name:'Растущий серп',tip:'Хорошо начинать новые кулинарные эксперименты и пробовать незнакомые рецепты',age:Math.round(age)};
  if(pct<0.28) return {emoji:'🌓',name:'Первая четверть',tip:'Энергия растёт — отличный день для сложной выпечки и долгих рецептов',age:Math.round(age)};
  if(pct<0.47) return {emoji:'🌔',name:'Прибывающая луна',tip:'Тело лучше усваивает питательные вещества — идеально для богатых блюд',age:Math.round(age)};
  if(pct<0.53) return {emoji:'🌕',name:'Полнолуние',tip:'Полнолуние — время для праздничных десертов и угощения близких',age:Math.round(age)};
  if(pct<0.72) return {emoji:'🌖',name:'Убывающая луна',tip:'Хорошее время для лёгких блюд и детокс-напитков',age:Math.round(age)};
  if(pct<0.78) return {emoji:'🌗',name:'Последняя четверть',tip:'День для уборки холодильника и готовки из остатков',age:Math.round(age)};
  return {emoji:'🌘',name:'Убывающий серп',tip:'Время для любимых simple блюд — safe food во всей красе',age:Math.round(age)};
}

const DIARY_QUICK=[
  {n:'Овсянка',e:'🥣',kcal:320,b:10,f:7,u:52},
  {n:'Тост с авокадо',e:'🥑',kcal:290,b:8,f:17,u:28},
  {n:'Матча-латте',e:'🍵',kcal:140,b:5,f:5,u:18},
  {n:'Тыквенный суп',e:'🎃',kcal:210,b:5,f:9,u:28},
  {n:'Паста карбонара',e:'🍝',kcal:520,b:22,f:18,u:64},
  {n:'Греческий салат',e:'🥗',kcal:190,b:7,f:13,u:12},
  {n:'Шоколадный фондан',e:'🍫',kcal:450,b:8,f:22,u:56},
  {n:'Банановый кекс',e:'🍌',kcal:380,b:6,f:14,u:58},
  {n:'Йогурт',e:'🥛',kcal:120,b:8,f:4,u:14},
  {n:'Яйца варёные',e:'🥚',kcal:155,b:13,f:11,u:1},
  {n:'Фрукты',e:'🍊',kcal:80,b:1,f:0,u:20},
  {n:'Орехи горсть',e:'🥜',kcal:180,b:5,f:16,u:6},
];

const DAYS_RU=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
const MONTHS_RU=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

function getWeekDays(offsetWeeks=0){
  const today=new Date();
  const dow=today.getDay();
  const monday=new Date(today);
  monday.setDate(today.getDate()-((dow+6)%7)+offsetWeeks*7);
  return Array.from({length:7},(_,i)=>{
    const d=new Date(monday);
    d.setDate(monday.getDate()+i);
    return d;
  });
}

const CAT_PALETTE=[
  {bg:'#E8F0FF',border:'#7090D4',text:'#2A3D80'},
  {bg:'#FFF0E8',border:'#D48060',text:'#7A2800'},
  {bg:'#E8F5E8',border:'#70A870',text:'#1A4A1A'},
  {bg:'#FFF8D0',border:'#C8A030',text:'#5A3800'},
  {bg:'#F5E8F5',border:'#A870A8',text:'#4A1A5A'},
  {bg:'#E8F5F5',border:'#50A0A8',text:'#0A3840'},
  {bg:'#FFE8EE',border:'#D06080',text:'#6A0828'},
  {bg:'#F0EDE0',border:'#A09060',text:'#3A2A08'},
];

const INIT_CUSTOM_CATS=[
  {id:'cc1',name:'Быстро до 15 мин',emoji:'⚡',pi:0,recipes:[]},
  {id:'cc2',name:'Для особого вечера',emoji:'🕯️',pi:4,recipes:[]},
  {id:'cc3',name:'Постное',emoji:'🌱',pi:2,recipes:[]},
];

const BASE_RECIPES=[
  {id:1,name:'Овсяная каша с персиком',cat:'Завтрак',emoji:'🥣',
   time:15,baseServ:2,kcal:320,b:10,f:7,u:52,tags:['быстро','полезно'],video:'https://youtube.com',
   safefood:true,safeWhy:'мягкая, тёплая, ни к чему не обязывает',rating:null,myNotes:[],
   ingredients:[{n:'Овсянка',amt:80,unit:'г'},{n:'Молоко',amt:300,unit:'мл'},{n:'Персик',amt:1,unit:'шт'},{n:'Мёд',amt:1,unit:'ч.л.'},{n:'Корица',amt:0.5,unit:'ч.л.'}],
   steps:['Влей молоко в кастрюлю, доведи до кипения на среднем огне.','Всыпь овсянку, убавь огонь. Вари, помешивая, 5–7 минут до нужной густоты.','Персик нарежь дольками. Выложи на кашу, полей мёдом, присыпь корицей.'],
   notes:'Можно заменить молоко растительным. Замороженные персики тоже подойдут.'},
  {id:2,name:'Тыквенный крем-суп',cat:'Обед',emoji:'🎃',
   time:40,baseServ:4,kcal:210,b:5,f:9,u:28,tags:['осень','уютно'],video:null,
   safefood:true,safeWhy:'согревает изнутри, бархатный и нежный',rating:'love',myNotes:[{date:'12 мая',text:'Добавила имбирь — стало намного интереснее. В следующий раз попробую с кокосовым молоком вместо сливок 🥥'}],
   ingredients:[{n:'Тыква',amt:600,unit:'г'},{n:'Лук',amt:1,unit:'шт'},{n:'Чеснок',amt:2,unit:'зуб.'},{n:'Оливковое масло',amt:2,unit:'ст.л.'},{n:'Сливки',amt:100,unit:'мл'},{n:'Морская соль',amt:1,unit:'ч.л.'},{n:'Мускатный орех',amt:0.25,unit:'ч.л.'}],
   steps:['Тыкву очисти и нарежь кубиками. Лук нарежь полукольцами, чеснок — пластинками.','В кастрюле разогрей масло, обжарь лук 5 мин. Добавь чеснок, ещё 1 минуту.','Выложи тыкву, залей водой. Вари 20 минут.','Пробей блендером, влей сливки, посоли, добавь мускатный орех. Прогрей ещё 3 мин.'],
   notes:'Для насыщенного вкуса запеки тыкву при 200°C 25 минут перед варкой.'},
  {id:3,name:'Паста карбонара',cat:'Ужин',emoji:'🍝',
   time:25,baseServ:2,kcal:520,b:22,f:18,u:64,tags:['итальянское'],video:'https://youtube.com',
   safefood:false,rating:'love',
   ingredients:[{n:'Паста',amt:160,unit:'г'},{n:'Яйца',amt:2,unit:'шт'},{n:'Сыр',amt:60,unit:'г'},{n:'Панчетта',amt:80,unit:'г'},{n:'Чеснок',amt:1,unit:'зуб.'},{n:'Морская соль',amt:1,unit:'ч.л.'}],
   steps:['Отвари пасту аль денте. Сохрани стакан воды от варки!','В миске взбей яйца с тёртым сыром и перцем.','Обжарь панчетту с чесноком до золотистости. Убери чеснок.','Горячую пасту брось к панчетте, сними с огня. Влей яичную смесь, быстро перемешай, добавляя воду по ложке.'],
   notes:'Главный секрет: яйца нельзя перегреть — получится омлет. Снимай с огня перед добавлением смеси.'},
  {id:4,name:'Матча-латте с пенкой',cat:'Напитки',emoji:'🍵',
   time:10,baseServ:1,kcal:140,b:5,f:5,u:18,tags:['уютно'],video:'https://youtube.com',
   safefood:true,safeWhy:'ритуал, который замедляет время',rating:'love',myNotes:[{date:'15 мая',text:'Matcha Forest — лучшее что брала. Церемониальный сорт, не горчит совсем 💚'}],
   ingredients:[{n:'Матча',amt:2,unit:'г'},{n:'Горячая вода',amt:30,unit:'мл'},{n:'Молоко',amt:200,unit:'мл'},{n:'Мёд',amt:1,unit:'ч.л.'}],
   steps:['Просей матчу через ситечко.','Добавь 30 мл воды 75°C. Взбей венчиком зигзагами.','Молоко нагрей и вспени. Влей матча, добавь мёд, сверху — пенка.'],
   notes:'Температура воды критична: при 100°C матча горчит. 75°C — дай кипятку постоять 3 минуты.'},
  {id:5,name:'Банановый кекс-перевёртыш',cat:'Десерт',emoji:'🍌',
   time:60,baseServ:8,kcal:380,b:6,f:14,u:58,tags:['выпечка'],video:null,
   safefood:true,safeWhy:'запах выпечки — лучшее лекарство',rating:'good',myNotes:[],
   ingredients:[{n:'Бананы',amt:3,unit:'шт'},{n:'Масло',amt:100,unit:'г'},{n:'Сахар',amt:150,unit:'г'},{n:'Яйца',amt:2,unit:'шт'},{n:'Мука',amt:200,unit:'г'},{n:'Разрыхлитель',amt:1,unit:'ч.л.'},{n:'Ваниль',amt:1,unit:'ч.л.'}],
   steps:['Разогрей духовку до 180°C.','На дно формы выложи карамельный соус (масло + сахар 5 мин). Сверху — бананы вдоль.','Взбей масло с сахаром, добавь яйца по одному, ваниль. Вмешай муку с разрыхлителем.','Вылей тесто на бананы. Выпекай 40–45 минут. Дай остыть 10 минут, переверни.'],
   notes:'Бананы должны быть очень спелыми — тёмными. Они слаще и ароматнее.'},
  {id:6,name:'Греческий салат',cat:'Салат',emoji:'🥗',
   time:10,baseServ:2,kcal:190,b:7,f:13,u:12,tags:['свежее','быстро'],video:null,
   safefood:false,rating:'ok',myNotes:[{date:'3 мая',text:'Добавила каперсы — намного интереснее стало'}],
   ingredients:[{n:'Помидоры',amt:200,unit:'г'},{n:'Огурец',amt:150,unit:'г'},{n:'Перец болгарский',amt:1,unit:'шт'},{n:'Лук',amt:0.5,unit:'шт'},{n:'Маслины',amt:80,unit:'г'},{n:'Фета',amt:100,unit:'г'},{n:'Оливковое масло',amt:2,unit:'ст.л.'},{n:'Лимон',amt:0.5,unit:'шт'}],
   steps:['Нарежь все овощи, выложи в миску с маслинами.','Полей маслом и лимонным соком, перемешай.','Сверху выложи фету кубиками. Не солить — фета достаточно солёная.'],
   notes:'Классически фета не перемешивается, а выкладывается сверху цельным куском.'},
  {id:7,name:'Тост с авокадо',cat:'Завтрак',emoji:'🥑',
   time:10,baseServ:1,kcal:290,b:8,f:17,u:28,tags:['быстро'],video:'https://youtube.com',
   safefood:true,safeWhy:'собрать и съесть не думая — идеально',rating:'good',myNotes:[],
   ingredients:[{n:'Хлеб',amt:2,unit:'ломт.'},{n:'Авокадо',amt:1,unit:'шт'},{n:'Лимон',amt:0.5,unit:'шт'},{n:'Морская соль',amt:1,unit:'щепотка'},{n:'Яйца',amt:1,unit:'шт'}],
   steps:['Поджарь хлеб в тостере.','Авокадо разомни вилкой с лимонным соком, солью и перцем.','Намажь на тост. По желанию — добавь яйцо пашот сверху.'],
   notes:'Авокадо окисляется быстро — готовь прямо перед едой.'},
  {id:8,name:'Шоколадный фондан',cat:'Десерт',emoji:'🍫',
   time:30,baseServ:4,kcal:450,b:8,f:22,u:56,tags:['выпечка','праздник'],video:null,
   safefood:false,rating:'love',myNotes:[{date:'1 мая',text:'В следующий раз попробую добавить в центр кусочек соленой карамели 🤤'}],
   ingredients:[{n:'Тёмный шоколад',amt:150,unit:'г'},{n:'Масло',amt:80,unit:'г'},{n:'Яйца',amt:3,unit:'шт'},{n:'Сахар',amt:80,unit:'г'},{n:'Мука',amt:40,unit:'г'}],
   steps:['Духовку до 200°C. Формочки смажь маслом, посыпь какао.','Растопи шоколад с маслом на водяной бане. Остуди.','Взбей яйца с сахаром добела, влей шоколад, добавь муку.','Разлей по формочкам. Выпекай ровно 10–12 минут.'],
   notes:'Время критично: 10 мин = жидкий центр, 12 мин = чуть схватившийся.'},
];

const PLAN={
  0:{0:'Овсянка с персиком',1:'Тыквенный суп',2:'Паста карбонара'},
  2:{0:'Тост с авокадо',2:'Шоколадный фондан'},
  4:{1:'Греческий салат',2:'Паста карбонара'},
};
const INIT_SHOP=[
  {id:1, name:'Тыква',              amount:'1 кг',  price:85,  cat:'🥬 Овощи и фрукты',  done:false},
  {id:2, name:'Паста спагетти',     amount:'400 г', price:65,  cat:'🌾 Крупы',            done:true },
  {id:3, name:'Пармезан',           amount:'100 г', price:220, cat:'🥛 Молочное',         done:false},
  {id:4, name:'Яйца',               amount:'10 шт', price:110, cat:'🥛 Молочное',         done:false},
  {id:5, name:'Авокадо',            amount:'2 шт',  price:180, cat:'🥬 Овощи и фрукты',  done:false},
  {id:6, name:'Матча',              amount:'30 г',  price:350, cat:'🫖 Напитки',           done:false},
  {id:7, name:'Бананы',             amount:'5 шт',  price:75,  cat:'🥬 Овощи и фрукты',  done:true },
  {id:8, name:'Масло',              amount:'200 г', price:145, cat:'🥛 Молочное',         done:false},
  {id:9, name:'Губки для посуды',   amount:'3 шт',  price:89,  cat:'🧹 Бытовое',          done:false},
  {id:10,name:'Жидкость для посуды',amount:'1 шт',  price:135, cat:'🧹 Бытовое',          done:false},
  {id:11,name:'Туалетная бумага',   amount:'12 рул.',price:280, cat:'🧹 Бытовое',         done:false},
  {id:12,name:'Бумажные полотенца', amount:'2 рул.',price:145, cat:'🧹 Бытовое',          done:true },
];

const HOUSEHOLD_QUICK = [
  '🧽 Губки','🧴 Средство для посуды','🪣 Средство для унитаза',
  '🫧 Средство для стекол','🧻 Туалетная бумага','🗞️ Бумажные полотенца',
  '🧺 Порошок / капсулы','🌿 Кондиционер для белья','🪥 Зубная паста',
  '🧼 Мыло','🛁 Гель для душа','💊 Таблетки для посудомойки',
  '🐱 Корм для Эльзы','🐱 Наполнитель для лотка',
];
const CHANNELS=[
  {id:1,name:'Рецепты Бабушки Эммы',type:'YouTube',pi:0,desc:'Домашняя кухня, проверенные рецепты.',tags:['русская кухня','выпечка'],url:'https://youtube.com'},
  {id:2,name:'Joshua Weissman',     type:'YouTube',pi:1,desc:'But cheaper. Готовим всё сами — хлеб, соусы, фастфуд.',tags:['базовые техники','хлеб'],url:'https://youtube.com/@JoshuaWeissman'},
  {id:3,name:'Bon Appétit',         type:'YouTube',pi:2,desc:'Профессиональная кухня для домашних поваров.',tags:['техники','выпечка'],url:'https://youtube.com/@bonappetit'},
  {id:4,name:'Сладкое меню',        type:'YouTube',pi:4,desc:'Десерты, торты, капкейки — для уютных вечеров.',tags:['десерты','торты'],url:'https://youtube.com'},
  {id:5,name:'Internet Shaquille',  type:'YouTube',pi:3,desc:'Быстро, вкусно. Объясняет почему что-то работает.',tags:['быстро','наука еды'],url:'https://youtube.com/@internetshaquille'},
  {id:6,name:'Tasty',               type:'Сайт',   pi:5,desc:'Огромная база рецептов на все случаи жизни.',tags:['база','разное'],url:'https://tasty.co'},
];
const RATINGS={
  nope:{label:'💔 Не моё',    cls:'on-nope',bg:'#F8E8E8'},
  ok:  {label:'🤔 Доработать',cls:'on-ok',  bg:'#FFF4D4'},
  good:{label:'👍 Неплохо',   cls:'on-good',bg:'#E8F4E8'},
  love:{label:'🔥 Пушка!',   cls:'on-love',bg:'#FFF0E8'},
};
const CATS=['Все','Завтрак','Обед','Ужин','Салат','Десерт','Напитки'];
const CEMOJI={'Все':'🍽️','Завтрак':'☀️','Обед':'🌿','Ужин':'🌙','Салат':'🥗','Десерт':'🍰','Напитки':'🫖'};
const DAYS=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const WISHES_DATA=[
  {id:1,n:'Хинкали домашние',cat:'Ужин',e:'🥟',done:false},
  {id:2,n:'Чизкейк без выпечки',cat:'Десерт',e:'🍰',done:true},
  {id:3,n:'Борщ классический',cat:'Обед',e:'🍲',done:false},
  {id:4,n:'Роллы маки',cat:'Ужин',e:'🍱',done:false},
  {id:5,n:'Матча-лимонад',cat:'Напитки',e:'🍹',done:false},
  {id:6,n:'Морковный пирог',cat:'Выпечка',e:'🥕',done:true},
];

function fmt(val,unit,scale){
  const v=val*scale;
  if(['шт','зуб.','ломт.','щепотка','банка','головка'].includes(unit)){
    if(v<=.25)return`¼ ${unit}`;if(v<=.5)return`½ ${unit}`;if(v<=.75)return`¾ ${unit}`;
    return`${Math.round(v)} ${unit}`;
  }
  if(unit==='ч.л.'||unit==='ст.л.'){
    if(v<=.25)return`¼ ${unit}`;if(v<=.5)return`½ ${unit}`;
    return`${v%1===0?v:v.toFixed(1)} ${unit}`;
  }
  return`${Math.round(v)} ${unit}`;
}
function getDayRu(){
  const d=['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
  const m=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const n=new Date();return`${d[n.getDay()]}, ${n.getDate()} ${m[n.getMonth()]}`;
}
function getMonthRu(){return['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][new Date().getMonth()];}
function getTodayIdx(){const d=new Date().getDay();return d===0?6:d-1;}

// ─── PANTRY ITEM with qty bar ────────────────────────────────────────────

function PantryItem({item, onEdit}){
  const [editing, setEditing]=useState(false);
  const [val,setVal]=useState(String(item.qty));
  const pct=Math.max(0,Math.min(100,(item.qty/item.max)*100));
  const isEmpty=item.qty<=0;
  const isLow=!isEmpty&&item.qty<=item.low;
  const barColor=isEmpty?'#C4A0A0':isLow?'#E8855A':pct>60?'#6B8C6E':'#D4A843';

  const save=()=>{
    const n=parseFloat(val);
    if(!isNaN(n)&&n>=0) onEdit(item.id,n);
    setEditing(false);
  };

  return (
    <div className={`shi ${isLow?'low':''} ${isEmpty?'empty':''}`}>
      <span style={{fontSize:'1.1rem'}}>{item.e}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:500,color:'var(--brn)',fontSize:'.8rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.n}</div>
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          {editing?(
            <input className="shi-edit-inp" autoFocus value={val}
              onChange={e=>setVal(e.target.value)}
              onBlur={save} onKeyDown={e=>{if(e.key==='Enter')save();if(e.key==='Escape')setEditing(false);}}/>
          ):(
            <span className="shi-qty">{isEmpty?'нет':item.qty}</span>
          )}
          <span className="shi-unit">{item.unit}</span>
        </div>
        <div className="qty-bar-wrap">
          <div className="qty-bar" style={{width:`${pct}%`,background:barColor}}/>
        </div>
      </div>
      <button className="shi-edit-btn" onClick={()=>{setVal(String(item.qty));setEditing(true);}}>✏️</button>

    </div>
  );
}

// ─── RECIPE MODAL ────────────────────────────────────────────────────────

function StepTimer({text, stepIdx}){
  const [secs, setSecs] = useState(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const match = text.match(/(\d+)[\s-]*(мин|минут|час|часа|часов|сек)/i);
  if(!match) return <div className="step-txt">{text}</div>;

  const rawN = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const totalSecs = unit.startsWith('час') ? rawN*3600 : unit.startsWith('сек') ? rawN : rawN*60;

  const cur = secs !== null ? secs : totalSecs;
  const mm = String(Math.floor(cur/60)).padStart(2,'0');
  const ss = String(cur%60).padStart(2,'0');
  const urgent = cur <= 30 && cur > 0;

  useState(()=>{
    if(!running) return;
    if(cur<=0){ setDone(true); setRunning(false); return; }
    const t=setTimeout(()=>setSecs(s=>(s||totalSecs)-1), 1000);
    return ()=>clearTimeout(t);
  });

  const [,setTick]=useState(0);
  if(running){
    setTimeout(()=>setTick(t=>t+1),1000);
  }

  const handleStart=()=>{
    if(done){ setSecs(totalSecs); setDone(false); setRunning(false); return; }
    if(secs===null) setSecs(totalSecs);
    setRunning(r=>!r);
  };

  return (
    <div className="step-txt" style={{display:'flex',alignItems:'flex-start',gap:4,flexWrap:'wrap'}}>
      <span style={{flex:1}}>{text}</span>
      {running||secs!==null?(
        <span className={`step-timer-display ${urgent?'urgent':''}`}>
          {done?'✅ готово!':`⏱ ${mm}:${ss}`}
          <button onClick={handleStart}
            style={{background:'none',border:'none',cursor:'pointer',fontSize:'.8rem',padding:'0 2px',color:'inherit'}}>
            {done?'↺':running?'⏸':'▶'}
          </button>
        </span>
      ):(
        <button className={`step-timer-btn ${done?'done':''}`} onClick={handleStart}>
          ⏱ {rawN} {unit.startsWith('час')?'ч':unit.startsWith('сек')?'сек':'мин'}
        </button>
      )}
    </div>
  );
}

function IngRow({ing, scale, pantry}){
  const pm=matchPantry(ing.n,pantry);
  const have=!!pm&&pm.qty>0;
  const hasButLow=!!pm&&pm.qty>0&&pm.qty<=pm.low;
  return (
    <div className="ing-row" style={hasButLow?{background:'rgba(232,133,90,.08)'}:{}}>
      <div className={`ing-st ${have?'have':'need'}`}>{have?'✓':'+'}</div>
      <span className="ing-name">
        {ing.n}
        {hasButLow&&<span style={{fontSize:'.7rem',color:'var(--tr2)',marginLeft:5}}>⚠ мало</span>}
        {isInSeason(ing.n)&&<span className="season-badge">🌿 сезон</span>}
      </span>
      <span className="ing-amount">{fmt(ing.amt,ing.unit,scale)}</span>
      {pm&&<span style={{fontFamily:"'Caveat',cursive",fontSize:'.72rem',color:'var(--txt3)',marginLeft:4}}>/ есть {pm.qty}{pm.unit}</span>}
    </div>
  );
}

function HouseholdBtn({label, items, onAdd}){
  const name=label.replace(/^.\s/,'');
  const already=!!items.find(i=>i.name.toLowerCase()===name.toLowerCase());
  return (
    <button onClick={()=>onAdd(label)}
      style={{background:already?'rgba(107,140,110,.12)':'var(--parch)',
        border:`1px solid ${already?'var(--sage2)':'var(--brd)'}`,
        borderRadius:18,padding:'4px 12px',fontFamily:"'Caveat',cursive",fontSize:'.82rem',
        color:already?'var(--sage)':'var(--txt2)',cursor:'pointer',
        display:'flex',alignItems:'center',gap:4}}>
      {already&&<span style={{fontSize:'.7rem'}}>✓</span>}
      {label}
    </button>
  );
}

function ExpBar({m, maxTotal}){
  const h=Math.round((m.food+m.house)/maxTotal*90);
  const fh=Math.round((m.food/maxTotal)*90);
  const hh=Math.round((m.house/maxTotal)*90);
  return (
    <div className="exp-bar-group" title={m.month+': еда '+m.food+'₽ + быт '+m.house+'₽'}>
      <div className="exp-bar-stack" style={{height:h}}>
        <div className="exp-bar" style={{background:'var(--blush)',height:hh}}/>
        <div className="exp-bar" style={{background:m.current?'var(--tr)':'var(--sage2)',height:fh}}/>
      </div>
      <div className={`exp-label ${m.current?'cur':''}`}>{m.month}</div>
    </div>
  );
}

function ShelfSection({shelf, onEdit}){
  return (
    <div className="shelf">
      <div className="sh2">
        <span style={{fontSize:'1.3rem'}}>{shelf.cat.split(' ')[0]}</span>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'var(--brn)',fontStyle:'italic'}}>{shelf.cat.slice(shelf.cat.indexOf(' ')+1)}</span>
        <span style={{marginLeft:'auto',fontFamily:"'Caveat',cursive",fontSize:'.85rem',color:'var(--txt3)'}}>{shelf.items.length} позиций</span>
      </div>
      <div className="shitems">
        {shelf.items.map(item=><PantryItem key={item.id} item={item} onEdit={onEdit}/>)}
      </div>
    </div>
  );
}

function RecipeModal({recipe:r, onClose, onRate, onAddMissing, pantry, onCook, onAddNote}){
  const [srv,setSrv]=useState(r.baseServ||2);
  const [cooked,setCooked]=useState(false);
  const [noteText,setNoteText]=useState('');
  const scale=srv/(r.baseServ||2);

  const cookResult = cooked ? r.ingredients.map(ing=>{
    const pm=matchPantry(ing.n,pantry);
    if(!pm) return null;
    const used=ing.amt*scale;
    return {name:pm.n,was:pm.qty,now:Math.max(0,pm.qty-used),unit:pm.unit};
  }).filter(Boolean) : [];

  const missing=r.ingredients.filter(i=>!matchPantry(i.n,pantry));

  const handleCook=()=>{
    onCook(r.ingredients,scale);
    setCooked(true);
  };

  return (
    <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal">
        <div className="mhdr">
          <span className="m-emoji">{r.emoji}</span>
          <div>
            <div className="m-title">{r.name}</div>
            <div style={{display:'flex',gap:6,marginTop:3,flexWrap:'wrap'}}>
              <span className="tag">{r.cat}</span>
              <span className="tag">⏱ {r.time} мин</span>
              {r.video&&<a href={r.video} target="_blank" rel="noreferrer" style={{textDecoration:'none'}}><span className="tag" style={{background:'rgba(192,85,42,.1)',borderColor:'var(--tr2)',color:'var(--tr)'}}>▶ видео</span></a>}
            </div>
          </div>
          <button className="m-close" onClick={onClose}>✕</button>
        </div>

        <div className="mbody">
          
          <div className="srv-wrap">
            <span className="srv-label">🍽️ Порции:</span>
            <div className="srv-btns">
              {[1,2,3,4].map(n=><button key={n} className={`srv-btn ${srv===n?'on':''}`} onClick={()=>setSrv(n)}>{n}</button>)}
            </div>
            <div className="srv-kbju">
              <span className="kc kal">🔥 {Math.round(r.kcal/r.baseServ*srv)} ккал</span>
              <span className="kc bel">Б {(r.b/r.baseServ*srv).toFixed(1)}г</span>
              <span className="kc jir">Ж {(r.f/r.baseServ*srv).toFixed(1)}г</span>
              <span className="kc ugl">У {(r.u/r.baseServ*srv).toFixed(1)}г</span>
            </div>
          </div>

          
          <div className="sec">🧺 Ингредиенты</div>
          <div className="ing-legend"><span>✓ есть в полочке</span><span style={{color:'var(--tr)'}}>+ нужно купить</span></div>
          <div className="ing-list">
            {r.ingredients.map((ing,i)=>(
              <IngRow key={i} ing={ing} scale={scale} pantry={pantry}/>
            ))}
          </div>

          {missing.length>0&&(
            <div className="add-miss" onClick={()=>{onAddMissing(missing,r.name);onClose();}}>
              <span style={{fontSize:'1.2rem'}}>🛒</span>
              <span style={{fontFamily:"'Caveat',cursive",fontSize:'.9rem',color:'var(--tr)'}}>Добавить {missing.length} недостающих в список покупок</span>
              <span style={{marginLeft:'auto'}}>→</span>
            </div>
          )}
          {missing.length===0&&(
            <div style={{background:'rgba(107,140,110,.1)',border:'1px solid var(--sage2)',borderRadius:10,padding:'10px 14px',marginBottom:20,fontFamily:"'Caveat',cursive",fontSize:'.9rem',color:'var(--sage)'}}>
              ✨ Все ингредиенты уже есть в полочке!
            </div>
          )}

          
          <div className="sec">📋 Приготовление</div>
          <div className="steps">
            {r.steps.map((s,i)=>(
              <div key={i} className="step">
                <div className="step-num">{i+1}</div>
                <StepTimer text={s} stepIdx={i}/>
              </div>
            ))}
          </div>
          {r.notes&&<div className="mnotes">{r.notes}</div>}

          
          {!cooked?(
            <button className="cook-btn" onClick={handleCook}>
              <span style={{fontSize:'1.3rem'}}>🍳</span> Приготовила! — списать продукты с полочки
            </button>
          ):(
            <div className="cook-success">
              <div style={{marginBottom:8,fontSize:'1rem'}}>✅ Готово! Полочка обновлена</div>
              {cookResult.map((cr,i)=>(
                <div key={i} style={{fontSize:'.82rem',opacity:.8}}>
                  {cr.name}: {cr.was} → <strong>{Math.max(0,Math.round(cr.now*10)/10)} {cr.unit}</strong>
                </div>
              ))}
            </div>
          )}

          
          <div style={{background:'var(--parch)',borderRadius:13,padding:'14px 16px',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:20}}>
            <span style={{fontFamily:"'Caveat',cursive",fontSize:'.95rem',color:'var(--txt2)'}}>Оценить:</span>
            <div className="rate-btns">
              {Object.entries(RATINGS).map(([key,val])=>(
                <button key={key} className={`rb ${r.rating===key?val.cls:''}`}
                  style={r.rating===key?{background:val.bg}:{}}
                  onClick={()=>onRate(r.id,key)}>
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          
          <div className="mynotes-wrap">
            <div className="sec">📓 Мои заметки</div>
            {(r.myNotes||[]).length===0&&(
              <div style={{fontFamily:"'Caveat',cursive",fontSize:'.88rem',color:'var(--txt3)',marginBottom:10,fontStyle:'italic'}}>
                пока пусто — напиши что получилось, что изменила, что попробовать в следующий раз...
              </div>
            )}
            {(r.myNotes||[]).map((n,i)=>(
              <div key={i} className="mynote-item">
                <div className="mynote-date">{n.date}</div>
                <div className="mynote-txt">{n.text}</div>
              </div>
            ))}
            <div className="mynote-add">
              <textarea className="mynote-ta" rows={2} placeholder="что-то получилось по-особенному, идея на следующий раз..."
                value={noteText} onChange={e=>setNoteText(e.target.value)}/>
              <button className="mynote-save" onClick={()=>{
                if(!noteText.trim()) return;
                const d=new Date();
                const months=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
                onAddNote(r.id,{date:`${d.getDate()} ${months[d.getMonth()]}`,text:noteText.trim()});
                setNoteText('');
              }}>
                сохранить ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RECIPE CARD ─────────────────────────────────────────────────────────

function RecipeCard({r,onClick}){
  return (
    <div className="rc" onClick={onClick}>
      <div className="rc-img">
        <span>{r.emoji}</span>
        <span className="rc-cat">{r.cat}</span>
        {r.video&&<span className="rc-vid">▶ видео</span>}
        {r.rating==='love'&&<span className="rc-love">🔥</span>}
        {r.safefood&&<span className="rc-safe">🫧 safe</span>}
      </div>
      <div className="rc-body">
        <div className="rc-name">{r.name}</div>
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

// ─── PAGES ───────────────────────────────────────────────────────────────

function MoonWidget(){
  const moon=getMoonPhase();
  const d=new Date();
  return (
    <div className="moon-widget">
      <div className="moon-big">{moon.emoji}</div>
      <div className="moon-info">
        <div className="moon-phase-name">{moon.name}</div>
        <div className="moon-tip">{moon.tip}</div>
        <div className="moon-date">{d.getDate()} {MONTHS_RU[d.getMonth()]} · день {moon.age} лунного цикла</div>
      </div>
    </div>
  );
}

function DiaryDayRow({day, entries, target}){
  const total=entries.reduce((s,e)=>s+e.kcal,0);
  const pct=Math.min(total/target*100,100);
  const color=pct>=85&&pct<=115?'var(--sage)':pct<85?'var(--gold2)':'var(--tr2)';
  const dayLabel=DAYS_RU[day.getDay()];
  const isToday=day.toDateString()===new Date().toDateString();
  return (
    <div className="diary-week-row">
      <div className="diary-week-day" style={{color:isToday?'var(--tr)':'var(--txt3)',fontWeight:isToday?700:400}}>
        {dayLabel}
      </div>
      <div className="diary-week-fill">
        <div className="diary-week-bar" style={{width:`${pct}%`,background:color}}/>
      </div>
      <div style={{fontFamily:"'Caveat',cursive",fontSize:'.82rem',color:total?color:'var(--brd)',minWidth:70,textAlign:'right'}}>
        {total?`${total} ккал`:'—'}
      </div>
    </div>
  );
}

function DiaryQuickBtn({item, onAdd}){
  return (
    <button onClick={()=>onAdd(item)}
      style={{background:'var(--parch)',border:'1px solid var(--brd)',borderRadius:18,
        padding:'5px 12px',fontFamily:"'Caveat',cursive",fontSize:'.82rem',
        color:'var(--txt2)',cursor:'pointer',display:'flex',alignItems:'center',gap:5,
        transition:'all .15s'}}
      onMouseOver={e=>e.currentTarget.style.borderColor='var(--tr2)'}
      onMouseOut={e=>e.currentTarget.style.borderColor='var(--brd)'}>
      {item.e} {item.n}
    </button>
  );
}

function DiaryPage({entriesState, setEntriesState}){
  const [weekOffset,setWeekOffset]=useState(0);
  const entries=entriesState||{};
  const [custom,setCustom]=useState('');
  const [customKcal,setCustomKcal]=useState('');
  const [showQuick,setShowQuick]=useState(true);
  const target=1800;

  const weekDays=getWeekDays(weekOffset);
  const todayKey=new Date().toDateString();
  const [selectedDay,setSelectedDay]=useState(todayKey);

  const dayEntries=entries[selectedDay]||[];
  const dayKcal=dayEntries.reduce((s,e)=>s+e.kcal,0);
  const dayB=dayEntries.reduce((s,e)=>s+(e.b||0),0);
  const dayF=dayEntries.reduce((s,e)=>s+(e.f||0),0);
  const dayU=dayEntries.reduce((s,e)=>s+(e.u||0),0);
  const pct=Math.min(Math.round(dayKcal/target*100),100);
  const barColor=pct>=85&&pct<=115?'var(--sage)':pct<85?'var(--gold2)':'var(--tr2)';

  const addEntry=item=>{
    setEntriesState(prev=>({...prev,[selectedDay]:[...(prev[selectedDay]||[]),{...item,id:Date.now()}]}));
  };
  const removeEntry=id=>{
    setEntriesState(prev=>({...prev,[selectedDay]:(prev[selectedDay]||[]).filter(e=>e.id!==id)}));
  };
  const addCustom=()=>{
    if(!custom.trim()||!customKcal) return;
    addEntry({n:custom,e:'🍽️',kcal:parseInt(customKcal)||0,b:0,f:0,u:0});
    setCustom(''); setCustomKcal('');
  };

  const selDate=new Date(selectedDay);
  const selLabel=`${DAYS_RU[selDate.getDay()]}, ${selDate.getDate()} ${MONTHS_RU[selDate.getMonth()]}`;

  return (
    <div>
      <div className="pt">📓 Дневник питания</div>
      <div className="ps">что реально съела сегодня</div>
      <div className="div"/>

      <div className="diary-nav">
        <button className="diary-nav-btn" onClick={()=>setWeekOffset(w=>w-1)}>‹</button>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'var(--brn)',fontStyle:'italic'}}>
          {weekDays[0].getDate()} — {weekDays[6].getDate()} {MONTHS_RU[weekDays[6].getMonth()]}
        </span>
        <button className="diary-nav-btn" onClick={()=>setWeekOffset(w=>w+1)}>›</button>
      </div>

      <div className="diary-week-card">
        {weekDays.map((day,i)=>(
          <div key={i} onClick={()=>setSelectedDay(day.toDateString())}
            style={{cursor:'pointer',background:day.toDateString()===selectedDay?'rgba(192,85,42,.05)':'transparent',
              borderRadius:8,margin:'2px -4px',padding:'0 4px'}}>
            <DiaryDayRow day={day} entries={entries[day.toDateString()]||[]} target={target}/>
          </div>
        ))}
      </div>

      <div style={{background:'var(--ww)',border:'1px solid var(--brd)',borderRadius:15,padding:18,boxShadow:'0 2px 10px var(--sh)'}}>
        <div className="diary-day-header">
          <span className="diary-day-label">{selLabel}</span>
          <div className="diary-kbju-bar">
            <span className="diary-k" style={{color:'var(--tr)'}}>🔥 {dayKcal} / {target}</span>
            <span className="diary-k" style={{color:'var(--sage)'}}>Б {dayB}г</span>
            <span className="diary-k" style={{color:'var(--gold)'}}>Ж {dayF}г</span>
            <span className="diary-k" style={{color:'var(--rose)'}}>У {dayU}г</span>
          </div>
        </div>

        <div className="diary-goal-bar">
          <div className="diary-goal-fill" style={{width:`${pct}%`,background:barColor}}/>
        </div>
        <div style={{fontFamily:"'Caveat',cursive",fontSize:'.78rem',color:'var(--txt3)',marginBottom:14}}>
          {pct<85?`ещё ${target-dayKcal} ккал до цели`:pct<=115?'цель выполнена ✨':'немного превысила цель'}
        </div>

        {dayEntries.length>0&&(
          <div className="diary-entries">
            {dayEntries.map(e=>(
              <div key={e.id} className="diary-entry">
                <span className="diary-entry-emoji">{e.e}</span>
                <span className="diary-entry-name">{e.n}</span>
                <span className="diary-entry-kcal">🔥 {e.kcal}</span>
                {e.b>0&&<span style={{fontFamily:"'Caveat',cursive",fontSize:'.78rem',color:'var(--txt3)'}}>Б{e.b} Ж{e.f} У{e.u}</span>}
                <button className="diary-entry-del" onClick={()=>removeEntry(e.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
        {dayEntries.length===0&&(
          <div style={{fontFamily:"'Caveat',cursive",fontSize:'.9rem',color:'var(--brd)',textAlign:'center',padding:'16px 0',marginBottom:14}}>
            пока ничего не записано
          </div>
        )}

        <div style={{borderTop:'1px solid var(--brd)',paddingTop:14}}>
          <div style={{fontFamily:"'Caveat',cursive",fontSize:'.88rem',color:'var(--txt2)',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span>Быстро добавить</span>
            <button onClick={()=>setShowQuick(q=>!q)}
              style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'Caveat',cursive",fontSize:'.82rem',color:'var(--txt3)'}}>
              {showQuick?'скрыть ▲':'показать ▼'}
            </button>
          </div>
          {showQuick&&(
            <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:14}}>
              {DIARY_QUICK.map(item=>(
                <DiaryQuickBtn key={item.n} item={item} onAdd={addEntry}/>
              ))}
            </div>
          )}
          <div className="diary-add-row">
            <input className="inp" placeholder="своё блюдо..." value={custom} onChange={e=>setCustom(e.target.value)} style={{flex:2}}/>
            <input className="inp" placeholder="ккал" value={customKcal} onChange={e=>setCustomKcal(e.target.value)} style={{flex:1,maxWidth:80}} type="number"/>
            <button className="btn btn-p" onClick={addCustom}>+ добавить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrainOverlay(){
  return (
    <svg style={{position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:9999,opacity:.032}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)"/>
    </svg>
  );
}

function Stars(){
  const pos=[
    {t:'8%',l:'12%',s:'.8rem'},{t:'15%',l:'88%',s:'.6rem'},{t:'32%',l:'5%',s:'.5rem'},
    {t:'45%',l:'96%',s:'.9rem'},{t:'68%',l:'8%',s:'.6rem'},{t:'75%',l:'92%',s:'.7rem'},
    {t:'88%',l:'15%',s:'.5rem'},{t:'22%',l:'50%',s:'.45rem'},{t:'55%',l:'78%',s:'.55rem'},
  ];
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
      {pos.map((p,i)=>(
        <span key={i} style={{position:'absolute',top:p.t,left:p.l,fontSize:p.s,
          color:'rgba(200,160,48,.25)',userSelect:'none',lineHeight:1,
          animation:`twinkle ${2+i*.4}s ease-in-out infinite alternate`}}>
          {i%3===0?'✦':i%3===1?'✶':'·'}
        </span>
      ))}
      <style>{`@keyframes twinkle{from{opacity:.15}to{opacity:.45}}`}</style>
    </div>
  );
}

function DecorLine(){
  return (
    <div style={{textAlign:'center',margin:'6px 0',fontFamily:"'Special Elite',cursive",
      fontSize:'.68rem',color:'rgba(200,160,48,.4)',letterSpacing:'6px',userSelect:'none'}}>
      ✦ · · · ✦ · · · ✦
    </div>
  );
}

function HomePage({recipes, setTab, onOpen}){
  const dp=PLAN[getTodayIdx()]||{};
  const loved=recipes.filter(r=>r.rating==='love');
  const stats=[
    {i:'📖',v:recipes.length,    l:'рецептов',     hint:'открыть рецепты', tab:'recipes'},
    {i:'🔥',v:loved.length,      l:'обожаемых',    hint:'смотреть оценки', tab:'ratings'},
    {i:'🫧',v:recipes.filter(r=>r.safefood).length,l:'safe food',hint:'открыть safe food',tab:'safe'},
    {i:'🗄️',v:INIT_PANTRY.length,l:'в полочке',    hint:'смотреть полочки',tab:'pantry'},
    {i:'📼',v:CHANNELS.length,   l:'каналов',      hint:'смотреть кассеты',tab:'cassettes'},
  ];
  return (
    <div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.1rem',color:'var(--brn)',marginBottom:4}}>
        Привет, <em style={{color:'var(--tr)',fontStyle:'italic'}}>котёнок!</em> 🌿
      </div>
      <div style={{fontFamily:"'Caveat',cursive",fontSize:'1.05rem',color:'var(--txt3)',marginBottom:22}}>{getDayRu()}</div>

      <div className="stats">
        {stats.map((s,i)=>(
          <div key={i} className="sc" onClick={()=>setTab(s.tab)}>
            <div className="si">{s.i}</div>
            <div className="sv">{s.v}</div>
            <div className="sl">{s.l}</div>
            <div className="sc-hint">{s.hint} →</div>
          </div>
        ))}
      </div>

      <div className="sec">☀️ Меню на сегодня</div>
      <div className="tmg">
        {[{l:'Завтрак',k:0,e:'☀️'},{l:'Обед',k:1,e:'🌿'},{l:'Ужин',k:2,e:'🌙'}].map(m=>(
          <div key={m.k} className={`ms ${dp[m.k]?'':'empty'}`}>
            <div className="ml">{m.e} {m.l}</div>
            {dp[m.k]?<div><div className="mn">{dp[m.k]}</div><div className="mk">~320 ккал</div></div>:<div className="mn">не запланировано</div>}
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={{background:'var(--ww)',border:'1.5px solid var(--gold2)',borderRadius:15,padding:18,cursor:'pointer',boxShadow:'0 2px 10px var(--sh)'}} onClick={()=>setTab('ratings')}>
          <div className="sec">🔥 Пушечные рецепты</div>
          {loved.slice(0,3).map(r=>(
            <div key={r.id} style={{display:'flex',alignItems:'center',gap:9,padding:'7px 0',borderBottom:'1px solid var(--brd)'}} onClick={e=>{e.stopPropagation();onOpen(r);}}>
              <span style={{fontSize:'1.2rem'}}>{r.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'.88rem',color:'var(--brn)',fontStyle:'italic'}}>{r.name}</div>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:'.72rem',color:'var(--txt3)'}}>{r.cat} · {r.time} мин</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:'var(--ww)',border:'1px solid var(--brd)',borderRadius:15,padding:18,boxShadow:'0 2px 10px var(--sh)'}}>
          <div className="sec">🍽️ КБЖУ за сегодня</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
            {[{l:'Калории',v:'1240',m:'1800',c:'var(--tr)'},{l:'Белки',v:'52 г',m:'80 г',c:'var(--sage)'},{l:'Жиры',v:'38 г',m:'60 г',c:'var(--gold)'},{l:'Углеводы',v:'164 г',m:'220 г',c:'var(--rose)'}].map((n,i)=>(
              <div key={i} style={{background:'var(--parch)',borderRadius:9,padding:11}}>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:'.78rem',color:'var(--txt3)',marginBottom:3}}>{n.l}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',color:n.c,fontWeight:700}}>{n.v}</div>
                <div style={{fontFamily:"'Caveat',cursive",fontSize:'.7rem',color:'var(--txt3)'}}>из {n.m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="decor" style={{marginTop:20}}>~ сделано с любовью, только для тебя ~</div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:18}}>
        <div style={{background:'linear-gradient(135deg,rgba(107,140,110,.08),rgba(168,197,171,.05))',border:'1px solid var(--sage2)',borderRadius:15,padding:18}}>
          <div className="sec" style={{marginBottom:10}}>🌿 Сейчас в сезоне</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {(SEASONS[CUR_MONTH]||[]).map(s=>(
              <span key={s.n} style={{
                background:s.peak?'rgba(107,140,110,.18)':'rgba(107,140,110,.07)',
                border:`1px solid ${s.peak?'var(--sage)':'var(--sage2)'}`,
                borderRadius:20,padding:'4px 12px',
                fontFamily:"'Caveat',cursive",fontSize:'.86rem',
                color:s.peak?'var(--sage)':'var(--txt3)',
                display:'flex',alignItems:'center',gap:4}}>
                {s.e} {s.n}{s.peak&&<span style={{fontSize:'.65rem',opacity:.7}}>★</span>}
              </span>
            ))}
          </div>
          <div style={{fontFamily:"'Caveat',cursive",fontSize:'.75rem',color:'var(--txt3)',marginTop:10}}>
            ★ пик сезона · в рецептах сезонные ингредиенты помечены 🌿
          </div>
        </div>
        <MoonWidget/>
      </div>
    </div>
  );
}

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

function RecipeCardSearch({r, onClick, query}){
  return (
    <div className="rc" onClick={onClick}>
      <div className="rc-img">
        <span>{r.emoji}</span>
        <span className="rc-cat">{r.cat}</span>
        {r.video&&<span className="rc-vid">▶ видео</span>}
        {r.rating==='love'&&<span className="rc-love">🔥</span>}
        {r.safefood&&<span className="rc-safe">🫧 safe</span>}
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

function RecipesPage({recipes, onOpen, customCats, onUpdateCats, onAddRecipe}){
  const [cat,setCat]=useState('Все');
  const [activeCustCat,setActiveCustCat]=useState(null);
  const [query,setQuery]=useState('');
  const [showCatManager,setShowCatManager]=useState(false);
  const [newCatName,setNewCatName]=useState('');
  const [newCatEmoji,setNewCatEmoji]=useState('⚡');
  const [newCatPi,setNewCatPi]=useState(0);
  const [assignMode,setAssignMode]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [draft,setDraft]=useState({name:'',cat:'Ужин',emoji:'🍲',kcal:300,b:20,f:10,u:20,steps:[],notes:'',safefood:false,tags:[]});

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
              <RecipeCardSearch r={r} onClick={()=>!assignMode&&onOpen(r)} query={query}/>
            </div>
          );
        })}
        {!assignMode&&<button className="add-rc" onClick={()=>setShowAdd(true)}><span style={{fontSize:'1.7rem'}}>＋</span><span>новый рецепт</span></button>}
      </div>

      {showAdd&&(
        <div className="overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="mhdr"><div className="m-title">Новый рецепт</div><button className="m-close" onClick={()=>setShowAdd(false)}>✕</button></div>
            <div className="mbody" style={{display:'grid',gap:8}}>
              <input className="inp" placeholder="Название" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/>
              <div style={{display:'flex',gap:8}}>
                <input className="inp" placeholder="Эмодзи" value={draft.emoji} onChange={e=>setDraft({...draft,emoji:e.target.value})}/>
                <input className="inp" placeholder="Категория" value={draft.cat} onChange={e=>setDraft({...draft,cat:e.target.value})}/>
              </div>
              <textarea className="inp" placeholder="Ингредиенты: каждый с новой строки, формат: название|кол-во" value={draft.ingsText||''} onChange={e=>setDraft({...draft,ingsText:e.target.value})}/>
              <textarea className="inp" placeholder="Шаги: каждый с новой строки" value={draft.stepsText||''} onChange={e=>setDraft({...draft,stepsText:e.target.value})}/>
              <input className="inp" placeholder="Теги через запятую" value={draft.tagsText||''} onChange={e=>setDraft({...draft,tagsText:e.target.value})}/>
              <button className="btn btn-p" onClick={()=>{
                if(!draft.name.trim()) return;
                onAddRecipe({...draft,id:Date.now(),rating:null,video:false,love:false,ingredients:(draft.ingsText||'').split('\n').filter(Boolean).map(x=>{const [n,amt,unit]=x.split('|');return {n:n.trim(),amt:Number(amt)||1,unit:(unit||'шт').trim()};}),steps:(draft.stepsText||'').split('\n').filter(Boolean),myNotes:[],tags:(draft.tagsText||'').split(',').map(t=>t.trim()).filter(Boolean)});
                setShowAdd(false);
              }}>сохранить рецепт</button>
            </div>
          </div>
        </div>
      )}

      {list.length===0&&(
        <div style={{textAlign:'center',padding:'40px 20px',fontFamily:"'Caveat',cursive",fontSize:'1rem',color:'var(--txt3)'}}>
          {query?`ничего не нашлось по «${query}» 🔍`:'в этой папке пока пусто'}
        </div>
      )}
    </div>
  );
}

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
        <span className="wn-lbl">{(()=>{const now=new Date();const day=(now.getDay()+6)%7;const st=new Date(now);st.setDate(now.getDate()-day);const en=new Date(st);en.setDate(st.getDate()+6);const m=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];return `${st.getDate()} — ${en.getDate()} ${m[en.getMonth()]} ${en.getFullYear()}`;})()}</span>
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

function ShoppingPage({extraItems, items, setItems}){
  const [nw,setNw]=useState('');
  const [newCat,setNewCat]=useState('🥬 Овощи и фрукты');
  const [showHousehold,setShowHousehold]=useState(false);
  useEffect(()=>{if(extraItems?.length){setItems(p=>{const ex=new Set(p.map(i=>i.name.toLowerCase()));const ns=extraItems.filter(e=>!ex.has(e.name.toLowerCase()));return[...p,...ns];});}},[extraItems]);
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
              <input className="sa" value={item.amount} onChange={e=>setItems(p=>p.map(x=>x.id===item.id?{...x,amount:e.target.value}:x))} style={{maxWidth:80,border:'1px solid var(--brd)',borderRadius:8,padding:'2px 6px'}}/>
              <input className="sp" value={item.price} type="number" min="0" onChange={e=>setItems(p=>p.map(x=>x.id===item.id?{...x,price:Number(e.target.value)||0}:x))} style={{maxWidth:75,border:'1px solid var(--brd)',borderRadius:8,padding:'2px 6px'}}/>
              <button onClick={()=>remove(item.id)} style={{border:'none',background:'transparent',cursor:'pointer',color:'var(--tr)'}}>✕</button>
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
                  <span style={{textDecoration:item.done?'line-through':'none',opacity:item.done?0.5:1}}>{item.name}</span>
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

function PantryPage({pantry, onEditQty, onAddItem, onRemoveItem}){
  const cats=[...new Set(pantry.map(p=>p.cat))];
  const low=pantry.filter(p=>p.qty<=p.low&&p.qty>0);
  const empty=pantry.filter(p=>p.qty<=0);
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

      <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
        <input id="pantry-name" className="inp" placeholder="новый продукт..." style={{maxWidth:220}}/>
        <input id="pantry-cat" className="inp" placeholder="категория" style={{maxWidth:160}}/>
        <button className="btn btn-p" onClick={()=>{const n=document.getElementById('pantry-name').value.trim();const c=document.getElementById('pantry-cat').value.trim()||'Другое'; if(!n) return; onAddItem({n,cat:c}); document.getElementById('pantry-name').value='';}}>добавить</button>
      </div>

      <div className="pantry-legend">
        <span><span className="pl-dot" style={{background:'var(--sage2)'}}/> в наличии</span>
        <span><span className="pl-dot" style={{background:'#D4A843'}}/> меньше половины</span>
        <span><span className="pl-dot" style={{background:'var(--tr2)'}}/> почти кончается</span>
        <span><span className="pl-dot" style={{background:'#C4A0A0'}}/> закончилось</span>
      </div>

      {cats.map(cat=>(
        <div key={cat}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'10px 0 6px'}}>
            <span className="tag">{cat}</span>
          </div>
          {pantry.filter(p=>p.cat===cat).map(item=>(
            <div key={item.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
              <div style={{flex:1}}><PantryItem item={item} onEdit={onEditQty}/></div>
              <button onClick={()=>onRemoveItem(item.id)} style={{border:'none',background:'transparent',color:'var(--tr)',cursor:'pointer'}}>✕</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function WishlistPage({wishes, setWishes}){
  const [nw,setNw]=useState('');
  const toggle=id=>setWishes(p=>p.map(w=>w.id===id?{...w,done:!w.done}:w));
  const add=()=>{if(!nw.trim())return;setWishes(p=>[...p,{id:Date.now(),n:nw,cat:'Другое',e:'🍽️',done:false}]);setNw('');};
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
          <div style={{height:'100%',width:`${(done/wishes.length)*100}%`,background:'linear-gradient(90deg,var(--sage),var(--sage2))',borderRadius:6,transition:'width .4s'}}/>
        </div>
      </div>
      <div className="wgrid">
        {wishes.map(w=>(
          <div key={w.id} className={`wc ${w.done?'dn':''}`}>
            <span style={{fontSize:'1.8rem'}}>{w.e}</span>
            <div style={{flex:1}}><div className="wn2">{w.n}</div><div className="wcat">{w.cat}</div></div>
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

function CassetteCard({ch}){
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
        <a className="clink" href={ch.url} target="_blank" rel="noreferrer">▶ открыть</a>
      </div>
    </div>
  );
}

function CassettesPage({channels, onAddChannel, onRemoveChannel}){
  const [filter,setFilter]=useState('Все');
  const [showAdd,setShowAdd]=useState(false);
  const [draft,setDraft]=useState({name:'',type:'YouTube',url:'',desc:'',tags:''});
  const list=filter==='Все'?channels:channels.filter(c=>c.type===filter);
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
        {list.map(ch=><div key={ch.id} style={{position:'relative'}}><CassetteCard ch={ch}/><button onClick={()=>onRemoveChannel(ch.id)} style={{position:'absolute',top:6,right:6,border:'1px solid var(--brd)',borderRadius:14,padding:'2px 8px',background:'var(--ww)',color:'var(--tr)',cursor:'pointer'}}>✕</button></div>)}
        <button className="add-cc" onClick={()=>setShowAdd(true)}><span style={{fontSize:'2.2rem'}}>📼</span><span>добавить канал</span></button>
      </div>
      <div className="decor" style={{marginTop:28}}>~ нажми на кассету, чтобы открыть канал ~</div>
      {showAdd&&(<div className="overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="mhdr"><div className="m-title">Новая кассета</div><button className="m-close" onClick={()=>setShowAdd(false)}>✕</button></div><div className="mbody" style={{display:'grid',gap:8}}><input className="inp" placeholder="Название" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/><div style={{display:'flex',gap:8}}><select className="inp" value={draft.type} onChange={e=>setDraft({...draft,type:e.target.value})}><option>YouTube</option><option>Сайт</option><option>Блог</option></select><input className="inp" placeholder="URL" value={draft.url} onChange={e=>setDraft({...draft,url:e.target.value})}/></div><textarea className="inp" placeholder="Описание" value={draft.desc} onChange={e=>setDraft({...draft,desc:e.target.value})}/><input className="inp" placeholder="Теги через запятую" value={draft.tags} onChange={e=>setDraft({...draft,tags:e.target.value})}/><button className="btn btn-p" onClick={()=>{if(!draft.name.trim()||!draft.url.trim())return;onAddChannel({id:Date.now(),name:draft.name,type:draft.type,url:draft.url,desc:draft.desc,tags:draft.tags.split(',').map(t=>t.trim()).filter(Boolean),pi:Math.floor(Math.random()*PALETTES.length)});setShowAdd(false);}}>сохранить</button></div></div></div>)}
    </div>
  );
}

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

function App(){
  const [tab,setTab]=usePersistentState('tab','home');
  const [recipes,setRecipes]=usePersistentState('recipes',BASE_RECIPES);
  const [pantry,setPantry]=usePersistentState('pantry',INIT_PANTRY);
  const [customCats,setCustomCats]=usePersistentState('customCats',INIT_CUSTOM_CATS);
  const [openRecipe,setOpenRecipe]=useState(null);
  const [shopExtra,setShopExtra]=usePersistentState('shopExtra',[]);
  const [wishlist,setWishlist]=usePersistentState('wishlist',WISHES_DATA);
  const [diaryEntries,setDiaryEntries]=usePersistentState('diaryEntries',{});
  const [channels,setChannels]=usePersistentState('channels',CHANNELS);
  const [shoppingItems,setShoppingItems]=usePersistentState('shoppingItems',INIT_SHOP);
  const [globalQuery,setGlobalQuery]=useState('');

  const rate=(id,rating)=>setRecipes(p=>p.map(r=>r.id===id?{...r,rating:r.rating===rating?null:rating}:r));

  const addNote=(id,note)=>setRecipes(p=>p.map(r=>r.id===id?{...r,myNotes:[...(r.myNotes||[]),note]}:r));

  const addMissing=(missing,recipeName)=>{
    const newItems=missing.map((ing,i)=>({
      id:Date.now()+i,name:ing.n,amount:`для: ${recipeName}`,price:0,cat:'Из рецепта',done:false
    }));
    setShopExtra(p=>[...p,...newItems]);
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

  const editPantryQty=(id,newQty)=>{ setPantry(prev=>prev.map(p=>p.id===id?{...p,qty:newQty}:p)); };
  const addPantryItem=({n,cat})=>setPantry(prev=>[...prev,{id:Date.now(),n,cat,e:'📦',qty:1,max:5,low:1,unit:'шт'}]);
  const removePantryItem=id=>setPantry(prev=>prev.filter(p=>p.id!==id));

  const currentRecipe=openRecipe?recipes.find(r=>r.id===openRecipe.id)||openRecipe:null;
  const searched=useMemo(()=>{const q=globalQuery.trim().toLowerCase(); if(!q) return []; return recipes.filter(r=>r.name.toLowerCase().includes(q)||(r.tags||[]).join(' ').toLowerCase().includes(q)||(r.ingredients||[]).some(i=>i.n.toLowerCase().includes(q)));},[globalQuery,recipes]);

  return (
    <div>
      <style>{S}</style>
      <GrainOverlay/>
      <Stars/>
      <div className="app">
        <header className="hdr">
          <div className="hdr-in">
            <div className="logo">
              <div className="logo-reel"/>
              <span className="logo-tape">▓▒░</span>
              <div className="logo-reel"/>
              <span style={{margin:'0 8px'}}>🌿 <span>моя кухня</span></span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}><input className="inp" style={{maxWidth:260}} placeholder="глобальный поиск..." value={globalQuery} onChange={e=>setGlobalQuery(e.target.value)}/>{globalQuery&&<span className="tag">{searched.length} найдено</span>}</div><nav className="nav">
              {TABS.map(t=>(
                <button key={t.k} className={`nb ${tab===t.k?'on':''}`} onClick={()=>setTab(t.k)}>
                  {t.i} {t.l}
                </button>
              ))}
            </nav>
          </div>
        </header>
        <main className="main">
          {tab==='home'      && <HomePage recipes={recipes} setTab={setTab} onOpen={r=>setOpenRecipe(r)}/>}
          {tab==='recipes'   && <RecipesPage recipes={recipes} onOpen={r=>setOpenRecipe(r)} customCats={customCats} onUpdateCats={setCustomCats} onAddRecipe={r=>setRecipes(p=>[...p,r])}/>}
          {tab==='safe'      && <SafeFoodPage recipes={recipes} onOpen={r=>setOpenRecipe(r)}/>}
          {tab==='ratings'   && <RatingsPage recipes={recipes} onOpen={r=>setOpenRecipe(r)}/>}
          {tab==='plan'      && <PlanPage/>}
          {tab==='kbju'      && <KBJUPage/>}
          {tab==='diary'     && <DiaryPage entriesState={diaryEntries} setEntriesState={setDiaryEntries}/>}
          {tab==='shopping'  && <ShoppingPage extraItems={shopExtra} items={shoppingItems} setItems={setShoppingItems}/>}
          {tab==='pantry'    && <PantryPage pantry={pantry} onEditQty={editPantryQty} onAddItem={addPantryItem} onRemoveItem={removePantryItem}/>}
          {tab==='wishlist'  && <WishlistPage wishes={wishlist} setWishes={setWishlist}/>}
          {tab==='cassettes' && <CassettesPage channels={channels} onAddChannel={c=>setChannels(p=>[...p,c])} onRemoveChannel={id=>setChannels(p=>p.filter(c=>c.id!==id))}/>}
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
    </div>
  );
}
