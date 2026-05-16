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

  // Escape for safe embedding inside JS double-quoted strings
  // Do NOT use backticks for VK/AID/FN inside the template — causes TS syntax error
  const bizJs  = biz.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const vkJs   = (vapiPublicKey   || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const aidJs  = (vapiAssistantId || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')

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
.spin{width:16px;height:16px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.subnote{font-size:11px;color:#a09890;margin-bottom:4px;min-height:16px;text-align:center}
.errbox{display:none;background:#fff0f0;border:1px solid #fcc;border-radius:10px;padding:12px;font-size:12px;color:#c0392b;margin-top:10px;line-height:1.65;text-align:left}
.livebox{display:none;background:#f0ebff;border-radius:14px;padding:14px;margin-top:14px;text-align:left}
.livelbl{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#7c4dcc;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.livedot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:blink 1s infinite}
.livesub{font-size:12px;font-weight:300;color:#6b6560;line-height:1.6}
.resultbox{display:none;margin-top:14px;text-align:left}
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
  <button class="btn btn-idle" id="btn" onclick="startDemo()">
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
var vapiInstance = null;

function startDemo() {
  document.getElementById('errbox').style.display = 'none';
  document.getElementById('errbox').textContent = '';
  var btn = document.getElementById('btn');
  btn.disabled = true;
  btn.className = 'btn btn-loading';
  document.getElementById('btnlbl').textContent = 'Connecting...';
  var icon = document.getElementById('btnicon');
  icon.className = 'spin';

  if (!window.vapiSDK) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    script.defer = true;
    script.async = true;
    script.onload = function() {
      console.log('[Vapi] SDK loaded. window.vapiSDK:', typeof window.vapiSDK);
      initVapi();
    };
    script.onerror = function() {
      showError('Failed to load voice SDK. Check your internet connection.');
    };
    document.head.appendChild(script);
  } else {
    initVapi();
  }
}

function initVapi() {
  // Double quotes used intentionally — backticks cause TS syntax error inside template literal
  var VK  = "${vkJs}";
  var AID = "${aidJs}";
  var FN  = "${bizJs}";

  console.log('[Vapi] Initialising. Key length:', VK.length, '| AID:', AID, '| firmName:', FN);
  console.log('[Vapi] window.vapiSDK type:', typeof window.vapiSDK);
  console.log('[Vapi] window.vapiSDK.run type:', typeof (window.vapiSDK && window.vapiSDK.run));

  if (!window.vapiSDK || typeof window.vapiSDK.run !== 'function') {
    showError('vapiSDK not available. Check browser console.');
    return;
  }

  try {
    vapiInstance = window.vapiSDK.run({
      apiKey: VK,
      assistant: AID,
      config: {
        position: 'bottom-right',
        offset: '500px',
        width: '50px',
        height: '50px',
        idle:    { color: 'transparent', type: 'pill', title: '', subtitle: '', icon: '' },
        loading: { color: 'transparent', type: 'pill', title: '', subtitle: '', icon: '' },
        active:  { color: 'transparent', type: 'pill', title: '', subtitle: '', icon: '' }
      }
    });

    console.log('[Vapi] Instance created:', typeof vapiInstance);
    console.log('[Vapi] Has start method:', typeof (vapiInstance && vapiInstance.start));

    vapiInstance.on('call-start', function() {
      console.log('[Vapi] EVENT: call-start');
      var btn = document.getElementById('btn');
      btn.disabled = false;
      btn.className = 'btn';
      btn.style.background = '#fc5c7c';
      btn.style.color = '#fff';
      document.getElementById('btnicon').className = '';
      document.getElementById('btnlbl').textContent = 'End call';
      btn.onclick = function() { stopDemo(); };
      document.getElementById('livebox').style.display = 'block';
      document.getElementById('subnote').textContent = '';
    });

    vapiInstance.on('call-end', function() {
      console.log('[Vapi] EVENT: call-end');
      resetButton();
      document.getElementById('resultbox').style.display = 'block';
    });

    vapiInstance.on('speech-start', function() {
      console.log('[Vapi] EVENT: speech-start');
    });

    vapiInstance.on('speech-end', function() {
      console.log('[Vapi] EVENT: speech-end');
    });

    vapiInstance.on('message', function(msg) {
      console.log('[Vapi] EVENT: message', JSON.stringify(msg));
    });

    vapiInstance.on('error', function(err) {
      console.error('[Vapi] EVENT: error — raw object:', err);
      console.error('[Vapi] error JSON:', JSON.stringify(err));
      showError('Call error — see browser console. ' + (err && (err.type || err.message || JSON.stringify(err))));
    });

    // Start call with firmName injected so {{firmName}} resolves in assistant greeting
    console.log('[Vapi] Calling start() with AID:', AID, '| firmName:', FN);
    var callPromise = vapiInstance.start(AID, {
      variableValues: {
        firmName: FN
      }
    });

    console.log('[Vapi] start() returned:', callPromise);

    if (callPromise && typeof callPromise.then === 'function') {
      callPromise.then(function(call) {
        console.log('[Vapi] start() resolved with call object:', call);
      }).catch(function(err) {
        console.error('[Vapi] start() rejected — raw:', err);
        showError('start() failed — ' + (err && (err.message || JSON.stringify(err))));
      });
    }

  } catch(ex) {
    console.error('[Vapi] Exception during init/start:', ex);
    showError('Exception: ' + ex.message);
  }
}

function stopDemo() {
  if (vapiInstance) {
    vapiInstance.stop();
  }
}

function showError(msg) {
  console.error('[Vapi] showError:', msg);
  var errbox = document.getElementById('errbox');
  errbox.textContent = msg;
  errbox.style.display = 'block';
  resetButton();
}

function resetButton() {
  var btn = document.getElementById('btn');
  btn.disabled = false;
  btn.className = 'btn btn-idle';
  btn.style.background = '';
  btn.style.color = '';
  document.getElementById('btnicon').className = '';
  document.getElementById('btnlbl').textContent = 'Hear it again';
  btn.onclick = function() { startDemo(); };
  document.getElementById('livebox').style.display = 'none';
  document.getElementById('subnote').textContent = 'No phone needed. Runs in your browser.';
}
</script>
</body>
</html>`
}
