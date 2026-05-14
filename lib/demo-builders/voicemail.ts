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

  // Escape for safe use inside JS template literals
  const bizJs = biz.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
  const vkJs = (vapiPublicKey || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const aidJs = (vapiAssistantId || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')

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
/* Hide any Vapi floating button that the SDK might inject */
#vapi-support-btn,#vapi-support-btn-container,.vapi-btn,.vapi-widget-wrapper{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
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
.btn{width:100%;padding:18px;border:none;border-radius:100px;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:background .2s,transform .15s;margin-bottom:10px;font-family:inherit;outline:none}
.btn-idle{background:#b797ff;color:#fff}
.btn-idle:hover{background:#a47ff5;transform:translateY(-1px)}
.btn-loading{background:#c8b0ff;color:#fff;cursor:default}
.btn-active{background:#fc5c7c;color:#fff}
.btn-active:hover{background:#e8446a;transform:translateY(-1px)}
.btn-done{background:transparent;color:#7c4dcc;border:1.5px solid #d4beff}
.btn-done:hover{background:#f4f0ff}
.spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.pulse-dot{width:9px;height:9px;border-radius:50%;background:#fff;animation:pulse-a 1.4s ease infinite;flex-shrink:0}
@keyframes pulse-a{0%{transform:scale(1);opacity:1}70%{transform:scale(1.9);opacity:0}100%{transform:scale(1);opacity:0}}
.sub-note{font-size:11px;color:#a09890;margin-bottom:4px;min-height:16px}
.err{display:none;background:#fff0f0;border:1px solid #fcc;border-radius:10px;padding:12px;font-size:12px;color:#c0392b;margin-top:10px;line-height:1.65;text-align:left}
.err.show{display:block}
.live{display:none;background:#f0ebff;border-radius:14px;padding:14px;margin-top:14px;text-align:left}
.live.show{display:block}
.live-lbl{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#7c4dcc;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.live-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:blink 1s infinite}
.live-sub{font-size:12px;font-weight:300;color:#6b6560;line-height:1.6}
.result{display:none;margin-top:14px;text-align:left}
.result.show{display:block}
.sms{background:#1a1916;border-radius:12px;padding:14px}
.sms-tag{font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#c8f155;margin-bottom:5px}
.sms-body{font-size:12px;font-weight:300;color:rgba(255,255,255,.75);line-height:1.7}
hr.dv{border:none;border-top:1px solid #ede8e0;margin:24px 0}
.cta-footer{font-size:12px;font-weight:300;color:#6b6560;line-height:1.8}
.cta-footer a{color:#b797ff;font-weight:500;text-decoration:none}
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
    <span id="btn-icon"></span>
    <span id="btn-lbl">Hear how it sounds</span>
  </button>
  <div class="sub-note" id="sub-note">No phone needed. Runs in your browser.</div>

  <div class="err" id="err"></div>

  <div class="live" id="live">
    <div class="live-lbl"><div class="live-dot"></div>Live call in progress</div>
    <div class="live-sub">Speak as if you are a client calling ${biz}. The assistant will respond naturally.</div>
  </div>

  <div class="result" id="result">
    <div class="sms">
      <div class="sms-tag">Text sent to you instantly</div>
      <div class="sms-body">New enquiry received. Caller details and best callback time saved.</div>
    </div>
  </div>

  <hr class="dv">
  <div class="cta-footer">Interested in this for ${biz}?<br>Reply to this email or reach us at <a href="mailto:hello@omiflow.co.uk">hello@omiflow.co.uk</a></div>
</div>

<script>
(function(){
  'use strict';

  // Config — injected server-side
  var VK  = "${vkJs}";
  var AID = "${aidJs}";
  var FN  = \`${bizJs}\`;

  // ── State ────────────────────────────────────────────────────────────
  var STATE = 'idle';   // idle | loading | active | done | error
  var vapiInst = null;
  var sdkReady  = false;

  // ── DOM helpers ──────────────────────────────────────────────────────
  function q(id){ return document.getElementById(id); }

  function applyState(s, errMsg){
    STATE = s;
    var btn    = q('btn');
    var icon   = q('btn-icon');
    var lbl    = q('btn-lbl');
    var note   = q('sub-note');
    var errEl  = q('err');
    var liveEl = q('live');

    // Clear icon
    icon.className = '';
    icon.innerHTML = '';

    btn.className = 'btn';

    switch(s){
      case 'idle':
        btn.classList.add('btn-idle');
        lbl.textContent = 'Hear how it sounds';
        note.textContent = 'No phone needed. Runs in your browser.';
        liveEl.classList.remove('show');
        errEl.classList.remove('show');
        break;

      case 'loading':
        btn.classList.add('btn-loading');
        lbl.textContent = 'Connecting...';
        icon.className = 'spin';
        note.textContent = '';
        errEl.classList.remove('show');
        break;

      case 'active':
        btn.classList.add('btn-active');
        icon.className = 'pulse-dot';
        lbl.textContent = 'End call';
        note.textContent = '';
        liveEl.classList.add('show');
        errEl.classList.remove('show');
        break;

      case 'done':
        btn.classList.add('btn-done');
        lbl.textContent = 'Hear it again';
        note.textContent = 'Thanks for listening.';
        liveEl.classList.remove('show');
        q('result').classList.add('show');
        break;

      case 'error':
        btn.classList.add('btn-idle');
        lbl.textContent = 'Try again';
        note.textContent = '';
        liveEl.classList.remove('show');
        if(errMsg){
          errEl.textContent = errMsg;
          errEl.classList.add('show');
        }
        break;
    }
  }

  // ── SDK loader ───────────────────────────────────────────────────────
  // Uses the official Vapi HTML script tag CDN (window.vapiSDK)
  // Falls back to community UMD bundle (window.Vapi)
  function loadSDK(cb){
    if(sdkReady){ cb(null); return; }

    function tryScript(url, onDone){
      var s = document.createElement('script');
      s.src = url;
      s.async = true;

      var t = setTimeout(function(){
        s.onload = s.onerror = null;
        onDone(new Error('timeout'));
      }, 10000);

      s.onload = function(){
        clearTimeout(t);
        // Poll up to 3s for either window.vapiSDK or window.Vapi
        var n = 0;
        var poll = setInterval(function(){
          n++;
          if(window.vapiSDK || window.Vapi){
            clearInterval(poll);
            onDone(null);
          } else if(n >= 30){
            clearInterval(poll);
            onDone(new Error('SDK not exported after load'));
          }
        }, 100);
      };

      s.onerror = function(){
        clearTimeout(t);
        onDone(new Error('script error'));
      };

      document.head.appendChild(s);
    }

    // Primary: official vapiSDK html-script-tag
    tryScript(
      'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js',
      function(err){
        if(!err && window.vapiSDK){ sdkReady = true; cb(null); return; }
        // Fallback: community UMD bundle that wraps @vapi-ai/web properly for browsers
        tryScript(
          'https://cdn.jsdelivr.net/gh/balacodeio/Vapi-Web-UMD@2.1.0/dist/2.1.0/vapi-web-bundle-2.1.0.min.js',
          function(err2){
            if(!err2 && window.Vapi){ sdkReady = true; cb(null); return; }
            cb(new Error('Could not load voice SDK. Please check your internet connection and try again.'));
          }
        );
      }
    );
  }

  // ── Vapi instance factory ────────────────────────────────────────────
  function createVapi(cb){
    if(!VK || !AID){
      cb(new Error('Demo not fully configured. Vapi keys missing. Contact hello@omiflow.co.uk'));
      return;
    }

    loadSDK(function(err){
      if(err){ cb(err); return; }

      if(vapiInst){ cb(null); return; }

      try{
        // vapiSDK.run() — official approach, returns a Vapi-compatible instance
        // The floating button is hidden by CSS above
        if(window.vapiSDK){
          vapiInst = window.vapiSDK.run({
            apiKey: VK,
            assistant: AID,
            config: { position: 'bottom-right', offset: '-9999px 0px' }
          });
        } else {
          // Community UMD fallback
          vapiInst = new window.Vapi(VK);
        }

        vapiInst.on('call-start', function(){
          applyState('active');
        });

        vapiInst.on('call-end', function(){
          applyState('done');
        });

        vapiInst.on('error', function(e){
          console.error('[Vapi error]', e);
          var msg = (e && (e.message || e.error || String(e))) || '';
          if(/permission|denied|notallowed|microphone/i.test(msg)){
            applyState('error', 'Microphone access was denied. Click the padlock icon in your browser address bar, allow Microphone, then refresh and try again.');
          } else if(/invalid|key|auth|unauthorized/i.test(msg)){
            applyState('error', 'Configuration issue. Please contact hello@omiflow.co.uk to report this.');
          } else {
            applyState('error', 'The call ended unexpectedly. Please refresh and try again.');
          }
        });

        cb(null);
      } catch(ex){
        cb(new Error('Could not initialise voice assistant: ' + (ex.message || String(ex))));
      }
    });
  }

  // ── Button handler ───────────────────────────────────────────────────
  window.handleClick = function(){
    if(STATE === 'loading') return;

    // If call is active, end it
    if(STATE === 'active'){
      if(vapiInst){
        try{ vapiInst.stop(); } catch(e){ console.warn('[Vapi stop]', e); }
      }
      return;
    }

    applyState('loading');

    // Request microphone permission first — gives cleaner error message if denied
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      applyState('error', 'Your browser does not support microphone access. Please use Chrome, Edge, or Safari.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream){
        stream.getTracks().forEach(function(t){ t.stop(); }); // release immediately

        createVapi(function(err){
          if(err){ applyState('error', err.message); return; }

          try{
            var p = vapiInst.start(AID, { variableValues: { firmName: FN } });
            if(p && typeof p.catch === 'function'){
              p.catch(function(e){
                var msg = (e && (e.message || String(e))) || '';
                if(/invalid|key|auth/i.test(msg)){
                  applyState('error', 'Could not connect. Please contact hello@omiflow.co.uk');
                } else {
                  applyState('error', 'Could not start the call. Please refresh and try again.');
                }
              });
            }
          } catch(e){
            applyState('error', 'Could not start the call: ' + (e.message || String(e)));
          }
        });
      })
      .catch(function(err){
        if(/denied|notallowed/i.test((err.name || err.message || ''))){
          applyState('error', 'Microphone access was denied. Click the padlock icon in your browser address bar, allow Microphone, then refresh and try again.');
        } else {
          applyState('error', 'Could not access your microphone. Please check your browser settings and try again.');
        }
      });
  };

  // ── Pre-warm SDK in background ────────────────────────────────────────
  window.addEventListener('load', function(){
    loadSDK(function(err){
      if(!err) createVapi(function(){});
    });
  });

})();
</script>
</body>
</html>`
}
