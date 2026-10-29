// Landing page: pickle characters, scripted demo, model marquee, flow beams and request log.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

const CAST = [
  { name: 'Pickle', c: '#22cd56', d: '#087e31' },
  { name: 'Sky', c: '#68b4ed', d: '#2a6fb0' },
  { name: 'Lilac', c: '#b296e6', d: '#6b4bb0' },
  { name: 'Coral', c: '#ff8a6b', d: '#c2452a' },
  { name: 'Vanilla', c: '#f2cf5b', d: '#b58a12' },
  { name: 'Teal', c: '#2fc4b2', d: '#127a6e' },
];
let uid = 0;
function pickle(k, size, state = 'idle', tag = 'span') {
  const id = `pk${uid++}`;
  return `<${tag} class="pickle" data-st="${state}" style="width:${size}px;height:${size}px;--t0:-${Math.round(Math.random() * 5000)}ms"${tag === 'button' ? ` type="button" aria-label="Squish ${k.name}"` : ' aria-hidden="true"'}><svg viewBox="16 12 128 140"><defs><radialGradient id="${id}" cx="35%" cy="25%" r="80%"><stop stop-color="#f2fff0" stop-opacity=".8"/><stop offset=".3" stop-color="${k.c}"/><stop offset=".85" stop-color="${k.c}"/><stop offset="1" stop-color="${k.d}"/></radialGradient></defs><ellipse cx="80" cy="146" rx="38" ry="4.5" fill="#174a20" opacity=".12"/><g class="pk-body"><path d="M80 28C53 9 21 26 28 56c3 12 3 25-3 43-11 35 18 52 46 37 6-3 12-3 18 0 29 15 57-5 45-37-6-16-8-27-3-42 8-30-24-47-51-29Z" fill="url(#${id})" stroke="${k.c}" stroke-width="2"/><path d="M42 38c7-8 18-7 24-3" fill="none" stroke="#fff" stroke-width="5" opacity=".45" stroke-linecap="round"/><g class="pk-eyes"><ellipse cx="63" cy="78" rx="8" ry="14" fill="#16211a"/><ellipse cx="98" cy="78" rx="8" ry="14" fill="#16211a"/><ellipse cx="61" cy="72" rx="2.5" ry="4" fill="#fff"/><ellipse cx="96" cy="72" rx="2.5" ry="4" fill="#fff"/></g><path d="M75 99q5 4 10 0" fill="none" stroke="#17542c" stroke-width="2.5" stroke-linecap="round" opacity=".6"/></g></svg></${tag}>`;
}

$('cast').innerHTML = CAST.map((k) => `<figure>${pickle(k, 84, 'idle', 'button')}<figcaption>${k.name}</figcaption></figure>`).join('');
$('cast').addEventListener('click', (e) => {
  const b = e.target.closest('button.pickle');
  if (!b) return;
  b.classList.remove('squish');
  void b.getBoundingClientRect();
  b.classList.add('squish');
});
$('cast2').innerHTML = CAST.map((k) => pickle(k, 44)).join('');
$('hubpk').innerHTML = pickle(CAST[0], 44);
$('headpk').innerHTML = pickle(CAST[0], 28);
$('colors').innerHTML = CAST.slice(0, 5).map((k) => pickle(k, 52)).join('');
for (const el of document.querySelectorAll('[data-pk]')) el.innerHTML = pickle(CAST[Number(el.dataset.pk)], 26);

// ---------- scripted demo ----------
const ICON = {
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z"/>',
  explore: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
  archive: '<path d="m3 9 3-6h12l3 6v10H3V9Z M3 9h18 M9 14h6"/>',
  me: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 6 0 0 1 16 0v2H4Z"/>',
};
const row = (ic, label, on = false, small = '') => `<div class="row${on ? ' on' : ''}"><span class="ic"><svg viewBox="0 0 24 24">${ICON[ic]}</svg></span>${label}${small ? `<small>${small}</small>` : ''}</div>`;
$('side').innerHTML = `${row('chat', 'Main chat', true)}${row('explore', 'Explore')}${row('archive', 'Archive')}${row('me', 'My Pickle')}<h4>Other chats</h4>${row('chat', 'Weekend plans', false, 'Sat')}${row('chat', 'Book list', false, 'Oct 27')}`;

const msgs = $('thread');
const prof = $('prof');
const body = document.querySelector('.app-body');
const typing = $('typing');
const status = $('status');
const replay = $('replay');
let run = 0;

const you = (t) => `<div class="msg you"><p>${t}</p></div>`;
const bot = (t, state = 'idle') => `<div class="msg">${pickle(CAST[0], 30, state)}<div class="body"><b style="color:#16a34a">Pickle</b><p>${t}</p></div></div>`;
const add = (el, html) => { el.insertAdjacentHTML('beforeend', html); return el.lastElementChild; };
const profile = (mems) => `${pickle(CAST[0], 56)}<b>Pickle</b><div class="seg"><span>Done</span><span>Scheduled</span><span class="on">Memories</span></div>${mems.map(([t, d]) => `<div class="mem">${t}<small>${d}</small></div>`).join('')}`;

const SCRIPT = {
  ask: 'I want to read a little every day this week.',
  r1: 'Nice. Start with 20 minutes. When do you like to read?',
  ask2: 'Essays, right before bed.',
  r2: "That sounds cozy. I'll keep that in mind.",
  ask3: 'Remind me every night at 10.',
  r3: 'Done. A daily reminder at 10:00 pm, in this chat.',
  alarm: "⏰ Reading time. Which essay tonight?",
};

function staticDemo() {
  msgs.innerHTML = [you(SCRIPT.ask), bot(SCRIPT.r1), you(SCRIPT.ask2), bot(SCRIPT.r2), '<div class="msg memory">Saved to Memories</div>', you(SCRIPT.ask3), bot(SCRIPT.r3), `<div class="msg alarm">${SCRIPT.alarm}</div>`].join('');
  prof.innerHTML = profile([['Reads essays before bed', 'Today'], ['Likes short, clear answers', 'Oct 27']]);
  body.classList.add('threaded');
}

async function play() {
  const id = ++run;
  const wait = (ms) => new Promise((ok, stop) => setTimeout(() => (id === run ? ok() : stop()), ms));
  msgs.innerHTML = ''; prof.innerHTML = ''; typing.textContent = '';
  body.classList.remove('threaded');
  replay.hidden = true;

  async function type(t) {
    for (const ch of t) { typing.textContent += ch; await wait(30); }
    await wait(280);
    typing.textContent = '';
    add(msgs, you(t));
  }
  async function say(t, think = 1000) {
    status.textContent = 'Thinking…';
    const dots = add(msgs, `<div class="msg">${pickle(CAST[0], 30, 'thinking')}<div class="typing"><i></i><i></i><i></i></div></div>`);
    await wait(think);
    dots.outerHTML = bot(t);
    status.textContent = 'Main chat';
    await wait(600);
  }

  try {
    await wait(500);
    await type(SCRIPT.ask);
    await say(SCRIPT.r1);
    await type(SCRIPT.ask2);
    await say(SCRIPT.r2, 900);
    await wait(500);
    // Keeping a memory opens Pickle's profile beside the chat.
    add(msgs, '<div class="msg memory">Saved to Memories</div>');
    body.classList.add('threaded');
    prof.innerHTML = profile([['Likes short, clear answers', 'Oct 27']]);
    await wait(700);
    prof.querySelector('.seg').insertAdjacentHTML('afterend', '<div class="mem">Reads essays before bed<small>Today</small></div>');
    await wait(1200);
    await type(SCRIPT.ask3);
    await say(SCRIPT.r3, 1100);
    await wait(900);
    add(msgs, '<div class="msg memory">10:00 pm</div>');
    await wait(500);
    add(msgs, `<div class="msg alarm">${SCRIPT.alarm}</div>`);
    replay.hidden = false;
  } catch { /* superseded by a newer run */ }
}

if (reduced) staticDemo();
else {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); play(); } }, { threshold: 0.35 });
  io.observe($('app'));
  replay.addEventListener('click', play);
}

// ---------- model marquee ----------
const MODELS = ['Llama 3.2', 'Qwen 3', 'Gemma 3', 'Mistral', 'Phi-4', 'DeepSeek-R1', 'EXAONE', 'Llama 3.1', 'Qwen 2.5', 'Mistral Nemo', 'Gemma 2', 'SmolLM'];
const track = `<div class="track">${MODELS.map((m) => `<span>${m}</span>`).join('')}</div>`;
$('marquee').innerHTML = track + track.replace('class="track"', 'class="track" aria-hidden="true"');

// ---------- flow beams ----------
const beams = $('beams');
const svg = beams.querySelector('svg');
function drawBeams() {
  const box = beams.getBoundingClientRect();
  const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, cx: r.left - box.left + r.width / 2, cy: r.top - box.top + r.height / 2 }; };
  let paths = '';
  let i = 0;
  for (const to of beams.querySelectorAll('[data-from]')) {
    for (const fromId of to.dataset.from.split(' ')) {
      const from = beams.querySelector(`[data-id="${fromId}"]`);
      if (!from) continue;
      const a = rel(from), b = rel(to);
      const d = a.r < b.l
        ? `M${a.r},${a.cy} C${(a.r + b.l) / 2},${a.cy} ${(a.r + b.l) / 2},${b.cy} ${b.l},${b.cy}`
        : `M${a.cx},${a.b} C${a.cx},${(a.b + b.t) / 2} ${b.cx},${(a.b + b.t) / 2} ${b.cx},${b.t}`;
      paths += `<path class="base" d="${d}"/><path class="flow" d="${d}" pathLength="100" style="animation-delay:-${(i++ * 0.53) % 3.4}s"/>`;
    }
  }
  svg.innerHTML = paths;
}
new ResizeObserver(drawBeams).observe(beams);
document.fonts?.ready.then(drawBeams);

// ---------- local request log ----------
const LOG = [
  ['GET /api/models', 'ok', 'ok'],
  ['POST /api/chat · demo', 'demo', ''],
  ['localStorage save · 18 KB', 'saved', 'ok'],
  ['POST /api/chat · ollama', 'ok', 'ok'],
  ['Memory added', 'saved', 'ok'],
  ['Reminder 22:00 due', 'posted', 'ok'],
  ['POST /api/chat from other origin', 'blocked', 'wait'],
  ['Backup exported · 214 KB', 'saved', 'ok'],
  ['Ollama not running', 'failed', 'wait'],
];
const log = $('log');
let n = 0;
let sec = 21 * 3600;
const line = () => {
  const [what, tag, cls] = LOG[n++ % LOG.length];
  sec += 2 + (n % 3) * 3;
  const t = [sec / 3600, (sec / 60) % 60, sec % 60].map((v) => String(Math.floor(v)).padStart(2, '0')).join(':');
  add(log, `<li><time>${t}</time>${pickle(CAST[0], 20)}<code>${what}</code><span class="tag ${cls}">${tag}</span></li>`);
  while (log.children.length > 9) log.firstElementChild.remove();
};
for (let k = 0; k < 7; k++) line();
if (!reduced) setInterval(line, 1800);
