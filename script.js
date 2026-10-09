(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const intro = $('#intro'), profiles = $('#profiles'), site = $('#site');

  /* ---- Flow: intro -> profiles -> site ---- */
  function showProfiles() {
    intro.classList.add('out');
    setTimeout(() => { intro.classList.add('hidden'); profiles.classList.remove('hidden'); }, 600);
  }
  function enterSite(target) {
    profiles.classList.add('hidden');
    site.classList.remove('hidden');
    document.body.classList.remove('locked');
    try { sessionStorage.setItem('seen', '1'); } catch (e) {}
    const el = $('#' + (target || 'home'));
    if (el) el.scrollIntoView({ behavior: 'auto' });
  }
  const autoTimer = setTimeout(showProfiles, 6500);
  $('#introPlay').addEventListener('click', () => { clearTimeout(autoTimer); showProfiles(); });
  $('#skipIntro').addEventListener('click', () => { clearTimeout(autoTimer); showProfiles(); });
  $$('.profile').forEach(b => b.addEventListener('click', () => enterSite(b.dataset.go)));

  let seen = false;
  try { seen = sessionStorage.getItem('seen') === '1'; } catch (e) {}
  if (seen) { clearTimeout(autoTimer); intro.classList.add('hidden'); enterSite('home'); }

  /* ---- Replay / watch again ---- */
  $('#watchAgain').addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  $('#replayIntro').addEventListener('click', e => {
    e.preventDefault();
    try { sessionStorage.removeItem('seen'); } catch (er) {}
    location.reload();
  });

  /* ---- Nav ---- */
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });
  $('#burger').addEventListener('click', () => $('#nav nav').classList.toggle('open'));
  $$('#nav nav a').forEach(a => a.addEventListener('click', () => $('#nav nav').classList.remove('open')));

  const links = $$('#nav nav a');
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));

  /* ---- Row arrows ---- */
  $$('.row-wrap').forEach(w => {
    const row = $('.row', w);
    $('.left', w).addEventListener('click', () => row.scrollBy({ left: -row.clientWidth * .8, behavior: 'smooth' }));
    $('.right', w).addEventListener('click', () => row.scrollBy({ left: row.clientWidth * .8, behavior: 'smooth' }));
  });

  /* ---- Skills ---- */
  const skills = [
    { name: 'LANGUAGES', sub: 'C, Java, Python', color: '#e50914', items: [['C', 'Programming · Cisco certified'], ['Java', 'Oracle certified'], ['Python', 'Basics · Microsoft certified']] },
    { name: 'FRONTEND', sub: 'The web platform', color: '#46d369', items: [['HTML', 'Structure'], ['CSS', 'Styling']] },
    { name: 'BACKEND', sub: 'Server-side logic', color: '#a78bfa', items: [['Django', 'Smart Service project'], ['Python', 'Scripting & web']] },
    { name: 'INFRA & TOOLS', sub: 'Shipping & operations', color: '#59b4d6', items: [['Linux', 'System administration'], ['Windows', 'System administration'], ['Networking', 'Fundamentals'], ['Server Mgmt', 'Administration'], ['AWS', 'DevOps certified'], ['Docker', 'Containers'], ['Git & GitHub', 'Version control'], ['VS Code', 'Editor'], ['Shell', 'Automation scripting']] },
    { name: 'DATABASES', sub: 'Storing & retrieving', color: '#ffbf3a', items: [['MySQL', 'Relational DB'], ['DB Browser', 'SQLite tooling'], ['SQLite', 'Used in Smart Service']] },
    { name: 'MICROSOFT', sub: 'Office suite', color: '#f08a4b', items: [['Excel', 'MS-Excel'], ['Word', 'MS-Word'], ['PowerPoint', 'MS-PowerPoint']] },
    { name: 'CERTIFIED', sub: 'Credentials', color: '#ff5d8f', items: [['AWS DevOps', 'Sathya Technologies'], ['Salesforce Admin', 'Internship'], ['C', 'Cisco'], ['Java', 'Oracle'], ['Python', 'Microsoft']] }
  ];
  const tabs = $('#skillTabs'), panel = $('#skillPanel');
  function renderSkills(i) {
    const s = skills[i];
    panel.style.setProperty('--tab', s.color);
    panel.innerHTML = s.items.map(([n, d]) => `<div class="skill"><b>${n}</b><span>${d}</span><div class="lvl"><i style="width:${50 + ((n.length * 7) % 45)}%"></i></div></div>`).join('');
    $$('button', tabs).forEach((b, j) => b.setAttribute('aria-selected', j === i));
    tabs.style.setProperty('--tab', s.color);
  }
  skills.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button role="tab" style="--tab:${s.color}"><b>${s.name}</b><small>${s.items.length} skills · ${s.sub}</small></button>`;
    li.firstChild.addEventListener('click', () => renderSkills(i));
    tabs.appendChild(li);
  });
  renderSkills(0);

  /* ---- Journey ---- */
  const seasons = {
    4: ['4', 'Master of Computer Applications', 'SVKP & Dr. K.S. Raju Arts and Science College (A), Penugonda', '2024 – 2026 · CGPA 8.0'],
    3: ['3', 'Bachelor of Science, MPCS', 'Aditya Degree College, Tadepalligudem', '2019 – 2022 · CGPA 6.9'],
    2: ['2', 'Intermediate, MPC', 'Aditya Junior College, Tadepalligudem', '2017 – 2019 · CGPA 8.6'],
    1: ['1', 'SSC', 'Ravindra Bharathi School, Tadepalligudem', '2016 – 2017 · CGPA 8.5']
  };
  function renderSeason(k) {
    const [n, t, p, m] = seasons[k];
    $('#episode').innerHTML = `<div class="num">S${n}</div><div><h3>${t}</h3><p>${p}</p><p class="meta">${m}</p></div>`;
    $$('.season').forEach(b => b.classList.toggle('active', b.dataset.s === k));
  }
  $$('.season').forEach(b => b.addEventListener('click', () => renderSeason(b.dataset.s)));
  renderSeason('4');
})();

/* ---- Profile photo loader: tries common filenames in /assets ---- */
(function () {
  const names = ['profile', 'Profile', 'photo', 'Photo', 'pic', 'me'];
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'jpg.jpg', 'jpeg.jpg', 'png.png'];
  const candidates = [];
  names.forEach(n => exts.forEach(e => candidates.push(`assets/${n}.${e}`)));
  function find(i, cb) {
    if (i >= candidates.length) return cb(null);
    const im = new Image();
    im.onload = () => cb(candidates[i]);
    im.onerror = () => find(i + 1, cb);
    im.src = candidates[i];
  }
  find(0, src => {
    if (!src) { console.warn('No profile photo found in /assets. Add assets/profile.jpg'); return; }
    document.querySelectorAll('.avatar').forEach(a => {
      const img = document.createElement('img');
      img.src = src; img.alt = 'Lakshman';
      a.appendChild(img);
    });
  });
})();
