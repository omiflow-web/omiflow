import type { CleanedLead } from '../types'

const PHOTOS: Record<string, string> = {
  dental: 'photo-1598256989861-8ad3d4641e82',
  physio: 'photo-1576091160550-2173dba999ef',
  salon: 'photo-1560066984-138dadb4c035',
  hair: 'photo-1560066984-138dadb4c035',
  barber: 'photo-1503951914875-452162b0f3f1',
  builder: 'photo-1504307651254-35680f356dfd',
  plumb: 'photo-1581578731548-c64695cc6952',
  kitchen: 'photo-1556909114-f6e7ad7d3136',
  electri: 'photo-1621905252507-b35492cc74b4',
  roofer: 'photo-1504307651254-35680f356dfd',
  landscap: 'photo-1416879595882-3373a0480b5b',
  photo: 'photo-1554080353-a576cf803bda',
  wedding: 'photo-1511285560929-80b456fea0bc',
  tattoo: 'photo-1598371839696-5c5bb00bdc28',
  video: 'photo-1601506521937-0121a7fc2a6b',
  solicit: 'photo-1589829545856-d10d557cf95f',
  legal: 'photo-1589829545856-d10d557cf95f',
  financial: 'photo-1553877522-43269d4ea984',
  mortgage: 'photo-1553877522-43269d4ea984',
  estate: 'photo-1560518883-ce09059eeffa',
  spa: 'photo-1519823551278-64ac92734fb1',
  aesthet: 'photo-1519823551278-64ac92734fb1',
  botox: 'photo-1519823551278-64ac92734fb1',
  default: 'photo-1497366216548-37526070297c',
}

function getPhoto(niche: string): string {
  const n = niche.toLowerCase()
  for (const [key, id] of Object.entries(PHOTOS)) {
    if (n.includes(key)) return id
  }
  return PHOTOS.default
}

function imgUrl(id: string, w = 1400): string {
  return `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`
}

const TEMPLATE_PRO_SERVICES = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="referrer" content="no-referrer">
<title>{{BUSINESS_NAME}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --p:#1a3a5c;
  --a:#2563eb;
  --bg:#fdfcf9;
  --cream:#f5f0e8;
  --warm:#ede5d8;
  --text:#1c1a18;
  --mid:#6b6560;
  --soft:#a09890;
  --border:#e4ddd2;
  --fd:'Playfair Display',Georgia,serif;
  --fb:'Plus Jakarta Sans',system-ui,sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--bg);color:var(--text);font-family:var(--fb);line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{display:block;width:100%;object-fit:cover}
a{text-decoration:none;color:inherit}

/* DEMO BAR */
.db{position:fixed;top:0;left:0;right:0;z-index:300;background:#111;color:#c8f155;font-family:var(--fb);font-size:11px;text-align:center;padding:7px 16px;display:flex;align-items:center;justify-content:center;gap:10px}
.db-dot{width:5px;height:5px;border-radius:50%;background:#c8f155;animation:blink 2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
.db a{color:#c8f155;border-bottom:1px solid rgba(200,241,85,.4)}

/* NAV */
nav{position:fixed;top:30px;left:0;right:0;z-index:200;padding:0 60px;height:62px;display:flex;align-items:center;justify-content:space-between;transition:all .3s}
nav.scrolled{background:rgba(253,252,249,.97);backdrop-filter:blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.12)}
.nav-logo{font-family:var(--fd);font-size:19px;font-weight:500;color:#fff;transition:color .3s;letter-spacing:-.01em}
nav.scrolled .nav-logo{color:var(--text)}
.nav-links{display:flex;align-items:center;gap:32px;list-style:none}
.nav-links a{font-size:13px;font-weight:400;color:rgba(255,255,255,.7);transition:color .2s}
nav.scrolled .nav-links a{color:var(--mid)}
.nav-links a:hover{color:#fff}
nav.scrolled .nav-links a:hover{color:var(--text)}
.nav-btn{background:rgba(255,255,255,.15)!important;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.3)!important;color:#fff!important;padding:10px 24px;border-radius:100px;font-size:12px;font-weight:600;transition:all .2s!important}
nav.scrolled .nav-btn{background:var(--p)!important;border-color:transparent!important;color:#fff!important}
.burger{display:none;flex-direction:column;gap:5px;cursor:pointer}
.burger span{display:block;width:22px;height:1.5px;background:#fff;transition:background .3s}
nav.scrolled .burger span{background:var(--text)}
.mmenu{display:none;position:fixed;top:30px;left:0;right:0;bottom:0;background:var(--bg);z-index:199;padding:80px 32px 40px;flex-direction:column}
.mmenu.open{display:flex}
.mmenu a{font-family:var(--fd);font-size:30px;font-style:italic;color:var(--text);padding:13px 0;border-bottom:1px solid var(--border)}
.mmenu .mb{margin-top:24px;background:var(--p);color:#fff;text-align:center;padding:16px;border-radius:100px;font-size:13px;font-weight:600;border-bottom:none!important;display:block;font-family:var(--fb)}

/* ── HERO: full-bleed photo, text left, glass overlays right ─────────── */
.hero{min-height:100vh;position:relative;display:flex;align-items:center;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-bg img{height:100%;width:100%;object-position:center}
.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(12,10,8,.88) 0%,rgba(12,10,8,.6) 50%,rgba(12,10,8,.18) 100%)}
.hero-l{position:relative;z-index:2;padding:0 56px 0 80px;max-width:600px;padding-top:92px}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.22);border-radius:100px;padding:7px 16px 7px 10px;font-size:11px;font-weight:500;color:rgba(255,255,255,.88);margin-bottom:24px;letter-spacing:.04em;opacity:0;animation:fu .7s ease forwards .1s}
.badge-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px rgba(74,222,128,.8)}
.typewriter{white-space:nowrap}
.hero-h1{font-family:var(--fd);font-size:clamp(40px,4.5vw,66px);font-weight:500;line-height:1.08;color:#fff;margin-bottom:18px;opacity:0;animation:fu .7s ease forwards .25s}
.hero-h1 em{font-style:italic;color:#fde68a}
.hero-sub{font-size:16px;font-weight:300;color:rgba(255,255,255,.62);line-height:1.78;max-width:420px;margin-bottom:32px;opacity:0;animation:fu .7s ease forwards .4s}
.hero-btns{display:flex;gap:12px;align-items:center;flex-wrap:wrap;opacity:0;animation:fu .7s ease forwards .55s}
.btn-primary{display:inline-flex;align-items:center;background:#fff;color:var(--text);padding:13px 28px;border-radius:100px;font-size:12px;font-weight:700;transition:all .2s;white-space:nowrap}
.btn-primary:hover{background:var(--cream);transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.25)}
.btn-outline{display:inline-flex;align-items:center;color:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.3);padding:12px 24px;border-radius:100px;font-size:12px;font-weight:400;transition:all .2s;white-space:nowrap}
.btn-outline:hover{border-color:rgba(255,255,255,.7);color:#fff}
.hero-trust{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px;opacity:0;animation:fu .7s ease forwards .7s}
.trust-tag{font-size:11px;font-weight:400;padding:5px 13px;background:rgba(255,255,255,.1);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.16);border-radius:100px;color:rgba(255,255,255,.72)}
/* glass stat cards — right side */
.hero-stats{position:absolute;right:60px;bottom:56px;z-index:2;display:flex;flex-direction:column;gap:12px;opacity:0;animation:fu .7s ease forwards .85s}
.hs-card{background:rgba(255,255,255,.13);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.22);border-radius:18px;padding:16px 22px;min-width:164px}
.hs-n{font-family:var(--fd);font-size:28px;font-style:italic;color:#fff;line-height:1;margin-bottom:3px}
.hs-l{font-size:10px;font-weight:400;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.52)}

/* ── STATS STRIP ──────────────────────────────────────────────────────── */
.stats-strip{background:var(--cream);display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--border)}
.ss{padding:28px 40px;border-right:1px solid var(--border);text-align:center}
.ss:last-child{border-right:none}
.ss-n{font-family:var(--fd);font-size:36px;font-style:italic;color:var(--p);line-height:1;margin-bottom:4px}
.ss-l{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--soft)}

/* ── SHARED SECTION STYLES ────────────────────────────────────────────── */
.section{padding:96px 80px}
.stag{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--p);margin-bottom:16px}
.stag::before{content:'';width:20px;height:2px;background:var(--p);border-radius:2px}
.sh2{font-family:var(--fd);font-size:clamp(30px,3.5vw,46px);font-weight:500;line-height:1.12;color:var(--text);margin-bottom:16px}
.sh2 em{font-style:italic;font-weight:400}
.body-txt{font-size:15px;font-weight:300;color:var(--mid);line-height:1.85;max-width:520px}

/* ── SERVICES ─────────────────────────────────────────────────────────── */
.services-sec{background:var(--bg)}
.svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);margin-top:52px;border-radius:18px;overflow:hidden}
.svc{background:var(--bg);padding:40px 32px 110px;transition:background .25s;position:relative;overflow:hidden;min-height:380px}
.svc::after{content:attr(data-n);position:absolute;bottom:16px;right:16px;font-family:var(--fd);font-size:80px;font-style:italic;color:rgba(0,0,0,.04);line-height:1;pointer-events:none;transition:color .3s}
.svc:hover{background:var(--cream)}
.svc:hover::after{color:rgba(0,0,0,.07)}
.svc-bar{width:24px;height:3px;background:var(--p);border-radius:100px;margin-bottom:20px;transition:width .3s}
.svc:hover .svc-bar{width:44px}
.svc-n{font-family:var(--fd);font-size:11px;font-style:italic;color:var(--p);margin-bottom:8px;letter-spacing:.06em}
.svc-title{font-family:var(--fd);font-size:23px;font-weight:500;color:var(--text);margin-bottom:12px;line-height:1.2}
.svc-desc{font-size:14px;font-weight:300;color:var(--mid);line-height:1.8}

/* ── ABOUT: image bleeds edge, text beside ────────────────────────────── */
.about-sec{position:relative;overflow:hidden;min-height:600px;display:flex;align-items:center}
.about-bg{position:absolute;inset:0;z-index:0}
.about-bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(.38)}
.about-grid{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:center;width:100%}
.about-img{display:flex;align-items:center;justify-content:center;padding:64px 48px}
.about-float-card{width:100%;max-width:380px;border-radius:24px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.45);aspect-ratio:4/3;position:relative}
.about-float-card img{width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
.about-float-card:hover img{transform:scale(1.04)}
.about-txt{padding:80px 72px 80px 32px;display:flex;flex-direction:column;justify-content:center}

/* ── PROCESS: dark section ────────────────────────────────────────────── */
.process-sec{background:var(--text);padding:100px 80px 0}
.process-sec .stag{color:rgba(255,255,255,.38)}
.process-sec .stag::before{background:rgba(255,255,255,.2)}
.process-sec .sh2{color:#fff}
.ps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.07);margin-top:52px}
.ps{background:var(--text);padding:56px 36px 64px;transition:background .3s;min-height:320px;display:flex;flex-direction:column}
.ps:hover{background:#1e2a38}
.ps-num{font-family:var(--fd);font-size:96px;font-style:italic;color:rgba(255,255,255,.07);line-height:1;margin-bottom:28px;transition:color .3s;display:block}
.ps:hover .ps-num{color:rgba(255,255,255,.14)}
.ps-title{font-size:17px;font-weight:600;color:#fff;margin-bottom:10px;font-family:var(--fd);font-size:21px;font-style:italic;font-weight:400}
.ps-desc{font-size:14px;font-weight:300;color:rgba(255,255,255,.45);line-height:1.8;margin-top:auto;padding-top:16px}

/* ── REVIEWS: cream bg, glass cards ──────────────────────────────────── */
.reviews-sec{background:var(--cream)}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:52px}
.r-card{background:rgba(255,255,255,.75);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.95);border-radius:20px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.06);transition:transform .25s,box-shadow .25s;position:relative}
.r-card:hover{transform:translateY(-4px);box-shadow:0 14px 40px rgba(0,0,0,.1)}
.r-quote{font-family:var(--fd);font-size:44px;line-height:1;color:var(--p);opacity:.28;margin-bottom:-4px}
.r-stars{display:flex;gap:3px;margin-bottom:12px}
.r-star{color:#f59e0b;font-size:12px}
.r-text{font-family:var(--fd);font-size:18px;font-style:italic;color:var(--text);line-height:1.55;margin-bottom:16px}
.r-author{font-size:12px;font-weight:600;color:var(--p);letter-spacing:.04em}

/* ── CONTACT ──────────────────────────────────────────────────────────── */
.contact-sec{background:var(--bg)}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;max-width:1060px;margin:0 auto;align-items:start}
.cform{background:var(--cream);border-radius:20px;padding:40px;border:1px solid var(--border)}
.cform-title{font-family:var(--fd);font-size:22px;font-style:italic;color:var(--text);margin-bottom:26px}
.fg{margin-bottom:13px}
.fl{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mid);display:block;margin-bottom:5px}
.fi{width:100%;padding:12px 16px;border:1.5px solid var(--border);border-radius:10px;font-family:var(--fb);font-size:13px;color:var(--text);background:#fff;outline:none;font-weight:300;transition:border-color .2s}
.fi:focus{border-color:var(--p)}
.fi::placeholder{color:var(--warm)}
textarea.fi{resize:none}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fsub{width:100%;padding:14px;background:var(--p);color:#fff;border:none;border-radius:100px;font-family:var(--fb);font-size:13px;font-weight:600;cursor:pointer;margin-top:8px;transition:all .2s}
.fsub:hover{opacity:.88;transform:translateY(-1px)}
.cdetails{}
.cdetail{padding:18px 0;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:4px}
.cdetail:first-child{border-top:1px solid var(--border)}
.cdl{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--p)}
.cdv{font-family:var(--fd);font-size:18px;color:var(--text)}

/* ── FOOTER ───────────────────────────────────────────────────────────── */
footer{background:var(--text);padding:52px 80px 28px}
.ft{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:20px;gap:32px;flex-wrap:wrap}
.flogo{font-family:var(--fd);font-size:20px;font-style:italic;color:#fff;margin-bottom:4px}
.ftag{font-size:12px;font-weight:300;color:rgba(255,255,255,.28)}
.fnav{display:flex;gap:24px;flex-wrap:wrap}
.fnav a{font-size:12px;color:rgba(255,255,255,.32);transition:color .2s}
.fnav a:hover{color:#fff}
.fbot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:11px;color:rgba(255,255,255,.2)}
.fcredit a{color:#c8f155;border-bottom:1px solid rgba(200,241,85,.3);padding-bottom:1px}

/* ── REVEAL ANIMATIONS ───────────────────────────────────────────────── */
.rv{opacity:0;transform:translateY(18px);transition:opacity .65s ease,transform .65s ease}
.rv.on{opacity:1;transform:none}
.d1{transition-delay:.07s}.d2{transition-delay:.14s}.d3{transition-delay:.21s}.d4{transition-delay:.28s}

/* ── RESPONSIVE ──────────────────────────────────────────────────────── */
@media(max-width:900px){
  nav{padding:0 24px}
  .nav-links{display:none}
  .burger{display:flex}
  .hero{min-height:100svh}
  .hero-l{padding:108px 24px 56px;max-width:100%}
  .hero-btns{gap:8px}
  .hero-trust{gap:6px}
  .hero-stats{right:16px;bottom:28px}
  .hs-card{min-width:130px;padding:12px 16px}
  .stats-strip{grid-template-columns:1fr}
  .ss{border-right:none;border-bottom:1px solid var(--border);padding:18px 24px}
  .section{padding:64px 24px}
  .svc-grid{grid-template-columns:1fr;border-radius:12px}
  .about-grid{grid-template-columns:1fr}
  .about-img{padding:32px 24px}
  .about-float-card{max-width:85%}
  .about-txt{padding:8px 24px 48px}
  .process-sec{padding:64px 24px}
  .ps-grid{grid-template-columns:1fr 1fr}
  .reviews-grid{grid-template-columns:1fr;gap:14px}
  .contact-grid{grid-template-columns:1fr;gap:40px}
  footer{padding:40px 24px 24px}
  .ft{flex-direction:column;gap:12px}
}
@media(max-width:480px){
  .frow{grid-template-columns:1fr}
  .ps-grid{grid-template-columns:1fr}
  .hero-stats{display:none}
}
@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
</style>
</head>
<body>

<div class="db"><div class="db-dot"></div>Demo preview by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a>&nbsp;·&nbsp;Your site, rebuilt&nbsp;·&nbsp;<a href="https://www.omiflow.co.uk" target="_blank">See our work →</a></div>

<nav id="nav">
  <div class="nav-logo">{{BUSINESS_NAME}}</div>
  <ul class="nav-links">
    <li><a href="#services">Services</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#reviews">Reviews</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="https://www.omiflow.co.uk" target="_blank" class="nav-btn">{{CTA_TEXT}}</a></li>
  </ul>
  <div class="burger" id="burger" onclick="toggleMenu()"><span></span><span></span><span></span></div>
</nav>
<div class="mmenu" id="mm">
  <a href="#services" onclick="closeMenu()">Services</a>
  <a href="#about" onclick="closeMenu()">About</a>
  <a href="#reviews" onclick="closeMenu()">Reviews</a>
  <a href="#contact" onclick="closeMenu()">Contact</a>
  <a href="https://www.omiflow.co.uk" target="_blank" class="mb">{{CTA_TEXT}}</a>
</div>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-bg"><img referrerpolicy="no-referrer" src="{{HERO_IMG}}" alt="{{BUSINESS_NAME}}" loading="eager"></div>
  <div class="hero-l">
    <div class="hero-badge"><div class="badge-dot"></div><span class="typewriter" id="tw"></span></div>
    <h1 class="hero-h1">{{HERO_H1}}</h1>
    <p class="hero-sub">{{HERO_SUB}}</p>
    <div class="hero-btns">
      <a href="https://www.omiflow.co.uk" target="_blank" class="btn-primary">{{CTA_TEXT}}</a>
      <a href="#services" class="btn-outline">Our services</a>
    </div>
    <div class="hero-trust">
      <span class="trust-tag">{{TRUST_1}}</span>
      <span class="trust-tag">{{TRUST_2}}</span>
      <span class="trust-tag">{{TRUST_3}}</span>
      <span class="trust-tag">{{TRUST_4}}</span>
    </div>
  </div>
  <div class="hero-stats">
    <div class="hs-card"><div class="hs-n">{{STAT_1_NUM}}</div><div class="hs-l">{{STAT_1_LABEL}}</div></div>
    <div class="hs-card"><div class="hs-n">{{STAT_2_NUM}}</div><div class="hs-l">{{STAT_2_LABEL}}</div></div>
    <div class="hs-card"><div class="hs-n">{{STAT_3_NUM}}</div><div class="hs-l">{{STAT_3_LABEL}}</div></div>
  </div>
</section>

<!-- STATS STRIP -->
<div class="stats-strip">
  <div class="ss rv"><div class="ss-n">{{STAT_1_NUM}}</div><div class="ss-l">{{STAT_1_LABEL}}</div></div>
  <div class="ss rv d1"><div class="ss-n">{{STAT_2_NUM}}</div><div class="ss-l">{{STAT_2_LABEL}}</div></div>
  <div class="ss rv d2"><div class="ss-n">{{STAT_3_NUM}}</div><div class="ss-l">{{STAT_3_LABEL}}</div></div>
</div>

<!-- SERVICES -->
<section class="services-sec section" id="services">
  <div class="stag rv">What we offer</div>
  <h2 class="sh2 rv d1">Expertise you can <em>rely on</em></h2>
  <div class="svc-grid">
    <div class="svc rv d1" data-n="01"><div class="svc-bar"></div><div class="svc-n">01</div><div class="svc-title">{{SERVICE_1_TITLE}}</div><div class="svc-desc">{{SERVICE_1_DESC}}</div></div>
    <div class="svc rv d2" data-n="02"><div class="svc-bar"></div><div class="svc-n">02</div><div class="svc-title">{{SERVICE_2_TITLE}}</div><div class="svc-desc">{{SERVICE_2_DESC}}</div></div>
    <div class="svc rv d3" data-n="03"><div class="svc-bar"></div><div class="svc-n">03</div><div class="svc-title">{{SERVICE_3_TITLE}}</div><div class="svc-desc">{{SERVICE_3_DESC}}</div></div>
  </div>
</section>

<!-- ABOUT -->
<section class="about-sec" id="about">
  <div class="about-bg"><img referrerpolicy="no-referrer" src="{{SERVICES_IMG}}" alt="background"></div>
  <div class="about-grid">
    <div class="about-img rv">
      <div class="about-float-card"><img referrerpolicy="no-referrer" src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop&q=85" alt="{{BUSINESS_NAME}}"></div>
    </div>
    <div class="about-txt">
      <div class="stag rv" style="color:rgba(255,255,255,.5)">Our practice</div>
      <h2 class="sh2 rv d1" style="color:#fff">Built around <em>every patient</em></h2>
      <p class="body-txt rv d2" style="margin-bottom:32px;color:rgba(255,255,255,.58)">{{ABOUT_PARA}}</p>
      <a href="https://www.omiflow.co.uk" target="_blank" class="btn-primary rv d3" style="display:inline-flex;width:fit-content;background:rgba(255,255,255,.15);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.28);color:#fff">{{CTA_TEXT}}</a>
    </div>
  </div>
</section>

<!-- PROCESS: dark -->
<section class="process-sec" id="process">
  <div style="text-align:center">
    <div class="stag rv" style="justify-content:center">How it works</div>
    <h2 class="sh2 rv d1" style="text-align:center;color:#fff">A process built <em>around you</em></h2>
  </div>
  <div class="ps-grid">
    <div class="ps rv d1"><div class="ps-num">01</div><div class="ps-title">{{PROCESS_1}}</div><div class="ps-desc">{{PROCESS_1_DESC}}</div></div>
    <div class="ps rv d2"><div class="ps-num">02</div><div class="ps-title">{{PROCESS_2}}</div><div class="ps-desc">{{PROCESS_2_DESC}}</div></div>
    <div class="ps rv d3"><div class="ps-num">03</div><div class="ps-title">{{PROCESS_3}}</div><div class="ps-desc">{{PROCESS_3_DESC}}</div></div>
    <div class="ps rv d4"><div class="ps-num">04</div><div class="ps-title">{{PROCESS_4}}</div><div class="ps-desc">{{PROCESS_4_DESC}}</div></div>
  </div>
</section>

<!-- REVIEWS -->
<section class="reviews-sec section" id="reviews">
  <div class="stag rv">Patient reviews</div>
  <h2 class="sh2 rv d1">Trusted by patients <em>across London</em></h2>
  <div class="reviews-grid">
    <div class="r-card rv d1"><div class="r-quote">&#8220;</div><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">{{REVIEW_1_TEXT}}</div><div class="r-author">&#8212; {{REVIEW_1_AUTHOR}}</div></div>
    <div class="r-card rv d2"><div class="r-quote">&#8220;</div><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">{{REVIEW_2_TEXT}}</div><div class="r-author">&#8212; {{REVIEW_2_AUTHOR}}</div></div>
    <div class="r-card rv d3"><div class="r-quote">&#8220;</div><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">{{REVIEW_3_TEXT}}</div><div class="r-author">&#8212; {{REVIEW_3_AUTHOR}}</div></div>
  </div>
</section>

<!-- CONTACT -->
<section class="contact-sec section" id="contact">
  <div class="contact-grid">
    <div>
      <div class="stag rv">Get in touch</div>
      <h2 class="sh2 rv d1">Ready to take <em>the first step?</em></h2>
      <p class="body-txt rv d2" style="margin-bottom:32px">No commitment. Just a warm, straightforward conversation about how we can help you feel your very best.</p>
      <div class="rv d3">
        <div class="cdetail"><div class="cdl">Phone</div><div class="cdv">{{PHONE}}</div></div>
        <div class="cdetail"><div class="cdl">Email</div><div class="cdv" style="font-size:15px;font-family:var(--fb);font-weight:300">{{EMAIL}}</div></div>
        <div class="cdetail"><div class="cdl">Address</div><div class="cdv" style="font-size:15px;font-family:var(--fb);font-weight:300">{{ADDRESS}}</div></div>
      </div>
    </div>
    <div class="rv d2">
      <div class="cform">
        <div class="cform-title">Book a consultation</div>
        <div class="frow"><div class="fg"><label class="fl">First name</label><input class="fi" type="text" placeholder="Sarah"></div><div class="fg"><label class="fl">Last name</label><input class="fi" type="text" placeholder="Johnson"></div></div>
        <div class="fg"><label class="fl">Email</label><input class="fi" type="email" placeholder="sarah@example.com"></div>
        <div class="fg"><label class="fl">Phone</label><input class="fi" type="tel" placeholder="07700 900 123"></div>
        <div class="fg"><label class="fl">How can we help?</label><textarea class="fi" rows="3" placeholder="Tell us what you are looking for..."></textarea></div>
        <button class="fsub" id="fsub">{{CTA_TEXT}}</button>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="ft">
    <div><div class="flogo">{{BUSINESS_NAME}}</div><div class="ftag">{{TAGLINE}}</div></div>
    <div class="fnav"><a href="#services">Services</a><a href="#about">About</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></div>
  </div>
  <div class="fbot"><span>© 2025 {{BUSINESS_NAME}}. All rights reserved.</span><span class="fcredit">Site by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a></span></div>
</footer>

<script>
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});
function toggleMenu(){document.getElementById('mm').classList.toggle('open')}
function closeMenu(){document.getElementById('mm').classList.remove('open')}
// Make all sections immediately visible — no observer dependency
document.querySelectorAll('.rv').forEach(el=>el.classList.add('on'));
const tw=document.getElementById('tw');
const phrases=['{{HERO_SUBLINE_A}}','{{HERO_SUBLINE_B}}'];
let pi=0,ci=0,del=false,w=0;
function tick(){const p=phrases[pi];if(!del){tw.textContent=p.slice(0,++ci);if(ci===p.length){del=true;w=0;setTimeout(tick,2400);return}}else{if(w<4){w++;setTimeout(tick,55);return}tw.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(tick,400);return}}setTimeout(tick,del?40:60)}
tick();
document.getElementById('fsub').addEventListener('click',e=>{e.preventDefault();window.open('https://www.omiflow.co.uk','_blank')});
<\\\\/script>
</body>
</html>
`

const TEMPLATE_TRADES = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="referrer" content="no-referrer">
<title>{{BUSINESS_NAME}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" rel="stylesheet">
<style>
/* PIPELINE TEMPLATE — TRADES */
:root {
  --p: #1c1c1a;
  --a: #c9913a;
  --dark: #111110;
  --dark2: #1a1a18;
  --dark3: #242422;
  --text: #f0ede8;
  --muted: #888884;
  --border: #2e2e2c;
  --fd: 'Bebas Neue', Impact, sans-serif;
  --fb: 'Barlow', system-ui, sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--dark);color:var(--text);font-family:var(--fb);line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}
a{text-decoration:none}

/* DEMO BANNER */
.demo-bar{position:fixed;top:0;left:0;right:0;z-index:200;background:#0a0a0a;color:#c8f155;font-family:var(--fb);font-size:11px;font-weight:500;letter-spacing:.06em;text-align:center;padding:7px 16px;display:flex;align-items:center;justify-content:center;gap:10px}
.demo-bar-dot{width:5px;height:5px;border-radius:50%;background:#c8f155;animation:pulse 2s ease-in-out infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
.demo-bar a{color:#c8f155;font-weight:600;border-bottom:1px solid rgba(200,241,85,.4);padding-bottom:1px}

/* NAV */
nav{position:fixed;top:30px;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;transition:background .3s,box-shadow .3s}
nav.stuck{background:rgba(17,17,16,.96);backdrop-filter:blur(12px);box-shadow:0 1px 0 var(--border)}
.nav-logo{font-family:var(--fd);font-size:24px;letter-spacing:.04em;color:var(--text)}
.nav-links{display:flex;align-items:center;gap:28px;list-style:none}
.nav-links a{font-size:13px;color:var(--muted);font-weight:500;letter-spacing:.06em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:var(--text)}
.nav-cta{background:var(--a)!important;color:#111!important;padding:10px 22px;border-radius:4px;font-weight:600!important;font-size:12px!important;letter-spacing:.08em!important;text-transform:uppercase!important;transition:opacity .2s!important}
.nav-cta:hover{opacity:.85!important}
.nav-burger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px}
.nav-burger span{display:block;width:22px;height:1.5px;background:var(--text);border-radius:2px}
.mobile-menu{display:none;position:fixed;top:30px;left:0;right:0;bottom:0;background:var(--dark);z-index:99;padding:80px 32px 40px;flex-direction:column;gap:0}
.mobile-menu.open{display:flex}
.mobile-menu a{font-family:var(--fd);font-size:36px;letter-spacing:.04em;color:var(--text);padding:12px 0;border-bottom:1px solid var(--border)}
.mobile-menu .m-cta{margin-top:28px;background:var(--a);color:#111!important;text-align:center;padding:16px;border-radius:4px;font-family:var(--fb);font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-bottom:none!important;display:block}

/* HERO */
.hero{position:relative;min-height:100vh;display:flex;align-items:flex-end;padding-top:92px;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(.45)}
.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to top, rgba(17,17,16,1) 0%, rgba(17,17,16,.6) 40%, transparent 70%)}
.hero-content{position:relative;z-index:2;padding:80px 80px 80px;width:100%;max-width:900px;box-sizing:border-box}
.hero-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:20px;opacity:0;animation:up .6s ease forwards .1s}
.hero-eyebrow-line{width:40px;height:2px;background:var(--a)}
.hero-eyebrow-text{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--a)}
.typewriter{border-right:2px solid var(--a);padding-right:2px;white-space:nowrap}
.hero-h1{font-family:var(--fd);font-size:clamp(60px,9vw,130px);line-height:.95;letter-spacing:.02em;color:var(--text);margin-bottom:24px;opacity:0;animation:up .6s ease forwards .25s}
.hero-h1 span{color:var(--a)}
.hero-sub{font-size:17px;font-weight:300;color:rgba(240,237,232,.65);max-width:520px;line-height:1.7;margin-bottom:40px;opacity:0;animation:up .6s ease forwards .4s}
.hero-actions{display:flex;gap:14px;align-items:center;flex-wrap:wrap;opacity:0;animation:up .6s ease forwards .55s}
.btn-accent{display:inline-flex;align-items:center;gap:8px;background:var(--a);color:#111;padding:15px 32px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:all .2s}
.btn-accent:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.btn-accent svg{width:16px;height:16px;transition:transform .2s}
.btn-accent:hover svg{transform:translateX(3px)}
.btn-outline{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(240,237,232,.25);color:var(--text);padding:14px 28px;border-radius:4px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;transition:all .2s}
.btn-outline:hover{border-color:rgba(240,237,232,.6);background:rgba(240,237,232,.06)}

/* Stats strip */
.stats-strip{background:var(--a);display:grid;grid-template-columns:repeat(3,1fr);padding:0}
.stat-block{padding:28px 40px;border-right:1px solid rgba(17,17,16,.2);text-align:center}
.stat-block:last-child{border-right:none}
.stat-n{font-family:var(--fd);font-size:48px;letter-spacing:.02em;color:#111;line-height:1}
.stat-l{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(17,17,16,.65);margin-top:4px}

/* SECTION BASE */
.section{padding:96px 80px}
.eyebrow{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--a);margin-bottom:14px}
.eyebrow-line{width:28px;height:2px;background:var(--a);flex-shrink:0}
.sh2{font-family:var(--fd);font-size:clamp(36px,5vw,72px);line-height:.95;letter-spacing:.02em;color:var(--text);margin-bottom:14px}
.sh2 span{color:var(--a)}
.ssub{font-size:16px;font-weight:300;color:var(--muted);max-width:520px;line-height:1.7}

/* Reveal */
.rv{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
.rv.on{opacity:1;transform:translateY(0)}
.d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}.d4{transition-delay:.32s}

/* PROJECTS GRID */
.projects-section{background:var(--dark);padding:96px 80px}
.projects-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:56px}
.project-card{position:relative;aspect-ratio:4/5;overflow:hidden;cursor:pointer}
.project-card img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease;filter:brightness(.8)}
.project-card:hover img{transform:scale(1.05);filter:brightness(.65)}
.project-label{position:absolute;bottom:0;left:0;right:0;padding:20px 18px;background:linear-gradient(to top,rgba(17,17,16,.9) 0%,transparent 100%);font-family:var(--fd);font-size:20px;letter-spacing:.04em;color:var(--text);transform:translateY(4px);transition:transform .3s}
.project-card:hover .project-label{transform:translateY(0)}
.project-tag{display:inline-block;background:var(--a);color:#111;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:2px;margin-bottom:6px}

/* SERVICES */
.services-section{background:var(--dark2);padding:96px 80px}
.services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:56px}
.svc-card{background:var(--dark3);padding:36px 28px;border-top:3px solid transparent;transition:border-color .25s,background .25s}
.svc-card:hover{border-top-color:var(--a);background:var(--dark)}
.svc-num{font-family:var(--fd);font-size:64px;letter-spacing:.02em;color:var(--border);line-height:1;margin-bottom:20px;transition:color .25s}
.svc-card:hover .svc-num{color:var(--a)}
.svc-title{font-family:var(--fd);font-size:28px;letter-spacing:.03em;color:var(--text);margin-bottom:12px}
.svc-desc{font-size:14px;color:var(--muted);line-height:1.7;font-weight:300}

/* PROCESS */
.process-section{background:var(--dark);padding:96px 80px}
.process-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:56px;position:relative}
.process-steps::before{content:'';position:absolute;top:22px;left:calc(12.5% + 20px);right:calc(12.5% + 20px);height:2px;background:var(--border)}
.ps{text-align:center;padding:0 20px}
.ps-ring{width:44px;height:44px;border-radius:50%;border:2px solid var(--border);background:var(--dark);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;position:relative;z-index:1;transition:border-color .3s,background .3s}
.ps:hover .ps-ring{border-color:var(--a);background:var(--a)}
.ps-n{font-family:var(--fd);font-size:18px;color:var(--muted);transition:color .3s}
.ps:hover .ps-n{color:#111}
.ps-title{font-family:var(--fd);font-size:20px;letter-spacing:.03em;color:var(--text);margin-bottom:8px}
.ps-desc{font-size:13px;color:var(--muted);line-height:1.6;font-weight:300}

/* REVIEWS */
.reviews-section{background:var(--dark2);padding:96px 80px}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:52px}
.r-card{background:var(--dark3);padding:32px;border-bottom:3px solid transparent;transition:border-color .3s}
.r-card:hover{border-bottom-color:var(--a)}
.r-stars{display:flex;gap:3px;margin-bottom:16px}
.r-star{width:13px;height:13px;fill:var(--a)}
.r-text{font-family:var(--fd);font-size:22px;letter-spacing:.02em;color:var(--text);line-height:1.3;margin-bottom:20px}
.r-author{font-size:12px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase}

/* CONTACT */
.contact-section{background:var(--dark);padding:96px 80px}
.contact-inner{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;max-width:1100px;margin:0 auto}
.areas-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.area-tag{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:6px 14px;border:1px solid var(--border);border-radius:2px;color:var(--muted);transition:all .2s}
.area-tag:hover{border-color:var(--a);color:var(--a)}
.c-form{background:var(--dark2);border:1px solid var(--border);border-radius:4px;padding:40px}
.c-form-title{font-family:var(--fd);font-size:32px;letter-spacing:.03em;color:var(--text);margin-bottom:28px}
.fg{margin-bottom:14px}
.fl{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px}
.fi{width:100%;padding:13px 16px;border:1px solid var(--border);border-radius:4px;font-family:var(--fb);font-size:14px;color:var(--text);background:var(--dark);outline:none;transition:border-color .2s;font-weight:300}
.fi:focus{border-color:var(--a)}
.fi::placeholder{color:#444}
textarea.fi{resize:none}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.f-submit{width:100%;padding:16px;background:var(--a);color:#111;border:none;border-radius:4px;font-family:var(--fb);font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;margin-top:8px;transition:opacity .2s}
.f-submit:hover{opacity:.85}

/* FOOTER */
footer{background:#0a0a0a;padding:48px 80px 32px;border-top:1px solid var(--border)}
.ft{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:28px;border-bottom:1px solid var(--border);margin-bottom:24px;gap:32px;flex-wrap:wrap}
.f-logo{font-family:var(--fd);font-size:28px;letter-spacing:.04em;color:var(--text);margin-bottom:6px}
.f-tag{font-size:13px;color:var(--muted);font-weight:300}
.f-nav{display:flex;gap:28px;flex-wrap:wrap}
.f-nav a{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);transition:color .2s}
.f-nav a:hover{color:var(--text)}
.fb{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:12px;color:#444}
.f-credit a{color:#c8f155;font-weight:600;border-bottom:1px solid rgba(200,241,85,.35);padding-bottom:1px}

/* RESPONSIVE */
@media(max-width:900px){
  nav{padding:0 24px}
  .nav-links{display:none}
  .nav-burger{display:flex}
  .hero-content{padding:60px 24px 48px}
  .hero-h1{font-size:clamp(52px,12vw,80px)}
  .stats-strip{grid-template-columns:1fr}
  .stat-block{border-right:none;border-bottom:1px solid rgba(17,17,16,.15);padding:20px 24px}
  .section,.projects-section,.services-section,.process-section,.reviews-section,.contact-section{padding:64px 24px}
  .projects-grid{grid-template-columns:1fr;gap:3px}
  .services-grid{grid-template-columns:1fr;gap:2px}
  .process-steps{grid-template-columns:1fr 1fr;gap:28px}
  .process-steps::before{display:none}
  .reviews-grid{grid-template-columns:1fr;gap:2px}
  .contact-inner{grid-template-columns:1fr;gap:40px}
  footer{padding:40px 24px 24px}
  .ft{flex-direction:column;gap:16px}
  .fb{flex-direction:column;align-items:flex-start;gap:8px}
}
@media(max-width:480px){
  .hero-h1{font-size:52px}
  .process-steps{grid-template-columns:1fr}
  .fr{grid-template-columns:1fr}
  .demo-bar{font-size:10px;flex-wrap:wrap;gap:4px;padding:6px 12px}
}
@keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<div class="demo-bar">
  <div class="demo-bar-dot"></div>
  Demo preview by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a>
  &nbsp;·&nbsp; Your site, rebuilt &nbsp;·&nbsp;
  <a href="https://www.omiflow.co.uk" target="_blank">See our work →</a>
</div>

<nav id="nav">
  <a href="#home" class="nav-logo">{{BUSINESS_NAME}}</a>
  <ul class="nav-links">
    <li><a href="#projects">Projects</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#process">How it works</a></li>
    <li><a href="#reviews">Reviews</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="https://www.omiflow.co.uk" target="_blank" class="nav-cta">{{CTA_TEXT}}</a></li>
  </ul>
  <div class="nav-burger" id="burger" onclick="toggleMenu()"><span></span><span></span><span></span></div>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <a href="#projects" onclick="closeMenu()">Projects</a>
  <a href="#services" onclick="closeMenu()">Services</a>
  <a href="#process" onclick="closeMenu()">How it works</a>
  <a href="#reviews" onclick="closeMenu()">Reviews</a>
  <a href="#contact" onclick="closeMenu()">Contact</a>
  <a href="https://www.omiflow.co.uk" target="_blank" class="m-cta" onclick="closeMenu()">{{CTA_TEXT}}</a>
</div>

<section class="hero" id="home">
  <div class="hero-bg"><img referrerpolicy="no-referrer" src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&auto=format&fit=crop&q=80" alt="{{BUSINESS_NAME}}" loading="eager"></div>
  <div class="hero-content">
    <div class="hero-eyebrow">
      <div class="hero-eyebrow-line"></div>
      <span class="typewriter" id="tw"></span>
    </div>
    <h1 class="hero-h1">{{HERO_H1}}</h1>
    <p class="hero-sub">{{HERO_SUB}}</p>
    <div class="hero-actions">
      <a href="https://www.omiflow.co.uk" target="_blank" class="btn-accent">{{CTA_TEXT}}</a>
      <a href="#projects" class="btn-outline">See our projects</a>
    </div>
  </div>
</section>

<div class="stats-strip">
  <div class="stat-block"><div class="stat-n">{{STAT_1_NUM}}</div><div class="stat-l">{{STAT_1_LABEL}}</div></div>
  <div class="stat-block"><div class="stat-n">{{STAT_2_NUM}}</div><div class="stat-l">{{STAT_2_LABEL}}</div></div>
  <div class="stat-block"><div class="stat-n">{{STAT_3_NUM}}</div><div class="stat-l">{{STAT_3_LABEL}}</div></div>
</div>

<section class="projects-section" id="projects">
  <div class="eyebrow rv"><div class="eyebrow-line"></div>Recent projects</div>
  <h2 class="sh2 rv d1">Work that <span>speaks</span> for itself</h2>
  <p class="ssub rv d2">{{PROJECTS_SUBLINE}}</p>
  <div class="projects-grid" style="margin-top:56px">
    <div class="project-card rv d1">
      <img referrerpolicy="no-referrer" src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700&auto=format&fit=crop&q=80" alt="{{PROJECT_1_LABEL}}" loading="lazy">
      <div class="project-label"><div class="project-tag">Completed</div><div>{{PROJECT_1_LABEL}}</div></div>
    </div>
    <div class="project-card rv d2">
      <img referrerpolicy="no-referrer" src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&auto=format&fit=crop&q=80" alt="{{PROJECT_2_LABEL}}" loading="lazy">
      <div class="project-label"><div class="project-tag">Completed</div><div>{{PROJECT_2_LABEL}}</div></div>
    </div>
    <div class="project-card rv d3">
      <img referrerpolicy="no-referrer" src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=700&auto=format&fit=crop&q=80" alt="{{PROJECT_3_LABEL}}" loading="lazy">
      <div class="project-label"><div class="project-tag">Completed</div><div>{{PROJECT_3_LABEL}}</div></div>
    </div>
  </div>
</section>

<section class="services-section" id="services">
  <div class="eyebrow rv"><div class="eyebrow-line"></div>What we do</div>
  <h2 class="sh2 rv d1">Every job,<br><span>done properly</span></h2>
  <div class="services-grid">
    <div class="svc-card rv d1"><div class="svc-num">01</div><div class="svc-title">{{SERVICE_1_TITLE}}</div><div class="svc-desc">{{SERVICE_1_DESC}}</div></div>
    <div class="svc-card rv d2"><div class="svc-num">02</div><div class="svc-title">{{SERVICE_2_TITLE}}</div><div class="svc-desc">{{SERVICE_2_DESC}}</div></div>
    <div class="svc-card rv d3"><div class="svc-num">03</div><div class="svc-title">{{SERVICE_3_TITLE}}</div><div class="svc-desc">{{SERVICE_3_DESC}}</div></div>
  </div>
</section>

<section class="process-section" id="process">
  <div style="text-align:center">
    <div class="eyebrow rv" style="justify-content:center"><div class="eyebrow-line"></div>How it works<div class="eyebrow-line"></div></div>
    <h2 class="sh2 rv d1" style="text-align:center">No <span>messing around</span></h2>
    <p class="ssub rv d2" style="text-align:center;margin:0 auto">Straight talking from quote to completion. Here's how every job goes.</p>
  </div>
  <div class="process-steps">
    <div class="ps rv d1"><div class="ps-ring"><div class="ps-n">01</div></div><div class="ps-title">Free site survey</div><div class="ps-desc">Quick turnaround. No obligation.</div></div>
    <div class="ps rv d2"><div class="ps-ring"><div class="ps-n">02</div></div><div class="ps-title">Fixed-price quote</div><div class="ps-desc">We survey the job properly before quoting.</div></div>
    <div class="ps rv d3"><div class="ps-ring"><div class="ps-n">03</div></div><div class="ps-title">Installation begins</div><div class="ps-desc">Fixed price, fixed timeline, no surprises.</div></div>
    <div class="ps rv d4"><div class="ps-ring"><div class="ps-n">04</div></div><div class="ps-title">Snagged and signed off</div><div class="ps-desc">We don't leave until you are happy.</div></div>
  </div>
</section>

<section class="reviews-section" id="reviews">
  <div class="eyebrow rv"><div class="eyebrow-line"></div>What clients say</div>
  <h2 class="sh2 rv d1">Real people,<br><span>real results</span></h2>
  <div class="reviews-grid">
    <div class="r-card rv d1">
      <div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div>
      <div class="r-text">"{{REVIEW_1_TEXT}}"</div><div class="r-author">— {{REVIEW_1_AUTHOR}}</div>
    </div>
    <div class="r-card rv d2">
      <div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div>
      <div class="r-text">"{{REVIEW_2_TEXT}}"</div><div class="r-author">— {{REVIEW_2_AUTHOR}}</div>
    </div>
    <div class="r-card rv d3">
      <div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div>
      <div class="r-text">"{{REVIEW_3_TEXT}}"</div><div class="r-author">— {{REVIEW_3_AUTHOR}}</div>
    </div>
  </div>
</section>

<section class="contact-section" id="contact">
  <div class="contact-inner">
    <div>
      <div class="eyebrow rv"><div class="eyebrow-line"></div>Get a quote</div>
      <h2 class="sh2 rv d1">Let's talk<br>about your <span>job</span></h2>
      <p class="ssub rv d2" style="margin-bottom:24px">We cover Greater Manchester and Cheshire. Free no-obligation quotes, usually within 48 hours.</p>
      <div class="areas-list rv d3">
        <span class="area-tag">{{PHONE}}</span>
        <span class="area-tag">{{EMAIL}}</span>
        <span class="area-tag">{{AREAS}}</span>
      </div>
    </div>
    <div class="rv d2">
      <div class="c-form">
        <div class="c-form-title">Request a free quote</div>
        <div class="fr"><div class="fg"><label class="fl">Name</label><input class="fi" type="text" placeholder="John Smith"></div><div class="fg"><label class="fl">Phone</label><input class="fi" type="tel" placeholder="07700 900 123"></div></div>
        <div class="fg"><label class="fl">Email</label><input class="fi" type="email" placeholder="john@example.com"></div>
        <div class="fg"><label class="fl">What's the job?</label><textarea class="fi" rows="4" placeholder="Tell us about the work you need done..."></textarea></div>
        <button class="f-submit" id="fsub">{{CTA_TEXT}}</button>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="ft">
    <div><div class="f-logo">{{BUSINESS_NAME}}</div><div class="f-tag">{{TAGLINE}}</div></div>
    <div class="f-nav">
      <a href="#projects">Projects</a>
      <a href="#services">Services</a>
      <a href="#process">How it works</a>
      <a href="#reviews">Reviews</a>
      <a href="#contact">Contact</a>
    </div>
  </div>
  <div class="fb">
    <span>© 2025 {{BUSINESS_NAME}}. All rights reserved.</span>
    <span class="f-credit">Site by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a></span>
  </div>
</footer>

<script>
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>50),{passive:true});
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open')}
function closeMenu(){document.getElementById('mobileMenu').classList.remove('open')}
document.querySelectorAll('.rv').forEach(el=>el.classList.add('on'));
// Fallback: ensure all elements become visible even if observer misfires
setTimeout(()=>{document.querySelectorAll('.rv:not(.on)').forEach(el=>el.classList.add('on'));},1800);
const phrases=['Bespoke kitchen fitting · Manchester','Over 400 kitchens installed across the North West'];
const tw=document.getElementById('tw');
let pi=0,ci=0,del=false,wait=0;
function tick(){const p=phrases[pi];if(!del){tw.textContent=p.slice(0,++ci);if(ci===p.length){del=true;wait=0;setTimeout(tick,2200);return}}else{if(wait<4){wait++;setTimeout(tick,60);return}tw.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(tick,400);return}}setTimeout(tick,del?45:68)}
tick();
document.getElementById('fsub').addEventListener('click',function(e){e.preventDefault();window.open('https://www.omiflow.co.uk','_blank')});
<\\\\/script>
</body>
</html>
`

const TEMPLATE_PHOTOGRAPHY = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="referrer" content="no-referrer">
<title>{{BUSINESS_NAME}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{
  --p:#1a1510;
  --a:#b8935a;
  --bg:#ffffff;
  --off:#faf8f5;
  --warm:#f0ebe2;
  --dark:#0c0c0b;
  --text:#111110;
  --mid:#6b6560;
  --soft:#b0a89e;
  --border:#e8e2da;
  --fd:'DM Serif Display',Georgia,serif;
  --fb:'DM Sans',system-ui,sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--bg);color:var(--text);font-family:var(--fb);line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{display:block;width:100%;object-fit:cover}
a{text-decoration:none;color:inherit}

/* DEMO BAR */
.db{position:fixed;top:0;left:0;right:0;z-index:300;background:#111;color:#c8f155;font-family:var(--fb);font-size:11px;text-align:center;padding:7px 16px;display:flex;align-items:center;justify-content:center;gap:10px}
.db-dot{width:5px;height:5px;border-radius:50%;background:#c8f155;animation:blink 2s ease-in-out infinite;flex-shrink:0}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
.db a{color:#c8f155;border-bottom:1px solid rgba(200,241,85,.4)}

/* NAV — minimal, transparent over photo */
nav{position:fixed;top:30px;left:0;right:0;z-index:200;padding:0 56px;height:56px;display:flex;align-items:center;justify-content:space-between;transition:all .35s}
nav.scrolled{background:rgba(255,255,255,.97);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
.nav-logo{font-family:var(--fd);font-size:18px;font-style:italic;color:#fff;transition:color .3s}
nav.scrolled .nav-logo{color:var(--text)}
.nav-links{display:flex;align-items:center;gap:28px;list-style:none}
.nav-links a{font-size:12px;font-weight:400;color:rgba(255,255,255,.7);transition:color .2s;letter-spacing:.04em}
nav.scrolled .nav-links a{color:var(--mid)}
.nav-links a:hover{color:#fff}
nav.scrolled .nav-links a:hover{color:var(--text)}
.nav-btn{border:1px solid rgba(255,255,255,.4)!important;color:rgba(255,255,255,.9)!important;padding:8px 20px;border-radius:100px;font-size:11px!important;letter-spacing:.06em!important;transition:all .2s!important}
nav.scrolled .nav-btn{border-color:var(--border)!important;color:var(--text)!important}
.burger{display:none;flex-direction:column;gap:5px;cursor:pointer}
.burger span{display:block;width:22px;height:1.5px;background:#fff;transition:all .3s}
nav.scrolled .burger span{background:var(--text)}
.mmenu{display:none;position:fixed;top:30px;left:0;right:0;bottom:0;background:var(--bg);z-index:199;padding:80px 32px 40px;flex-direction:column}
.mmenu.open{display:flex}
.mmenu a{font-family:var(--fd);font-size:32px;font-style:italic;color:var(--text);padding:12px 0;border-bottom:1px solid var(--border)}
.mmenu .mb{margin-top:28px;border:1px solid var(--text);text-align:center;padding:14px;border-radius:100px;font-family:var(--fb);font-size:12px;color:var(--text);border-bottom:1px solid var(--text)!important;display:block}

/* HERO — Rawmantic / editorial. Full bleed photo, type overlaid at bottom */
.hero{position:relative;height:100vh;min-height:640px;overflow:hidden;display:flex;align-items:flex-end;padding-top:92px}
.hero-img{position:absolute;inset:0;z-index:0}
.hero-img img{height:100%;object-position:center}
.hero-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(17,17,16,.75) 0%,rgba(17,17,16,.2) 50%,rgba(17,17,16,.05) 100%)}
.hero-content{position:relative;z-index:2;padding:0 80px 64px;width:100%;display:flex;align-items:flex-end;justify-content:space-between;gap:40px}
.hero-left{}
.hero-eyebrow{font-size:11px;font-weight:400;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:16px;opacity:0;animation:fu .8s ease forwards .1s}
.typewriter{white-space:nowrap}
.hero-h1{font-family:var(--fd);font-size:clamp(40px,5.5vw,80px);font-style:italic;line-height:1.05;color:#fff;margin-bottom:24px;opacity:0;animation:fu .8s ease forwards .25s;max-width:580px}
.hero-actions{display:flex;gap:14px;align-items:center;flex-wrap:wrap;opacity:0;animation:fu .8s ease forwards .4s}
.btn-white{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--text);padding:13px 28px;border-radius:100px;font-size:12px;font-weight:600;transition:all .2s;letter-spacing:.02em}
.btn-white:hover{background:var(--off);transform:translateY(-2px)}
.btn-outline-w{font-size:12px;font-weight:400;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.3);padding:12px 22px;border-radius:100px;transition:all .2s}
.btn-outline-w:hover{color:#fff;border-color:rgba(255,255,255,.7)}
/* Right side — stats */
.hero-right{text-align:right;opacity:0;animation:fu .8s ease forwards .55s;flex-shrink:0}
.hero-stat{margin-bottom:12px}
.hs-n{font-family:var(--fd);font-size:36px;font-style:italic;color:#fff;line-height:1}
.hs-l{font-size:10px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45)}

/* TICKER — brand logos or credentials marquee */
.ticker{background:var(--warm);padding:14px 0;overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.ticker-track{display:flex;gap:0;animation:tick 28s linear infinite;width:max-content}
.ticker-item{padding:0 40px;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--soft);white-space:nowrap;display:flex;align-items:center;gap:16px}
.ticker-item::after{content:'·';color:var(--border)}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* PORTFOLIO — magazine editorial layout, dark bg, full titles visible */
.portfolio-section{padding:0;background:var(--dark)}
.portfolio-header{padding:72px 80px 48px;display:flex;align-items:flex-end;justify-content:space-between;gap:32px;background:var(--dark)}
.ph-left .section-tag{font-size:11px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:14px;display:block}
.ph-h2{font-family:var(--fd);font-size:clamp(36px,5vw,68px);font-style:italic;color:#fff;line-height:1.0}
.ph-right{font-size:13px;font-weight:300;color:rgba(255,255,255,.35);max-width:220px;line-height:1.75;text-align:right}
/* Hero image — full width, dominant */
.port-hero{position:relative;overflow:hidden;height:70vh;min-height:480px;cursor:pointer}
.port-hero img{width:100%;height:100%;object-fit:cover;transition:transform 1s ease}
.port-hero:hover img{transform:scale(1.03)}
.port-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(17,17,16,.75) 0%,rgba(17,17,16,.1) 55%,transparent 100%)}
.port-hero-label{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:32px 48px;display:flex;align-items:flex-end;justify-content:space-between}
.phl-num{font-family:var(--fd);font-size:clamp(56px,8vw,120px);font-style:italic;color:rgba(255,255,255,.12);line-height:1;flex-shrink:0}
.phl-info{}
.phl-tag{font-size:10px;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:6px}
.phl-title{font-family:var(--fd);font-size:clamp(22px,3vw,38px);font-style:italic;color:#fff;line-height:1.1}
/* Three column row */
.port-trio{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:2px}
.pt{position:relative;overflow:hidden;cursor:pointer}
.pt img{width:100%;height:100%;object-fit:cover;aspect-ratio:3/4;transition:transform .8s ease;display:block}
.pt:hover img{transform:scale(1.05)}
.pt::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(17,17,16,.8) 0%,transparent 50%)}
.pt-label{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:24px 28px}
.pt-num{font-size:10px;font-weight:300;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px}
.pt-title{font-family:var(--fd);font-size:20px;font-style:italic;color:#fff;line-height:1.1}
.pt-loc{font-size:11px;font-weight:300;color:rgba(255,255,255,.45);margin-top:3px;letter-spacing:.04em}
/* Two wide bottom row */
.port-duo{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:2px}
.pd{position:relative;overflow:hidden;cursor:pointer;height:320px}
.pd img{width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
.pd:hover img{transform:scale(1.04)}
.pd::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(17,17,16,.72) 0%,transparent 50%)}
.pd-label{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:24px 32px;display:flex;align-items:flex-end;justify-content:space-between}
.pd-left{}
.pd-num{font-size:10px;font-weight:300;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px}
.pd-title{font-family:var(--fd);font-size:22px;font-style:italic;color:#fff}
.pd-loc{font-size:11px;font-weight:300;color:rgba(255,255,255,.4);margin-top:2px}
.pd-arrow{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.5);font-size:16px;transition:all .3s;flex-shrink:0}
.pd:hover .pd-arrow{border-color:rgba(255,255,255,.7);color:#fff}
/* bottom bar */
.port-footer{background:var(--dark);padding:32px 80px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.07)}
.pf-text{font-size:13px;font-weight:300;color:rgba(255,255,255,.35);font-style:italic;font-family:var(--fd)}
.pf-link{font-size:11px;font-weight:300;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45);border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:2px;transition:all .2s}
.pf-link:hover{color:#fff;border-color:rgba(255,255,255,.6)}

/* ABOUT — split image + text, white bg */
.about-section{padding:0;background:var(--off)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:stretch;min-height:580px}
.about-img{border-radius:0;overflow:hidden;aspect-ratio:auto}
.about-img img{height:100%;width:100%;object-fit:cover;object-position:center}
.about-right{padding:72px 64px;display:flex;flex-direction:column;justify-content:center}
.about-right .section-tag{font-size:11px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);margin-bottom:12px;display:block}
.about-h2{font-family:var(--fd);font-size:clamp(32px,4vw,60px);font-style:italic;font-weight:400;color:var(--text);line-height:1.08;margin-bottom:20px}
.about-body{font-size:15px;font-weight:300;color:var(--mid);line-height:1.8;margin-bottom:32px}
.about-cta{display:inline-flex;align-items:center;background:var(--text);color:#fff;padding:16px 36px;border-radius:100px;font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;transition:all .2s;white-space:nowrap}
.about-cta:hover{opacity:.85;transform:translateY(-2px)}

/* SERVICES */
.services-section{padding:100px 80px;background:var(--bg)}
.svc-list{margin-top:48px;display:flex;flex-direction:column}
.svc-row{display:flex;align-items:baseline;gap:24px;padding:24px 0;border-bottom:1px solid var(--border);transition:padding-left .25s}
.svc-row:first-child{border-top:1px solid var(--border)}
.svc-row:hover{padding-left:12px}
.svc-i{font-family:var(--fd);font-size:12px;font-style:italic;color:var(--soft);min-width:28px}
.svc-title{font-family:var(--fd);font-size:22px;font-style:italic;flex:1;color:var(--text)}
.svc-desc{font-size:13px;font-weight:300;color:var(--mid);max-width:280px;line-height:1.65}

/* REVIEWS */
.reviews-section{padding:100px 80px;background:var(--off)}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
.r-card{background:rgba(255,255,255,.75);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.95);border-radius:20px;padding:32px;box-shadow:0 4px 28px rgba(0,0,0,.07);transition:transform .25s,box-shadow .25s;position:relative;overflow:hidden}
.r-card::before{content:'“';position:absolute;top:16px;right:18px;font-family:var(--fd);font-size:72px;line-height:1;color:rgba(180,160,130,.2)}
.r-card:hover{transform:translateY(-4px);box-shadow:0 14px 40px rgba(0,0,0,.1)}
.r-stars{display:flex;gap:3px;margin-bottom:14px}
.r-star{color:#c9913a;font-size:12px}
.r-text{font-family:var(--fd);font-size:19px;font-style:italic;color:var(--text);line-height:1.55;margin-bottom:18px}
.r-author{font-size:11px;font-weight:500;letter-spacing:.08em;color:var(--soft);text-transform:uppercase}

/* CONTACT */
.contact-section{padding:100px 80px;background:var(--bg)}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;max-width:1060px;margin:0 auto;align-items:start}
.cform{background:var(--off);border-radius:4px;padding:40px;border:1px solid var(--border)}
.cform-title{font-family:var(--fd);font-size:22px;font-style:italic;color:var(--text);margin-bottom:28px}
.fg{margin-bottom:13px}
.fl{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mid);display:block;margin-bottom:5px}
.fi{width:100%;padding:11px 0;border:none;border-bottom:1.5px solid var(--border);font-family:var(--fb);font-size:13px;color:var(--text);background:transparent;outline:none;font-weight:300;transition:border-color .2s}
.fi:focus{border-color:var(--p)}
.fi::placeholder{color:var(--warm)}
textarea.fi{resize:none}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.fsub{width:100%;padding:13px;background:var(--text);color:#fff;border:none;border-radius:100px;font-family:var(--fb);font-size:12px;font-weight:500;cursor:pointer;margin-top:10px;letter-spacing:.02em;transition:all .2s}
.fsub:hover{opacity:.85;transform:translateY(-1px)}
.cdetails{display:flex;flex-direction:column;gap:0;margin-top:16px}
.cdetail{padding:18px 0;border-bottom:1px solid var(--border)}
.cdetail:last-child{border-bottom:none}
.cdl{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--soft);margin-bottom:5px}
.cdv{font-family:var(--fd);font-size:18px;font-style:italic;color:var(--text)}

/* FOOTER */
footer{background:var(--text);padding:48px 80px 24px}
.ft{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:22px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:18px;gap:32px;flex-wrap:wrap}
.flogo{font-family:var(--fd);font-size:18px;font-style:italic;color:#fff;margin-bottom:4px}
.ftag{font-size:12px;font-weight:300;color:rgba(255,255,255,.25)}
.fnav{display:flex;gap:22px;flex-wrap:wrap}
.fnav a{font-size:11px;color:rgba(255,255,255,.3);transition:color .2s}
.fnav a:hover{color:#fff}
.fbot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:11px;color:rgba(255,255,255,.18)}
.fcredit a{color:#c8f155;border-bottom:1px solid rgba(200,241,85,.3);padding-bottom:1px}

.rv{opacity:0;transform:translateY(16px);transition:opacity .65s ease,transform .65s ease}
.rv.on{opacity:1;transform:none}
.d1{transition-delay:.07s}.d2{transition-delay:.14s}.d3{transition-delay:.21s}

@media(max-width:900px){
  nav{padding:0 24px}
  .nav-links{display:none}
  .burger{display:flex}
  .hero-content{flex-direction:column;padding:0 24px 48px;gap:20px}
  .hero-right{text-align:left}
  .portfolio-header{flex-direction:column;padding:0 24px 32px;gap:10px}
  .ph-right{text-align:left;max-width:100%}
  .port-hero{height:50vh;min-height:320px}
  .phl-num{display:none}
  .port-trio{grid-template-columns:1fr}
  .port-duo{grid-template-columns:1fr}
  .port-footer{padding:24px}
  .portfolio-header{padding:48px 24px 32px}
  .about-section,.services-section,.reviews-section,.contact-section{padding:64px 24px}
  .about-grid{grid-template-columns:1fr;min-height:auto}
  .about-img{aspect-ratio:4/3;border-radius:0}
  .about-right{padding:48px 24px}
  .reviews-grid{grid-template-columns:1fr;gap:14px}
  .contact-grid{grid-template-columns:1fr;gap:36px}
  footer{padding:36px 24px 20px}
  .ft{flex-direction:column;gap:12px}
}
@media(max-width:480px){
  .frow{grid-template-columns:1fr}
  .hero-h1{font-size:36px}
}
@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
</style>
</head>
<body>

<div class="db">
  <div class="db-dot"></div>
  Demo preview by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a>
  &nbsp;·&nbsp; Your site, rebuilt &nbsp;·&nbsp;
  <a href="https://www.omiflow.co.uk" target="_blank">See our work →</a>
</div>

<nav id="nav">
  <div class="nav-logo">{{BUSINESS_NAME}}</div>
  <ul class="nav-links">
    <li><a href="#portfolio">Work</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#reviews">Reviews</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="https://www.omiflow.co.uk" target="_blank" class="nav-btn">{{CTA_TEXT}}</a></li>
  </ul>
  <div class="burger" id="burger" onclick="toggleMenu()"><span></span><span></span><span></span></div>
</nav>

<div class="mmenu" id="mm">
  <a href="#portfolio" onclick="closeMenu()">Work</a>
  <a href="#about" onclick="closeMenu()">About</a>
  <a href="#reviews" onclick="closeMenu()">Reviews</a>
  <a href="#contact" onclick="closeMenu()">Contact</a>
  <a href="https://www.omiflow.co.uk" target="_blank" class="mb">{{CTA_TEXT}}</a>
</div>

<section class="hero">
  <div class="hero-img"><img referrerpolicy="no-referrer" src="{{HERO_IMG}}" alt="{{BUSINESS_NAME}}" loading="eager"></div>
  <div class="hero-content">
    <div class="hero-left">
      <div class="hero-eyebrow"><span class="typewriter" id="tw"></span></div>
      <h1 class="hero-h1">{{HERO_H1}}</h1>
      <div class="hero-actions">
        <a href="https://www.omiflow.co.uk" target="_blank" class="btn-white">{{CTA_TEXT}}</a>
        <a href="#portfolio" class="btn-outline-w">View my work</a>
      </div>
    </div>
    <div class="hero-right">
      <div class="hero-stat"><div class="hs-n">{{STAT_1_NUM}}</div><div class="hs-l">{{STAT_1_LABEL}}</div></div>
      <div class="hero-stat"><div class="hs-n">{{STAT_2_NUM}}</div><div class="hs-l">{{STAT_2_LABEL}}</div></div>
      <div class="hero-stat"><div class="hs-n">{{STAT_3_NUM}}</div><div class="hs-l">{{STAT_3_LABEL}}</div></div>
    </div>
  </div>
</section>

<div class="ticker">
  <div class="ticker-track">
    <span class="ticker-item">{{BUSINESS_NAME}}</span>
    <span class="ticker-item">{{CITY}}</span>
    <span class="ticker-item">{{STAT_1_NUM}} {{STAT_1_LABEL}}</span>
    <span class="ticker-item">{{STAT_3_NUM}} {{STAT_3_LABEL}}</span>
    <span class="ticker-item">{{SERVICE_1_TITLE}}</span>
    <span class="ticker-item">{{SERVICE_2_TITLE}}</span>
    <span class="ticker-item">{{SERVICE_3_TITLE}}</span>
    <span class="ticker-item">{{BUSINESS_NAME}}</span>
    <span class="ticker-item">{{CITY}}</span>
    <span class="ticker-item">{{STAT_1_NUM}} {{STAT_1_LABEL}}</span>
    <span class="ticker-item">{{STAT_3_NUM}} {{STAT_3_LABEL}}</span>
    <span class="ticker-item">{{SERVICE_1_TITLE}}</span>
    <span class="ticker-item">{{SERVICE_2_TITLE}}</span>
    <span class="ticker-item">{{SERVICE_3_TITLE}}</span>
  </div>
</div>

<section class="portfolio-section" id="portfolio">
  <div class="portfolio-header rv">
    <div class="ph-left"><span class="section-tag">Selected work</span><h2 class="ph-h2">A story in<br><em>every frame</em></h2></div>
    <p class="ph-right rv d1">{{STAT_1_NUM}} {{STAT_1_LABEL}}. Each image is a moment that cannot be recreated.</p>
  </div>
  <!-- Hero image -->
  <div class="port-hero rv">
    <img referrerpolicy="no-referrer" src="{{PORTFOLIO_1_IMG}}" alt="Portfolio" loading="lazy">
    <div class="port-hero-label">
      <div class="phl-num">01</div>
      <div class="phl-info">
        <div class="phl-tag">{{PORTFOLIO_1_LOCATION}}</div>
        <div class="phl-title">{{PORTFOLIO_1_TITLE}}</div>
      </div>
    </div>
  </div>
  <!-- Three portrait shots -->
  <div class="port-trio">
    <div class="pt rv"><img referrerpolicy="no-referrer" src="{{PORTFOLIO_2_IMG}}" alt="" loading="lazy"><div class="pt-label"><div class="pt-num">02</div><div class="pt-title">{{PORTFOLIO_2_TITLE}}</div><div class="pt-loc">{{PORTFOLIO_2_LOC}}</div></div></div>
    <div class="pt rv d1"><img referrerpolicy="no-referrer" src="{{PORTFOLIO_3_IMG}}" alt="" loading="lazy"><div class="pt-label"><div class="pt-num">03</div><div class="pt-title">{{PORTFOLIO_3_TITLE}}</div><div class="pt-loc">{{PORTFOLIO_3_LOC}}</div></div></div>
    <div class="pt rv d2"><img referrerpolicy="no-referrer" src="{{PORTFOLIO_4_IMG}}" alt="" loading="lazy"><div class="pt-label"><div class="pt-num">04</div><div class="pt-title">{{PORTFOLIO_4_TITLE}}</div><div class="pt-loc">{{PORTFOLIO_4_LOC}}</div></div></div>
  </div>
  <!-- Two landscape shots -->
  <div class="port-duo">
    <div class="pd rv"><img referrerpolicy="no-referrer" src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=85" alt="" loading="lazy"><div class="pd-label"><div class="pd-left"><div class="pd-num">05</div><div class="pd-title">The reception</div><div class="pd-loc">London</div></div><div class="pd-arrow">&#8599;</div></div></div>
    <div class="pd rv d1"><img referrerpolicy="no-referrer" src="{{ABOUT_IMG}}" alt="" loading="lazy"><div class="pd-label"><div class="pd-left"><div class="pd-num">06</div><div class="pd-title">Golden hour</div><div class="pd-loc">Destination</div></div><div class="pd-arrow">&#8599;</div></div></div>
  </div>
  <div class="port-footer rv">
    <span class="pf-text">Every frame chosen with intention</span>
    <a href="https://www.omiflow.co.uk" target="_blank" class="pf-link">View full portfolio</a>
  </div>
</section>

<section class="about-section" id="about">
  <div class="about-grid">
    <div class="about-img rv"><img referrerpolicy="no-referrer" src="{{ABOUT_IMG}}" alt="{{BUSINESS_NAME}}"></div>
    <div class="about-right">
      <span class="section-tag rv">The studio</span>
      <h2 class="about-h2 rv d1">Created with intention, delivered with care</h2>
      <p class="about-body rv d2">{{ABOUT_PARA}}</p>
      <a href="https://www.omiflow.co.uk" target="_blank" class="about-cta rv d3">Check my availability &nbsp;&#8594;</a>
    </div>
  </div>
</section>

<section class="services-section" id="services">
  <span class="section-tag rv" style="font-size:11px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);margin-bottom:12px;display:block">Services</span>
  <h2 class="rv d1" style="font-family:var(--fd);font-size:clamp(28px,3.5vw,44px);font-style:italic;color:var(--text)">What I offer</h2>
  <div class="svc-list">
    <div class="svc-row rv d1"><div class="svc-i">01</div><div class="svc-title">{{SERVICE_1_TITLE}}</div><div class="svc-desc">{{SERVICE_1_DESC}}</div></div>
    <div class="svc-row rv d2"><div class="svc-i">02</div><div class="svc-title">{{SERVICE_2_TITLE}}</div><div class="svc-desc">{{SERVICE_2_DESC}}</div></div>
    <div class="svc-row rv d3"><div class="svc-i">03</div><div class="svc-title">{{SERVICE_3_TITLE}}</div><div class="svc-desc">Handcrafted Italian albums. The kind your grandchildren will look through.</div></div>
  </div>
</section>

<section class="reviews-section" id="reviews">
  <span class="section-tag rv" style="font-size:11px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);margin-bottom:12px;display:block">Kind words</span>
  <h2 class="rv d1" style="font-family:var(--fd);font-size:clamp(28px,3.5vw,44px);font-style:italic;color:var(--text)">What clients say</h2>
  <div class="reviews-grid">
    <div class="r-card rv d1"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_1_TEXT}}"</div><div class="r-author">— {{REVIEW_1_AUTHOR}}</div></div>
    <div class="r-card rv d2"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_2_TEXT}}"</div><div class="r-author">— {{REVIEW_2_AUTHOR}}</div></div>
    <div class="r-card rv d3"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_3_TEXT_START}} from now these will still feel alive."</div><div class="r-author">— {{REVIEW_3_AUTHOR}}</div></div>
  </div>
</section>

<section class="contact-section" id="contact">
  <div class="contact-grid">
    <div>
      <span class="section-tag rv" style="font-size:11px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);margin-bottom:12px;display:block">Get in touch</span>
      <h2 class="rv d1" style="font-family:var(--fd);font-size:clamp(28px,3.5vw,44px);font-style:italic;color:var(--text);margin-bottom:16px">Let's create something together</h2>
      <p style="font-size:14px;font-weight:300;color:var(--mid);line-height:1.8;margin-bottom:32px" class="rv d2">I take limited enquiries each season. If our work resonates, I would love to hear about your project.</p>
      <div class="cdetails rv d3">
        <div class="cdetail"><div class="cdl">Phone</div><div class="cdv">{{PHONE}}</div></div>
        <div class="cdetail"><div class="cdl">Email</div><div class="cdv" style="font-size:14px;font-family:var(--fb);font-style:normal">{{EMAIL}}</div></div>
        <div class="cdetail"><div class="cdl">Based in</div><div class="cdv">London</div></div>
      </div>
    </div>
    <div class="rv d2">
      <div class="cform">
        <div class="cform-title">Start a conversation</div>
        <div class="frow"><div class="fg"><label class="fl">First name</label><input class="fi" type="text" placeholder="Sarah"></div><div class="fg"><label class="fl">Last name</label><input class="fi" type="text" placeholder="Johnson"></div></div>
        <div class="fg"><label class="fl">Email</label><input class="fi" type="email" placeholder="sarah@example.com"></div>
        <div class="fg"><label class="fl">Tell me about your project</label><textarea class="fi" rows="4" placeholder="What are you looking to capture?"></textarea></div>
        <button class="fsub" id="fsub">{{CTA_TEXT}}</button>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="ft">
    <div><div class="flogo">{{BUSINESS_NAME}}</div><div class="ftag">{{TAGLINE}}</div></div>
    <div class="fnav"><a href="#portfolio">Work</a><a href="#about">About</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></div>
  </div>
  <div class="fbot">
    <span>© 2025 {{BUSINESS_NAME}}. All rights reserved.</span>
    <span class="fcredit">Site by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a></span>
  </div>
</footer>

<script>
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});
function toggleMenu(){document.getElementById('mm').classList.toggle('open')}
function closeMenu(){document.getElementById('mm').classList.remove('open')}
document.querySelectorAll('.rv').forEach(el=>el.classList.add('on'));
// Fallback: ensure all elements become visible even if observer misfires
setTimeout(()=>{document.querySelectorAll('.rv:not(.on)').forEach(el=>el.classList.add('on'));},1800);
const tw=document.getElementById('tw');
const phrases=['Wedding photography · London','Documentary storytelling since 2014'];
let pi=0,ci=0,del=false,w=0;
function tick(){const p=phrases[pi];if(!del){tw.textContent=p.slice(0,++ci);if(ci===p.length){del=true;w=0;setTimeout(tick,2200);return}}else{if(w<4){w++;setTimeout(tick,55);return}tw.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(tick,350);return}}setTimeout(tick,del?40:62)}
tick();
document.getElementById('fsub').addEventListener('click',e=>{e.preventDefault();window.open('https://www.omiflow.co.uk','_blank')});
<\\\\/script>
</body>
</html>
`

const TEMPLATE_SOLICITORS = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="referrer" content="no-referrer">
<title>{{BUSINESS_NAME}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --p:#2563eb;
  --a:#1e2d4a;
  --bg:#f8f9fc;
  --white:#ffffff;
  --slate:#1e2d4a;
  --blue-soft:#eef2f9;
  --text:#0f1923;
  --mid:#5a6473;
  --soft:#94a3b8;
  --border:#e2e8f0;
  --fd:'Instrument Serif',Georgia,serif;
  --fb:'Inter',system-ui,sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--bg);color:var(--text);font-family:var(--fb);line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{display:block;width:100%;object-fit:cover}
a{text-decoration:none;color:inherit}

/* DEMO BAR */
.db{position:fixed;top:0;left:0;right:0;z-index:300;background:#111;color:#c8f155;font-family:var(--fb);font-size:11px;text-align:center;padding:7px 16px;display:flex;align-items:center;justify-content:center;gap:10px}
.db-dot{width:5px;height:5px;border-radius:50%;background:#c8f155;animation:blink 2s ease-in-out infinite;flex-shrink:0}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
.db a{color:#c8f155;border-bottom:1px solid rgba(200,241,85,.4)}

/* NAV */
nav{position:fixed;top:30px;left:0;right:0;z-index:200;padding:0 56px;height:60px;display:flex;align-items:center;justify-content:space-between;background:rgba(248,249,252,.96);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);transition:all .3s}
.nav-logo{font-family:var(--fd);font-size:18px;font-weight:400;color:var(--text)}
.nav-links{display:flex;align-items:center;gap:28px;list-style:none}
.nav-links a{font-size:13px;font-weight:400;color:var(--mid);transition:color .2s}
.nav-links a:hover{color:var(--text)}
.nav-btn{background:var(--slate);color:#fff;padding:10px 24px;border-radius:100px;font-size:12px;font-weight:600;transition:all .2s;letter-spacing:.02em}
.nav-btn:hover{background:var(--p)}
.burger{display:none;flex-direction:column;gap:5px;cursor:pointer}
.burger span{display:block;width:22px;height:1.5px;background:var(--text)}
.mmenu{display:none;position:fixed;top:30px;left:0;right:0;bottom:0;background:var(--white);z-index:199;padding:80px 32px 40px;flex-direction:column}
.mmenu.open{display:flex}
.mmenu a{font-family:var(--fd);font-size:26px;color:var(--text);padding:13px 0;border-bottom:1px solid var(--border)}
.mmenu .mb{margin-top:24px;background:var(--slate);color:#fff;text-align:center;padding:14px;border-radius:8px;font-family:var(--fb);font-size:13px;font-weight:600;border-bottom:none!important;display:block}

/* HERO — Iceland/Nordicus inspired: full-bleed photo, frosted glass left panel */
.hero{min-height:100vh;position:relative;display:flex;align-items:center;padding-top:92px;overflow:hidden}
/* full-bleed photo behind everything */
.hero-bg-img{position:absolute;inset:0;z-index:0}
.hero-bg-img img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:brightness(.75)}
.hero-bg-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(10,18,40,.85) 0%,rgba(10,18,40,.55) 50%,rgba(10,18,40,.15) 100%)}
.hero-l{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;padding:80px 56px 80px 80px;max-width:620px}
/* pill badge */
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.12);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.2);border-radius:100px;padding:7px 16px 7px 10px;font-size:11px;font-weight:500;color:rgba(255,255,255,.85);margin-bottom:28px;letter-spacing:.04em;opacity:0;animation:fu .7s ease forwards .1s}
.badge-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px rgba(74,222,128,.8)}
.typewriter{white-space:nowrap}
.hero-h1{font-family:var(--fd);font-size:clamp(40px,4.5vw,68px);font-weight:400;line-height:1.08;color:#fff;margin-bottom:20px;opacity:0;animation:fu .7s ease forwards .25s}
.hero-h1 em{font-style:italic;color:#7eb8ff}
.hero-sub{font-size:15px;font-weight:300;color:rgba(255,255,255,.65);line-height:1.8;max-width:400px;margin-bottom:36px;opacity:0;animation:fu .7s ease forwards .4s}
.hero-ctas{display:flex;gap:12px;align-items:center;flex-wrap:wrap;opacity:0;animation:fu .7s ease forwards .55s}
.btn-dark{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--slate);padding:14px 28px;border-radius:100px;font-size:13px;font-weight:700;transition:all .2s;letter-spacing:.01em}
.btn-dark:hover{background:var(--bg);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
.btn-light{display:inline-flex;align-items:center;font-size:13px;font-weight:400;color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.3);padding:13px 24px;border-radius:100px;transition:all .2s}
.btn-light:hover{border-color:rgba(255,255,255,.7);color:#fff}
/* trust pills */
.hero-trust{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px;opacity:0;animation:fu .7s ease forwards .7s}
.trust-pill{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:400;color:rgba(255,255,255,.7);padding:5px 12px;background:rgba(255,255,255,.1);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);border-radius:100px}
.tp-icon{font-size:10px;color:rgba(255,255,255,.5)}
/* Hero right — floating stat cards in photo area */
.hero-r{position:absolute;right:60px;bottom:60px;z-index:2;display:flex;flex-direction:column;gap:12px;opacity:0;animation:fu .7s ease forwards .85s}
.hero-photo-wrap{display:none}/* hidden on this version */
.hstat-card{background:rgba(255,255,255,.14);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.25);border-radius:16px;padding:16px 22px;min-width:160px}
.hstat-n{font-family:var(--fd);font-size:30px;font-style:italic;color:#fff;line-height:1;margin-bottom:3px}
.hstat-l{font-size:10px;font-weight:400;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.55)}

/* STATS STRIP */
.stats-strip{background:var(--slate);display:grid;grid-template-columns:repeat(3,1fr)}
.ss{padding:28px 40px;border-right:1px solid rgba(255,255,255,.08);text-align:center}
.ss:last-child{border-right:none}
.ss-n{font-family:var(--fd);font-size:34px;font-style:italic;color:#fff;line-height:1;margin-bottom:4px}
.ss-l{font-size:11px;font-weight:400;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4)}

/* SECTION */
.section{padding:96px 80px}
.stag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--p);margin-bottom:14px}
.stag::before{content:'';width:20px;height:2px;background:var(--p);border-radius:2px}
.sh2{font-family:var(--fd);font-size:clamp(32px,4vw,52px);font-weight:400;color:var(--text);margin-bottom:16px;line-height:1.1;letter-spacing:-.01em}
.sh2 em{font-style:italic}

/* SERVICES */
.services-section{background:var(--white)}
.svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
.svc{background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:36px;transition:all .3s;position:relative;overflow:hidden}
.svc::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--p);transform:scaleY(0);transform-origin:bottom;transition:transform .3s}
.svc:hover::before{transform:scaleY(1)}
.svc:hover{border-color:var(--p);box-shadow:0 8px 32px rgba(30,45,74,.08);transform:translateY(-2px)}
.svc-icon{width:44px;height:44px;background:var(--slate);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:20px;color:#fff;transition:background .3s}
.svc-title{font-family:var(--fd);font-size:23px;font-weight:400;color:var(--text);margin-bottom:12px;line-height:1.2}
.svc-desc{font-size:13px;font-weight:300;color:var(--mid);line-height:1.75}

/* PROCESS */
.process-section{background:var(--bg)}
.process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:48px}
.ps{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:36px;position:relative;overflow:hidden;transition:box-shadow .3s}
.ps:hover{box-shadow:0 8px 32px rgba(30,45,74,.08)}
.ps::before{content:attr(data-num);position:absolute;top:-12px;right:16px;font-family:var(--fd);font-size:88px;font-style:italic;color:rgba(30,45,74,.04);line-height:1}
.ps-title{font-family:var(--fd);font-size:20px;font-weight:400;color:var(--text);margin-bottom:10px}
.ps-desc{font-size:13px;font-weight:300;color:var(--mid);line-height:1.75}

/* REVIEWS */
.reviews-section{background:var(--white)}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.r-card{background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:32px;transition:background .3s}
.r-card:hover{background:rgba(255,255,255,.1)}
.r-stars{display:flex;gap:3px;margin-bottom:12px}
.r-star{color:#f59e0b;font-size:12px}
.r-text{font-family:var(--fd);font-size:17px;font-style:italic;color:var(--text);line-height:1.55;margin-bottom:14px}
.r-author{font-size:11px;font-weight:500;color:var(--soft);letter-spacing:.04em}

/* CONTACT */
.contact-section{background:var(--bg)}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;max-width:1060px;margin:0 auto;align-items:start}
.cform{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,.04)}
.cform-title{font-family:var(--fd);font-size:22px;color:var(--text);margin-bottom:24px}
.fg{margin-bottom:13px}
.fl{font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--mid);display:block;margin-bottom:4px}
.fi{width:100%;padding:11px 13px;border:1.5px solid var(--border);border-radius:8px;font-family:var(--fb);font-size:13px;color:var(--text);background:var(--bg);outline:none;font-weight:300;transition:border-color .2s}
.fi:focus{border-color:var(--p)}
.fi::placeholder{color:var(--soft)}
textarea.fi{resize:none}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fsub{width:100%;padding:13px;background:var(--slate);color:#fff;border:none;border-radius:100px;font-family:var(--fb);font-size:13px;font-weight:600;cursor:pointer;margin-top:8px;transition:all .2s}
.fsub:hover{background:var(--p);transform:translateY(-1px)}
.cdetails{margin-top:16px}
.cdetail{padding:16px 0;border-bottom:1px solid var(--border);display:flex;gap:14px;align-items:flex-start}
.cdetail:last-child{border-bottom:none}
.cd-icon{width:36px;height:36px;background:var(--blue-soft);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.cdl{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--p);margin-bottom:3px}
.cdv{font-size:14px;font-weight:300;color:var(--text)}

/* FOOTER */
footer{background:var(--slate);padding:48px 80px 24px}
.ft{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:22px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:18px;gap:32px;flex-wrap:wrap}
.flogo{font-family:var(--fd);font-size:18px;color:#fff;margin-bottom:4px}
.ftag{font-size:12px;font-weight:300;color:rgba(255,255,255,.3)}
.fnav{display:flex;gap:24px;flex-wrap:wrap}
.fnav a{font-size:12px;color:rgba(255,255,255,.35);transition:color .2s}
.fnav a:hover{color:#fff}
.fbot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:11px;color:rgba(255,255,255,.2)}
.fcredit a{color:#c8f155;border-bottom:1px solid rgba(200,241,85,.3);padding-bottom:1px}

.rv{opacity:0;transform:translateY(16px);transition:opacity .65s ease,transform .65s ease}
.rv.on{opacity:1;transform:none}
.d1{transition-delay:.07s}.d2{transition-delay:.14s}.d3{transition-delay:.21s}.d4{transition-delay:.28s}

@media(max-width:900px){
  nav{padding:0 24px}
  .nav-links{display:none}
  .burger{display:flex}
  .hero{min-height:auto}
  .hero-l{padding:48px 24px 48px;max-width:100%}
  .hero-r{position:static;display:flex;flex-direction:column;gap:10px;padding:0 24px 40px;opacity:1;animation:none}
  .hstat-card{display:flex;align-items:center;gap:16px;padding:14px 20px;border-radius:14px}
  .hstat-n{font-size:28px}
  .hstat-l{font-size:10px;letter-spacing:.08em;line-height:1.3}
  .btn-dark{white-space:nowrap}
  .btn-light{white-space:nowrap}
  .stats-strip{grid-template-columns:1fr 1fr 1fr}
  .ss{border-bottom:none;padding:18px 12px}
  .section{padding:60px 24px}
  .svc-grid{grid-template-columns:1fr}
  .process-grid{grid-template-columns:1fr 1fr;gap:12px}
  .reviews-grid{grid-template-columns:1fr;gap:14px}
  .reviews-section{padding:56px 24px}
  .contact-grid{grid-template-columns:1fr;gap:36px}
  footer{padding:36px 24px 20px}
  .ft{flex-direction:column;gap:12px}
}
@media(max-width:480px){
  .frow{grid-template-columns:1fr}
  .process-grid{grid-template-columns:1fr}
  .hero-h1{font-size:28px}
  .hero-r{gap:8px}
  .hstat-card{padding:12px 16px}
  .hstat-n{font-size:24px}
}
@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
</style>
</head>
<body>

<div class="db">
  <div class="db-dot"></div>
  Demo preview by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a>
  &nbsp;·&nbsp; Your site, rebuilt &nbsp;·&nbsp;
  <a href="https://www.omiflow.co.uk" target="_blank">See our work →</a>
</div>

<nav id="nav">
  <div class="nav-logo">{{BUSINESS_NAME}}</div>
  <ul class="nav-links">
    <li><a href="#services">Services</a></li>
    <li><a href="#process">Approach</a></li>
    <li><a href="#reviews">Reviews</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="https://www.omiflow.co.uk" target="_blank" class="nav-btn">{{CTA_TEXT}}</a></li>
  </ul>
  <div class="burger" id="burger" onclick="toggleMenu()"><span></span><span></span><span></span></div>
</nav>

<div class="mmenu" id="mm">
  <a href="#services" onclick="closeMenu()">Services</a>
  <a href="#process" onclick="closeMenu()">Approach</a>
  <a href="#reviews" onclick="closeMenu()">Reviews</a>
  <a href="#contact" onclick="closeMenu()">Contact</a>
  <a href="https://www.omiflow.co.uk" target="_blank" class="mb">{{CTA_TEXT}}</a>
</div>

<section class="hero">
  <div class="hero-bg-img"><img referrerpolicy="no-referrer" src="{{HERO_IMG}}" alt="{{BUSINESS_NAME}}" loading="eager"></div>
  <div class="hero-l">
    <div class="hero-badge"><div class="badge-dot"></div><span class="typewriter" id="tw"></span></div>
    <h1 class="hero-h1">{{HERO_H1}}</h1>
    <p class="hero-sub">{{HERO_SUB}}</p>
    <div class="hero-ctas">
      <a href="https://www.omiflow.co.uk" target="_blank" class="btn-dark">{{CTA_TEXT}}</a>
      <a href="#services" class="btn-light">Our services</a>
    </div>
    <div class="hero-trust">
      <span class="trust-pill"><span class="tp-icon">&#10003;</span>{{TRUST_1}}</span>
      <span class="trust-pill"><span class="tp-icon">&#10003;</span>{{TRUST_2}}</span>
      <span class="trust-pill"><span class="tp-icon">&#10003;</span>{{TRUST_3}}</span>
      <span class="trust-pill"><span class="tp-icon">&#10003;</span>{{TRUST_4}}</span>
    </div>
  </div>
  <div class="hero-r">
    <div class="hstat-card"><div class="hstat-n">{{STAT_1_NUM}}</div><div class="hstat-l">{{STAT_1_LABEL}}</div></div>
    <div class="hstat-card"><div class="hstat-n">{{STAT_2_NUM}}</div><div class="hstat-l">{{STAT_2_LABEL}}</div></div>
    <div class="hstat-card"><div class="hstat-n">{{STAT_3_NUM}}</div><div class="hstat-l">{{STAT_3_LABEL}}</div></div>
  </div>
</section>

<div class="stats-strip">
  <div class="ss rv"><div class="ss-n">{{STAT_1_NUM}}</div><div class="ss-l">{{STAT_1_LABEL}}</div></div>
  <div class="ss rv d1"><div class="ss-n">{{STAT_2_NUM}}</div><div class="ss-l">{{STAT_2_LABEL}}</div></div>
  <div class="ss rv d2"><div class="ss-n">{{STAT_3_NUM}}</div><div class="ss-l">{{STAT_3_LABEL}}</div></div>
</div>

<section class="services-section section" id="services">
  <div class="stag rv">What we do</div>
  <h2 class="sh2 rv d1">Expertise you can <em>rely on</em></h2>
  <p style="font-size:15px;font-weight:300;color:var(--mid);max-width:480px;line-height:1.75" class="rv d2">Every service delivered with care, clarity and the rigour our clients deserve.</p>
  <div class="svc-grid">
    <div class="svc rv d1"><div class="svc-icon">&#9673;</div><div class="svc-title">{{SERVICE_1_TITLE}}</div><div class="svc-desc">{{SERVICE_1_DESC}}</div></div>
    <div class="svc rv d2"><div class="svc-icon">&#8982;</div><div class="svc-title">{{SERVICE_2_TITLE}}</div><div class="svc-desc">{{SERVICE_2_DESC}}</div></div>
    <div class="svc rv d3"><div class="svc-icon">&#10052;</div><div class="svc-title">{{SERVICE_3_TITLE}}</div><div class="svc-desc">{{SERVICE_3_DESC}}</div></div>
  </div>
</section>

<section class="process-section section" id="process">
  <div class="stag rv">How we work</div>
  <h2 class="sh2 rv d1">A clear process, <em>every time</em></h2>
  <div class="process-grid">
    <div class="ps rv d1" data-num="01"><div class="ps-title">{{PROCESS_1}}</div><div class="ps-desc">{{PROCESS_1_DESC}}</div></div>
    <div class="ps rv d2" data-num="02"><div class="ps-title">{{PROCESS_2}}</div><div class="ps-desc">{{PROCESS_2_DESC}}</div></div>
    <div class="ps rv d3" data-num="03"><div class="ps-title">{{PROCESS_3}}</div><div class="ps-desc">{{PROCESS_3_DESC}}</div></div>
    <div class="ps rv d4" data-num="04"><div class="ps-title">{{PROCESS_4}}</div><div class="ps-desc">{{PROCESS_4_DESC}}</div></div>
  </div>
</section>

<section class="reviews-section section" id="reviews">
  <div class="stag rv" style="color:rgba(255,255,255,.4)">Client reviews</div>
  <h2 class="sh2 rv d1" style="color:#fff">Trusted by clients <em>across {{CITY}}</em></h2>
  <div class="reviews-grid">
    <div class="r-card rv d1"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_1_TEXT}}"</div><div class="r-author">— {{REVIEW_1_AUTHOR}}</div></div>
    <div class="r-card rv d2"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_2_TEXT}}"</div><div class="r-author">— {{REVIEW_2_AUTHOR}}</div></div>
    <div class="r-card rv d3"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_3_TEXT}}"</div><div class="r-author">— {{REVIEW_3_AUTHOR}}</div></div>
  </div>
</section>

<section class="contact-section section" id="contact">
  <div class="contact-grid">
    <div>
      <div class="stag rv">Contact</div>
      <h2 class="sh2 rv d1">Let's talk about <em>your situation</em></h2>
      <p style="font-size:14px;font-weight:300;color:var(--mid);line-height:1.8;margin-bottom:28px" class="rv d2">No commitment. Just a straightforward conversation about how we can help.</p>
      <div class="cdetails rv d3">
        <div class="cdetail"><div class="cd-icon">&#9742;</div><div><div class="cdl">Phone</div><div class="cdv">{{PHONE}}</div></div></div>
        <div class="cdetail"><div class="cd-icon">&#9993;</div><div><div class="cdl">Email</div><div class="cdv">{{EMAIL}}</div></div></div>
        <div class="cdetail"><div class="cd-icon">&#9675;</div><div><div class="cdl">Address</div><div class="cdv">12 Temple Row, Birmingham B2 5LG</div></div></div>
      </div>
    </div>
    <div class="rv d2">
      <div class="cform">
        <div class="cform-title">Get in touch</div>
        <div class="frow"><div class="fg"><label class="fl">First name</label><input class="fi" type="text" placeholder="James"></div><div class="fg"><label class="fl">Last name</label><input class="fi" type="text" placeholder="Wilson"></div></div>
        <div class="fg"><label class="fl">Email</label><input class="fi" type="email" placeholder="james@example.com"></div>
        <div class="fg"><label class="fl">Phone</label><input class="fi" type="tel" placeholder="07700 900 123"></div>
        <div class="fg"><label class="fl">How can we help?</label><textarea class="fi" rows="3" placeholder="Tell us briefly about your situation..."></textarea></div>
        <button class="fsub" id="fsub">{{CTA_TEXT}}</button>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="ft">
    <div><div class="flogo">{{BUSINESS_NAME}}</div><div class="ftag">{{TAGLINE}}</div></div>
    <div class="fnav"><a href="#services">Services</a><a href="#process">Approach</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></div>
  </div>
  <div class="fbot">
    <span>© 2025 {{BUSINESS_NAME}}. All rights reserved.</span>
    <span class="fcredit">Site by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a></span>
  </div>
</footer>

<script>
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{},{ passive:true });
function toggleMenu(){document.getElementById('mm').classList.toggle('open')}
function closeMenu(){document.getElementById('mm').classList.remove('open')}
document.querySelectorAll('.rv').forEach(el=>el.classList.add('on'));
// Fallback: ensure all elements become visible even if observer misfires
setTimeout(()=>{document.querySelectorAll('.rv:not(.on)').forEach(el=>el.classList.add('on'));},1800);
const tw=document.getElementById('tw');
const phrases=['Independent solicitors · Birmingham','Family law, property and wills specialists'];
let pi=0,ci=0,del=false,w=0;
function tick(){const p=phrases[pi];if(!del){tw.textContent=p.slice(0,++ci);if(ci===p.length){del=true;w=0;setTimeout(tick,2200);return}}else{if(w<4){w++;setTimeout(tick,55);return}tw.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(tick,350);return}}setTimeout(tick,del?40:62)}
tick();
document.getElementById('fsub').addEventListener('click',e=>{e.preventDefault();window.open('https://www.omiflow.co.uk','_blank')});
<\\\\/script>
</body>
</html>
`

const TEMPLATE_MEDSPAS = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="referrer" content="no-referrer">
<title>{{BUSINESS_NAME}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet">
<style>
:root{
  --p:#8b5cf6;
  --a:#b8935a;
  --bg:#fdf9f4;
  --ivory:#f7f1e9;
  --sand:#ede4d5;
  --gold:#b8915a;
  --gold-l:#d4ae82;
  --dark:#1e1810;
  --text:#1e1a14;
  --mid:#7a6e60;
  --soft:#b5a894;
  --border:#e4d9c8;
  --fd:'Cormorant',Georgia,serif;
  --fb:'Jost',system-ui,sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--bg);color:var(--text);font-family:var(--fb);font-weight:300;line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{display:block;width:100%;object-fit:cover}
a{text-decoration:none;color:inherit}

/* DEMO BAR */
.db{position:fixed;top:0;left:0;right:0;z-index:300;background:#111;color:#c8f155;font-family:var(--fb);font-size:11px;text-align:center;padding:7px 16px;display:flex;align-items:center;justify-content:center;gap:10px}
.db-dot{width:5px;height:5px;border-radius:50%;background:#c8f155;animation:blink 2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
.db a{color:#c8f155;border-bottom:1px solid rgba(200,241,85,.4)}

/* NAV */
nav{position:fixed;top:30px;left:0;right:0;z-index:200;padding:0 60px;height:60px;display:flex;align-items:center;justify-content:space-between;transition:all .35s}
nav.scrolled{background:rgba(253,249,244,.97);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
.nav-logo{font-family:var(--fd);font-size:18px;font-weight:300;letter-spacing:.1em;text-transform:uppercase;color:#fff;transition:color .3s}
nav.scrolled .nav-logo{color:var(--text)}
.nav-links{display:flex;align-items:center;gap:28px;list-style:none}
.nav-links a{font-size:12px;font-weight:300;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.62);transition:color .2s}
nav.scrolled .nav-links a{color:var(--mid)}
.nav-links a:hover{color:#fff}
nav.scrolled .nav-links a:hover{color:var(--text)}
.nav-btn{border:1px solid rgba(255,255,255,.32)!important;color:rgba(255,255,255,.82)!important;padding:9px 22px;border-radius:100px;font-size:11px!important;letter-spacing:.1em!important;text-transform:uppercase!important;transition:all .2s!important}
nav.scrolled .nav-btn{border-color:var(--gold)!important;color:var(--gold)!important}
.burger{display:none;flex-direction:column;gap:5px;cursor:pointer}
.burger span{display:block;width:22px;height:1px;background:#fff;transition:background .3s}
nav.scrolled .burger span{background:var(--text)}
.mmenu{display:none;position:fixed;top:30px;left:0;right:0;bottom:0;background:var(--bg);z-index:199;padding:80px 32px 40px;flex-direction:column}
.mmenu.open{display:flex}
.mmenu a{font-family:var(--fd);font-size:26px;font-style:italic;color:var(--text);padding:13px 0;border-bottom:1px solid var(--border)}
.mmenu .mb{margin-top:20px;border:1px solid var(--gold);color:var(--gold);text-align:center;padding:14px;border-radius:100px;font-family:var(--fb);font-size:11px;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid var(--gold)!important;display:block}

/* ── HERO ─────────────────────────────────────────────────────────────── */
.hero{min-height:100vh;position:relative;display:flex;align-items:flex-end;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-bg img{height:100%;width:100%;object-position:center}
.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(20,14,8,.88) 0%,rgba(20,14,8,.42) 55%,rgba(20,14,8,.08) 100%)}
.hero-content{position:relative;z-index:2;width:100%;display:grid;grid-template-columns:1fr auto;gap:48px;align-items:flex-end;padding:0 80px 64px}
.hero-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:16px;opacity:0;animation:fu .8s ease forwards .1s}
.he-line{width:24px;height:1px;background:var(--gold-l)}
.he-text{font-size:10px;font-weight:300;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.5)}
.typewriter{white-space:nowrap}
.hero-h1{font-family:var(--fd);font-size:clamp(44px,5.5vw,82px);font-style:italic;font-weight:400;line-height:1.05;color:#fff;margin-bottom:20px;opacity:0;animation:fu .8s ease forwards .25s}
.hero-sub{font-size:14px;font-weight:200;color:rgba(255,255,255,.55);line-height:1.85;max-width:420px;margin-bottom:32px;opacity:0;animation:fu .8s ease forwards .4s}
.hero-btns{display:flex;gap:12px;align-items:center;flex-wrap:wrap;opacity:0;animation:fu .8s ease forwards .55s}
.btn-gold{display:inline-flex;align-items:center;background:var(--gold);color:#fff;padding:13px 28px;border-radius:100px;font-size:11px;font-weight:400;letter-spacing:.08em;text-transform:uppercase;transition:all .2s;white-space:nowrap}
.btn-gold:hover{background:#a07848;transform:translateY(-2px)}
.btn-ghost{display:inline-flex;align-items:center;color:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.24);padding:12px 22px;border-radius:100px;font-size:11px;font-weight:300;letter-spacing:.08em;text-transform:uppercase;transition:all .2s;white-space:nowrap}
.btn-ghost:hover{color:#fff;border-color:rgba(255,255,255,.6)}
/* hero right — glass pills */
.hero-right{display:flex;flex-direction:column;gap:10px;flex-shrink:0;opacity:0;animation:fu .8s ease forwards .7s}
.hpill{background:rgba(255,255,255,.1);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.18);border-radius:100px;padding:10px 20px;display:flex;align-items:center;gap:10px;white-space:nowrap}
.hp-dot{width:5px;height:5px;border-radius:50%;background:var(--gold-l);flex-shrink:0}
.hp-text{font-size:11px;font-weight:300;color:rgba(255,255,255,.78);letter-spacing:.04em}

/* ── STATS STRIP ──────────────────────────────────────────────────────── */
.stats-strip{background:var(--sand);display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--border)}
.ss{padding:28px 40px;border-right:1px solid var(--border);text-align:center}
.ss:last-child{border-right:none}
.ss-n{font-family:var(--fd);font-size:36px;font-style:italic;font-weight:300;color:var(--gold);line-height:1;margin-bottom:4px}
.ss-l{font-size:10px;font-weight:400;letter-spacing:.12em;text-transform:uppercase;color:var(--soft)}

/* ── SHARED SECTION ───────────────────────────────────────────────────── */
.section{padding:96px 80px}
.stag{font-size:10px;font-weight:400;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:12px;margin-bottom:16px}
.stag::after{content:'';width:32px;height:1px;background:var(--gold-l);flex-shrink:0}
.sh2{font-family:var(--fd);font-size:clamp(36px,4.5vw,62px);font-style:italic;font-weight:400;color:var(--text);margin-bottom:18px;line-height:1.05}
.body-txt{font-size:15px;font-weight:300;color:rgba(255,255,255,.55);line-height:1.85}

/* ── TREATMENTS: dark glass cards ─────────────────────────────────────── */
.treat-sec{padding:96px 80px;background:linear-gradient(160deg,#2a1d12 0%,#1c1108 50%,#251a0e 100%);position:relative;overflow:hidden}
.treat-sec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 25% 50%,rgba(184,145,90,.15) 0%,transparent 70%);pointer-events:none}
.treat-sec .stag{color:var(--gold-l)}
.treat-sec .stag::after{background:rgba(212,174,130,.35)}
.treat-sec .sh2{color:#fff}
.treat-sec .body-txt{color:rgba(255,255,255,.45)}
.treat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:48px}
.treat-card{background:rgba(255,255,255,.07);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.11);border-radius:20px;padding:40px 36px;transition:all .3s;position:relative;overflow:hidden}
.treat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,174,130,.07) 0%,transparent 55%);pointer-events:none}
.treat-card:hover{background:rgba(255,255,255,.11);border-color:rgba(212,174,130,.32);transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.32)}
.treat-from{font-size:10px;font-weight:300;letter-spacing:.16em;text-transform:uppercase;color:rgba(212,174,130,.7);margin-bottom:6px}
.treat-price{font-family:var(--fd);font-size:32px;font-style:italic;font-weight:400;color:var(--gold-l);margin-bottom:8px}
.treat-name{font-family:var(--fd);font-size:22px;font-weight:300;letter-spacing:.04em;color:#fff;margin-bottom:14px}
.treat-desc{font-size:13px;font-weight:200;color:rgba(255,255,255,.48);line-height:1.85;margin-bottom:20px}
.treat-link{font-size:10px;font-weight:400;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-l);border-bottom:1px solid rgba(212,174,130,.28);padding-bottom:2px;display:inline-block;transition:border-color .2s}
.treat-link:hover{border-color:var(--gold-l)}

/* ── ABOUT: image fills left column ──────────────────────────────────── */
.about-sec{background:var(--dark);position:relative;overflow:hidden}
.about-bg{position:absolute;inset:0;z-index:0}
.about-bg img{width:100%;height:100%;object-fit:cover;filter:brightness(.35)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:stretch;min-height:640px;position:relative;z-index:1}
.about-imgs{position:relative;min-height:480px}
.ai-main{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:72%;aspect-ratio:4/3;overflow:hidden;border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.5)}
.ai-main img{width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
.ai-main:hover img{transform:scale(1.03)}
.ai-accent{display:none}
.about-txt{padding:80px 64px;display:flex;flex-direction:column;justify-content:center}
.about-h2{font-family:var(--fd);font-size:clamp(34px,4vw,58px);font-style:italic;font-weight:400;color:#fff;line-height:1.1;margin:14px 0 24px}

/* ── REVIEWS: sand bg, white cards ───────────────────────────────────── */
.reviews-sec{background:var(--sand);padding:100px 80px}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.r-card{background:#fff;border:1px solid var(--border);border-radius:20px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,.05);transition:transform .25s,box-shadow .25s;position:relative}
.r-card::before{content:'\\\\\\\\201C';position:absolute;top:16px;right:20px;font-family:var(--fd);font-size:64px;line-height:1;color:rgba(184,145,90,.14)}
.r-card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,.1)}
.r-stars{display:flex;gap:3px;margin-bottom:14px}
.r-star{color:var(--gold);font-size:12px}
.r-text{font-size:18px;font-weight:400;font-style:italic;color:var(--text);line-height:1.6;margin-bottom:20px;font-family:var(--fd)}
.r-author{font-size:10px;font-weight:400;letter-spacing:.1em;text-transform:uppercase;color:var(--soft);margin-bottom:2px}
.r-treatment{font-size:11px;font-weight:300;color:var(--gold)}

/* ── CTA STRIP ────────────────────────────────────────────────────────── */
.cta-strip{background:var(--gold);padding:80px;text-align:center}
.cta-strip-h{font-family:var(--fd);font-size:clamp(32px,4vw,58px);font-style:italic;font-weight:400;color:#fff;margin-bottom:12px}
.cta-strip-sub{font-size:13px;font-weight:200;color:rgba(255,255,255,.68);margin-bottom:32px;letter-spacing:.04em}
.btn-white{display:inline-flex;align-items:center;background:#fff;color:var(--gold);padding:15px 40px;border-radius:100px;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;transition:all .2s}
.btn-white:hover{background:var(--ivory);transform:translateY(-2px)}

/* ── CONTACT ──────────────────────────────────────────────────────────── */
.contact-sec{background:var(--bg)}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;max-width:1040px;margin:0 auto;align-items:start}
.cform{background:var(--ivory);border:1px solid var(--border);border-radius:16px;padding:48px}
.cform-title{font-family:var(--fd);font-size:22px;font-style:italic;font-weight:300;color:var(--text);margin-bottom:28px}
.fg{margin-bottom:13px}
.fl{font-size:10px;font-weight:400;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);display:block;margin-bottom:4px}
.fi{width:100%;padding:11px 0;border:none;border-bottom:1.5px solid var(--border);font-family:var(--fb);font-size:13px;color:var(--text);background:transparent;outline:none;font-weight:200;transition:border-color .2s}
.fi:focus{border-color:var(--gold)}
.fi::placeholder{color:var(--sand)}
textarea.fi{resize:none}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.fsub{width:100%;padding:14px;background:var(--gold);color:#fff;border:none;border-radius:100px;font-family:var(--fb);font-size:11px;font-weight:400;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;margin-top:10px;transition:all .2s}
.fsub:hover{background:#a07848;transform:translateY(-1px)}
.cinfo{margin-top:12px}
.cinfo-item{padding:18px 0;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:4px}
.cinfo-item:first-child{border-top:1px solid var(--border)}
.cil{font-size:10px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:2px}
.civ{font-size:14px;font-weight:200;color:var(--text)}

/* ── FOOTER ───────────────────────────────────────────────────────────── */
footer{background:var(--dark);padding:48px 80px 24px}
.ft{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:22px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:18px;gap:32px;flex-wrap:wrap}
.flogo{font-family:var(--fd);font-size:17px;font-weight:300;letter-spacing:.1em;text-transform:uppercase;color:#fff;margin-bottom:4px}
.ftag{font-size:12px;font-weight:200;font-style:italic;color:rgba(255,255,255,.24)}
.fnav{display:flex;gap:22px;flex-wrap:wrap}
.fnav a{font-size:11px;font-weight:200;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.28);transition:color .2s}
.fnav a:hover{color:#fff}
.fbot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:11px;color:rgba(255,255,255,.17)}
.fcredit a{color:#c8f155;border-bottom:1px solid rgba(200,241,85,.3);padding-bottom:1px}

/* ── REVEAL ───────────────────────────────────────────────────────────── */
.rv{opacity:0;transform:translateY(16px);transition:opacity .7s ease,transform .7s ease}
.rv.on{opacity:1;transform:none}
.d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}.d4{transition-delay:.32s}

/* ── RESPONSIVE ──────────────────────────────────────────────────────── */
@media(max-width:900px){
  nav{padding:0 24px}
  .nav-links{display:none}
  .burger{display:flex}
  .hero-content{grid-template-columns:1fr;padding:0 24px 52px;gap:16px}
  .hero-right{flex-direction:row;flex-wrap:wrap}
  .stats-strip{grid-template-columns:1fr}
  .ss{border-right:none;border-bottom:1px solid var(--border);padding:18px 24px}
  .section,.treat-sec,.contact-sec{padding:64px 24px}
  .treat-grid{grid-template-columns:1fr}
  .about-grid{grid-template-columns:1fr;min-height:auto}
  .about-imgs{min-height:280px}
  .ai-main{width:72%;position:relative;transform:none;top:auto;left:auto;margin:40px auto}
  .about-txt{padding:48px 24px}
  .reviews-grid{grid-template-columns:1fr;gap:14px}
  .cta-strip{padding:56px 24px}
  .contact-grid{grid-template-columns:1fr;gap:36px}
  footer{padding:36px 24px 20px}
  .ft{flex-direction:column;gap:12px}
}
@media(max-width:480px){
  .frow{grid-template-columns:1fr}
  .hero-h1{font-size:38px}
  .hero-right{display:none}
}
@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
</style>
</head>
<body>

<div class="db"><div class="db-dot"></div>Demo preview by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a>&nbsp;·&nbsp;Your site, rebuilt&nbsp;·&nbsp;<a href="https://www.omiflow.co.uk" target="_blank">See our work →</a></div>

<nav id="nav">
  <div class="nav-logo">{{BUSINESS_NAME}}</div>
  <ul class="nav-links">
    <li><a href="#treatments">Treatments</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#reviews">Reviews</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="https://www.omiflow.co.uk" target="_blank" class="nav-btn">{{CTA_TEXT}}</a></li>
  </ul>
  <div class="burger" id="burger" onclick="toggleMenu()"><span></span><span></span><span></span></div>
</nav>
<div class="mmenu" id="mm">
  <a href="#treatments" onclick="closeMenu()">Treatments</a>
  <a href="#about" onclick="closeMenu()">About</a>
  <a href="#reviews" onclick="closeMenu()">Reviews</a>
  <a href="#contact" onclick="closeMenu()">Contact</a>
  <a href="https://www.omiflow.co.uk" target="_blank" class="mb">{{CTA_TEXT}}</a>
</div>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-bg"><img referrerpolicy="no-referrer" src="{{HERO_IMG}}" alt="{{BUSINESS_NAME}}" loading="eager"></div>
  <div class="hero-content">
    <div class="hero-left">
      <div class="hero-eyebrow"><div class="he-line"></div><span class="he-text"><span class="typewriter" id="tw"></span></span></div>
      <h1 class="hero-h1">{{HERO_H1}}</h1>
      <p class="hero-sub">{{HERO_SUB}}</p>
      <div class="hero-btns">
        <a href="https://www.omiflow.co.uk" target="_blank" class="btn-gold">{{CTA_TEXT}}</a>
        <a href="#treatments" class="btn-ghost">View treatments</a>
      </div>
    </div>
    <div class="hero-right">
      <div class="hpill"><div class="hp-dot"></div><span class="hp-text">{{TRUST_1}}</span></div>
      <div class="hpill"><div class="hp-dot"></div><span class="hp-text">{{TRUST_2}}</span></div>
      <div class="hpill"><div class="hp-dot"></div><span class="hp-text">{{TRUST_3}}</span></div>
    </div>
  </div>
</section>

<!-- STATS STRIP -->
<div class="stats-strip">
  <div class="ss rv"><div class="ss-n">{{STAT_1_NUM}}</div><div class="ss-l">{{STAT_1_LABEL}}</div></div>
  <div class="ss rv d1"><div class="ss-n">{{STAT_2_NUM}}</div><div class="ss-l">{{STAT_2_LABEL}}</div></div>
  <div class="ss rv d2"><div class="ss-n">{{STAT_3_NUM}}</div><div class="ss-l">{{STAT_3_LABEL}}</div></div>
</div>

<!-- TREATMENTS -->
<section class="treat-sec" id="treatments">
  <div class="stag rv">Our treatments</div>
  <h2 class="sh2 rv d1">Results you can <em>see and feel</em></h2>
  <p class="body-txt rv d2" style="max-width:440px">Every treatment tailored precisely to you — never a one-size approach.</p>
  <div class="treat-grid">
    <div class="treat-card rv d1"><div class="treat-from">Starting from</div><div class="treat-price">{{TREATMENT_1_FROM}}</div><div class="treat-name">{{TREATMENT_1_TITLE}}</div><div class="treat-desc">{{TREATMENT_1_DESC}}</div><a href="https://www.omiflow.co.uk" target="_blank" class="treat-link">Book this treatment</a></div>
    <div class="treat-card rv d2"><div class="treat-from">Starting from</div><div class="treat-price">{{TREATMENT_2_FROM}}</div><div class="treat-name">{{TREATMENT_2_TITLE}}</div><div class="treat-desc">{{TREATMENT_2_DESC}}</div><a href="https://www.omiflow.co.uk" target="_blank" class="treat-link">Book this treatment</a></div>
    <div class="treat-card rv d3"><div class="treat-from">Starting from</div><div class="treat-price">{{TREATMENT_3_FROM}}</div><div class="treat-name">{{TREATMENT_3_TITLE}}</div><div class="treat-desc">{{TREATMENT_3_DESC}}</div><a href="https://www.omiflow.co.uk" target="_blank" class="treat-link">Book this treatment</a></div>
    <div class="treat-card rv d4"><div class="treat-from">Starting from</div><div class="treat-price">{{TREATMENT_4_FROM}}</div><div class="treat-name">{{TREATMENT_4_TITLE}}</div><div class="treat-desc">{{TREATMENT_4_DESC}}</div><a href="https://www.omiflow.co.uk" target="_blank" class="treat-link">Book this treatment</a></div>
  </div>
</section>

<!-- ABOUT -->
<section class="about-sec" id="about">
  <div class="about-bg"><img referrerpolicy="no-referrer" src="{{TEAM_IMG}}" alt="Background"></div>
  <div class="about-grid">
    <div class="about-imgs rv">
      <div class="ai-main"><img referrerpolicy="no-referrer" src="{{INTERIOR_IMG}}" alt="Interior"></div>
    </div>
    <div class="about-txt">
      <div class="stag rv">The clinic</div>
      <h2 class="about-h2 rv d1">Where science meets <em>artistry</em></h2>
      <p class="body-txt rv d2" style="margin-bottom:20px">{{BUSINESS_NAME}} is Scottsdale's destination for precision aesthetic medicine. Our board-certified team combines clinical expertise with an artist's eye — every result is natural, every plan is yours alone.</p>
      <p class="body-txt rv d3" style="margin-bottom:32px">Every consultation is private. Every treatment plan is yours alone.</p>
      <a href="https://www.omiflow.co.uk" target="_blank" class="btn-gold rv d4" style="width:fit-content">{{CTA_TEXT}}</a>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section class="reviews-sec section" id="reviews">
  <div class="stag rv" style="color:var(--gold)">Client stories</div>
  <h2 class="sh2 rv d1" style="color:var(--text)">Real results, <em>real people</em></h2>
  <div class="reviews-grid">
    <div class="r-card rv d1"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_1_TEXT}}"</div><div class="r-author">{{REVIEW_1_AUTHOR}}</div><div class="r-treatment">{{REVIEW_1_TREATMENT}}</div></div>
    <div class="r-card rv d2"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_2_TEXT}}"</div><div class="r-author">{{REVIEW_2_AUTHOR}}</div><div class="r-treatment">{{REVIEW_2_TREATMENT}}</div></div>
    <div class="r-card rv d3"><div class="r-stars"><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span><span class="r-star">&#9733;</span></div><div class="r-text">"{{REVIEW_3_TEXT}}"</div><div class="r-author">{{REVIEW_3_AUTHOR}}</div><div class="r-treatment">{{REVIEW_3_TREATMENT}}</div></div>
  </div>
</section>

<!-- CTA STRIP -->
<div class="cta-strip rv">
  <h2 class="cta-strip-h">Ready to begin your journey?</h2>
  <p class="cta-strip-sub">Complimentary consultations. Private. No commitment.</p>
  <a href="https://www.omiflow.co.uk" target="_blank" class="btn-white">{{CTA_TEXT}}</a>
</div>

<!-- CONTACT -->
<section class="contact-sec section" id="contact">
  <div class="contact-grid">
    <div>
      <div class="stag rv" style="color:var(--soft)">Contact</div>
      <h2 class="sh2 rv d1" style="color:var(--text)">Book your <em>consultation</em></h2>
      <p class="body-txt rv d2" style="margin-bottom:28px">Complimentary and completely private. We will discuss your goals with no pressure and no obligation.</p>
      <div class="cinfo rv d3">
        <div class="cinfo-item"><div class="cil">Phone</div><div class="civ">{{PHONE}}</div></div>
        <div class="cinfo-item"><div class="cil">Email</div><div class="civ">{{EMAIL}}</div></div>
        <div class="cinfo-item"><div class="cil">Location</div><div class="civ">8700 E Pinnacle Peak Rd, Suite 201, Scottsdale AZ 85255</div></div>
      </div>
    </div>
    <div class="rv d2">
      <div class="cform">
        <div class="cform-title">Request a consultation</div>
        <div class="frow"><div class="fg"><label class="fl">First name</label><input class="fi" type="text" placeholder="Emily"></div><div class="fg"><label class="fl">Last name</label><input class="fi" type="text" placeholder="Carter"></div></div>
        <div class="fg"><label class="fl">Email</label><input class="fi" type="email" placeholder="emily@example.com"></div>
        <div class="fg"><label class="fl">Phone</label><input class="fi" type="tel" placeholder="(555) 000-0000"></div>
        <div class="fg"><label class="fl">Area of interest</label><textarea class="fi" rows="3" placeholder="Which treatments are you interested in?"></textarea></div>
        <button class="fsub" id="fsub">{{CTA_TEXT}}</button>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="ft">
    <div><div class="flogo">{{BUSINESS_NAME}}</div><div class="ftag">{{TAGLINE}}</div></div>
    <div class="fnav"><a href="#treatments">Treatments</a><a href="#about">About</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></div>
  </div>
  <div class="fbot"><span>© 2025 {{BUSINESS_NAME}}. All rights reserved. Scottsdale, Arizona.</span><span class="fcredit">Site by <a href="https://www.omiflow.co.uk" target="_blank">Omiflow</a></span></div>
</footer>

<script>
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});
function toggleMenu(){document.getElementById('mm').classList.toggle('open')}
function closeMenu(){document.getElementById('mm').classList.remove('open')}
// Make all sections immediately visible — no observer dependency
document.querySelectorAll('.rv').forEach(el=>el.classList.add('on'));
const tw=document.getElementById('tw');
const phrases=['Medical aesthetics · Scottsdale, AZ','Board-certified practitioners'];
let pi=0,ci=0,del=false,w=0;
function tick(){const p=phrases[pi];if(!del){tw.textContent=p.slice(0,++ci);if(ci===p.length){del=true;w=0;setTimeout(tick,2400);return}}else{if(w<4){w++;setTimeout(tick,55);return}tw.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(tick,400);return}}setTimeout(tick,del?40:60)}
tick();
document.getElementById('fsub').addEventListener('click',e=>{e.preventDefault();window.open('https://www.omiflow.co.uk','_blank')});
<\\\\/script>
</body>
</html>
`


const TEMPLATES: Record<number, string> = {
  1: TEMPLATE_PRO_SERVICES,
  2: TEMPLATE_TRADES,
  3: TEMPLATE_PHOTOGRAPHY,
  4: TEMPLATE_SOLICITORS,
  5: TEMPLATE_MEDSPAS,
}

interface NicheContent {
  heroH1: string; heroSub: string; heroSubA: string; heroSubB: string
  tagline: string; cta: string
  trust: string[]; stats: Array<{n:string;l:string}>
  services: Array<{t:string;d:string}>
  process: Array<{t:string;d:string}>
  reviews: Array<{t:string;a:string}>
  about: string; typewriter: string[]
}

function getNicheContent(niche: string, city: string): NicheContent {
  const n = niche.toLowerCase()
  const defaults: NicheContent = {
    heroH1: 'Expertise you can rely on', heroSub: `Professional services in ${city}`,
    heroSubA: `Serving ${city}`, heroSubB: 'Trusted. Professional. Local.',
    tagline: `Professional services in ${city}`, cta: 'Get in Touch',
    trust: ['Free consultation','Fully insured','Locally trusted','5 star reviews'],
    stats: [{n:'500+',l:'Happy clients'},{n:'4.9',l:'Google rating'},{n:'10+',l:'Years experience'}],
    services: [{t:'Core Service',d:'Professional service delivered with expertise and care.'},{t:'Consultation',d:'We understand your needs.'},{t:'Ongoing Support',d:'We are here after the job is done.'}],
    process: [{t:'Get in touch',d:'Call or message.'},{t:'Consultation',d:'We listen.'},{t:'We work',d:'Professional and reliable.'},{t:'Done right',d:'We follow up.'}],
    reviews: [{t:'Exceptional service.',a:`Satisfied client, ${city}`},{t:'Brilliant results.',a:`Happy customer, ${city}`},{t:'Highly recommended.',a:`Returning client, ${city}`}],
    about: `We are dedicated professionals serving ${city}.`,
    typewriter: [`Professional services in ${city}`, `Trusted by local businesses`],
  }

  if (/dental/.test(n)) return { heroH1:'A smile you are proud to show', heroSub:`Professional dental care in ${city}`, heroSubA:`Dental practice in ${city}`, heroSubB:'Gentle. Modern. Welcoming.', tagline:`Trusted dental care in ${city}`, cta:'Book an Appointment', trust:['New patients welcome','Emergency appointments','Interest-free finance','Family-friendly'], stats:[{n:'2,400+',l:'Patients treated'},{n:'4.9',l:'Google rating'},{n:'15+',l:`Years in ${city}`}], services:[{t:'Teeth Whitening',d:'Professional whitening from the first session.'},{t:'Invisalign',d:'Straighten your smile discreetly.'},{t:'Emergency Care',d:'Same-day appointments for dental trauma.'}], process:[{t:'Book online',d:'Same-day slots often available.'},{t:'Consultation',d:'No pressure, no rush.'},{t:'Treatment plan',d:'Clear options and transparent pricing.'},{t:'Ongoing care',d:'Regular check-ups.'}], reviews:[{t:'Best dental practice I've been to.',a:`Sophie R., ${city}`},{t:'Finally a dentist I don't dread.',a:`Mark T., ${city}`},{t:'Emergency sorted same day.',a:`Priya M., ${city}`}], about:`${city} patients choose us because we listen before we treat.`, typewriter:[`Dental practice in ${city}`,'New patients always welcome'] }

  if (/physio|osteo|chiro/.test(n)) return { ...defaults, heroH1:'Pain holding you back?', heroSub:`Expert physiotherapy in ${city}`, cta:'Book an Assessment', trust:['Same-week appointments','HCPC registered','Covered by major insurers','Home visits'], typewriter:[`Physiotherapy in ${city}`,'HCPC registered practitioners'] }

  if (/salon|hair|barber|beauty/.test(n)) return { ...defaults, heroH1:'Hair that turns heads', heroSub:`Colour and cut specialists in ${city}`, cta:'Book Now', typewriter:[`Hair salon in ${city}`,'Colour specialists'] }

  if (/build|construct|plumb|kitchen|electri|roofer|landscap|paint|decor/.test(n)) return { ...defaults, heroH1:'Every job, done right', heroSub:`Local specialists in ${city}. Free quotes. Fully insured.`, cta:'Get a Free Quote', typewriter:[`Specialists in ${city}`,'Free quotes. Fully insured.'] }

  if (/restaur|cafe|eatery|bistro|diner|takeaway|takeout|pizza|sushi|food|bar|pub|grill|burger|kebab|caribbean|mediterranean|halal|fusion|wing/.test(n)) return { ...defaults, heroH1:'Food worth coming back for', heroSub:`Honest cooking, served fresh in ${city}`, heroSubA:`${n.split(' ').slice(-2).join(' ')} in ${city}`, heroSubB:'Order in. Dine in. Come back.', tagline:`Local restaurant in ${city}`, cta:'See the Menu', trust:['Dine in & takeaway','Online ordering','Locally sourced','Open 7 days'], stats:[{n:'4.8',l:'Google rating'},{n:'2,000+',l:'Happy customers'},{n:'5+',l:`Years serving ${city}`}], services:[{t:'Dine In',d:'A relaxed space to enjoy a proper meal. No rush, no fuss.'},{t:'Takeaway',d:'Order ahead and collect when ready, or we deliver to your door.'},{t:'Catering',d:'Private events, office lunches, and group bookings welcome.'}], process:[{t:'Browse the menu',d:'Full menu online, updated regularly.'},{t:'Place your order',d:'Call ahead or order through our site.'},{t:'Pick up or delivery',d:'Fresh every time, no compromise.'},{t:'Come back soon',d:'Most of our customers are regulars.'}], reviews:[{t:'Best food in the area by a mile.',a:`Regular customer, ${city}`},{t:'Always fresh, always consistent.',a:`Google review, ${city}`},{t:'Came for lunch, stayed for dessert.',a:`Dine-in guest, ${city}`}], about:`${city}'s locals have been coming through our doors for years. We cook everything from scratch.`, typewriter:[`Restaurant in ${city}`,'Fresh food, every day'] }

  if (/photo|tattoo|video|wedding|portrait/.test(n)) return { ...defaults, heroH1:'Moments worth remembering', heroSub:`Documentary photography based in ${city}`, cta:'Check Availability', typewriter:[`Photography in ${city}`,'Documentary storytelling'] }

  if (/solicit|legal|law|financial|wealth|mortgage/.test(n)) return { ...defaults, heroH1:'Advice you can trust', heroSub:`Independent specialists in ${city}`, cta:'Book a Consultation', typewriter:[`Advisors in ${city}`,'Plain English. No jargon.'] }

  if (/spa|aesthet|botox|filler|laser|cosmetic|skin/.test(n)) return { ...defaults, heroH1:'Natural results, not a procedure', heroSub:`Medical-grade aesthetics in ${city}`, cta:'Book Free Consultation', typewriter:[`Medical aesthetics in ${city}`,'Natural results, always'] }

  return { ...defaults, typewriter: [`${n} in ${city}`, `Trusted by locals`] }
}

export function buildWebsiteDemo(lead: CleanedLead, niche: string, templateId: number): string {
  const city = lead.city || 'London'
  const phone = lead.phone || '020 0000 0000'
  const email = lead.email || 'hello@yourbusiness.com'
  const photo = getPhoto(niche)
  const nc = getNicheContent(niche, city)

  const imgH = imgUrl(photo, 1400)
  const imgS = imgUrl(photo, 900)

  const vars: Record<string, string> = {
    BUSINESS_NAME: lead.business_name || 'Your Business',
    TAGLINE: nc.tagline, HERO_H1: nc.heroH1, HERO_SUB: nc.heroSub,
    HERO_SUBLINE_A: nc.heroSubA, HERO_SUBLINE_B: nc.heroSubB,
    CTA_TEXT: nc.cta, HERO_IMG: imgH, SERVICES_IMG: imgS,
    ABOUT_IMG: imgH, TEAM_IMG: imgH, INTERIOR_IMG: imgH,
    TRUST_1: nc.trust[0]||'', TRUST_2: nc.trust[1]||'', TRUST_3: nc.trust[2]||'', TRUST_4: nc.trust[3]||'',
    STAT_1_NUM: nc.stats[0].n, STAT_1_LABEL: nc.stats[0].l,
    STAT_2_NUM: nc.stats[1].n, STAT_2_LABEL: nc.stats[1].l,
    STAT_3_NUM: nc.stats[2].n, STAT_3_LABEL: nc.stats[2].l,
    SERVICE_1_TITLE: nc.services[0].t, SERVICE_1_DESC: nc.services[0].d,
    SERVICE_2_TITLE: nc.services[1].t, SERVICE_2_DESC: nc.services[1].d,
    SERVICE_3_TITLE: nc.services[2].t, SERVICE_3_DESC: nc.services[2].d,
    PROCESS_1: nc.process[0].t, PROCESS_1_DESC: nc.process[0].d,
    PROCESS_2: nc.process[1].t, PROCESS_2_DESC: nc.process[1].d,
    PROCESS_3: nc.process[2].t, PROCESS_3_DESC: nc.process[2].d,
    PROCESS_4: nc.process[3].t, PROCESS_4_DESC: nc.process[3].d,
    REVIEW_1_TEXT: nc.reviews[0].t, REVIEW_1_AUTHOR: nc.reviews[0].a,
    REVIEW_2_TEXT: nc.reviews[1].t, REVIEW_2_AUTHOR: nc.reviews[1].a,
    REVIEW_3_TEXT: nc.reviews[2].t, REVIEW_3_AUTHOR: nc.reviews[2].a,
    ABOUT_PARA: nc.about, PHONE: phone, EMAIL: email,
    ADDRESS: lead.full_address || city, CITY: city,
    AREAS: `${city} and surrounding areas`,
    PROJECT_1_LABEL: `Recent project, ${city}`,
    PROJECT_2_LABEL: 'Completed project', PROJECT_3_LABEL: 'Latest work',
    PORTFOLIO_1_TITLE: 'A wedding story', PORTFOLIO_1_LOCATION: city, PORTFOLIO_1_IMG: imgH,
    PORTFOLIO_2_TITLE: 'Portraits', PORTFOLIO_2_LOC: city, PORTFOLIO_2_IMG: imgUrl('photo-1531746020798-e6953c6e8e04', 700),
    PORTFOLIO_3_TITLE: 'Commercial', PORTFOLIO_3_LOC: city, PORTFOLIO_3_IMG: imgUrl('photo-1601506521937-0121a7fc2a6b', 700),
    PORTFOLIO_4_TITLE: 'Editorial', PORTFOLIO_4_LOC: city, PORTFOLIO_4_IMG: imgUrl('photo-1492691527719-9d1e07e534b4', 700),
    PORTFOLIO_5_IMG: imgUrl('photo-1511285560929-80b456fea0bc', 900),
    TREATMENT_1_FROM: '$299', TREATMENT_1_TITLE: 'Anti-Wrinkle Injections', TREATMENT_1_DESC: 'Natural-looking results.',
    TREATMENT_2_FROM: '$399', TREATMENT_2_TITLE: 'Dermal Fillers', TREATMENT_2_DESC: 'FDA-approved fillers.',
    TREATMENT_3_FROM: '$349', TREATMENT_3_TITLE: 'Profhilo Skin Booster', TREATMENT_3_DESC: 'Deep hydration.',
    TREATMENT_4_FROM: '$499', TREATMENT_4_TITLE: 'Laser Resurfacing', TREATMENT_4_DESC: 'Targeted correction.',
    REVIEW_1_TREATMENT: 'Anti-Wrinkle Injections', REVIEW_2_TREATMENT: 'Dermal Fillers', REVIEW_3_TREATMENT: 'Profhilo',
    STATE: '', PRIMARY_HEX: '#1a3a5c', ACCENT_HEX: '#c9a96e',
    PROJECTS_SUBLINE: `A selection of recent work across ${city}`,
  }

  const tpl = TEMPLATES[templateId] || TEMPLATES[1]
  let html = tpl.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_m: string, k: string) => vars[k] ?? _m)

  if (nc.typewriter.length) {
    html = html.replace(/const phrases\s*=\s*\[.*?\];/s, `const phrases=${JSON.stringify(nc.typewriter)};`)
  }

  return html
}
