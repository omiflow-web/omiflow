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
.cbtn{width:100%;padding:18px;background:#b797ff;color:#fff;border:none;border-radius:100px;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;margin-bottom:10px;font-family:inherit}
.cbtn:hover:not(:disabled){background:#a47ff5;transform:translateY(-1px)}
.cbtn:disabled{background:#d4beff;cursor:default}
.pd{width:9px;height:9px;border-radius:50%;background:#fff;animation:pulse 1.4s ease infinite}
@keyframes pulse{0%{transform:scale(1);opacity:1}70%{transform:scale(1.8);opacity:0}100%{transform:scale(1);opacity:0}}
.bn{font-size:11px;color:#a09890}
.err{display:none;background:#fff0f0;border:1px solid #fcc;border-radius:10px;padding:12px;font-size:12px;color:#c0392b;margin-top:12px;line-height:1.6;text-align:left}
.err.show{display:block}
.live{display:none;background:#f0ebff;border-radius:14px;padding:14px;margin-top:14px;text-align:left}
.live.show{display:block}
.ll{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#7c4dcc;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.ld{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:blink 1s infinite}
.ls{font-size:12px;font-weight:300;color:#6b6560;line-height:1.6}
.eb{width:100%;padding:12px;background:transparent;border:1px solid #d4beff;border-radius:100px;font-size:13px;font-weight:500;color:#b797ff;cursor:pointer;margin-top:10px;transition:all .2s;display:none;font-family:inherit}
.eb.show{display:block}.eb:hover{background:#f0ebff}
.res{display:none;margin-top:14px;text-align:left}.res.show{display:block}
.sms{background:#1a1916;border-radius:12px;padding:14px}
.sm-t{font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#c8f155;margin-bottom:5px}
.sm-b{font-size:12px;font-weight:300;color:rgba(255,255,255,.75);line-height:1.7}
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
  <p class="sub">Every unanswered call is a potential client who called the next business. Here is what happens instead.</p>
  <div class="steps">
    <div class="step"><div class="num">1</div><div class="st">On ring three of that same call, the AI picks up and greets your client by your business name</div></div>
    <div class="step"><div class="num">2</div><div class="st">A real conversation collects their name, reason for calling, and best callback time</div></div>
    <div class="step"><div class="num">3</div><div class="st">You get a text summary instantly so you can call them back informed and ready</div></div>
  </div>
  <button class="cbtn" id="cbtn" onclick="hc()"><div class="pd" id="pd"></div><span id="bt">Hear how it sounds</span></button>
  <div class="bn" id="bn">No phone needed. Runs in your browser.</div>
  <div class="err" id="err"></div>
  <div class="live" id="lv"><div class="ll"><div class="ld"></div>Live — AI is answering</div><div class="ls">Speak as if you are a client calling ${biz}.</div></div>
  <button class="eb" id="eb" onclick="ec()">End call</button>
  <div class="res" id="rs"><div class="sms"><div class="sm-t">Text sent to you instantly</div><div class="sm-b">New enquiry received. Caller details and best callback time saved.</div></div></div>
  <hr class="dv">
  <div class="cta">Interested in this for ${biz}?<br>Reply to this email or reach us at <a href="mailto:hello@omiflow.co.uk">hello@omiflow.co.uk</a></div>
</div>
<script src="https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/vapi.umd.js"></script>
<script>
var VK="${vapiPublicKey}",AID="${vapiAssistantId}",FN="${biz.replace(/"/g, '\\"')}",vapi=null,active=false;
function iv(){if(!vapi&&window.Vapi){vapi=new window.Vapi(VK);vapi.on("call-end",oe);vapi.on("error",oerr);}return vapi;}
function hc(){if(!VK||!AID){se("Vapi keys not configured.");return;}if(!active)sc();}
function sc(){
  var b=document.getElementById("cbtn"),t=document.getElementById("bt"),d=document.getElementById("pd"),n=document.getElementById("bn"),e=document.getElementById("err");
  e.classList.remove("show");b.disabled=true;t.textContent="Connecting...";if(d)d.style.animation="none";
  var v=iv();if(!v){se("Voice SDK failed. Refresh and try again.");rb();return;}
  var p2=v.start(AID,{variableValues:{firmName:FN}});
  if(!p2||typeof p2.then!=="function"){active=true;b.style.display="none";if(n)n.style.display="none";document.getElementById("lv").classList.add("show");document.getElementById("eb").classList.add("show");return;}
  p2.then(function(){active=true;b.style.display="none";if(n)n.style.display="none";document.getElementById("lv").classList.add("show");document.getElementById("eb").classList.add("show");document.getElementById("rs").classList.remove("show");})
  .catch(function(err){rb();var m=(err&&(err.message||err.toString()))||"Could not start.";if(/permission|microphone|notallowed/i.test(m))m="Microphone blocked — click padlock in Chrome address bar, allow Microphone, try again.";se(m);});
}
function ec(){if(vapi){try{vapi.stop();}catch(_){}}}
function oe(){active=false;rb();document.getElementById("lv").classList.remove("show");document.getElementById("eb").classList.remove("show");document.getElementById("rs").classList.add("show");}
function oerr(e){console.error("[Vapi]",e);se("Call error. Please try again.");oe();}
function rb(){var b=document.getElementById("cbtn"),t=document.getElementById("bt"),d=document.getElementById("pd"),n=document.getElementById("bn");b.style.display="flex";b.disabled=false;t.textContent="Hear it again";if(d)d.style.animation="pulse 1.4s ease infinite";if(n){n.style.display="block";n.textContent="Want to hear it again?";}}
function se(m){var e=document.getElementById("err");e.textContent=m;e.classList.add("show");}
</script>
</body>
</html>`
}
