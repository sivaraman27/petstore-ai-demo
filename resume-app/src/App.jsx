import { useState, useRef, useCallback } from "react";

/* ═══════════════════ UI STYLES (editor shell only) ═══════════════════ */
const UI = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{background:#eef1f6;font-family:'Plus Jakarta Sans',sans-serif;color:#1e293b}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
.inp{width:100%;background:#fff;border:1.5px solid #e2e8f0;border-radius:7px;color:#1e293b;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;padding:7px 10px;outline:none;resize:none;transition:border .15s,box-shadow .15s}
.inp:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.inp::placeholder{color:#cbd5e1}
select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23cbd5e1'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;padding-right:22px;cursor:pointer}
.bP{background:#1e293b;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;padding:7px 15px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:5px;transition:all .15s;white-space:nowrap}
.bP:hover{background:#334155}.bP:active{transform:scale(.97)}
.bS{background:#fff;color:#64748b;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500;padding:6px 12px;border:1.5px solid #e2e8f0;border-radius:7px;cursor:pointer;display:flex;align-items:center;gap:5px;transition:all .15s;white-space:nowrap}
.bS:hover{border-color:#6366f1;color:#6366f1;background:#eef2ff}
.bI{background:transparent;border:none;cursor:pointer;padding:3px 6px;color:#cbd5e1;border-radius:5px;transition:all .15s;font-size:13px;display:flex;align-items:center}
.bI:hover{color:#ef4444;background:#fef2f2}
.card{background:#fff;border:1.5px solid #f1f5f9;border-radius:11px;overflow:hidden;margin-bottom:6px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.card-hd{display:flex;align-items:center;justify-content:space-between;padding:10px 13px;cursor:pointer;user-select:none}
.card-hd:hover{background:#f8fafc}
.card-bd{padding:0 13px 13px}
.ic{background:#f8fafc;border:1.5px solid #f1f5f9;border-radius:8px;padding:10px;margin-bottom:7px}
.lbl{display:block;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.07em;text-transform:uppercase;margin-bottom:3px}
.fld{margin-bottom:8px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.tab{padding:6px 13px;background:transparent;border:1.5px solid #e2e8f0;border-radius:7px;color:#64748b;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px}
.tab.on{background:#1e293b;border-color:#1e293b;color:#fff;font-weight:700}
.tab:hover:not(.on){border-color:#6366f1;color:#6366f1}
.ovl{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
@keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.fu{animation:fadeUp .18s ease}
.spinner{width:40px;height:40px;border:3px solid #e2e8f0;border-top-color:#6366f1;border-radius:50%;animation:spin .85s linear infinite;margin:0 auto}
`;

/* ═══════════════════ RESUME TEMPLATE CSS ═══════════════════ */
const RCSS = `
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

/* ─── 1. CHRONO ── reverse chronological, classic ─── */
.rCH{font-family:'Merriweather',serif;color:#111;background:#fff;padding:36px 44px 40px;width:100%}
.rCH .nm{font-size:28px;font-weight:700;color:#000;letter-spacing:-.3px;line-height:1}
.rCH .hl{font-size:13px;color:#555;margin-top:4px;font-style:italic}
.rCH .ct{display:flex;flex-wrap:wrap;gap:3px 20px;margin-top:8px}
.rCH .ct span{font-size:11.5px;color:#555}
.rCH .sh{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#1a202c;border-bottom:2px solid #1a202c;padding-bottom:4px;margin:18px 0 10px}
.rCH .sh:first-of-type{margin-top:0}
.rCH .eh{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.rCH .rl{font-size:14px;font-weight:700;color:#000}
.rCH .co{font-size:13px;color:#4a5568;font-style:italic;margin-top:1px}
.rCH .dt{font-size:11.5px;color:#718096;white-space:nowrap;padding-top:2px;flex-shrink:0}
.rCH .bu{font-size:12.5px;color:#4a5568;line-height:1.65;padding-left:14px;position:relative;margin-top:3px}
.rCH .bu::before{content:'•';position:absolute;left:2px;color:#a0aec0}
.rCH .su{font-size:13px;color:#4a5568;line-height:1.7}
.rCH .sk{display:flex;flex-wrap:wrap;gap:5px}
.rCH .sk span{background:#f7fafc;border:1px solid #e2e8f0;color:#2d3748;font-size:11.5px;padding:3px 10px;border-radius:3px;font-weight:500}
.rCH .eb{margin-bottom:14px}
.rCH .gp{font-size:11px;color:#718096;margin-top:2px}

/* ─── 2. MODPRO ── modern professional, accent line ─── */
.rMP{font-family:'DM Sans',sans-serif;color:#1e293b;background:#fff;width:100%}
.rMP .hdr{background:#0f172a;padding:28px 32px;position:relative;overflow:hidden}
.rMP .hdr::after{content:'';position:absolute;right:0;top:0;width:6px;height:100%;background:linear-gradient(180deg,#6366f1,#8b5cf6)}
.rMP .nm{font-size:26px;font-weight:700;color:#fff;letter-spacing:-.4px;line-height:1}
.rMP .hl{font-size:12.5px;color:#94a3b8;margin-top:5px}
.rMP .ct{display:flex;flex-wrap:wrap;gap:4px 20px;margin-top:10px}
.rMP .ct span{font-size:11px;color:#64748b}
.rMP .bd{padding:22px 32px 32px}
.rMP .sh{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.15em;color:#6366f1;padding-left:10px;border-left:3px solid #6366f1;margin:18px 0 10px;line-height:1.2}
.rMP .sh:first-of-type{margin-top:0}
.rMP .eh{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.rMP .rl{font-size:13.5px;font-weight:700;color:#0f172a}
.rMP .co{font-size:12px;color:#475569;margin-top:1px}
.rMP .dt{font-size:10px;background:#eef2ff;color:#6366f1;padding:2px 9px;border-radius:10px;white-space:nowrap;flex-shrink:0;font-weight:600}
.rMP .bu{font-size:12.5px;color:#475569;line-height:1.6;padding-left:13px;position:relative;margin-top:3px}
.rMP .bu::before{content:'▸';position:absolute;left:0;color:#6366f1;font-size:9px;top:3px}
.rMP .su{font-size:12.5px;color:#475569;line-height:1.7}
.rMP .sk span{display:inline-block;background:#f8fafc;border:1px solid #e2e8f0;color:#334155;font-size:11px;padding:3px 9px;border-radius:4px;margin:2px;font-weight:500}
.rMP .eb{margin-bottom:14px}
.rMP .gp{font-size:11px;color:#94a3b8;margin-top:2px}

/* ─── 3. ATS ── minimal ATS-safe ─── */
.rAT{font-family:Arial,Helvetica,sans-serif;color:#000;background:#fff;padding:36px 44px;width:100%;font-size:11pt}
.rAT .nm{font-size:17pt;font-weight:bold}
.rAT .hl{font-size:11pt;color:#333;margin-top:2px}
.rAT .ct{display:flex;flex-wrap:wrap;gap:3px 18px;margin-top:6px}
.rAT .ct span{font-size:10pt;color:#333}
.rAT .dv{border:none;border-top:1px solid #000;margin:10px 0 8px}
.rAT .sh{font-size:10.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
.rAT .eh{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.rAT .rl{font-size:11pt;font-weight:bold}
.rAT .co{font-size:11pt;color:#222}
.rAT .dt{font-size:10pt;color:#444;white-space:nowrap;flex-shrink:0}
.rAT .bu{font-size:10.5pt;color:#111;padding-left:14px;position:relative;margin-top:3px;line-height:1.5}
.rAT .bu::before{content:'-';position:absolute;left:2px}
.rAT .su{font-size:10.5pt;line-height:1.6}
.rAT .sk{font-size:10.5pt;margin-bottom:4px}
.rAT .skn{font-weight:bold}
.rAT .eb{margin-bottom:10px}
.rAT .gp{font-size:10pt;color:#444;margin-top:2px}

/* ─── 4. HYBRID ── skills-first hybrid ─── */
.rHY{font-family:'Nunito',sans-serif;color:#1e293b;background:#fff;width:100%}
.rHY .hdr{background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:26px 30px}
.rHY .nm{font-size:26px;font-weight:800;color:#fff;letter-spacing:-.3px}
.rHY .hl{font-size:12.5px;color:#94a3b8;margin-top:4px}
.rHY .ct{display:flex;flex-wrap:wrap;gap:3px 18px;margin-top:8px}
.rHY .ct span{font-size:11px;color:#64748b}
.rHY .bd{padding:20px 30px 32px}
.rHY .sh{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:#fff;background:#1e293b;display:inline-block;padding:3px 10px;border-radius:3px;margin:16px 0 10px}
.rHY .sh:first-of-type{margin-top:0}
.rHY .skbox{background:#f8fafc;border:1px solid #e8edf4;border-radius:8px;padding:12px 14px;margin-bottom:6px}
.rHY .skcat{font-size:10.5px;font-weight:700;color:#1e293b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em}
.rHY .sktags{display:flex;flex-wrap:wrap;gap:4px}
.rHY .sktag{background:#eef2ff;color:#4338ca;font-size:11px;padding:3px 9px;border-radius:4px;font-weight:600}
.rHY .eh{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.rHY .rl{font-size:13.5px;font-weight:700;color:#0f172a}
.rHY .co{font-size:12px;color:#475569;margin-top:1px}
.rHY .dt{font-size:10.5px;color:#64748b;background:#f1f5f9;padding:2px 8px;border-radius:10px;white-space:nowrap;flex-shrink:0}
.rHY .bu{font-size:12.5px;color:#475569;line-height:1.6;padding-left:14px;position:relative;margin-top:3px}
.rHY .bu::before{content:'◆';position:absolute;left:0;color:#6366f1;font-size:7px;top:5px}
.rHY .su{font-size:12.5px;color:#475569;line-height:1.7}
.rHY .eb{margin-bottom:14px}
.rHY .gp{font-size:11px;color:#94a3b8;margin-top:2px}

/* ─── 5. TWOCOL ── two column sidebar ─── */
.rTC{font-family:'Lato',sans-serif;color:#1e293b;background:#fff;width:100%;display:flex;min-height:297mm}
.rTC .sb{width:34%;background:#1e3a5f;padding:28px 20px;flex-shrink:0}
.rTC .sb .nm{font-size:20px;font-weight:700;color:#fff;line-height:1.2;letter-spacing:-.2px;margin-bottom:3px}
.rTC .sb .hl{font-size:11px;color:#93c5fd;margin-bottom:18px;line-height:1.4}
.rTC .sb .ssh{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#60a5fa;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:5px;margin:18px 0 9px}
.rTC .sb .ssh:first-of-type{margin-top:0}
.rTC .sb .ci{display:flex;gap:7px;margin-bottom:7px;align-items:flex-start}
.rTC .sb .cic{font-size:11px;color:#60a5fa;width:14px;flex-shrink:0;margin-top:1px}
.rTC .sb .cit{font-size:10.5px;color:#cbd5e1;line-height:1.4;word-break:break-all}
.rTC .sb .skb{margin-bottom:7px}
.rTC .sb .skn{font-size:11px;color:#e2e8f0;margin-bottom:3px}
.rTC .sb .skt{height:4px;background:rgba(255,255,255,.12);border-radius:2px}
.rTC .sb .skf{height:4px;background:#60a5fa;border-radius:2px}
.rTC .sb .sktag{display:inline-block;background:rgba(255,255,255,.1);color:#bfdbfe;font-size:10px;padding:2px 8px;border-radius:3px;margin:2px}
.rTC .sb .lg{display:flex;justify-content:space-between;margin-bottom:6px}
.rTC .sb .lgn{font-size:11px;color:#e2e8f0}.rTC .sb .lgl{font-size:10px;color:#93c5fd}
.rTC .mn{flex:1;padding:28px 24px}
.rTC .mn .sh{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.13em;color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:4px;margin:18px 0 10px}
.rTC .mn .sh:first-of-type{margin-top:0}
.rTC .mn .eh{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.rTC .mn .rl{font-size:13.5px;font-weight:700;color:#0f172a}
.rTC .mn .co{font-size:12px;color:#475569;margin-top:1px}
.rTC .mn .dt{font-size:10px;color:#fff;background:#1e3a5f;padding:2px 8px;border-radius:10px;white-space:nowrap;flex-shrink:0}
.rTC .mn .bu{font-size:12.5px;color:#475569;line-height:1.6;padding-left:13px;position:relative;margin-top:3px}
.rTC .mn .bu::before{content:'→';position:absolute;left:0;color:#60a5fa;font-size:10px;top:2px}
.rTC .mn .su{font-size:12.5px;color:#475569;line-height:1.7}
.rTC .mn .eb{margin-bottom:13px}
.rTC .mn .gp{font-size:11px;color:#94a3b8;margin-top:2px}

/* ─── 6. CREATIVE ── bold visual header ─── */
.rCR{font-family:'Raleway',sans-serif;color:#1e293b;background:#fff;width:100%}
.rCR .hdr{background:linear-gradient(135deg,#7c3aed,#2563eb);padding:32px 36px;position:relative;overflow:hidden}
.rCR .hdr::before{content:'';position:absolute;right:-40px;top:-40px;width:180px;height:180px;background:rgba(255,255,255,.06);border-radius:50%}
.rCR .hdr::after{content:'';position:absolute;right:20px;bottom:-30px;width:100px;height:100px;background:rgba(255,255,255,.04);border-radius:50%}
.rCR .nm{font-size:30px;font-weight:800;color:#fff;letter-spacing:-.5px;line-height:1;position:relative}
.rCR .hl{font-size:13px;color:rgba(255,255,255,.75);margin-top:5px;font-weight:500;position:relative}
.rCR .ct{display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:12px;position:relative}
.rCR .ct span{font-size:11px;color:rgba(255,255,255,.7);display:flex;align-items:center;gap:4px}
.rCR .bd{padding:22px 36px 36px}
.rCR .sh{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#7c3aed;display:flex;align-items:center;gap:8px;margin:18px 0 10px}
.rCR .sh::after{content:'';flex:1;height:2px;background:linear-gradient(90deg,#7c3aed22,transparent)}
.rCR .sh:first-of-type{margin-top:0}
.rCR .eh{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.rCR .rl{font-size:14px;font-weight:700;color:#0f172a}
.rCR .co{font-size:12px;color:#64748b;margin-top:1px}
.rCR .dt{font-size:10px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;padding:2px 10px;border-radius:10px;white-space:nowrap;flex-shrink:0;font-weight:600}
.rCR .bu{font-size:12.5px;color:#475569;line-height:1.6;padding-left:14px;position:relative;margin-top:3px}
.rCR .bu::before{content:'✦';position:absolute;left:0;color:#7c3aed;font-size:8px;top:4px}
.rCR .su{font-size:12.5px;color:#475569;line-height:1.7}
.rCR .sk span{display:inline-block;background:linear-gradient(135deg,#7c3aed11,#2563eb11);border:1px solid #c4b5fd;color:#5b21b6;font-size:11px;padding:4px 10px;border-radius:12px;margin:2px;font-weight:600}
.rCR .eb{margin-bottom:14px}
.rCR .gp{font-size:11px;color:#94a3b8;margin-top:2px}

/* ─── 7. FUNCTIONAL ── skills-based, brief work history ─── */
.rFN{font-family:'IBM Plex Sans',sans-serif;color:#111827;background:#fff;padding:34px 42px;width:100%}
.rFN .nm{font-size:27px;font-weight:600;color:#000;letter-spacing:-.4px;border-left:5px solid #059669;padding-left:14px;line-height:1.1}
.rFN .hl{font-size:13px;color:#374151;margin-top:4px;padding-left:19px}
.rFN .ct{display:flex;flex-wrap:wrap;gap:3px 18px;margin-top:8px;padding-left:19px}
.rFN .ct span{font-size:11.5px;color:#6b7280}
.rFN .sh{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#059669;margin:18px 0 10px;padding-bottom:4px;border-bottom:1.5px solid #d1fae5}
.rFN .sh:first-of-type{margin-top:0}
.rFN .skarea{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px}
.rFN .skbox{border:1px solid #ecfdf5;border-radius:7px;padding:10px 12px;background:#f0fdf4}
.rFN .skcat{font-size:11px;font-weight:700;color:#065f46;margin-bottom:5px}
.rFN .skbu{font-size:12px;color:#374151;line-height:1.55;padding-left:11px;position:relative;margin-top:2px}
.rFN .skbu::before{content:'✓';position:absolute;left:0;color:#059669;font-size:10px}
.rFN .fneh{display:grid;grid-template-columns:1fr auto;gap:4px 12px;margin-bottom:6px}
.rFN .fnrl{font-size:13px;font-weight:600;color:#111827}
.rFN .fnco{font-size:12px;color:#6b7280}
.rFN .fndt{font-size:11px;color:#9ca3af;text-align:right}
.rFN .su{font-size:12.5px;color:#374151;line-height:1.7}
.rFN .eb{margin-bottom:10px}
.rFN .gp{font-size:11px;color:#6b7280;margin-top:2px}

@media print{body{background:#fff;overflow:auto;height:auto}}
`;

const PRINT_CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html,body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:A4;margin:0}${RCSS}`;

/* ═══════════════════ HELPERS ═══════════════════ */
const uid = () => Math.random().toString(36).slice(2, 8);
const dateStr = e => [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ');

const BLANK = { personal:{name:'',title:'',email:'',phone:'',location:'',linkedin:'',website:''}, summary:'', experience:[], education:[], skills:[], certifications:[], languages:[] };

const DEMO = {
  personal:{name:'Alexandra Chen',title:'Senior Product Manager',email:'alex.chen@email.com',phone:'+1 (415) 555-0192',location:'San Francisco, CA',linkedin:'linkedin.com/in/alexchen',website:'alexchen.io'},
  summary:'Results-driven Product Manager with 8+ years launching B2B SaaS products from 0 to $50M ARR. Reduced customer churn by 35% through targeted feature development. Cross-functional leader known for shipping high-impact products on time and within scope.',
  experience:[
    {id:'e1',company:'Stripe',role:'Senior Product Manager',location:'San Francisco, CA',startDate:'Mar 2020',endDate:'',current:true,bullets:['Owned Stripe Dashboard for 3M+ merchants, increasing task completion by 28%','Launched Stripe Tax across 35 countries, generating $12M ARR in year one','Led 12 engineers, 3 designers, and 2 data scientists across 4 time zones']},
    {id:'e2',company:'Asana',role:'Product Manager',location:'San Francisco, CA',startDate:'Jun 2017',endDate:'Feb 2020',current:false,bullets:['Rebuilt onboarding flow, improving 30-day activation from 41% to 67%','Shipped Timeline (Gantt) view — highest-rated feature in company history']},
  ],
  education:[{id:'ed1',school:'UC Berkeley',degree:'B.S. Computer Science',field:'',startDate:'2011',endDate:'2015',gpa:'3.8'}],
  skills:[
    {id:'s1',category:'Strategy',items:'Product Strategy, Roadmap Planning, OKRs, Jobs-to-be-Done, Agile'},
    {id:'s2',category:'Analytics',items:'A/B Testing, SQL, Mixpanel, Amplitude, Looker, Data Analysis'},
    {id:'s3',category:'Tools',items:'Figma, Jira, Notion, Salesforce, HubSpot'},
  ],
  certifications:[{id:'c1',name:'Certified Scrum Product Owner',issuer:'Scrum Alliance',date:'Apr 2022'}],
  languages:[{id:'l1',language:'English',proficiency:'Native'},{id:'l2',language:'Mandarin',proficiency:'Professional'}],
};

const DEFAULT_SECTIONS = [
  {id:'summary',     label:'Summary',         icon:'✍️', visible:true},
  {id:'experience',  label:'Work Experience',  icon:'💼', visible:true},
  {id:'education',   label:'Education',        icon:'🎓', visible:true},
  {id:'skills',      label:'Skills',           icon:'⚡', visible:true},
  {id:'certifications',label:'Certifications', icon:'🏅', visible:true},
  {id:'languages',   label:'Languages',        icon:'🌐', visible:true},
];

/* ═══════════════════ FIXED PARSER ═══════════════════ */
function loadScript(src, id) {
  return new Promise((res, rej) => {
    if (document.getElementById(id)) { setTimeout(res, 100); return; }
    const s = document.createElement('script');
    s.id = id; s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'txt') return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsText(file)});
  if (ext === 'docx') {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js','mammoth-js');
    const buf = await file.arrayBuffer();
    return (await window.mammoth.extractRawText({arrayBuffer:buf})).value;
  }
  if (ext === 'pdf') {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','pdfjs');
    await new Promise(r=>setTimeout(r,400));
    const lib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    if (!lib) throw new Error('PDF.js failed to load');
    lib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await lib.getDocument({data: await file.arrayBuffer()}).promise;
    let text = '';
    for (let i=1;i<=pdf.numPages;i++) {
      const pg = await pdf.getPage(i);
      const ct = await pg.getTextContent();
      let lastY=null, line='';
      for (const item of ct.items) {
        if (lastY!==null && Math.abs(item.transform[5]-lastY)>4){text+=line.trim()+'\n';line='';}
        line+=item.str+' '; lastY=item.transform[5];
      }
      text+=line.trim()+'\n';
    }
    return text;
  }
  throw new Error('Please upload PDF, DOCX, or TXT');
}

// Normalize PDF extraction artifacts like "P R O F E S S I O N A L"
function normalizePDF(text) {
  // Fix spaced-out capital letters: "W O R K" → "WORK"
  let t = text.replace(/\b([A-Z])\s(?=[A-Z]\s)/g, '$1').replace(/\b([A-Z])\s(?=[A-Z]\b)/g, '$1');
  // Normalize multiple spaces
  t = t.replace(/[ \t]{2,}/g, ' ');
  return t;
}

function parseResumeText(rawText) {
  const text = normalizePDF(rawText);

  // Extract contact info from full text
  const emailM   = text.match(/[\w.+\-]+@[\w\-]+\.[\w.]+/);
  const phoneM   = text.match(/(\+?1?[\s.\-]?\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4})/);
  const linkedM  = text.match(/linkedin\.com\/in\/[\w\-]+/i);
  const webArr   = (text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,})(?:\/[\w.\-]*)*/g)||[]);
  const website  = webArr.find(u=>!u.match(/linkedin|gmail|yahoo|hotmail|outlook|apple|google|microsoft/i) && !u.includes('@')) || '';

  // Detect name (first 2-4 word line with capitals, no numbers)
  const lines = text.split('\n').map(l=>l.trim()).filter(Boolean);
  let name='', title='';
  for (let i=0;i<Math.min(8,lines.length);i++){
    const l=lines[i];
    if (!name && /^[A-Z][a-zA-Z\s\-\.]{2,40}$/.test(l) && l.split(' ').length>=2 && l.split(' ').length<=5 && !/\d/.test(l) && !l.match(/summary|experience|education|skills|objective|profile/i)){name=l;continue;}
    if (name && !title && !l.includes('@') && !/\d{3}/.test(l) && l.length<100 && !l.match(/^(summary|experience|education|skills|objective|work|profile)/i)){title=l;break;}
  }
  if (!name) name=lines[0]||'';

  // === Position-based section detection (KEY FIX) ===
  // Find where each section header starts in the TEXT (not line-by-line)
  // This is much more reliable than line matching
  const SECTION_REGEXES = [
    {key:'summary',     re:/\b(professional\s+summary|career\s+summary|executive\s+summary|summary|profile|career\s+objective|objective|about\s+me)\b/i},
    {key:'experience',  re:/\b(work\s+experience|professional\s+experience|employment\s+history|work\s+history|career\s+history|experience)\b/i},
    {key:'education',   re:/\b(education|academic\s+background|academic\s+qualification|qualification)\b/i},
    {key:'skills',      re:/\b(technical\s+skills|core\s+skills|key\s+skills|skills|expertise|competenc|technologies)\b/i},
    {key:'certifications',re:/\b(certifications|certificates|licenses|credentials|professional\s+development)\b/i},
    {key:'languages',   re:/\b(languages|language\s+proficiency|language\s+skills)\b/i},
  ];

  // Find all section header positions
  const found = [];
  const usedRanges = [];
  for (const {key, re} of SECTION_REGEXES) {
    const m = text.match(re);
    if (m) {
      const idx = m.index;
      // Check not already covered
      const overlaps = usedRanges.some(([s,e])=>idx>=s && idx<=e);
      if (!overlaps) {
        found.push({key, index:idx, len:m[0].length});
        usedRanges.push([idx, idx+m[0].length]);
      }
    }
  }
  found.sort((a,b)=>a.index-b.index);

  // Extract content between section boundaries
  const sectionTexts = {};
  for (let i=0;i<found.length;i++){
    const start = found[i].index + found[i].len;
    const end   = found[i+1] ? found[i+1].index : text.length;
    const content = text.slice(start, end).trim();
    sectionTexts[found[i].key] = content;
  }

  // === Parse Summary ===
  let summary = '';
  if (sectionTexts.summary) {
    // Take only the first paragraph / sentences before a date or new header
    const raw = sectionTexts.summary;
    // Stop at first date pattern (indicates experience started bleeding in)
    const dateStop = raw.search(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]*\d{2,4}/i);
    summary = (dateStop > 30 ? raw.slice(0, dateStop) : dateStop <= 0 ? raw : raw)
      .split('\n').filter(l=>l.trim() && l.length > 5).slice(0,8).join(' ').trim();
    // Cap at 300 chars if it looks huge
    if (summary.length > 600) summary = summary.slice(0, 600).replace(/\s\S+$/, '') + '…';
  }

  // === Parse Experience ===
  const experience = [];
  if (sectionTexts.experience) {
    const expLines = sectionTexts.experience.split('\n').map(l=>l.trim()).filter(Boolean);
    const dateRe = /((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,\.]*\d{2,4}|\d{4})\s*[-–—to]+\s*((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,\.]*\d{2,4}|\d{4}|present|current|now)/i;
    let cur = null;
    for (const line of expLines) {
      const dm = line.match(dateRe);
      if (dm) {
        if (cur) experience.push(cur);
        const isCur = /present|current|now/i.test(dm[3]);
        const rest = line.replace(dm[0],'').replace(/[|·•]/g,',').trim();
        const parts = rest.split(',').map(s=>s.trim()).filter(Boolean);
        cur = {id:`e${experience.length+1}`,role:parts[0]||'',company:parts[1]||'',location:parts[2]||'',startDate:dm[1].trim(),endDate:isCur?'':dm[3].trim(),current:isCur,bullets:[]};
      } else if (cur) {
        if (/^[-•▸▪·*◦✓]/.test(line)||/^\d+[.)]\s/.test(line)) {
          const c=line.replace(/^[-•▸▪·*◦✓\d\.)\s]+/,'').trim();
          if (c.length>5) cur.bullets.push(c);
        } else if (line.length>4 && !cur.company) cur.company=line;
        else if (line.length>4 && !cur.role) cur.role=line;
      }
    }
    if (cur) experience.push(cur);
  }

  // === Parse Education ===
  const education = [];
  if (sectionTexts.education) {
    const eduLines = sectionTexts.education.split('\n').map(l=>l.trim()).filter(Boolean);
    const degRe = /\b(bachelor|master|doctor|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?b\.?a\.?|ph\.?d\.?|associate|diploma|b\.?eng|m\.?eng)\b/i;
    let cur = null;
    for (const line of eduLines) {
      const yrs = [...line.matchAll(/\b(19|20)\d{2}\b/g)].map(m=>m[0]);
      if (degRe.test(line)||yrs.length>=1) {
        if (cur) education.push(cur);
        cur={id:`ed${education.length+1}`,school:'',degree:line.replace(/\b(19|20)\d{2}\b.*/,'').trim(),field:'',startDate:yrs[0]||'',endDate:yrs[1]||'',gpa:''};
      } else if (cur) {
        const gm=line.match(/gpa\s*:?\s*([\d.]+)/i);
        if (gm) cur.gpa=gm[1];
        else if (!cur.school) cur.school=line;
      }
    }
    if (cur) education.push(cur);
    if (!education.length && eduLines.length) education.push({id:'ed1',school:eduLines[0]||'',degree:eduLines[1]||'',field:'',startDate:'',endDate:'',gpa:''});
  }

  // === Parse Skills ===
  const skills = [];
  if (sectionTexts.skills) {
    const skLines = sectionTexts.skills.split('\n').map(l=>l.trim()).filter(Boolean);
    let catchall = null;
    for (const line of skLines) {
      const cs = line.match(/^([^:]{2,35})\s*:\s*(.+)/);
      if (cs) { skills.push({id:`s${skills.length+1}`,category:cs[1].trim(),items:cs[2].trim()}); }
      else if (line.includes(',')) {
        if (!catchall){catchall={id:`s${skills.length+1}`,category:'',items:''};skills.push(catchall);}
        catchall.items+=(catchall.items?', ':'')+line.replace(/^[-•]\s*/,'');
      } else if (/^[-•]/.test(line)) {
        if (!catchall){catchall={id:`s${skills.length+1}`,category:'',items:''};skills.push(catchall);}
        catchall.items+=(catchall.items?', ':'')+line.replace(/^[-•]\s*/,'');
      }
    }
    if (!skills.length && skLines.length) skills.push({id:'s1',category:'Skills',items:skLines.join(', ')});
  }

  // === Parse Certifications ===
  const certifications = (sectionTexts.certifications||'').split('\n').map(l=>l.trim()).filter(l=>l.length>4).map((l,i)=>{
    const dm=l.match(/\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+)?\d{4}\b/i);
    return {id:`c${i+1}`,name:l.replace(dm?dm[0]:'','').replace(/^[-•]\s*/,'').trim(),issuer:'',date:dm?dm[0].trim():''};
  });

  // === Parse Languages ===
  const LVLRE = /\b(native|fluent|professional|advanced|intermediate|basic|beginner|bilingual)\b/i;
  const languages = (sectionTexts.languages||'').split('\n').map(l=>l.trim()).filter(l=>l.length>1 && l.split(' ').length<=6).map((l,i)=>{
    const lm=l.match(LVLRE);
    return {id:`l${i+1}`,language:l.replace(LVLRE,'').replace(/[:()\-–,]/g,'').trim(),proficiency:lm?lm[0]:''};
  });

  return {
    personal:{name:name.trim(),title:title.trim(),email:emailM?.[0]||'',phone:phoneM?.[1]?.trim()||'',location:'',linkedin:linkedM?.[0]||'',website:website.replace(/^https?:\/\/(www\.)?/,'')},
    summary, experience, education, skills, certifications, languages,
  };
}

/* ═══════════════════ ATS SCORE ═══════════════════ */
const VERBS=['led','built','launched','designed','developed','increased','reduced','improved','architected','delivered','managed','drove','created','implemented','optimized','scaled','generated','achieved','streamlined','spearheaded','directed','grew','engineered','automated','deployed','mentored','oversaw','transformed','accelerated'];

function calcATS(d) {
  const issues=[],wins=[];let s=0;
  const p=d.personal;
  if(p.name?.trim()){s+=5;wins.push('Full name present')}else issues.push({l:'high',m:'Add full name'});
  if(p.email?.trim()){s+=5;wins.push('Email present')}else issues.push({l:'high',m:'Email required'});
  if(p.phone?.trim()){s+=5;wins.push('Phone present')}else issues.push({l:'high',m:'Add phone number'});
  if(p.location?.trim()){s+=5;wins.push('Location included')}else issues.push({l:'medium',m:'Add city/state'});
  const wc=d.summary?.trim().split(/\s+/).filter(Boolean).length||0;
  if(wc>=40){s+=15;wins.push(`Summary: ${wc} words`)}else if(wc>=15){s+=7;issues.push({l:'medium',m:`Summary ${wc} words (aim 40–80)`})}else issues.push({l:'high',m:'Add professional summary'});
  if(!d.experience.length){issues.push({l:'high',m:'No work experience'})}else{
    s+=Math.min(d.experience.length*3,9);
    const ab=d.experience.flatMap(e=>e.bullets.filter(b=>b.trim().length>8));
    const met=ab.filter(b=>/\d+\s*[%$kmb]?|\$\d+/i.test(b));
    const vb=ab.filter(b=>VERBS.some(v=>b.trim().toLowerCase().startsWith(v)));
    if(ab.length>=4){s+=6;wins.push(`${ab.length} bullets`)}else issues.push({l:'medium',m:'Add 2–4 bullets per role'});
    if(met.length>=2){s+=7;wins.push(`${met.length} quantified bullets`)}else issues.push({l:'high',m:'Add metrics: %, $, users, time'});
    if(vb.length>=3){s+=3;wins.push('Strong action verbs')}else issues.push({l:'medium',m:'Start bullets with action verbs'});
  }
  if(d.education.length&&d.education[0].school?.trim()){s+=10;wins.push('Education complete')}else issues.push({l:'medium',m:'Add education'});
  const sk=d.skills.flatMap(sg=>sg.items.split(',').map(x=>x.trim()).filter(Boolean));
  if(sk.length>=10){s+=15;wins.push(`${sk.length} skills listed`)}else if(sk.length>=4){s+=7;issues.push({l:'medium',m:`${sk.length} skills (aim 10+)`})}else issues.push({l:'high',m:'Add skills section'});
  s+=15;wins.push('ATS-safe layout');wins.push('Standard headings');
  const total=Math.min(s,100);
  const band=total>=85?{l:'Excellent',c:'#16a34a'}:total>=70?{l:'Good',c:'#65a30d'}:total>=50?{l:'Fair',c:'#d97706'}:{l:'Poor',c:'#dc2626'};
  const dims=[
    {n:'Contact',max:20,v:(p.name?5:0)+(p.email?5:0)+(p.phone?5:0)+(p.location?5:0),c:'#3b82f6'},
    {n:'Summary',max:15,v:Math.min(wc/80*15,15),c:'#8b5cf6'},
    {n:'Experience',max:25,v:Math.min(d.experience.length*3,9)+(d.experience.flatMap(e=>e.bullets.filter(b=>b.trim().length>8)).length>=4?6:0)+(d.experience.flatMap(e=>e.bullets).filter(b=>/\d+/.test(b)).length>=2?7:0),c:'#0ea5e9'},
    {n:'Education',max:10,v:d.education.length&&d.education[0].school?10:0,c:'#10b981'},
    {n:'Skills',max:15,v:Math.min(sk.length/10*15,15),c:'#f59e0b'},
    {n:'Formatting',max:15,v:15,c:'#6366f1'},
  ];
  return {score:total,band,issues,wins,dims};
}

/* ═══════════════════ RESUME SECTION RENDERER ═══════════════════ */
// Each template gets a render helper
function makeSections(d, secConf) {
  const vis = secConf.filter(s=>s.visible).map(s=>s.id);
  const allSk = d.skills.flatMap(sg=>sg.items.split(',').map(s=>s.trim()).filter(Boolean));

  const summary  = vis.includes('summary') && d.summary;
  const hasExp   = vis.includes('experience') && d.experience.length>0;
  const hasEdu   = vis.includes('education') && d.education.length>0;
  const hasSk    = vis.includes('skills') && d.skills.length>0;
  const hasCert  = vis.includes('certifications') && d.certifications.length>0;
  const hasLang  = vis.includes('languages') && d.languages.length>0;
  return {vis,summary,hasExp,hasEdu,hasSk,hasCert,hasLang,allSk};
}

/* ─── Template components ─── */
const Bullets = ({items,cls}) => items.filter(b=>b.trim()).map((b,i)=><div key={i} className={cls}>{b}</div>);

function TChrono({d,sc}) {
  const {summary,hasExp,hasEdu,hasSk,hasCert,hasLang,allSk,vis}=makeSections(d,sc);
  const p=d.personal;
  return <div className="rCH">
    <div className="nm">{p.name||'Your Name'}</div>
    {p.title&&<div className="hl">{p.title}</div>}
    <div className="ct">{p.email&&<span>✉ {p.email}</span>}{p.phone&&<span>☎ {p.phone}</span>}{p.location&&<span>⌖ {p.location}</span>}{p.linkedin&&<span>in {p.linkedin}</span>}{p.website&&<span>⊕ {p.website}</span>}</div>
    {summary&&<><div className="sh">Professional Summary</div><p className="su">{d.summary}</p></>}
    {hasExp&&<><div className="sh">Work Experience</div>{d.experience.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{e.role||'Title'}</div><div className="co">{[e.company,e.location].filter(Boolean).join(' · ')}</div></div><div className="dt">{dateStr(e)}</div></div><Bullets items={e.bullets} cls="bu"/></div>)}</>}
    {hasSk&&<><div className="sh">Skills</div><div className="sk">{allSk.map((s,i)=><span key={i}>{s}</span>)}</div></>}
    {hasEdu&&<><div className="sh">Education</div>{d.education.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{[e.degree,e.field].filter(Boolean).join(', ')||'Degree'}</div><div className="co">{e.school}</div></div><div className="dt">{[e.startDate,e.endDate].filter(Boolean).join(' – ')}</div></div>{e.gpa&&<div className="gp">GPA: {e.gpa}</div>}</div>)}</>}
    {hasCert&&<><div className="sh">Certifications</div>{d.certifications.map(c=><div key={c.id} className="eb"><div className="eh"><div><div className="rl">{c.name}</div>{c.issuer&&<div className="co">{c.issuer}</div>}</div>{c.date&&<div className="dt">{c.date}</div>}</div></div>)}</>}
    {hasLang&&<><div className="sh">Languages</div><div className="sk">{d.languages.map(l=><span key={l.id}>{l.language}{l.proficiency?` · ${l.proficiency}`:''}</span>)}</div></>}
  </div>;
}

function TModPro({d,sc}) {
  const {summary,hasExp,hasEdu,hasSk,hasCert,hasLang,allSk}=makeSections(d,sc);
  const p=d.personal;
  return <div className="rMP">
    <div className="hdr">
      <div className="nm">{p.name||'Your Name'}</div>
      {p.title&&<div className="hl">{p.title}</div>}
      <div className="ct">{p.email&&<span>✉ {p.email}</span>}{p.phone&&<span>☎ {p.phone}</span>}{p.location&&<span>⌖ {p.location}</span>}{p.linkedin&&<span>in {p.linkedin}</span>}</div>
    </div>
    <div className="bd">
      {summary&&<><div className="sh">Summary</div><p className="su">{d.summary}</p></>}
      {hasExp&&<><div className="sh">Work Experience</div>{d.experience.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{e.role||'Title'}</div><div className="co">{[e.company,e.location].filter(Boolean).join(' · ')}</div></div><div className="dt">{dateStr(e)}</div></div><Bullets items={e.bullets} cls="bu"/></div>)}</>}
      {hasSk&&<><div className="sh">Skills</div><div className="sk">{allSk.map((s,i)=><span key={i}>{s}</span>)}</div></>}
      {hasEdu&&<><div className="sh">Education</div>{d.education.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{[e.degree,e.field].filter(Boolean).join(', ')||'Degree'}</div><div className="co">{e.school}</div></div><div className="dt">{[e.startDate,e.endDate].filter(Boolean).join(' – ')}</div></div>{e.gpa&&<div className="gp">GPA: {e.gpa}</div>}</div>)}</>}
      {hasCert&&<><div className="sh">Certifications</div>{d.certifications.map(c=><div key={c.id} className="eb"><div className="eh"><div><div className="rl">{c.name}</div>{c.issuer&&<div className="co">{c.issuer}</div>}</div>{c.date&&<div className="dt">{c.date}</div>}</div></div>)}</>}
      {hasLang&&<><div className="sh">Languages</div><div className="sk">{d.languages.map(l=><span key={l.id}>{l.language}{l.proficiency?` · ${l.proficiency}`:''}</span>)}</div></>}
    </div>
  </div>;
}

function TAts({d,sc}) {
  const {summary,hasExp,hasEdu,hasSk,hasCert,hasLang}=makeSections(d,sc);
  const p=d.personal;
  return <div className="rAT">
    <div className="nm">{p.name||'Your Name'}</div>
    {p.title&&<div className="hl">{p.title}</div>}
    <div className="ct">{p.email&&<span>Email: {p.email}</span>}{p.phone&&<span>Phone: {p.phone}</span>}{p.location&&<span>Location: {p.location}</span>}{p.linkedin&&<span>LinkedIn: {p.linkedin}</span>}</div>
    <hr className="dv"/>
    {summary&&<><div className="sh">PROFESSIONAL SUMMARY</div><p className="su">{d.summary}</p><hr className="dv"/></>}
    {hasExp&&<><div className="sh">WORK EXPERIENCE</div>{d.experience.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{e.role||'Title'}</div><div className="co">{[e.company,e.location].filter(Boolean).join(', ')}</div></div><div className="dt">{dateStr(e)}</div></div><Bullets items={e.bullets} cls="bu"/></div>)}<hr className="dv"/></>}
    {hasSk&&<><div className="sh">SKILLS</div>{d.skills.map(sg=><div key={sg.id} className="sk"><span className="skn">{sg.category?sg.category+': ':''}</span>{sg.items}</div>)}<hr className="dv"/></>}
    {hasEdu&&<><div className="sh">EDUCATION</div>{d.education.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{[e.degree,e.field].filter(Boolean).join(', ')}</div><div className="co">{e.school}</div></div><div className="dt">{[e.startDate,e.endDate].filter(Boolean).join(' – ')}</div></div>{e.gpa&&<div className="gp">GPA: {e.gpa}</div>}</div>)}</>}
    {hasCert&&<><hr className="dv"/><div className="sh">CERTIFICATIONS</div>{d.certifications.map(c=><div key={c.id} style={{marginBottom:4}}><b>{c.name}</b>{c.issuer?' – '+c.issuer:''}{c.date?' ('+c.date+')':''}</div>)}</>}
    {hasLang&&<><hr className="dv"/><div className="sh">LANGUAGES</div><div>{d.languages.map(l=>l.language+(l.proficiency?' ('+l.proficiency+')':'')).join(' | ')}</div></>}
  </div>;
}

function THybrid({d,sc}) {
  const {summary,hasExp,hasEdu,hasSk,hasCert,hasLang}=makeSections(d,sc);
  const p=d.personal;
  return <div className="rHY">
    <div className="hdr">
      <div className="nm">{p.name||'Your Name'}</div>
      {p.title&&<div className="hl">{p.title}</div>}
      <div className="ct">{p.email&&<span>✉ {p.email}</span>}{p.phone&&<span>☎ {p.phone}</span>}{p.location&&<span>⌖ {p.location}</span>}{p.linkedin&&<span>in {p.linkedin}</span>}</div>
    </div>
    <div className="bd">
      {summary&&<><div className="sh">Summary</div><p className="su">{d.summary}</p></>}
      {hasSk&&<><div className="sh">Core Competencies</div>{d.skills.map(sg=><div key={sg.id} className="skbox"><div className="skcat">{sg.category||'Skills'}</div><div className="sktags">{sg.items.split(',').map((s,i)=>s.trim()?<span key={i} className="sktag">{s.trim()}</span>:null)}</div></div>)}</>}
      {hasExp&&<><div className="sh">Work Experience</div>{d.experience.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{e.role||'Title'}</div><div className="co">{[e.company,e.location].filter(Boolean).join(' · ')}</div></div><div className="dt">{dateStr(e)}</div></div><Bullets items={e.bullets} cls="bu"/></div>)}</>}
      {hasEdu&&<><div className="sh">Education</div>{d.education.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{[e.degree,e.field].filter(Boolean).join(', ')}</div><div className="co">{e.school}</div></div><div className="dt">{[e.startDate,e.endDate].filter(Boolean).join(' – ')}</div></div>{e.gpa&&<div className="gp">GPA: {e.gpa}</div>}</div>)}</>}
      {hasCert&&<><div className="sh">Certifications</div>{d.certifications.map(c=><div key={c.id} className="eb"><div className="eh"><div><div className="rl">{c.name}</div>{c.issuer&&<div className="co">{c.issuer}</div>}</div>{c.date&&<div className="dt">{c.date}</div>}</div></div>)}</>}
      {hasLang&&<><div className="sh">Languages</div><div className="sktags" style={{marginTop:4}}>{d.languages.map(l=><span key={l.id} className="sktag">{l.language}{l.proficiency?` · ${l.proficiency}`:''}</span>)}</div></>}
    </div>
  </div>;
}

function TTwoCol({d,sc}) {
  const {summary,hasExp,hasEdu,hasSk,hasCert,hasLang}=makeSections(d,sc);
  const p=d.personal;
  const allSk=d.skills.flatMap(sg=>sg.items.split(',').map(s=>s.trim()).filter(Boolean));
  const bars=allSk.slice(0,8), tags=allSk.slice(8);
  const pcts=[95,90,85,88,80,82,87,78];
  return <div className="rTC">
    <div className="sb">
      <div className="nm">{p.name||'Your Name'}</div>
      {p.title&&<div className="hl">{p.title}</div>}
      <div className="ssh">Contact</div>
      {p.email&&<div className="ci"><div className="cic">✉</div><div className="cit">{p.email}</div></div>}
      {p.phone&&<div className="ci"><div className="cic">☎</div><div className="cit">{p.phone}</div></div>}
      {p.location&&<div className="ci"><div className="cic">⌖</div><div className="cit">{p.location}</div></div>}
      {p.linkedin&&<div className="ci"><div className="cic">in</div><div className="cit">{p.linkedin}</div></div>}
      {hasSk&&bars.length>0&&<><div className="ssh">Skills</div>{bars.map((sk,i)=><div key={i} className="skb"><div className="skn">{sk}</div><div className="skt"><div className="skf" style={{width:`${pcts[i%pcts.length]}%`}}/></div></div>)}{tags.length>0&&<div style={{marginTop:6}}>{tags.map((s,i)=><span key={i} className="sktag">{s}</span>)}</div>}</>}
      {hasEdu&&<><div className="ssh">Education</div>{d.education.map(e=><div key={e.id} style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:700,color:'#e2e8f0'}}>{e.degree}</div><div style={{fontSize:11,color:'#93c5fd',marginTop:2}}>{e.school}</div><div style={{fontSize:10.5,color:'#64748b',marginTop:1}}>{[e.startDate,e.endDate].filter(Boolean).join(' – ')}</div></div>)}</>}
      {hasCert&&<><div className="ssh">Certifications</div>{d.certifications.map(c=><div key={c.id} style={{fontSize:11,color:'#e2e8f0',marginBottom:6,lineHeight:1.4}}>{c.name}<br/>{c.date&&<span style={{fontSize:10,color:'#64748b'}}>{c.date}</span>}</div>)}</>}
      {hasLang&&<><div className="ssh">Languages</div>{d.languages.map(l=><div key={l.id} className="lg"><span className="lgn">{l.language}</span><span className="lgl">{l.proficiency}</span></div>)}</>}
    </div>
    <div className="mn">
      {summary&&<><div className="sh">Profile</div><p className="su">{d.summary}</p></>}
      {hasExp&&<><div className="sh">Work Experience</div>{d.experience.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{e.role||'Title'}</div><div className="co">{[e.company,e.location].filter(Boolean).join(' · ')}</div></div><div className="dt">{dateStr(e)}</div></div><Bullets items={e.bullets} cls="bu"/></div>)}</>}
    </div>
  </div>;
}

function TCreative({d,sc}) {
  const {summary,hasExp,hasEdu,hasSk,hasCert,hasLang,allSk}=makeSections(d,sc);
  const p=d.personal;
  return <div className="rCR">
    <div className="hdr">
      <div className="nm">{p.name||'Your Name'}</div>
      {p.title&&<div className="hl">{p.title}</div>}
      <div className="ct">{p.email&&<span>✉ {p.email}</span>}{p.phone&&<span>☎ {p.phone}</span>}{p.location&&<span>⌖ {p.location}</span>}{p.linkedin&&<span>in {p.linkedin}</span>}</div>
    </div>
    <div className="bd">
      {summary&&<><div className="sh">Profile</div><p className="su">{d.summary}</p></>}
      {hasExp&&<><div className="sh">Experience</div>{d.experience.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{e.role||'Title'}</div><div className="co">{[e.company,e.location].filter(Boolean).join(' · ')}</div></div><div className="dt">{dateStr(e)}</div></div><Bullets items={e.bullets} cls="bu"/></div>)}</>}
      {hasSk&&<><div className="sh">Skills</div><div className="sk">{allSk.map((s,i)=><span key={i}>{s}</span>)}</div></>}
      {hasEdu&&<><div className="sh">Education</div>{d.education.map(e=><div key={e.id} className="eb"><div className="eh"><div><div className="rl">{[e.degree,e.field].filter(Boolean).join(', ')}</div><div className="co">{e.school}</div></div><div className="dt">{[e.startDate,e.endDate].filter(Boolean).join(' – ')}</div></div>{e.gpa&&<div className="gp">GPA: {e.gpa}</div>}</div>)}</>}
      {hasCert&&<><div className="sh">Certifications</div>{d.certifications.map(c=><div key={c.id} className="eb"><div className="eh"><div><div className="rl">{c.name}</div>{c.issuer&&<div className="co">{c.issuer}</div>}</div>{c.date&&<div className="dt">{c.date}</div>}</div></div>)}</>}
      {hasLang&&<><div className="sh">Languages</div><div className="sk">{d.languages.map(l=><span key={l.id}>{l.language}{l.proficiency?` · ${l.proficiency}`:''}</span>)}</div></>}
    </div>
  </div>;
}

function TFunctional({d,sc}) {
  const {summary,hasExp,hasEdu,hasSk,hasCert,hasLang}=makeSections(d,sc);
  const p=d.personal;
  return <div className="rFN">
    <div className="nm">{p.name||'Your Name'}</div>
    {p.title&&<div className="hl">{p.title}</div>}
    <div className="ct">{p.email&&<span>✉ {p.email}</span>}{p.phone&&<span>☎ {p.phone}</span>}{p.location&&<span>⌖ {p.location}</span>}{p.linkedin&&<span>in {p.linkedin}</span>}</div>
    {summary&&<><div className="sh">Summary</div><p className="su">{d.summary}</p></>}
    {hasSk&&<><div className="sh">Core Competencies</div><div className="skarea">{d.skills.map(sg=><div key={sg.id} className="skbox"><div className="skcat">{sg.category||'Skills'}</div>{sg.items.split(',').filter(s=>s.trim()).map((s,i)=><div key={i} className="skbu">{s.trim()}</div>)}</div>)}</div></>}
    {hasExp&&<><div className="sh">Work History</div>{d.experience.map(e=><div key={e.id} className="eb"><div className="fneh"><div><div className="fnrl">{e.role||'Title'}</div><div className="fnco">{[e.company,e.location].filter(Boolean).join(', ')}</div></div><div className="fndt">{dateStr(e)}</div></div><Bullets items={e.bullets} cls="bu" /></div>)}</>}
    {hasEdu&&<><div className="sh">Education</div>{d.education.map(e=><div key={e.id} className="eb"><div className="fneh"><div><div className="fnrl">{[e.degree,e.field].filter(Boolean).join(', ')}</div><div className="fnco">{e.school}</div></div><div className="fndt">{[e.startDate,e.endDate].filter(Boolean).join(' – ')}</div></div>{e.gpa&&<div className="gp">GPA: {e.gpa}</div>}</div>)}</>}
    {hasCert&&<><div className="sh">Certifications</div>{d.certifications.map(c=><div key={c.id} className="eb"><div className="fneh"><div><div className="fnrl">{c.name}</div>{c.issuer&&<div className="fnco">{c.issuer}</div>}</div><div className="fndt">{c.date}</div></div></div>)}</>}
    {hasLang&&<><div className="sh">Languages</div><div style={{display:'flex',flexWrap:'wrap',gap:6}}>{d.languages.map(l=><span key={l.id} style={{background:'#ecfdf5',border:'1px solid #a7f3d0',color:'#065f46',fontSize:11.5,padding:'3px 10px',borderRadius:4}}>{l.language}{l.proficiency?` · ${l.proficiency}`:''}</span>)}</div></>}
  </div>;
}

const TEMPLATE_MAP = {chrono:TChrono, modpro:TModPro, ats:TAts, hybrid:THybrid, twocol:TTwoCol, creative:TCreative, functional:TFunctional};

/* ═══════════════════ TEMPLATE CHOOSER MODAL ═══════════════════ */
const TPLS = [
  {id:'chrono',   name:'Reverse Chronological', sub:'Most common format', ats:5, color:'#1a202c', accent:'#1a202c',
   thumb:<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white"/>
    <rect x="8" y="8" width="104" height="20" rx="2" fill="#1a202c"/>
    <rect x="8" y="12" width="60" height="8" rx="1" fill="white" opacity=".9"/>
    <rect x="8" y="32" width="50" height="3" rx="1" fill="#1a202c" opacity=".15"/>
    <rect x="8" y="32" width="50" height="1.5" rx="1" fill="#1a202c"/>
    <rect x="8" y="40" width="75" height="2.5" rx="1" fill="#718096"/>
    <rect x="8" y="45" width="65" height="2.5" rx="1" fill="#718096"/>
    <rect x="8" y="55" width="50" height="3" rx="1" fill="#1a202c"/>
    <rect x="8" y="55" width="104" height="1" rx="1" fill="#e2e8f0"/>
    <rect x="8" y="62" width="60" height="2.5" rx="1" fill="#2d3748"/>
    <rect x="8" y="67" width="45" height="2" rx="1" fill="#718096"/>
    <rect x="14" y="73" width="70" height="2" rx="1" fill="#a0aec0"/>
    <rect x="14" y="78" width="65" height="2" rx="1" fill="#a0aec0"/>
    <rect x="14" y="83" width="55" height="2" rx="1" fill="#a0aec0"/>
    <rect x="8" y="92" width="60" height="2.5" rx="1" fill="#2d3748"/>
    <rect x="8" y="97" width="45" height="2" rx="1" fill="#718096"/>
    <rect x="14" y="103" width="60" height="2" rx="1" fill="#a0aec0"/>
    <rect x="14" y="108" width="50" height="2" rx="1" fill="#a0aec0"/>
    <rect x="8" y="118" width="50" height="3" rx="1" fill="#1a202c"/>
    <rect x="8" y="118" width="104" height="1" rx="1" fill="#e2e8f0"/>
    <rect x="8" y="125" width="55" height="2.5" rx="1" fill="#718096"/>
    <rect x="8" y="135" width="50" height="3" rx="1" fill="#1a202c"/>
    <rect x="8" y="135" width="104" height="1" rx="1" fill="#e2e8f0"/>
    <rect x="8" y="142" width="45" height="2" rx="1" fill="#718096"/>
    <rect x="10" y="148" width="8" height="8" rx="2" fill="#f7fafc" stroke="#e2e8f0"/>
    <rect x="22" y="148" width="8" height="8" rx="2" fill="#f7fafc" stroke="#e2e8f0"/>
    <rect x="34" y="148" width="8" height="8" rx="2" fill="#f7fafc" stroke="#e2e8f0"/>
   </svg>},

  {id:'modpro',   name:'Modern Professional', sub:'Clean with color accent', ats:4, color:'#0f172a', accent:'#6366f1',
   thumb:<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white"/>
    <rect x="0" y="0" width="120" height="34" fill="#0f172a"/>
    <rect width="6" height="160" fill="#6366f1"/>
    <rect x="10" y="8" width="65" height="8" rx="1" fill="white" opacity=".9"/>
    <rect x="10" y="19" width="45" height="4" rx="1" fill="#94a3b8"/>
    <rect x="10" y="26" width="80" height="2.5" rx="1" fill="#475569"/>
    <rect x="10" y="42" width="3" height="10" rx="1" fill="#6366f1"/>
    <rect x="16" y="43" width="40" height="2.5" rx="1" fill="#6366f1"/>
    <rect x="16" y="50" width="70" height="2" rx="1" fill="#94a3b8"/>
    <rect x="16" y="55" width="65" height="2" rx="1" fill="#94a3b8"/>
    <rect x="10" y="64" width="3" height="8" rx="1" fill="#6366f1"/>
    <rect x="16" y="65" width="40" height="2.5" rx="1" fill="#6366f1"/>
    <rect x="16" y="72" width="55" height="2" rx="1" fill="#2d3748"/>
    <rect x="16" y="77" width="45" height="2" rx="1" fill="#718096"/>
    <rect x="20" y="83" width="65" height="1.5" rx="1" fill="#a0aec0"/>
    <rect x="20" y="87" width="58" height="1.5" rx="1" fill="#a0aec0"/>
    <rect x="20" y="91" width="50" height="1.5" rx="1" fill="#a0aec0"/>
    <rect x="16" y="99" width="55" height="2" rx="1" fill="#2d3748"/>
    <rect x="16" y="104" width="45" height="2" rx="1" fill="#718096"/>
    <rect x="20" y="110" width="60" height="1.5" rx="1" fill="#a0aec0"/>
    <rect x="10" y="120" width="3" height="8" rx="1" fill="#6366f1"/>
    <rect x="16" y="121" width="35" height="2.5" rx="1" fill="#6366f1"/>
    <rect x="16" y="128" width="90" height="2" rx="1" fill="#94a3b8"/>
    <rect x="10" y="136" width="3" height="8" rx="1" fill="#6366f1"/>
    <rect x="16" y="137" width="30" height="2.5" rx="1" fill="#6366f1"/>
    <rect x="16" y="143" width="55" height="2" rx="1" fill="#94a3b8"/>
   </svg>},

  {id:'ats',      name:'Minimal ATS', sub:'Maximum parser compatibility', ats:5, color:'#000', accent:'#000',
   thumb:<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white"/>
    <rect x="8" y="8" width="55" height="7" rx="1" fill="#000"/>
    <rect x="8" y="18" width="40" height="3" rx="1" fill="#333"/>
    <rect x="8" y="25" width="85" height="2" rx="1" fill="#666"/>
    <rect x="8" y="33" width="104" height="1" rx="0" fill="#000"/>
    <rect x="8" y="38" width="50" height="2.5" rx="1" fill="#000"/>
    <rect x="8" y="44" width="80" height="2" rx="1" fill="#444"/>
    <rect x="8" y="49" width="70" height="2" rx="1" fill="#444"/>
    <rect x="8" y="55" width="104" height="0.5" rx="0" fill="#000"/>
    <rect x="8" y="59" width="50" height="2.5" rx="1" fill="#000"/>
    <rect x="8" y="64" width="60" height="2" rx="1" fill="#333"/>
    <rect x="8" y="68" width="50" height="2" rx="1" fill="#666"/>
    <rect x="12" y="74" width="70" height="1.5" rx="1" fill="#888"/>
    <rect x="12" y="78" width="65" height="1.5" rx="1" fill="#888"/>
    <rect x="12" y="82" width="55" height="1.5" rx="1" fill="#888"/>
    <rect x="8" y="88" width="104" height="0.5" rx="0" fill="#000"/>
    <rect x="8" y="92" width="35" height="2.5" rx="1" fill="#000"/>
    <rect x="8" y="98" width="95" height="2" rx="1" fill="#666"/>
    <rect x="8" y="104" width="104" height="0.5" rx="0" fill="#000"/>
    <rect x="8" y="108" width="40" height="2.5" rx="1" fill="#000"/>
    <rect x="8" y="114" width="60" height="2" rx="1" fill="#333"/>
    <rect x="8" y="119" width="50" height="2" rx="1" fill="#666"/>
    <rect x="8" y="128" width="104" height="0.5" rx="0" fill="#000"/>
    <rect x="8" y="132" width="30" height="2.5" rx="1" fill="#000"/>
    <rect x="8" y="138" width="80" height="2" rx="1" fill="#666"/>
   </svg>},

  {id:'hybrid',   name:'Hybrid', sub:'Skills-first, great for career changes', ats:4, color:'#1e293b', accent:'#6366f1',
   thumb:<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white"/>
    <rect x="0" y="0" width="120" height="30" fill="#1e293b"/>
    <rect x="8" y="6" width="60" height="8" rx="1" fill="white" opacity=".9"/>
    <rect x="8" y="17" width="45" height="4" rx="1" fill="#94a3b8"/>
    <rect x="8" y="36" width="6" height="7" rx="1" fill="#6366f1"/>
    <rect x="17" y="37" width="40" height="3" rx="1" fill="#6366f1"/>
    <rect x="8" y="48" width="50" height="14" rx="3" fill="#eef2ff" stroke="#c7d2fe"/>
    <rect x="64" y="48" width="50" height="14" rx="3" fill="#eef2ff" stroke="#c7d2fe"/>
    <rect x="11" y="51" width="20" height="2" rx="1" fill="#6366f1"/>
    <rect x="11" y="55" width="35" height="2" rx="1" fill="#818cf8"/>
    <rect x="67" y="51" width="20" height="2" rx="1" fill="#6366f1"/>
    <rect x="67" y="55" width="35" height="2" rx="1" fill="#818cf8"/>
    <rect x="8" y="68" width="6" height="7" rx="1" fill="#6366f1"/>
    <rect x="17" y="70" width="40" height="3" rx="1" fill="#6366f1"/>
    <rect x="8" y="78" width="65" height="2.5" rx="1" fill="#2d3748"/>
    <rect x="8" y="83" width="50" height="2" rx="1" fill="#718096"/>
    <rect x="12" y="89" width="70" height="2" rx="1" fill="#94a3b8"/>
    <rect x="12" y="94" width="65" height="2" rx="1" fill="#94a3b8"/>
    <rect x="12" y="99" width="55" height="2" rx="1" fill="#94a3b8"/>
    <rect x="8" y="107" width="6" height="7" rx="1" fill="#6366f1"/>
    <rect x="17" y="109" width="40" height="3" rx="1" fill="#6366f1"/>
    <rect x="8" y="118" width="65" height="2.5" rx="1" fill="#2d3748"/>
    <rect x="8" y="123" width="50" height="2" rx="1" fill="#718096"/>
    <rect x="12" y="129" width="70" height="2" rx="1" fill="#94a3b8"/>
   </svg>},

  {id:'twocol',   name:'Two Column', sub:'Sidebar with skills & contact', ats:3, color:'#1e3a5f', accent:'#60a5fa',
   thumb:<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white"/>
    <rect x="0" y="0" width="40" height="160" fill="#1e3a5f"/>
    <rect x="4" y="8" width="32" height="6" rx="1" fill="white" opacity=".85"/>
    <rect x="4" y="17" width="28" height="3" rx="1" fill="#93c5fd"/>
    <rect x="4" y="28" width="32" height="1" rx="0" fill="rgba(255,255,255,.2)"/>
    <rect x="4" y="32" width="20" height="2" rx="1" fill="#60a5fa"/>
    <rect x="4" y="37" width="28" height="1.5" rx="1" fill="#cbd5e1"/>
    <rect x="4" y="41" width="24" height="1.5" rx="1" fill="#cbd5e1"/>
    <rect x="4" y="45" width="26" height="1.5" rx="1" fill="#cbd5e1"/>
    <rect x="4" y="52" width="20" height="2" rx="1" fill="#60a5fa"/>
    <rect x="4" y="57" width="30" height="2.5" rx="1" fill="#e2e8f0"/>
    <rect x="4" y="61" width="30" height="3" rx="1" fill="rgba(255,255,255,.12)"/>
    <rect x="4" y="65" width="25" height="3" rx="1" fill="rgba(255,255,255,.12)"/>
    <rect x="4" y="69" width="28" height="3" rx="1" fill="rgba(255,255,255,.12)"/>
    <rect x="4" y="76" width="20" height="2" rx="1" fill="#60a5fa"/>
    <rect x="4" y="81" width="30" height="2" rx="1" fill="#e2e8f0"/>
    <rect x="4" y="85" width="25" height="2" rx="1" fill="#93c5fd"/>
    <rect x="4" y="96" width="20" height="2" rx="1" fill="#60a5fa"/>
    <rect x="4" y="101" width="28" height="1.5" rx="1" fill="#cbd5e1"/>
    <rect x="4" y="105" width="22" height="1.5" rx="1" fill="#93c5fd"/>
    <rect x="46" y="8" width="40" height="2" rx="1" fill="#0f172a"/>
    <rect x="46" y="8" width="66" height="1" rx="0" fill="#1e3a5f"/>
    <rect x="46" y="14" width="35" height="2.5" rx="1" fill="#0f172a"/>
    <rect x="80" y="14" width="28" height="6" rx="3" fill="#1e3a5f"/>
    <rect x="46" y="18" width="28" height="2" rx="1" fill="#64748b"/>
    <rect x="50" y="23" width="50" height="1.5" rx="1" fill="#94a3b8"/>
    <rect x="50" y="27" width="45" height="1.5" rx="1" fill="#94a3b8"/>
    <rect x="50" y="31" width="40" height="1.5" rx="1" fill="#94a3b8"/>
    <rect x="46" y="38" width="40" height="2" rx="1" fill="#0f172a"/>
    <rect x="46" y="38" width="66" height="1" rx="0" fill="#1e3a5f"/>
    <rect x="46" y="44" width="35" height="2.5" rx="1" fill="#0f172a"/>
    <rect x="80" y="44" width="28" height="6" rx="3" fill="#1e3a5f"/>
    <rect x="46" y="48" width="28" height="2" rx="1" fill="#64748b"/>
    <rect x="50" y="53" width="50" height="1.5" rx="1" fill="#94a3b8"/>
    <rect x="50" y="57" width="45" height="1.5" rx="1" fill="#94a3b8"/>
   </svg>},

  {id:'creative',  name:'Creative', sub:'Bold gradient header, visual', ats:3, color:'#7c3aed', accent:'#2563eb',
   thumb:<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white"/>
    <defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#2563eb"/></linearGradient></defs>
    <rect x="0" y="0" width="120" height="40" fill="url(#cg)"/>
    <circle cx="95" cy="10" r="20" fill="rgba(255,255,255,.06)"/>
    <circle cx="105" cy="38" r="14" fill="rgba(255,255,255,.04)"/>
    <rect x="8" y="8" width="62" height="9" rx="1" fill="white" opacity=".9"/>
    <rect x="8" y="20" width="45" height="4" rx="1" fill="rgba(255,255,255,.7)"/>
    <rect x="8" y="27" width="80" height="2.5" rx="1" fill="rgba(255,255,255,.5)"/>
    <rect x="8" y="49" width="50" height="1" rx="0" fill="#7c3aed"/>
    <rect x="8" y="47" width="35" height="3" rx="1" fill="#7c3aed"/>
    <rect x="60" y="48" width="52" height="1" rx="1" fill="#ede9fe"/>
    <rect x="8" y="54" width="65" height="2" rx="1" fill="#475569"/>
    <rect x="8" y="59" width="55" height="2" rx="1" fill="#64748b"/>
    <rect x="8" y="68" width="35" height="3" rx="1" fill="#7c3aed"/>
    <rect x="55" y="69" width="57" height="1" rx="1" fill="#ede9fe"/>
    <rect x="8" y="75" width="60" height="2.5" rx="1" fill="#1e293b"/>
    <rect x="8" y="80" width="50" height="2" rx="1" fill="#64748b"/>
    <rect x="12" y="86" width="60" height="1.5" rx="1" fill="#94a3b8"/>
    <rect x="12" y="90" width="55" height="1.5" rx="1" fill="#94a3b8"/>
    <rect x="12" y="94" width="50" height="1.5" rx="1" fill="#94a3b8"/>
    <rect x="8" y="103" width="30" height="3" rx="1" fill="#7c3aed"/>
    <rect x="48" y="104" width="64" height="1" rx="1" fill="#ede9fe"/>
    <rect x="8" y="110" width="25" height="8" rx="10" fill="#f5f3ff" stroke="#c4b5fd"/>
    <rect x="36" y="110" width="22" height="8" rx="10" fill="#f5f3ff" stroke="#c4b5fd"/>
    <rect x="61" y="110" width="28" height="8" rx="10" fill="#f5f3ff" stroke="#c4b5fd"/>
    <rect x="8" y="128" width="35" height="3" rx="1" fill="#7c3aed"/>
    <rect x="53" y="129" width="59" height="1" rx="1" fill="#ede9fe"/>
    <rect x="8" y="135" width="55" height="2.5" rx="1" fill="#2d3748"/>
    <rect x="8" y="140" width="45" height="2" rx="1" fill="#64748b"/>
   </svg>},

  {id:'functional',name:'Functional Resume', sub:'Skills-based, brief history', ats:4, color:'#065f46', accent:'#059669',
   thumb:<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="160" fill="white"/>
    <rect x="0" y="0" width="5" height="160" fill="#059669"/>
    <rect x="10" y="8" width="60" height="8" rx="1" fill="#000"/>
    <rect x="10" y="18" width="45" height="3" rx="1" fill="#374151"/>
    <rect x="10" y="25" width="80" height="2" rx="1" fill="#6b7280"/>
    <rect x="10" y="34" width="80" height="1" rx="0" fill="#d1fae5"/>
    <rect x="10" y="31" width="40" height="3" rx="1" fill="#059669"/>
    <rect x="10" y="40" width="75" height="2" rx="1" fill="#374151"/>
    <rect x="10" y="45" width="65" height="2" rx="1" fill="#374151"/>
    <rect x="10" y="52" width="80" height="1" rx="0" fill="#d1fae5"/>
    <rect x="10" y="49" width="45" height="3" rx="1" fill="#059669"/>
    <rect x="8" y="57" width="53" height="28" rx="4" fill="#f0fdf4" stroke="#a7f3d0"/>
    <rect x="64" y="57" width="50" height="28" rx="4" fill="#f0fdf4" stroke="#a7f3d0"/>
    <rect x="12" y="61" width="25" height="2" rx="1" fill="#065f46"/>
    <rect x="12" y="66" width="40" height="1.5" rx="1" fill="#374151"/>
    <rect x="12" y="70" width="38" height="1.5" rx="1" fill="#374151"/>
    <rect x="12" y="74" width="35" height="1.5" rx="1" fill="#374151"/>
    <rect x="68" y="61" width="22" height="2" rx="1" fill="#065f46"/>
    <rect x="68" y="66" width="35" height="1.5" rx="1" fill="#374151"/>
    <rect x="68" y="70" width="32" height="1.5" rx="1" fill="#374151"/>
    <rect x="68" y="74" width="30" height="1.5" rx="1" fill="#374151"/>
    <rect x="10" y="92" width="80" height="1" rx="0" fill="#d1fae5"/>
    <rect x="10" y="89" width="40" height="3" rx="1" fill="#059669"/>
    <rect x="10" y="97" width="60" height="2.5" rx="1" fill="#111827"/>
    <rect x="10" y="102" width="50" height="2" rx="1" fill="#6b7280"/>
    <rect x="14" y="108" width="65" height="1.5" rx="1" fill="#9ca3af"/>
    <rect x="10" y="116" width="60" height="2.5" rx="1" fill="#111827"/>
    <rect x="10" y="121" width="50" height="2" rx="1" fill="#6b7280"/>
    <rect x="10" y="132" width="80" height="1" rx="0" fill="#d1fae5"/>
    <rect x="10" y="129" width="35" height="3" rx="1" fill="#059669"/>
    <rect x="10" y="137" width="55" height="2" rx="1" fill="#6b7280"/>
    <rect x="10" y="142" width="45" height="2" rx="1" fill="#6b7280"/>
   </svg>},
];

function TemplatePicker({ current, onSelect, onClose }) {
  return (
    <div className="ovl" onClick={onClose}>
      <div style={{background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:18,padding:28,width:'100%',maxWidth:860,maxHeight:'90vh',overflow:'auto',boxShadow:'0 24px 60px rgba(0,0,0,.18)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
          <div>
            <div style={{fontSize:20,fontWeight:800,color:'#1e293b'}}>Choose Template</div>
            <div style={{fontSize:12,color:'#94a3b8',marginTop:3}}>7 professionally designed templates for every career stage</div>
          </div>
          <button className="bI" onClick={onClose} style={{fontSize:18,color:'#94a3b8',padding:'4px 8px'}}>✕</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:14}}>
          {TPLS.map(t=>(
            <button key={t.id} onClick={()=>{onSelect(t.id);onClose();}} style={{background:current===t.id?'#f0f9ff':'#fff',border:`2px solid ${current===t.id?t.accent:'#e2e8f0'}`,borderRadius:13,padding:0,cursor:'pointer',transition:'all .15s',overflow:'hidden',textAlign:'left'}}>
              <div style={{border:'1px solid #f1f5f9',margin:10,borderRadius:8,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,.08)',lineHeight:0}}>
                {t.thumb}
              </div>
              <div style={{padding:'0 12px 12px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2}}>
                  <span style={{fontSize:13,fontWeight:700,color:current===t.id?t.accent:'#1e293b'}}>{t.name}</span>
                  {current===t.id&&<span style={{fontSize:10,background:t.accent,color:'#fff',padding:'1px 7px',borderRadius:8,fontWeight:700}}>Active</span>}
                </div>
                <div style={{fontSize:11,color:'#94a3b8',marginBottom:6}}>{t.sub}</div>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:9.5,color:'#64748b'}}>ATS</span>
                  {'★'.repeat(t.ats).split('').map((_,i)=><span key={i} style={{fontSize:10,color:'#f59e0b'}}>★</span>)}
                  {'☆'.repeat(5-t.ats).split('').map((_,i)=><span key={i} style={{fontSize:10,color:'#e2e8f0'}}>★</span>)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ SECTION MANAGER MODAL ═══════════════════ */
function SectionManager({ sections, onChange, onClose }) {
  const [local, setLocal] = useState(sections);
  const move = (i, dir) => {
    const a=[...local]; const j=i+dir;
    if(j<0||j>=a.length) return;
    [a[i],a[j]]=[a[j],a[i]]; setLocal(a);
  };
  return (
    <div className="ovl" onClick={onClose}>
      <div style={{background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:16,padding:24,width:'100%',maxWidth:400,boxShadow:'0 20px 50px rgba(0,0,0,.15)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:'#1e293b'}}>Customise Sections</div>
            <div style={{fontSize:11.5,color:'#94a3b8',marginTop:2}}>Show/hide and reorder resume sections</div>
          </div>
          <button className="bI" onClick={onClose} style={{fontSize:17,color:'#94a3b8'}}>✕</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:18}}>
          {local.map((s,i)=>(
            <div key={s.id} style={{display:'flex',alignItems:'center',gap:10,background:'#f8fafc',border:'1.5px solid #f1f5f9',borderRadius:9,padding:'9px 12px'}}>
              <span style={{fontSize:15}}>{s.icon}</span>
              <span style={{flex:1,fontSize:13,fontWeight:600,color:'#1e293b'}}>{s.label}</span>
              <label style={{display:'flex',alignItems:'center',gap:5,cursor:'pointer',fontSize:11.5,color:'#64748b',fontWeight:500}}>
                <input type="checkbox" checked={s.visible} onChange={e=>setLocal(l=>l.map((x,j)=>j===i?{...x,visible:e.target.checked}:x))} style={{accentColor:'#6366f1',width:14,height:14}}/>
                Show
              </label>
              <div style={{display:'flex',gap:2}}>
                <button className="bI" onClick={()=>move(i,-1)} title="Move up" style={{fontSize:12,padding:'2px 5px'}}>↑</button>
                <button className="bI" onClick={()=>move(i,1)} title="Move down" style={{fontSize:12,padding:'2px 5px'}}>↓</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="bS" onClick={onClose} style={{flex:1,justifyContent:'center'}}>Cancel</button>
          <button className="bP" onClick={()=>{onChange(local);onClose();}} style={{flex:1,justifyContent:'center'}}>Apply Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ UPLOAD MODAL ═══════════════════ */
function UploadModal({ onClose, onDone }) {
  const [stage,setStage]=useState('idle');
  const [drag,setDrag]=useState(false);
  const [msg,setMsg]=useState('');
  const ref=useRef();
  async function run(file) {
    if(!file) return;
    const ext=file.name.split('.').pop().toLowerCase();
    if(!['pdf','docx','txt'].includes(ext)){setMsg('Use PDF, DOCX, or TXT only');setStage('error');return;}
    setMsg(file.name);setStage('parsing');
    try{const t=await extractText(file);onDone(parseResumeText(t));setStage('done');}
    catch(e){console.error(e);setMsg(e.message||'Parsing failed — try saving as .txt');setStage('error');}
  }
  return (
    <div className="ovl" onClick={onClose}>
      <div style={{background:'#fff',border:'1.5px solid #e2e8f0',borderRadius:18,padding:28,width:'100%',maxWidth:420,boxShadow:'0 24px 60px rgba(0,0,0,.15)'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
          <div><div style={{fontSize:17,fontWeight:800,color:'#1e293b'}}>Import Resume</div><div style={{fontSize:11.5,color:'#94a3b8',marginTop:2}}>Parsed locally — no API key needed</div></div>
          <button className="bI" onClick={onClose} style={{fontSize:17,color:'#94a3b8'}}>✕</button>
        </div>
        {stage==='idle'&&<>
          <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);run(e.dataTransfer.files[0])}} onClick={()=>ref.current.click()}
            style={{border:`2px dashed ${drag?'#6366f1':'#e2e8f0'}`,borderRadius:12,padding:'32px 20px',textAlign:'center',cursor:'pointer',background:drag?'#eef2ff':'#f8fafc',transition:'all .2s',marginBottom:14}}>
            <div style={{fontSize:36,marginBottom:10}}>📎</div>
            <div style={{fontSize:14,fontWeight:700,color:'#1e293b',marginBottom:4}}>Drop resume here</div>
            <div style={{fontSize:12,color:'#94a3b8',marginBottom:12}}>or click to browse</div>
            <div style={{display:'flex',gap:7,justifyContent:'center'}}>{['PDF','DOCX','TXT'].map(f=><span key={f} style={{fontSize:11,fontWeight:700,background:'#fff',border:'1.5px solid #e2e8f0',color:'#64748b',padding:'3px 10px',borderRadius:5}}>{f}</span>)}</div>
            <input ref={ref} type="file" accept=".pdf,.docx,.txt" style={{display:'none'}} onChange={e=>run(e.target.files[0])}/>
          </div>
          <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,padding:'9px 13px',fontSize:11.5,color:'#166534'}}>🔒 Processed entirely in your browser — nothing uploaded</div>
        </>}
        {stage==='parsing'&&<div style={{textAlign:'center',padding:'28px 0'}}><div className="spinner"/><div style={{fontSize:14,fontWeight:700,color:'#1e293b',marginTop:14,marginBottom:4}}>Parsing "{msg}"</div><div style={{fontSize:12,color:'#94a3b8'}}>Extracting and structuring your resume…</div></div>}
        {stage==='done'&&<div style={{textAlign:'center',padding:'22px 0'}}><div style={{fontSize:46,marginBottom:10}}>✅</div><div style={{fontSize:16,fontWeight:800,color:'#16a34a',marginBottom:5}}>Import Successful!</div><div style={{fontSize:12,color:'#64748b',marginBottom:20}}>Review and edit any fields as needed.</div><button className="bP" onClick={onClose} style={{margin:'0 auto',padding:'9px 22px'}}>Open Editor →</button></div>}
        {stage==='error'&&<div style={{textAlign:'center',padding:'20px 0'}}><div style={{fontSize:36,marginBottom:10}}>⚠️</div><div style={{fontSize:14,fontWeight:700,color:'#dc2626',marginBottom:6}}>Import Failed</div><div style={{fontSize:12,color:'#64748b',marginBottom:16,lineHeight:1.5}}>{msg}</div><div style={{display:'flex',gap:8,justifyContent:'center'}}><button className="bS" onClick={()=>setStage('idle')}>Try Again</button><button className="bP" onClick={onClose}>Edit Manually</button></div></div>}
      </div>
    </div>
  );
}

/* ═══════════════════ ATS PANEL ═══════════════════ */
function ATSPanel({data}) {
  const {score,band,issues,wins,dims}=calcATS(data);
  const R=42,C=2*Math.PI*R,off=C-(score/100)*C;
  return (
    <div style={{padding:'18px 14px',maxWidth:480,margin:'0 auto'}}>
      <div style={{background:'#fff',border:'1.5px solid #f1f5f9',borderRadius:14,padding:'16px 18px',marginBottom:12,boxShadow:'0 1px 4px rgba(0,0,0,.05)',display:'flex',gap:16,alignItems:'center'}}>
        <svg width={96} height={96} style={{flexShrink:0}}>
          <circle cx={48} cy={48} r={R} fill="none" stroke="#f1f5f9" strokeWidth={8}/>
          <circle cx={48} cy={48} r={R} fill="none" stroke={band.c} strokeWidth={8} strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 48 48)" style={{transition:'stroke-dashoffset .9s ease'}}/>
          <text x={48} y={44} textAnchor="middle" fill={band.c} fontSize={24} fontWeight={800} fontFamily="Plus Jakarta Sans">{score}</text>
          <text x={48} y={57} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="Plus Jakarta Sans">out of 100</text>
        </svg>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:band.c}}>{band.l}</div>
          <div style={{fontSize:11,color:'#64748b',marginTop:3,lineHeight:1.5}}>ATS Compatibility Score</div>
          <div style={{marginTop:7,fontSize:11.5,color:score>=85?'#16a34a':score>=70?'#65a30d':score>=50?'#d97706':'#dc2626',fontWeight:600}}>{score>=85?'✅ Ready to apply':score>=70?'🟡 Minor fixes needed':score>=50?'🟠 Improvements needed':'🔴 Needs attention'}</div>
        </div>
      </div>
      <div style={{background:'#fff',border:'1.5px solid #f1f5f9',borderRadius:12,padding:'14px 16px',marginBottom:10,boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
        <div style={{fontSize:9.5,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>Score Breakdown</div>
        {dims.map((d,i)=><div key={i} style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:11.5,color:'#475569',fontWeight:500}}>{d.n}</span><span style={{fontSize:11.5,fontWeight:700,color:d.c}}>{Math.round(d.v)}<span style={{color:'#e2e8f0',fontWeight:400}}>/{d.max}</span></span></div><div style={{height:5,background:'#f1f5f9',borderRadius:3,overflow:'hidden'}}><div style={{height:5,background:d.c,width:`${(d.v/d.max)*100}%`,borderRadius:3,transition:'width .7s ease'}}/></div></div>)}
      </div>
      {issues.length>0&&<div style={{background:'#fff',border:'1.5px solid #f1f5f9',borderRadius:12,padding:'14px 16px',marginBottom:10,boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
        <div style={{fontSize:9.5,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:9}}>Fixes Needed</div>
        {issues.map((x,i)=><div key={i} style={{display:'flex',gap:8,marginBottom:7,padding:'8px 10px',background:'#f8fafc',borderRadius:7,borderLeft:`3px solid ${x.l==='high'?'#ef4444':x.l==='medium'?'#f59e0b':'#94a3b8'}`}}><span style={{fontSize:13,flexShrink:0}}>{x.l==='high'?'🔴':x.l==='medium'?'🟡':'⚪'}</span><span style={{fontSize:11.5,color:'#334155',lineHeight:1.5}}>{x.m}</span></div>)}
      </div>}
      {wins.length>0&&<div style={{background:'#fff',border:'1.5px solid #f1f5f9',borderRadius:12,padding:'14px 16px',marginBottom:10,boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
        <div style={{fontSize:9.5,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:9}}>Looking Good</div>
        {wins.slice(0,6).map((w,i)=><div key={i} style={{display:'flex',gap:7,marginBottom:5}}><span style={{color:'#16a34a',fontWeight:700,flexShrink:0}}>✓</span><span style={{fontSize:11.5,color:'#475569',lineHeight:1.4}}>{w}</span></div>)}
      </div>}
      <div style={{background:'#fffbeb',border:'1.5px solid #fde68a',borderRadius:11,padding:'12px 14px'}}>
        <div style={{fontSize:11,fontWeight:700,color:'#92400e',marginBottom:7}}>💡 ATS Tips</div>
        {['Chrono, ATS Minimal, or Functional = max ATS score','Mirror keywords exactly from the job description','Every bullet needs a metric — %, $, users, or time','Save as: FirstName-LastName-Resume.pdf'].map((t,i)=><div key={i} style={{fontSize:11,color:'#78350f',marginBottom:4,paddingLeft:9,borderLeft:'2px solid #fbbf24',lineHeight:1.45}}>{t}</div>)}
      </div>
    </div>
  );
}

/* ═══════════════════ COLLAPSIBLE ═══════════════════ */
function Coll({title,icon,open:def=false,badge,children}) {
  const [open,setOpen]=useState(def);
  return (
    <div className="card">
      <div className="card-hd" onClick={()=>setOpen(o=>!o)}>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <span style={{fontSize:13}}>{icon}</span>
          <span style={{fontSize:12.5,fontWeight:600,color:'#1e293b'}}>{title}</span>
          {badge!=null&&<span style={{fontSize:9.5,background:'#eef2ff',color:'#6366f1',border:'1px solid #c7d2fe',borderRadius:10,padding:'0 6px',fontWeight:700,lineHeight:'16px'}}>{badge}</span>}
        </div>
        <span style={{color:'#e2e8f0',fontSize:9,transition:'transform .2s',transform:open?'rotate(90deg)':'none'}}>▶</span>
      </div>
      {open&&<div className="card-bd fu">{children}</div>}
    </div>
  );
}
const F=({label,children})=><div className="fld"><label className="lbl">{label}</label>{children}</div>;

/* ═══════════════════ PRINT ═══════════════════ */
function doPrint(name) {
  const el=document.getElementById('rv');if(!el)return;
  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${name||'Resume'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
    <style>${PRINT_CSS}</style></head><body>${el.innerHTML}</body></html>`);
  w.document.close();setTimeout(()=>{w.focus();w.print();w.close();},900);
}

/* ═══════════════════ MAIN APP ═══════════════════ */
export default function App() {
  const [data,setData]     = useState(DEMO);
  const [tpl,setTpl]       = useState('chrono');
  const [tab,setTab]       = useState('preview');
  const [sections,setSections] = useState(DEFAULT_SECTIONS);
  const [showUpload,setShowUpload]   = useState(false);
  const [showTPicker,setShowTPicker] = useState(false);
  const [showSecMgr,setShowSecMgr]   = useState(false);

  const up  = fn=>setData(d=>({...fn({...d})}));
  const upP = (f,v)=>up(d=>({...d,personal:{...d.personal,[f]:v}}));
  const upS = v=>up(d=>({...d,summary:v}));

  const addExp= ()=>up(d=>({...d,experience:[...d.experience,{id:uid(),company:'',role:'',location:'',startDate:'',endDate:'',current:false,bullets:['']}]}));
  const rmExp = id=>up(d=>({...d,experience:d.experience.filter(e=>e.id!==id)}));
  const upE   = (id,f,v)=>up(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,[f]:v}:e)}));
  const upBul = (id,i,v)=>up(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:e.bullets.map((b,bi)=>bi===i?v:b)}:e)}));
  const addBul= id=>up(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:[...e.bullets,'']}:e)}));
  const rmBul = (id,i)=>up(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:e.bullets.filter((_,bi)=>bi!==i)}:e)}));

  const addEdu= ()=>up(d=>({...d,education:[...d.education,{id:uid(),school:'',degree:'',field:'',startDate:'',endDate:'',gpa:''}]}));
  const rmEdu = id=>up(d=>({...d,education:d.education.filter(e=>e.id!==id)}));
  const upEd  = (id,f,v)=>up(d=>({...d,education:d.education.map(e=>e.id===id?{...e,[f]:v}:e)}));

  const addSk = ()=>up(d=>({...d,skills:[...d.skills,{id:uid(),category:'',items:''}]}));
  const rmSk  = id=>up(d=>({...d,skills:d.skills.filter(s=>s.id!==id)}));
  const upSk  = (id,f,v)=>up(d=>({...d,skills:d.skills.map(s=>s.id===id?{...s,[f]:v}:s)}));

  const addCe = ()=>up(d=>({...d,certifications:[...d.certifications,{id:uid(),name:'',issuer:'',date:''}]}));
  const rmCe  = id=>up(d=>({...d,certifications:d.certifications.filter(c=>c.id!==id)}));
  const upCe  = (id,f,v)=>up(d=>({...d,certifications:d.certifications.map(c=>c.id===id?{...c,[f]:v}:c)}));

  const addLa = ()=>up(d=>({...d,languages:[...d.languages,{id:uid(),language:'',proficiency:''}]}));
  const rmLa  = id=>up(d=>({...d,languages:d.languages.filter(l=>l.id!==id)}));
  const upLa  = (id,f,v)=>up(d=>({...d,languages:d.languages.map(l=>l.id===id?{...l,[f]:v}:l)}));

  const sc  = calcATS(data);
  const wc  = data.summary.trim().split(/\s+/).filter(Boolean).length;
  const curT= TPLS.find(t=>t.id===tpl);
  const Tpl = TEMPLATE_MAP[tpl]||TChrono;

  return (
    <>
      <style>{UI}</style><style>{RCSS}</style>
      {showUpload  && <UploadModal   onClose={()=>setShowUpload(false)}   onDone={d=>{setData(d);setShowUpload(false)}}/>}
      {showTPicker && <TemplatePicker current={tpl} onSelect={setTpl} onClose={()=>setShowTPicker(false)}/>}
      {showSecMgr  && <SectionManager sections={sections} onChange={setSections} onClose={()=>setShowSecMgr(false)}/>}

      <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>

        {/* ══ LEFT ══ */}
        <div style={{width:368,display:'flex',flexDirection:'column',background:'#f8fafc',borderRight:'1.5px solid #e8edf4',flexShrink:0}}>

          {/* Header */}
          <div style={{background:'#fff',borderBottom:'1.5px solid #f1f5f9',padding:'12px 14px 10px',flexShrink:0,boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <div>
                <div style={{fontWeight:900,fontSize:15,color:'#1e293b',letterSpacing:'-.03em'}}>ResumeForge</div>
                <div style={{fontSize:9,color:'#94a3b8',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>Resume Builder</div>
              </div>
              <div style={{display:'flex',gap:5}}>
                <button className="bS" style={{fontSize:11,padding:'4px 9px'}} onClick={()=>{if(window.confirm('Clear all?'))setData(BLANK)}}>New</button>
                <button className="bP" style={{fontSize:11,padding:'5px 13px'}} onClick={()=>doPrint(data.personal.name)}>↓ PDF</button>
              </div>
            </div>
            <button className="bS" style={{width:'100%',justifyContent:'center',gap:7,padding:'8px',borderStyle:'dashed',fontSize:12}} onClick={()=>setShowUpload(true)}>
              <span style={{fontSize:16}}>📤</span><span style={{fontWeight:600}}>Import Existing Resume</span>
              <span style={{fontSize:9,background:'#f0fdf4',color:'#16a34a',border:'1px solid #bbf7d0',borderRadius:8,padding:'1px 7px',fontWeight:800}}>FREE</span>
            </button>
          </div>

          {/* Template + Section controls */}
          <div style={{background:'#fff',borderBottom:'1.5px solid #f1f5f9',padding:'9px 12px',flexShrink:0}}>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>setShowTPicker(true)} style={{flex:1,background:'#f8fafc',border:'1.5px solid #e2e8f0',borderRadius:9,padding:'8px 10px',cursor:'pointer',textAlign:'left',transition:'all .15s',display:'flex',alignItems:'center',justifyContent:'space-between'}} className="">
                <div>
                  <div style={{fontSize:10,color:'#94a3b8',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:1}}>Template</div>
                  <div style={{fontSize:12.5,fontWeight:700,color:'#1e293b'}}>{curT?.name||'Chrono'}</div>
                </div>
                <span style={{fontSize:11,color:'#94a3b8'}}>{'★'.repeat(curT?.ats||5).replace(/./g,'★')}</span>
              </button>
              <button onClick={()=>setShowTPicker(true)} style={{background:'#1e293b',border:'none',borderRadius:9,padding:'8px 14px',cursor:'pointer',color:'#fff',fontSize:11.5,fontWeight:600,transition:'all .15s',whiteSpace:'nowrap'}} onMouseOver={e=>e.target.style.background='#334155'} onMouseOut={e=>e.target.style.background='#1e293b'}>
                🎨 Change
              </button>
            </div>
            <button onClick={()=>setShowSecMgr(true)} style={{width:'100%',marginTop:6,background:'#f8fafc',border:'1.5px solid #e2e8f0',borderRadius:9,padding:'7px 12px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all .15s'}} onMouseOver={e=>e.currentTarget.style.borderColor='#6366f1'} onMouseOut={e=>e.currentTarget.style.borderColor='#e2e8f0'}>
              <span style={{fontSize:12,fontWeight:600,color:'#475569'}}>⚙ Customise Sections</span>
              <span style={{fontSize:10.5,color:'#94a3b8'}}>{sections.filter(s=>s.visible).length}/{sections.length} visible →</span>
            </button>
          </div>

          {/* Form */}
          <div style={{flex:1,overflowY:'auto',padding:'8px 7px 20px'}}>
            <Coll title="Personal Info" icon="👤" open>
              <div className="g2">
                <F label="Full Name"><input className="inp" value={data.personal.name} onChange={e=>upP('name',e.target.value)} placeholder="Jane Smith"/></F>
                <F label="Job Title"><input className="inp" value={data.personal.title} onChange={e=>upP('title',e.target.value)} placeholder="Software Engineer"/></F>
                <F label="Email"><input className="inp" value={data.personal.email} onChange={e=>upP('email',e.target.value)} placeholder="jane@email.com"/></F>
                <F label="Phone"><input className="inp" value={data.personal.phone} onChange={e=>upP('phone',e.target.value)} placeholder="+1 (555) 000-0000"/></F>
                <F label="City, State"><input className="inp" value={data.personal.location} onChange={e=>upP('location',e.target.value)} placeholder="New York, NY"/></F>
                <F label="LinkedIn"><input className="inp" value={data.personal.linkedin} onChange={e=>upP('linkedin',e.target.value)} placeholder="linkedin.com/in/..."/></F>
              </div>
              <F label="Website"><input className="inp" value={data.personal.website} onChange={e=>upP('website',e.target.value)} placeholder="yoursite.com (optional)"/></F>
            </Coll>

            <Coll title="Summary" icon="✍️" open>
              <textarea className="inp" rows={4} value={data.summary} onChange={e=>upS(e.target.value)} placeholder="2–4 sentences: years + specialty + 1 achievement + value."/>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                <span style={{fontSize:10.5,color:'#94a3b8'}}>{wc} words</span>
                <span style={{fontSize:10.5,fontWeight:600,color:wc>=40&&wc<=80?'#16a34a':'#d97706'}}>{wc>=40&&wc<=80?'✓ Good':'Target: 40–80 words'}</span>
              </div>
            </Coll>

            <Coll title="Work Experience" icon="💼" open badge={data.experience.length}>
              {data.experience.map((e,i)=>(
                <div key={e.id} className="ic">
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <span style={{fontSize:11,fontWeight:600,color:'#64748b'}}>{e.company||`Position ${i+1}`}</span>
                    <button className="bI" onClick={()=>rmExp(e.id)}>🗑</button>
                  </div>
                  <div className="g2">
                    <F label="Job Title"><input className="inp" value={e.role} onChange={x=>upE(e.id,'role',x.target.value)} placeholder="Senior Engineer"/></F>
                    <F label="Company"><input className="inp" value={e.company} onChange={x=>upE(e.id,'company',x.target.value)} placeholder="Google"/></F>
                    <F label="Location"><input className="inp" value={e.location} onChange={x=>upE(e.id,'location',x.target.value)} placeholder="SF, CA"/></F>
                    <F label="Start Date"><input className="inp" value={e.startDate} onChange={x=>upE(e.id,'startDate',x.target.value)} placeholder="Jan 2020"/></F>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <label style={{display:'flex',alignItems:'center',gap:5,cursor:'pointer',fontSize:12,color:'#64748b',fontWeight:500}}>
                      <input type="checkbox" checked={e.current} onChange={x=>upE(e.id,'current',x.target.checked)} style={{accentColor:'#6366f1'}}/>Currently here
                    </label>
                    {!e.current&&<input className="inp" style={{flex:1}} value={e.endDate} onChange={x=>upE(e.id,'endDate',x.target.value)} placeholder="End date"/>}
                  </div>
                  <label className="lbl" style={{marginBottom:5}}>Bullets <span style={{color:'#6366f1',textTransform:'none',letterSpacing:'normal',fontWeight:600}}>— verb + metric</span></label>
                  {e.bullets.map((b,bi)=>(
                    <div key={bi} style={{display:'flex',gap:4,marginBottom:4}}>
                      <textarea className="inp" rows={2} value={b} onChange={x=>upBul(e.id,bi,x.target.value)} placeholder="Led X initiative reducing Y by 40% for 500K+ users" style={{flex:1,fontSize:12}}/>
                      <button className="bI" onClick={()=>rmBul(e.id,bi)} style={{alignSelf:'flex-start',marginTop:1}}>✕</button>
                    </div>
                  ))}
                  <button className="bS" onClick={()=>addBul(e.id)} style={{width:'100%',justifyContent:'center',fontSize:11,marginTop:2}}>+ Add bullet</button>
                </div>
              ))}
              <button className="bS" onClick={addExp} style={{width:'100%',justifyContent:'center'}}>+ Add Work Experience</button>
            </Coll>

            <Coll title="Education" icon="🎓" badge={data.education.length}>
              {data.education.map((e,i)=>(
                <div key={e.id} className="ic">
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <span style={{fontSize:11,fontWeight:600,color:'#64748b'}}>{e.school||`School ${i+1}`}</span>
                    <button className="bI" onClick={()=>rmEdu(e.id)}>🗑</button>
                  </div>
                  <div className="g2">
                    <F label="School"><input className="inp" value={e.school} onChange={x=>upEd(e.id,'school',x.target.value)} placeholder="MIT"/></F>
                    <F label="Degree"><input className="inp" value={e.degree} onChange={x=>upEd(e.id,'degree',x.target.value)} placeholder="B.S. Computer Science"/></F>
                    <F label="Start Year"><input className="inp" value={e.startDate} onChange={x=>upEd(e.id,'startDate',x.target.value)} placeholder="2016"/></F>
                    <F label="End Year"><input className="inp" value={e.endDate} onChange={x=>upEd(e.id,'endDate',x.target.value)} placeholder="2020"/></F>
                    <F label="GPA"><input className="inp" value={e.gpa} onChange={x=>upEd(e.id,'gpa',x.target.value)} placeholder="3.8"/></F>
                    <F label="Field"><input className="inp" value={e.field} onChange={x=>upEd(e.id,'field',x.target.value)} placeholder="(optional)"/></F>
                  </div>
                </div>
              ))}
              <button className="bS" onClick={addEdu} style={{width:'100%',justifyContent:'center'}}>+ Add Education</button>
            </Coll>

            <Coll title="Skills" icon="⚡" badge={data.skills.length}>
              <div style={{fontSize:11,color:'#4338ca',marginBottom:9,padding:'7px 9px',background:'#eef2ff',border:'1px solid #c7d2fe',borderRadius:7,lineHeight:1.5}}>💡 Use exact keywords from job postings for ATS</div>
              {data.skills.map((s,i)=>(
                <div key={s.id} className="ic">
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                    <span style={{fontSize:11,fontWeight:600,color:'#64748b'}}>Group {i+1}</span>
                    <button className="bI" onClick={()=>rmSk(s.id)}>🗑</button>
                  </div>
                  <F label="Category"><input className="inp" value={s.category} onChange={e=>upSk(s.id,'category',e.target.value)} placeholder="Technical, Tools, Soft Skills…"/></F>
                  <F label="Skills (comma-separated)"><textarea className="inp" rows={2} value={s.items} onChange={e=>upSk(s.id,'items',e.target.value)} placeholder="React, Node.js, Python, AWS…"/></F>
                </div>
              ))}
              <button className="bS" onClick={addSk} style={{width:'100%',justifyContent:'center'}}>+ Add Skill Group</button>
            </Coll>

            <Coll title="Certifications" icon="🏅" badge={data.certifications.length}>
              {data.certifications.map(c=>(
                <div key={c.id} className="ic">
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                    <span style={{fontSize:11,fontWeight:600,color:'#64748b'}}>{c.name||'Cert'}</span>
                    <button className="bI" onClick={()=>rmCe(c.id)}>🗑</button>
                  </div>
                  <div className="g2">
                    <F label="Name"><input className="inp" value={c.name} onChange={e=>upCe(c.id,'name',e.target.value)} placeholder="AWS Solutions Architect"/></F>
                    <F label="Issued By"><input className="inp" value={c.issuer} onChange={e=>upCe(c.id,'issuer',e.target.value)} placeholder="Amazon"/></F>
                    <F label="Date"><input className="inp" value={c.date} onChange={e=>upCe(c.id,'date',e.target.value)} placeholder="Apr 2023"/></F>
                  </div>
                </div>
              ))}
              <button className="bS" onClick={addCe} style={{width:'100%',justifyContent:'center'}}>+ Add Certification</button>
            </Coll>

            <Coll title="Languages" icon="🌐" badge={data.languages.length}>
              {data.languages.map(l=>(
                <div key={l.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:6,marginBottom:7,alignItems:'flex-end'}}>
                  <F label="Language"><input className="inp" value={l.language} onChange={e=>upLa(l.id,'language',e.target.value)} placeholder="Spanish"/></F>
                  <F label="Level"><select className="inp" value={l.proficiency} onChange={e=>upLa(l.id,'proficiency',e.target.value)}><option value="">Level…</option>{['Native','Fluent','Professional','Intermediate','Basic'].map(v=><option key={v}>{v}</option>)}</select></F>
                  <button className="bI" onClick={()=>rmLa(l.id)} style={{marginBottom:8}}>🗑</button>
                </div>
              ))}
              <button className="bS" onClick={addLa} style={{width:'100%',justifyContent:'center'}}>+ Add Language</button>
            </Coll>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'#dde3ed'}}>
          <div style={{background:'#fff',borderBottom:'1.5px solid #f1f5f9',padding:'9px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
            <div style={{display:'flex',gap:6}}>
              <button className={`tab${tab==='preview'?' on':''}`} onClick={()=>setTab('preview')}>👁 Preview</button>
              <button className={`tab${tab==='ats'?' on':''}`} onClick={()=>setTab('ats')}>
                📊 ATS <span style={{fontWeight:800,color:sc.band.c,marginLeft:2}}>{sc.score}</span>
              </button>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span style={{fontSize:11,color:'#94a3b8',display:'flex',alignItems:'center',gap:4}}>
                {curT?.name}
                <span style={{fontSize:9}}>{curT?.ats===5?'★★★★★':curT?.ats===4?'★★★★☆':'★★★☆☆'}</span>
              </span>
              <button className="bP" onClick={()=>doPrint(data.personal.name)} style={{fontSize:11.5}}>↓ Download PDF</button>
            </div>
          </div>

          {tab==='preview'&&(
            <div style={{flex:1,overflowY:'auto',padding:'20px',display:'flex',justifyContent:'center',alignItems:'flex-start'}}>
              <div id="rv" style={{width:'210mm',background:'#fff',boxShadow:'0 4px 24px rgba(0,0,0,.14)',flexShrink:0}}>
                <Tpl d={data} sc={sections}/>
              </div>
            </div>
          )}
          {tab==='ats'&&<div style={{flex:1,overflowY:'auto'}}><ATSPanel data={data}/></div>}
        </div>
      </div>
    </>
  );
}