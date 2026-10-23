function navTone(){var n=document.getElementById('nav');if(!n)return;var y=n.getBoundingClientRect().bottom+2,l=false;
document.querySelectorAll('.sec').forEach(function(x){var r=x.getBoundingClientRect();if(r.top<=y&&r.bottom>y)l=x.classList.contains('light')});n.classList.toggle('onlight',l)}

(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var NS='http://www.w3.org/2000/svg';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* навигация */
var nav=$('#nav');function onScroll(){nav.classList.toggle('solid',scrollY>40);navTone()}onScroll();addEventListener('scroll',onScroll,{passive:true});
var bur=$('.burger'),mm=$('#mmenu');
bur.addEventListener('click',function(){var o=mm.classList.toggle('on');bur.setAttribute('aria-expanded',o)});
$$('a',mm).forEach(function(a){a.addEventListener('click',function(){mm.classList.remove('on');bur.setAttribute('aria-expanded',false)})});

/* появление */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.18});
$$('[data-rv]').forEach(function(e){io.observe(e)});io.observe($('#steps'));

/* видео первого экрана: бесшовная петля */
if(!reduce){
  var A=$('#va'),B=$('#vb'),cur=A,nxt=B,F=1.6,busy=false;
  function go(v){try{v.currentTime=0;var p=v.play();if(p&&p.catch)p.catch(function(){})}catch(e){}}
  function first(){A.classList.add('on');go(A)}
  if(A.readyState>=2)first();else A.addEventListener('canplay',function o(){A.removeEventListener('canplay',o);first()});
  [A,B].forEach(function(v){v.addEventListener('timeupdate',function(){
    if(v!==cur||busy||!v.duration)return;
    if(v.currentTime>v.duration-F-.1){busy=true;go(nxt);nxt.classList.add('on');cur.classList.remove('on');var o=cur;cur=nxt;nxt=o;setTimeout(function(){busy=false;try{o.pause()}catch(e){}},F*1000+200)}
  })});
}

var svg=null;function el(t,at,p){var e=document.createElementNS(NS,t);for(var k in at)e.setAttribute(k,at[k]);(p||svg).appendChild(e);return e}
if($('#msvg')){
/* схема «по частям → система» */
var svg=$('#msvg'),model=$('#model');
var C=[624,205],R1=105,labels=['Эксплуатация','Инженерные системы','Безопасность','Сервис','Бюджет и KPI','IT-системы','Клининг','Подрядчики'];
var inner=[],outer=[],chaosIn=[[300,90],[980,300],[700,310],[160,250],[1080,120],[480,250]],chaosOut=[[1040,60],[260,160],[820,230],[560,50],[1090,260],[90,90],[380,290],[880,130]];
for(var i=0;i<6;i++){var a=-Math.PI/2+i*Math.PI/3;inner.push([C[0]+Math.cos(a)*R1*1.73,C[1]+Math.sin(a)*R1])}
var oa=[-118,-62,-15,15,62,118,165,-165];
oa.forEach(function(d){var a=d*Math.PI/180;outer.push([C[0]+Math.cos(a)*440,C[1]+Math.sin(a)*165])});
function el(t,at,p){var e=document.createElementNS(NS,t);for(var k in at)e.setAttribute(k,at[k]);(p||svg).appendChild(e);return e}
var wires=[],links=[];
inner.forEach(function(p,i){links.push(['c',i]);links.push([i,(i+1)%6])});
outer.forEach(function(p,i){var best=0,bd=1e9;inner.forEach(function(q,j){var d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(d<bd){bd=d;best=j}});links.push([best,'o'+i])});
links.forEach(function(){wires.push(el('line',{class:'wire','stroke-width':1}))});
el('circle',{class:'core',cx:C[0],cy:C[1],r:56,fill:'rgba(110,155,255,.14)'});
var core=el('path',{class:'core',d:'M0 -38 C4 -6 6 -4 38 0 C6 4 4 6 0 38 C-4 6 -6 4 -38 0 C-6 -4 -4 -6 0 -38Z',fill:'#fff',transform:'translate('+C[0]+' '+C[1]+') scale(.8)'});
var nodes=[];
inner.forEach(function(p,i){nodes.push({g:el('circle',{class:'nd',r:4}),a:chaosIn[i],b:p})});
outer.forEach(function(p,i){var g=el('g'),c=el('circle',{class:'nd',r:5},g),t=el('text',{class:'lab',x:12,y:4},g);t.textContent=labels[i];nodes.push({g:g,a:chaosOut[i],b:p,grp:true})});
var t0=performance.now(),phase=0;
function pos(n,k){var x=n.a[0]+(n.b[0]-n.a[0])*k,y=n.a[1]+(n.b[1]-n.a[1])*k;return [x,y]}
function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
var P={};
function frame(now){
  var T=reduce?9:((now-t0)/1000)%13,k;
  if(T<3)k=0;else if(T<5.5)k=ease((T-3)/2.5);else if(T<11)k=1;else k=1-ease((T-11)/2);
  var wob=reduce?0:(1-k);
  nodes.forEach(function(n,i){var p=pos(n,k);p[0]+=Math.sin(now/1300+i)*8*wob;p[1]+=Math.cos(now/1500+i*1.7)*6*wob;
    if(n.grp)n.g.setAttribute('transform','translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')');else{n.g.setAttribute('cx',p[0].toFixed(1));n.g.setAttribute('cy',p[1].toFixed(1))}
    P[i<6?i:'o'+(i-6)]=p});
  P.c=C;
  links.forEach(function(l,i){var a=P[l[0]],b=P[l[1]];wires[i].setAttribute('x1',a[0]);wires[i].setAttribute('y1',a[1]);wires[i].setAttribute('x2',b[0]);wires[i].setAttribute('y2',b[1])});
  model.classList.toggle('sys',k>.6);
  if(!reduce)requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

}
/* что получает заказчик: пункт в центре экрана выбирает витрину слева */
var gx=$$('.gx-it'),gw=$$('.gv .w'),gb=$$('.gx-bar i');
function setG(i){var n=document.getElementById('gxN');if(n)n.textContent='0'+(i+1);gx.forEach(function(e,j){e.classList.toggle('on',j===i)});gw.forEach(function(w,j){w.classList.toggle('on',j===i)});gb.forEach(function(b,j){b.classList.toggle('on',j===i)})}
var gio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setG(+e.target.dataset.i)})},{rootMargin:'-45% 0px -45% 0px'});
gx.forEach(function(e){gio.observe(e)});
gx.forEach(function(e){e.addEventListener('click',function(){setG(+e.dataset.i)})});

if($('#rsvg')){
/* карта рисков */
var rs=$('#rsvg'),heat=[['w',.14],['r',.13],['r',.18],['r',.24],['w',.1],['w',.14],['r',.13],['r',.18],['g',.1],['w',.1],['w',.14],['r',.13],['g',.16],['g',.1],['w',.1],['w',.14]],col={r:'255,122,122',w:'255,196,92',g:'91,227,164'};
heat.forEach(function(h,i){el('rect',{x:2+(i%4)*70,y:2+Math.floor(i/4)*50,width:66,height:46,rx:8,fill:'rgba('+col[h[0]]+','+h[1]+')'},rs)});
[[245,30,35,180],[175,75,105,175],[250,110,35,130]].forEach(function(m){
  el('circle',{cx:m[0],cy:m[1],r:7,fill:'none',stroke:'#FF7A7A','stroke-dasharray':'3 3'},rs);
  el('line',{x1:m[0],y1:m[1],x2:m[2],y2:m[3],stroke:'rgba(201,216,255,.45)','stroke-dasharray':'4 5'},rs);
  el('circle',{cx:m[2],cy:m[3],r:7,fill:'#5BE3A4'},rs)});

}
/* кольцо «12» */
var ring=$('#ring'),tks=[];if(ring){
for(var t=0;t<12;t++){var a=-Math.PI/2+t*Math.PI/6;tks.push(el('line',{class:'tk',x1:60+Math.cos(a)*48,y1:60+Math.sin(a)*48,x2:60+Math.cos(a)*56,y2:60+Math.sin(a)*56},ring))}
var ringIO=new IntersectionObserver(function(es){if(es[0].isIntersecting){ringIO.disconnect();tks.forEach(function(l,i){setTimeout(function(){l.classList.add('on')},reduce?0:120+i*90)})}},{threshold:.5});
ringIO.observe($('.twelve'));}

/* топография кампусов */
$$('[data-topo]').forEach(function(s){var seed=+s.dataset.topo*7;
  for(var x=0;x<=608;x+=76)el('line',{x1:x,y1:0,x2:x,y2:420,stroke:'rgba(157,187,255,.05)'},s);
  for(var y=0;y<=420;y+=70)el('line',{x1:0,y1:y,x2:608,y2:y,stroke:'rgba(157,187,255,.05)'},s);
  for(var i=1;i<=9;i++){var rx=28+i*32+((i*seed)%9),ry=20+i*21+((i*seed)%7),rot=((i*seed*13)%50)-25;
    el('ellipse',{cx:380,cy:200,rx:rx,ry:ry,transform:'rotate('+rot+' 380 200)',fill:'none',stroke:'rgba(157,187,255,'+(.28-i*.025).toFixed(3)+')'},s)}
  el('line',{x1:380,y1:0,x2:380,y2:420,stroke:'rgba(157,187,255,.22)','stroke-dasharray':'3 6'},s);
  el('line',{x1:0,y1:200,x2:608,y2:200,stroke:'rgba(157,187,255,.22)','stroke-dasharray':'3 6'},s);
  el('circle',{cx:380,cy:200,r:30,fill:'rgba(110,155,255,.16)'},s);
  el('path',{d:'M0 -38 C4 -6 6 -4 38 0 C6 4 4 6 0 38 C-4 6 -6 4 -38 0 C-6 -4 -4 -6 0 -38Z',fill:'#fff',transform:'translate(380 200) scale(.45)'},s)});

/* цифровые сервисы: слои */
var stack=$('#stack'),cos=$$('.co'),plates=$$('.plate');
function setL(l){stack.dataset.a=l;plates.forEach(function(p){p.classList.toggle('on',+p.dataset.l===l)});cos.forEach(function(c){var on=+c.dataset.l===l;c.classList.toggle('on',on);$('.co-sel',c).setAttribute('aria-selected',on)})}
$$('.co-sel').forEach(function(b){var l=+b.dataset.l;b.addEventListener('click',function(){setL(l)});b.addEventListener('mouseenter',function(){setL(l)})});

var G={
 access:[[68,26,132,26],[132,26,132,174],[132,174,68,174],[68,174,68,26],[84,62,116,62],[116,62,116,98],[116,98,84,98],[84,98,84,62],[100,150,100,150]],
 flow:[[40,105,85,150],[85,150,165,55],[125,55,165,55],[165,55,165,95]],
 std:[[100,28,158,50],[158,50,152,118],[152,118,100,172],[100,172,48,118],[48,118,42,50],[42,50,100,28],[100,28,100,100],[100,100,100,172]],
 edu:[[40,50,100,68],[100,68,160,50],[100,68,100,168],[40,50,40,150],[160,50,160,150],[40,150,100,168],[100,168,160,150]],
 biz:[[30,160,75,142],[75,142,110,80],[110,80,135,108],[135,108,170,40]],
 sci:[[100,30,100,92],[100,92,48,166],[48,166,152,166],[152,166,100,92]],
 comfort:[[100,40,100,54],[100,54,72,66],[72,66,60,96],[60,96,54,132],[54,132,146,132],[146,132,140,96],[140,96,128,66],[128,66,100,54],[36,150,164,150],[100,132,100,150]],
 community:[[50,60,150,60],[150,60,150,118],[150,118,96,118],[96,118,72,150],[72,150,72,118],[72,118,50,118],[50,118,50,60],[78,89,122,89]],
 coin:[[169.3,128.7,128.7,169.3],[128.7,169.3,71.3,169.3],[71.3,169.3,30.7,128.7],[30.7,128.7,30.7,71.3],[30.7,71.3,71.3,30.7],[71.3,30.7,128.7,30.7],[128.7,30.7,169.3,71.3],[169.3,71.3,169.3,128.7],[128,64,84,64],[84,64,66,100],[66,100,84,136],[84,136,128,136]],
 eisk:[[100,100,45,45],[100,100,155,45],[100,100,155,155],[100,100,45,155],[45,45,100,30],[100,30,155,45],[155,45,170,100],[170,100,155,155],[155,155,100,170],[100,170,45,155],[45,155,30,100],[30,100,45,45]],
 house:[[35,92,100,38],[100,38,165,92],[165,92,165,168],[165,168,35,168],[35,168,35,92],[80,168,80,122],[80,122,120,122],[120,122,120,168]],
 pulse:[[15,110,55,110],[55,110,75,62],[75,62,105,160],[105,160,130,78],[130,78,148,110],[148,110,185,110]]
};
function glyph(k,big){var segs=G[k],sw=big?2:6,r=big?5.5:12,o='<svg viewBox="0 0 200 200" aria-hidden="true">',seen={};
  segs.forEach(function(s){if(s[0]!==s[2]||s[1]!==s[3])o+='<line pathLength="1" x1="'+s[0]+'" y1="'+s[1]+'" x2="'+s[2]+'" y2="'+s[3]+'" stroke="#C9D8FF" stroke-width="'+sw+'" stroke-linecap="round"/>';
    [[s[0],s[1]],[s[2],s[3]]].forEach(function(p){var key=p.join();if(!seen[key]){seen[key]=1;o+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+r+'" fill="#FFFFFF"/>'}})});
  return o+'</svg>'}
var PANES=[
 {t:'Приложение резидента',s:'Вся жизнь кампуса в одном приложении: от заселения до бронирования лаборатории',tabs:[
  {n:'Один вход',g:'access',h:'Один профиль открывает весь кампус',it:[['','Профиль резидента','Одна учётная запись для студентов, преподавателей и гостей'],['','Лента дня','Расписание, события, заявки и новости в одном потоке'],['','Сервисы кампуса','Заселение, навигация, консьерж и ИИ-ассистент всегда под рукой']]},
  {n:'Сценарии',g:'flow',h:'Повседневные задачи решаются в пару касаний',it:[['','Бронирование','Пространства и оборудование кампуса бронируются онлайн'],['','Обращения в УК','Заявка со статусом и обратной связью вместо звонков и очередей'],['','Гостевой доступ','Пропуск по QR-коду за минуту']]},
  {n:'Стандарт кампуса',g:'std',h:'Приложение закрывает 6 контрольных точек Стандарта',it:[['С1.1–С1.3','Единая цифровая среда','Расписание, единый профиль и поддержка резидентов 24/7'],['И2','Контроль доступа','Электронные гостевые пропуска'],['Ф8.6, С4.1','Бронирование','Онлайн-бронь помещений, ресурсов и жилья']]}]},
 {t:'MIRAVERSE',s:'ИИ-платформа нового поколения: точка встречи студентов, науки и бизнеса',tag:'miraverse.ru',href:'https://miraverse.ru',tabs:[
  {n:'МИРА.Образование',g:'edu',h:'Персональный ИИ-наставник для каждого студента',it:[['','Репетитор.AI','Видит пробелы в знаниях и объясняет тему заново'],['','Блокнот.AI','Превращает конспекты в тесты, подкасты и инфографику'],['','Карьера.AI','Готовит учебный план под вакансию и пробное собеседование']]},
  {n:'МИРА.Бизнес',g:'biz',h:'Кампус как R&D-центр для бизнеса',it:[['','Биржа инноваций','Бизнес заказывает, учёные продают инновации'],['','Mira.Кадры','ИИ находит сильных студентов до выхода на рынок труда'],['','Mira.Space','Открытая витрина услуг кампуса']]},
  {n:'МИРА.Наука',g:'sci',h:'Полный цикл исследования на одной платформе',it:[['','Синтезатор исследований','Подбирает тему, заказчиков, лабораторию и команду'],['','Цифровая лаборатория','Моделирует эксперименты и сокращает время и затраты на проверку гипотез'],['','Цифровой соавтор','Помогает быстрее довести исследование до научной публикации']]},
  {n:'МИРА.Комфорт',g:'comfort',h:'Бытовой сервис кампуса в одном окне',txt:'Клининг, стирка, мелкий ремонт и другие бытовые вопросы резидент решает через консьерж-сервис в приложении.',flag:'Консьерж'},
  {n:'МИРА.Сообщество',g:'community',h:'Все чаты кампуса в одном месте',txt:'Студенты, преподаватели, исследователи и бизнес общаются в общих и командных чатах платформы.',flag:'Mira.Talks'}
 ]},
 {t:'Цифровая инфраструктура',s:'Интеллектуальное управление зданием: три системы в одном контуре',tabs:[
  {n:'ЕИСК',g:'eisk',h:'Единая информационная система кампуса',it:[['','Портал и кабинет','Информационный портал и личный кабинет резидента'],['','Расписания и навигация','Управление расписаниями, навигация, ИИ-помощник'],['','Интеграционная платформа','Персонал, научное оборудование и все системы кампуса']]},
  {n:'Explo-IT',g:'house',h:'Цифровая эксплуатация зданий',it:[['','Паспортизация','Цифровые паспорта зданий и помещений из BIM-модели'],['','Заявки и обходы','Маршрутизация заявок, цифровые чек-листы и аудиты'],['','ППР и закупки','График работ и план закупок формируются автоматически']]},
  {n:'АСУЗ',g:'pulse',h:'Автоматизированная система управления зданием',it:[['','Платформа здания','Единая точка управления инженерной инфраструктурой'],['','Диспетчеризация','Автоматизация и мониторинг инженерных систем'],['','Интеграции','Комплексная безопасность и учёт энергоресурсов и воды']]}]}
];
var sheet=$('#sheet'),pane=$('#pane'),lastFocus;
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function renderSub(p,ti){var t=p.tabs[ti];
  $$('.pill',pane).forEach(function(b,i){b.setAttribute('aria-selected',i===ti)});
  $('#sub',pane).innerHTML='<div class="cons">'+glyph(t.g,true)+'</div><div><h4>'+esc(t.h)+'</h4>'+(t.txt?'<p class="sub-p">'+esc(t.txt)+'</p>':'<div class="items">'+t.it.map(function(x){var m=x[0]?'<span class="m">'+esc(x[0])+'</span>':'';return '<div class="it">'+(x[3]?'<b>'+esc(x[1])+'</b>'+m:m+'<b>'+esc(x[1])+'</b>')+'<p>'+esc(x[2])+'</p></div>'}).join('')+'</div>')+'</div>'}
function openP(i){var p=PANES[i];lastFocus=document.activeElement;
  pane.innerHTML='<div class="p-h"><div><h3 id="p-title"><span class="chrome">'+esc(p.t)+'</span></h3><p>'+esc(p.s)+'</p></div>'+(p.href?'<span class="tags"><a class="tag" href="'+p.href+'" target="_blank" rel="noopener">'+p.tag+'</a></span>':(p.tag?'<span class="tags"><span class="tag">'+esc(p.tag)+'</span>'+(p.tag2?'<span class="tag tag-st"><i></i>'+esc(p.tag2)+'</span>':'')+'</span>':''))+'</div>'+
   '<div class="pills" role="tablist">'+p.tabs.map(function(t,j){return '<button class="pill" type="button" role="tab" data-t="'+j+'">'+glyph(t.g,false)+esc(t.n)+'</button>'}).join('')+'</div><div class="sub" id="sub"></div>';
  $$('.pill',pane).forEach(function(b){b.addEventListener('click',function(){renderSub(p,+b.dataset.t)})});
  renderSub(p,0);sheet.classList.add('on');sheet.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(function(){$('.x').focus()},50)}
function closeP(){sheet.classList.remove('on');sheet.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus)lastFocus.focus()}
$$('[data-more]').forEach(function(b){b.addEventListener('click',function(){setL(+b.dataset.more);openP(+b.dataset.more)})});
$$('[data-close]').forEach(function(b){b.addEventListener('click',closeP)});
addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('on'))closeP()});


/* ролик MIRAVERSE */
var vbox=$('#vbox'),vp=$('#vplayer'),vLast;
function openV(){if(!vp.getAttribute('src')){vp.src='assets/video/miraverse.mp4'}vLast=document.activeElement;vbox.classList.add('on');vbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';try{var p=vp.play();if(p&&p.catch)p.catch(function(){})}catch(e){}setTimeout(function(){$('.x',vbox).focus()},50)}
function closeV(){try{vp.pause()}catch(e){}vbox.classList.remove('on');vbox.setAttribute('aria-hidden','true');if(!$('#sheet').classList.contains('on'))document.body.style.overflow='';if(vLast)vLast.focus()}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-video]');if(b){e.preventDefault();openV()}});
$$('[data-vclose]').forEach(function(b){b.addEventListener('click',closeV)});
addEventListener('keydown',function(e){if(e.key==='Escape'&&vbox.classList.contains('on')){e.stopImmediatePropagation();closeV()}},true);


/* галереи объектов */
$$('.ph.gal').forEach(function(g,gi){var im=$$('img',g),ds=$$('.gd i',g),i=0,tm;
  var ct=$('.gc-t',g),cn=$('.gc-n',g);function set(n){i=n;im.forEach(function(e,j){e.classList.toggle('on',j===n)});ds.forEach(function(e,j){e.classList.toggle('on',j===n)});if(ct)ct.textContent=im[n].dataset.cap||'';if(cn)cn.textContent=('0'+(n+1)).slice(-2)+' / '+('0'+im.length).slice(-2)}set(0);
  function go(){clearInterval(tm);if(!reduce)tm=setInterval(function(){set((i+1)%im.length)},5200)}
  ds.forEach(function(d,j){d.addEventListener('click',function(){set(j);go()})});
  setTimeout(go,gi*2600);
});
/* форма */
$('#form').addEventListener('submit',function(e){e.preventDefault();$('#sent').textContent='Спасибо. Мы свяжемся с вами по указанному контакту.';this.reset()});
})();

(function(){var w=document.getElementById('vwin'),v=document.getElementById('vv');
var hover=matchMedia('(hover:hover)').matches;
function on(){w.classList.add('play');var p=v.play();if(p)p.catch(function(){})}
function off(){w.classList.remove('play');v.pause()}
if(hover){w.addEventListener('mouseenter',on);w.addEventListener('mouseleave',off)}
else{var t;new IntersectionObserver(function(e){if(e[0].isIntersecting){t=setTimeout(on,1200)}else{clearTimeout(t);off()}},{threshold:.5}).observe(w)}
})();

(function(){var h=document.getElementById('top');if(!h||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var r=false;
function u(){r=false;var p=Math.min(1,Math.max(0,scrollY/(h.offsetHeight*.8)));h.style.setProperty('--hp',p.toFixed(3))}
addEventListener('scroll',function(){if(!r){r=true;requestAnimationFrame(u)}},{passive:true});u()})();

/* «О нас»: схема выходит после заголовка */
(function(){var h=document.querySelector('#about .h2'),st=document.getElementById('steps');if(!h||!st)return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches){st.classList.add('go');return}
var o=new IntersectionObserver(function(e){if(e[0].isIntersecting){o.disconnect();setTimeout(function(){st.classList.add('go')},550)}},{threshold:.3});o.observe(h)})();
