(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile nav */
  var mb=$('.menu-btn'), nav=$('#nav');
  mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  $$('#nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')})});

  /* hero shuffle demo (abstract tiles, not real apps) */
  var grid=$('#demoGrid'), glyphs=['●','▲','■','◆','★','✚','♥','☾','☀','♪','⬟','✦','❖','☁','⬢','✿'];
  var colors=['#e5594f','#f2a33a','#4caf7d','#4a8fe0','#9b6bd6','#e0679b','#2fb6b6','#7a8aa8','#d1a437','#5b6ee1','#3ea06b','#d9534f','#8e6fd0','#e08a3c','#3f9ad1','#c45f8f'];
  var order=glyphs.map(function(_,i){return i}), tiles=[], count=0;
  glyphs.forEach(function(g,i){var t=document.createElement('div');t.className='tile';t.textContent=g;t.style.background=colors[i];t.setAttribute('aria-hidden','true');grid.appendChild(t);tiles.push(t)});
  function pos(){return tiles.map(function(t){var r=t.getBoundingClientRect();return {x:r.left,y:r.top}})}
  function shuffle(){
    var before=pos();
    for(var i=order.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=order[i];order[i]=order[j];order[j]=tmp}
    order.forEach(function(idx,slot){tiles[idx].style.order=slot});
    count++;$('#demoCount').textContent='عدد مرات الخلط: '+count;
    if(reduce)return;
    var after=pos();
    tiles.forEach(function(t,i){
      var dx=before[i].x-after[i].x, dy=before[i].y-after[i].y;
      t.style.transition='none';t.style.transform='translate('+dx+'px,'+dy+'px)';
    });
    grid.offsetHeight;
    tiles.forEach(function(t){t.style.transition='';t.style.transform=''});
  }
  $('#shuffleBtn').addEventListener('click',shuffle);
  var started=false;
  if('IntersectionObserver' in window&&!reduce){
    new IntersectionObserver(function(es,o){if(es[0].isIntersecting&&!started){started=true;setTimeout(shuffle,500);o.disconnect()}},{threshold:.6}).observe(grid);
  }

  /* tabs */
  var tabs=$$('[role=tab]');
  function sel(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;$('#'+x.getAttribute('aria-controls')).hidden=!on});t.focus()}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){sel(t)});
    t.addEventListener('keydown',function(e){
      var n=null; if(e.key==='ArrowLeft')n=tabs[(i+1)%tabs.length]; if(e.key==='ArrowRight')n=tabs[(i-1+tabs.length)%tabs.length];
      if(n){e.preventDefault();sel(n)}
    });
  });

  /* download modal */
  var modal=$('#dlModal'), lastFocus=null;
  function open(){lastFocus=document.activeElement;modal.hidden=false;document.body.style.overflow='hidden';$('.x',modal).focus()}
  function close(){modal.hidden=true;document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  $$('[data-download]').forEach(function(a){a.addEventListener('click',function(){setTimeout(open,350)})});
  $$('[data-close]',modal).forEach(function(b){b.addEventListener('click',close)});
  modal.addEventListener('click',function(e){if(e.target===modal)close()});
  document.addEventListener('keydown',function(e){
    if(modal.hidden)return;
    if(e.key==='Escape')close();
    if(e.key==='Tab'){
      var f=$$('button,a[href]',modal).filter(function(el){return el.offsetParent!==null});
      if(!f.length)return;var first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
})();
