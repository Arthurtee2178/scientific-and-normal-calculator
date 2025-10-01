document.addEventListener('DOMContentLoaded', () => {
  const navBtns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.panel');

  navBtns.forEach(btn => btn.addEventListener('click', (e) => {
    const target = btn.dataset.target;
    if (btn.classList.contains('active')) return;
    document.querySelector('.nav-btn.active').classList.remove('active');
    btn.classList.add('active');

    const showing = document.querySelector('.panel:not(.hidden)');
    const next = document.getElementById(target);

    showing.classList.add('panel-exit');
    setTimeout(()=>{
      showing.classList.add('hidden');
      showing.classList.remove('panel-exit');
      next.classList.remove('hidden');
      next.classList.add('panel-enter');
      setTimeout(()=> next.classList.remove('panel-enter'),420);
    }, 220);
  }));

  function hookCalculator(panelId, displayId, sci=false){
    const panel = document.getElementById(panelId);
    const display = document.getElementById(displayId);
    let current = '';
    let prev = null;
    let op = null;

    function refresh(){ display.textContent = current || '0'; }

    function calcResult(){
      try{
        if (op === 'add') return (Number(prev) + Number(current));
        if (op === 'subtract') return (Number(prev) - Number(current));
        if (op === 'multiply') return (Number(prev) * Number(current));
        if (op === 'divide') return (Number(prev) / Number(current));
        if (op === 'pow') return Math.pow(Number(prev), Number(current));
        return Number(current);
      }catch(e){return 'Err'}
    }

    panel.addEventListener('click', (e)=>{
      const btn = e.target.closest('button');
      if (!btn) return;

      btn.classList.add('ripple','play');
      setTimeout(()=> btn.classList.remove('play'), 300);

      const text = btn.textContent.trim();
      const action = btn.dataset.action;

      if (!action){
        if (text === '.' && current.includes('.')) return refresh();
        if (current === '0' && text !== '.') current = text;
        else current = (current || '') + text;
        return refresh();
      }

      switch(action){
        case 'clear': current=''; prev=null; op=null; break;
        case 'back': current = current.slice(0,-1); break;
        case 'negate': if(current) current = String(-Number(current)); break;
        case 'percent': if(current) current = String(Number(current)/100); break;
        case 'add': case 'subtract': case 'multiply': case 'divide': case 'pow':
          if (prev !== null && current !== ''){ prev = calcResult(); current=''; op = action; }
          else { prev = current || '0'; current=''; op = action; }
          break;
        case 'equals':
          if (op && prev !== null){ current = String(calcResult()); prev=null; op=null; }
          break;
        case 'sqrt': if (current) current = String(Math.sqrt(Number(current))); break;
        case 'sin': if (current) current = String(Math.sin(Number(current) * Math.PI/180)); break;
        case 'cos': if (current) current = String(Math.cos(Number(current) * Math.PI/180)); break;
        case 'tan': if (current) current = String(Math.tan(Number(current) * Math.PI/180)); break;
        case 'ln': if (current) current = String(Math.log(Number(current))); break;
        case 'log': if (current) current = String(Math.log10(Number(current))); break;
      }
      refresh();
    });
  }

  hookCalculator('standard','display-standard', false);
  hookCalculator('scientific','display-sci', true);

  window.addEventListener('keydown', (e) => {
    const key = e.key;
    const activePanel = document.querySelector('.panel:not(.hidden)');
    if (!activePanel) return;

    let btn = null;

    if (/^[0-9]$/.test(key) || key === '.'){
      btn = Array.from(activePanel.querySelectorAll('button.key'))
        .find(b => b.dataset.action === undefined && b.textContent.trim() === key);
    }

    if (!btn) {
      switch (key) {
        case '+': btn = activePanel.querySelector('button[data-action="add"]'); break;
        case '-': btn = activePanel.querySelector('button[data-action="subtract"]'); break;
        case '*': btn = activePanel.querySelector('button[data-action="multiply"]'); break;
        case '/': btn = activePanel.querySelector('button[data-action="divide"]'); break;
        case '^': btn = activePanel.querySelector('button[data-action="pow"]'); break;
        case '%': btn = activePanel.querySelector('button[data-action="percent"]'); break;
        case 'Enter': btn = activePanel.querySelector('button[data-action="equals"]'); break;
        case '=': btn = activePanel.querySelector('button[data-action="equals"]'); break;
        case 'Backspace': btn = activePanel.querySelector('button[data-action="back"]'); break;
        case 'Escape': btn = activePanel.querySelector('button[data-action="clear"]'); break;
      }
    }

    if (btn) {
      btn.focus();
      btn.click();
      e.preventDefault();
    }
  });
});
