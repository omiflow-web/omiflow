import type { CleanedLead } from '../types'

export function buildVoicemailDemo(
  lead: CleanedLead,
  vapiPublicKey: string,
  vapiAssistantId: string
): string {
  const biz = (lead.business_name || 'Your Business')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const fname = (lead.name_for_emails || lead.business_name?.split(' ')[0] || 'there')
    .replace(/"/g, '&quot;')

  const bizJs = biz.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
  const vkJs = (vapiPublicKey || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`')
  const aidJs = (vapiAssistantId || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Voicemail Demo \u2014 ${biz}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;1,400&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#111;font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:52px 20px 40px}
/* Hide any Vapi floating widget - we use our own button */
[id*="vapi"],[class*="vapi-widget"],[class*="vapi-btn"]{position:fixed!important;bottom:-9999px!important;right:-9999px!important;opacity:0!important;pointer-events:none!important;visibility:hidden!important}
.bar{position:fixed;top:0;left:0;right:0;background:#0a0a0a;border-bottom:1px solid #1f1f1f;color:#c8f155;font-size:10px;letter-spacing:.1em;text-transform:uppercase;text-align:center;padding:8px;display:flex;align-items:center;justify-content:center;gap:10px;z-index:100}
.dot{width:5px;height:5px;border-radius:50%;background:#c8f155;animation:blink 2s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
.card{background:#f8f7f4;border:1px solid #e4ddd2;border-radius:24px;padding:44px 36px;max-width:460px;width:100%;text-align:center}
.hi{font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#b797ff;margin-bottom:12px}
h1{font-family:'Playfair Display',serif;font-size:26px;font-weight:500;color:#1a1916;line-height:1.2;margin-bottom:14px}
.sub{font-size:13px;font-weight:300;color:#6b6560;line-height:1.75;margin-bottom:22px}
.steps{background:#fff;border:1px solid #e4ddd2;border-radius:14px;padding:18px;margin-bottom:28px;text-align:left;display:flex;flex-direction:column;gap:14px}
.step{display:flex;gap:12px;align-items:center}
.num{width:22px;height:22px;border-radius:50%;background:#b797ff;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.st{font-size:13px;color:#1a1916;font-weight:500;line-height:1.5}
.btn{width:100%;padding:18px;border:none;border-radius:100px;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:background .2s,transform .15s;margin-bottom:10px;font-family:inherit}
.btn-idle{background:#b797ff;color:#fff}
.btn-idle:hover{background:#a47ff5;transform:translateY(-1px)}
.btn-loading{background:#c8b0ff;color:#fff;cursor:default;pointer-events:none}
.btn-active{background:#fc5c7c;color:#fff}
.btn-active:hover{background:#e8446a;transform:translateY(-1px)}
.btn-done{background:transparent;color:#7c4dcc;border:1.5px solid #d4beff}
.btn-done:hover{background:#f4f0ff}
.spin{width:16px;height:16px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.subnote{font-size:11px;color:#a09890;margin-bottom:4px;min-height:16px;text-align:center}
.errbox{display:none;background:#fff0f0;border:1px solid #fcc;border-radius:10px;padding:12px;font-size:12px;color:#c0392b;margin-top:10px;line-height:1.65;text-align:left}
.errbox.show{display:block}
.livebox{display:none;background:#f0ebff;border-radius:14px;padding:14px;margin-top:14px;text-align:left}
.livebox.show{display:block}
.livelbl{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#7c4dcc;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.livedot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:blink 1s infinite}
.livesub{font-size:12px;font-weight:300;color:#6b6560;line-height:1.6}
.resultbox{display:none;margin-top:14px;text-align:left}
.resultbox.show{display:block}
.sms{background:#1a1916;border-radius:12px;padding:14px}
.smstag{font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#c8f155;margin-bottom:5px}
.smsbody{font-size:12px;font-weight:300;color:rgba(255,255,255,.75);line-height:1.7}
hr{border:none;border-top:1px solid #ede8e0;margin:24px 0}
.footer{font-size:12px;font-weight:300;color:#6b6560;line-height:1.8}
.footer a{color:#b797ff;font-weight:500;text-decoration:none}
</style>
</head>
<body>
<div class="bar"><div class="dot"></div>Demo by Omiflow &nbsp;&middot;&nbsp; Built for ${biz}</div>
<div class="card">
  <div class="hi">Hi, ${fname}</div>
  <h1>The call your client made while you were unavailable. Answered.</h1>
  <p class="sub">Every unanswered call is a potential client who moved on. Here is what happens instead.</p>
  <div class="steps">
    <div class="step"><div class="num">1</div><div class="st">On ring three of that same call, the line answers and greets your client by your business name</div></div>
    <div class="step"><div class="num">2</div><div class="st">A natural conversation collects their name, reason for calling, and best callback time</div></div>
    <div class="step"><div class="num">3</div><div class="st">You receive a text summary so you can call them back fully informed</div></div>
  </div>
  <button class="btn btn-idle" id="btn" onclick="handleClick()">
    <span id="btnicon"></span>
    <span id="btnlbl">Hear how it sounds</span>
  </button>
  <div class="subnote" id="subnote">No phone needed. Runs in your browser.</div>
  <div class="errbox" id="errbox"></div>
  <div class="livebox" id="livebox">
    <div class="livelbl"><div class="livedot"></div>Live call in progress</div>
    <div class="livesub">Speak as a customer calling ${biz}. The assistant will respond naturally.</div>
  </div>
  <div class="resultbox" id="resultbox">
    <div class="sms">
      <div class="smstag">Text sent to you instantly</div>
      <div class="smsbody">New enquiry received. Caller details and callback time saved.</div>
    </div>
  </div>
  <hr>
  <div class="footer">Interested in this for ${biz}?<br>Reply to this email or reach us at <a href="mailto:hello@omiflow.co.uk">hello@omiflow.co.uk</a></div>
</div>
<script>
(function(){
  'use strict';
  var VK  = \`${vkJs}\`;
  var AID = \`${aidJs}\`;
  var FN  = \`${bizJs}\`;
  var STATE = 'idle';
  var sdk = null;

  function g(id){ return document.getElementById(id); }

  function ui(state, err){
    STATE = state;
    var btn  = g('btn');
    var icon = g('btnicon');
    var lbl  = g('btnlbl');
    var note = g('subnote');
    var errb = g('errbox');
    var live = g('livebox');
    icon.innerHTML=''; icon.className='';
    btn.className='btn';
    errb.classList.remove('show');
    live.classList.remove('show');

    if(state==='idle'){
      btn.classList.add('btn-idle');
      lbl.textContent='Hear how it sounds';
      note.textContent='No phone needed. Runs in your browser.';
    } else if(state==='loading'){
      btn.classList.add('btn-loading');
      icon.className='spin'; lbl.textContent='Connecting...'; note.textContent='';
    } else if(state==='active'){
      btn.classList.add('btn-active');
      lbl.textContent='End call'; note.textContent='';
      live.classList.add('show');
    } else if(state==='done'){
      btn.classList.add('btn-done');
      lbl.textContent='Hear it again'; note.textContent='';
      g('resultbox').classList.add('show');
    } else if(state==='error'){
      btn.classList.add('btn-idle');
      lbl.textContent='Try again'; note.textContent='';
      if(err){ errb.textContent=err; errb.classList.add('show'); }
    }
  }

  function loadSDK(cb){
    if(window.vapiSDK){ cb(null); return; }
    var done=false;
    function finish(e){ if(done)return; done=true; cb(e); }
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    s.async=true;
    var t=setTimeout(function(){ finish(new Error('SDK load timeout')); },12000);
    s.onload=function(){
      clearTimeout(t);
      var n=0; var poll=setInterval(function(){
        n++;
        if(window.vapiSDK){ clearInterval(poll); finish(null); }
        else if(n>40){ clearInterval(poll); finish(new Error('SDK loaded but vapiSDK not found')); }
      },100);
    };
    s.onerror=function(){ clearTimeout(t); finish(new Error('Failed to load voice SDK script')); };
    document.head.appendChild(s);
  }

  function initSDK(cb){
    if(sdk){ cb(null); return; }
    if(!VK||!AID){
      cb(new Error('Vapi keys not configured. Contact hello@omiflow.co.uk'));
      return;
    }
    loadSDK(function(err){
      if(err){ cb(err); return; }
      try{
        // Log exact values for debugging
        console.log('[Vapi] Public key present:', VK.length > 0);
        console.log('[Vapi] Assistant ID present:', AID.length > 0);
        console.log('[Vapi] Business name:', FN);
        console.log('[Vapi] Key prefix:', VK.slice(0,8), '| Assistant:', AID);
        sdk = window.vapiSDK.run({
          apiKey: VK,
          assistant: AID,
          assistantOverrides: { variableValues: { firmName: FN } },
          config: { position:'bottom-right', offset:'-9999px -9999px' }
        });
        sdk.on('call-start', function(){ ui('active'); });
        sdk.on('call-end',   function(){ ui('done'); });
        sdk.on('error', function(e){
          console.error('[Vapi error]', e);
          var msg = (e&&(e.message||e.error||JSON.stringify(e)))||'Unknown error';
          if(/401|unauthori/i.test(msg)){
            msg='Authentication failed. The Vapi public key may be incorrect. Contact hello@omiflow.co.uk';
          } else if(/denied|microphone|permission/i.test(msg)){
            msg='Microphone access denied. Click the padlock in your browser address bar, allow Microphone, and refresh.';
          } else {
            msg='Call ended unexpectedly. Please try again.';
          }
          ui('error', msg);
        });
        cb(null);
      } catch(ex){
        cb(new Error('SDK init error: '+(ex.message||String(ex))));
      }
    });
  }

  window.handleClick = function(){
    if(STATE==='loading') return;
    if(STATE==='active'){
      if(sdk){ try{ sdk.stop(); }catch(e){ console.warn('[Vapi stop]',e); } }
      return;
    }
    ui('loading');
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
      ui('error','Your browser does not support microphone access. Please use Chrome, Edge, or Safari.');
      return;
    }
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
      stream.getTracks().forEach(function(t){ t.stop(); });
      initSDK(function(err){
        if(err){ ui('error',err.message); return; }
        try{
          console.log('[Vapi] Calling start() | assistant:', AID, '| key prefix:', VK.slice(0,8));
          var p = sdk.start();
          if(p&&typeof p.catch==='function'){
            p.catch(function(e){
              var m=(e&&(e.message||String(e)))||'';
              console.error('[Vapi start error]', e);
              if(/401|unauthori/i.test(m)) ui('error','Authentication failed (401). Check the Vapi public key in Vercel environment variables.');
              else ui('error','Could not start call. Please refresh and try again.');
            });
          }
        } catch(ex){
          ui('error','Call start error: '+(ex.message||String(ex)));
        }
      });
    }).catch(function(err){
      if(/denied|notallowed/i.test(err.name||err.message||''))
        ui('error','Microphone access denied. Click the padlock in your address bar, allow Microphone, and refresh.');
      else
        ui('error','Could not access microphone. Check your browser settings.');
    });
  };

  window.addEventListener('load', function(){
    loadSDK(function(err){
      if(!err) initSDK(function(){
        console.log('[Vapi] Pre-warmed successfully');
      });
    });
  });
})();
</script>
</body>
</html>`
}
