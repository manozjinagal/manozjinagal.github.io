// ═══════════════════════════════════════════════════
// canvas.js — Starfield + Black Hole + Orbit Engine
// ═══════════════════════════════════════════════════

// ── STARFIELD ──────────────────────────────────────
export function initStarfield() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const LAYERS = [
    { n: 60,  spd: .08, max: .7  },
    { n: 100, spd: .25, max: 1.1 },
    { n: 70,  spd: .55, max: 1.7 },
  ];

  let W, H;
  const layers = LAYERS.map(cfg => ({
    ...cfg,
    stars: Array.from({ length: cfg.n }, () => ({
      x:   Math.random() * window.innerWidth,
      y:   Math.random() * window.innerHeight,
      r:   Math.random() * cfg.max + .2,
      tw:  Math.random() * Math.PI * 2,
      col: Math.random() < .07 ? '#e8c87a' : Math.random() < .15 ? '#c8aaff' : '#ddeeff',
    })),
  }));

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let scrollY = 0, targetSY = 0, frame = 0;
  window.addEventListener('scroll', () => targetSY = window.scrollY, { passive: true });

  function draw() {
    scrollY += (targetSY - scrollY) * .07;
    ctx.clearRect(0, 0, W, H);

    layers.forEach(layer => {
      layer.stars.forEach(s => {
        const sy = ((s.y - scrollY * layer.spd) % H + H) % H;
        const tw = Math.sin(s.tw + frame * .018) * .3 + .7;
        ctx.globalAlpha = tw;
        ctx.fillStyle   = s.col;
        ctx.beginPath();
        ctx.arc(s.x, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1) {
          const g = ctx.createRadialGradient(s.x, sy, 0, s.x, sy, s.r * 5);
          g.addColorStop(0, s.col + '55');
          g.addColorStop(1, 'transparent');
          ctx.globalAlpha = tw * .35;
          ctx.fillStyle   = g;
          ctx.beginPath();
          ctx.arc(s.x, sy, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    ctx.globalAlpha = 1;
    frame++;
    requestAnimationFrame(draw);
  }
  draw();

  // Shooting stars
  function shoot() {
    const el  = document.createElement('div');
    const sx  = Math.random() * window.innerWidth * .75;
    const sy  = Math.random() * window.innerHeight * .45;
    const len = Math.random() * 160 + 80;
    const ang = 15 + Math.random() * 22;
    Object.assign(el.style, {
      position: 'fixed', left: sx + 'px', top: sy + 'px',
      width: len + 'px', height: '1px', borderRadius: '1px',
      background: 'linear-gradient(to right,transparent,#fff)',
      transform: `rotate(${ang}deg)`,
      opacity: '1', pointerEvents: 'none', zIndex: '5',
      boxShadow: '0 0 3px white',
      transition: 'transform .7s ease, opacity .7s ease',
    });
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transform = `rotate(${ang}deg) translate(${len + 120}px,${len * .45}px)`;
      el.style.opacity   = '0';
      setTimeout(() => el.remove(), 700);
    }, 40);
  }
  setInterval(shoot, 4000);
}

// ── BLACK HOLE (Interstellar-style) ────────────────
export function initBlackHole() {
  const canvas = document.getElementById('wormhole-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let WW, WH;
  function resize() {
    WW = canvas.width  = canvas.offsetWidth;
    WH = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CX = () => WW * .52, CY = () => WH * .5;
  const CORE = 80;

  const rings = [
    { particles: [], count: 220, rMin: CORE+2,  rMax: CORE+18, spd:  .022, col: ['#fffbe8','#ffd580','#ffaa30'], ell: .18 },
    { particles: [], count: 180, rMin: CORE+8,  rMax: CORE+30, spd: -.018, col: ['#89c4ff','#c0aaff','#ffffff'], ell: .22 },
    { particles: [], count: 120, rMin: CORE+30, rMax: CORE+80, spd:  .008, col: ['#ffcc60','#ff8020','#ffffff'], ell: .15 },
  ];
  rings.forEach(ring => {
    for (let i = 0; i < ring.count; i++) {
      const r = ring.rMin + Math.random() * (ring.rMax - ring.rMin);
      ring.particles.push({
        angle: Math.random() * Math.PI * 2,
        r,
        speed: ring.spd * (CORE / r) * (.7 + Math.random() * .6),
        size:  Math.random() * .6 + .15,
        alpha: Math.random() * .8 + .2,
        col:   ring.col[Math.floor(Math.random() * ring.col.length)],
        ell:   ring.ell,
      });
    }
  });

  function draw() {
    ctx.clearRect(0, 0, WW, WH);
    const cx = CX(), cy = CY();

    // Outer glow
    [[.55, 'rgba(255,180,40,.18)'], [.06, 'rgba(255,100,10,.12)'],[.05,'rgba(137,196,255,.14)']].forEach(([a,c],i)=>{
      const g = ctx.createRadialGradient(cx, cy + (i===2?CORE*.2:-CORE*.3), CORE*.5, cx, cy, CORE*(i===2?2.2:2.8));
      g.addColorStop(0,'transparent'); g.addColorStop(.5,c); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.fillRect(0,0,WW,WH);
    });

    // Far ring behind
    rings[2].particles.forEach(p => {
      p.angle += p.speed;
      const x = cx + Math.cos(p.angle) * p.r;
      const y = cy + Math.sin(p.angle) * p.r * p.ell;
      if (y >= cy) { ctx.globalAlpha = p.alpha * .45; ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI*2); ctx.fill(); }
    });

    // Bottom arc
    rings[1].particles.forEach(p => {
      p.angle += p.speed;
      const x = cx + Math.cos(p.angle) * p.r;
      const y = cy + Math.sin(p.angle) * p.r * p.ell;
      if (y > cy - 4) { const f = Math.min(1,(y-cy+4)/8); ctx.globalAlpha=p.alpha*f*.7; ctx.fillStyle=p.col; ctx.beginPath(); ctx.arc(x,y,p.size,0,Math.PI*2); ctx.fill(); }
    });

    // Event horizon
    ctx.globalAlpha = 1;
    const eh = ctx.createRadialGradient(cx,cy,0,cx,cy,CORE);
    eh.addColorStop(0,'rgba(0,0,0,1)'); eh.addColorStop(.85,'rgba(0,0,0,1)');
    eh.addColorStop(.94,'rgba(2,4,12,1)'); eh.addColorStop(1,'rgba(4,8,20,.98)');
    ctx.fillStyle = eh; ctx.beginPath(); ctx.arc(cx,cy,CORE,0,Math.PI*2); ctx.fill();

    // Photon ring
    ctx.save(); ctx.translate(cx,cy);
    [{ arc:[Math.PI,0], col:['rgba(255,220,100,0)','rgba(255,200,80,.95)','rgba(255,240,160,1)','rgba(255,200,80,.95)','rgba(255,220,100,0)'], ry:6, lw:3 },
     { arc:[0,Math.PI], col:['rgba(137,196,255,0)','rgba(137,196,255,.8)','rgba(220,240,255,.9)','rgba(137,196,255,.8)','rgba(137,196,255,0)'], ry:5, lw:2 }]
    .forEach(ring => {
      ctx.beginPath(); ctx.ellipse(0,0,CORE+3,ring.ry,0,...ring.arc);
      const g = ctx.createLinearGradient(-CORE,0,CORE,0);
      ring.col.forEach((c,i) => g.addColorStop(i/4, c));
      ctx.strokeStyle=g; ctx.lineWidth=ring.lw; ctx.stroke();
    });
    ctx.restore();

    // Top ring
    rings[0].particles.forEach(p => {
      p.angle += p.speed;
      const x = cx + Math.cos(p.angle) * p.r;
      const y = cy + Math.sin(p.angle) * p.r * p.ell;
      if (y <= cy+2) { ctx.globalAlpha=p.alpha*.85; ctx.fillStyle=p.col; ctx.beginPath(); ctx.arc(x,y,p.size,0,Math.PI*2); ctx.fill(); }
    });
    rings[2].particles.forEach(p => {
      const x = cx + Math.cos(p.angle) * p.r;
      const y = cy + Math.sin(p.angle) * p.r * p.ell;
      if (y < cy) { ctx.globalAlpha=p.alpha*.3; ctx.fillStyle=p.col; ctx.beginPath(); ctx.arc(x,y,p.size,0,Math.PI*2); ctx.fill(); }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ── NEBULA PARALLAX ────────────────────────────────
export function initNebula() {
  const el = document.getElementById('nebula');
  if (!el) return;
  window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    el.style.background = `
      radial-gradient(ellipse 90% 70% at ${15+p*25}% ${10+p*35}%,rgba(20,5,45,${.75-p*.25}) 0%,transparent 55%),
      radial-gradient(ellipse 70% 90% at ${85-p*20}% ${80-p*25}%,rgba(8,20,55,${.7-p*.2}) 0%,transparent 55%),
      radial-gradient(ellipse 50% 60% at 50% ${60+p*15}%,rgba(160,100,255,${.04+p*.06}) 0%,transparent 65%)`;
  }, { passive: true });
}

// ── ORBIT ENGINE ───────────────────────────────────
// Full 3D side-view orbit with brand icons + debris
export function initOrbit(socials) {
  const wrap   = document.getElementById('orbit-wrap');
  const canvas = document.getElementById('orbit-canvas');
  if (!wrap || !canvas) return;
  const ctx = canvas.getContext('2d');

  // Brand icon drawers
  const icons = {
    github(ctx, x, y, s, a) {
      ctx.save(); ctx.translate(x-s/2,y-s/2); ctx.scale(s/24,s/24); ctx.globalAlpha=a; ctx.fillStyle='#fff';
      ctx.fill(new Path2D('M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.02c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.32-1.74-1.32-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.22 1.83 1.22 1.06 1.82 2.78 1.3 3.46 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.3.47-2.38 1.22-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.22a11.5 11.5 0 0 1 6 0C17.3 4.78 18.3 5.1 18.3 5.1c.65 1.66.24 2.88.12 3.18.76.84 1.22 1.92 1.22 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z'));
      ctx.restore();
    },
    instagram(ctx, x, y, s, a) {
      ctx.save(); ctx.translate(x-s/2,y-s/2); ctx.scale(s/24,s/24); ctx.globalAlpha=a;
      const g = ctx.createLinearGradient(0,24,24,0);
      ['#f09433','#e6683c','#dc2743','#cc2366','#bc1888'].forEach((c,i)=>g.addColorStop(i/4,c));
      ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(0,0,24,24,5); ctx.fill();
      ctx.strokeStyle='#fff'; ctx.fillStyle='#fff'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(3,3,18,18,4); ctx.stroke();
      ctx.beginPath(); ctx.arc(12,12,4.5,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(17.5,6.5,1.2,0,Math.PI*2); ctx.fill();
      ctx.restore();
    },
    whatsapp(ctx, x, y, s, a) {
      ctx.save(); ctx.translate(x-s/2,y-s/2); ctx.scale(s/24,s/24); ctx.globalAlpha=a;
      ctx.fillStyle='#25d366'; ctx.beginPath(); ctx.arc(12,12,12,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff';
      ctx.fill(new Path2D('M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.5.7.3 1.25.48 1.68.62.7.22 1.35.19 1.85.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.3.17-1.41-.07-.12-.27-.2-.57-.35z'));
      ctx.restore();
    },
    linkedin(ctx, x, y, s, a) {
      ctx.save(); ctx.translate(x-s/2,y-s/2); ctx.scale(s/24,s/24); ctx.globalAlpha=a;
      ctx.fillStyle='#0a66c2'; ctx.beginPath(); ctx.roundRect(0,0,24,24,4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='bold 14px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('in',12,13);
      ctx.restore();
    },
    email(ctx, x, y, s, a) {
      ctx.save(); ctx.translate(x-s/2,y-s/2); ctx.scale(s/24,s/24); ctx.globalAlpha=a;
      ctx.fillStyle='#ff6030'; ctx.beginPath(); ctx.roundRect(0,3,24,18,3); ctx.fill();
      ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(2,5); ctx.lineTo(12,13); ctx.lineTo(22,5); ctx.stroke();
      ctx.restore();
    },
    leetcode(ctx, x, y, s, a) {
      ctx.save(); ctx.translate(x-s/2,y-s/2); ctx.scale(s/24,s/24); ctx.globalAlpha=a;
      ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.roundRect(0,0,24,24,4); ctx.fill();
      ctx.strokeStyle='#ffa116'; ctx.lineWidth=2; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(8,5); ctx.lineTo(4,12); ctx.lineTo(8,19); ctx.stroke();
      ctx.strokeStyle='#fff';
      ctx.beginPath(); ctx.moveTo(14,8); ctx.lineTo(20,12); ctx.lineTo(14,16); ctx.stroke();
      ctx.restore();
    },
    phone(ctx, x, y, s, a) {
      ctx.save(); ctx.translate(x-s/2,y-s/2); ctx.scale(s/24,s/24); ctx.globalAlpha=a;
      ctx.fillStyle='rgba(137,196,255,0.15)'; ctx.beginPath(); ctx.arc(12,12,12,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#89c4ff'; ctx.lineWidth=1.5;
      ctx.fill(new Path2D('M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z'));
      ctx.restore();
    },
  };

  const iconMap = { github:'github', instagram:'instagram', whatsapp:'whatsapp', linkedin:'linkedin', email:'email', leetcode:'leetcode', phone:'phone' };

  // Debris
  const debris = [
    { type:'asteroid', ring:4, phase:.8,         speed:.12,  seed:.3  },
    { type:'asteroid', ring:4, phase:Math.PI,     speed:.12,  seed:.7  },
    { type:'asteroid', ring:4, phase:Math.PI*1.5, speed:.12,  seed:.1  },
    { type:'satdish',  ring:5, phase:.2,          speed:-.08           },
    { type:'station',  ring:5, phase:Math.PI*.7,  speed:-.08           },
    { type:'comet',    ring:4, phase:Math.PI*.4,  speed:.15            },
    { type:'ufo',      ring:5, phase:Math.PI*1.3, speed:.07            },
    { type:'asteroid', ring:6, phase:1.1,         speed:.05,  seed:.5  },
    { type:'comet',    ring:6, phase:Math.PI*.9,  speed:-.05           },
  ];

  const orbits = [
    { rx:108, tilt:.20 }, { rx:186, tilt:.18 }, { rx:252, tilt:.16 },
    { rx:310, tilt:.14 }, { rx:358, tilt:.13 }, { rx:400, tilt:.12 }, { rx:440, tilt:.11 },
  ];

  // Click overlays
  const hitDivs = socials.map((s,i) => {
    let el = document.getElementById(`so-${i}`);
    if (!el) { el = document.createElement('div'); el.id = `so-${i}`; el.className = 'sat-hit'; wrap.appendChild(el); }
    el.addEventListener('click', () => {
      const href = s.href;
      if (href.startsWith('http') || href.startsWith('https')) window.open(href, '_blank');
      else window.location.href = href;
    });
    return el;
  });

  const satAngles    = socials.map(s => s.phase);
  const debrisAngles = debris.map(d => d.phase);
  let lastTime = null, nsTime = 0;

  // Filaments + flares for the red giant star
  const filaments = Array.from({length:55},()=>({
    angle:Math.random()*Math.PI*2, radius:.05+Math.random()*.88,
    length:.08+Math.random()*.45, curve:(Math.random()-.5)*1.4,
    width:.3+Math.random()*1.8, speed:(Math.random()-.5)*.006,
    alpha:.25+Math.random()*.65, phase:Math.random()*Math.PI*2,
    warm:Math.random(),
  }));
  const flares = Array.from({length:22},()=>({
    angle:Math.random()*Math.PI*2, dist:1.0+Math.random()*.45,
    size:1.2+Math.random()*3.5, speed:.002+Math.random()*.01,
    alpha:.35+Math.random()*.55, phase:Math.random()*Math.PI*2,
    wander:.03+Math.random()*.1,
  }));

  let CW, CH, CX, CY;
  function resize() {
    CW = canvas.width  = wrap.offsetWidth;
    CH = canvas.height = wrap.offsetHeight;
    CX = CW / 2; CY = CH / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawStar() {
    nsTime += .014;
    const r = 48;

    // Corona
    const cg = ctx.createRadialGradient(CX,CY,r*1.05,CX,CY,r*5.2);
    cg.addColorStop(0,'rgba(200,35,0,.28)'); cg.addColorStop(.18,'rgba(150,18,0,.18)');
    cg.addColorStop(.4,'rgba(100,10,0,.10)'); cg.addColorStop(.7,'rgba(60,5,0,.04)'); cg.addColorStop(1,'transparent');
    ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(CX,CY,r*5.2,0,Math.PI*2); ctx.fill();

    // Near glow
    const pulse=.87+Math.sin(nsTime*1.9)*.13;
    const ng=ctx.createRadialGradient(CX,CY,r*.85,CX,CY,r*2.1*pulse);
    ng.addColorStop(0,'rgba(255,130,0,.65)'); ng.addColorStop(.3,'rgba(220,55,0,.35)');
    ng.addColorStop(.65,'rgba(150,20,0,.14)'); ng.addColorStop(1,'transparent');
    ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(CX,CY,r*2.1*pulse,0,Math.PI*2); ctx.fill();

    // Flares
    flares.forEach(f=>{
      f.angle+=f.speed;
      const a=f.alpha*(0.5+Math.sin(nsTime*4+f.phase)*.5);
      const d=r*(f.dist+Math.sin(nsTime*3+f.phase)*f.wander);
      const fx=CX+Math.cos(f.angle)*d, fy=CY+Math.sin(f.angle)*d;
      const fg=ctx.createRadialGradient(fx,fy,0,fx,fy,f.size*3);
      fg.addColorStop(0,`rgba(255,210,80,${a})`); fg.addColorStop(.35,`rgba(255,100,10,${a*.6})`); fg.addColorStop(1,'transparent');
      ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(fx,fy,f.size*3,0,Math.PI*2); ctx.fill();
    });

    // Star base
    const sg=ctx.createRadialGradient(CX-r*.1,CY-r*.12,0,CX,CY,r);
    ['#fff0a0','#ffcc00','#ff8800','#ff4400','#dd1c00','#b01000','#880a00','#660500']
      .forEach((c,i,arr)=>sg.addColorStop(i/(arr.length-1),c));
    ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(CX,CY,r,0,Math.PI*2); ctx.fill();

    // Filaments
    ctx.save(); ctx.beginPath(); ctx.arc(CX,CY,r,0,Math.PI*2); ctx.clip();
    filaments.forEach(fil=>{
      fil.angle+=fil.speed;
      const flicker=Math.max(0,Math.sin(nsTime*4.8+fil.phase));
      if(flicker<.08) return;
      const alpha=fil.alpha*flicker;
      const x0=CX+Math.cos(fil.angle)*r*fil.radius, y0=CY+Math.sin(fil.angle)*r*fil.radius;
      const ea=fil.angle+fil.curve, er=Math.min(.98,fil.radius+fil.length);
      const x2=CX+Math.cos(ea)*r*er, y2=CY+Math.sin(ea)*r*er;
      const ma=(fil.angle+ea)/2+.5, mr=(fil.radius+er)/2;
      const x1=CX+Math.cos(ma)*r*mr, y1=CY+Math.sin(ma)*r*mr;
      const g2=Math.round(170+fil.warm*85+flicker*40), b2=Math.round(flicker*80*(1-fil.warm));
      ctx.strokeStyle=`rgba(255,${g2},${b2},${alpha})`;
      ctx.lineWidth=fil.width*(.5+flicker*.5); ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(x0,y0); ctx.quadraticCurveTo(x1,y1,x2,y2); ctx.stroke();
    });
    ctx.restore();

    // Convection cells
    ctx.save(); ctx.beginPath(); ctx.arc(CX,CY,r,0,Math.PI*2); ctx.clip();
    for(let ci=0;ci<9;ci++){
      const ca=nsTime*.25+ci*(Math.PI*2/9), cdr=r*(.15+(ci%4)*.18);
      const cx_=CX+Math.cos(ca)*cdr, cy_=CY+Math.sin(ca)*cdr;
      const cr=r*(.18+(ci%3)*.14), cp=.6+Math.sin(nsTime*3.2+ci*1.7)*.4;
      const ccg=ctx.createRadialGradient(cx_,cy_,0,cx_,cy_,cr*cp);
      ccg.addColorStop(0,`rgba(255,170,20,${.14*cp})`); ccg.addColorStop(.5,`rgba(200,50,0,${.07*cp})`); ccg.addColorStop(1,'transparent');
      ctx.fillStyle=ccg; ctx.beginPath(); ctx.arc(cx_,cy_,cr*cp,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // Hotspot
    const hs=ctx.createRadialGradient(CX,CY,0,CX,CY,r*.48);
    hs.addColorStop(0,`rgba(255,255,200,${.50+Math.sin(nsTime*2.8)*.18})`); hs.addColorStop(.45,'rgba(255,200,60,.22)'); hs.addColorStop(1,'transparent');
    ctx.fillStyle=hs; ctx.beginPath(); ctx.arc(CX,CY,r*.48,0,Math.PI*2); ctx.fill();

    // Limb darkening
    const ld=ctx.createRadialGradient(CX,CY,r*.58,CX,CY,r);
    ld.addColorStop(0,'transparent'); ld.addColorStop(.65,'rgba(50,4,0,.06)');
    ld.addColorStop(.88,'rgba(25,2,0,.28)'); ld.addColorStop(1,'rgba(10,0,0,.55)');
    ctx.fillStyle=ld; ctx.beginPath(); ctx.arc(CX,CY,r,0,Math.PI*2); ctx.fill();
  }

  function drawDebris(d, x, y, depth, angle) {
    const f = (depth+1)/2;
    const a = (.15+f*.5)*.85, sc = 10*(.5+f*.5);
    const pR = 48;
    if (depth < -.05 && Math.hypot(x-CX,y-CY) < pR*1.05) return;
    ctx.save();
    switch(d.type) {
      case 'asteroid': {
        ctx.translate(x,y); ctx.rotate((d.seed||.5)*2.4); ctx.globalAlpha=a*.7;
        ctx.fillStyle=`hsl(${210+(d.seed||.5)*30},20%,${35+(d.seed||.5)*15}%)`;
        ctx.strokeStyle=`rgba(180,200,255,${a*.5})`; ctx.lineWidth=.5;
        const pts=6+Math.floor((d.seed||.5)*3);
        ctx.beginPath();
        for(let i=0;i<pts;i++){const ang=i/pts*Math.PI*2,r=(sc*.4)*(.7+(((d.seed||.5)*7+i*3)%10)/10*.5);i===0?ctx.moveTo(Math.cos(ang)*r,Math.sin(ang)*r):ctx.lineTo(Math.cos(ang)*r,Math.sin(ang)*r);}
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }
      case 'satdish': {
        ctx.translate(x,y); ctx.globalAlpha=a*.8;
        ctx.strokeStyle=`rgba(137,196,255,${a})`; ctx.fillStyle=`rgba(30,60,120,${a*.6})`; ctx.lineWidth=1;
        const rd=sc*.42;
        ctx.beginPath(); ctx.arc(0,0,rd,Math.PI,0); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,rd*.9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-rd*.4,rd*.9); ctx.lineTo(rd*.4,rd*.9); ctx.stroke();
        ctx.beginPath(); ctx.arc(0,-rd*.1,2,0,Math.PI*2); ctx.fillStyle=`rgba(137,196,255,${a})`; ctx.fill();
        break;
      }
      case 'station': {
        ctx.translate(x,y); ctx.globalAlpha=a*.75;
        ctx.strokeStyle=`rgba(200,220,255,${a*.8})`; ctx.fillStyle=`rgba(20,40,100,${a*.5})`; ctx.lineWidth=1;
        const rs=sc*.35;
        ctx.beginPath(); ctx.rect(-rs*.35,-rs*.35,rs*.7,rs*.7); ctx.fill(); ctx.stroke();
        ctx.fillStyle=`rgba(30,80,200,${a*.6})`;
        [[-rs*1.1,-rs*.15],[rs*.45,-rs*.15]].forEach(([bx])=>{ctx.beginPath();ctx.rect(bx,-rs*.15,rs*.65,rs*.3);ctx.fill();ctx.stroke();});
        break;
      }
      case 'comet': {
        ctx.translate(x,y); ctx.rotate(angle+Math.PI); ctx.globalAlpha=a;
        const tg=ctx.createLinearGradient(0,0,sc*1.4,0);
        tg.addColorStop(0,`rgba(200,230,255,${a*.6})`); tg.addColorStop(1,'transparent');
        ctx.fillStyle=tg; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(sc*1.4,-sc*.12); ctx.lineTo(sc*1.4,sc*.12); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(0,0,sc*.22,0,Math.PI*2); ctx.fillStyle=`rgba(220,240,255,${a})`; ctx.fill();
        break;
      }
      case 'ufo': {
        ctx.translate(x,y); ctx.globalAlpha=a*.8;
        ctx.beginPath(); ctx.ellipse(0,2,sc*.45,sc*.18,0,0,Math.PI*2);
        ctx.fillStyle=`rgba(180,200,255,${a*.5})`; ctx.strokeStyle=`rgba(200,220,255,${a*.8})`; ctx.lineWidth=.8;
        ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0,0,sc*.22,sc*.22,0,Math.PI,0);
        ctx.fillStyle=`rgba(100,160,255,${a*.4})`; ctx.fill(); ctx.stroke();
        [-sc*.25,0,sc*.25].forEach((lx,i)=>{ctx.beginPath();ctx.arc(lx,sc*.12,1.5,0,Math.PI*2);ctx.fillStyle=i===1?`rgba(255,220,50,${a})`:`rgba(50,200,255,${a})`;ctx.fill();});
        break;
      }
    }
    ctx.restore();
  }

  function drawSat(sat, x, y, depth, idx) {
    const f = (depth+1)/2;
    const r = 24*(.45+f*.55), alpha=.25+f*.75, gA=.06+f*.5;
    const pR = 48;
    if (depth < -.05 && Math.hypot(x-CX,y-CY) < pR*1.1) return;
    ctx.save();
    const grd = ctx.createRadialGradient(x,y,r*.2,x,y,r*2.8);
    grd.addColorStop(0, sat.glow.replace('.5',String(gA))); grd.addColorStop(1,'transparent');
    ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(x,y,r*2.8,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=alpha;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=`rgba(8,16,40,${.5+f*.3})`; ctx.fill();
    ctx.strokeStyle=sat.color.replace('1)',`${.25+f*.7})`); ctx.lineWidth=1; ctx.stroke();
    const fnKey = iconMap[sat.id] || 'github';
    icons[fnKey]?.(ctx, x, y, r*1.15, alpha);
    if (f > .4) {
      const la = Math.max(0,(f-.4)/.6)*alpha;
      ctx.globalAlpha=la;
      ctx.font=`${Math.max(7,Math.round(8*f))}px 'Space Mono',monospace`;
      ctx.fillStyle=sat.color; ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText(sat.label.toUpperCase(), x, y+r+5);
    }
    ctx.restore();
    const ov = hitDivs[idx];
    if (ov) { ov.style.left=x+'px'; ov.style.top=y+'px'; ov.style.width=(r*2)+'px'; ov.style.height=(r*2)+'px'; ov.style.opacity=f>.15?'1':'0'; }
  }

  function frame(ts) {
    if (!lastTime) lastTime = ts;
    const dt = Math.min((ts-lastTime)/1000, .05);
    lastTime = ts;
    ctx.clearRect(0,0,CW,CH);

    satAngles.forEach((_,i) => satAngles[i] += socials[i].speed*dt);
    debrisAngles.forEach((_,i) => debrisAngles[i] += debris[i].speed*dt);

    const satPos = socials.map((s,i)=>({ x:CX+orbits[s.ring].rx*Math.cos(satAngles[i]), y:CY+orbits[s.ring].rx*orbits[s.ring].tilt*Math.sin(satAngles[i]), depth:Math.sin(satAngles[i]), s, i }));
    const debPos = debris.map((d,i)=>({ x:CX+orbits[d.ring].rx*Math.cos(debrisAngles[i]), y:CY+orbits[d.ring].rx*orbits[d.ring].tilt*Math.sin(debrisAngles[i]), depth:Math.sin(debrisAngles[i]), d, angle:debrisAngles[i] }));

    // Back orbit rings
    orbits.forEach(o=>{ ctx.beginPath(); ctx.ellipse(CX,CY,o.rx,o.rx*o.tilt,0,Math.PI,Math.PI*2); ctx.strokeStyle='rgba(137,196,255,.10)'; ctx.setLineDash([2,6]); ctx.lineWidth=1; ctx.stroke(); ctx.setLineDash([]); });

    // Back items
    [...satPos.filter(p=>p.depth<0).map(p=>({...p,_t:'sat'})), ...debPos.filter(p=>p.depth<0).map(p=>({...p,_t:'deb'}))]
      .sort((a,b)=>a.depth-b.depth)
      .forEach(p => p._t==='sat' ? drawSat(p.s,p.x,p.y,p.depth,p.i) : drawDebris(p.d,p.x,p.y,p.depth,p.angle));

    // Star
    drawStar();

    // Front rings
    orbits.forEach(o=>{ ctx.beginPath(); ctx.ellipse(CX,CY,o.rx,o.rx*o.tilt,0,0,Math.PI); ctx.strokeStyle='rgba(137,196,255,.18)'; ctx.lineWidth=1; ctx.stroke(); });

    // Front items
    [...satPos.filter(p=>p.depth>=0).map(p=>({...p,_t:'sat'})), ...debPos.filter(p=>p.depth>=0).map(p=>({...p,_t:'deb'}))]
      .sort((a,b)=>a.depth-b.depth)
      .forEach(p => p._t==='sat' ? drawSat(p.s,p.x,p.y,p.depth,p.i) : drawDebris(p.d,p.x,p.y,p.depth,p.angle));

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
