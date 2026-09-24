/* ============================================================
   PRAVESH KUMAR — PORTFOLIO / script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  setYear();
  initNav();
  initMobileMenu();
  initGraphCanvas();
  initTabs();
  initReveal();
  initTypedLine();
  initContactForm();
  initCustomCursor();
  initScrollProgress();
  initAmbientGlow();
  initTilt();
  fetchGithubStats();
});

/* ---- Boot-sequence preloader ---- */
function initPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  const linesEl = document.getElementById('boot-lines');
  const fill = document.getElementById('boot-bar-fill');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const steps = [
    'initializing environment',
    'loading skills.json',
    'connecting to leetcode api',
    'compiling projects',
    'rendering interface'
  ];

  if (prefersReduced) {
    pre.classList.add('hidden');
    document.body.style.overflow = '';
    return;
  }

  document.body.style.overflow = 'hidden';
  let i = 0;

  function nextStep() {
    if (i < steps.length) {
      const row = document.createElement('div');
      row.className = 'boot-line';
      row.innerHTML = `<span class="ok">✓</span> ${steps[i]}`;
      linesEl.appendChild(row);
      i++;
      fill.style.width = `${(i / steps.length) * 100}%`;
      setTimeout(nextStep, 260);
    } else {
      setTimeout(() => {
        pre.classList.add('hidden');
        document.body.style.overflow = '';
      }, 350);
    }
  }
  setTimeout(nextStep, 300);
}

/* ---- Custom cursor (desktop / fine pointer only) ---- */
function initCustomCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let rx = 0, ry = 0, tx = 0, ty = 0;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    tx = e.clientX; ty = e.clientY;
  });

  function loop() {
    rx += (tx - rx) * 0.18;
    ry += (ty - ry) * 0.18;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, input, textarea, .project-card, .chip').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ---- Scroll progress bar ---- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = `${scrolled}%`;
  }, { passive: true });
}

/* ---- Ambient glow orbs that drift toward the cursor per section ---- */
function initAmbientGlow() {
  const glows = document.querySelectorAll('.ambient-glow');
  if (!glows.length) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('section').forEach(section => {
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      const glow = section.querySelector('.ambient-glow');
      if (glow) {
        glow.style.transform = `translate(${relX * 60 - 30}px, ${relY * 60 - 30}px)`;
      }
    });
  });
}

/* ---- 3D tilt on project cards ---- */
function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.project-card').forEach(card => {
    const glare = card.querySelector('.glare');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      if (glare) {
        glare.style.setProperty('--gx', `${(x / rect.width) * 100}%`);
        glare.style.setProperty('--gy', `${(y / rect.height) * 100}%`);
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ---- Footer year ---- */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---- Nav scroll state + active link highlighting ---- */
function initNav() {
  const nav = document.querySelector('.nav');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (!sections.length) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => spy.observe(s));
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu .close-btn');
  if (!toggle || !menu) return;

  const open = () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { menu.classList.remove('open'); document.body.style.overflow = ''; };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ---- Hero canvas: animated graph / node network (nods to DSA graph traversal) ---- */
function initGraphCanvas() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, nodes, dpr;
  const NODE_COUNT_BASE = 42;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(18, Math.round((w * h) / 32000));
    nodes = Array.from({ length: Math.min(count, NODE_COUNT_BASE) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 1
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    const linkDist = 150;

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          const opacity = (1 - dist / linkDist) * 0.35;
          ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      // connect to mouse for a subtle interactive feel
      const dxm = nodes[i].x - mouse.x, dym = nodes[i].y - mouse.y;
      const dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 180) {
        ctx.strokeStyle = `rgba(124, 77, 255, ${(1 - dm / 180) * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233, 237, 247, 0.55)';
      ctx.fill();
    });

    if (!prefersReduced) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize, { passive: true });
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  step();
  if (prefersReduced) {
    // draw a single static frame instead of animating
    step();
  }
}

/* ---- Tabs (Skills / Education / Certifications) ---- */
function initTabs() {
  const groups = document.querySelectorAll('[data-tabs]');
  groups.forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = group.querySelector(`#${btn.dataset.target}`);
        target?.classList.add('active');
      });
    });
  });
}

/* ---- Scroll reveal + DSA bar-fill trigger ---- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const bars = document.querySelectorAll('.bar-fill');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => io.observe(el));

  const barIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width || '0%';
        barIo.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barIo.observe(b));
}

/* ---- Typed terminal line in hero ---- */
function initTypedLine() {
  const el = document.getElementById('typed-role');
  if (!el) return;
  const roles = ['Frontend Developer', 'AI / ML Engineer', 'Data Scientist', 'Data Analyst', 'Predictive Modeler', 'Problem Solver', 'Data Engineer', ];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { el.textContent = roles[0]; return; }

  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 60);
  }
  tick();
}

/* ---- Contact form (submits via FormSubmit — no backend required) ---- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    status.textContent = '';
    status.className = 'form-status';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        status.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
        status.classList.add('ok');
        form.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (err) {
      status.textContent = 'Could not send right now — please email me directly instead.';
      status.classList.add('err');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

/* ---- Live GitHub stats (fetched client-side, no external image widgets) ---- */
async function fetchGithubStats() {
  const panel = document.getElementById('github-panel');

  if (!panel) return;
  // =========================
  // YOUR REAL GITHUB USERNAME
  // =========================
  const username = 'praveshengineer22-crypto';

  const errorEl = document.getElementById('gh-error');
  const repoListEl = document.getElementById('gh-repo-list');

  try {

    // =========================
    // GITHUB API URLS
    // =========================

    const profileURL =
      `https://api.github.com/users/${username}`;

    const reposURL =
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`;


    // =========================
    // FETCH DATA
    // =========================

    const [userRes, reposRes] = await Promise.all([
      fetch(profileURL),
      fetch(reposURL)
    ]);


    if (!userRes.ok) {
      throw new Error('GitHub profile API failed');
    }

    if (!reposRes.ok) {
      throw new Error('GitHub repositories API failed');
    }


    const user = await userRes.json();
    const repos = await reposRes.json();


    // =========================
    // PROFILE
    // =========================

    const avatar = document.getElementById('gh-avatar');
    const name = document.getElementById('gh-name');
    const handle = document.getElementById('gh-handle');

    if (avatar) {
      avatar.src = user.avatar_url;
      avatar.alt = `${user.login}'s GitHub avatar`;
    }

    if (name) {
      name.textContent = user.name || user.login;
    }

    if (handle) {
      handle.textContent = `@${user.login}`;
      handle.href = user.html_url;
    }


    // =========================
    // GITHUB STATS
    // =========================

    document.getElementById('gh-repos').textContent =
      user.public_repos ?? '—';

    document.getElementById('gh-followers').textContent =
      user.followers ?? '—';

    document.getElementById('gh-following').textContent =
      user.following ?? '—';

    document.getElementById('gh-since').textContent =
      user.created_at
        ? new Date(user.created_at).getFullYear()
        : '—';


    // =========================
    // PUBLIC REPOSITORIES
    // =========================

    const publicRepos = repos.filter(repo => !repo.private);


    // =========================
    // SHOW ALL PUBLIC REPOS
    // =========================

    if (publicRepos.length > 0) {

      repoListEl.innerHTML = publicRepos.map(repo => {

        return `
          <div class="gh-repo-item">

            <div class="gh-repo-content">

              <a
                href="${repo.html_url}"
                target="_blank"
                rel="noopener noreferrer"
              >
                ${escapeHtml(repo.name)}
              </a>

              <p>
                ${escapeHtml(
                  repo.description || 'No description provided.'
                )}
              </p>

            </div>

            <div class="gh-repo-meta">

              ${
                repo.language
                  ? `
                    <span>
                      <span class="gh-lang-dot"></span>
                      ${escapeHtml(repo.language)}
                    </span>
                  `
                  : ''
              }

              <span>
                ★ ${repo.stargazers_count}
              </span>

              <span>
                🍴 ${repo.forks_count}
              </span>

            </div>

          </div>
        `;

      }).join('');

    } else {

      repoListEl.innerHTML = `
        <p style="
          font-family:var(--font-mono);
          font-size:13px;
          color:var(--text-dim);
        ">
          No public repositories found.
        </p>
      `;
    }


    // =========================
    // HIDE ERROR
    // =========================

    if (errorEl) {
      errorEl.hidden = true;
    }


  } catch (error) {

    console.error('GitHub API Error:', error);

    // IMPORTANT:
    // Fake demo repositories nahi dikhayenge.

    repoListEl.innerHTML = `
      <div class="gh-api-error">

        <strong>
          GitHub data temporarily unavailable.
        </strong>

        <br><br>

        <a
          href="https://github.com/${username}"
          target="_blank"
          rel="noopener noreferrer"
        >
          View GitHub Profile ↗
        </a>

      </div>
    `;

    if (errorEl) {
      errorEl.hidden = false;
    }

    document.getElementById('gh-repos').textContent = '—';
    document.getElementById('gh-followers').textContent = '—';
    document.getElementById('gh-following').textContent = '—';
    document.getElementById('gh-since').textContent = '—';
  }
}


/* =========================
   HTML ESCAPE
========================= */

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}


/* =========================
   START GITHUB
========================= */

fetchGithubStats();


/* =========================
   AUTO REFRESH
   Every 5 minutes
========================= */

setInterval(() => {
  fetchGithubStats();
}, 5 * 60 * 1000);