// scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el=>io.observe(el));

  // PCB rail: build nodes dynamically based on sections
  const sections = [
    {id:'about', label:'U1 About'},
    {id:'skills', label:'U2 Skills'},
    {id:'projects', label:'U3 Projects'},
    {id:'experience', label:'U4 Experience'},
    {id:'contact', label:'U5 Contact'}
  ];
  const rail = document.getElementById('rail');
  const railFill = document.getElementById('railFill');
  const nodeEls = [];

  function placeNodes(){
    nodeEls.forEach(n => n.el.remove());
    nodeEls.length = 0;
    const railHeight = document.documentElement.scrollHeight;
    sections.forEach(s=>{
      const target = document.getElementById(s.id);
      if(!target) return;
      const top = target.offsetTop;
      const pct = (top / (railHeight - window.innerHeight)) * 100;
      const node = document.createElement('div');
      node.className='rail-node';
      node.style.top = 'calc(' + Math.min(pct,96) + 'vh - 0px)';
      node.style.position='fixed';
      node.style.top = null;
      rail.appendChild(node);
      const label = document.createElement('div');
      label.className='rail-label';
      label.textContent = s.label;
      node.appendChild(label);
      nodeEls.push({id:s.id, el:node, top});
    });
  }

  function layoutRail(){
    // reposition nodes relative to viewport using fixed positioning based on document scroll progress
    nodeEls.forEach(n=>{
      const target = document.getElementById(n.id);
      const rect = target.getBoundingClientRect();
      const y = rect.top + 8;
      n.el.style.top = y + 'px';
    });
  }

  function updateRail(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.min(100, (scrollTop / docHeight) * 100);
    railFill.style.height = pct + '%';

    let activeId = null;
    nodeEls.forEach(n=>{
      const target = document.getElementById(n.id);
      const rect = target.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.5){ activeId = n.id; }
    });
    nodeEls.forEach(n=>{
      n.el.classList.toggle('active', n.id === activeId);
    });
    layoutRail();
  }

  window.addEventListener('load', ()=>{ placeNodes(); updateRail(); });
  window.addEventListener('scroll', updateRail);
  window.addEventListener('resize', ()=>{ placeNodes(); updateRail(); });
