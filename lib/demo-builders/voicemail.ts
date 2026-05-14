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
  const vkJs = (vapiPublicKey || '').replace(/"/g, '\\"')
  const aidJs = (vapiAssistantId || '').replace(/"/g, '\\"')

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
/* Single action button — state controlled by JS */
.action-btn{width:100%;padding:18px;border:none;border-radius:100px;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;margin-bottom:10px;font-family:inherit}
.action-btn.idle{background:#b797ff;color:#fff}
.action-btn.idle:hover{background:#a47ff5;transform:translateY(-1px)}
.action-btn.loading{background:#c8b0ff;color:#fff;cursor:default}
.action-btn.active{background:#fc5c7c;color:#fff}
.action-btn.active:hover{background:#e04d6c;transform:translateY(-1px)}
.action-btn.done{background:#f0ebff;color:#7c4dcc;border:1px solid #d4beff}
.action-btn.done:hover{background:#e8e0ff}
.pd{width:9px;height:9px;border-radius:50%;background:currentColor;opacity:.9;animation:pulse 1.4s ease infinite}
@keyframes pulse{0%{transform:scale(1);opacity:1}70%{transform:scale(1.8);opacity:0}100%{transform:scale(1);opacity:0}}
.bn{font-size:11px;color:#a09890;margin-bottom:4px}
.err-box{display:none;background:#fff0f0;border:1px solid #fcc;border-radius:10px;padding:12px;font-size:12px;color:#c0392b;margin-top:10px;line-height:1.65;text-align:left}
.err-box.show{display:block}
.live-box{display:none;background:#f0ebff;border-radius:14px;padding:14px;margin-top:14px;text-align:left}
.live-box.show{display:block}
.live-label{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#7c4dcc;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.live-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:blink 1s infinite}
.live-sub{font-size:12px;font-weight:300;color:#6b6560;line-height:1.6}
.result-box{display:none;margin-top:14px;text-align:left}
.result-box.show{display:block}
.sms{background:#1a1916;border-radius:12px;padding:14px}
.sms-tag{font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#c8f155;margin-bottom:5px}
.sms-body{font-size:12px;font-weight:300;color:rgba(255,255,255,.75);line-height:1.7}
hr.dv{border:none;border-top:1px solid #ede8e0;margin:24px 0}
.cta{font-size:12px;font-weight:300;color:#6b6560;line-height:1.8}
.cta a{color:#b797ff;font-weight:500;text-decoration:none}
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

  <button class="action-btn idle" id="action-btn" onclick="handleBtnClick()">
    <div class="pd" id="pd" style="display:none"></div>
    <span id="btn-label">Hear how it sounds</span>
  </button>
  <div class="bn" id="bn">No phone needed. Runs in your browser.</div>

  <div class="err-box" id="err-box"></div>

  <div class="live-box" id="live-box">
    <div class="live-label"><div class="live-dot"></div>Live call in progress</div>
    <div class="live-sub">Speak as if you are a client calling ${biz}. The assistant will respond naturally.</div>
  </div>

  <div class="result-box" id="result-box">
    <div class="sms">
      <div class="sms-tag">Text sent to you instantly</div>
      <div class="sms-body">New enquiry received. Caller details and best callback time saved. Ready for your follow-up.</div>
    </div>
  </div>

  <hr class="dv">
  <div class="cta">Interested in this for ${biz}?<br>Reply to this email or reach us at <a href="mailto:hello@omiflow.co.uk">hello@omiflow.co.uk</a></div>
</div>

<script>
(function() {
  'use strict';

  var VK = "${vkJs}";
  var AID = "${aidJs}";
  var FN = "${bizJs}";

  // ── State machine ──
  // idle | loading | active | done | error
  var state = 'idle';
  var vapi = null;
  var sdkLoaded = false;

  function el(id) { return document.getElementById(id); }

  // ── UI updater ──
  function setState(newState, errorMsg) {
    state = newState;
    var btn = el('action-btn');
    var label = el('btn-label');
    var pd = el('pd');
    var bn = el('bn');
    var errBox = el('err-box');
    var liveBox = el('live-box');

    btn.className = 'action-btn ' + (newState === 'error' ? 'idle' : newState);

    switch (newState) {
      case 'idle':
        label.textContent = 'Hear how it sounds';
        pd.style.display = 'none';
        bn.style.display = 'block';
        bn.textContent = 'No phone needed. Runs in your browser.';
        liveBox.classList.remove('show');
        errBox.classList.remove('show');
        break;

      case 'loading':
        label.textContent = 'Connecting...';
        pd.style.display = 'block';
        bn.style.display = 'none';
        errBox.classList.remove('show');
        break;

      case 'active':
        label.textContent = 'End call';
        pd.style.display = 'none';
        bn.style.display = 'none';
        liveBox.classList.add('show');
        errBox.classList.remove('show');
        break;

      case 'done':
        label.textContent = 'Hear it again';
        pd.style.display = 'none';
        bn.style.display = 'block';
        bn.textContent = 'Want to hear it again?';
        liveBox.classList.remove('show');
        el('result-box').classList.add('show');
        break;

      case 'error':
        label.textContent = 'Try again';
        pd.style.display = 'none';
        bn.style.display = 'block';
        bn.textContent = '';
        liveBox.classList.remove('show');
        if (errorMsg) {
          errBox.textContent = errorMsg;
          errBox.classList.add('show');
        }
        break;
    }
  }

  // ── SDK loader — tries multiple CDN paths ──
  function loadVapiSdk(cb) {
    if (sdkLoaded && (window.Vapi || window.VapiSDK)) { cb(null); return; }

    var cdnUrls = [
      'https://cdn.jsdelivr.net/npm/@vapi-ai/web@2/dist/vapi.umd.js',
      'https://unpkg.com/@vapi-ai/web@2/dist/vapi.umd.js',
      'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/vapi.umd.js'
    ];
    var idx = 0;

    function tryNext() {
      if (idx >= cdnUrls.length) {
        cb(new Error('Voice SDK could not be loaded from any source. Please check your internet connection.'));
        return;
      }
      var url = cdnUrls[idx++];
      var script = document.createElement('script');
      script.src = url;
      script.async = true;

      var timer = setTimeout(function() {
        script.onload = script.onerror = null;
        tryNext();
      }, 8000);

      script.onload = function() {
        clearTimeout(timer);
        // Poll for window.Vapi for up to 3s
        var attempts = 0;
        var check = setInterval(function() {
          attempts++;
          var VapiClass = window.Vapi || window.VapiSDK || (window.Vapi && window.Vapi.default);
          if (VapiClass) {
            clearInterval(check);
            if (!window.Vapi && window.VapiSDK) window.Vapi = window.VapiSDK;
            sdkLoaded = true;
            cb(null);
          } else if (attempts >= 30) {
            clearInterval(check);
            tryNext();
          }
        }, 100);
      };

      script.onerror = function() {
        clearTimeout(timer);
        tryNext();
      };

      document.head.appendChild(script);
    }

    tryNext();
  }

  // ── Vapi initialiser ──
  function initVapi(cb) {
    if (!VK || !AID) {
      cb(new Error('Demo not fully configured. Vapi keys are missing. Contact hello@omiflow.co.uk for access.'));
      return;
    }

    loadVapiSdk(function(err) {
      if (err) { cb(err); return; }

      if (vapi) { cb(null); return; } // Already initialised

      try {
        var VapiClass = window.Vapi;
        vapi = new VapiClass(VK);

        vapi.on('call-start', function() {
          setState('active');
        });

        vapi.on('call-end', function() {
          setState('done');
        });

        vapi.on('error', function(e) {
          console.error('[Vapi error]', e);
          var msg = (e && (e.message || e.error || String(e))) || 'Call ended unexpectedly.';
          if (/permission|microphone|denied/i.test(msg)) {
            msg = 'Microphone access was denied. Click the padlock in your browser address bar, allow Microphone, then refresh.';
          } else if (/invalid|key|auth/i.test(msg)) {
            msg = 'Configuration issue. Please contact hello@omiflow.co.uk';
          }
          setState('error', msg);
        });

        cb(null);
      } catch(e) {
        cb(new Error('Could not initialise voice assistant: ' + (e.message || String(e))));
      }
    });
  }

  // ── Button click handler ──
  window.handleBtnClick = function() {
    if (state === 'loading') return;

    if (state === 'active') {
      // End the call
      if (vapi) {
        try { vapi.stop(); } catch(e) { console.warn('[Vapi] stop error', e); }
      }
      return;
    }

    // Start the call: idle, done, or error -> start
    setState('loading');

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        stream.getTracks().forEach(function(t) { t.stop(); });

        initVapi(function(err) {
          if (err) {
            setState('error', err.message);
            return;
          }

          try {
            var callPromise = vapi.start(AID, {
              variableValues: { firmName: FN }
            });

            if (callPromise && typeof callPromise.then === 'function') {
              callPromise.catch(function(e) {
                var msg = (e && (e.message || String(e))) || 'Could not start the call.';
                if (/invalid|key|auth|unauthorized/i.test(msg)) {
                  msg = 'Could not connect. Please contact hello@omiflow.co.uk';
                }
                setState('error', msg);
              });
            }
          } catch(e) {
            setState('error', 'Could not start the call: ' + (e.message || String(e)));
          }
        });
      })
      .catch(function(err) {
        var msg = 'Microphone access is required to hear the demo. ';
        if (/denied|notallowed/i.test((err.name || err.message || ''))) {
          msg += 'Click the padlock icon in your address bar, set Microphone to Allow, then refresh and try again.';
        } else {
          msg += 'Please check your browser microphone settings.';
        }
        setState('error', msg);
      });
  };

  // ── Pre-warm SDK silently on page load ──
  window.addEventListener('load', function() {
    loadVapiSdk(function(err) {
      if (!err) {
        initVapi(function() {});
      }
    });
  });

})();
</script>
</body>
</html>`
}
