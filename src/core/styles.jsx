const { useState, useEffect, useRef } = React;

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Dancing+Script:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}

:root{
  --bg:#FBF5EC;
  --bg2:#F5EDE0;
  --parch:#EDE3D4;
  --ww:#FFFBF5;
  --cream:#F8F1E6;

  --rose:#B86070;
  --rose2:#CA7888;
  --rose3:#E8B4BC;
  --rosebg:rgba(184,96,112,.09);

  --sage:#6A9478;
  --sage2:#8AB49A;
  --sage3:#B4D4BC;
  --sagebg:rgba(106,148,120,.1);

  --lavender:#9494BE;
  --lav2:#B4B4D8;
  --lavbg:rgba(148,148,190,.08);

  --brown:#4A2E1E;
  --brown2:#6A4830;
  --brown3:#9A7860;

  --txt:#3C2416;
  --txt2:#5A3828;
  --txt3:#8A6050;

  --brd:#D8C4B0;
  --brd2:#C4B09C;

  --gold:#C4A040;
  --gold2:#D4B050;
  --gold3:#E8CC80;

  --rust:#B86070;
  --rust2:#CA7888;
  --tr:#B86070;
  --tr2:#E8B4BC;

  --brn:#4A2E1E;

  --shadow:rgba(74,46,30,.1);
  --shadow2:rgba(74,46,30,.2);
  --sh:rgba(74,46,30,.1);
}

body{
  background:var(--bg);
  font-family:'Lora',serif;
  color:var(--txt);
  min-height:100vh;
}

.app{
  min-height:100vh;
  background:var(--bg);
  background-image:
    radial-gradient(ellipse at 15% 10%,rgba(184,96,112,.06) 0%,transparent 55%),
    radial-gradient(ellipse at 85% 90%,rgba(106,148,120,.04) 0%,transparent 55%);
}

/* ── HEADER ── */
.hdr{
  background:var(--ww);
  border-bottom:1.5px solid var(--brd);
  padding:0 22px;
  position:sticky;top:0;z-index:200;
  box-shadow:0 2px 18px rgba(74,46,30,.08);
  position:sticky;
}
.hdr::after{
  content:'';
  position:absolute;
  bottom:-9px;left:0;right:0;
  height:9px;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='9'%3E%3Cpath d='M0,0 Q4.5,9 9,0 Q13.5,9 18,0' fill='none' stroke='%23D8C4B0' stroke-width='1.5'/%3E%3C/svg%3E") repeat-x;
  z-index:201;pointer-events:none;
}
.hdr-in{
  max-width:1240px;margin:0 auto;
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 0;gap:14px;flex-wrap:wrap;
}

.logo{
  font-family:'Dancing Script',cursive;
  font-size:1.9rem;color:var(--rose);
  display:flex;align-items:center;gap:8px;
  letter-spacing:.02em;
}
.logo span{
  font-family:'Lora',serif;
  font-style:italic;font-weight:400;
  color:var(--brown3);font-size:.82rem;
  letter-spacing:.1em;
}
.logo-reel{display:none;}
.logo-tape{display:none;}

.nav{display:flex;gap:5px;flex-wrap:wrap;}
.nb{
  background:var(--cream);
  border:1.5px solid var(--brd);
  border-radius:20px;
  padding:5px 14px;
  font-family:'Lora',serif;
  font-size:.78rem;
  color:var(--txt2);
  cursor:pointer;
  transition:all .2s;
  display:flex;align-items:center;gap:5px;
  white-space:nowrap;
  position:relative;
}
.nb::before{display:none;}
.nb:hover{
  background:var(--rosebg);
  border-color:var(--rose3);
  color:var(--rose);
}
.nb.on{
  background:var(--rose);
  border-color:var(--rose);
  color:white;
  box-shadow:0 2px 8px rgba(184,96,112,.3);
}

/* ── MAIN ── */
.main{max-width:1240px;margin:0 auto;padding:36px 20px 70px;}

/* ── TYPOGRAPHY ── */
.pt{
  font-family:'Playfair Display',serif;
  font-size:2.2rem;color:var(--brown);
  margin-bottom:6px;
  letter-spacing:-.01em;
  font-weight:700;
}
.pt::after{display:none;}
.ps{
  font-family:'Lora',serif;
  font-size:1rem;color:var(--txt3);
  margin-bottom:24px;
  font-style:italic;
}
.sec{
  font-family:'Playfair Display',serif;
  font-size:1.15rem;color:var(--brown);
  margin-bottom:12px;
  display:flex;align-items:center;gap:8px;
}
.div{
  display:flex;align-items:center;gap:10px;
  margin-bottom:28px;
}
.div::before{content:'✿';font-size:.9rem;color:var(--rose3);}
.div::after{content:'· · · · · · · · · · · ·';font-size:.7rem;color:var(--brd);letter-spacing:4px;flex:1;}

.tag{
  display:inline-flex;align-items:center;
  background:var(--rosebg);
  border:1px solid var(--rose3);
  border-radius:20px;
  padding:2px 12px;
  font-size:.75rem;
  font-family:'Lora',serif;
  color:var(--txt2);
  font-style:italic;
}

.btn{border:none;border-radius:20px;padding:8px 20px;
  font-family:'Lora',serif;font-size:.9rem;
  cursor:pointer;transition:all .15s;}
.btn-p{
  background:var(--rose);color:white;
  box-shadow:0 2px 8px rgba(184,96,112,.3);
}
.btn-p:hover{background:var(--rose2);transform:translateY(-1px);box-shadow:0 4px 12px rgba(184,96,112,.4);}

.inp{
  flex:1;border:1.5px solid var(--brd);
  border-radius:20px;padding:8px 16px;
  font-family:'Lora',serif;font-size:.9rem;
  background:var(--ww);color:var(--txt);outline:none;
  transition:border-color .2s;
}
.inp:focus{border-color:var(--rose2);}

.decor{
  font-family:'Dancing Script',cursive;font-size:1.05rem;
  color:var(--txt3);text-align:center;
  opacity:.7;padding:8px;
}

/* ── STAT CARDS ── */
.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:24px;}
@media(max-width:700px){.stats{grid-template-columns:1fr 1fr 1fr;}}
.sc{
  background:var(--ww);
  border:1.5px solid var(--brd);
  border-radius:14px;
  padding:14px;text-align:center;
  box-shadow:0 2px 10px var(--shadow);
  cursor:pointer;transition:all .18s;
  position:relative;overflow:hidden;
}
.sc::before{
  content:'';position:absolute;
  top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--rose3),var(--rose),var(--rose3));
}
.sc:hover{transform:translateY(-3px);box-shadow:0 6px 18px var(--shadow2);}
.si{font-size:1.5rem;margin-bottom:5px;}
.sv{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:var(--brown);}
.sl{font-size:.72rem;color:var(--txt3);margin-top:2px;font-family:'Lora',serif;font-style:italic;}
.sc-hint{font-family:'Dancing Script',cursive;font-size:.9rem;color:var(--rose);margin-top:4px;opacity:0;transition:opacity .2s;}
.sc:hover .sc-hint{opacity:1;}

/* ── TODAY MEALS ── */
.tmg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:26px;}
@media(max-width:600px){.tmg{grid-template-columns:1fr;}}
.ms{
  background:var(--ww);
  border:1.5px solid var(--brd);
  border-radius:14px;padding:16px;
  box-shadow:0 2px 8px var(--shadow);
}
.ml{
  font-family:'Lora',serif;font-size:.78rem;
  color:var(--txt3);margin-bottom:6px;
  font-style:italic;letter-spacing:.04em;
}
.mn{font-family:'Playfair Display',serif;font-size:1rem;color:var(--brown);font-style:italic;}
.mk{font-size:.8rem;color:var(--txt3);margin-top:3px;}
.ms.empty .mn{color:var(--brd);font-style:normal;font-size:.85rem;}

/* ── CAT TABS ── */
.ctabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:20px;}
.ct{
  background:var(--ww);border:1.5px solid var(--brd);
  border-radius:20px;padding:5px 16px;
  font-family:'Lora',serif;font-size:.78rem;
  color:var(--txt2);cursor:pointer;transition:all .2s;
  display:flex;align-items:center;gap:5px;
  font-style:italic;
  box-shadow:0 1px 4px var(--shadow);
}
.ct:hover{border-color:var(--rose3);color:var(--rose);}
.ct.on{
  background:var(--rose);border-color:var(--rose);color:white;
  box-shadow:0 2px 8px rgba(184,96,112,.3);
}

/* ── RECIPE GRID ── */
.rgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
@media(max-width:900px){.rgrid{grid-template-columns:1fr 1fr 1fr;}}
@media(max-width:580px){.rgrid{grid-template-columns:1fr 1fr;}}

.rc{
  background:var(--ww);
  border:1.5px solid var(--brd);
  border-radius:16px;
  box-shadow:0 2px 10px var(--shadow);
  cursor:pointer;transition:transform .2s,box-shadow .2s;
  position:relative;overflow:hidden;
}
.rc::before{display:none;}
.rc:hover{transform:translateY(-4px);box-shadow:0 8px 24px var(--shadow2);}

.rc-img{
  width:100%;height:130px;
  background:linear-gradient(135deg,#F8EAE0,#EDD5C8);
  display:flex;align-items:center;justify-content:center;
  font-size:2.6rem;position:relative;
  border-bottom:1px solid var(--brd);
}
.rc-img::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(to bottom,transparent 50%,rgba(74,46,30,.12));
  pointer-events:none;
}
.rc-cat{
  position:absolute;top:8px;right:8px;
  background:rgba(255,251,245,.92);color:var(--rose);
  font-size:.62rem;padding:2px 10px;border-radius:12px;
  font-family:'Lora',serif;font-style:italic;
  border:1px solid var(--rose3);
}
.rc-vid{
  position:absolute;bottom:8px;right:8px;
  background:rgba(74,46,30,.72);color:white;
  font-size:.62rem;padding:2px 8px;border-radius:10px;
  font-family:'Lora',serif;
}
.rc-love{
  position:absolute;top:8px;left:8px;font-size:.9rem;
  background:rgba(255,251,245,.88);border-radius:50%;
  width:24px;height:24px;display:flex;align-items:center;justify-content:center;
  border:1px solid var(--brd);
}
.rc-safe{
  position:absolute;bottom:8px;left:8px;
  background:rgba(106,148,120,.85);color:white;
  font-size:.6rem;padding:2px 8px;border-radius:10px;
  font-family:'Lora',serif;font-style:italic;
}
.rc-body{padding:12px 14px 14px;}
.rc-name{
  font-family:'Playfair Display',serif;
  font-size:1rem;color:var(--brown);
  margin-bottom:6px;font-style:italic;font-weight:600;
}
.kbju{display:flex;gap:4px;flex-wrap:wrap;}
.kc{border-radius:10px;padding:2px 8px;font-size:.64rem;font-family:'Lora',serif;font-style:italic;}
.kc.kal{background:rgba(184,96,112,.1);color:var(--rose);}
.kc.bel{background:rgba(106,148,120,.1);color:var(--sage);}
.kc.jir{background:rgba(196,160,64,.1);color:var(--gold);}
.kc.ugl{background:rgba(148,148,190,.1);color:var(--lavender);}
.rc-rat{display:flex;align-items:center;gap:4px;margin-top:7px;font-size:.75rem;font-family:'Dancing Script',cursive;}
.add-rc{
  border:2px dashed var(--brd);background:transparent;border-radius:16px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:8px;cursor:pointer;padding:20px;min-height:200px;
  transition:all .2s;color:var(--txt3);
  font-family:'Dancing Script',cursive;font-size:1.1rem;
}
.add-rc:hover{border-color:var(--rose3);color:var(--rose);background:var(--rosebg);}

/* ── MODAL ── */
.overlay{
  position:fixed;inset:0;
  background:rgba(74,46,30,.45);z-index:500;
  display:flex;align-items:center;justify-content:center;padding:16px;
  backdrop-filter:blur(6px);animation:fadeIn .2s ease;
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{
  background:var(--ww);border-radius:20px;
  border:1.5px solid var(--brd);
  max-width:740px;width:100%;max-height:90vh;
  overflow-y:auto;
  box-shadow:0 20px 60px rgba(74,46,30,.25);
  animation:slideUp .25s ease;
}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal::-webkit-scrollbar{width:5px;}
.modal::-webkit-scrollbar-thumb{background:var(--brd);border-radius:10px;}
.mhdr{
  position:sticky;top:0;
  background:linear-gradient(135deg,#FFF0F2,#FBF3E8);
  border-bottom:1.5px solid var(--brd);
  padding:16px 22px;display:flex;align-items:center;gap:12px;z-index:10;
  border-radius:20px 20px 0 0;
}
.m-emoji{font-size:2.2rem;}
.m-title{
  font-family:'Playfair Display',serif;font-size:1.3rem;
  color:var(--brown);font-style:italic;flex:1;
}
.m-close{
  background:var(--cream);border:1.5px solid var(--brd);
  border-radius:50%;width:32px;height:32px;cursor:pointer;
  font-size:.9rem;display:flex;align-items:center;justify-content:center;
  transition:all .15s;flex-shrink:0;color:var(--txt3);
}
.m-close:hover{background:var(--rosebg);border-color:var(--rose3);color:var(--rose);}
.mbody{padding:22px;}

/* serving */
.srv-wrap{
  background:var(--cream);border-radius:14px;padding:14px 16px;margin-bottom:20px;
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  border:1.5px solid var(--brd);
}
.srv-label{font-family:'Lora',serif;font-size:.85rem;color:var(--txt2);font-style:italic;}
.srv-btns{display:flex;gap:6px;}
.srv-btn{
  background:var(--ww);border:1.5px solid var(--brd);border-radius:20px;
  padding:4px 14px;font-family:'Lora',serif;font-size:.82rem;
  color:var(--txt2);cursor:pointer;transition:all .15s;
}
.srv-btn:hover{border-color:var(--rose3);color:var(--rose);}
.srv-btn.on{background:var(--rose);border-color:var(--rose);color:white;}
.srv-kbju{display:flex;gap:6px;flex-wrap:wrap;}

/* ingredients */
.ing-list{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
.ing-row{
  display:flex;align-items:center;gap:10px;
  padding:8px 14px;background:var(--cream);
  border-radius:10px;border-left:3px solid var(--brd);
}
.ing-st{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0;}
.ing-st.have{background:rgba(106,148,120,.2);color:var(--sage);}
.ing-st.need{background:rgba(184,96,112,.12);color:var(--rose);}
.ing-name{flex:1;font-size:.9rem;color:var(--txt);font-family:'Lora',serif;}
.ing-amount{font-family:'Lora',serif;font-size:.8rem;color:var(--txt2);font-style:italic;}
.ing-legend{display:flex;gap:12px;margin-bottom:10px;font-family:'Dancing Script',cursive;font-size:.95rem;color:var(--txt3);}

.add-miss{
  display:flex;align-items:center;gap:8px;margin-bottom:20px;
  background:var(--rosebg);border:1.5px dashed var(--rose3);
  border-radius:12px;padding:11px 14px;cursor:pointer;transition:background .15s;
}
.add-miss:hover{background:rgba(184,96,112,.16);}

/* steps */
.steps{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
.step{display:flex;gap:12px;align-items:flex-start;}
.step-num{
  width:28px;height:28px;border-radius:50%;
  background:var(--rose);border:2px solid var(--rose3);
  color:white;
  display:flex;align-items:center;justify-content:center;
  font-family:'Playfair Display',serif;font-size:.85rem;flex-shrink:0;margin-top:1px;
}
.step-txt{font-size:.95rem;line-height:1.65;color:var(--txt);padding-top:4px;font-family:'Lora',serif;}
.mnotes{
  background:var(--sagebg);
  border-left:3px solid var(--sage2);border-radius:0 10px 10px 0;
  padding:12px 14px;font-size:.95rem;line-height:1.6;
  color:var(--txt2);font-style:italic;margin-bottom:16px;
  font-family:'Lora',serif;
}

/* cook button */
.cook-btn{
  width:100%;
  background:linear-gradient(135deg,var(--sage),#5A8468);
  color:white;border:none;border-radius:20px;padding:14px;
  font-family:'Playfair Display',serif;font-size:1.05rem;font-style:italic;
  cursor:pointer;transition:all .2s;
  display:flex;align-items:center;justify-content:center;gap:10px;
  margin-bottom:14px;
  box-shadow:0 4px 12px rgba(106,148,120,.3);
}
.cook-btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(106,148,120,.4);}
.cook-success{
  background:var(--sagebg);border:1.5px solid var(--sage2);
  border-radius:14px;padding:13px;text-align:center;
  font-family:'Dancing Script',cursive;font-size:1.05rem;color:var(--sage);margin-bottom:14px;
}

/* step timer */
.step-timer-btn{
  background:var(--rosebg);border:1px solid var(--rose3);
  color:var(--rose);border-radius:12px;padding:2px 10px;
  font-family:'Lora',serif;font-size:.72rem;font-style:italic;
  cursor:pointer;transition:all .15s;margin-left:8px;white-space:nowrap;
}
.step-timer-btn:hover{background:var(--rose);color:white;border-color:var(--rose);}
.step-timer-btn.running{background:var(--rose);color:white;border-color:var(--rose);animation:pulse 1s infinite;}
.step-timer-btn.done{background:var(--sagebg);border-color:var(--sage2);color:var(--sage);}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
.step-timer-display{
  display:inline-flex;align-items:center;gap:6px;margin-left:8px;
  background:var(--cream);border:1.5px solid var(--brd);
  border-radius:12px;padding:2px 10px;
  font-family:'Lora',serif;font-size:.82rem;color:var(--brown);font-style:italic;
}
.step-timer-display.urgent{background:var(--rosebg);border-color:var(--rose3);color:var(--rose);}

/* rating */
.rate-btns{display:flex;gap:7px;flex-wrap:wrap;}
.rb{
  background:var(--cream);border:1.5px solid var(--brd);
  border-radius:20px;padding:6px 14px;
  font-family:'Dancing Script',cursive;font-size:1rem;cursor:pointer;
  transition:all .15s;display:flex;align-items:center;gap:5px;
  box-shadow:0 1px 4px var(--shadow);
}
.rb:hover{transform:translateY(-1px);box-shadow:0 3px 8px var(--shadow2);}
.rb.on-nope{background:#F8EAEC;border-color:#D4A0A8;color:#8B3040;}
.rb.on-ok{background:#FFF6E0;border-color:#D4C060;color:#7A6000;}
.rb.on-good{background:#EAF4EC;border-color:var(--sage2);color:#2D5A3A;}
.rb.on-love{background:var(--rosebg);border-color:var(--rose3);color:var(--rose);}

/* personal notes */
.mynotes-wrap{margin-top:20px;}
.mynote-item{
  background:rgba(196,160,64,.07);
  border-left:3px solid var(--gold2);
  border-radius:0 10px 10px 0;padding:10px 13px;margin-bottom:8px;
}
.mynote-date{font-family:'Lora',serif;font-size:.7rem;color:var(--txt3);margin-bottom:3px;font-style:italic;}
.mynote-txt{font-size:.95rem;line-height:1.55;color:var(--txt);font-style:italic;font-family:'Lora',serif;}
.mynote-add{display:flex;gap:8px;align-items:flex-end;margin-top:10px;}
.mynote-ta{
  flex:1;border:1.5px solid var(--brd);border-radius:14px;padding:9px 14px;
  font-family:'Lora',serif;font-size:.95rem;
  background:var(--cream);color:var(--txt);outline:none;resize:none;
  transition:border-color .15s;line-height:1.5;
}
.mynote-ta:focus{border-color:var(--rose2);}
.mynote-save{
  background:var(--gold);color:white;border:none;border-radius:20px;
  padding:9px 16px;font-family:'Lora',serif;font-size:.82rem;font-style:italic;
  cursor:pointer;transition:all .15s;white-space:nowrap;align-self:flex-end;
  box-shadow:0 2px 8px rgba(196,160,64,.3);
}
.mynote-save:hover{background:var(--gold2);transform:translateY(-1px);}

/* seasonal badge */
.season-badge{
  background:var(--sagebg);border:1px solid var(--sage2);
  border-radius:10px;padding:1px 8px;
  font-family:'Lora',serif;font-size:.62rem;font-style:italic;
  color:var(--sage);margin-left:5px;
}

/* ── RATINGS PAGE ── */
.rat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:28px;}
@media(max-width:600px){.rat-grid{grid-template-columns:1fr;}}
.rat-sec{background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;overflow:hidden;box-shadow:0 2px 10px var(--shadow);}
.rat-hdr{padding:12px 18px;display:flex;align-items:center;gap:9px;border-bottom:1px solid var(--brd);background:var(--cream);}
.rat-items{padding:12px;display:flex;flex-direction:column;gap:7px;}
.rat-item{
  display:flex;align-items:center;gap:10px;padding:9px 12px;
  background:var(--bg);border-radius:10px;cursor:pointer;transition:all .15s;
  border-left:3px solid var(--brd);
}
.rat-item:hover{border-left-color:var(--rose3);background:var(--rosebg);}
.rat-empty{padding:20px;text-align:center;font-family:'Dancing Script',cursive;font-size:1.05rem;color:var(--txt3);}
.love-sec{background:var(--ww);border:2px solid var(--rose3);border-radius:16px;overflow:hidden;box-shadow:0 2px 10px rgba(184,96,112,.15);margin-bottom:24px;}
.love-hdr{
  background:linear-gradient(135deg,#FFF0F2,#FBF3E8);
  padding:14px 18px;display:flex;align-items:center;gap:10px;
  border-bottom:1px solid var(--rose3);
}

/* ── SAFE FOOD ── */
.safe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
@media(max-width:700px){.safe-grid{grid-template-columns:1fr 1fr;}}
.safe-card{
  background:var(--ww);border:1.5px solid rgba(106,148,120,.4);
  border-radius:16px;overflow:hidden;cursor:pointer;
  transition:transform .2s,box-shadow .2s;
  box-shadow:0 2px 10px var(--shadow);
}
.safe-card:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(106,148,120,.2);}
.safe-img{
  height:110px;
  background:linear-gradient(135deg,rgba(168,197,171,.3),rgba(74,110,80,.15));
  display:flex;align-items:center;justify-content:center;font-size:2.5rem;
  position:relative;border-bottom:1px solid rgba(106,148,120,.25);
}

/* ── PLANNER ── */
.wn{display:flex;align-items:center;gap:14px;margin-bottom:18px;}
.wn-btn{
  background:var(--ww);border:1.5px solid var(--brd);border-radius:20px;
  padding:5px 14px;cursor:pointer;font-size:.95rem;color:var(--brown);
  box-shadow:0 1px 4px var(--shadow);transition:all .15s;
  font-family:'Lora',serif;
}
.wn-btn:hover{transform:translateY(-1px);box-shadow:0 3px 8px var(--shadow2);}
.wn-lbl{font-family:'Playfair Display',serif;font-size:1.05rem;color:var(--brown);font-style:italic;}
.pgrid{display:grid;grid-template-columns:76px repeat(7,1fr);gap:5px;font-size:.78rem;}
@media(max-width:700px){.pgrid{grid-template-columns:52px repeat(7,1fr);font-size:.66rem;}}
.ph{
  font-family:'Lora',serif;font-size:.72rem;text-align:center;
  padding:7px 3px;color:var(--txt2);background:var(--cream);
  border-radius:8px;font-style:italic;
}
.ph.td{background:var(--rose);color:white;border:none;}
.prl{font-family:'Lora',serif;font-size:.72rem;color:var(--txt3);display:flex;align-items:center;padding:3px;font-style:italic;}
.pc{
  background:var(--ww);border:1.5px dashed var(--brd);border-radius:10px;
  padding:5px;min-height:50px;font-size:.72rem;color:var(--txt2);
  font-style:italic;cursor:pointer;transition:all .15s;
  font-family:'Lora',serif;
}
.pc:hover{border-color:var(--rose3);background:var(--rosebg);}
.pc.ok{border-style:solid;border-color:var(--sage2);background:var(--sagebg);color:var(--sage);font-style:normal;}

/* ── SHOPPING ── */
.bw{background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;padding:18px;margin-bottom:18px;box-shadow:0 2px 10px var(--shadow);}
.bb{height:8px;background:var(--parch);border-radius:6px;overflow:hidden;}
.bf{height:100%;background:linear-gradient(90deg,var(--sage),var(--sage2));border-radius:6px;transition:width .6s;}
.sl2{display:grid;grid-template-columns:1fr 290px;gap:18px;align-items:start;}
@media(max-width:680px){.sl2{grid-template-columns:1fr;}}
.slc{background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;overflow:hidden;box-shadow:0 2px 10px var(--shadow);}
.slh{background:var(--cream);padding:12px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid var(--brd);}
.si2{display:flex;align-items:center;gap:10px;padding:10px 18px;border-bottom:1px solid rgba(216,196,176,.3);transition:background .15s;}
.si2:hover{background:var(--cream);}
.scb{width:18px;height:18px;border:2px solid var(--brd);border-radius:50%;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:white;}
.scb.ck{background:var(--sage);border-color:var(--sage);color:white;}
.sn{flex:1;font-size:.9rem;font-family:'Lora',serif;}
.sn.dn{text-decoration:line-through;color:var(--txt3);}
.sa{font-family:'Lora',serif;font-size:.72rem;color:var(--txt3);font-style:italic;}
.sp{font-family:'Lora',serif;font-size:.82rem;color:var(--rose);min-width:54px;text-align:right;font-style:italic;}
.air{padding:11px 18px;display:flex;gap:7px;}
.ab{background:var(--rose);color:white;border:none;border-radius:20px;padding:7px 16px;cursor:pointer;font-size:.9rem;box-shadow:0 2px 8px rgba(184,96,112,.25);font-family:'Lora',serif;}
.ab:hover{background:var(--rose2);}
.sside{background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;padding:18px;box-shadow:0 2px 10px var(--shadow);}

/* ── PANTRY ── */
.shelf{background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;margin-bottom:18px;overflow:hidden;box-shadow:0 2px 10px var(--shadow);}
.sh2{
  background:linear-gradient(135deg,#FFF0F2,#F8F1E6);
  padding:12px 18px;display:flex;align-items:center;gap:9px;
  border-bottom:1.5px solid var(--brd);
}
.shitems{padding:14px;display:flex;flex-wrap:wrap;gap:9px;}
.shi{
  background:var(--cream);border:1.5px solid var(--brd);
  border-radius:12px;padding:9px 12px;
  display:flex;align-items:center;gap:7px;font-size:.8rem;position:relative;
  cursor:pointer;transition:box-shadow .15s;
  box-shadow:0 1px 4px var(--shadow);
}
.shi:hover{box-shadow:0 3px 10px var(--shadow2);}
.shi.low{border-color:var(--rose3);background:var(--rosebg);}
.shi.empty{border-color:#C4A0A0;background:rgba(200,120,120,.06);opacity:.7;}
.shi-qty{font-family:'Playfair Display',serif;font-size:.8rem;font-weight:600;color:var(--brown);margin-top:1px;}
.shi-unit{font-family:'Lora',serif;font-size:.66rem;color:var(--txt3);font-style:italic;}
.qty-bar-wrap{width:100%;height:4px;background:rgba(0,0,0,.06);border-radius:3px;margin-top:5px;overflow:hidden;}
.qty-bar{height:100%;border-radius:3px;transition:width .4s;}
.shi-edit-btn{position:absolute;top:5px;right:6px;background:none;border:none;font-size:.65rem;color:var(--txt3);cursor:pointer;opacity:0;transition:opacity .15s;}
.shi:hover .shi-edit-btn{opacity:1;}
.shi-edit-inp{width:60px;border:1.5px solid var(--rose3);border-radius:10px;padding:2px 6px;font-family:'Lora',serif;font-size:.82rem;text-align:center;outline:none;background:white;}
.pantry-legend{display:flex;gap:12px;margin-bottom:14px;font-family:'Lora',serif;font-size:.72rem;color:var(--txt3);flex-wrap:wrap;font-style:italic;}
.pl-dot{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:4px;}

/* ── WISHLIST ── */
.wgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
@media(max-width:580px){.wgrid{grid-template-columns:1fr;}}
.wc{
  background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;
  padding:14px;display:flex;align-items:center;gap:12px;
  box-shadow:0 2px 8px var(--shadow);transition:all .2s;
}
.wc:hover{transform:translateY(-2px);box-shadow:0 5px 16px var(--shadow2);}
.wc.dn{opacity:.6;background:var(--bg);}
.wn2{font-family:'Playfair Display',serif;font-size:1rem;color:var(--brown);font-style:italic;margin-bottom:2px;}
.wc.dn .wn2{text-decoration:line-through;}
.wcat{font-family:'Lora',serif;font-size:.7rem;color:var(--txt3);font-style:italic;}
.wtog{width:26px;height:26px;border-radius:50%;border:2px solid var(--brd);background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;transition:all .2s;flex-shrink:0;}
.wtog.dn{background:var(--sage);border-color:var(--sage);color:white;}
.wadd{background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;padding:14px;display:flex;gap:9px;align-items:center;box-shadow:0 2px 8px var(--shadow);}

/* ── CASSETTES — kept mostly original ── */
.cf{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:28px;}
.cfb{background:var(--cream);border:1.5px solid var(--brd);border-radius:20px;padding:5px 16px;font-family:'Lora',serif;font-size:.78rem;color:var(--txt2);cursor:pointer;transition:all .2s;font-style:italic;}
.cfb:hover{border-color:var(--rose3);color:var(--rose);}
.cfb.on{background:var(--rose);border-color:var(--rose);color:white;}
.cgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
@media(max-width:840px){.cgrid{grid-template-columns:1fr 1fr;}}
@media(max-width:540px){.cgrid{grid-template-columns:1fr;}}
.cwrap:hover .cshell{transform:translateY(-5px) rotate(-1.5deg);filter:drop-shadow(0 12px 26px rgba(0,0,0,.4));}
.cshell{position:relative;width:100%;padding-bottom:62%;transition:transform .25s,filter .25s;filter:drop-shadow(0 4px 14px rgba(0,0,0,.3));}
.cbody{position:absolute;inset:0;border-radius:9px;overflow:hidden;}
.cnotch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:34%;height:11%;border-radius:0 0 7px 7px;z-index:4;}
.clabel{position:absolute;top:17%;left:8%;right:8%;height:35%;border-radius:5px;z-index:3;display:flex;flex-direction:column;justify-content:center;padding:0 10px;overflow:hidden;}
.cls{position:absolute;left:0;right:0;height:1px;opacity:.2;background:rgba(0,0,0,.8);}
.cchn{font-family:'Playfair Display',serif;font-size:clamp(.5rem,1.5vw,.75rem);font-weight:700;letter-spacing:.04em;text-transform:uppercase;line-height:1.2;position:relative;z-index:4;}
.cctp{font-family:'Lora',serif;font-size:clamp(.45rem,1.3vw,.66rem);opacity:.8;position:relative;z-index:4;margin-top:2px;font-style:italic;}
.cwin{position:absolute;bottom:9%;left:50%;transform:translateX(-50%);width:62%;height:27%;border-radius:6px;z-index:2;display:flex;align-items:center;justify-content:space-around;padding:0 8%;}
.reel{width:36%;aspect-ratio:1;border-radius:50%;border:2px solid rgba(0,0,0,.15);position:relative;display:flex;align-items:center;justify-content:center;}
.reel::before{content:'';width:30%;aspect-ratio:1;border-radius:50%;background:rgba(0,0,0,.2);position:absolute;}
.ctape{position:absolute;bottom:9%;left:50%;transform:translateX(-50%);width:62%;height:27%;z-index:3;pointer-events:none;}
.ctape::after{content:'';position:absolute;bottom:20%;left:22%;right:22%;height:3px;background:rgba(0,0,0,.1);border-radius:2px;}
.cscr{position:absolute;width:5%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);z-index:4;}
.cscr.tl{top:6%;left:5%;}.cscr.tr{top:6%;right:5%;}.cscr.bl{bottom:6%;left:5%;}.cscr.br{bottom:6%;right:5%;}
.cinfo{margin-top:12px;padding:0 2px;}
.cname{font-family:'Playfair Display',serif;font-size:.95rem;color:var(--brown);font-style:italic;margin-bottom:4px;}
.cdesc{font-size:.82rem;color:var(--txt3);line-height:1.5;margin-bottom:9px;font-family:'Lora',serif;}
.ctags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:9px;}
.ctag{background:var(--cream);border:1px solid var(--brd);border-radius:10px;padding:2px 10px;font-family:'Lora',serif;font-size:.66rem;color:var(--txt2);font-style:italic;}
.clink{display:inline-flex;align-items:center;gap:5px;background:var(--brown);border:1px solid var(--brown2);color:#FFF8F0;border-radius:12px;padding:6px 14px;font-family:'Lora',serif;font-size:.78rem;text-decoration:none;transition:all .15s;font-style:italic;box-shadow:0 2px 6px rgba(74,46,30,.25);}
.clink:hover{background:var(--rose);border-color:var(--rose);transform:translateY(-1px);}
.add-cc{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:2px dashed var(--brd);border-radius:16px;padding:28px 18px;cursor:pointer;color:var(--txt3);font-family:'Dancing Script',cursive;font-size:1.1rem;transition:all .2s;min-height:190px;}
.add-cc:hover{border-color:var(--rose3);color:var(--rose);background:var(--rosebg);}

/* ── MOON ── */
.moon-widget{
  background:linear-gradient(135deg,#1E1628,#2A1E38);
  border:1px solid rgba(148,148,190,.3);
  border-radius:16px;padding:18px 20px;
  display:flex;align-items:center;gap:16px;
  box-shadow:0 4px 16px rgba(20,12,36,.3);
}
.moon-big{font-size:2.8rem;line-height:1;filter:drop-shadow(0 0 10px rgba(180,180,216,.4));}
.moon-info{flex:1;}
.moon-phase-name{font-family:'Playfair Display',serif;font-size:1rem;color:#E8E0FF;font-style:italic;margin-bottom:3px;}
.moon-tip{font-family:'Lora',serif;font-size:.88rem;color:#C0B0E0;line-height:1.4;font-style:italic;}
.moon-date{font-family:'Lora',serif;font-size:.65rem;color:#9080B0;margin-top:4px;font-style:italic;}

/* ── WEEKLY KBJU ── */
.wkbju-wrap{background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;padding:20px;margin-top:24px;box-shadow:0 2px 10px var(--shadow);}
.wkbju-days{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:18px;}
.wkbju-day{display:flex;flex-direction:column;align-items:center;gap:5px;}
.wkbju-day-label{font-family:'Lora',serif;font-size:.72rem;color:var(--txt3);font-style:italic;}
.wkbju-day-label.today{color:var(--rose);font-weight:600;}
.wkbju-bar-wrap{width:100%;display:flex;flex-direction:column;gap:3px;}
.wkbju-mini-bar{height:6px;border-radius:3px;background:var(--parch);overflow:hidden;position:relative;}
.wkbju-mini-fill{height:100%;border-radius:3px;transition:width .5s;}
.wkbju-kcal-val{font-family:'Lora',serif;font-size:.68rem;color:var(--txt2);text-align:center;font-style:italic;}
.wkbju-kcal-val.over{color:var(--rose2);}
.wkbju-kcal-val.empty{color:var(--brd);}
.wkbju-totals{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.wkbju-total-card{background:var(--cream);border:1.5px solid var(--brd);border-radius:12px;padding:12px;text-align:center;box-shadow:0 1px 4px var(--shadow);}
.wkbju-total-val{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;}
.wkbju-total-lbl{font-family:'Lora',serif;font-size:.66rem;color:var(--txt3);margin-top:2px;font-style:italic;}
.wkbju-total-pct{font-family:'Dancing Script',cursive;font-size:.85rem;margin-top:3px;}
.wkbju-verdict{background:var(--sagebg);border:1.5px solid var(--sage2);border-radius:14px;padding:14px;display:flex;align-items:center;gap:12px;}
.wkbju-verdict-ico{font-size:2rem;}
.wkbju-verdict-txt{font-family:'Lora',serif;font-size:.95rem;color:var(--sage);font-style:italic;}
.wkbju-verdict-sub{font-family:'Lora',serif;font-size:.7rem;color:var(--txt3);margin-top:3px;font-style:italic;}

/* ── EXPENSE CHART ── */
.exp-wrap{background:var(--ww);border:1.5px solid var(--brd);border-radius:16px;padding:18px;margin-top:18px;box-shadow:0 2px 10px var(--shadow);}
.exp-bars{display:flex;align-items:flex-end;gap:10px;height:100px;margin-bottom:8px;}
.exp-bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;}
.exp-bar-stack{width:100%;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;}
.exp-bar{border-radius:4px 4px 0 0;min-height:3px;transition:height .4s;}
.exp-label{font-family:'Lora',serif;font-size:.68rem;color:var(--txt3);font-style:italic;}
.exp-label.cur{color:var(--rose);font-weight:600;}
.exp-legend{display:flex;gap:14px;margin-top:8px;}
.exp-legend-item{display:flex;align-items:center;gap:5px;font-family:'Lora',serif;font-size:.7rem;color:var(--txt2);font-style:italic;}
.exp-dot{width:10px;height:10px;border-radius:50%;}

/* ── DIARY ── */
.diary-day-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px;}
.diary-day-label{font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--brown);font-style:italic;}
.diary-kbju-bar{display:flex;gap:8px;flex-wrap:wrap;}
.diary-k{background:var(--cream);border:1.5px solid var(--brd);border-radius:12px;padding:4px 12px;font-family:'Lora',serif;font-size:.74rem;color:var(--txt2);display:flex;align-items:center;gap:4px;font-style:italic;}
.diary-entries{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.diary-entry{background:var(--cream);border:1.5px solid var(--brd);border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:12px;border-left:3px solid var(--rose3);}
.diary-entry-emoji{font-size:1.4rem;}
.diary-entry-name{flex:1;font-family:'Lora',serif;font-size:.9rem;color:var(--brown);font-style:italic;}
.diary-entry-kcal{font-family:'Lora',serif;font-size:.8rem;color:var(--rose);font-style:italic;}
.diary-entry-del{background:none;border:none;color:var(--brd2);cursor:pointer;font-size:.85rem;padding:2px 5px;border-radius:6px;transition:color .15s;}
.diary-entry-del:hover{color:var(--rose);}
.diary-add-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.diary-goal-bar{height:7px;background:var(--parch);border-radius:4px;overflow:hidden;margin-bottom:6px;}
.diary-goal-fill{height:100%;border-radius:4px;transition:width .4s;}
.diary-nav{display:flex;align-items:center;gap:12px;margin-bottom:22px;}
.diary-nav-btn{background:var(--ww);border:1.5px solid var(--brd);border-radius:20px;padding:5px 14px;cursor:pointer;font-size:.95rem;color:var(--brown);box-shadow:0 1px 4px var(--shadow);font-family:'Lora',serif;}
.diary-week-card{background:var(--ww);border:1.5px solid var(--brd);border-radius:14px;padding:14px;margin-bottom:10px;box-shadow:0 2px 8px var(--shadow);}
.diary-week-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(216,196,176,.25);}
.diary-week-day{font-family:'Lora',serif;font-size:.75rem;color:var(--txt3);width:28px;flex-shrink:0;font-style:italic;}
.diary-week-fill{flex:1;height:7px;background:var(--parch);border-radius:4px;overflow:hidden;}
.diary-week-bar{height:100%;border-radius:4px;transition:width .4s;}

/* ── SEARCH ── */
.search-wrap{position:relative;margin-bottom:16px;}
.search-inp{width:100%;border:1.5px solid var(--brd);border-radius:20px;padding:10px 20px 10px 44px;font-family:'Lora',serif;font-size:.95rem;background:var(--ww);color:var(--txt);outline:none;transition:border-color .2s;}
.search-inp:focus{border-color:var(--rose2);}
.search-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:1rem;pointer-events:none;opacity:.4;}
.search-clear{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:var(--brd);border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:.7rem;display:flex;align-items:center;justify-content:center;color:var(--txt2);}
.search-clear:hover{background:var(--rose2);color:white;}
.search-count{font-family:'Lora',serif;font-size:.78rem;color:var(--txt3);margin-bottom:14px;font-style:italic;}
.search-highlight{background:rgba(184,96,112,.18);border-radius:4px;padding:0 2px;}

/* ── CUSTOM CATEGORIES ── */
.custcat-section{background:var(--ww);border:1.5px solid var(--brd);border-radius:14px;padding:16px;margin-bottom:20px;box-shadow:0 2px 8px var(--shadow);}
.custcat-list{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
.custcat-chip{display:flex;align-items:center;gap:6px;border-radius:20px;padding:5px 14px;font-family:'Lora',serif;font-size:.74rem;cursor:pointer;transition:all .2s;border:1.5px solid;font-style:italic;}
.custcat-chip.active{color:white;}
.custcat-del{background:none;border:none;font-size:.7rem;cursor:pointer;opacity:.6;padding:0 0 0 2px;line-height:1;}
.custcat-del:hover{opacity:1;}
.custcat-add{display:flex;gap:8px;align-items:center;}
.custcat-emoji-pick{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;}
.ep-btn{background:var(--cream);border:1.5px solid var(--brd);border-radius:10px;padding:4px 8px;font-size:1rem;cursor:pointer;transition:all .15s;}
.ep-btn.on{border-color:var(--rose);background:var(--rosebg);}
.rc-custcats{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;}

/* ── EDIT / CRUD CONTROLS ── */
.rc-actions{
  position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(to top,rgba(74,46,30,.82),transparent);
  display:flex;gap:6px;justify-content:flex-end;padding:8px 10px;
  opacity:0;transition:opacity .2s;border-radius:0 0 14px 14px;
}
.rc:hover .rc-actions{opacity:1;}
.rc-act-btn{
  background:rgba(255,251,245,.9);border:none;border-radius:50%;
  width:28px;height:28px;cursor:pointer;font-size:.85rem;
  display:flex;align-items:center;justify-content:center;
  transition:all .15s;flex-shrink:0;
}
.rc-act-btn:hover{transform:scale(1.15);}
.edit-modal{
  background:var(--ww);border-radius:20px;
  border:1.5px solid var(--brd);
  max-width:680px;width:100%;max-height:92vh;
  overflow-y:auto;
  box-shadow:0 20px 60px rgba(74,46,30,.25);
  animation:slideUp .25s ease;
}
.edit-modal::-webkit-scrollbar{width:5px;}
.edit-modal::-webkit-scrollbar-thumb{background:var(--brd);border-radius:10px;}
.form-label{display:block;font-family:'Lora',serif;font-size:.82rem;color:var(--txt2);font-style:italic;margin-bottom:5px;}
.form-row{display:flex;gap:10px;}
.form-ta{width:100%;border:1.5px solid var(--brd);border-radius:12px;padding:9px 14px;font-family:'Lora',serif;font-size:.9rem;background:var(--cream);color:var(--txt);outline:none;resize:vertical;transition:border-color .15s;line-height:1.5;min-height:70px;}
.form-ta:focus{border-color:var(--rose2);}
.form-inp{width:100%;border:1.5px solid var(--brd);border-radius:20px;padding:8px 14px;font-family:'Lora',serif;font-size:.9rem;background:var(--ww);color:var(--txt);outline:none;transition:border-color .15s;}
.form-inp:focus{border-color:var(--rose2);}
.form-inp-sm{width:90px;border:1.5px solid var(--brd);border-radius:20px;padding:7px 12px;font-family:'Lora',serif;font-size:.88rem;background:var(--ww);color:var(--txt);outline:none;transition:border-color .15s;text-align:center;}
.form-inp-sm:focus{border-color:var(--rose2);}
.ing-edit-row{display:flex;gap:8px;align-items:center;padding:7px 10px;background:var(--cream);border-radius:10px;margin-bottom:6px;}
.step-edit-row{display:flex;gap:8px;align-items:flex-start;padding:7px 10px;background:var(--cream);border-radius:10px;margin-bottom:6px;}
.step-num-sm{width:24px;height:24px;border-radius:50%;background:var(--rose);color:white;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:.78rem;flex-shrink:0;margin-top:2px;}
.rm-btn{background:none;border:none;cursor:pointer;color:var(--brd2);font-size:.9rem;padding:2px 4px;transition:color .15s;flex-shrink:0;}
.rm-btn:hover{color:var(--rose);}
.add-row-btn{background:none;border:1.5px dashed var(--brd);border-radius:20px;padding:5px 16px;font-family:'Lora',serif;font-size:.82rem;font-style:italic;color:var(--txt3);cursor:pointer;transition:all .15s;margin-top:4px;}
.add-row-btn:hover{border-color:var(--rose3);color:var(--rose);}
.btn-danger{background:none;border:1.5px solid #D4A0A8;border-radius:20px;padding:7px 18px;font-family:'Lora',serif;font-size:.88rem;font-style:italic;color:#8B3040;cursor:pointer;transition:all .15s;}
.btn-danger:hover{background:#F8EAEC;border-color:var(--rose);}
.btn-save{background:var(--rose);color:white;border:none;border-radius:20px;padding:9px 24px;font-family:'Lora',serif;font-size:.95rem;font-style:italic;cursor:pointer;box-shadow:0 2px 8px rgba(184,96,112,.3);transition:all .15s;}
.btn-save:hover{background:var(--rose2);transform:translateY(-1px);}
.pantry-add-btn{display:flex;align-items:center;gap:8px;background:var(--ww);border:1.5px dashed var(--brd);border-radius:12px;padding:9px 14px;cursor:pointer;transition:all .15s;font-family:'Lora',serif;font-size:.88rem;font-style:italic;color:var(--txt3);margin-bottom:18px;}
.pantry-add-btn:hover{border-color:var(--rose3);color:var(--rose);background:var(--rosebg);}
.shi-del{position:absolute;top:-6px;right:-6px;background:white;border:1.5px solid var(--brd);border-radius:50%;width:18px;height:18px;font-size:.6rem;cursor:pointer;display:none;align-items:center;justify-content:center;transition:all .15s;color:var(--txt3);}
.shi:hover .shi-del{display:flex;}
.shi-del:hover{background:var(--rose);border-color:var(--rose);color:white;}
.wish-edit-inp{flex:1;border:1.5px solid var(--rose3);border-radius:10px;padding:4px 10px;font-family:'Playfair Display',serif;font-size:.95rem;font-style:italic;color:var(--brown);background:white;outline:none;}
.wish-del-btn{background:none;border:none;cursor:pointer;color:var(--brd2);font-size:.85rem;padding:2px 4px;transition:color .15s;flex-shrink:0;}
.wish-del-btn:hover{color:var(--rose);}
.cinfo-actions{display:flex;gap:7px;margin-top:8px;}
.c-act-btn{background:var(--cream);border:1.5px solid var(--brd);border-radius:20px;padding:4px 12px;font-family:'Lora',serif;font-size:.76rem;font-style:italic;color:var(--txt2);cursor:pointer;transition:all .15s;}
.c-act-btn:hover{border-color:var(--rose3);color:var(--rose);}
.c-act-btn.del:hover{border-color:#D4A0A8;color:#8B3040;}
`

