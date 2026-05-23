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
