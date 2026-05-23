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
