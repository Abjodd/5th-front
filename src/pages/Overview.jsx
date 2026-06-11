import { useState, useEffect, useMemo } from "react";
import { useApp, DARK, LIGHT } from "../context";

const Dot = ({color,sz=6}) => <span style={{width:sz,height:sz,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}}/>;

const ROLES = {
  founder: { label:"Founder",  desc:"Scale & efficiency decisions" },
  manager: { label:"Manager",  desc:"Optimize campaigns" },
  content: { label:"Content",  desc:"Creatives & formats" },
};

const SERVICES = [
  { id:"all",        label:"Overall",    icon:"⊕" },
  { id:"influencer", label:"Influencer", icon:"◎" },
  { id:"aeo",        label:"AEO",        icon:"⌕" },
  { id:"offline",    label:"Offline",    icon:"▣" },
  { id:"ads",        label:"Ads",        icon:"⟡" },
];

const CREATOR_FILTERS = {
  age:    { label:"Age",     options:["18-24","25-34","35-44","45+"] },
  niche:  { label:"Niche",   options:["Food","Lifestyle","Family","Travel","Fitness"] },
  size:   { label:"Size",    options:["Nano","Micro","Macro","Mega"] },
  gender: { label:"Gender",  options:["Female","Male","Other"] },
  region: { label:"Region",  options:["North","South","East","West","North-East","Central"] },
  lang:   { label:"Language",options:["Hindi","English","Tamil","Telugu","Marathi","Kannada","Bengali"] },
};

/* ═══ CREATOR-LEVEL DATA — used to derive all metrics ═══ */
/* Each creator has all variables so filters can cascade through */
const CREATORS = [
  { id:1,  name:"South Foodie",      size:"Macro", niche:"Food",      age:"25-34", gender:"Female", region:"South",     lang:"Tamil",   er:7.2, reach:1200000, engagements:86400, cost:85000 },
  { id:2,  name:"Anjali Kitchen",    size:"Macro", niche:"Food",      age:"25-34", gender:"Female", region:"West",      lang:"Hindi",   er:4.2, reach:820000,  engagements:34440, cost:65000 },
  { id:3,  name:"Mumbai Munchies",   size:"Micro", niche:"Food",      age:"18-24", gender:"Male",   region:"West",      lang:"Marathi", er:7.2, reach:95000,   engagements:6840,  cost:18000 },
  { id:4,  name:"Kerala Food Tales", size:"Macro", niche:"Food",      age:"25-34", gender:"Female", region:"South",     lang:"Malayalam",er:6.1,reach:290000,  engagements:17690, cost:42000 },
  { id:5,  name:"Chennai Bites",     size:"Micro", niche:"Food",      age:"25-34", gender:"Male",   region:"South",     lang:"Tamil",   er:6.4, reach:78000,   engagements:4992,  cost:15000 },
  { id:6,  name:"Delhi Eats",        size:"Macro", niche:"Food",      age:"35-44", gender:"Male",   region:"North",     lang:"Hindi",   er:3.8, reach:450000,  engagements:17100, cost:58000 },
  { id:7,  name:"Lifestyle Priya",   size:"Mega",  niche:"Lifestyle", age:"25-34", gender:"Female", region:"West",      lang:"English", er:2.1, reach:2800000, engagements:58800, cost:180000 },
  { id:8,  name:"Fit Life Guru",     size:"Macro", niche:"Fitness",   age:"25-34", gender:"Male",   region:"North",     lang:"Hindi",   er:5.4, reach:380000,  engagements:20520, cost:48000 },
  { id:9,  name:"Family Frolics",    size:"Micro", niche:"Family",    age:"35-44", gender:"Female", region:"South",     lang:"Telugu",  er:6.8, reach:82000,   engagements:5576,  cost:14000 },
  { id:10, name:"Travel Tales",      size:"Macro", niche:"Travel",    age:"25-34", gender:"Male",   region:"Central",   lang:"Hindi",   er:4.8, reach:520000,  engagements:24960, cost:62000 },
  { id:11, name:"Foodie Hyderabad",  size:"Micro", niche:"Food",      age:"25-34", gender:"Female", region:"South",     lang:"Telugu",  er:6.8, reach:68000,   engagements:4624,  cost:13000 },
  { id:12, name:"Nano Nibble",       size:"Nano",  niche:"Food",      age:"18-24", gender:"Female", region:"South",     lang:"Kannada", er:8.2, reach:8500,    engagements:697,   cost:6000 },
  { id:13, name:"Tiny Tastes",       size:"Nano",  niche:"Food",      age:"18-24", gender:"Male",   region:"West",      lang:"Marathi", er:7.6, reach:7200,    engagements:547,   cost:5500 },
  { id:14, name:"Snack Scouts",      size:"Nano",  niche:"Food",      age:"18-24", gender:"Female", region:"North",     lang:"Hindi",   er:7.9, reach:9100,    engagements:719,   cost:6200 },
  { id:15, name:"Bengali Biryani",   size:"Micro", niche:"Food",      age:"25-34", gender:"Female", region:"East",      lang:"Bengali", er:5.9, reach:62000,   engagements:3658,  cost:12000 },
  { id:16, name:"NorthEast Flavors", size:"Micro", niche:"Food",      age:"25-34", gender:"Male",   region:"North-East",lang:"English", er:6.2, reach:48000,   engagements:2976,  cost:11000 },
  { id:17, name:"Central Kitchen",   size:"Micro", niche:"Food",      age:"35-44", gender:"Female", region:"Central",   lang:"Hindi",   er:4.9, reach:72000,   engagements:3528,  cost:13500 },
  { id:18, name:"Lifestyle Lens",    size:"Macro", niche:"Lifestyle", age:"25-34", gender:"Female", region:"South",     lang:"English", er:3.9, reach:340000,  engagements:13260, cost:50000 },
];

/* Trend data — overall totals by month */
const TREND_DATA = [
  { month:"Nov", spend:28,  reach:8.2,  engagement:4.1 },
  { month:"Dec", spend:35,  reach:11.5, engagement:4.8 },
  { month:"Jan", spend:42,  reach:14.2, engagement:5.1 },
  { month:"Feb", spend:48,  reach:18.6, engagement:5.4 },
  { month:"Mar", spend:56,  reach:22.3, engagement:5.6 },
  { month:"Apr", spend:48.5,reach:26.5, engagement:5.2 },
];

const SPEND_SPLIT = [
  { label:"Influencer Marketing", value:30,   color:"#5B9BFF" },
  { label:"AEO",                  value:12,   color:"#4ADE80" },
  { label:"Performance Ads",      value:6.5,  color:"#F472B6" },
];

const CONTENT_TYPES = [
  { type:"Reel",       er:6.2, views:4200, count:48 },
  { type:"Carousel",   er:4.1, views:1800, count:22 },
  { type:"Story",      er:3.2, views:1200, count:65 },
  { type:"Long-form",  er:5.8, views:2900, count:8 },
  { type:"Blog / AEO", er:2.1, views:780,  count:14 },
];

const TOP_CAMPAIGNS_BASE = [
  { name:"Diwali Festive Push",      reach:8200000, er:5.1, phase:"production", service:"influencer" },
  { name:"Snack Box — Paid Ads",     reach:5800000, er:3.1, phase:"live",        service:"ads" },
  { name:"Delhi Street Food Collab", reach:4100000, er:7.2, phase:"live",        service:"influencer" },
  { name:"Brand Visibility Sprint",  reach:3600000, er:4.3, phase:"shortlist",   service:"aeo" },
  { name:"Mumbai Foodie Sprint",     reach:2800000, er:4.6, phase:"live",        service:"influencer" },
];

const ACTIVITY_FEED = [
  { id:1, title:"Kerala Food Tales approved", campaign:"Diwali Festive Push", time:"12 min ago", color:"green",  icon:"✓" },
  { id:2, title:"Draft video uploaded",        campaign:"Diwali Festive Push", time:"32 min ago", color:"pink",   icon:"⬆" },
  { id:3, title:"Reel #3 crossed 800K views",  campaign:"Diwali Festive Push", time:"1 hr ago",    color:"accent", icon:"▲" },
];

const PENDING_ACTIONS = [
  { id:1, type:"approval", title:"Foodie Hyderabad needs decision", campaign:"Diwali Festive Push",  priority:"high" },
  { id:2, type:"brief",    title:"Summer Launch brief sign-off",    campaign:"Summer Launch Teaser", priority:"medium" },
  { id:3, type:"content",  title:"Review draft video",               campaign:"Diwali Festive Push",  priority:"medium" },
];

const fmtL = (n) => n >= 100 ? `₹${(n/100).toFixed(1)}Cr` : `₹${n.toFixed(n < 10 ? 1 : 0)}L`;
const fmtNum = (n) => {
  if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n/1e3).toFixed(0)}K`;
  return n.toString();
};

/* ═══ STATS HELPERS ═══ */
function stats(values) {
  if (!values.length) return { avg:0, sum:0, stdDev:0 };
  const sum = values.reduce((s, v) => s + v, 0);
  const avg = sum / values.length;
  const variance = values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  return { avg, sum, stdDev };
}

function isOutlier(value, avg, stdDev) {
  if (stdDev === 0) return null;
  const z = (value - avg) / stdDev;
  if (z > 1.3) return "high";
  if (z < -1.3) return "low";
  return null;
}

/* ═══ DUAL AXIS LINE ═══ */
function DualAxisLineChart({ data, xKey, leftKey, rightKey, leftColor, rightColor, leftFmt, rightFmt, height=200, P }) {
  const W = 620, H = height;
  const pad = { t:18, r:50, b:24, l:50 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const leftMax = Math.max(...data.map(d => d[leftKey])) * 1.15 || 1;
  const rightMax = Math.max(...data.map(d => d[rightKey])) * 1.15 || 1;
  const xStep = plotW / (data.length - 1);
  const yLeft = (v) => pad.t + plotH - (v / leftMax) * plotH;
  const yRight = (v) => pad.t + plotH - (v / rightMax) * plotH;
  const leftPts = data.map((d, i) => `${pad.l + i * xStep},${yLeft(d[leftKey])}`).join(" ");
  const rightPts = data.map((d, i) => `${pad.l + i * xStep},${yRight(d[rightKey])}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height, display:"block" }}>
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <line key={i} x1={pad.l} y1={pad.t + plotH * (1-r)} x2={W - pad.r} y2={pad.t + plotH * (1-r)} stroke={P.border} strokeWidth="0.5"/>
      ))}
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <text key={"l"+i} x={pad.l - 6} y={pad.t + plotH * (1-r) + 3} textAnchor="end" fill={leftColor} fontSize="8" fontFamily="'Sora'" fontWeight="500">{leftFmt(leftMax * r)}</text>
      ))}
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <text key={"r"+i} x={W - pad.r + 6} y={pad.t + plotH * (1-r) + 3} textAnchor="start" fill={rightColor} fontSize="8" fontFamily="'Sora'" fontWeight="500">{rightFmt(rightMax * r)}</text>
      ))}
      <polyline points={leftPts} fill="none" stroke={leftColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points={rightPts} fill="none" stroke={rightColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((d, i) => (<g key={i}>
        <circle cx={pad.l + i * xStep} cy={yLeft(d[leftKey])} r="3.5" fill={P.bg} stroke={leftColor} strokeWidth="2"/>
        <circle cx={pad.l + i * xStep} cy={yRight(d[rightKey])} r="3.5" fill={P.bg} stroke={rightColor} strokeWidth="2"/>
      </g>))}
      {data.map((d, i) => (
        <text key={i} x={pad.l + i * xStep} y={H - 6} textAnchor="middle" fill={P.mute} fontSize="9" fontFamily="'Sora'">{d[xKey]}</text>
      ))}
    </svg>
  );
}

/* ═══ FUNNEL ═══ */
function Funnel({ data, P }) {
  const maxValue = data[0]?.raw || 1;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {data.map((s, i) => {
        const width = (s.raw / maxValue) * 100;
        const dropPct = i > 0 && data[i-1].raw > 0 ? (((data[i-1].raw - s.raw) / data[i-1].raw) * 100).toFixed(1) : null;
        return (
          <div key={s.stage} className="au" style={{ animationDelay:`${i*60}ms` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:10.5, color:P.text, fontWeight:500 }}>{s.stage}</span>
                {dropPct && (<span style={{ fontSize:9, color:dropPct > 80 ? P.red : dropPct > 50 ? P.amber : P.sub, fontWeight:600 }}>▼ {dropPct}% drop</span>)}
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:s.color, fontFamily:"'Sora'" }}>{s.value}</span>
            </div>
            <div style={{ height:22, background:P.barBg, borderRadius:5, overflow:"hidden" }}>
              <div style={{
                width:`${width}%`, height:"100%", background:s.color,
                borderRadius:5, transition:"width 0.8s cubic-bezier(.25,.46,.45,.94)",
                display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:8,
              }}>
                <span style={{ fontSize:8.5, color:"#fff", fontWeight:600, opacity:width > 15 ? 1 : 0 }}>{((s.raw / maxValue) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ DONUT ═══ */
function Donut({ data, size=130, centerValue, centerLabel, P }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  let acc = 0;
  const stops = data.map((d) => {
    const start = (acc / total) * 100;
    acc += d.value;
    const end = (acc / total) * 100;
    return `${d.color} ${start}% ${end}%`;
  }).join(", ");
  return (
    <div style={{ position:"relative", width:size, height:size, margin:"0 auto" }}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:`conic-gradient(${stops})` }}/>
      <div style={{
        position:"absolute", inset:size*0.22, borderRadius:"50%",
        background:P.surface, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        {centerValue && <span style={{ fontSize:size*0.16, fontWeight:700, color:P.text, fontFamily:"'Sora'", lineHeight:1 }}>{centerValue}</span>}
        {centerLabel && <span style={{ fontSize:size*0.07, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginTop:3 }}>{centerLabel}</span>}
      </div>
    </div>
  );
}

function KPICard({ label, value, sublabel, trend, color, P }) {
  return (
    <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:11, padding:"14px 16px" }}>
      <div style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600, marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:700, color, fontFamily:"'Sora'", lineHeight:1 }}>{value}</div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6, flexWrap:"wrap" }}>
        {trend !== undefined && (<span style={{ fontSize:9.5, fontWeight:600, color:trend > 0 ? P.green : P.red }}>{trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%</span>)}
        {sublabel && <span style={{ fontSize:9, color:P.mute }}>{sublabel}</span>}
      </div>
    </div>
  );
}

function InsightCard({ ins, P }) {
  const colorMap = {
    scale:       { c:P.green,  label:"SCALE" },
    investigate: { c:P.accent, label:"INVESTIGATE" },
    optimize:    { c:P.amber,  label:"OPTIMIZE" },
    pause:       { c:P.red,    label:"PAUSE" },
  };
  const cfg = colorMap[ins.type];
  return (
    <div style={{
      padding:"11px 13px", borderRadius:9,
      background:P.surface, border:`1px solid ${cfg.c}20`,
      borderLeft:`3px solid ${cfg.c}`,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
        <span style={{ fontSize:8, color:cfg.c, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", padding:"2px 7px", background:`${cfg.c}12`, borderRadius:3 }}>{cfg.label}</span>
        <span style={{ fontSize:8, color:P.mute, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>· {ins.category}</span>
      </div>
      <div style={{ fontSize:10.5, color:P.text, lineHeight:1.55, marginBottom:6 }}>{ins.msg}</div>
      <div style={{ display:"flex", gap:14, paddingTop:6, borderTop:`1px solid ${P.border}` }}>
        <div>
          <div style={{ fontSize:7.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Metric</div>
          <div style={{ fontSize:10, color:cfg.c, fontWeight:700, marginTop:1, fontFamily:"'Sora'" }}>{ins.metric}</div>
        </div>
        <div>
          <div style={{ fontSize:7.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Delta</div>
          <div style={{ fontSize:10, color:P.text, fontWeight:600, marginTop:1 }}>{ins.delta}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══ BREAKDOWN CARD (with outlier flags, avg, sum, %) ═══ */
function BreakdownCard({ group, stats: grpStats, total, totalReach, erAvg, erOutlier, P, showBarReach }) {
  const erPctOfAvg = erAvg > 0 ? ((grpStats.er / erAvg - 1) * 100).toFixed(0) : 0;
  const reachPct = totalReach > 0 ? ((grpStats.reach / totalReach) * 100).toFixed(1) : 0;
  const countPct = total > 0 ? ((grpStats.count / total) * 100).toFixed(0) : 0;

  const outlierBadge = erOutlier === "high"
    ? { c:P.green, label:"HIGH OUTLIER", sym:"▲" }
    : erOutlier === "low"
    ? { c:P.red, label:"LOW OUTLIER", sym:"▼" }
    : null;

  return (
    <div style={{
      padding:"12px 14px", borderRadius:9,
      background:P.bg,
      border:`1px solid ${erOutlier === "high" ? `${P.green}30` : erOutlier === "low" ? `${P.red}30` : P.border}`,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:3 }}>
        <div>
          <div style={{ fontSize:8.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>{group}</div>
          <div style={{ fontSize:17, fontWeight:700, color:P.text, marginTop:3, fontFamily:"'Sora'" }}>{grpStats.count} <span style={{ fontSize:9.5, color:P.mute, fontWeight:500 }}>· {countPct}%</span></div>
        </div>
        {outlierBadge && (
          <span style={{ fontSize:7.5, color:outlierBadge.c, background:`${outlierBadge.c}12`, padding:"2px 6px", borderRadius:3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", display:"flex", alignItems:"center", gap:3 }}>
            {outlierBadge.sym} {outlierBadge.label}
          </span>
        )}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:10 }}>
        {/* ER bar with delta vs avg */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
            <span style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>Engagement</span>
            <div style={{ display:"flex", gap:5, alignItems:"center" }}>
              <span style={{ fontSize:10, color:P.pink, fontWeight:700, fontFamily:"'Sora'" }}>{grpStats.er.toFixed(1)}%</span>
              {erPctOfAvg !== "0" && (
                <span style={{ fontSize:8, color:erPctOfAvg > 0 ? P.green : P.red, fontWeight:600 }}>
                  {erPctOfAvg > 0 ? "+" : ""}{erPctOfAvg}%
                </span>
              )}
            </div>
          </div>
          <div style={{ height:4, background:P.barBg, borderRadius:2, position:"relative" }}>
            <div style={{ width:`${Math.min((grpStats.er/10)*100, 100)}%`, height:"100%", background:P.pink, borderRadius:2, transition:"width 0.6s ease" }}/>
            {/* Avg marker */}
            {erAvg > 0 && (
              <div style={{
                position:"absolute", left:`${Math.min((erAvg/10)*100, 100)}%`, top:-2, bottom:-2,
                width:1, background:P.text, opacity:0.4,
              }}/>
            )}
          </div>
        </div>

        {/* Reach bar */}
        {showBarReach && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
              <span style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>Reach</span>
              <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                <span style={{ fontSize:10, color:P.accent, fontWeight:700 }}>{fmtNum(grpStats.reach)}</span>
                <span style={{ fontSize:8, color:P.sub }}>{reachPct}%</span>
              </div>
            </div>
            <div style={{ height:4, background:P.barBg, borderRadius:2 }}>
              <div style={{ width:`${reachPct}%`, height:"100%", background:P.accent, borderRadius:2, transition:"width 0.6s ease" }}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function OverviewDashboard() {
  const { P, theme, setTheme, setPage } = useApp();
  const [role, setRole] = useState("founder");
  const [service, setService] = useState("all");
  const [trendView, setTrendView] = useState("reach_spend");
  const [granularity, setGranularity] = useState("monthly");
  const [dateRange, setDateRange] = useState("last_6mo");
  const [filters, setFilters] = useState({ age:[], niche:[], size:[], gender:[], region:[], lang:[] });
  const [openFilter, setOpenFilter] = useState(null); // currently expanded filter group

  const toggleFilter = (group, val) => {
    setFilters(f => ({ ...f, [group]: f[group].includes(val) ? f[group].filter(x => x !== val) : [...f[group], val] }));
  };
  const clearFilter = (group) => setFilters(f => ({ ...f, [group]: [] }));
  const clearAllFilters = () => setFilters({ age:[], niche:[], size:[], gender:[], region:[], lang:[] });
  const totalFilters = Object.values(filters).reduce((s, arr) => s + arr.length, 0);

  /* ═══ FILTER CREATORS ═══ */
  const filteredCreators = useMemo(() => {
    return CREATORS.filter(c => {
      if (filters.age.length && !filters.age.includes(c.age)) return false;
      if (filters.niche.length && !filters.niche.includes(c.niche)) return false;
      if (filters.size.length && !filters.size.includes(c.size)) return false;
      if (filters.gender.length && !filters.gender.includes(c.gender)) return false;
      if (filters.region.length && !filters.region.includes(c.region)) return false;
      if (filters.lang.length && !filters.lang.includes(c.lang)) return false;
      return true;
    });
  }, [filters]);

  /* ═══ AGGREGATES ═══ */
  const aggregates = useMemo(() => {
    const list = filteredCreators;
    if (!list.length) return {
      totalReach:0, totalEngagements:0, totalCost:0, avgER:0, activeCount:0,
      costPerReach:0, costPerEngagement:0,
    };
    const totalReach = list.reduce((s, c) => s + c.reach, 0);
    const totalEngagements = list.reduce((s, c) => s + c.engagements, 0);
    const totalCost = list.reduce((s, c) => s + c.cost, 0);
    const avgER = list.reduce((s, c) => s + c.er, 0) / list.length;
    return {
      totalReach, totalEngagements, totalCost, avgER,
      activeCount: list.length,
      costPerReach: totalReach > 0 ? (totalCost / totalReach) * 1000000 : 0,
      costPerEngagement: totalEngagements > 0 ? totalCost / totalEngagements : 0,
    };
  }, [filteredCreators]);

  /* ═══ GROUP BY SIZE ═══ */
  const sizeBreakdown = useMemo(() => {
    const groups = {};
    ["Nano","Micro","Macro","Mega"].forEach(s => { groups[s] = { count:0, er:0, reach:0, erList:[] }; });
    filteredCreators.forEach(c => {
      groups[c.size].count++;
      groups[c.size].reach += c.reach;
      groups[c.size].erList.push(c.er);
    });
    Object.keys(groups).forEach(k => {
      groups[k].er = groups[k].erList.length ? groups[k].erList.reduce((s,v) => s+v, 0) / groups[k].erList.length : 0;
    });
    return groups;
  }, [filteredCreators]);

  /* ═══ GROUP BY NICHE (Category) ═══ */
  const nicheBreakdown = useMemo(() => {
    const groups = {};
    filteredCreators.forEach(c => {
      if (!groups[c.niche]) groups[c.niche] = { count:0, er:0, reach:0, erList:[] };
      groups[c.niche].count++;
      groups[c.niche].reach += c.reach;
      groups[c.niche].erList.push(c.er);
    });
    Object.keys(groups).forEach(k => {
      groups[k].er = groups[k].erList.length ? groups[k].erList.reduce((s,v) => s+v, 0) / groups[k].erList.length : 0;
    });
    return groups;
  }, [filteredCreators]);

  /* ═══ SIZE STATS (for outlier detection) ═══ */
  const sizeERStats = useMemo(() => {
    const erValues = Object.values(sizeBreakdown).filter(g => g.count > 0).map(g => g.er);
    return stats(erValues);
  }, [sizeBreakdown]);

  const nicheERStats = useMemo(() => {
    const erValues = Object.values(nicheBreakdown).filter(g => g.count > 0).map(g => g.er);
    return stats(erValues);
  }, [nicheBreakdown]);

  /* ═══ FUNNEL (derived from filtered creators) ═══ */
  const funnelData = useMemo(() => {
    const reach = aggregates.totalReach;
    const engagements = aggregates.totalEngagements;
    const impressions = reach * 2.58; // heuristic
    const clicks = reach * 0.069;     // heuristic ~ CTR
    return [
      { stage:"Impressions", value:fmtNum(impressions), raw:impressions, color:"#5B9BFF" },
      { stage:"Reach",       value:fmtNum(reach),       raw:reach,       color:"#6366F1" },
      { stage:"Engagements", value:fmtNum(engagements), raw:engagements, color:"#F472B6" },
      { stage:"Clicks",      value:fmtNum(clicks),      raw:clicks,      color:"#4ADE80" },
    ];
  }, [aggregates]);

  /* ═══ TOP CAMPAIGNS (filtered by service) ═══ */
  const filteredCampaigns = useMemo(() => {
    if (service === "all") return TOP_CAMPAIGNS_BASE;
    return TOP_CAMPAIGNS_BASE.filter(c => c.service === service);
  }, [service]);

  /* ═══ DYNAMIC INSIGHTS (based on filters) ═══ */
  const insights = useMemo(() => {
    const list = [];
    // Size insight
    const sizeEntries = Object.entries(sizeBreakdown).filter(([,g]) => g.count > 0).sort((a,b) => b[1].er - a[1].er);
    if (sizeEntries.length >= 2) {
      const best = sizeEntries[0];
      const worst = sizeEntries[sizeEntries.length-1];
      list.push({
        type:"scale", category:"Creator Size",
        msg:`${best[0]} creators show ${best[1].er.toFixed(1)}% ER — outperforming ${worst[0]} (${worst[1].er.toFixed(1)}%). ${best[1].count} ${best[0]} creators in current pool.`,
        metric:`${best[1].er.toFixed(1)}% ER`,
        delta:`+${((best[1].er/worst[1].er - 1)*100).toFixed(0)}% vs ${worst[0]}`,
      });
    }
    // Niche insight
    const nicheEntries = Object.entries(nicheBreakdown).filter(([,g]) => g.count > 0).sort((a,b) => b[1].er - a[1].er);
    if (nicheEntries.length >= 2) {
      const top = nicheEntries[0];
      list.push({
        type:"investigate", category:"Niche",
        msg:`${top[0]} niche shows strongest ER (${top[1].er.toFixed(1)}%) with ${top[1].count} creators. Reach total: ${fmtNum(top[1].reach)}.`,
        metric:`${top[1].er.toFixed(1)}% ER`,
        delta:`Top of ${nicheEntries.length} niches`,
      });
    }
    // Outlier
    const outlierSize = Object.entries(sizeBreakdown).find(([,g]) => g.count > 0 && isOutlier(g.er, sizeERStats.avg, sizeERStats.stdDev));
    if (outlierSize) {
      const [name, data] = outlierSize;
      const type = isOutlier(data.er, sizeERStats.avg, sizeERStats.stdDev);
      list.push({
        type: type === "high" ? "scale" : "pause",
        category:"Outlier Detection",
        msg:`${name} tier flagged as ${type === "high" ? "high" : "low"} outlier: ${data.er.toFixed(1)}% ER vs ${sizeERStats.avg.toFixed(1)}% segment average.`,
        metric:`${data.er.toFixed(1)}% ER`,
        delta:`${type === "high" ? "+" : ""}${((data.er/sizeERStats.avg - 1)*100).toFixed(0)}% vs avg`,
      });
    }
    // General cost efficiency
    list.push({
      type:"optimize", category:"Efficiency",
      msg:`Cost per 1M Reach currently at ₹${(aggregates.costPerReach/100000).toFixed(2)}L across ${aggregates.activeCount} creators. Cost per Engagement: ₹${aggregates.costPerEngagement.toFixed(0)}.`,
      metric:`₹${(aggregates.costPerReach/100000).toFixed(1)}L`,
      delta:`per 1M reach`,
    });
    // Filter-aware message
    if (totalFilters > 0) {
      list.push({
        type:"investigate", category:"Current Filter",
        msg:`Showing ${aggregates.activeCount} of ${CREATORS.length} creators (${Math.round(aggregates.activeCount/CREATORS.length*100)}%). Filter narrows the data — compare with unfiltered view.`,
        metric:`${aggregates.activeCount} creators`,
        delta:`${totalFilters} filter${totalFilters > 1 ? "s" : ""} active`,
      });
    }
    return list;
  }, [sizeBreakdown, nicheBreakdown, sizeERStats, aggregates, totalFilters]);

  const showFounder = role === "founder";
  const showManager = role === "manager";
  const showContent = role === "content";
  const showCreatorFilters = service === "all" || service === "influencer";

  const totalCreatorsInFilter = aggregates.activeCount;

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", background:P.bg, color:P.text, minHeight:"100vh" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 28px" }}>
        <header style={{ padding:"24px 0 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
            <div>
              <p style={{ fontSize:11, color:P.sub, margin:"0 0 3px" }}>Good afternoon, Rahul 👋</p>
              <h1 style={{ fontFamily:"'Newsreader',serif", fontSize:30, fontWeight:400, color:P.white, margin:0, fontStyle:"italic" }}>Overview</h1>
            </div>
            <div style={{ display:"flex", gap:3, background:P.surface, border:`1px solid ${P.border}`, borderRadius:6, padding:2 }}>
              {Object.entries(ROLES).map(([k, r]) => (
                <button key={k} onClick={() => setRole(k)} style={{
                  padding:"5px 12px", borderRadius:4, fontSize:10, fontWeight:500,
                  background: role === k ? `${P.accent}12` : "transparent",
                  border:"none", color: role === k ? P.accent : P.mute,
                  cursor:"pointer", fontFamily:"'Sora'",
                }}>{r.label}</button>
              ))}
            </div>
          </div>
        </header>

        {/* Service Tabs */}
        <div style={{ display:"flex", gap:3, marginBottom:10, background:P.surface, borderRadius:9, border:`1px solid ${P.border}`, padding:4, width:"fit-content" }}>
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => setService(s.id)} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"7px 14px", borderRadius:6, fontSize:11, fontWeight:500,
              background: service === s.id ? `${P.accent}12` : "transparent",
              border:"none", color: service === s.id ? P.accent : P.sub,
              cursor:"pointer", fontFamily:"'Sora'", transition:"all 0.15s",
            }}>
              <span style={{ fontSize:13, opacity:0.8 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Global filters */}
        <div style={{
          display:"flex", gap:8, alignItems:"center", flexWrap:"wrap",
          padding:"8px 14px", marginBottom:10,
          background:P.surface, borderRadius:8, border:`1px solid ${P.border}`,
        }}>
          <span style={{ fontSize:8.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Period</span>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ padding:"4px 9px", borderRadius:5, fontSize:9.5, fontWeight:500, background:P.bg, border:`1px solid ${P.border}`, color:P.text, cursor:"pointer", fontFamily:"'Sora'", outline:"none" }}>
            <option value="last_7d">Last 7 days</option>
            <option value="last_30d">Last 30 days</option>
            <option value="last_3mo">Last 3 months</option>
            <option value="last_6mo">Last 6 months</option>
            <option value="ytd">Year to Date</option>
          </select>
          <div style={{ width:1, height:16, background:P.border }}/>
          <div style={{ display:"flex", gap:2 }}>
            {["daily","weekly","monthly"].map(g => (
              <button key={g} onClick={() => setGranularity(g)} style={{
                padding:"3px 9px", borderRadius:4, fontSize:9, fontWeight:500,
                background: granularity === g ? `${P.accent}12` : "transparent",
                border:`1px solid ${granularity === g ? `${P.accent}25` : P.border}`,
                color: granularity === g ? P.accent : P.mute,
                cursor:"pointer", fontFamily:"'Sora'", textTransform:"capitalize",
              }}>{g}</button>
            ))}
          </div>
          <span style={{ marginLeft:"auto", fontSize:9, color:P.mute, fontStyle:"italic" }}>
            <b style={{ color:P.accent }}>{ROLES[role].label}</b> view · <b style={{ color:P.accent }}>{SERVICES.find(s => s.id === service).label}</b>
          </span>
        </div>

        {/* ═══ CREATOR FILTERS — NEW INLINE EXPANDABLE DESIGN ═══ */}
        {showCreatorFilters && (
          <div className="au" style={{
            marginBottom:14, background:P.surface, borderRadius:9,
            border:`1px solid ${totalFilters > 0 ? `${P.accent}20` : P.border}`,
            overflow:"hidden",
          }}>
            {/* Top row: filter chips */}
            <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", padding:"10px 14px" }}>
              <span style={{ fontSize:8.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginRight:2 }}>Filter Creators</span>
              {Object.entries(CREATOR_FILTERS).map(([key, cfg]) => {
                const selected = filters[key];
                const isOpen = openFilter === key;
                const hasSel = selected.length > 0;
                return (
                  <button key={key} onClick={() => setOpenFilter(isOpen ? null : key)} style={{
                    display:"flex", alignItems:"center", gap:5,
                    padding:"5px 11px", borderRadius:6, fontSize:10, fontWeight:500,
                    background: isOpen ? `${P.accent}15` : hasSel ? `${P.accent}08` : P.bg,
                    border:`1px solid ${isOpen || hasSel ? `${P.accent}30` : P.border}`,
                    color: isOpen || hasSel ? P.accent : P.sub,
                    cursor:"pointer", fontFamily:"'Sora'",
                    transition:"all 0.15s",
                  }}>
                    {cfg.label}
                    {hasSel && <span style={{ fontSize:8, fontWeight:700, background:`${P.accent}25`, color:P.accent, padding:"1px 5px", borderRadius:3 }}>{selected.length}</span>}
                    <span style={{ fontSize:8, opacity:0.7, transition:"transform 0.2s", transform:isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                  </button>
                );
              })}
              {totalFilters > 0 && (
                <button onClick={clearAllFilters} style={{
                  marginLeft:"auto", padding:"5px 10px", borderRadius:5,
                  fontSize:9.5, fontWeight:500, background:`${P.red}08`,
                  border:`1px solid ${P.red}20`, color:P.red,
                  cursor:"pointer", fontFamily:"'Sora'",
                }}>✕ Clear all ({totalFilters})</button>
              )}
            </div>

            {/* Expanded filter panel — takes full width, no positioning issues */}
            {openFilter && (
              <div className="au" style={{
                padding:"12px 14px", borderTop:`1px solid ${P.border}`,
                background:P.bg,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:10, color:P.text, fontWeight:600 }}>{CREATOR_FILTERS[openFilter].label}</span>
                    <span style={{ fontSize:8.5, color:P.mute }}>· Select one or more</span>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    {filters[openFilter].length > 0 && (
                      <button onClick={() => clearFilter(openFilter)} style={{
                        padding:"3px 8px", borderRadius:4, fontSize:8.5, fontWeight:500,
                        background:P.barBg, border:`1px solid ${P.border}`,
                        color:P.mute, cursor:"pointer", fontFamily:"'Sora'",
                      }}>Clear</button>
                    )}
                    <button onClick={() => setOpenFilter(null)} style={{
                      padding:"3px 8px", borderRadius:4, fontSize:8.5, fontWeight:500,
                      background:P.barBg, border:`1px solid ${P.border}`,
                      color:P.sub, cursor:"pointer", fontFamily:"'Sora'",
                    }}>Done</button>
                  </div>
                </div>

                {/* Checkable options as chips */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {CREATOR_FILTERS[openFilter].options.map(opt => {
                    const isSel = filters[openFilter].includes(opt);
                    return (
                      <button key={opt} onClick={() => toggleFilter(openFilter, opt)} style={{
                        display:"flex", alignItems:"center", gap:5,
                        padding:"5px 11px", borderRadius:5, fontSize:10, fontWeight:500,
                        background: isSel ? `${P.accent}15` : P.surface,
                        border:`1.5px solid ${isSel ? P.accent : P.border}`,
                        color: isSel ? P.accent : P.text,
                        cursor:"pointer", fontFamily:"'Sora'",
                        transition:"all 0.15s",
                      }}>
                        <span style={{
                          width:12, height:12, borderRadius:3,
                          border:`1.5px solid ${isSel ? P.accent : P.mute}`,
                          background:isSel ? P.accent : "transparent",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:"#050A18", fontSize:9, fontWeight:700,
                          flexShrink:0,
                        }}>{isSel ? "✓" : ""}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter summary strip — always visible when filters active */}
            {totalFilters > 0 && !openFilter && (
              <div style={{
                padding:"7px 14px", borderTop:`1px solid ${P.border}`,
                background:`${P.accent}05`, display:"flex",
                justifyContent:"space-between", alignItems:"center", gap:8,
              }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", fontSize:9.5 }}>
                  <span style={{ color:P.accent, fontWeight:600 }}>✓ Filtered</span>
                  <span style={{ color:P.sub }}>Showing {totalCreatorsInFilter} of {CREATORS.length} creators</span>
                </div>
                <span style={{ fontSize:9, color:P.mute, fontStyle:"italic" }}>All charts below reflect this filter</span>
              </div>
            )}
          </div>
        )}

        {/* KPIs — NOW derived from filteredCreators */}
        <div className="au" style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10, marginBottom:14 }}>
          {showFounder && (<>
            <KPICard label="Active Creators" value={totalCreatorsInFilter} sublabel={totalFilters > 0 ? `of ${CREATORS.length}` : "All creators"} color={P.accent} P={P}/>
            <KPICard label="Total Reach" value={fmtNum(aggregates.totalReach)} sublabel="From filter" trend={totalFilters === 0 ? 18 : undefined} color={P.accent} P={P}/>
            <KPICard label="Avg Engagement Rate" value={`${aggregates.avgER.toFixed(1)}%`} sublabel={aggregates.avgER > 5 ? "Above industry avg" : "Below industry avg"} color={P.pink} P={P}/>
            <KPICard label="Total Spend" value={fmtL(aggregates.totalCost/100000)} sublabel="Creator fees" color={P.amber} P={P}/>
            <KPICard label="Cost per 1M Reach" value={`₹${(aggregates.costPerReach/100000).toFixed(2)}L`} sublabel="Efficiency" color={P.green} P={P}/>
          </>)}
          {showManager && (<>
            <KPICard label="Reach" value={fmtNum(aggregates.totalReach)} color={P.accent} P={P}/>
            <KPICard label="Engagements" value={fmtNum(aggregates.totalEngagements)} color={P.accent} P={P}/>
            <KPICard label="Engagement Rate" value={`${aggregates.avgER.toFixed(1)}%`} color={P.pink} P={P}/>
            <KPICard label="Cost per Engagement" value={`₹${aggregates.costPerEngagement.toFixed(0)}`} color={P.green} P={P}/>
            <KPICard label="Spend" value={fmtL(aggregates.totalCost/100000)} color={P.amber} P={P}/>
          </>)}
          {showContent && (<>
            <KPICard label="Avg Engagement Rate" value={`${aggregates.avgER.toFixed(1)}%`} sublabel="Aggregated" color={P.pink} P={P}/>
            <KPICard label="Total Engagements" value={fmtNum(aggregates.totalEngagements)} sublabel="likes+comments+saves" color={P.accent} P={P}/>
            <KPICard label="Video Completion" value="68%" sublabel="Watched to end" color={P.green} P={P}/>
            <KPICard label="Avg Time on Page" value="2:14" sublabel="AEO / Blog" color={P.amber} P={P}/>
            <KPICard label="Top Content Type" value="Reels" sublabel="6.2% ER · 48 pieces" color={P.pink} P={P}/>
          </>)}
        </div>

        {/* Trend */}
        <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div>
              <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:0, fontStyle:"italic" }}>{trendView === "reach_spend" ? "Reach vs Spend" : "Engagement vs Spend"}</h2>
              <p style={{ fontSize:10, color:P.sub, margin:"2px 0 0" }}>Dual-axis · {granularity} view · overall trend</p>
            </div>
            <div style={{ display:"flex", background:P.barBg, borderRadius:5, padding:2 }}>
              {[["reach_spend","Reach vs Spend"],["eng_spend","Engagement vs Spend"]].map(([k,l]) => (
                <button key={k} onClick={() => setTrendView(k)} style={{
                  padding:"4px 10px", borderRadius:3, fontSize:9, fontWeight:500,
                  background:trendView === k ? P.surface : "transparent",
                  border:"none", color:trendView === k ? P.accent : P.mute,
                  cursor:"pointer", fontFamily:"'Sora'",
                }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:16, marginBottom:4, fontSize:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:14, height:2, background:trendView === "reach_spend" ? P.accent : P.pink, borderRadius:1 }}/>
              <span style={{ color:P.sub }}>{trendView === "reach_spend" ? "Reach (M) · left axis" : "Engagement % · left axis"}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:14, height:2, background:P.amber, borderRadius:1 }}/>
              <span style={{ color:P.sub }}>Spend (₹L) · right axis</span>
            </div>
          </div>
          <DualAxisLineChart data={TREND_DATA} xKey="month"
            leftKey={trendView === "reach_spend" ? "reach" : "engagement"} rightKey="spend"
            leftColor={trendView === "reach_spend" ? P.accent : P.pink} rightColor={P.amber}
            leftFmt={(v) => trendView === "reach_spend" ? `${v.toFixed(1)}M` : `${v.toFixed(1)}%`}
            rightFmt={(v) => `₹${v.toFixed(0)}L`} P={P}/>
        </div>

        {/* Funnel + Spend Split */}
        <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:12, marginBottom:14 }}>
          <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 18px" }}>
            <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:"0 0 4px", fontStyle:"italic" }}>Funnel</h2>
            <p style={{ fontSize:10, color:P.sub, margin:"0 0 14px" }}>Exposure → Engagement → Click · based on filtered creators</p>
            <Funnel data={funnelData} P={P}/>
          </div>
          <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 18px" }}>
            <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:"0 0 4px", fontStyle:"italic" }}>Spend Split</h2>
            <p style={{ fontSize:10, color:P.sub, margin:"0 0 14px" }}>By service · YTD</p>
            <div style={{ padding:"8px 0" }}>
              <Donut data={SPEND_SPLIT} size={120} centerValue={fmtL(48.5)} centerLabel="Total" P={P}/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:10 }}>
              {SPEND_SPLIT.map(s => (
                <div key={s.label} style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span style={{ width:8, height:8, borderRadius:2, background:s.color, flexShrink:0 }}/>
                  <span style={{ fontSize:10, color:P.text, flex:1 }}>{s.label}</span>
                  <span style={{ fontSize:10, fontWeight:600, color:P.text, fontFamily:"'Sora'" }}>₹{s.value}L</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Auto Insights */}
        <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <span style={{ fontSize:16 }}>✨</span>
            <div style={{ flex:1 }}>
              <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:0, fontStyle:"italic" }}>Auto Insights</h2>
              <p style={{ fontSize:10, color:P.sub, margin:"2px 0 0" }}>Pattern detection · {totalFilters > 0 ? "based on your filter" : "across all creators"}</p>
            </div>
            <span style={{ fontSize:8.5, color:P.mute, fontStyle:"italic" }}>Pattern engine · more coming soon</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {insights.length > 0 ? insights.map((ins, i) => (
              <div key={i} className="au" style={{ animationDelay:`${i*40}ms` }}>
                <InsightCard ins={ins} P={P}/>
              </div>
            )) : (
              <div style={{ gridColumn:"1 / -1", textAlign:"center", padding:"20px", color:P.mute, fontSize:11 }}>
                No insights match your filter. Try widening the scope.
              </div>
            )}
          </div>
        </div>

        {/* ═══ CREATOR CATEGORY PERFORMANCE (NEW) ═══ */}
        {(service === "influencer" || service === "all") && (
          <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:0, fontStyle:"italic" }}>Creator Category Performance</h2>
                <p style={{ fontSize:10, color:P.sub, margin:"2px 0 0" }}>Breakdown by niche · outliers flagged · {Object.keys(nicheBreakdown).length} categories</p>
              </div>
              {/* Stats strip */}
              <div style={{ display:"flex", gap:12, background:P.bg, padding:"6px 12px", borderRadius:7, border:`1px solid ${P.border}` }}>
                <div><div style={{ fontSize:7.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Sum (Creators)</div><div style={{ fontSize:12, fontWeight:700, color:P.text, marginTop:1, fontFamily:"'Sora'" }}>{totalCreatorsInFilter}</div></div>
                <div><div style={{ fontSize:7.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Avg ER</div><div style={{ fontSize:12, fontWeight:700, color:P.pink, marginTop:1, fontFamily:"'Sora'" }}>{nicheERStats.avg.toFixed(1)}%</div></div>
                <div><div style={{ fontSize:7.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Sum (Reach)</div><div style={{ fontSize:12, fontWeight:700, color:P.accent, marginTop:1, fontFamily:"'Sora'" }}>{fmtNum(aggregates.totalReach)}</div></div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:10 }}>
              {Object.entries(nicheBreakdown).sort((a,b) => b[1].count - a[1].count).map(([k, data], i) => {
                const outlier = isOutlier(data.er, nicheERStats.avg, nicheERStats.stdDev);
                return (
                  <div key={k} className="au" style={{ animationDelay:`${i*40}ms` }}>
                    <BreakdownCard group={k} stats={data} total={totalCreatorsInFilter} totalReach={aggregates.totalReach} erAvg={nicheERStats.avg} erOutlier={outlier} P={P} showBarReach/>
                  </div>
                );
              })}
              {Object.keys(nicheBreakdown).length === 0 && (
                <div style={{ gridColumn:"1 / -1", textAlign:"center", padding:"20px", color:P.mute, fontSize:10.5 }}>
                  No creators match current filters
                </div>
              )}
            </div>

            {/* Legend */}
            <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${P.border}`, display:"flex", gap:14, flexWrap:"wrap", fontSize:9.5 }}>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:1, height:10, background:P.text, opacity:0.4 }}/>
                <span style={{ color:P.sub }}>Avg line on ER bars</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:9, color:P.green, fontWeight:700 }}>▲</span>
                <span style={{ color:P.sub }}>High outlier (&gt;1.3σ above avg)</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:9, color:P.red, fontWeight:700 }}>▼</span>
                <span style={{ color:P.sub }}>Low outlier (&gt;1.3σ below avg)</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CREATOR SIZE PERFORMANCE (now with outliers + stats) ═══ */}
        {(service === "influencer" || service === "all") && (
          <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:0, fontStyle:"italic" }}>Creator Size Performance</h2>
                <p style={{ fontSize:10, color:P.sub, margin:"2px 0 0" }}>Engagement & reach by creator tier · outliers flagged</p>
              </div>
              <div style={{ display:"flex", gap:12, background:P.bg, padding:"6px 12px", borderRadius:7, border:`1px solid ${P.border}` }}>
                <div><div style={{ fontSize:7.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Sum (Creators)</div><div style={{ fontSize:12, fontWeight:700, color:P.text, marginTop:1, fontFamily:"'Sora'" }}>{totalCreatorsInFilter}</div></div>
                <div><div style={{ fontSize:7.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Avg ER</div><div style={{ fontSize:12, fontWeight:700, color:P.pink, marginTop:1, fontFamily:"'Sora'" }}>{sizeERStats.avg.toFixed(1)}%</div></div>
                <div><div style={{ fontSize:7.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Std Dev</div><div style={{ fontSize:12, fontWeight:700, color:P.amber, marginTop:1, fontFamily:"'Sora'" }}>±{sizeERStats.stdDev.toFixed(1)}</div></div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
              {Object.entries(sizeBreakdown).map(([k, data], i) => {
                const outlier = isOutlier(data.er, sizeERStats.avg, sizeERStats.stdDev);
                return (
                  <div key={k} className="au" style={{ animationDelay:`${i*40}ms` }}>
                    <BreakdownCard group={k} stats={data} total={totalCreatorsInFilter} totalReach={aggregates.totalReach} erAvg={sizeERStats.avg} erOutlier={outlier} P={P} showBarReach/>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Campaigns + Content */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 18px" }}>
            <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:"0 0 4px", fontStyle:"italic" }}>Top Campaigns</h2>
            <p style={{ fontSize:10, color:P.sub, margin:"0 0 12px" }}>Ranked by reach · {filteredCampaigns.length} campaigns</p>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {filteredCampaigns.map((c, i) => {
                const maxReach = Math.max(...filteredCampaigns.map(x => x.reach));
                return (
                  <div key={c.name} className="au" style={{
                    animationDelay:`${i*40}ms`,
                    padding:"10px 12px", borderRadius:7,
                    background:P.bg, border:`1px solid ${P.border}`,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flex:1, minWidth:0 }}>
                        <span style={{ fontSize:10, color:P.mute, fontWeight:600, width:14 }}>{i+1}</span>
                        <span style={{ fontSize:11, color:P.text, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</span>
                        <span style={{ fontSize:8, color:P.mute, background:P.barBg, padding:"1px 5px", borderRadius:3, textTransform:"uppercase", letterSpacing:"0.04em" }}>{c.phase}</span>
                      </div>
                      <div style={{ display:"flex", gap:10, fontSize:9.5, flexShrink:0 }}>
                        <span style={{ color:P.sub }}>{(c.reach/1000000).toFixed(1)}M reach</span>
                        <span style={{ color:P.pink, fontWeight:600, minWidth:34, textAlign:"right" }}>{c.er}% ER</span>
                      </div>
                    </div>
                    <div style={{ height:3, background:P.barBg, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ width:`${(c.reach/maxReach)*100}%`, height:"100%", background:P.accent, borderRadius:2, transition:"width 0.6s ease" }}/>
                    </div>
                  </div>
                );
              })}
              {filteredCampaigns.length === 0 && (
                <div style={{ textAlign:"center", padding:"20px", color:P.mute, fontSize:10 }}>No campaigns match this service filter</div>
              )}
            </div>
          </div>

          <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 18px" }}>
            <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:"0 0 4px", fontStyle:"italic" }}>Content Performance</h2>
            <p style={{ fontSize:10, color:P.sub, margin:"0 0 12px" }}>Engagement rate vs views · by format</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {CONTENT_TYPES.map((ct, i) => (
                <div key={ct.type} className="au" style={{ animationDelay:`${i*40}ms` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontSize:10.5, color:P.text, fontWeight:500 }}>{ct.type}</span>
                    <div style={{ display:"flex", gap:10, fontSize:9 }}>
                      <span style={{ color:P.pink, fontWeight:600 }}>ER {ct.er}%</span>
                      <span style={{ color:P.accent, fontWeight:600 }}>{ct.views}K views</span>
                      <span style={{ color:P.mute, minWidth:30, textAlign:"right" }}>n={ct.count}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:2 }}>
                    <div style={{ flex:ct.er*10, height:4, background:P.pink, borderRadius:"2px 0 0 2px" }}/>
                    <div style={{ flex:ct.views/100, height:4, background:P.accent, borderRadius:"0 2px 2px 0" }}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, paddingTop:10, borderTop:`1px solid ${P.border}`, display:"flex", gap:12, fontSize:9.5 }}>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:10, height:3, background:P.pink, borderRadius:1 }}/>
                <span style={{ color:P.sub }}>Engagement Rate</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:10, height:3, background:P.accent, borderRadius:1 }}/>
                <span style={{ color:P.sub }}>Views (K)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity + Needs You */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:30 }}>
          <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div>
                <h3 style={{ fontSize:13, fontWeight:600, color:P.text, margin:0, fontFamily:"'Sora'" }}>Recent Activity</h3>
                <p style={{ fontSize:9, color:P.mute, margin:"2px 0 0" }}>Latest events across campaigns</p>
              </div>
              <button style={{ background:"none", border:"none", color:P.accent, fontSize:9.5, fontWeight:500, cursor:"pointer", fontFamily:"'Sora'" }}>View all →</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {ACTIVITY_FEED.map((a, i) => (
                <div key={a.id} className="au" style={{
                  animationDelay:`${i*30}ms`,
                  display:"flex", alignItems:"center", gap:8,
                  padding:"7px 9px", borderRadius:6,
                }}>
                  <div style={{
                    width:26, height:26, borderRadius:6,
                    background:`${P[a.color]}12`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, fontWeight:700, color:P[a.color], flexShrink:0,
                  }}>{a.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, color:P.text, fontWeight:500 }}>{a.title}</div>
                    <div style={{ fontSize:9, color:P.mute, marginTop:1 }}>{a.campaign !== "—" ? `${a.campaign} · ` : ""}{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="au" style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <h3 style={{ fontSize:13, fontWeight:600, color:P.text, margin:0, fontFamily:"'Sora'" }}>Needs You</h3>
              <div style={{
                width:22, height:22, borderRadius:"50%",
                background:`${P.amber}15`, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:700, color:P.amber,
              }}>{PENDING_ACTIONS.length}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {PENDING_ACTIONS.map((a, i) => (
                <div key={a.id} className="au" style={{
                  animationDelay:`${i*30}ms`,
                  padding:"7px 9px", borderRadius:6,
                  background: a.priority === "high" ? `${P.red}05` : "transparent",
                  border: `1px solid ${a.priority === "high" ? `${P.red}12` : P.border}`,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                    {a.priority === "high" && <Dot color={P.red} sz={4}/>}
                    <span style={{ fontSize:10.5, color:P.text, fontWeight:500 }}>{a.title}</span>
                  </div>
                  <div style={{ fontSize:9, color:P.mute }}>{a.campaign}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, paddingTop:8, borderTop:`1px solid ${P.border}`, textAlign:"center" }}>
              <button style={{ background:"none", border:"none", color:P.accent, fontSize:9.5, fontWeight:500, cursor:"pointer", fontFamily:"'Sora'" }}>View all →</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing:border-box; margin:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(128,128,128,0.12); border-radius:2px; }
        @keyframes au { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .au { animation: au 0.35s cubic-bezier(.25,.46,.45,.94) both; }
        select { appearance:none; -webkit-appearance:none; -moz-appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%237B8DB0' d='M4 6L0 2h8z'/%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 7px center; padding-right:22px !important; }
      `}</style>
    </div>
  );
}
