import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#F8F5EF",
  ink: "#0B0B09",
  card: "#FFFFFF",
  mist: "#EEEAE1",
  gold: "#8E6420",
  gold2: "#B8820A",
  gold3: "#C9952D",
  goldPale: "#F2E8D2",
  stone: "#605A52",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

  :root {
    --bg: #F8F5EF; --ink: #0B0B09; --card: #FFFFFF;
    --mist: #EEEAE1; --gold: #8E6420; --gold2: #B8820A;
    --gold3: #C9952D; --gold-pale: #F2E8D2; --stone: #605A52;
    --border: rgba(11,11,9,0.1); --border-light: rgba(11,11,9,0.06);
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Outfit', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }

  body { background:var(--bg); color:var(--ink); font-family:var(--sans); line-height:1.6; overflow-x:hidden; cursor:none; }

  .mg-cur-dot { position:fixed; width:5px; height:5px; background:var(--gold3); border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); mix-blend-mode:multiply; }
  .mg-cur-ring { position:fixed; width:32px; height:32px; border:1px solid var(--gold3); border-radius:50%; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:all 0.2s cubic-bezier(0.23,1,0.32,1); mix-blend-mode:multiply; }
  .mg-cur-ring.h { width:48px; height:48px; background:rgba(185,130,10,0.05); }

  #mg-prog { position:fixed; top:0; left:0; height:2px; background:var(--gold3); z-index:700; transition:width 0.08s; }

  .mg-nav { position:fixed; top:0; left:0; right:0; z-index:500; height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 3rem; transition:all 0.35s; }
  .mg-nav.on { background:rgba(248,245,239,0.97); backdrop-filter:blur(18px); border-bottom:1px solid var(--border); height:60px; }
  .mg-nav-logo { font-family:var(--serif); font-size:1.2rem; font-weight:600; letter-spacing:0.05em; color:var(--ink); text-decoration:none; }
  .mg-nav-logo span { color:var(--gold2); }
  .mg-nav-links { display:flex; align-items:center; gap:2.5rem; list-style:none; }
  .mg-nav-links a { font-size:0.75rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--stone); text-decoration:none; transition:color 0.2s; cursor:none; }
  .mg-nav-links a:hover { color:var(--gold2); }
  .mg-nav-engage { font-size:0.68rem !important; font-weight:600 !important; letter-spacing:0.14em !important; text-transform:uppercase !important; color:#FFF !important; background:var(--ink) !important; padding:0.6rem 1.4rem; border:1px solid var(--ink); transition:all 0.25s !important; text-decoration:none; cursor:none; }
  .mg-nav-engage:hover { background:var(--gold2) !important; border-color:var(--gold2) !important; color:#FFF !important; }
  .mg-burger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; }
  .mg-burger span { width:22px; height:1.5px; background:var(--ink); display:block; transition:all 0.3s; }

  .mg-mob-nav { position:fixed; inset:0; background:var(--ink); z-index:490; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem; opacity:0; pointer-events:none; transition:opacity 0.3s; }
  .mg-mob-nav.open { opacity:1; pointer-events:all; }
  .mg-mob-nav a { font-family:var(--serif); font-size:2.5rem; font-weight:400; color:#FFF; text-decoration:none; transition:color 0.2s; cursor:none; }
  .mg-mob-nav a:hover { color:var(--gold3); }

  #mg-hero { min-height:100vh; display:grid; grid-template-columns:55% 45%; position:relative; overflow:hidden; }
  .mg-hero-l { background:var(--ink); padding:9rem 4.5rem 5rem; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; }
  .mg-hero-l::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 0% 100%,rgba(185,130,10,0.1) 0%,transparent 55%),repeating-linear-gradient(135deg,transparent,transparent 60px,rgba(185,130,10,0.02) 60px,rgba(185,130,10,0.02) 61px); pointer-events:none; }
  .mg-hero-institution { font-family:var(--mono); font-size:0.56rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold3); margin-bottom:2.5rem; display:flex; align-items:center; gap:1rem; animation:mgUp 0.9s both; }
  .mg-hero-institution::before { content:''; width:24px; height:1px; background:var(--gold3); flex-shrink:0; }
  .mg-h1 { font-family:var(--serif); font-size:clamp(3rem,4.8vw,6rem); font-weight:300; line-height:1.04; color:#FFF; margin-bottom:0.5rem; animation:mgUp 0.9s 0.1s both; letter-spacing:-0.015em; }
  .mg-h1 em { font-style:italic; color:var(--gold3); }
  .mg-hero-tagline { font-family:var(--serif); font-size:1.15rem; font-style:italic; color:rgba(255,255,255,0.45); margin-bottom:2rem; animation:mgUp 0.9s 0.18s both; }
  .mg-hero-lead { font-size:0.97rem; font-weight:300; color:rgba(255,255,255,0.5); line-height:1.82; max-width:460px; margin-bottom:3.5rem; animation:mgUp 0.9s 0.26s both; }
  .mg-hero-lead strong { color:rgba(255,255,255,0.8); font-weight:400; }
  .mg-hero-btns { display:flex; gap:1rem; animation:mgUp 0.9s 0.34s both; }
  .mg-btn-primary { font-size:0.68rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:var(--ink); background:var(--gold3); padding:0.9rem 2.2rem; text-decoration:none; transition:all 0.25s; display:inline-block; cursor:none; }
  .mg-btn-primary:hover { background:#d4a030; transform:translateY(-1px); }
  .mg-btn-outline { font-size:0.68rem; font-weight:400; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.6); padding:0.9rem 2.2rem; border:1px solid rgba(255,255,255,0.18); text-decoration:none; transition:all 0.25s; display:inline-block; cursor:none; }
  .mg-btn-outline:hover { border-color:var(--gold3); color:var(--gold3); }
  .mg-hero-stats { position:absolute; bottom:0; left:0; right:0; display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid rgba(255,255,255,0.07); animation:mgUp 0.9s 0.42s both; }
  .mg-hst { padding:1.5rem 2rem; border-right:1px solid rgba(255,255,255,0.06); }
  .mg-hst:last-child { border-right:none; }
  .mg-hst-v { font-family:var(--serif); font-size:2rem; font-weight:600; color:var(--gold3); line-height:1; margin-bottom:0.2rem; }
  .mg-hst-l { font-family:var(--mono); font-size:0.48rem; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.28); }

  .mg-hero-r { background:var(--mist); padding:9rem 3.5rem 5rem; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; }
  .mg-hero-r::after { content:'MG'; position:absolute; bottom:-3rem; right:-2rem; font-family:var(--serif); font-size:18rem; font-weight:700; color:rgba(11,11,9,0.03); line-height:1; pointer-events:none; letter-spacing:-0.05em; }
  .mg-hero-pillars { display:flex; flex-direction:column; animation:mgUp 0.9s 0.2s both; }
  .mg-hp-item { padding:1.5rem 0; border-bottom:1px solid var(--border); display:flex; align-items:flex-start; gap:1.2rem; transition:all 0.2s; cursor:none; }
  .mg-hp-item:first-child { border-top:1px solid var(--border); }
  .mg-hp-item:hover { padding-left:0.6rem; }
  .mg-hp-icon { font-size:1rem; flex-shrink:0; margin-top:0.1rem; }
  .mg-hp-title { font-family:var(--serif); font-size:1.1rem; font-weight:600; color:var(--ink); margin-bottom:0.25rem; line-height:1.2; }
  .mg-hp-sub { font-family:var(--mono); font-size:0.5rem; letter-spacing:0.1em; color:var(--stone); line-height:1.55; }
  .mg-hero-mkts { margin-top:2.5rem; animation:mgUp 0.9s 0.32s both; }
  .mg-mkts-lbl { font-family:var(--mono); font-size:0.5rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--stone); margin-bottom:0.7rem; }
  .mg-mkt-pills { display:flex; flex-wrap:wrap; gap:0.35rem; }
  .mg-mkt-pill { font-family:var(--mono); font-size:0.5rem; letter-spacing:0.08em; padding:0.28rem 0.65rem; background:rgba(142,100,32,0.08); border:1px solid rgba(142,100,32,0.2); color:var(--gold2); }

  .mg-ticker { background:var(--ink); overflow:hidden; padding:1rem 0; border-top:1px solid rgba(255,255,255,0.04); }
  .mg-ticker-track { display:flex; animation:mgScroll 30s linear infinite; white-space:nowrap; }
  .mg-ticker-track:hover { animation-play-state:paused; }
  .mg-t-item { font-family:var(--mono); font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.28); padding:0 3rem; flex-shrink:0; }
  .mg-t-item .d { color:var(--gold3); margin:0 1rem; }

  .mg-sec { padding:7rem 0; position:relative; }
  .mg-sec-alt { background:var(--mist); }
  .mg-sec-dark { background:var(--ink); color:#FFF; }
  .mg-cont { max-width:1280px; margin:0 auto; padding:0 3rem; }
  .mg-eyebrow { font-family:var(--mono); font-size:0.55rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold2); margin-bottom:1rem; display:flex; align-items:center; gap:0.8rem; }
  .mg-eyebrow::before { content:''; width:22px; height:1px; background:var(--gold2); flex-shrink:0; }
  .mg-eyebrow-lt { color:var(--gold3) !important; }
  .mg-eyebrow-lt::before { background:var(--gold3) !important; }
  .mg-s-title { font-family:var(--serif); font-size:clamp(2.2rem,3.5vw,3.8rem); font-weight:400; line-height:1.07; letter-spacing:-0.01em; color:var(--ink); margin-bottom:1rem; }
  .mg-sec-dark .mg-s-title { color:#FFF; }
  .mg-s-title em { font-style:italic; color:var(--gold2); }
  .mg-sec-dark .mg-s-title em { color:var(--gold3); }
  .mg-s-sub { font-size:0.97rem; font-weight:300; color:var(--stone); line-height:1.78; max-width:580px; }
  .mg-sec-dark .mg-s-sub { color:rgba(255,255,255,0.45); }

  .mg-mandate-section { background:var(--ink); padding:6rem 0; border-top:1px solid rgba(255,255,255,0.04); }
  .mg-mandate-grid { display:grid; grid-template-columns:1fr 1fr; gap:8rem; align-items:center; }
  .mg-mandate-heading { font-family:var(--serif); font-size:clamp(2rem,3.5vw,4rem); font-weight:300; line-height:1.1; color:#FFF; margin-bottom:2rem; letter-spacing:-0.01em; }
  .mg-mandate-heading em { font-style:italic; color:var(--gold3); }
  .mg-mandate-body { font-size:0.97rem; font-weight:300; color:rgba(255,255,255,0.48); line-height:1.85; }
  .mg-mandate-body p { margin-bottom:1.2rem; }
  .mg-mandate-body p:last-child { margin-bottom:0; }
  .mg-mandate-pillars { display:flex; flex-direction:column; gap:0; }
  .mg-mp-item { padding:1.8rem 0; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; gap:1.5rem; align-items:flex-start; }
  .mg-mp-item:first-child { border-top:1px solid rgba(255,255,255,0.07); }
  .mg-mp-num { font-family:var(--mono); font-size:0.5rem; letter-spacing:0.15em; color:var(--gold3); flex-shrink:0; margin-top:0.15rem; }
  .mg-mp-title { font-family:var(--serif); font-size:1.15rem; font-weight:600; color:#FFF; margin-bottom:0.4rem; line-height:1.2; }
  .mg-mp-body { font-size:0.85rem; color:rgba(255,255,255,0.4); line-height:1.68; }

  .mg-arch-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); margin-top:5rem; }
  .mg-arch-card { background:var(--card); padding:2.5rem 2.2rem; position:relative; overflow:hidden; transition:background 0.25s; cursor:none; }
  .mg-arch-card:hover { background:var(--bg); }
  .mg-arch-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:transparent; transition:background 0.25s; }
  .mg-arch-card:hover::before { background:var(--gold2); }
  .mg-ac-mark { font-family:var(--mono); font-size:0.5rem; letter-spacing:0.15em; color:var(--gold2); margin-bottom:1.5rem; }
  .mg-ac-title { font-family:var(--serif); font-size:1.35rem; font-weight:600; color:var(--ink); margin-bottom:0.7rem; line-height:1.15; }
  .mg-ac-body { font-size:0.86rem; color:var(--stone); line-height:1.72; }
  .mg-ac-instruments { display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:1.5rem; }
  .mg-ac-inst { font-family:var(--mono); font-size:0.46rem; letter-spacing:0.1em; padding:0.2rem 0.6rem; border:1px solid var(--border); color:var(--stone); }

  .mg-reach-wrap { display:grid; grid-template-columns:1fr 1fr; gap:8rem; align-items:center; }
  .mg-regions-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.06); margin-top:3rem; }
  .mg-region { background:rgba(255,255,255,0.02); padding:2rem 1.8rem; border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.2s; cursor:none; }
  .mg-region:hover { background:rgba(255,255,255,0.05); }
  .mg-region-name { font-family:var(--serif); font-size:1.05rem; font-weight:600; color:#FFF; margin-bottom:0.4rem; }
  .mg-region-detail { font-family:var(--mono); font-size:0.5rem; letter-spacing:0.06em; color:rgba(255,255,255,0.3); line-height:1.65; }
  .mg-reach-points { display:flex; flex-direction:column; gap:0; margin-top:2.5rem; }
  .mg-rp { padding:1.2rem 0; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; gap:1.2rem; align-items:flex-start; }
  .mg-rp-bar { width:2px; background:var(--gold3); flex-shrink:0; margin-top:0.3rem; align-self:stretch; min-height:14px; }
  .mg-rp-text { font-size:0.9rem; color:rgba(255,255,255,0.5); line-height:1.68; }

  .mg-sector-grid { display:grid; grid-template-columns:repeat(4,1fr); border:1px solid var(--border); margin-top:4.5rem; }
  .mg-sector { padding:1.8rem 1.5rem; border-right:1px solid var(--border); border-bottom:1px solid var(--border); transition:background 0.2s; cursor:none; }
  .mg-sector:hover { background:var(--mist); }
  .mg-sector:nth-child(4n) { border-right:none; }
  .mg-sector-ico { font-size:1.2rem; margin-bottom:0.8rem; display:block; }
  .mg-sector-name { font-family:var(--serif); font-size:0.98rem; font-weight:600; color:var(--ink); line-height:1.25; }

  .mg-lead-wrap { display:grid; grid-template-columns:400px 1fr; gap:8rem; align-items:center; }
  .mg-lead-frame { background:var(--mist); aspect-ratio:4/5; position:relative; overflow:hidden; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }
  .mg-lead-frame-text { font-family:var(--serif); font-size:7rem; font-weight:300; color:rgba(142,100,32,0.13); letter-spacing:0.2em; }
  .mg-lead-badge { position:absolute; bottom:-1.5rem; right:-1.5rem; background:var(--ink); padding:1.4rem 1.8rem; border:3px solid var(--bg); }
  .mg-lb-name { font-family:var(--serif); font-size:0.95rem; font-weight:600; color:#FFF; margin-bottom:0.2rem; }
  .mg-lb-title { font-family:var(--mono); font-size:0.48rem; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold3); }
  .mg-lead-name { font-family:var(--serif); font-size:clamp(2rem,3vw,3.2rem); font-weight:400; color:var(--ink); margin-bottom:0.3rem; line-height:1.1; }
  .mg-lead-role { font-family:var(--mono); font-size:0.56rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--gold2); margin-bottom:2rem; }
  .mg-lead-bio { font-size:0.97rem; color:var(--stone); line-height:1.82; margin-bottom:1.2rem; max-width:560px; }
  .mg-lead-credentials { border-top:1px solid var(--border); }
  .mg-cred { padding:0.9rem 0; border-bottom:1px solid var(--border); display:flex; align-items:flex-start; gap:1rem; }
  .mg-cred-dot { width:4px; height:4px; border-radius:50%; background:var(--gold2); flex-shrink:0; margin-top:0.5rem; }
  .mg-cred-text { font-size:0.86rem; color:var(--stone); line-height:1.6; }

  .mg-diff-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.06); margin-top:5rem; }
  .mg-diff-card { background:rgba(255,255,255,0.03); padding:2.5rem; transition:background 0.2s; cursor:none; }
  .mg-diff-card:hover { background:rgba(255,255,255,0.055); }
  .mg-dc-num { font-family:var(--serif); font-size:3.5rem; font-weight:700; color:rgba(201,149,45,0.1); line-height:1; margin-bottom:1rem; }
  .mg-dc-title { font-family:var(--serif); font-size:1.3rem; font-weight:600; color:#FFF; margin-bottom:0.7rem; line-height:1.15; }
  .mg-dc-body { font-size:0.87rem; color:rgba(255,255,255,0.42); line-height:1.72; }

  .mg-contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); margin-top:5rem; }
  .mg-contact-l { background:var(--card); padding:4rem; }
  .mg-contact-r { background:var(--mist); padding:4rem; }
  .mg-c-label { font-family:var(--mono); font-size:0.5rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--gold2); margin-bottom:2.5rem; display:flex; align-items:center; gap:0.7rem; }
  .mg-c-label::before { content:''; width:18px; height:1px; background:var(--gold2); }
  .mg-c-address { font-family:var(--serif); font-size:1.05rem; color:var(--ink); line-height:1.9; margin-bottom:2.5rem; }
  .mg-c-detail { display:flex; flex-direction:column; gap:1.2rem; margin-bottom:3rem; }
  .mg-c-d-key { font-family:var(--mono); font-size:0.45rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--stone); margin-bottom:0.15rem; display:block; }
  .mg-c-d-val { font-size:0.9rem; color:var(--ink); }
  .mg-c-d-val a { color:var(--ink); text-decoration:none; border-bottom:1px solid var(--border); transition:all 0.2s; cursor:none; }
  .mg-c-d-val a:hover { color:var(--gold2); border-color:var(--gold2); }
  .mg-form-group { margin-bottom:1.4rem; }
  .mg-f-label { font-family:var(--mono); font-size:0.46rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--stone); display:block; margin-bottom:0.45rem; }
  .mg-f-input, .mg-f-select, .mg-f-textarea { width:100%; padding:0.82rem 1rem; background:#FFF; border:1px solid var(--border); font-family:var(--sans); font-size:0.86rem; color:var(--ink); outline:none; transition:border-color 0.2s; appearance:none; cursor:none; }
  .mg-f-input:focus, .mg-f-select:focus, .mg-f-textarea:focus { border-color:var(--gold2); }
  .mg-f-textarea { resize:vertical; min-height:110px; }
  .mg-f-g2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .mg-f-submit { font-family:var(--sans); font-size:0.68rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:#FFF; background:var(--ink); border:none; padding:1rem 2.5rem; cursor:none; transition:background 0.25s; width:100%; }
  .mg-f-submit:hover { background:var(--gold2); }
  .mg-f-note { font-family:var(--mono); font-size:0.46rem; letter-spacing:0.08em; color:var(--stone); margin-top:0.9rem; line-height:1.6; }

  .mg-closing { background:var(--ink); padding:7rem 0; border-top:1px solid rgba(255,255,255,0.04); text-align:center; }
  .mg-closing-pre { font-family:var(--mono); font-size:0.56rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--gold3); margin-bottom:2rem; display:flex; align-items:center; justify-content:center; gap:1rem; }
  .mg-closing-pre::before, .mg-closing-pre::after { content:''; width:40px; height:1px; background:var(--gold3); }
  .mg-closing-title { font-family:var(--serif); font-size:clamp(2rem,4vw,4.5rem); font-weight:300; line-height:1.12; color:#FFF; max-width:800px; margin:0 auto 1.5rem; letter-spacing:-0.01em; }
  .mg-closing-title em { font-style:italic; color:var(--gold3); }
  .mg-closing-line { font-family:var(--serif); font-style:italic; font-size:1.15rem; color:rgba(255,255,255,0.4); margin-bottom:3rem; }
  .mg-closing-trio { display:flex; align-items:center; justify-content:center; gap:2rem; margin-bottom:3.5rem; flex-wrap:wrap; }
  .mg-ct-item { font-family:var(--mono); font-size:0.55rem; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.35); }
  .mg-ct-dot { width:4px; height:4px; background:var(--gold3); border-radius:50%; }

  footer.mg-footer { background:var(--ink); padding:5rem 0 2.5rem; }
  .mg-footer-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:4rem; padding-bottom:4rem; border-bottom:1px solid rgba(255,255,255,0.06); }
  .mg-f-brand { font-family:var(--serif); font-size:1.3rem; font-weight:600; color:#FFF; margin-bottom:0.7rem; letter-spacing:0.04em; }
  .mg-f-brand span { color:var(--gold3); }
  .mg-f-tag { font-size:0.83rem; color:rgba(255,255,255,0.3); line-height:1.72; margin-bottom:2rem; max-width:280px; }
  .mg-f-addr { font-family:var(--mono); font-size:0.55rem; letter-spacing:0.06em; color:rgba(255,255,255,0.22); line-height:1.9; }
  .mg-f-col-title { font-family:var(--mono); font-size:0.48rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--gold3); margin-bottom:1.5rem; }
  .mg-f-links { list-style:none; display:flex; flex-direction:column; gap:0.65rem; }
  .mg-f-links a { font-size:0.83rem; color:rgba(255,255,255,0.38); text-decoration:none; transition:color 0.2s; cursor:none; }
  .mg-f-links a:hover { color:var(--gold3); }
  .mg-footer-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:2rem; gap:1rem; }
  .mg-f-copy { font-family:var(--mono); font-size:0.48rem; letter-spacing:0.1em; color:rgba(255,255,255,0.18); }
  .mg-f-legal { display:flex; gap:2rem; list-style:none; }
  .mg-f-legal a { font-family:var(--mono); font-size:0.48rem; letter-spacing:0.08em; color:rgba(255,255,255,0.18); text-decoration:none; transition:color 0.2s; cursor:none; }
  .mg-f-legal a:hover { color:var(--gold3); }

  .mg-rv { opacity:0; transform:translateY(18px); transition:opacity 0.65s ease, transform 0.65s ease; }
  .mg-rv.in { opacity:1; transform:translateY(0); }
  .mg-rv.d1 { transition-delay:0.1s; }
  .mg-rv.d2 { transition-delay:0.2s; }
  .mg-rv.d3 { transition-delay:0.3s; }

  @keyframes mgUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes mgScroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }

  @media (max-width:1100px) {
    #mg-hero { grid-template-columns:1fr; min-height:auto; }
    .mg-hero-l { padding:10rem 2.5rem 5rem; }
    .mg-hero-r { padding:4rem 2.5rem 5rem; }
    .mg-hero-stats { position:relative; bottom:auto; left:auto; right:auto; margin-top:3rem; }
    .mg-reach-wrap, .mg-lead-wrap, .mg-mandate-grid { grid-template-columns:1fr; gap:4rem; }
    .mg-lead-wrap { max-width:600px; }
    .mg-arch-grid { grid-template-columns:1fr 1fr; }
    .mg-sector-grid { grid-template-columns:repeat(2,1fr); }
    .mg-footer-top { grid-template-columns:1fr 1fr; gap:2.5rem; }
    .mg-closing-trio { flex-wrap:wrap; }
  }
  @media (max-width:768px) {
    .mg-cont { padding:0 1.5rem; }
    .mg-nav { padding:0 1.5rem; }
    .mg-nav-links { display:none; }
    .mg-burger { display:flex; }
    .mg-h1 { font-size:2.8rem; }
    .mg-hero-btns { flex-direction:column; }
    .mg-arch-grid { grid-template-columns:1fr; }
    .mg-diff-grid { grid-template-columns:1fr; }
    .mg-contact-grid { grid-template-columns:1fr; }
    .mg-footer-top { grid-template-columns:1fr; }
    .mg-footer-bottom { flex-direction:column; text-align:center; }
    .mg-f-g2 { grid-template-columns:1fr; }
    .mg-regions-grid { grid-template-columns:1fr; }
    .mg-sec { padding:5rem 0; }
    body { cursor:auto; }
    .mg-cur-dot, .mg-cur-ring { display:none; }
  }
`;

const TICKER_ITEMS = [
  "Infrastructure Capital","Private Credit","Special Situations","Acquisition Finance",
  "Project Finance","Capital Architecture","Recapitalisation","Liability Management",
  "Balance Sheet Restructuring","Mezzanine Structures","Real Assets","Energy Transition Capital",
];

const PILLARS = [
  { icon:"◎", title:"Infrastructure Capital", sub:"Senior debt · Project finance · Acquisition structures · Refinancings · DFI co-financing" },
  { icon:"◈", title:"Private Credit", sub:"Unitranche · Mezzanine · Subordinated debt · Structured private credit · Growth capital" },
  { icon:"◇", title:"Special Situations", sub:"Distressed capital · Recapitalisations · Liability management · Balance sheet restructuring" },
  { icon:"◉", title:"Mergers & Acquisitions", sub:"Cross-border transactions · Sell-side · Buy-side · Strategic positioning" },
  { icon:"◐", title:"Working Capital & Trade", sub:"Receivables programmes · Supply chain finance · Forfaiting · Trade finance structures" },
  { icon:"◑", title:"Real Assets & Energy", sub:"Energy transition · Real asset financing · Critical minerals · Carbon markets" },
];

const MARKETS = ["United Kingdom","Nigeria","UAE","Saudi Arabia","Kenya","Brazil","Mexico","India","Singapore","South Africa","Germany","Qatar","Colombia","+12 more"];

const MANDATE_PILLARS = [
  { num:"I", title:"Origination", body:"We identify and develop transactions that others cannot reach. Our origination network operates across 25 markets, structured around relationship access at the level of sponsors, sovereigns, development finance institutions, and institutional investors." },
  { num:"II", title:"Capital Architecture", body:"We design full capital structures for infrastructure and private market transactions. Senior debt, subordinated instruments, mezzanine, hybrid capital, equity co-investment, and structured private credit are deployed as integrated components of a single executable architecture, not separate products." },
  { num:"III", title:"Execution", body:"We manage the transaction from structuring through documentation to close. Stakeholder alignment, intercreditor coordination, regulatory navigation, and jurisdictional complexity are handled within the mandate. One point of control. One team accountable for outcome." },
  { num:"IV", title:"Balance Sheet Participation", body:"In selected transactions we originate, we deploy proprietary capital and take direct positions alongside institutional partners. This alignment between structural control and capital participation produces outcomes that purely advisory structures cannot achieve." },
];

const ARCH_CARDS = [
  { mark:"Infrastructure Capital", title:"Infrastructure & Project Finance", body:"We structure the full debt architecture for infrastructure transactions. Senior secured facilities, subordinated tranches, DFI co-financing frameworks, and blended finance structures are designed as a system that makes complex infrastructure transactions executable. We engage sponsors, lenders, and sovereign-linked capital simultaneously into a single coordinated structure.", instruments:["Senior Debt","Project Finance","Acquisition Finance","Refinancing","DFI Co-Financing","Blended Finance"] },
  { mark:"Private Credit", title:"Private Credit & Structured Lending", body:"We structure and deploy private credit solutions across the full spectrum of instruments for companies that have outgrown their banking relationships or require capital structures that bank lending cannot accommodate. Growth capital, unitranche facilities, mezzanine, PIK instruments, and subordinated debt are structured to match the specific risk profile, timeline, and stakeholder requirements of each transaction.", instruments:["Unitranche","Mezzanine","Subordinated Debt","Growth Capital","PIK Instruments"] },
  { mark:"Special Situations", title:"Special Situations & Balance Sheet Restructuring", body:"We operate in transactions where capital structure complexity, creditor conflict, covenant breach, or time pressure has created a situation that standard financing routes cannot resolve. Liability management exercises, recapitalisations, distressed capital injections, and creditor-side and debtor-side mandates are executed with the urgency and structural precision that these situations demand.", instruments:["Recapitalisation","Liability Management","Distressed Capital","Creditor Alignment","NPL Transactions"] },
  { mark:"Mergers & Acquisitions", title:"M&A & Strategic Transactions", body:"Cross-border acquisitions, strategic sales, and merger structures where conventional banking relationships do not reach. Our origination access in Africa, the GCC, Latin America, and Asia creates positioning advantages for buyers and sellers that larger institutions with no presence in these markets cannot replicate. We lead from structuring through to completion.", instruments:["Sell-Side","Buy-Side","Cross-Border","Strategic Positioning","Succession"] },
  { mark:"Working Capital & Trade", title:"Working Capital & Trade Finance", body:"We structure working capital and trade finance programmes that release trapped liquidity for corporates and exporters operating across 25 markets. Receivables finance, supply chain finance, reverse factoring, forfaiting, and purchase order finance are structured as capital architecture, not commodity products. Particular capability in export corridors between emerging and developed markets.", instruments:["Receivables Finance","Supply Chain Finance","Forfaiting","Trade Finance","PO Finance"] },
  { mark:"Real Assets & Energy", title:"Real Assets, Energy & Critical Minerals", body:"Energy transition, real asset financing, and critical minerals represent the defining capital deployment theme of this decade. We structure debt and equity capital for energy infrastructure, grid systems, battery and storage assets, and critical mineral supply chains. Carbon credit programmes, ESG-aligned capital structures, and green finance frameworks are integrated where the transaction warrants it.", instruments:["Energy Transition","Grid Finance","Critical Minerals","Carbon Markets","Green Finance"] },
];

const REGIONS = [
  { name:"United Kingdom & Europe", detail:"London · Frankfurt · Paris · Amsterdam · Milan · Madrid · Warsaw · Stockholm" },
  { name:"Africa", detail:"Nigeria · Kenya · South Africa · Ghana · DRC · Zambia · Côte d'Ivoire · Egypt · Ethiopia · Angola" },
  { name:"Gulf & Middle East", detail:"UAE · Saudi Arabia · Qatar · Kuwait · Bahrain · Oman · Iraq" },
  { name:"Latin America", detail:"Brazil · Mexico · Colombia · Peru · Chile · Argentina · Panama · Costa Rica" },
  { name:"Asia Pacific", detail:"India · Singapore · Japan · Indonesia · Malaysia · Philippines · Vietnam · South Korea" },
  { name:"North America", detail:"United States · Canada" },
];

const REACH_POINTS = [
  "Active transaction execution across infrastructure, private credit, and special situations mandates in 25 markets simultaneously, structured from Berkeley Square House, London.",
  "Capital partner access for transactions of £10 million and above, deployable globally without jurisdictional restriction, at the point of mandate initiation.",
  "Institutional relationships spanning sovereign wealth funds, development finance institutions, pension funds, and private credit managers across all active markets, built for transaction execution, not market commentary.",
  "The firm engages only where capital structure design, stakeholder alignment, and execution certainty are central to transaction completion.",
];

const SECTORS = [
  { ico:"⚡", name:"Energy & Power Systems" },
  { ico:"🏗️", name:"Infrastructure & Transport" },
  { ico:"💻", name:"Digital Infrastructure" },
  { ico:"⛏️", name:"Critical Minerals & Mining" },
  { ico:"🏥", name:"Healthcare" },
  { ico:"📱", name:"Financial Services & Fintech" },
  { ico:"🌾", name:"Agriculture & Agri-Tech" },
  { ico:"🏢", name:"Real Estate & Real Assets" },
  { ico:"🚢", name:"Trade, Logistics & Supply Chain" },
  { ico:"🛢️", name:"Oil, Gas & Commodities" },
  { ico:"🛡️", name:"Defence & National Security" },
  { ico:"🌿", name:"ESG & Impact Capital" },
];

const DIFF_CARDS = [
  { num:"I", title:"Proprietary Capital Participation", body:"We deploy balance sheet capital in transactions we originate and control. This is not an incidental capacity. It is a structural feature of how we operate. Capital alignment produces execution commitment that purely service-based relationships cannot replicate." },
  { num:"II", title:"No Institutional Conflict", body:"We hold no proprietary lending book serving our own balance sheet at the expense of transaction economics. We hold no fund positions creating allocation pressure. Every mandate is structured to deliver the optimal outcome for the transaction, not the optimal outcome for an internal product." },
  { num:"III", title:"Senior Execution Throughout", body:"Every mandate is led by principals from origination through close. The expertise that structures the transaction delivers the transaction. There is no internal handoff, no junior team managing documentation, and no dilution of institutional attention at the critical stages of execution." },
  { num:"IV", title:"Frontier Market Access That Functions", body:"Our Africa, Gulf, Latin America, and Asian transaction capability is structural. We hold origination relationships, institutional capital access, and stakeholder networks in these markets that generate mandates. This is not geographic aspiration. It is operational infrastructure built for transaction delivery." },
];

const CREDENTIALS = [
  "Specialist in cross-border infrastructure capital structuring and private credit for large-scale emerging and frontier market transactions",
  "Institutional relationships spanning sovereign wealth funds, development finance institutions, pension funds, and private credit managers across GCC, Africa, LATAM, and Asia",
  "Proprietary capital access for transactions of £10 million and above, deployed alongside institutional co-investors from a single mandate framework",
  "Founding principal of Sandspire Global, the private credit operating infrastructure platform, and Branksa, the enterprise AI governance institution",
  "Headquartered at Berkeley Square House, London, operating a global origination and capital execution mandate across 25 markets",
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".mg-rv");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function MayspearGlobal() {
  const [scrolled, setScrolled] = useState(false);
  const [prog, setProg] = useState(0);
  const [mobOpen, setMobOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ firstName:"", lastName:"", organisation:"", email:"", transactionType:"", message:"" });
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mx = useRef(0), my = useRef(0), rx = useRef(0), ry = useRef(0);

  useReveal();

  useEffect(() => {
    let raf;
    const onMove = e => {
      mx.current = e.clientX; my.current = e.clientY;
      if (dotRef.current) { dotRef.current.style.left = e.clientX + "px"; dotRef.current.style.top = e.clientY + "px"; }
    };
    const animate = () => {
      rx.current += (mx.current - rx.current) * 0.14;
      ry.current += (my.current - ry.current) * 0.14;
      if (ringRef.current) { ringRef.current.style.left = rx.current + "px"; ringRef.current.style.top = ry.current + "px"; }
      raf = requestAnimationFrame(animate);
    };
    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProg(p); setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addHover = el => { if (el && ringRef.current) { el.addEventListener("mouseenter", () => ringRef.current?.classList.add("h")); el.addEventListener("mouseleave", () => ringRef.current?.classList.remove("h")); } };

  const handleSubmit = e => {
    e.preventDefault();
    const { firstName, lastName, organisation, email, transactionType, message } = form;
    const subject = encodeURIComponent("Transaction Enquiry" + (transactionType ? " — " + transactionType : ""));
    const body = encodeURIComponent(`From: ${firstName} ${lastName}\nOrganisation: ${organisation}\nEmail: ${email}\nTransaction Type: ${transactionType}\n\n${message}`);
    window.location.href = `mailto:engagement@mayspearglobal.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  return (
    <>
      <style>{styles}</style>
      <div id="mg-prog" style={{ width: prog + "%" }} />
      <div className="mg-cur-dot" ref={dotRef} />
      <div className="mg-cur-ring" ref={ringRef} />

      {/* Mobile Nav */}
      <div className={`mg-mob-nav ${mobOpen ? "open" : ""}`}>
        {[["mandate","The Institution"],["capital","Capital Architecture"],["reach","Global Reach"],["leadership","Leadership"],["contact","Engage"]].map(([id,label]) => (
          <a key={id} href={`#${id}`} onClick={() => { setMobOpen(false); setTimeout(() => scrollTo(id), 100); }}>{label}</a>
        ))}
      </div>

      {/* Nav */}
      <nav className={`mg-nav ${scrolled ? "on" : ""}`} id="mg-mainNav">
        <a href="#" className="mg-nav-logo" onClick={e => { e.preventDefault(); window.scrollTo({ top:0, behavior:"smooth" }); }}>Mayspear<span>Global</span></a>
        <ul className="mg-nav-links">
          {[["mandate","The Institution"],["capital","Capital Architecture"],["reach","Global Reach"],["sectors","Sectors"],["leadership","Leadership"]].map(([id,label]) => (
            <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
          ))}
          <li><a href="#contact" className="mg-nav-engage" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>Engage</a></li>
        </ul>
        <button className="mg-burger" onClick={() => setMobOpen(o => !o)}><span/><span/><span/></button>
      </nav>

      {/* Hero */}
      <section id="mg-hero">
        <div className="mg-hero-l">
          <div className="mg-hero-institution">Infrastructure Capital &amp; Special Situations Institution</div>
          <h1 className="mg-h1">Capital<br/><em>structured.</em><br/>Situations<br/>resolved.</h1>
          <p className="mg-hero-tagline">Mayspear Global. Berkeley Square, London.</p>
          <p className="mg-hero-lead">We originate, structure, and execute <strong>large-scale cross-border transactions</strong> across infrastructure, private credit, energy systems, real assets, and special situations. We deploy proprietary balance sheet capital alongside institutional partners and take <strong>direct positions</strong> in selected transactions we originate.</p>
          <div className="mg-hero-btns">
            <a href="#contact" className="mg-btn-primary" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>Begin a Conversation</a>
            <a href="#mandate" className="mg-btn-outline" onClick={e => { e.preventDefault(); scrollTo("mandate"); }}>The Institution</a>
          </div>
          <div className="mg-hero-stats">
            {[["25+","Active Markets"],["6","Continents"],["£bn+","Transactions Executed"]].map(([v,l]) => (
              <div className="mg-hst" key={l}><div className="mg-hst-v">{v}</div><div className="mg-hst-l">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="mg-hero-r">
          <div className="mg-hero-pillars">
            {PILLARS.map(p => (
              <div className="mg-hp-item" key={p.title} ref={addHover}>
                <span className="mg-hp-icon">{p.icon}</span>
                <div><div className="mg-hp-title">{p.title}</div><div className="mg-hp-sub">{p.sub}</div></div>
              </div>
            ))}
          </div>
          <div className="mg-hero-mkts">
            <div className="mg-mkts-lbl">Active Markets</div>
            <div className="mg-mkt-pills">{MARKETS.map(m => <span className="mg-mkt-pill" key={m}>{m}</span>)}</div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="mg-ticker" aria-hidden="true">
        <div className="mg-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span className="mg-t-item" key={i}>{item}<span className="d">◆</span></span>
          ))}
        </div>
      </div>

      {/* Mandate */}
      <div className="mg-mandate-section" id="mandate">
        <div className="mg-cont">
          <div className="mg-mandate-grid mg-rv">
            <div>
              <div className="mg-eyebrow mg-eyebrow-lt">The Institution</div>
              <h2 className="mg-mandate-heading">At the point where<br/>capital formation,<br/>structure, and<br/><em>execution converge.</em></h2>
            </div>
            <div className="mg-mandate-body">
              <p>Mayspear Global originates and executes large-scale cross-border transactions across infrastructure, private credit, energy systems, real assets, and special situations.</p>
              <p>The institution operates at the point where capital formation, structure, and execution converge. Transactions are led where conventional financing, or sponsor-led processes are constrained by complexity, timing, or misaligned stakeholder incentives.</p>
              <p>It designs and delivers full capital architecture across debt, equity, and hybrid instruments, including senior lending, subordinated and mezzanine structures, structured private credit, acquisition finance, refinancings, liability management exercises, recapitalisations, and balance sheet restructuring across multi-jurisdictional environments.</p>
              <p>Mayspear Global operates across acquisition and refinancing events, stressed and special situations, and complex corporate and asset-level transactions where liquidity constraints or fragmented capital structures prevent standard market execution.</p>
              <p>The institution deploys proprietary balance sheet capital alongside institutional partners and takes direct positions in selected transactions it originates. Capital participation is aligned with structural control and execution responsibility.</p>
              <p>This integrated model combines origination, structuring, execution, and capital deployment within a single mandate framework across infrastructure systems, energy transition assets, private credit markets, and complex special situations.</p>
            </div>
          </div>
          <div className="mg-mandate-pillars mg-rv mg-d1" style={{ marginTop:"5rem" }}>
            {MANDATE_PILLARS.map(p => (
              <div className="mg-mp-item" key={p.num}>
                <div className="mg-mp-num">{p.num}</div>
                <div><div className="mg-mp-title">{p.title}</div><div className="mg-mp-body">{p.body}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capital Architecture */}
      <section className="mg-sec" id="capital">
        <div className="mg-cont">
          <div className="mg-rv">
            <div className="mg-eyebrow">Capital Architecture</div>
            <h2 className="mg-s-title">Full-stack capital design<br/>across every <em>instrument type</em></h2>
            <p className="mg-s-sub">We do not operate within a single product or instrument. Every mandate receives a capital structure designed for the specific transaction, not adapted from a standard template.</p>
          </div>
          <div className="mg-arch-grid mg-rv mg-d1">
            {ARCH_CARDS.map(c => (
              <article className="mg-arch-card" key={c.title} ref={addHover}>
                <div className="mg-ac-mark">{c.mark}</div>
                <h3 className="mg-ac-title">{c.title}</h3>
                <p className="mg-ac-body">{c.body}</p>
                <div className="mg-ac-instruments">{c.instruments.map(i => <span className="mg-ac-inst" key={i}>{i}</span>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="mg-sec mg-sec-dark" id="reach">
        <div className="mg-cont">
          <div className="mg-reach-wrap">
            <div className="mg-rv">
              <div className="mg-eyebrow mg-eyebrow-lt">Global Operations</div>
              <h2 className="mg-s-title">Where scale,<br/>complexity, and<br/><em>capital constraint</em><br/>determine outcome.</h2>
              <p className="mg-s-sub">Operations span the United Kingdom, Europe, the Middle East, and Africa, with transaction capability focused on markets where conventional financing routes are constrained by complexity, timing, or misaligned stakeholder incentives.</p>
              <div className="mg-reach-points">
                {REACH_POINTS.map((pt, i) => (
                  <div className="mg-rp" key={i}><div className="mg-rp-bar" /><div className="mg-rp-text">{pt}</div></div>
                ))}
              </div>
            </div>
            <div className="mg-rv mg-d1">
              <div className="mg-regions-grid">
                {REGIONS.map(r => (
                  <div className="mg-region" key={r.name} ref={addHover}>
                    <div className="mg-region-name">{r.name}</div>
                    <div className="mg-region-detail">{r.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="mg-sec" id="sectors">
        <div className="mg-cont">
          <div className="mg-rv">
            <div className="mg-eyebrow">Sector Coverage</div>
            <h2 className="mg-s-title">Deep transaction experience<br/>in the sectors that <em>move capital</em></h2>
          </div>
          <div className="mg-sector-grid mg-rv mg-d1">
            {SECTORS.map(s => (
              <div className="mg-sector" key={s.name} ref={addHover}>
                <span className="mg-sector-ico">{s.ico}</span>
                <div className="mg-sector-name">{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mayspear */}
      <section className="mg-sec mg-sec-dark">
        <div className="mg-cont">
          <div className="mg-rv">
            <div className="mg-eyebrow mg-eyebrow-lt">The Mayspear Difference</div>
            <h2 className="mg-s-title">Integrated capital,<br/>not <em>sequential process.</em></h2>
            <p className="mg-s-sub">The conventional model separates origination, structuring, and capital provision into distinct firms with separate agendas. We combine them within a single mandate framework where capital, structure, and execution are controlled by one institution.</p>
          </div>
          <div className="mg-diff-grid mg-rv mg-d1">
            {DIFF_CARDS.map(c => (
              <div className="mg-diff-card" key={c.num} ref={addHover}>
                <div className="mg-dc-num">{c.num}</div>
                <h3 className="mg-dc-title">{c.title}</h3>
                <p className="mg-dc-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="mg-sec mg-sec-alt" id="leadership">
        <div className="mg-cont">
          <div className="mg-rv">
            <div className="mg-eyebrow">Leadership</div>
            <h2 className="mg-s-title">Principals with<br/>direct <em>execution accountability</em></h2>
          </div>
          <div className="mg-lead-wrap mg-rv mg-d1">
            <div style={{ position:"relative" }}>
              <div className="mg-lead-frame"><span className="mg-lead-frame-text">JO</span></div>
              <div className="mg-lead-badge"><div className="mg-lb-name">Jayden Ohen</div><div className="mg-lb-title">Managing Partner</div></div>
            </div>
            <div>
              <h2 className="mg-lead-name">Jayden Ohen</h2>
              <div className="mg-lead-role">Managing Partner · Mayspear Global</div>
              <p className="mg-lead-bio">Jayden Ohen is the founding Managing Partner of Mayspear Global, with direct responsibility for all origination, capital structuring, and execution mandates across the institution's global operations. He leads every principal transaction personally across infrastructure capital, private credit, special situations, and cross-border M&A.</p>
              <p className="mg-lead-bio">With institutional relationships built across sovereign wealth funds, development finance institutions, private credit managers, and project sponsors in Africa, the GCC, Latin America, Asia, and Europe, Jayden operates at the intersection of capital formation and transaction execution in markets where access, speed, and structural precision determine outcome. He brings proprietary capital alongside institutional partners into every transaction the firm originates, aligning structural control with capital participation.</p>
              <div className="mg-lead-credentials">
                {CREDENTIALS.map((c, i) => (
                  <div className="mg-cred" key={i}><div className="mg-cred-dot" /><div className="mg-cred-text">{c}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mg-sec" id="contact">
        <div className="mg-cont">
          <div className="mg-rv">
            <div className="mg-eyebrow">Engage</div>
            <h2 className="mg-s-title">Every transaction<br/>begins with a <em>direct conversation</em></h2>
            <p className="mg-s-sub">If you are working on a transaction, a capital need, or a situation that requires integrated capital structuring and execution — write to us. We respond directly and without delay.</p>
          </div>
          <div className="mg-contact-grid mg-rv mg-d1">
            <div className="mg-contact-l">
              <div className="mg-c-label">Our Office</div>
              <address className="mg-c-address" style={{ fontStyle:"normal" }}>
                Mayspear Global<br/>Berkeley Square House<br/>Berkeley Square<br/>London, W1J 6BD<br/>United Kingdom
              </address>
              <div className="mg-c-detail">
                {[["General Enquiries","engagement@mayspearglobal.com"],["Transaction Enquiries","engagement@mayspearglobal.com"],["Website","www.mayspearglobal.com"]].map(([k,v]) => (
                  <div key={k}><span className="mg-c-d-key">{k}</span><div className="mg-c-d-val"><a href={k==="Website"?`https://${v}`:`mailto:${v}`}>{v}</a></div></div>
                ))}
              </div>
              <div className="mg-c-label" style={{ marginTop:"2rem" }}>Transaction Markets</div>
              <p style={{ fontSize:"0.85rem", color:"var(--stone)", lineHeight:1.78, marginTop:"0.5rem" }}>
                United Kingdom · Europe · Sub-Saharan Africa · Gulf Cooperation Council · Latin America · South &amp; Southeast Asia · North America
              </p>
            </div>
            <div className="mg-contact-r">
              <div className="mg-c-label">Send a Message</div>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mg-f-g2">
                  <div className="mg-form-group"><label className="mg-f-label">First Name</label><input className="mg-f-input" type="text" required value={form.firstName} onChange={e => setForm(f=>({...f,firstName:e.target.value}))} /></div>
                  <div className="mg-form-group"><label className="mg-f-label">Last Name</label><input className="mg-f-input" type="text" required value={form.lastName} onChange={e => setForm(f=>({...f,lastName:e.target.value}))} /></div>
                </div>
                <div className="mg-form-group"><label className="mg-f-label">Organisation</label><input className="mg-f-input" type="text" value={form.organisation} onChange={e => setForm(f=>({...f,organisation:e.target.value}))} /></div>
                <div className="mg-form-group"><label className="mg-f-label">Email Address</label><input className="mg-f-input" type="email" required value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} /></div>
                <div className="mg-form-group">
                  <label className="mg-f-label">Transaction Type</label>
                  <select className="mg-f-select" value={form.transactionType} onChange={e => setForm(f=>({...f,transactionType:e.target.value}))}>
                    <option value="">Select transaction type</option>
                    {["Infrastructure Capital","Private Credit","Special Situations","Mergers & Acquisitions","Working Capital & Trade Finance","Real Assets & Energy","Balance Sheet Restructuring","Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="mg-form-group"><label className="mg-f-label">Message</label><textarea className="mg-f-textarea" placeholder="Briefly describe the transaction or situation" value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} /></div>
                <button type="submit" className="mg-f-submit" style={formSent?{background:"var(--gold2)"}:{}}>{formSent?"Message Sent":"Send Message"}</button>
                <p className="mg-f-note">All communications are treated with strict confidentiality. We respond to every message personally and without delay.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <div className="mg-closing">
        <div className="mg-closing-pre">Mayspear Global</div>
        <h2 className="mg-closing-title">Capital formation.<br/>Structural control.<br/><em>Execution delivery.</em></h2>
        <p className="mg-closing-line">The institution engages only where it can determine outcome.</p>
        <div className="mg-closing-trio">
          {["Capital Architecture","Structural Control","Execution Delivery","Berkeley Square · London"].map((item, i, arr) => (
            <>
              <div className="mg-ct-item" key={item}>{item}</div>
              {i < arr.length - 1 && <div className="mg-ct-dot" key={`dot-${i}`} />}
            </>
          ))}
        </div>
        <a href="#contact" className="mg-btn-primary" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>Begin a Conversation</a>
      </div>

      {/* Footer */}
      <footer className="mg-footer">
        <div className="mg-cont">
          <div className="mg-footer-top">
            <div>
              <div className="mg-f-brand">Mayspear<span>Global</span></div>
              <p className="mg-f-tag">Infrastructure Capital &amp; Special Situations Institution. Originates, structures, and executes large-scale cross-border transactions across 25 markets from Berkeley Square, London.</p>
              <address className="mg-f-addr" style={{ fontStyle:"normal" }}>Berkeley Square House<br/>Berkeley Square<br/>London, W1J 6BD<br/>United Kingdom</address>
            </div>
            <div>
              <div className="mg-f-col-title">Capabilities</div>
              <ul className="mg-f-links">
                {["Infrastructure Capital","Private Credit","Special Situations","Mergers & Acquisitions","Working Capital & Trade","Real Assets & Energy"].map(item => (
                  <li key={item}><a href="#capital" onClick={e=>{ e.preventDefault(); scrollTo("capital"); }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mg-f-col-title">Markets</div>
              <ul className="mg-f-links">
                {["United Kingdom","Africa","Gulf Region","Latin America","Asia Pacific","North America"].map(item => (
                  <li key={item}><a href="#reach" onClick={e=>{ e.preventDefault(); scrollTo("reach"); }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mg-f-col-title">Institution</div>
              <ul className="mg-f-links">
                {[["mandate","The Institution"],["leadership","Managing Partner"],["sectors","Sectors"],["contact","Contact"],["contact","Engage"]].map(([id,label]) => (
                  <li key={label}><a href={`#${id}`} onClick={e=>{ e.preventDefault(); scrollTo(id); }}>{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mg-footer-bottom">
            <div className="mg-f-copy">© 2026 Mayspear Global. All rights reserved. Registered in England and Wales.</div>
            <ul className="mg-f-legal">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Engagement</a></li>
              <li><a href="#">Regulatory Disclosures</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}