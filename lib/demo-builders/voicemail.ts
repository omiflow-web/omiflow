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

  // Escape for use inside JS string literals
  const bizJs = biz.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'")
  const vkJs = vapiPublicKey.replace(/"/g, '\\"')
  const aidJs = vapiAssistantId.replace(/"/g, '\\"')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Voicemail Demo — ${biz}</title>
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
/* States: idle, loading, live, done, error */
.cbtn{width:100%;padding:18px;background:#b797ff;color:#fff;border:none;border-radius:100px;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;margin-bottom:10px;font-family:inherit}
.cbtn:hover:not(:disabled){background:#a47ff5;transform:translateY(-1px)}
.cbtn:disabled{background:#d4beff;cursor:default;transform:none}
.cbtn.loading{background:#c8b0ff}
.pd{width:9px;height:9px;border-radius:50%;background:#fff;animation:pulse 1.4s ease infinite}
@keyframes pulse{0%{transform:scale(1);opacity:1}70%{transform:scale(1.8);opacity:0}100%{transform:scale(1);opacity:0}}
.bn{font-size:11px;color:#a09890;margin-bottom:4px}
.err{display:none;background:#fff0f0;border:1px solid #fcc;border-radius:10px;padding:12px;font-size:12px;color:#c0392b;margin-top:10px;line-height:1.65;text-align:left}
.err.show{display:block}
.live-box{display:none;background:#f0ebff;border-radius:14px;padding:14px;margin-top:14px;text-align:left}
.live-box.show{display:block}
.live-label{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#7c4dcc;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.live-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:blink 1s infinite}
.live-sub{font-size:12px;font-weight:300;color:#6b6560;line-height:1.6}
.end-btn{width:100%;padding:11px;background:transparent;border:1px solid #d4beff;border-radius:100px;font-size:13px;font-weight:500;color:#b797ff;cursor:pointer;margin-top:10px;display:none;font-family:inherit;transition:background .2s}
.end-btn.show{display:block}
.end-btn:hover{background:#f0ebff}
.result{display:none;margin-top:14px;text-align:left}
.result.show{display:block}
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
    <div class="step"><div class="num">1</div><div class="st">On ring three of that same call, the line is answered and greets your client by your business name</div></div>
    <div class="step"><div class="num">2</div><div class="st">A natural conversation collects their name, reason for calling, and best callback time</div></div>
    <div class="step"><div class="num">3</div><div class="st">You receive a text summary instantly so you can call them back fully informed</div></div>
  </div>
  <button class="cbtn" id="cbtn" onclick="startCall()">
    <div class="pd" id="pd"></div>
    <span id="btn-text">Hear how it sounds</span>
  </button>
  <div class="bn" id="bn">No phone needed. Runs in your browser.</div>
  <div class="err" id="err"></div>
  <div class="live-box" id="live-box">
    <div class="live-label"><div class="live-dot"></div>Live — speak as a client calling ${biz}</div>
    <div class="live-sub">The assistant will respond naturally. Try asking about availability or leaving your details.</div>
  </div>
  <button class="end-btn" id="end-btn" onclick="endCall()">End call</button>
  <div class="result" id="result">
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
  var VK = "${vkJs}";
  var AID = "${aidJs}";
  var FN = "${bizJs}";
  var vapi = null;
  var callActive = false;
  var sdkReady = false;
  var sdkAttempts = 0;

  function el(id) { return document.getElementById(id); }

  function setBtn(text, disabled, loading) {
    var btn = el('cbtn');
    var txtEl = el('btn-text');
    var pdEl = el('pd');
    txtEl.textContent = text;
    btn.disabled = !!disabled;
    btn.classList.toggle('loading', !!loading);
    if (pdEl) pdEl.style.animation = loading ? 'none' : 'pulse 1.4s ease infinite';
  }

  function showErr(msg) {
    var e = el('err');
    e.textContent = msg;
    e.classList.add('show');
  }

  function clearErr() {
    el('err').classList.remove('show');
  }

  function showLive() {
    el('live-box').classList.add('show');
    el('end-btn').classList.add('show');
    el('bn').style.display = 'none';
  }

  function hideLive() {
    el('live-box').classList.remove('show');
    el('end-btn').classList.remove('show');
    el('bn').style.display = 'block';
  }

  function showResult() {
    el('result').classList.add('show');
  }

  // Load Vapi SDK dynamically and wait for it
  function loadSdk(callback) {
    if (window.Vapi) { callback(null); return; }

    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/vapi.umd.js';
    s.onload = function() {
      // SDK loaded — wait up to 3s for window.Vapi to be defined
      var attempts = 0;
      var check = setInterval(function() {
        attempts++;
        if (window.Vapi) {
          clearInterval(check);
          callback(null);
        } else if (attempts >= 30) {
          clearInterval(check);
          callback(new Error('Vapi SDK loaded but not initialised after 3 seconds'));
        }
      }, 100);
    };
    s.onerror = function() {
      callback(new Error('Failed to load voice SDK. Check your internet connection and try again.'));
    };
    document.head.appendChild(s);
  }

  function initVapi(callback) {
    if (!VK || !AID) {
      callback(new Error('Voice demo is not configured yet. Vapi keys are missing.'));
      return;
    }

    loadSdk(function(err) {
      if (err) { callback(err); return; }

      try {
        vapi = new window.Vapi(VK);

        vapi.on('call-start', function() {
          callActive = true;
          setBtn('Connected', false, false);
          el('cbtn').style.display = 'none';
          showLive();
        });

        vapi.on('call-end', function() {
          callActive = false;
          hideLive();
          setBtn('Hear it again', false, false);
          el('cbtn').style.display = 'flex';
          showResult();
        });

        vapi.on('error', function(e) {
          console.error('[Vapi]', e);
          callActive = false;
          hideLive();
          setBtn('Try again', false, false);
          el('cbtn').style.display = 'flex';
          var msg = e && e.message ? e.message : String(e);
          if (/permission|microphone|denied|notallowed/i.test(msg)) {
            showErr('Microphone access was denied. Click the padlock in your browser address bar, allow Microphone access, then refresh this page.');
          } else {
            showErr('Call ended with an error. Please refresh and try again.');
          }
        });

        sdkReady = true;
        callback(null);

      } catch(e) {
        callback(new Error('Failed to initialise voice SDK: ' + e.message));
      }
    });
  }

  window.startCall = function() {
    clearErr();
    setBtn('Connecting...', true, true);

    // Request microphone permission explicitly first
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        // Stop the stream immediately — we just needed permission
        stream.getTracks().forEach(function(t) { t.stop(); });

        function doStart() {
          var call = vapi.start(AID, { variableValues: { firmName: FN } });
          if (call && typeof call.then === 'function') {
            call.catch(function(e) {
              setBtn('Try again', false, false);
              el('cbtn').style.display = 'flex';
              var msg = e && e.message ? e.message : String(e);
              if (/invalid|unauthorized|key/i.test(msg)) {
                showErr('Invalid Vapi configuration. Please contact us to report this.');
              } else {
                showErr('Could not start the call. Please refresh and try again.');
              }
            });
          }
        }

        if (sdkReady && vapi) {
          doStart();
        } else {
          initVapi(function(err) {
            if (err) {
              setBtn('Hear how it sounds', false, false);
              el('cbtn').style.display = 'flex';
              showErr(err.message);
              return;
            }
            doStart();
          });
        }
      })
      .catch(function(err) {
        setBtn('Hear how it sounds', false, false);
        el('cbtn').style.display = 'flex';
        if (/denied|notallowed/i.test(err.name || err.message || '')) {
          showErr('Microphone access was denied. Click the padlock icon in your browser address bar, set Microphone to Allow, then refresh this page and try again.');
        } else {
          showErr('Could not access your microphone. Please check your browser settings and try again.');
        }
      });
  };

  window.endCall = function() {
    if (vapi && callActive) {
      try { vapi.stop(); } catch(e) {}
    }
  };

  // Pre-load SDK in background so button responds faster
  loadSdk(function(err) {
    if (!err) {
      initVapi(function() {}); // warm up silently
    }
  });

})();
</script>
</body>
</html>`
}
