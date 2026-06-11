import { useState, useEffect, useMemo, useRef } from "react";
import { useApp, DARK, LIGHT } from "../context";

const useP = () => useApp().P;

const PHASES = [{id:"brief",label:"Brief & Strategy",icon:"📋"},{id:"shortlist",label:"Shortlisting",icon:"🔍"},{id:"production",label:"Production",icon:"🎬"},{id:"live",label:"Live",icon:"🟢"},{id:"completed",label:"Completed",icon:"✅"}];
const STATUS_MAP = {yet_to_pick:{label:"Yet to Pick",k:"mute"},in_negotiation:{label:"Negotiating",k:"amber"},locked:{label:"Locked",k:"green"},dropped:{label:"Dropped",k:"red"},brand_reject:{label:"Rejected",k:"red"},finalized:{label:"Finalised",k:"accent"},briefed:{label:"Briefed",k:"accent"},concept_received:{label:"Concept In",k:"pink"},concept_approved:{label:"Concept OK",k:"green"},rework:{label:"Rework",k:"amber"},pending_brand:{label:"Pending You",k:"amber"},video_received:{label:"Video In",k:"pink"},video_approved:{label:"Video OK",k:"green"},posted:{label:"Posted",k:"green"},tracking:{label:"Live Tracking",k:"green"}};
const NICHES = ["Lifestyle","Fashion","Fitness","Dance","Music","Storytellers","Video Editors","Animation Artists","Mommy and Baby","Housewives","Food Reviews","Cooking Recipes"];
const SIZES = ["Nano","Micro","Macro","Mega","Celebrity"];
const AGE_GROUPS = ["18–24","25–30","31–40","41–50","50+"];
const REGIONS_ST = ["Maharashtra","Karnataka","Tamil Nadu","Kerala","Telangana","Delhi NCR","Uttar Pradesh","Gujarat","Rajasthan","West Bengal","Assam","Punjab","Madhya Pradesh","Bihar","Odisha","Goa"];
const TIERS = ["Tier 1","Tier 2","Tier 3"];
const LANGUAGES = ["Hindi","English","Tamil","Telugu","Kannada","Malayalam","Marathi","Bengali","Gujarati","Punjabi","Odia","Assamese","Urdu"];
const PLATFORMS = ["Instagram","YouTube","LinkedIn","Facebook","Reddit","X (Twitter)","Snapchat","Pinterest"];
const SERVICES_ALL = ["Influencer Marketing","AEO","Offline Activation"];
const IM_PRODUCTS = [{id:"reel_collab",label:"Reel — Collab"},{id:"reel_non_collab",label:"Reel — Non-Collab"},{id:"carousel_single",label:"Carousel — Single"},{id:"carousel_multi",label:"Carousel — Multi"},{id:"story",label:"Story"}];
const TEAM = [{name:"Rahul Sharma",role:"Manager"},{name:"Priya Nair",role:"Manager"},{name:"Arjun Reddy",role:"Executive"},{name:"Sneha Iyer",role:"Executive"},{name:"Vikram Das",role:"Manager"},{name:"Meera Joshi",role:"Executive"}];
const BCOLORS = ["#5B9BFF","#6366F1","#F472B6","#FBBF24","#4ADE80","#F97316","#8B5CF6","#14B8A6","#EC4899","#A78BFA"];

const INIT_CAMPAIGNS = [
  {id:1,name:"Diwali Festive Push",service:"Influencer Marketing",region:"South",phase:"production",progress:62,reach:"2.4M",engagement:"4.8%",impressions:"5.1M",engRate:"3.2%",views:"3.8M",start:"Mar 1",end:"Apr 30",budget:"₹12.5L",vendor:"CreatorNest Agency",brief:"Drive festive awareness for FreshBite's new snack range through regional food creators.",
    lockedBrief:{objective:"Build festive awareness across South India.",targetAudience:"18–35 in TN, KA, KL, TS.",keyMessages:"FreshBite — the festive snack companion.",deliverables:"8–12 posts, 2 YT integrations.",budget:"₹12.5L",timeline:"6 weeks",approvedOn:"Feb 25, 2026",vars:{objective:"approved",targetAudience:"approved",keyMessages:"approved",deliverables:"approved",budget:"approved",timeline:"approved"}},
    status:"active",
    creators:[
      {name:"Anjali Kitchen",handle:"@anjalikitchen",url:"https://instagram.com/anjalikitchen",followers:"820K",platform:"Instagram",status:"concept_approved",deliverables:"2 Reels + 3 Stories",engRate:"4.2%",niche:"Cooking Recipes",size:"Macro",age:"25–30",region:"Tamil Nadu",tier:"Tier 1",avatar:"AK",briefDoc:{name:"Concept_v2.docx",url:"#"},videoDoc:{name:"Sample_Reel.mp4",url:"#"},approval:{exec:null,mgmt:null,execLocked:false,mgmtLocked:false}},
      {name:"South Foodie",handle:"@southfoodie",url:"https://youtube.com/@southfoodie",followers:"1.2M",platform:"YouTube",status:"video_received",deliverables:"1 Long-form + 2 Shorts",engRate:"5.1%",niche:"Food Reviews",size:"Mega",age:"25–30",region:"Karnataka",tier:"Tier 1",avatar:"SF",briefDoc:{name:"Script_SF.docx",url:"#"},videoDoc:{name:"Draft_v1.mp4",url:"#"},approval:{exec:null,mgmt:null,execLocked:false,mgmtLocked:false}},
      {name:"Taste of Madras",handle:"@tasteofmadras",url:"https://instagram.com/tasteofmadras",followers:"540K",platform:"Instagram",status:"briefed",deliverables:"2 Reels",engRate:"3.8%",niche:"Food Reviews",size:"Macro",age:"31–40",region:"Tamil Nadu",tier:"Tier 1",avatar:"TM",briefDoc:null,videoDoc:null,approval:{exec:null,mgmt:null,execLocked:false,mgmtLocked:false}},
      {name:"Foodie Hyderabad",handle:"@foodiehyd",url:"https://instagram.com/foodiehyd",followers:"380K",platform:"Instagram",status:"in_negotiation",deliverables:"TBD",engRate:"4.5%",niche:"Lifestyle",size:"Macro",age:"25–30",region:"Telangana",tier:"Tier 1",avatar:"FH",briefDoc:null,videoDoc:null,approval:{exec:"tick",mgmt:null,execLocked:true,mgmtLocked:false}},
      {name:"Kerala Food Tales",handle:"@keralafood",url:"https://youtube.com/@keralafood",followers:"290K",platform:"YouTube",status:"pending_brand",deliverables:"—",engRate:"6.1%",niche:"Cooking Recipes",size:"Macro",age:"31–40",region:"Kerala",tier:"Tier 2",avatar:"KF",briefDoc:{name:"Brief_Kerala.docx",url:"#"},videoDoc:null,approval:{exec:null,mgmt:null,execLocked:false,mgmtLocked:false}},
    ],
    topAssets:[{creator:"South Foodie",handle:"@southfoodie",avatar:"SF",link:"https://youtube.com/watch?v=abc",label:"Reel — 800K views"},{creator:"Anjali Kitchen",handle:"@anjalikitchen",avatar:"AK",link:"https://instagram.com/reel/xyz",label:"Reel — 420K views"}],
    chat:[{from:"Priya",role:"management",time:"Apr 10",msg:"Reel #3 crossed 800K views."},{from:"You",role:"client",time:"Apr 10",msg:"Go ahead with the boost!"}],
  },
  {id:2,name:"Brand Visibility Sprint",service:"AEO",region:"Pan-India",phase:"shortlist",progress:28,reach:"180K",engagement:"—",impressions:"420K",engRate:"—",views:"—",start:"Apr 1",end:"Jun 30",budget:"₹6L",vendor:"In-House",brief:"Optimise FreshBite for AI search engines.",
    lockedBrief:{objective:"Target 14 queries.",targetAudience:"Health-conscious.",keyMessages:"FreshBite answers queries.",deliverables:"14 pages + schema.",budget:"₹6L",timeline:"3 months",approvedOn:"Mar 28",vars:{objective:"approved",targetAudience:"approved",keyMessages:"pending",deliverables:"approved",budget:"approved",timeline:"approved"}},
    status:"active",queries:[{query:"best healthy snacks India",volume:"22K/mo",status:"live",position:"Featured",engine:"Google AI"},{query:"low calorie chips",volume:"14K/mo",status:"optimizing",position:"—",engine:"Perplexity"}],creators:[],topAssets:[],chat:[],},
  {id:3,name:"Micro-Influencer Wave",service:"Influencer Marketing",region:"West",phase:"completed",progress:100,reach:"1.1M",engagement:"6.2%",impressions:"2.8M",engRate:"5.4%",views:"1.9M",start:"Jan 15",end:"Mar 15",budget:"₹4L",vendor:"ViralGrid Co.",brief:"12 micro-influencers in Mumbai & Pune.",
    lockedBrief:{objective:"Sampling via micro creators.",targetAudience:"18–30 urban foodies.",keyMessages:"FreshBite fits your vibe.",deliverables:"24 Reels + 40 Stories.",budget:"₹4L",timeline:"8 weeks",approvedOn:"Jan 10",vars:{objective:"approved",targetAudience:"approved",keyMessages:"approved",deliverables:"approved",budget:"approved",timeline:"approved"}},
    status:"done",creators:[{name:"Mumbai Munchies",handle:"@mumbaimunch",url:"https://instagram.com/mumbaimunch",followers:"95K",platform:"Instagram",status:"tracking",deliverables:"3 Reels",engRate:"7.2%",niche:"Food Reviews",size:"Micro",age:"25–30",region:"Maharashtra",tier:"Tier 1",avatar:"MM",briefDoc:{name:"Script.docx",url:"#"},videoDoc:{name:"Reel.mp4",url:"#"},approval:{exec:"tick",mgmt:"tick",execLocked:true,mgmtLocked:true}}],
    topAssets:[{creator:"Mumbai Munchies",handle:"@mumbaimunch",avatar:"MM",link:"#",label:"Reel — 150K views"}],chat:[]},
  {id:4,name:"Summer Launch Teaser",service:"Influencer Marketing",region:"North",phase:"brief",progress:8,reach:"—",engagement:"—",impressions:"—",engRate:"—",views:"—",start:"Apr 20",end:"Jun 15",budget:"₹8L",vendor:"Pending",brief:"Teaser for summer range.",lockedBrief:null,status:"active",creators:[],topAssets:[],chat:[],
    pendingBrief:{objective:"Teaser campaign for FreshBite's summer range targeting North India youth.",targetAudience:"",keyMessages:"",deliverables:"",budget:"₹8L",timeline:"Apr 20 – Jun 15",vars:{objective:"pending",targetAudience:"waiting",keyMessages:"waiting",deliverables:"waiting",budget:"pending",timeline:"pending"}}},
  {id:5,name:"Snack Box — Paid Ads",service:"Performance Ads",region:"Pan-India",phase:"live",progress:74,reach:"4.2M",engagement:"3.1%",impressions:"9.8M",engRate:"2.8%",views:"6.1M",start:"Mar 10",end:"May 10",budget:"₹15L",vendor:"MediaScale Digital",brief:"Paid campaign for snack box.",
    lockedBrief:{objective:"Drive subscriptions.",targetAudience:"22–40 professionals.",keyMessages:"Subscribe once, snack forever.",deliverables:"Meta + Google.",budget:"₹15L",timeline:"8 weeks",approvedOn:"Mar 5",vars:{objective:"approved",targetAudience:"approved",keyMessages:"approved",deliverables:"approved",budget:"approved",timeline:"approved"}},
    status:"active",creators:[],topAssets:[],chat:[{from:"Arjun",role:"execution",time:"Apr 11",msg:"CPA dropped 12%."}]},
];

/* ═══ UTILS ═══ */
const Dot=({color})=><span style={{width:6,height:6,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}}/>;

const Donut=({value,size=34,stroke=4.5})=>{const P=useP();const r=(size-stroke)/2;const c=2*Math.PI*r;const col=value===100?P.doneTxt:P.accent;
  return(<div style={{width:size,height:size,position:"relative",flexShrink:0}}><svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)",display:"block"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={P.barBg} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c-(value/100)*c} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s ease"}}/></svg><span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,color:value===100?P.doneTxt:P.text,fontFamily:"'Sora'",lineHeight:1}}>{value}%</span></div>);};

/* Pie chart using CSS conic-gradient — no SVG, no crash */
function PieChart({data,size=82}){
  const P=useP();
  const total=data.reduce((s,d)=>s+d.value,0);
  if(!total||!data.length)return null;
  let acc=0;
  const stops=data.map((d,i)=>{const start=(acc/total)*100;acc+=d.value;const end=(acc/total)*100;return`${BCOLORS[i%BCOLORS.length]} ${start}% ${end}%`;}).join(", ");
  return(<div style={{width:size,height:size,borderRadius:"50%",background:`conic-gradient(${stops})`,margin:"0 auto",position:"relative"}}>
    <div style={{position:"absolute",inset:size*0.22,borderRadius:"50%",background:P.surface}}/>
  </div>);
}

function Stepper({value,onChange,min=1}){const P=useP();const b={width:26,height:26,borderRadius:5,border:`1px solid ${P.border}`,background:P.surface,color:P.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora'"};
  return(<div style={{display:"flex",alignItems:"center",gap:6}}><button style={{...b,opacity:value<=min?0.3:1}} onClick={()=>onChange(Math.max(min,value-1))}>−</button><span style={{fontSize:13,fontWeight:600,color:P.text,minWidth:24,textAlign:"center"}}>{value}</span><button style={b} onClick={()=>onChange(value+1)}>+</button></div>);}

function Slider({value,onChange,min=0,max=100,step=1,suffix=""}){const P=useP();const pct=((value-min)/(max-min))*100;
  return(<div style={{display:"flex",alignItems:"center",gap:8,width:"100%"}}><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{flex:1,height:4,appearance:"none",background:`linear-gradient(to right,${P.accent} ${pct}%,${P.barBg} ${pct}%)`,borderRadius:2,outline:"none",cursor:"pointer"}}/><span style={{fontSize:11,fontWeight:600,color:P.text,minWidth:44,textAlign:"right",fontFamily:"'Sora'"}}>{value}{suffix}</span></div>);}

function ChipSelect({options,selected,onChange}){const P=useP();return(<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{options.map(o=>{const a=selected.includes(o);return(<button key={o} onClick={()=>onChange(a?selected.filter(x=>x!==o):[...selected,o])} style={{padding:"4px 9px",borderRadius:5,fontSize:9.5,fontWeight:500,background:a?`${P.accent}12`:P.barBg,border:`1px solid ${a?`${P.accent}25`:P.border}`,color:a?P.accent:P.sub,cursor:"pointer",fontFamily:"'Sora'",whiteSpace:"nowrap"}}>{o}</button>);})}</div>);}

function DropdownSelect({options:io,value,onChange,placeholder,allowNew}){const P=useP();const[open,setOpen]=useState(false);const[opts,setOpts]=useState(io);const[nv,setNv]=useState("");const ref=useRef(null);
  useEffect(()=>{if(!open)return;const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[open]);
  return(<div ref={ref} style={{position:"relative"}}><button onClick={()=>setOpen(!open)} style={{width:"100%",padding:"7px 10px",borderRadius:6,background:P.inputBg,border:`1px solid ${P.border}`,color:value?P.text:P.mute,fontSize:11.5,fontFamily:"'Sora'",textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value||placeholder}</span><span style={{fontSize:8,color:P.mute}}>▾</span></button>
    {open&&(<div style={{position:"absolute",top:"calc(100% + 3px)",left:0,right:0,zIndex:60,background:P.modalBg,border:`1px solid ${P.border}`,borderRadius:7,padding:"3px 0",maxHeight:170,overflowY:"auto",boxShadow:"0 12px 40px rgba(0,0,0,0.4)"}}>
      {opts.map(o=>(<div key={o} onClick={()=>{onChange(o);setOpen(false);}} style={{padding:"6px 11px",fontSize:10.5,color:P.text,cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.background=P.hover} onMouseOut={e=>e.currentTarget.style.background="transparent"}>{o}</div>))}
      {allowNew&&(<div style={{padding:"5px 9px",borderTop:`1px solid ${P.border}`,display:"flex",gap:3}}><input value={nv} onChange={e=>setNv(e.target.value)} placeholder="Add new..." style={{flex:1,padding:"3px 7px",borderRadius:4,background:P.inputBg,border:`1px solid ${P.border}`,color:P.text,fontSize:10,fontFamily:"'Sora'",outline:"none"}}/><button onClick={()=>{if(nv.trim()){setOpts(p=>[...p,nv.trim()]);onChange(nv.trim());setNv("");setOpen(false);}}} style={{padding:"3px 8px",borderRadius:4,background:P.accent,border:"none",color:"#050A18",fontSize:9.5,fontWeight:600,cursor:"pointer",fontFamily:"'Sora'"}}>Add</button></div>)}
    </div>)}</div>);}

function HBars({data}){const P=useP();if(!data||!data.length)return null;const max=Math.max(...data.map(d=>d.value),0.1);
  return(<div style={{display:"flex",flexDirection:"column",gap:4}}>{data.map((d,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:8,color:P.sub,width:55,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flexShrink:0}}>{d.label}</span><div style={{flex:1,height:8,background:P.barBg,borderRadius:3,overflow:"hidden"}}><div style={{width:`${(d.value/max)*100}%`,height:"100%",background:BCOLORS[i%BCOLORS.length],borderRadius:3,transition:"width 0.5s ease",minWidth:2}}/></div><span style={{fontSize:8,fontWeight:600,color:P.text,width:28,flexShrink:0}}>{typeof d.value==="number"&&d.value%1?d.value.toFixed(1):d.value}{d.suffix||""}</span></div>))}</div>);}

/* ═══ PHASE TRACKER — more significant ═══ */
function PhaseTracker({currentPhase}){const P=useP();const idx=PHASES.findIndex(p=>p.id===currentPhase);
  return(<div style={{background:P.surface,borderRadius:12,padding:"16px 20px",border:`1px solid ${P.border}`,marginBottom:14}}>
    <div style={{display:"flex",alignItems:"center"}}>
      {PHASES.map((p,i)=>{const isCur=i===idx,isDone=i<idx;
        return(<div key={p.id} style={{display:"flex",alignItems:"center",flex:1}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:1,position:"relative"}}>
            <div style={{width:36,height:36,borderRadius:10,background:isDone?`${P.green}15`:isCur?`${P.accent}15`:P.barBg,border:`2px solid ${isDone?P.green:isCur?P.accent:`${P.text}10`}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,transition:"all 0.3s",boxShadow:isCur?`0 0 12px ${P.accent}30`:"none"}}>{isDone?"✓":p.icon}</div>
            <span style={{fontSize:8.5,fontWeight:isCur?700:isDone?500:400,color:isCur?P.text:isDone?P.green:P.mute,textTransform:"uppercase",letterSpacing:"0.04em",textAlign:"center"}}>{p.label}</span>
            {isCur&&<div style={{position:"absolute",top:-4,right:"20%",width:8,height:8,borderRadius:"50%",background:P.accent,animation:"pulse 2s ease-in-out infinite"}}/>}
          </div>
          {i<PHASES.length-1&&(<div style={{height:2,flex:"0 0 100%",maxWidth:40,borderRadius:1,background:isDone?P.green:`${P.text}08`,marginBottom:20,transition:"background 0.3s"}}/>)}
        </div>);})}
    </div>
  </div>);}

/* ═══ BUDGET CARD — operational split pie chart ═══ */
function BudgetCard({value,creators}){const P=useP();const[open,setOpen]=useState(false);
  // Budget breakdown by backend operations — percentages auto-generated from creator count
  const numCr=creators?.length||0;
  const opSplit=numCr>0?[
    {label:"Creator Fees",value:42},{label:"Production",value:18},{label:"Boosting",value:20},{label:"Platform Fee",value:8},{label:"Agency Fee",value:12}
  ]:[
    {label:"Strategy",value:30},{label:"Execution",value:35},{label:"Platform Fee",value:15},{label:"Agency Fee",value:20}
  ];
  return(<div style={{background:P.surface,borderRadius:8,padding:"10px 12px",border:`1px solid ${P.border}`,cursor:"pointer"}} onClick={()=>setOpen(!open)}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:7.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>Budget</div><span style={{fontSize:7,color:P.accent}}>{open?"▴":"▾"}</span></div>
    <div style={{fontSize:15,fontWeight:600,color:P.text,marginTop:2}}>{value}</div>
    {open&&(<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${P.border}`}}>
      <PieChart data={opSplit} size={78}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginTop:8}}>
        {opSplit.map((d,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:3}}>
          <span style={{width:6,height:6,borderRadius:2,background:BCOLORS[i%BCOLORS.length],flexShrink:0}}/>
          <span style={{fontSize:7.5,color:P.sub}}>{d.label}</span>
          <span style={{fontSize:7.5,color:P.mute}}>({d.value}%)</span>
        </div>))}
      </div>
    </div>)}
  </div>);}

/* ═══ METRIC CARD ═══ */
function MetricCard({label,value,breakdowns}){const P=useP();const[open,setOpen]=useState(false);const[filter,setFilter]=useState(breakdowns?Object.keys(breakdowns)[0]:null);
  const has=breakdowns&&Object.keys(breakdowns).length>0&&value!=="—"&&value!=="0";
  return(<div style={{background:P.surface,borderRadius:8,padding:"10px 12px",border:`1px solid ${P.border}`,cursor:has?"pointer":"default"}} onClick={()=>has&&setOpen(!open)}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:7.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{label}</div>{has&&<span style={{fontSize:7,color:P.accent}}>{open?"▴":"▾"}</span>}</div>
    <div style={{fontSize:15,fontWeight:600,color:value==="—"||value==="0"?P.doneTxt:P.text,marginTop:2}}>{value}</div>
    {open&&breakdowns&&(<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${P.border}`}}>
      <div style={{display:"flex",gap:3,marginBottom:6,flexWrap:"wrap"}}>{Object.keys(breakdowns).map(f=>(<button key={f} onClick={e=>{e.stopPropagation();setFilter(f);}} style={{padding:"2px 7px",borderRadius:4,fontSize:8,fontWeight:500,background:filter===f?`${P.accent}12`:"transparent",border:`1px solid ${filter===f?`${P.accent}25`:P.border}`,color:filter===f?P.accent:P.mute,cursor:"pointer",fontFamily:"'Sora'",textTransform:"capitalize"}}>{f}</button>))}</div>
      <HBars data={breakdowns[filter]||[]}/>
    </div>)}
  </div>);}

/* ═══ ENGAGEMENT CARD ═══ */
function EngagementCard({value,breakdowns}){const P=useP();const[open,setOpen]=useState(false);const[filter,setFilter]=useState("creator");
  const has=breakdowns&&Object.keys(breakdowns).length>0&&value!=="—";
  return(<div style={{background:P.surface,borderRadius:8,padding:"10px 12px",border:`1px solid ${P.border}`,cursor:has?"pointer":"default"}} onClick={()=>has&&setOpen(!open)}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:7.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>Engagement Rate</div>{has&&<span style={{fontSize:7,color:P.accent}}>{open?"▴":"▾"}</span>}</div>
    <div style={{fontSize:15,fontWeight:600,color:value==="—"?P.doneTxt:P.text,marginTop:2}}>{value}</div>
    {open&&breakdowns&&(<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${P.border}`}}>
      <div style={{display:"flex",gap:3,marginBottom:6,flexWrap:"wrap"}}>{Object.keys(breakdowns).map(f=>(<button key={f} onClick={e=>{e.stopPropagation();setFilter(f);}} style={{padding:"2px 7px",borderRadius:4,fontSize:8,fontWeight:500,background:filter===f?`${P.accent}12`:"transparent",border:`1px solid ${filter===f?`${P.accent}25`:P.border}`,color:filter===f?P.accent:P.mute,cursor:"pointer",fontFamily:"'Sora'",textTransform:"capitalize"}}>{f}</button>))}</div>
      <HBars data={(breakdowns[filter]||[]).map(d=>({...d,suffix:"%"}))}/>
    </div>)}
  </div>);}

/* ═══ OBSERVATIONS + STRATEGY INSIGHTS ═══ */
function Observations({creators,topAssets}){const P=useP();
  const obs=[];
  if(topAssets?.length){const best=topAssets[0];obs.push(`Top performer: ${best.creator} with ${best.label.split("—")[1]?.trim()||"strong results"}.`);}
  if(creators?.length>1){const rates=creators.filter(c=>c.engRate&&c.engRate!=="—").map(c=>({n:c.name,r:parseFloat(c.engRate)}));if(rates.length){const top=rates.sort((a,b)=>b.r-a.r)[0];obs.push(`Highest engagement: ${top.n} at ${top.r}%.`);const avg=(rates.reduce((s,r)=>s+r.r,0)/rates.length).toFixed(1);obs.push(`Average creator engagement: ${avg}% across ${rates.length} creators.`);}}
  if(creators?.length){const niches={};creators.forEach(c=>{niches[c.niche]=(niches[c.niche]||0)+1;});const topN=Object.entries(niches).sort((a,b)=>b[1]-a[1])[0];if(topN)obs.push(`Most represented niche: ${topN[0]} (${topN[1]} creator${topN[1]>1?"s":""}).`);}
  if(creators?.length){const platforms={};creators.forEach(c=>{platforms[c.platform]=(platforms[c.platform]||0)+1;});const topP=Object.entries(platforms).sort((a,b)=>b[1]-a[1])[0];if(topP)obs.push(`Primary platform: ${topP[0]} (${topP[1]} of ${creators.length} creators).`);}
  if(!obs.length)return null;

  // Generate strategy insights by connecting observations
  const strategies=[];
  if(creators?.length>1){
    const rates=creators.filter(c=>c.engRate&&c.engRate!=="—").map(c=>({n:c.name,r:parseFloat(c.engRate),niche:c.niche,size:c.size,platform:c.platform}));
    if(rates.length>1){
      const top=rates.sort((a,b)=>b.r-a.r)[0];
      const bottom=rates[rates.length-1];
      if(top.r>bottom.r*1.3){strategies.push(`${top.niche} creators are outperforming others — consider increasing allocation to this niche in future campaigns.`);}
      const igCount=rates.filter(r=>r.platform==="Instagram").length;
      const ytCount=rates.filter(r=>r.platform==="YouTube").length;
      if(igCount>0&&ytCount>0){
        const igAvg=rates.filter(r=>r.platform==="Instagram").reduce((s,r)=>s+r.r,0)/igCount;
        const ytAvg=rates.filter(r=>r.platform==="YouTube").reduce((s,r)=>s+r.r,0)/ytCount;
        if(ytAvg>igAvg*1.1)strategies.push(`YouTube creators show ${((ytAvg/igAvg-1)*100).toFixed(0)}% higher engagement than Instagram — consider shifting budget toward long-form content.`);
        else if(igAvg>ytAvg*1.1)strategies.push(`Instagram Reels driving ${((igAvg/ytAvg-1)*100).toFixed(0)}% higher engagement — double down on short-form content.`);
      }
    }
    const sizes={};rates.forEach(r=>{if(!sizes[r.size])sizes[r.size]={total:0,count:0};sizes[r.size].total+=r.r;sizes[r.size].count++;});
    const sizeAvgs=Object.entries(sizes).map(([k,v])=>({size:k,avg:v.total/v.count})).sort((a,b)=>b.avg-a.avg);
    if(sizeAvgs.length>1&&sizeAvgs[0].avg>sizeAvgs[sizeAvgs.length-1].avg*1.2){
      strategies.push(`${sizeAvgs[0].size} creators deliver the best engagement-to-cost ratio — prioritise this tier for ROI-focused campaigns.`);
    }
  }
  if(topAssets?.length>1){strategies.push(`Repurpose top-performing assets as paid ad creatives to maximise reach with proven content.`);}
  if(creators?.length>=3){
    const regions={};creators.forEach(c=>{regions[c.region]=(regions[c.region]||0)+1;});
    const regionCount=Object.keys(regions).length;
    if(regionCount<=2)strategies.push(`Current creators are concentrated in ${regionCount} region${regionCount>1?"s":""}. Expanding to new regions could unlock untapped audiences.`);
  }

  return(<div style={{marginTop:12}}>
    <div style={{fontSize:8,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:6}}>Observations</div>
    <div style={{background:P.surface,borderRadius:8,padding:"10px 14px",border:`1px solid ${P.border}`,marginBottom:strategies.length?10:0}}>
      {obs.map((o,i)=>(<div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:i<obs.length-1?5:0}}>
        <span style={{color:P.accent,fontSize:8,marginTop:3,flexShrink:0}}>●</span>
        <span style={{fontSize:10.5,color:P.text,lineHeight:1.5}}>{o}</span>
      </div>))}
    </div>
    {strategies.length>0&&(<>
      <div style={{fontSize:8,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:6}}>Strategy Insights</div>
      <div style={{background:`${P.accent}06`,borderRadius:8,padding:"10px 14px",border:`1px solid ${P.accent}12`}}>
        {strategies.map((s,i)=>(<div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:i<strategies.length-1?6:0}}>
          <span style={{color:P.amber,fontSize:9,marginTop:2,flexShrink:0}}>→</span>
          <span style={{fontSize:10.5,color:P.text,lineHeight:1.55}}>{s}</span>
        </div>))}
      </div>
    </>)}
  </div>);
}

/* ═══ CREATOR ROW — independent approvals ═══ */
function CreatorRow({cr,idx,userRole,onUpdateApproval}){
  const P=useP();const st=STATUS_MAP[cr.status]||STATUS_MAP.yet_to_pick;
  const actionable=["pending_brand","in_negotiation"].includes(cr.status);
  const[expanded,setExpanded]=useState(false);
  const a=cr.approval||{exec:null,mgmt:null,execLocked:false,mgmtLocked:false};
  const bothLocked=a.execLocked&&a.mgmtLocked;
  const autoResult=bothLocked?(a.exec==="tick"&&a.mgmt==="tick"?"approved":"rejected"):null;

  const renderApprovalUI=(role,label)=>{
    const isOwn=(role==="exec"&&userRole==="execution")||(role==="mgmt"&&userRole==="management");
    const val=a[role];const locked=a[`${role}Locked`];
    const otherRole=role==="exec"?"mgmt":"exec";const otherVal=a[otherRole];const otherLocked=a[`${otherRole}Locked`];
    return(<div style={{display:"flex",alignItems:"center",gap:4}}>
      <span style={{fontSize:8,color:P.mute,fontWeight:600,width:30}}>{label}</span>
      {locked?(<span style={{display:"flex",alignItems:"center",gap:2,fontSize:9,color:val==="tick"?P.green:P.red,fontWeight:600,opacity:isOwn?1:0.5}}>
        {val==="tick"?"✓ Yes":"✗ No"}<span style={{fontSize:7,color:P.mute,marginLeft:2}}>locked</span>
      </span>):(isOwn?(<div style={{display:"flex",gap:3}}>
        <button onClick={()=>onUpdateApproval(idx,role,"tick")} style={{width:22,height:22,borderRadius:5,border:`1.5px solid ${val==="tick"?P.green:P.border}`,background:val==="tick"?`${P.green}15`:"transparent",color:P.green,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✓</button>
        <button onClick={()=>onUpdateApproval(idx,role,"cross")} style={{width:22,height:22,borderRadius:5,border:`1.5px solid ${val==="cross"?P.red:P.border}`,background:val==="cross"?`${P.red}15`:"transparent",color:P.red,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✗</button>
        {val&&<button onClick={()=>onUpdateApproval(idx,role+"Lock",true)} style={{padding:"2px 6px",borderRadius:4,background:`${P.accent}10`,border:`1px solid ${P.accent}20`,color:P.accent,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"'Sora'"}}>Lock</button>}
      </div>):(<span style={{fontSize:9,color:val==="tick"?P.green:val==="cross"?P.red:P.mute,opacity:0.5}}>{val==="tick"?"✓":"✗"}{val?" ("+label+")":"pending"}</span>))}
    </div>);};

  return(<div className="anim-up" style={{animationDelay:`${idx*35}ms`,background:P.surface,border:`1px solid ${actionable?P.amber+"20":autoResult==="approved"?P.green+"20":autoResult==="rejected"?P.red+"15":P.border}`,borderRadius:9,padding:"11px 13px",marginBottom:6}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:32,height:32,borderRadius:8,background:`${P.accent}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:P.accent,flexShrink:0}}>{cr.avatar||cr.name[0]}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:500,color:P.text}}>{cr.name}</span>
          <a href={cr.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:P.accent,textDecoration:"none"}}>{cr.handle}</a></div>
        <div style={{fontSize:10,color:P.sub,marginTop:2,display:"flex",gap:8,flexWrap:"wrap"}}><span>{cr.followers}</span><span>{cr.platform}</span><span>{cr.deliverables}</span><span style={{color:P.accent,fontWeight:500}}>ER: {cr.engRate}</span></div>
      </div>
      {autoResult&&<span style={{fontSize:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",padding:"2px 6px",borderRadius:4,background:autoResult==="approved"?`${P.green}12`:`${P.red}10`,color:autoResult==="approved"?P.green:P.red}}>{autoResult}</span>}
      <div style={{display:"flex",alignItems:"center",gap:4,minWidth:75,justifyContent:"flex-end"}}><Dot color={P[st.k]}/><span style={{fontSize:9.5,color:P[st.k],fontWeight:500}}>{st.label}</span></div>
    </div>
    <button onClick={()=>setExpanded(!expanded)} style={{background:"none",border:"none",color:P.accent,fontSize:9,cursor:"pointer",fontFamily:"'Sora'",fontWeight:500,marginTop:5,padding:0}}>{expanded?"Show less ▴":"See more ▾"}</button>
    {expanded&&(<div style={{marginTop:5,paddingTop:7,borderTop:`1px solid ${P.border}`,display:"flex",flexDirection:"column",gap:4}}>
      <div style={{display:"flex",gap:10,fontSize:9.5,color:P.sub,flexWrap:"wrap"}}><span>Niche: <b style={{color:P.text}}>{cr.niche}</b></span><span>Size: <b style={{color:P.text}}>{cr.size}</b></span><span>Age: <b style={{color:P.text}}>{cr.age}</b></span><span>Region: <b style={{color:P.text}}>{cr.region}</b></span><span>Tier: <b style={{color:P.text}}>{cr.tier}</b></span></div>
      <div style={{display:"flex",gap:14,fontSize:10,marginTop:2}}>
        <span style={{color:P.mute}}>Brief: {cr.briefDoc?<a href={cr.briefDoc.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:P.accent,textDecoration:"none"}}>📄 {cr.briefDoc.name}</a>:<em>Not uploaded</em>}</span>
        <span style={{color:P.mute}}>Video: {cr.videoDoc?<a href={cr.videoDoc.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:P.accent,textDecoration:"none"}}>🎬 {cr.videoDoc.name}</a>:<em>Not uploaded</em>}</span>
      </div>
    </div>)}
    {actionable&&!autoResult&&(<div style={{marginTop:7,paddingTop:7,borderTop:`1px solid ${P.border}`,display:"flex",gap:16,alignItems:"center"}}>
      {renderApprovalUI("exec","Exec")}{renderApprovalUI("mgmt","Mgmt")}
    </div>)}
  </div>);}

/* ═══ BRIEF PAGE — with variable-level status ═══ */
function BriefPage({lockedBrief,pendingBrief}){const P=useP();
  const brief=lockedBrief||pendingBrief;if(!brief)return(<div style={{textAlign:"center",padding:"36px 20px",color:P.mute}}><div style={{fontSize:22,marginBottom:5,opacity:0.15}}>📋</div><div style={{fontSize:11.5}}>No brief created yet</div></div>);
  const isLocked=!!lockedBrief;const vars=brief.vars||{};
  const statusIcon=(s)=>s==="approved"?{icon:"✓",color:P.green}:s==="rejected"?{icon:"✗",color:P.red}:s==="pending"?{icon:"⏳",color:P.amber}:{icon:"…",color:P.mute};
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"6px 10px",borderRadius:6,background:isLocked?`${P.green}06`:`${P.amber}06`,border:`1px solid ${isLocked?`${P.green}15`:`${P.amber}15`}`}}>
      <Dot color={isLocked?P.green:P.amber}/><span style={{fontSize:10,color:isLocked?P.green:P.amber,fontWeight:500}}>{isLocked?`Locked ${brief.approvedOn}`:"Waiting — under review by 5th Avenue"}</span>
      <span style={{marginLeft:"auto",fontSize:8.5,color:P.mute,fontStyle:"italic"}}>{isLocked?"Read-only":"Pending approval"}</span></div>
    {[["Objective","objective"],["Target Audience","targetAudience"],["Key Messages","keyMessages"],["Deliverables","deliverables"],["Budget","budget"],["Timeline","timeline"]].map(([label,key])=>{
      const val=brief[key];const si=statusIcon(vars[key]);
      return(<div key={key} style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:7,padding:"9px 12px",marginBottom:5,display:"flex",alignItems:"flex-start",gap:8}}>
        <div style={{flex:1}}><div style={{fontSize:7.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:3,display:"flex",alignItems:"center",gap:4}}>{label}<span style={{color:si.color,fontSize:9}}>{si.icon}</span></div>
          <div style={{fontSize:11.5,color:val?P.text:P.mute,lineHeight:1.5,fontStyle:val?"normal":"italic"}}>{val||"Awaiting input"}</div></div>
      </div>);})}
  </div>);}

/* ═══ GUIDED BRIEF WIZARD — step-by-step conversational flow ═══ */
function GuidedBriefWizard({onComplete}){const P=useP();
  const STEPS=[
    {id:"service",q:"What service are you looking for?",options:["Influencer Marketing","AEO","Offline Activation"]},
    {id:"description",q:"Describe your campaign goal in a sentence or two.",type:"text",placeholder:"e.g. Launch awareness for our new summer snack range..."},
    {id:"budget",q:"What's your budget range?",options:["Under ₹5L","₹5L – ₹15L","₹15L – ₹50L","₹50L – ₹1.5Cr"]},
    {id:"category",q:"Which brand category or team is this for?",options:["Snacks","Beverages","Health & Wellness","Fashion","Beauty","Other"],allowCustom:true},
    {id:"platforms",q:"Which platforms should we target?",options:["Instagram","YouTube","LinkedIn","Facebook","Reddit","X (Twitter)"],multi:true,condition:(d)=>d.service==="Influencer Marketing"},
    {id:"numCreators",q:"How many creators are you thinking?",options:["1 – 5","6 – 15","16 – 30","30+"],condition:(d)=>d.service==="Influencer Marketing"},
    {id:"creatorNiche",q:"What kind of creators? Pick all that apply.",options:["Lifestyle","Fashion","Fitness","Food Reviews","Cooking Recipes","Dance","Music","Storytellers","Mommy and Baby","Housewives"],multi:true,condition:(d)=>d.service==="Influencer Marketing"},
    {id:"creatorSize",q:"What creator tier do you prefer?",options:["Nano","Micro","Macro","Mega","Celebrity","Mix of sizes"],condition:(d)=>d.service==="Influencer Marketing"},
    {id:"usage",q:"What usage rights do you need?",options:["Ad Rights (time-limited)","Media Rights (perpetual)"],condition:(d)=>d.service==="Influencer Marketing"},
    {id:"region",q:"Any specific regions or states to target?",type:"text",placeholder:"e.g. South India, Maharashtra, Pan-India..."},
    {id:"reference",q:"Any reference creators or campaign links? (optional)",type:"text",placeholder:"Paste a profile link or skip...",optional:true},
  ];

  const[step,setStep]=useState(0);const[data,setData]=useState({});const[msgs,setMsgs]=useState([]);const[customInput,setCustomInput]=useState("");const[multiSel,setMultiSel]=useState([]);const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,step]);

  // Initialize first message
  useEffect(()=>{setMsgs([{role:"assistant",content:STEPS[0].q}]);},[]);

  const getActiveSteps=()=>STEPS.filter(s=>!s.condition||s.condition(data));
  const getNextStep=(curIdx)=>{
    for(let i=curIdx+1;i<STEPS.length;i++){if(!STEPS[i].condition||STEPS[i].condition(data))return i;}
    return -1;
  };

  const advance=(answer)=>{
    const curStep=STEPS[step];
    const newData={...data,[curStep.id]:answer};setData(newData);
    const newMsgs=[...msgs,{role:"user",content:Array.isArray(answer)?answer.join(", "):answer}];

    const nextIdx=getNextStep(step);
    if(nextIdx===-1){
      // Done
      const budgetMap={"Under ₹5L":3,"₹5L – ₹15L":10,"₹15L – ₹50L":30,"₹50L – ₹1.5Cr":100};
      newMsgs.push({role:"assistant",content:"All set! Here's your brief summary. Review and submit."});
      setMsgs(newMsgs);setStep(-1);
      setData({...newData,_budgetNum:budgetMap[newData.budget]||10});
    }else{
      newMsgs.push({role:"assistant",content:STEPS[nextIdx].q});
      setMsgs(newMsgs);setStep(nextIdx);setMultiSel([]);setCustomInput("");
    }
  };

  const handleOption=(opt)=>advance(opt);
  const handleMultiConfirm=()=>{if(multiSel.length)advance(multiSel);};
  const handleTextSubmit=()=>{const v=customInput.trim();if(v)advance(v);else if(STEPS[step]?.optional)advance("—");};
  const handleSkip=()=>advance("—");

  const curStep=step>=0&&step<STEPS.length?STEPS[step]:null;
  const isDone=step===-1;

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div style={{flex:1,overflowY:"auto",padding:"4px 0"}}>
      {msgs.map((m,i)=>(<div key={i} className="anim-up" style={{animationDelay:`${Math.min(i,4)*30}ms`,marginBottom:8,display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
        <div style={{maxWidth:"85%",padding:"8px 12px",borderRadius:8,background:m.role==="user"?`${P.accent}0A`:P.surface,border:`1px solid ${m.role==="user"?`${P.accent}12`:P.border}`,fontSize:12,color:P.text,lineHeight:1.55}}>{m.content}</div>
      </div>))}
      <div ref={endRef}/>
    </div>

    {/* Options / Input area */}
    {curStep&&!isDone&&(<div style={{paddingTop:8,borderTop:`1px solid ${P.border}`}}>
      {curStep.type==="text"?(
        <div style={{display:"flex",gap:4}}>
          <input value={customInput} onChange={e=>setCustomInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleTextSubmit()} placeholder={curStep.placeholder||"Type here..."} style={{flex:1,padding:"8px 10px",borderRadius:7,background:P.surface,border:`1px solid ${P.border}`,color:P.text,fontSize:11.5,fontFamily:"'Sora'",outline:"none"}}/>
          <button onClick={handleTextSubmit} style={{padding:"8px 14px",borderRadius:7,background:customInput.trim()?P.accent:P.barBg,border:"none",color:customInput.trim()?"#050A18":P.mute,fontSize:10.5,fontWeight:600,cursor:"pointer",fontFamily:"'Sora'"}}>Next</button>
          {curStep.optional&&<button onClick={handleSkip} style={{padding:"8px 10px",borderRadius:7,background:P.barBg,border:`1px solid ${P.border}`,color:P.mute,fontSize:10,cursor:"pointer",fontFamily:"'Sora'"}}>Skip</button>}
        </div>
      ):curStep.multi?(
        <div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>{curStep.options.map(o=>{const sel=multiSel.includes(o);return(<button key={o} onClick={()=>setMultiSel(sel?multiSel.filter(x=>x!==o):[...multiSel,o])} style={{padding:"6px 12px",borderRadius:6,background:sel?`${P.accent}12`:P.barBg,border:`1px solid ${sel?`${P.accent}25`:P.border}`,color:sel?P.accent:P.sub,fontSize:10.5,fontWeight:500,cursor:"pointer",fontFamily:"'Sora'"}}>{o}</button>);})}</div>
          <button onClick={handleMultiConfirm} disabled={!multiSel.length} style={{width:"100%",padding:"7px 0",borderRadius:7,background:multiSel.length?P.accent:P.barBg,border:"none",color:multiSel.length?"#050A18":P.mute,fontSize:10.5,fontWeight:600,cursor:multiSel.length?"pointer":"not-allowed",fontFamily:"'Sora'"}}>Confirm ({multiSel.length} selected)</button>
        </div>
      ):(
        <div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{curStep.options.map(o=>(<button key={o} onClick={()=>handleOption(o)} style={{padding:"6px 13px",borderRadius:6,background:`${P.accent}08`,border:`1px solid ${P.accent}20`,color:P.accent,fontSize:10.5,fontWeight:500,cursor:"pointer",fontFamily:"'Sora'"}}>{o}</button>))}</div>
          {curStep.allowCustom&&(<div style={{display:"flex",gap:4,marginTop:6}}>
            <input value={customInput} onChange={e=>setCustomInput(e.target.value)} placeholder="Or type your own..." style={{flex:1,padding:"6px 10px",borderRadius:6,background:P.surface,border:`1px solid ${P.border}`,color:P.text,fontSize:10.5,fontFamily:"'Sora'",outline:"none"}}/>
            <button onClick={handleTextSubmit} disabled={!customInput.trim()} style={{padding:"6px 10px",borderRadius:6,background:customInput.trim()?P.accent:P.barBg,border:"none",color:customInput.trim()?"#050A18":P.mute,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Sora'"}}>Go</button>
          </div>)}
        </div>
      )}
    </div>)}

    {/* Summary + Submit */}
    {isDone&&(<div style={{paddingTop:8,borderTop:`1px solid ${P.border}`}}>
      <div style={{fontSize:9,color:P.green,fontWeight:600,textTransform:"uppercase",marginBottom:5}}>Brief Summary</div>
      <div style={{background:P.surface,borderRadius:7,padding:"8px 10px",border:`1px solid ${P.green}20`,fontSize:10,color:P.text,lineHeight:1.6}}>
        {data.service&&<div><span style={{color:P.mute}}>Service:</span> {data.service}</div>}
        {data.description&&data.description!=="—"&&<div><span style={{color:P.mute}}>Goal:</span> {data.description}</div>}
        {data.budget&&<div><span style={{color:P.mute}}>Budget:</span> {data.budget}</div>}
        {data.category&&data.category!=="—"&&<div><span style={{color:P.mute}}>Category:</span> {data.category}</div>}
        {data.platforms&&data.platforms!=="—"&&<div><span style={{color:P.mute}}>Platforms:</span> {data.platforms}</div>}
        {data.numCreators&&<div><span style={{color:P.mute}}>Creators:</span> {data.numCreators}</div>}
        {data.creatorNiche&&<div><span style={{color:P.mute}}>Niches:</span> {data.creatorNiche}</div>}
        {data.creatorSize&&<div><span style={{color:P.mute}}>Size:</span> {data.creatorSize}</div>}
        {data.usage&&<div><span style={{color:P.mute}}>Usage:</span> {data.usage}</div>}
        {data.region&&data.region!=="—"&&<div><span style={{color:P.mute}}>Region:</span> {data.region}</div>}
      </div>
      <button onClick={()=>onComplete({svc:data.service||"Influencer Marketing",budget:data._budgetNum||10,description:data.description||"Campaign brief"})} style={{width:"100%",marginTop:8,padding:"9px 0",borderRadius:7,background:P.accent,border:"none",color:"#050A18",fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:"'Sora'"}}>Submit Requirement</button>
    </div>)}
  </div>);}

/* ═══ NEW REQ MODAL ═══ */
function NewReqModal({onClose,onSubmit}){const P=useP();const[mode,setMode]=useState(null);
  const[svc,setSvc]=useState("");const[budgetVal,setBudgetVal]=useState(500000);const[budgetText,setBudgetText]=useState("5");
  const[numCreators,setNumCreators]=useState(5);const[niches,setNiches]=useState([]);const[sizes,setSizes]=useState([]);const[ageGroups,setAgeGroups]=useState([]);const[regions,setRegions]=useState([]);const[tiers,setTiers]=useState([]);const[languages,setLanguages]=useState([]);const[platforms,setPlatforms]=useState([]);
  const[products,setProducts]=useState([]);const[productVols,setProductVols]=useState({});const[usage,setUsage]=useState("");const[adDays,setAdDays]=useState(30);
  const[description,setDescription]=useState("");const[refLink,setRefLink]=useState("");const[brandCat,setBrandCat]=useState("");const[poc1,setPoc1]=useState("");const[poc2,setPoc2]=useState("");const[creatorDesc,setCreatorDesc]=useState("");

  const handleBudgetInput=(v)=>{setBudgetText(v);const num=parseFloat(v);if(!isNaN(num)&&num>=0&&num<=150)setBudgetVal(num);};
  const toggleProduct=(id)=>{if(products.includes(id)){setProducts(products.filter(p=>p!==id));const pv={...productVols};delete pv[id];setProductVols(pv);}else setProducts([...products,id]);};
  const is={width:"100%",padding:"7px 10px",borderRadius:6,background:P.inputBg,border:`1px solid ${P.border}`,color:P.text,fontSize:11.5,fontFamily:"'Sora'",outline:"none"};
  const ls={fontSize:8.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:4,display:"block"};
  const canSubmit=svc&&parseFloat(budgetText)>0&&description.trim();
  const showPlatform=svc==="Influencer Marketing";

  return(<div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div onClick={onClose} className="fade-in" style={{position:"absolute",inset:0,background:"rgba(3,6,16,0.82)",backdropFilter:"blur(6px)"}}/>
    <div className="anim-up" style={{position:"relative",width:"min(560px,94vw)",maxHeight:"90vh",background:P.bg,border:`1px solid ${P.border}`,borderRadius:14,overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 18px 10px",borderBottom:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h3 style={{fontFamily:"'Newsreader',serif",fontSize:17,fontWeight:600,color:P.white,margin:0,fontStyle:"italic"}}>New Requirement</h3></div>
        <div style={{display:"flex",gap:3}}>{mode&&<button onClick={()=>setMode(null)} style={{padding:"3px 7px",borderRadius:4,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,fontSize:9,cursor:"pointer",fontFamily:"'Sora'"}}>← Back</button>}
          <button onClick={onClose} style={{width:24,height:24,borderRadius:5,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora'"}}>✕</button></div></div>
      <div style={{padding:"12px 18px 18px",overflowY:"auto",flex:1}}>
        {!mode&&(<div style={{display:"flex",gap:10,padding:"16px 0"}}>
          <div onClick={()=>setMode("chat")} style={{flex:1,background:P.surface,border:`1px solid ${P.border}`,borderRadius:12,padding:"22px 16px",cursor:"pointer",textAlign:"center"}} onMouseOver={e=>e.currentTarget.style.borderColor=`${P.accent}40`} onMouseOut={e=>e.currentTarget.style.borderColor=P.border}>
            <div style={{fontSize:24,marginBottom:8}}>💬</div><div style={{fontSize:12,fontWeight:600,color:P.text,marginBottom:3}}>Guided Brief</div><div style={{fontSize:10,color:P.sub,lineHeight:1.5}}>Answer step-by-step questions. We'll build the brief for you.</div></div>
          <div onClick={()=>setMode("form")} style={{flex:1,background:P.surface,border:`1px solid ${P.border}`,borderRadius:12,padding:"22px 16px",cursor:"pointer",textAlign:"center"}} onMouseOver={e=>e.currentTarget.style.borderColor=`${P.accent}40`} onMouseOut={e=>e.currentTarget.style.borderColor=P.border}>
            <div style={{fontSize:24,marginBottom:8}}>📋</div><div style={{fontSize:12,fontWeight:600,color:P.text,marginBottom:3}}>Manual Form</div><div style={{fontSize:10,color:P.sub,lineHeight:1.5}}>Fill each field yourself.</div></div>
        </div>)}
        {mode==="chat"&&<GuidedBriefWizard onComplete={d=>onSubmit({svc:d.svc||d.service||"Influencer Marketing",budget:d.budget||5,description:d.description||"Campaign brief"})}/>}
        {mode==="form"&&(<>
          <div style={{marginBottom:10}}><label style={ls}>Service</label><div style={{display:"flex",gap:4}}>{SERVICES_ALL.map(s=>(<button key={s} onClick={()=>setSvc(s)} style={{flex:1,padding:"6px 0",borderRadius:5,fontSize:10,fontWeight:500,background:svc===s?`${P.accent}12`:P.barBg,border:`1px solid ${svc===s?`${P.accent}30`:P.border}`,color:svc===s?P.accent:P.sub,cursor:"pointer",fontFamily:"'Sora'"}}>{s}</button>))}</div></div>
          <div style={{marginBottom:10}}><label style={ls}>Description</label><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={2} placeholder="What do you want to achieve..." style={{...is,resize:"vertical",lineHeight:1.5}}/></div>
          <div style={{marginBottom:10}}><label style={ls}>Brand Category</label><DropdownSelect options={["Snacks","Beverages","Health","Fashion","Beauty","Tech","FMCG","D2C"]} value={brandCat} onChange={setBrandCat} placeholder="Select..." allowNew/></div>
          <div style={{display:"flex",gap:7,marginBottom:10}}><div style={{flex:1}}><label style={ls}>POC 1</label><DropdownSelect options={TEAM.map(m=>`${m.name} (${m.role})`)} value={poc1} onChange={setPoc1} placeholder="Select..."/></div>
            <div style={{flex:1}}><label style={ls}>POC 2</label><DropdownSelect options={TEAM.map(m=>`${m.name} (${m.role})`)} value={poc2} onChange={setPoc2} placeholder="Select..."/></div></div>

          {/* Budget — slider + manual, capped at 1.5CR (150L) */}
          <div style={{marginBottom:10}}><label style={ls}>Budget (Lakhs ₹) — max 1.5 Cr</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input type="range" min={1} max={150} step={0.5} value={parseFloat(budgetText)||1} onChange={e=>{setBudgetText(e.target.value);}} style={{flex:1,height:4,appearance:"none",background:`linear-gradient(to right,${P.accent} ${((parseFloat(budgetText)||1)/150)*100}%,${P.barBg} ${((parseFloat(budgetText)||1)/150)*100}%)`,borderRadius:2,outline:"none",cursor:"pointer"}}/>
              <div style={{display:"flex",alignItems:"center",gap:2}}>
                <span style={{fontSize:11,color:P.mute}}>₹</span>
                <input type="number" min={1} max={150} step={0.5} value={budgetText} onChange={e=>handleBudgetInput(e.target.value)} style={{width:50,padding:"4px 6px",borderRadius:4,background:P.inputBg,border:`1px solid ${P.border}`,color:P.text,fontSize:11,fontFamily:"'Sora'",textAlign:"center",outline:"none"}}/>
                <span style={{fontSize:10,color:P.mute}}>L</span>
              </div>
            </div>
          </div>

          {showPlatform&&<div style={{marginBottom:10}}><label style={ls}>Platform</label><ChipSelect options={PLATFORMS} selected={platforms} onChange={setPlatforms}/></div>}
          {svc==="Influencer Marketing"&&(<>
            <div style={{marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={{...ls,marginBottom:0}}>Number of Creators</label><Stepper value={numCreators} onChange={setNumCreators}/></div>
            <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:7,padding:"9px 11px",marginBottom:10}}>
              <div style={{...ls,marginBottom:6}}>Creator Requirements</div>
              <div style={{marginBottom:6}}><label style={{...ls,fontSize:7.5}}>Niche</label><ChipSelect options={NICHES} selected={niches} onChange={setNiches}/></div>
              <div style={{marginBottom:6}}><label style={{...ls,fontSize:7.5}}>Size</label><ChipSelect options={SIZES} selected={sizes} onChange={setSizes}/></div>
              <div style={{marginBottom:6}}><label style={{...ls,fontSize:7.5}}>Age</label><ChipSelect options={AGE_GROUPS} selected={ageGroups} onChange={setAgeGroups}/></div>
              <div style={{marginBottom:6}}><label style={{...ls,fontSize:7.5}}>Region</label><ChipSelect options={REGIONS_ST} selected={regions} onChange={setRegions}/></div>
              <div style={{display:"flex",gap:6,marginBottom:6}}><div style={{flex:1}}><label style={{...ls,fontSize:7.5}}>Tier</label><ChipSelect options={TIERS} selected={tiers} onChange={setTiers}/></div>
                <div style={{flex:1}}><label style={{...ls,fontSize:7.5}}>Language</label><DropdownSelect options={LANGUAGES} value="" onChange={v=>{if(!languages.includes(v))setLanguages([...languages,v]);}} placeholder="Add..."/></div></div>
              {languages.length>0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5}}>{languages.map(l=>(<span key={l} style={{fontSize:8.5,color:P.accent,background:`${P.accent}12`,padding:"2px 5px",borderRadius:3,display:"flex",alignItems:"center",gap:2}}>{l}<button onClick={()=>setLanguages(languages.filter(x=>x!==l))} style={{background:"none",border:"none",color:P.mute,cursor:"pointer",fontSize:8,padding:0}}>×</button></span>))}</div>}
            </div>
            <div style={{marginBottom:10}}><label style={ls}>Product & Volume</label><div style={{display:"flex",flexDirection:"column",gap:3}}>{IM_PRODUCTS.map(p=>{const a=products.includes(p.id);return(<div key={p.id} style={{display:"flex",alignItems:"center",gap:5}}><button onClick={()=>toggleProduct(p.id)} style={{flex:1,padding:"5px 9px",borderRadius:5,fontSize:9.5,fontWeight:500,textAlign:"left",background:a?`${P.accent}10`:P.barBg,border:`1px solid ${a?`${P.accent}25`:P.border}`,color:a?P.accent:P.sub,cursor:"pointer",fontFamily:"'Sora'"}}>{p.label}</button>
              {a&&<input type="number" min={1} value={productVols[p.id]||1} onChange={e=>setProductVols({...productVols,[p.id]:Math.max(1,parseInt(e.target.value)||1)})} style={{width:42,padding:"4px",borderRadius:4,background:P.inputBg,border:`1px solid ${P.border}`,color:P.text,fontSize:10,fontFamily:"'Sora'",textAlign:"center",outline:"none"}}/>}</div>);})}</div></div>
            <div style={{marginBottom:10}}><label style={ls}>Usage Rights</label><div style={{display:"flex",gap:4}}>{[{id:"ad",label:"Ad Rights"},{id:"media",label:"Media (Perpetual)"}].map(u=>(<button key={u.id} onClick={()=>setUsage(u.id)} style={{flex:1,padding:"6px 0",borderRadius:5,fontSize:10,fontWeight:500,background:usage===u.id?`${P.accent}12`:P.barBg,border:`1px solid ${usage===u.id?`${P.accent}25`:P.border}`,color:usage===u.id?P.accent:P.sub,cursor:"pointer",fontFamily:"'Sora'"}}>{u.label}</button>))}</div>
              {usage==="ad"&&<div style={{marginTop:5}}><Slider value={adDays} onChange={setAdDays} min={7} max={365} step={1} suffix="d"/></div>}</div>
            <div style={{marginBottom:10}}><label style={ls}>Reference Creator</label><input value={refLink} onChange={e=>setRefLink(e.target.value)} placeholder="Profile link..." style={is}/></div>
          </>)}
          {svc==="AEO"&&<div style={{marginBottom:10}}><label style={ls}>Target Queries</label><textarea value={creatorDesc} onChange={e=>setCreatorDesc(e.target.value)} rows={3} placeholder="Queries to rank for..." style={{...is,resize:"vertical"}}/></div>}
          {svc==="Offline Activation"&&<><div style={{marginBottom:10}}><label style={ls}>Activation Type</label><textarea value={creatorDesc} onChange={e=>setCreatorDesc(e.target.value)} rows={2} placeholder="Pop-up, sampling..." style={{...is,resize:"vertical"}}/></div><div style={{marginBottom:10}}><label style={ls}>Locations</label><input value={refLink} onChange={e=>setRefLink(e.target.value)} placeholder="Mumbai, Bangalore..." style={is}/></div></>}
          <button onClick={()=>{if(canSubmit)onSubmit({svc,budget:parseFloat(budgetText),description});}} style={{width:"100%",padding:"9px 0",borderRadius:7,background:canSubmit?P.accent:P.barBg,border:"none",color:canSubmit?"#050A18":P.mute,fontSize:11,fontWeight:600,cursor:canSubmit?"pointer":"not-allowed",fontFamily:"'Sora'"}}>Submit</button>
        </>)}
      </div>
    </div>
  </div>);}

/* ═══ CARD ═══ */
function Card({campaign:c,onClick,delay=0}){const P=useP();const[hov,setHov]=useState(false);const done=c.phase==="completed";const pending=c.status==="pending";
  return(<div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} className="anim-up" style={{animationDelay:`${delay}ms`,background:done?P.done:(hov?P.hover:P.card),border:`1.5px solid ${pending?P.amber+"60":hov&&!done?P.accent+"30":P.border}`,borderRadius:11,padding:"13px 15px",cursor:"pointer",transition:"all 0.25s ease",transform:hov?"translateY(-1px)":"none",opacity:done?0.5:1}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
      <div style={{flex:1,minWidth:0}}><h3 style={{margin:0,fontSize:12.5,fontWeight:500,color:P.white,fontFamily:"'Sora'",lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</h3></div>
      {pending&&<span style={{fontSize:7.5,color:P.amber,fontWeight:600,textTransform:"uppercase",background:`${P.amber}15`,padding:"2px 6px",borderRadius:4,flexShrink:0}}>Pending</span>}
    </div>
    <div style={{display:"flex",gap:14,marginTop:10,alignItems:"flex-end"}}>
      {[["Reach",c.reach],["Eng.",c.engagement]].map(([l,v])=>(<div key={l}><div style={{fontSize:7.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{l}</div><div style={{fontSize:12.5,fontWeight:600,color:done?P.doneTxt:P.text,marginTop:1}}>{v}</div></div>))}
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:10,color:done?P.doneTxt:P.sub}}>{c.start}—{c.end}</span><Donut value={c.progress}/></div>
    </div>
    <div style={{overflow:"hidden",maxHeight:hov?22:0,opacity:hov?1:0,transition:"all 0.25s ease",marginTop:hov?7:0,display:"flex",gap:4}}>
      {[c.service,c.region].map(t=>(<span key={t} style={{fontSize:8.5,color:P.sub,padding:"2px 5px",background:P.barBg,borderRadius:3}}>{t}</span>))}</div>
  </div>);}

/* ═══ DETAIL PANEL ═══ */
function DetailPanel({campaign:c,onClose,userRole}){const P=useP();
  const[tab,setTab]=useState("overview");const chatEndRef=useRef(null);const[chatInput,setChatInput]=useState("");
  const[messages,setMessages]=useState(c.chat||[]);const[creators,setCreators]=useState(c.creators||[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages,tab]);
  const sendMsg=()=>{if(!chatInput.trim())return;setMessages(p=>[...p,{from:"You",role:"client",time:"Just now",msg:chatInput.trim()}]);setChatInput("");};

  const updateApproval=(idx,role,val)=>{setCreators(prev=>prev.map((cr,i)=>{if(i!==idx)return cr;const a={...cr.approval};
    if(role.endsWith("Lock")){a[role.replace("Lock","")+"Locked"]=true;}else{a[role]=val;}
    return{...cr,approval:a};}));};

  const isAEO=c.service==="AEO";const numCr=creators.length;
  const numDel=creators.reduce((s,cr)=>{const m=cr.deliverables.match(/\d+/g);return s+(m?m.reduce((a,n)=>a+parseInt(n),0):0);},0);
  const needsAction=creators.filter(cr=>["pending_brand","in_negotiation","rework","concept_received","video_received"].includes(cr.status));

  const mkBD=(f)=>{if(!creators.length)return[];const g={};creators.forEach(cr=>{g[cr[f]||"Other"]=(g[cr[f]||"Other"]||0)+1;});return Object.entries(g).map(([k,v])=>({label:k,value:v}));};
  const bd=creators.length?{niche:mkBD("niche"),size:mkBD("size"),region:mkBD("region")}:null;
  const engByCreator=creators.filter(c2=>c2.engRate!=="—").map(c2=>({label:c2.name.split(" ")[0],value:parseFloat(c2.engRate)}));
  const engByNiche=(()=>{const g={},c2={};creators.forEach(cr=>{if(cr.engRate!=="—"){const n=cr.niche;g[n]=(g[n]||0)+parseFloat(cr.engRate);c2[n]=(c2[n]||0)+1;}});return Object.entries(g).map(([k,v])=>({label:k,value:Math.round((v/c2[k])*10)/10}));})();
  const engBD=creators.length?{creator:engByCreator,niche:engByNiche}:null;

  const tabs=[{id:"overview",label:"Overview"},{id:"brief",label:"Brief"},...(!isAEO?[{id:"creators",label:"Creators",count:numCr||null}]:[]),...(c.queries?[{id:"queries",label:"Queries"}]:[]),{id:"chat",label:"Chat",count:messages.length||null}];

  return(<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",justifyContent:"flex-end"}}>
    <div onClick={onClose} className="fade-in" style={{position:"absolute",inset:0,background:"rgba(3,6,16,0.8)",backdropFilter:"blur(6px)"}}/>
    <div className="slide-in" style={{position:"relative",width:"min(680px,94vw)",background:P.bg,borderLeft:`1px solid ${P.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"14px 18px 0",borderBottom:`1px solid ${P.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{flex:1}}><h2 style={{fontFamily:"'Newsreader',serif",fontSize:19,fontWeight:600,color:P.white,margin:0,fontStyle:"italic"}}>{c.name}</h2>
            <span style={{fontSize:9,color:P.accent,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em"}}>{c.service}</span>
            <p style={{fontSize:10.5,color:P.sub,margin:"3px 0 0",lineHeight:1.5}}>{c.brief}</p></div>
          <button onClick={onClose} style={{width:24,height:24,borderRadius:5,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora'",flexShrink:0}}>✕</button></div>
        {needsAction.length>0&&(<div style={{padding:"5px 9px",borderRadius:5,marginBottom:7,background:`${P.amber}08`,border:`1px solid ${P.amber}15`,display:"flex",alignItems:"center",gap:5}}>
          <Dot color={P.amber}/><span style={{fontSize:10,color:P.amber,flex:1}}>{needsAction.length} need{needsAction.length===1?"s":""} input</span>
          <button onClick={()=>setTab("creators")} style={{fontSize:9.5,color:P.accent,background:"none",border:"none",cursor:"pointer",fontFamily:"'Sora'",fontWeight:500}}>Review →</button></div>)}
        <div style={{display:"flex"}}>{tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"6px 11px",fontSize:9.5,fontWeight:500,background:"none",border:"none",cursor:"pointer",color:tab===t.id?P.accent:P.mute,borderBottom:tab===t.id?`2px solid ${P.accent}`:"2px solid transparent",fontFamily:"'Sora'",display:"flex",alignItems:"center",gap:3}}>
          {t.label}{t.count!=null&&<span style={{fontSize:7.5,fontWeight:700,background:tab===t.id?`${P.accent}15`:P.barBg,color:tab===t.id?P.accent:P.mute,padding:"1px 4px",borderRadius:4}}>{t.count}</span>}
        </button>))}</div></div>

      <div style={{flex:1,overflowY:"auto",padding:"12px 18px 18px"}}>
        {tab==="overview"&&(<div>
          <PhaseTracker currentPhase={c.phase}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:5}}>
            <BudgetCard value={c.budget} creators={creators}/>
            <MetricCard label="Reach" value={c.reach} breakdowns={bd}/>
            <MetricCard label="Views" value={c.views} breakdowns={bd}/>
            <MetricCard label="Impressions" value={c.impressions} breakdowns={bd}/>
            <MetricCard label="Creators" value={`${numCr}`}/>
            <MetricCard label="Deliverables" value={`${numDel}`}/>
          </div>
          <EngagementCard value={c.engRate} breakdowns={engBD}/>
          <div style={{background:P.surface,borderRadius:8,padding:"10px 12px",border:`1px solid ${P.border}`,marginTop:5,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:7.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>Timeline</div><div style={{fontSize:11,color:P.text,fontWeight:500,marginTop:2}}>{c.start} — {c.end}</div></div>
              <span style={{fontSize:11,fontWeight:600,color:P.accent}}>{c.progress}%</span></div>
            <div style={{height:3,background:P.barBg,borderRadius:2,marginTop:5}}><div style={{width:`${c.progress}%`,height:"100%",background:P.accent,borderRadius:2}}/></div></div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",padding:"8px 12px",background:P.surface,borderRadius:7,border:`1px solid ${P.border}`,marginBottom:10}}>
            {[["Service",c.service],["Region",c.region],["Vendor",c.vendor]].map(([k,v])=>(<div key={k}><div style={{fontSize:7,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{k}</div><div style={{fontSize:10.5,color:P.text,fontWeight:500,marginTop:1}}>{v}</div></div>))}</div>
          {c.topAssets?.length>0&&(<div><div style={{fontSize:8,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:6}}>Top Performing Assets</div>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:3}}>{c.topAssets.map((a,i)=>(<div key={i} style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:9,padding:"10px 12px",minWidth:130,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:`${P.accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:P.accent}}>{a.avatar}</div>
              <span style={{fontSize:9.5,fontWeight:500,color:P.text}}>{a.creator}</span><span style={{fontSize:8.5,color:P.accent}}>{a.handle}</span><span style={{fontSize:8,color:P.sub}}>{a.label}</span>
              <a href={a.link} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:8,color:P.accent,textDecoration:"none",background:`${P.accent}10`,padding:"2px 6px",borderRadius:3}}>View →</a>
            </div>))}</div>
            <Observations creators={creators} topAssets={c.topAssets}/>
          </div>)}
        </div>)}

        {tab==="brief"&&<BriefPage lockedBrief={c.lockedBrief} pendingBrief={c.pendingBrief}/>}

        {tab==="creators"&&(<div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8,padding:"4px 8px",borderRadius:4,background:`${P.accent}04`,border:`1px solid ${P.accent}08`}}>
            <span style={{fontSize:8.5,color:P.sub}}>Viewing as</span><span style={{fontSize:8,fontWeight:600,color:P.accent,background:`${P.accent}12`,padding:"2px 5px",borderRadius:3,textTransform:"uppercase"}}>{userRole==="management"?"Mgmt":"Exec"}</span></div>
          {creators.length>0?creators.map((cr,i)=><CreatorRow key={i} cr={cr} idx={i} userRole={userRole} onUpdateApproval={updateApproval}/>):(
            <div style={{textAlign:"center",padding:"34px 20px"}}><div style={{fontSize:24,marginBottom:6,opacity:0.12}}>{["👤","👤","👤"].map((e,i)=>(<span key={i} className="bounce-1" style={{display:"inline-block",animationDelay:`${i*0.15}s`,margin:"0 1px"}}>{e}</span>))}</div>
              <div style={{fontSize:11,color:P.sub}}>No creators yet</div></div>)}
        </div>)}

        {tab==="queries"&&c.queries?.map((q,i)=>(<div key={i} className="anim-up" style={{animationDelay:`${i*30}ms`,background:P.surface,border:`1px solid ${P.border}`,borderRadius:7,padding:"8px 11px",marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
          <div style={{flex:2}}><div style={{fontSize:11,fontWeight:500,color:P.text}}>{q.query}</div><div style={{fontSize:9,color:P.mute,marginTop:1}}>{q.volume}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:3}}><Dot color={q.status==="live"?P.green:P.amber}/><span style={{fontSize:9.5,color:P.sub,textTransform:"capitalize"}}>{q.status}</span></div>
          <span style={{fontSize:9.5,fontWeight:q.position!=="—"?600:400,color:q.position!=="—"?P.green:P.mute}}>{q.position}</span>
          <span style={{fontSize:9,color:P.mute}}>{q.engine}</span></div>))}

        {tab==="chat"&&(<div>
          {messages.length===0&&<div style={{textAlign:"center",padding:"30px 20px",color:P.mute,fontSize:10.5}}>No messages yet.</div>}
          {messages.map((m,i)=>{const isYou=m.from==="You";const rc=m.role==="management"?P.accent:m.role==="execution"?P.pink:P.mute;return(
            <div key={i} className="anim-up" style={{animationDelay:`${i*15}ms`,marginBottom:6,display:"flex",flexDirection:"column",alignItems:isYou?"flex-end":"flex-start"}}>
              <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:2}}>
                <span style={{fontSize:9.5,fontWeight:500,color:P.text}}>{m.from}</span>
                {!isYou&&m.role!=="system"&&<span style={{fontSize:7,color:rc,textTransform:"uppercase",fontWeight:600,background:`${rc}15`,padding:"1px 3px",borderRadius:2}}>{m.role}</span>}
                <span style={{fontSize:8,color:P.mute}}>{m.time}</span></div>
              <div style={{maxWidth:"78%",padding:"6px 10px",borderRadius:7,background:isYou?`${P.accent}0A`:P.surface,border:`1px solid ${isYou?`${P.accent}12`:P.border}`,fontSize:11,color:P.text,lineHeight:1.55}}>{m.msg}</div>
            </div>);})}
          <div ref={chatEndRef}/></div>)}
      </div>

      {tab==="chat"&&(<div style={{padding:"7px 18px",borderTop:`1px solid ${P.border}`,background:P.bg,flexShrink:0}}>
        <div style={{display:"flex",gap:4,alignItems:"center",background:P.surface,borderRadius:6,padding:"3px 3px 3px 10px",border:`1px solid ${P.border}`}}>
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Type..."
            style={{flex:1,background:"none",border:"none",outline:"none",color:P.text,fontSize:10.5,fontFamily:"'Sora'"}}/>
          <button onClick={sendMsg} style={{padding:"5px 10px",borderRadius:5,background:chatInput.trim()?P.accent:P.barBg,border:"none",color:chatInput.trim()?"#050A18":P.mute,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Sora'"}}>Send</button>
        </div>
      </div>)}
    </div>
  </div>);}

/* ═══ MAIN ═══ */
export default function CampaignsPage(){
  const { P, theme, setTheme, setPage, navParams } = useApp();
  const[campaigns,setCampaigns]=useState(INIT_CAMPAIGNS);const[selected,setSelected]=useState(null);
  const[view,setView]=useState("board");const[search,setSearch]=useState("");
  const[userRole,setUserRole]=useState("management");const[showNewReq,setShowNewReq]=useState(false);
  const[toast,setToast]=useState("");const[svcFilter,setSvcFilter]=useState("all");

  // Auto-open campaign when navigated from another page
  useEffect(() => {
    if (navParams?.campaignId) {
      const match = campaigns.find(c => c.id === navParams.campaignId || c.name === navParams.campaignId);
      if (match) setSelected(match);
    }
  }, [navParams?.campaignId]);
  const handleSubmit=(form)=>{
    setCampaigns(p=>[{id:Date.now(),name:form.description?.slice(0,35)||`${form.svc} Campaign`,service:form.svc,region:"—",phase:"brief",progress:0,reach:"—",engagement:"—",impressions:"—",engRate:"—",views:"—",start:"—",end:"—",budget:`₹${form.budget}L`,vendor:"Pending",brief:form.description||"",lockedBrief:null,status:"pending",creators:[],topAssets:[],chat:[],
      pendingBrief:{objective:form.description||"",targetAudience:"",keyMessages:"",deliverables:"",budget:`₹${form.budget}L`,timeline:"",vars:{objective:"pending",targetAudience:"waiting",keyMessages:"waiting",deliverables:"waiting",budget:"pending",timeline:"waiting"}}},...p]);
    setShowNewReq(false);setToast("Requirement submitted!");setTimeout(()=>setToast(""),3000);};

  const filtered=campaigns.filter(c=>{if(search&&!c.name.toLowerCase().includes(search.toLowerCase()))return false;if(svcFilter!=="all"&&c.service!==svcFilter)return false;return true;});
  const allServices=[...new Set(campaigns.map(c=>c.service))];

  return(<>
    <div style={{fontFamily:"'Sora',sans-serif",background:P.bg,color:P.text,minHeight:"100vh",transition:"background 0.3s"}}>
      <div style={{maxWidth:1360,margin:"0 auto",padding:"0 28px"}}>
        <header style={{padding:"24px 0 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:8}}>
            <h1 style={{fontFamily:"'Newsreader',serif",fontSize:26,fontWeight:400,color:P.white,margin:0,fontStyle:"italic"}}>Campaigns</h1>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{display:"flex",gap:12,alignItems:"baseline"}}>
                {campaigns.filter(c=>c.status==="pending").length>0&&<div style={{display:"flex",alignItems:"baseline",gap:2}}><span style={{fontSize:14,fontWeight:600,color:P.amber}}>{campaigns.filter(c=>c.status==="pending").length}</span><span style={{fontSize:8.5,color:P.mute}}>Pending</span></div>}
                <div style={{display:"flex",alignItems:"baseline",gap:2}}><span style={{fontSize:14,fontWeight:600,color:P.text}}>{campaigns.filter(c=>c.status==="active").length}</span><span style={{fontSize:8.5,color:P.mute}}>Active</span></div>
                <div style={{display:"flex",alignItems:"baseline",gap:2}}><span style={{fontSize:14,fontWeight:600,color:P.doneTxt}}>{campaigns.filter(c=>c.status==="done").length}</span><span style={{fontSize:8.5,color:P.mute}}>Done</span></div></div>
              <button onClick={()=>setShowNewReq(true)} style={{padding:"6px 13px",borderRadius:6,background:P.accent,border:"none",color:"#050A18",fontSize:10.5,fontWeight:600,cursor:"pointer",fontFamily:"'Sora'"}}>+ New</button>
            </div></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,paddingTop:10,borderTop:`1px solid ${P.border}`,gap:6,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:5,background:P.surface,border:`1px solid ${P.border}`,borderRadius:5,padding:"4px 8px",width:160}}>
                <span style={{color:P.mute,fontSize:10}}>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:"none",border:"none",outline:"none",color:P.text,fontSize:10,fontFamily:"'Sora'",width:"100%"}}/></div>
              {/* Service filter */}
              <div style={{display:"flex",background:P.surface,borderRadius:5,border:`1px solid ${P.border}`,overflow:"hidden"}}>
                <button onClick={()=>setSvcFilter("all")} style={{padding:"4px 8px",fontSize:8.5,fontWeight:500,background:svcFilter==="all"?`${P.accent}10`:"transparent",border:"none",color:svcFilter==="all"?P.accent:P.mute,cursor:"pointer",fontFamily:"'Sora'"}}>All</button>
                {allServices.map(s=>(<button key={s} onClick={()=>setSvcFilter(s)} style={{padding:"4px 8px",fontSize:8.5,fontWeight:500,background:svcFilter===s?`${P.accent}10`:"transparent",border:"none",color:svcFilter===s?P.accent:P.mute,cursor:"pointer",fontFamily:"'Sora'",whiteSpace:"nowrap"}}>{s==="Influencer Marketing"?"IM":s==="Performance Ads"?"Ads":s}</button>))}
              </div>
            </div>
            <div style={{display:"flex",gap:3,alignItems:"center"}}>
              <div style={{display:"flex",background:P.surface,borderRadius:5,border:`1px solid ${P.border}`,overflow:"hidden"}}>
                {[["board","Board"],["grid","Grid"]].map(([k,l])=>(<button key={k} onClick={()=>setView(k)} style={{padding:"4px 9px",fontSize:9,fontWeight:500,background:view===k?`${P.accent}10`:"transparent",border:"none",color:view===k?P.accent:P.mute,cursor:"pointer",fontFamily:"'Sora'"}}>{l}</button>))}</div>
              <div style={{display:"flex",background:P.surface,borderRadius:5,border:`1px solid ${P.border}`,overflow:"hidden",marginLeft:2}}>
                {[["management","Mgmt"],["execution","Exec"]].map(([k,l])=>(<button key={k} onClick={()=>setUserRole(k)} style={{padding:"4px 7px",fontSize:8,fontWeight:500,background:userRole===k?`${P.accent}10`:"transparent",border:"none",color:userRole===k?P.accent:P.mute,cursor:"pointer",fontFamily:"'Sora'",textTransform:"uppercase"}}>{l}</button>))}</div>
            </div></div>
        </header>

        {toast&&<div className="anim-up" style={{padding:"6px 10px",borderRadius:5,marginBottom:8,background:`${P.green}0A`,border:`1px solid ${P.green}18`,display:"flex",alignItems:"center",gap:5}}><Dot color={P.green}/><span style={{fontSize:10.5,color:P.green,fontWeight:500}}>{toast}</span></div>}

        {view==="board"&&(<div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:32,minHeight:"52vh"}}>
          {PHASES.map((phase,pi)=>{const items=filtered.filter(c=>c.phase===phase.id);return(<div key={phase.id} className="anim-up" style={{animationDelay:`${pi*35}ms`,flex:`1 1 ${100/PHASES.length}%`,minWidth:190,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 5px",marginBottom:4}}><span style={{fontSize:8.5,fontWeight:600,color:P.sub,textTransform:"uppercase",letterSpacing:"0.06em"}}>{phase.label}</span><span style={{fontSize:8.5,fontWeight:600,color:P.mute}}>{items.length}</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:5,flex:1}}>{items.map((c,ci)=><Card key={c.id} campaign={c} delay={pi*35+ci*25} onClick={()=>setSelected(c)}/>)}
              {items.length===0&&<div style={{border:`1px dashed ${P.border}`,borderRadius:8,padding:"16px 6px",textAlign:"center",color:P.mute,fontSize:9,flex:1,display:"flex",alignItems:"center",justifyContent:"center",minHeight:45}}>—</div>}</div>
          </div>);})}
        </div>)}
        {view==="grid"&&(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:6,paddingBottom:32}}>{filtered.map((c,i)=><Card key={c.id} campaign={c} delay={i*25} onClick={()=>setSelected(c)}/>)}</div>)}
      </div>
      {selected&&<DetailPanel campaign={selected} onClose={()=>setSelected(null)} userRole={userRole}/>}
      {showNewReq&&<NewReqModal onClose={()=>setShowNewReq(false)} onSubmit={handleSubmit}/>}
      <style>{`*{box-sizing:border-box;margin:0}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.12);border-radius:2px}@keyframes animUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.anim-up{animation:animUp .32s cubic-bezier(.25,.46,.45,.94) both}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.fade-in{animation:fadeIn .2s ease both}@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}.slide-in{animation:slideIn .22s cubic-bezier(.25,.46,.45,.94) both}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}.bounce-1{animation:bounce 1.4s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:0.8}}input::placeholder,textarea::placeholder{color:${P.mute}}input[type=range]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;border-radius:50%;background:${P.accent};cursor:pointer;border:2px solid ${P.bg}}`}</style>
    </div>
  </>);}
