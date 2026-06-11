import { useState, useEffect, useMemo } from "react";
import { useApp, DARK, LIGHT } from "../context";

/* Month parsing helpers */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const INVOICES = [
  {id:"INV-2026-018",date:"Apr 15, 2026",due:"Apr 30, 2026",monthIdx:3,year:2026,amount:350000,status:"pending",type:"retainer",label:"Monthly Retainer — April 2026",autopay:true,items:[{desc:"Monthly Retainer Fee",amt:250000},{desc:"Platform Access Fee",amt:50000},{desc:"Account Management",amt:50000}]},
  {id:"INV-2026-017",date:"Apr 10, 2026",due:"Apr 25, 2026",monthIdx:3,year:2026,amount:125000,status:"pending",type:"campaign",label:"Diwali Festive Push — Boosting Top-up",campaign:"Diwali Festive Push",items:[{desc:"Creator Boosting Budget (3 Reels)",amt:100000},{desc:"Platform Boosting Fee",amt:25000}]},
  {id:"INV-2026-016",date:"Apr 1, 2026",due:"Apr 15, 2026",monthIdx:3,year:2026,amount:80000,status:"overdue",type:"campaign",label:"Summer Launch Teaser — Strategy Fee",campaign:"Summer Launch Teaser",items:[{desc:"Strategy & Brief Development",amt:60000},{desc:"Creator Research & AI Shortlisting",amt:20000}]},
  {id:"INV-2026-015",date:"Mar 15, 2026",due:"Mar 30, 2026",monthIdx:2,year:2026,amount:350000,status:"paid",type:"retainer",label:"Monthly Retainer — March 2026",autopay:true,paidOn:"Mar 28, 2026",paidVia:"UPI Autopay",items:[{desc:"Monthly Retainer Fee",amt:250000},{desc:"Platform Access Fee",amt:50000},{desc:"Account Management",amt:50000}]},
  {id:"INV-2026-014",date:"Mar 10, 2026",due:"Mar 25, 2026",monthIdx:2,year:2026,amount:450000,status:"paid",type:"campaign",label:"Diwali Festive Push — Creator Fees (Batch 1)",campaign:"Diwali Festive Push",paidOn:"Mar 22, 2026",paidVia:"UPI",items:[{desc:"Anjali Kitchen — 2 Reels + 3 Stories",amt:150000},{desc:"South Foodie — 1 Longform + 2 Shorts",amt:180000},{desc:"Taste of Madras — 2 Reels",amt:80000},{desc:"Platform Processing Fee",amt:40000}]},
  {id:"INV-2026-013",date:"Mar 1, 2026",due:"Mar 15, 2026",monthIdx:2,year:2026,amount:150000,status:"paid",type:"campaign",label:"Snack Box Paid Ads — Ad Spend (Month 1)",campaign:"Snack Box — Paid Ads",paidOn:"Mar 12, 2026",paidVia:"Bank Transfer",items:[{desc:"Meta Ad Spend",amt:80000},{desc:"Google Ad Spend",amt:55000},{desc:"Agency Management Fee",amt:15000}]},
  {id:"INV-2026-012",date:"Feb 15, 2026",due:"Mar 1, 2026",monthIdx:1,year:2026,amount:350000,status:"paid",type:"retainer",label:"Monthly Retainer — February 2026",autopay:true,paidOn:"Feb 27, 2026",paidVia:"UPI Autopay",items:[{desc:"Monthly Retainer Fee",amt:250000},{desc:"Platform Access Fee",amt:50000},{desc:"Account Management",amt:50000}]},
  {id:"INV-2026-011",date:"Feb 1, 2026",due:"Feb 15, 2026",monthIdx:1,year:2026,amount:385000,status:"paid",type:"campaign",label:"Micro-Influencer Wave — Full Campaign",campaign:"Micro-Influencer Wave",paidOn:"Feb 14, 2026",paidVia:"UPI",items:[{desc:"12 Micro-Creator Fees",amt:280000},{desc:"Production Support",amt:60000},{desc:"Reporting & Analytics",amt:45000}]},
  {id:"INV-2026-010",date:"Jan 15, 2026",due:"Jan 30, 2026",monthIdx:0,year:2026,amount:350000,status:"paid",type:"retainer",label:"Monthly Retainer — January 2026",autopay:true,paidOn:"Jan 28, 2026",paidVia:"UPI Autopay",items:[{desc:"Monthly Retainer Fee",amt:250000},{desc:"Platform Access Fee",amt:50000},{desc:"Account Management",amt:50000}]},
  {id:"INV-2025-098",date:"Dec 15, 2025",due:"Dec 30, 2025",monthIdx:11,year:2025,amount:350000,status:"paid",type:"retainer",label:"Monthly Retainer — December 2025",autopay:true,paidOn:"Dec 29, 2025",paidVia:"UPI Autopay",items:[{desc:"Monthly Retainer Fee",amt:250000},{desc:"Platform Access Fee",amt:50000},{desc:"Account Management",amt:50000}]},
];

const UPCOMING = [
  {label:"Monthly Retainer — May 2026",amount:350000,dueDate:"May 1, 2026",type:"retainer",autopay:true},
  {label:"Diwali Festive Push — Creator Fees (Batch 2)",amount:280000,dueDate:"May 10, 2026",type:"campaign"},
  {label:"Snack Box Paid Ads — Ad Spend (Month 3)",amount:150000,dueDate:"May 15, 2026",type:"campaign"},
];

const Dot = ({color,sz=6}) => <span style={{width:sz,height:sz,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}}/>;

function fmt(n){if(n>=100000)return "₹"+(n/100000).toFixed(n%100000===0?0:1)+"L";if(n>=1000)return "₹"+(n/1000).toFixed(0)+"K";return "₹"+n;}
function fmtFull(n){return "₹"+n.toLocaleString("en-IN");}

/* ═══ RAZORPAY PAY MODAL ═══ */
function PayModal({inv,onClose,onConfirm,P}){
  const[step,setStep]=useState(1); // 1=method, 2=processing, 3=success
  const[method,setMethod]=useState("upi");
  const[upiId,setUpiId]=useState("");
  const[processing,setProcessing]=useState(false);

  const methods=[
    {id:"upi",label:"UPI",desc:"Google Pay, PhonePe, Paytm, BHIM",icon:"📱",popular:true},
    {id:"netbanking",label:"Net Banking",desc:"All major Indian banks",icon:"🏦"},
    {id:"card",label:"Card",desc:"Credit / Debit / International",icon:"💳"},
    {id:"wallet",label:"Wallet",desc:"Paytm, PhonePe, Mobikwik",icon:"👛"},
  ];

  const handlePay=()=>{
    setProcessing(true);
    setStep(2);
    // Simulate Razorpay flow
    setTimeout(()=>{setStep(3);setTimeout(()=>{onConfirm(inv.id,method);},1200);},1600);
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={step===1?onClose:undefined} className="fi" style={{position:"absolute",inset:0,background:"rgba(3,6,16,0.82)",backdropFilter:"blur(6px)"}}/>
      <div className="au" style={{position:"relative",width:"min(420px,90vw)",background:P.bg,border:`1px solid ${P.border}`,borderRadius:14,overflow:"hidden"}}>

        {/* Razorpay branded header */}
        <div style={{padding:"14px 22px",borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:P.surface}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:24,height:24,borderRadius:5,background:"#0c2451",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",fontFamily:"'Sora'"}}>R</div>
            <span style={{fontSize:11,color:P.sub,fontWeight:500}}>Secured by Razorpay</span>
          </div>
          {step===1&&<button onClick={onClose} style={{width:22,height:22,borderRadius:5,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
        </div>

        {/* Content */}
        <div style={{padding:"18px 22px 22px"}}>
          {step===1&&(<>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:3}}>Paying</div>
              <div style={{fontSize:22,fontWeight:700,color:P.text,fontFamily:"'Sora'"}}>{fmtFull(inv.amount)}</div>
              <div style={{fontSize:10,color:P.sub,marginTop:2}}>{inv.id} · {inv.label}</div>
            </div>

            <div style={{fontSize:8.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:7}}>Payment Method</div>
            <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:14}}>
              {methods.map(m=>(
                <button key={m.id} onClick={()=>setMethod(m.id)} style={{
                  display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
                  borderRadius:8,background:method===m.id?`${P.accent}08`:P.surface,
                  border:`1.5px solid ${method===m.id?P.accent:P.border}`,
                  cursor:"pointer",transition:"all 0.15s",textAlign:"left",
                }}>
                  <span style={{fontSize:18}}>{m.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:12,fontWeight:600,color:P.text,fontFamily:"'Sora'"}}>{m.label}</span>
                      {m.popular&&<span style={{fontSize:7.5,color:P.green,background:`${P.green}12`,padding:"1px 5px",borderRadius:3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Popular</span>}
                    </div>
                    <div style={{fontSize:9.5,color:P.mute,marginTop:1}}>{m.desc}</div>
                  </div>
                  {method===m.id&&<Dot color={P.accent} sz={7}/>}
                </button>
              ))}
            </div>

            {/* UPI ID input when UPI selected */}
            {method==="upi"&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:8.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:5}}>Or enter UPI ID</div>
                <input value={upiId} onChange={e=>setUpiId(e.target.value)} placeholder="yourname@okaxis" style={{
                  width:"100%",padding:"8px 11px",borderRadius:7,background:P.surface,
                  border:`1px solid ${P.border}`,color:P.text,fontSize:11.5,fontFamily:"'Sora'",outline:"none",
                }}/>
                <div style={{fontSize:9,color:P.mute,marginTop:4,fontStyle:"italic"}}>Or continue to open your UPI app</div>
              </div>
            )}

            <button onClick={handlePay} style={{
              width:"100%",padding:"11px 0",borderRadius:8,background:P.accent,
              border:"none",color:"#050A18",fontSize:12,fontWeight:600,
              cursor:"pointer",fontFamily:"'Sora'",
            }}>Pay {fmtFull(inv.amount)}</button>

            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:12,fontSize:9,color:P.mute}}>
              <span>🔒</span>
              <span>256-bit encrypted · PCI DSS compliant · RBI regulated</span>
            </div>
          </>)}

          {step===2&&(
            <div style={{padding:"20px 0 10px",textAlign:"center"}}>
              <div className="pulse" style={{width:54,height:54,borderRadius:"50%",background:`${P.accent}10`,border:`2px solid ${P.accent}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:22}}>⋯</div>
              <div style={{fontSize:14,fontWeight:600,color:P.text,marginBottom:4,fontFamily:"'Sora'"}}>Processing Payment</div>
              <div style={{fontSize:11,color:P.sub}}>Please don't close this window</div>
              <div style={{fontSize:9.5,color:P.mute,marginTop:12,fontStyle:"italic"}}>Redirecting to {method==="upi"?"UPI app":method==="netbanking"?"your bank":"payment gateway"}...</div>
            </div>
          )}

          {step===3&&(
            <div className="au" style={{padding:"20px 0 10px",textAlign:"center"}}>
              <div style={{width:54,height:54,borderRadius:"50%",background:`${P.green}15`,border:`2px solid ${P.green}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24,color:P.green}}>✓</div>
              <div style={{fontSize:14,fontWeight:600,color:P.text,marginBottom:4,fontFamily:"'Sora'"}}>Payment Successful</div>
              <div style={{fontSize:11,color:P.sub}}>{fmtFull(inv.amount)} paid via {methods.find(m=>m.id===method)?.label}</div>
              <div style={{fontSize:9.5,color:P.mute,marginTop:8}}>Receipt will be emailed shortly</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ INVOICE DETAIL MODAL ═══ */
function InvoiceDetail({inv,onClose,onPay,P}){
  const sc=inv.status==="paid"?P.green:inv.status==="overdue"?P.red:P.amber;
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} className="fi" style={{position:"absolute",inset:0,background:"rgba(3,6,16,0.78)",backdropFilter:"blur(6px)"}}/>
      <div className="au" style={{position:"relative",width:"min(480px,92vw)",maxHeight:"85vh",background:P.bg,border:`1px solid ${P.border}`,borderRadius:14,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 24px 16px",borderBottom:`1px solid ${P.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontSize:10,color:P.mute,fontFamily:"'Sora'",fontWeight:600,letterSpacing:"0.04em"}}>{inv.id}</span>
                <span style={{fontSize:8.5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",padding:"2px 7px",borderRadius:4,background:`${sc}12`,color:sc}}>{inv.status}</span>
                {inv.autopay&&<span style={{fontSize:8.5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",padding:"2px 7px",borderRadius:4,background:`${P.accent}12`,color:P.accent}}>⚡ Auto-pay</span>}
              </div>
              <h3 style={{fontFamily:"'Newsreader',serif",fontSize:19,fontWeight:600,color:P.white,margin:0,fontStyle:"italic"}}>{inv.label}</h3>
            </div>
            <button onClick={onClose} style={{width:26,height:26,borderRadius:6,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora'"}}>✕</button>
          </div>
        </div>
        <div style={{padding:"16px 24px 24px",overflowY:"auto",flex:1}}>
          <div style={{display:"flex",gap:20,marginBottom:18,flexWrap:"wrap"}}>
            {[["Issued",inv.date],["Due",inv.due],...(inv.paidOn?[["Paid",inv.paidOn]]:[]),...(inv.paidVia?[["Via",inv.paidVia]]:[]),["Type",inv.type==="retainer"?"Retainer":"Campaign"]].map(([l,v])=>(
              <div key={l}><div style={{fontSize:8,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{l}</div><div style={{fontSize:12,color:P.text,fontWeight:500,marginTop:2}}>{v}</div></div>
            ))}
          </div>
          <div style={{fontSize:8.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:8}}>Line Items</div>
          <div style={{background:P.surface,borderRadius:9,border:`1px solid ${P.border}`,overflow:"hidden",marginBottom:16}}>
            {inv.items.map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:i<inv.items.length-1?`1px solid ${P.border}`:"none"}}>
                <span style={{fontSize:12,color:P.text}}>{item.desc}</span>
                <span style={{fontSize:12,fontWeight:600,color:P.text,fontFamily:"'Sora'"}}>{fmtFull(item.amt)}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:P.barBg,borderTop:`1px solid ${P.border}`}}>
              <span style={{fontSize:12,fontWeight:600,color:P.text}}>Total</span>
              <span style={{fontSize:16,fontWeight:700,color:P.accent,fontFamily:"'Sora'"}}>{fmtFull(inv.amount)}</span>
            </div>
          </div>

          {inv.autopay&&inv.status!=="paid"&&(
            <div style={{padding:"10px 13px",background:`${P.accent}08`,border:`1px solid ${P.accent}15`,borderRadius:8,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>⚡</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:600,color:P.accent}}>Auto-pay enabled</div>
                <div style={{fontSize:9.5,color:P.sub,marginTop:1}}>Will be auto-debited via UPI mandate on due date</div>
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:8}}>
            {inv.status!=="paid"&&!inv.autopay&&(
              <button onClick={()=>onPay(inv.id)} style={{flex:1,padding:"10px 0",borderRadius:8,background:P.accent,border:"none",color:"#050A18",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Sora'"}}>Pay Now — {fmtFull(inv.amount)}</button>
            )}
            {inv.status!=="paid"&&inv.autopay&&(
              <button onClick={()=>onPay(inv.id)} style={{flex:1,padding:"10px 0",borderRadius:8,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"'Sora'"}}>Pay Early Manually</button>
            )}
            <button onClick={()=>{}} style={{flex:inv.status==="paid"?1:0,minWidth:120,padding:"10px 0",borderRadius:8,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"'Sora'"}}>{inv.status==="paid"?"Download Receipt":"Download Invoice"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ BREAKDOWN VIEW ═══ */
function BreakdownView({invoices,P}){
  const[view,setView]=useState("campaign");
  const byCampaign={};const byService={"Retainer":0,"Influencer Marketing":0,"Performance Ads":0,"Other":0};
  invoices.forEach(inv=>{
    if(inv.type==="retainer"){byService["Retainer"]+=inv.amount;if(!byCampaign["Monthly Retainer"])byCampaign["Monthly Retainer"]=0;byCampaign["Monthly Retainer"]+=inv.amount;}
    else{const camp=inv.campaign||inv.label;if(!byCampaign[camp])byCampaign[camp]=0;byCampaign[camp]+=inv.amount;
      if(camp.includes("Paid Ads")||camp.includes("Snack Box"))byService["Performance Ads"]+=inv.amount;else byService["Influencer Marketing"]+=inv.amount;}
  });
  const data=view==="campaign"?Object.entries(byCampaign).sort((a,b)=>b[1]-a[1]):Object.entries(byService).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  const total=data.reduce((s,[,v])=>s+v,0);
  const colors=[P.accent,P.pink,P.amber,P.green,"#6366F1","#FB923C"];
  return(
    <div style={{background:P.surface,borderRadius:10,border:`1px solid ${P.border}`,padding:"14px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:9,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>Spend Breakdown</span>
        <div style={{display:"flex",background:P.barBg,borderRadius:5,overflow:"hidden"}}>
          {[["campaign","By Campaign"],["service","By Service"]].map(([k,l])=>(
            <button key={k} onClick={()=>setView(k)} style={{padding:"4px 10px",fontSize:9,fontWeight:500,background:view===k?`${P.accent}10`:"transparent",border:"none",color:view===k?P.accent:P.mute,cursor:"pointer",fontFamily:"'Sora'"}}>{l}</button>
          ))}
        </div>
      </div>
      {total>0?(<>
        <div style={{display:"flex",height:10,borderRadius:5,overflow:"hidden",marginBottom:12}}>
          {data.map(([label,value],i)=>(<div key={label} style={{width:`${(value/total)*100}%`,height:"100%",background:colors[i%colors.length],transition:"width 0.5s ease"}} title={`${label}: ${fmtFull(value)}`}/>))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {data.map(([label,value],i)=>(<div key={label} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:8,height:8,borderRadius:2,background:colors[i%colors.length],flexShrink:0}}/>
            <span style={{fontSize:11,color:P.text,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span>
            <span style={{fontSize:11,fontWeight:600,color:P.text,fontFamily:"'Sora'"}}>{fmt(value)}</span>
            <span style={{fontSize:9,color:P.mute,width:32,textAlign:"right"}}>{Math.round((value/total)*100)}%</span>
          </div>))}
        </div>
      </>):(<div style={{textAlign:"center",padding:"20px 0",fontSize:10,color:P.mute}}>No data for this period</div>)}
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function BillingPage(){
  const { P, theme, setTheme, setPage } = useApp();
  const[invoices,setInvoices]=useState(INVOICES);
  const[filter,setFilter]=useState("unpaid"); // DEFAULT: unpaid
  const[detail,setDetail]=useState(null);
  const[paying,setPaying]=useState(null);
  const[toast,setToast]=useState("");
  const[tab,setTab]=useState("invoices");

  // Time filters
  const[preset,setPreset]=useState("all"); // all | last_30d | last_3mo | last_6mo | this_year
  const[selMonth,setSelMonth]=useState("all"); // "all" or 0-11
  const[selYear,setSelYear]=useState("all");

  // Derive available years from data
  const years=[...new Set(invoices.map(i=>i.year))].sort((a,b)=>b-a);

  const handlePay=(id)=>{setDetail(null);setPaying(invoices.find(inv=>inv.id===id));};
  const confirmPay=(id,method)=>{
    setInvoices(prev=>prev.map(inv=>inv.id===id?{...inv,status:"paid",paidOn:"Just now",paidVia:method==="upi"?"UPI":method==="netbanking"?"Net Banking":method==="card"?"Card":"Wallet"}:inv));
    setPaying(null);
    setToast(`Payment successful! Receipt sent via email.`);
    setTimeout(()=>setToast(""),4000);
  };

  // Apply time filters
  const now=new Date();
  const applyTimeFilter=(inv)=>{
    // Manual month/year first
    if(selMonth!=="all"&&inv.monthIdx!==Number(selMonth))return false;
    if(selYear!=="all"&&inv.year!==Number(selYear))return false;
    // Then preset
    if(preset==="all")return true;
    const invDate=new Date(inv.year,inv.monthIdx,1);
    const daysDiff=(now-invDate)/(1000*60*60*24);
    if(preset==="last_30d")return daysDiff<=31;
    if(preset==="last_3mo")return daysDiff<=93;
    if(preset==="last_6mo")return daysDiff<=186;
    if(preset==="this_year")return inv.year===now.getFullYear();
    return true;
  };

  // Apply status filter
  const applyStatusFilter=(inv)=>{
    if(filter==="all")return true;
    if(filter==="unpaid")return inv.status==="pending"||inv.status==="overdue";
    return inv.status===filter;
  };

  const filtered=invoices.filter(inv=>applyTimeFilter(inv)&&applyStatusFilter(inv));

  const tabInvoices=tab==="history"?filtered.filter(inv=>inv.status==="paid"):tab==="upcoming"?[]:filtered;

  // Stats (always based on all invoices, not filtered)
  const outstanding=invoices.filter(i=>i.status!=="paid").reduce((s,i)=>s+i.amount,0);
  const overdue=invoices.filter(i=>i.status==="overdue").reduce((s,i)=>s+i.amount,0);
  const totalPaid=invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const nextDue=invoices.find(i=>i.status==="pending");
  const retainerAmt=350000;

  // Clear time filters
  const clearTimeFilters=()=>{setPreset("all");setSelMonth("all");setSelYear("all");};
  const hasTimeFilter=preset!=="all"||selMonth!=="all"||selYear!=="all";

  return(
    <div style={{fontFamily:"'Sora',sans-serif",background:P.bg,color:P.text,minHeight:"100vh"}}>
      <div style={{maxWidth:920,margin:"0 auto",padding:"24px 28px 0"}}>
        <header style={{marginBottom:14}}>
          <h1 style={{fontFamily:"'Newsreader',serif",fontSize:28,fontWeight:400,color:P.white,margin:0,fontStyle:"italic"}}>Billing & Invoices</h1>
        </header>

        {/* Toast */}
        {toast&&(<div className="au" style={{padding:"8px 14px",borderRadius:7,marginBottom:12,background:`${P.green}0A`,border:`1px solid ${P.green}18`,display:"flex",alignItems:"center",gap:6}}>
          <Dot color={P.green}/><span style={{fontSize:11,color:P.green,fontWeight:500}}>{toast}</span>
        </div>)}

        {/* Summary cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
          <div style={{background:outstanding>0?`${P.amber}06`:P.surface,border:`1px solid ${outstanding>0?`${P.amber}15`:P.border}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:8,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>Outstanding</div>
            <div style={{fontSize:22,fontWeight:700,color:outstanding>0?P.amber:P.green,marginTop:4}}>{fmt(outstanding)}</div>
            {overdue>0&&<div style={{fontSize:9,color:P.red,marginTop:3}}>{fmt(overdue)} overdue</div>}
          </div>
          <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:8,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>Next Payment</div>
            <div style={{fontSize:22,fontWeight:700,color:P.accent,marginTop:4}}>{nextDue?fmt(nextDue.amount):"—"}</div>
            <div style={{fontSize:9,color:P.sub,marginTop:3}}>{nextDue?`Due ${nextDue.due}`:"All clear"}</div>
          </div>
          <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:8,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>Total Paid</div>
            <div style={{fontSize:22,fontWeight:700,color:P.green,marginTop:4}}>{fmt(totalPaid)}</div>
            <div style={{fontSize:9,color:P.sub,marginTop:3}}>{invoices.filter(i=>i.status==="paid").length} invoices</div>
          </div>
          <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:8,color:P.mute,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>Monthly Retainer <span style={{fontSize:8,color:P.accent,background:`${P.accent}10`,padding:"1px 4px",borderRadius:3,fontWeight:700}}>⚡ Auto</span></div>
            <div style={{fontSize:22,fontWeight:700,color:P.text,marginTop:4}}>{fmt(retainerAmt)}</div>
            <div style={{fontSize:9,color:P.sub,marginTop:3}}>+ campaign extras</div>
          </div>
        </div>

        {/* TIME FILTER BAR */}
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:14,padding:"10px 14px",background:P.surface,borderRadius:9,border:`1px solid ${P.border}`}}>
          <span style={{fontSize:8.5,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginRight:2}}>Period</span>

          {/* Preset buttons */}
          <div style={{display:"flex",gap:3}}>
            {[["all","All Time"],["last_30d","Last 30d"],["last_3mo","Last 3mo"],["last_6mo","Last 6mo"],["this_year","This Year"]].map(([k,l])=>(
              <button key={k} onClick={()=>{setPreset(k);setSelMonth("all");setSelYear("all");}} style={{
                padding:"4px 9px",borderRadius:5,fontSize:9.5,fontWeight:500,
                background:preset===k?`${P.accent}10`:"transparent",
                border:`1px solid ${preset===k?`${P.accent}25`:P.border}`,
                color:preset===k?P.accent:P.mute,
                cursor:"pointer",fontFamily:"'Sora'",
              }}>{l}</button>
            ))}
          </div>

          <div style={{width:1,height:18,background:P.border,marginLeft:4,marginRight:4}}/>

          {/* Month dropdown */}
          <select value={selMonth} onChange={e=>{setSelMonth(e.target.value);setPreset("all");}} style={{
            padding:"4px 9px",borderRadius:5,fontSize:9.5,fontWeight:500,
            background:selMonth!=="all"?`${P.accent}10`:P.bg,
            border:`1px solid ${selMonth!=="all"?`${P.accent}25`:P.border}`,
            color:selMonth!=="all"?P.accent:P.sub,
            cursor:"pointer",fontFamily:"'Sora'",outline:"none",
          }}>
            <option value="all" style={{background:P.bg,color:P.text}}>All months</option>
            {MONTHS_FULL.map((m,i)=><option key={i} value={i} style={{background:P.bg,color:P.text}}>{m}</option>)}
          </select>

          {/* Year dropdown */}
          <select value={selYear} onChange={e=>{setSelYear(e.target.value);setPreset("all");}} style={{
            padding:"4px 9px",borderRadius:5,fontSize:9.5,fontWeight:500,
            background:selYear!=="all"?`${P.accent}10`:P.bg,
            border:`1px solid ${selYear!=="all"?`${P.accent}25`:P.border}`,
            color:selYear!=="all"?P.accent:P.sub,
            cursor:"pointer",fontFamily:"'Sora'",outline:"none",
          }}>
            <option value="all" style={{background:P.bg,color:P.text}}>All years</option>
            {years.map(y=><option key={y} value={y} style={{background:P.bg,color:P.text}}>{y}</option>)}
          </select>

          {hasTimeFilter&&(
            <button onClick={clearTimeFilters} style={{marginLeft:"auto",padding:"4px 9px",borderRadius:5,fontSize:9,fontWeight:500,background:P.barBg,border:`1px solid ${P.border}`,color:P.mute,cursor:"pointer",fontFamily:"'Sora'"}}>Clear filters</button>
          )}
        </div>

        {/* Two column */}
        <div style={{display:"flex",gap:16,paddingBottom:40}}>
          {/* Left: Invoice list */}
          <div style={{flex:1,minWidth:0}}>
            {/* Tabs */}
            <div style={{display:"flex",gap:0,marginBottom:14,borderBottom:`1px solid ${P.border}`}}>
              {[["invoices","Invoices"],["history","Payment History"],["upcoming","Upcoming"]].map(([k,l])=>(
                <button key={k} onClick={()=>{setTab(k);if(k==="invoices")setFilter("unpaid");else setFilter("all");}} style={{
                  padding:"8px 14px",fontSize:10.5,fontWeight:500,background:"none",border:"none",cursor:"pointer",
                  color:tab===k?P.accent:P.mute,borderBottom:tab===k?`2px solid ${P.accent}`:"2px solid transparent",
                  fontFamily:"'Sora'",
                }}>{l}</button>
              ))}
            </div>

            {/* Status filters */}
            {tab==="invoices"&&(
              <div style={{display:"flex",gap:3,marginBottom:12}}>
                {[["unpaid","Unpaid"],["all","All"],["pending","Pending"],["overdue","Overdue"],["paid","Paid"]].map(([k,l])=>{
                  const count=k==="all"?invoices.filter(applyTimeFilter).length
                    :k==="unpaid"?invoices.filter(i=>applyTimeFilter(i)&&(i.status==="pending"||i.status==="overdue")).length
                    :invoices.filter(i=>applyTimeFilter(i)&&i.status===k).length;
                  return(
                    <button key={k} onClick={()=>setFilter(k)} style={{
                      padding:"4px 10px",borderRadius:5,fontSize:9.5,fontWeight:500,
                      background:filter===k?`${P.accent}10`:"transparent",
                      border:`1px solid ${filter===k?`${P.accent}25`:P.border}`,
                      color:filter===k?P.accent:P.mute,cursor:"pointer",fontFamily:"'Sora'",
                      display:"flex",alignItems:"center",gap:3,
                    }}>{l} <span style={{fontSize:8,fontWeight:700,background:filter===k?`${P.accent}15`:P.barBg,color:filter===k?P.accent:P.mute,padding:"1px 4px",borderRadius:3}}>{count}</span></button>
                  );
                })}
              </div>
            )}

            {/* Invoice list */}
            {tab!=="upcoming"&&tabInvoices.map((inv,i)=>{
              const sc=inv.status==="paid"?P.green:inv.status==="overdue"?P.red:P.amber;
              return(
                <div key={inv.id} className="au" onClick={()=>setDetail(inv)}
                  style={{animationDelay:`${i*30}ms`,background:P.surface,border:`1px solid ${inv.status==="overdue"?`${P.red}15`:P.border}`,borderRadius:9,padding:"12px 14px",marginBottom:6,cursor:"pointer",transition:"all 0.2s",
                    borderLeft:inv.status==="overdue"?`3px solid ${P.red}`:inv.status==="pending"?`3px solid ${P.amber}`:`3px solid transparent`}}
                  onMouseOver={e=>e.currentTarget.style.borderColor=`${P.accent}25`}
                  onMouseOut={e=>e.currentTarget.style.borderColor=inv.status==="overdue"?`${P.red}15`:P.border}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontSize:9,color:P.mute,fontFamily:"'Sora'",fontWeight:500}}>{inv.id}</span>
                        <span style={{fontSize:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",padding:"1px 6px",borderRadius:3,background:`${sc}12`,color:sc}}>{inv.status}</span>
                        <span style={{fontSize:8,color:P.mute,background:P.barBg,padding:"1px 5px",borderRadius:3}}>{inv.type==="retainer"?"Retainer":"Campaign"}</span>
                        {inv.autopay&&<span style={{fontSize:8,color:P.accent,background:`${P.accent}10`,padding:"1px 5px",borderRadius:3,fontWeight:600}}>⚡ Auto-pay</span>}
                      </div>
                      <div style={{fontSize:12.5,fontWeight:500,color:P.text}}>{inv.label}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:16,fontWeight:700,color:P.text,fontFamily:"'Sora'"}}>{fmt(inv.amount)}</div>
                      <div style={{fontSize:9,color:P.mute,marginTop:2}}>{inv.status==="paid"?`Paid ${inv.paidOn}`:`Due ${inv.due}`}</div>
                    </div>
                  </div>
                  {inv.status!=="paid"&&!inv.autopay&&(
                    <div style={{display:"flex",gap:6,marginTop:8,paddingTop:8,borderTop:`1px solid ${P.border}`}}>
                      <button onClick={e=>{e.stopPropagation();handlePay(inv.id);}} style={{padding:"6px 16px",borderRadius:6,fontSize:10.5,fontWeight:600,background:P.accent,border:"none",color:"#050A18",cursor:"pointer",fontFamily:"'Sora'"}}>Pay Now</button>
                      <button onClick={e=>{e.stopPropagation();setDetail(inv);}} style={{padding:"6px 12px",borderRadius:6,fontSize:10,fontWeight:500,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,cursor:"pointer",fontFamily:"'Sora'"}}>View Details</button>
                    </div>
                  )}
                  {inv.status!=="paid"&&inv.autopay&&(
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6,padding:"5px 9px",background:`${P.accent}06`,borderRadius:5}}>
                      <span style={{fontSize:11}}>⚡</span>
                      <span style={{fontSize:9.5,color:P.accent,fontWeight:500}}>Auto-debit scheduled for {inv.due}</span>
                      <button onClick={e=>{e.stopPropagation();handlePay(inv.id);}} style={{marginLeft:"auto",padding:"3px 8px",borderRadius:4,fontSize:9,fontWeight:500,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,cursor:"pointer",fontFamily:"'Sora'"}}>Pay Early</button>
                    </div>
                  )}
                  {inv.status==="paid"&&(
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                      <Dot color={P.green} sz={5}/>
                      <span style={{fontSize:9.5,color:P.doneTxt}}>Paid {inv.paidOn} · {inv.paidVia}</span>
                      <button onClick={e=>e.stopPropagation()} style={{marginLeft:"auto",padding:"3px 8px",borderRadius:4,fontSize:9,fontWeight:500,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,cursor:"pointer",fontFamily:"'Sora'"}}>Receipt ↓</button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Upcoming */}
            {tab==="upcoming"&&(<div>
              {UPCOMING.map((u,i)=>(
                <div key={i} className="au" style={{animationDelay:`${i*40}ms`,background:P.surface,border:`1px solid ${P.border}`,borderRadius:9,padding:"12px 14px",marginBottom:6,borderLeft:`3px solid ${P.mute}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                        <span style={{fontSize:12.5,fontWeight:500,color:P.text}}>{u.label}</span>
                        {u.autopay&&<span style={{fontSize:8,color:P.accent,background:`${P.accent}10`,padding:"1px 5px",borderRadius:3,fontWeight:600}}>⚡ Auto-pay</span>}
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <span style={{fontSize:9,color:P.mute}}>Due {u.dueDate}</span>
                        <span style={{fontSize:8,color:P.mute,background:P.barBg,padding:"1px 5px",borderRadius:3}}>{u.type==="retainer"?"Retainer":"Campaign"}</span>
                      </div>
                    </div>
                    <div style={{fontSize:16,fontWeight:700,color:P.sub,fontFamily:"'Sora'"}}>{fmt(u.amount)}</div>
                  </div>
                </div>
              ))}
              <div style={{fontSize:9.5,color:P.mute,fontStyle:"italic",marginTop:8,paddingLeft:4}}>Upcoming invoices are estimates. Final amounts may vary.</div>
            </div>)}

            {tab!=="upcoming"&&tabInvoices.length===0&&(
              <div style={{textAlign:"center",padding:"40px 20px",color:P.mute}}>
                <div style={{fontSize:22,marginBottom:6,opacity:0.15}}>{filter==="unpaid"?"✓":"📑"}</div>
                <div style={{fontSize:12}}>{filter==="unpaid"?"All caught up! No unpaid invoices.":"No invoices match this filter"}</div>
                {hasTimeFilter&&<button onClick={clearTimeFilters} style={{marginTop:10,padding:"5px 12px",borderRadius:5,fontSize:10,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,cursor:"pointer",fontFamily:"'Sora'"}}>Clear time filters</button>}
              </div>
            )}
          </div>

          {/* Right: Breakdown */}
          <div style={{width:280,flexShrink:0}}>
            <BreakdownView invoices={filtered} P={P}/>

            {/* Payment methods */}
            <div style={{background:P.surface,borderRadius:10,border:`1px solid ${P.border}`,padding:"14px 16px",marginTop:10}}>
              <div style={{fontSize:9,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:10}}>Payment Methods</div>
              {[{icon:"📱",label:"UPI — rahul@okaxis",primary:true,autopay:true},{icon:"🏦",label:"HDFC ****4521",primary:false}].map((m,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:i===0?`1px solid ${P.border}`:"none"}}>
                  <span style={{fontSize:14}}>{m.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:P.text}}>{m.label}</div>
                    {m.autopay&&<div style={{fontSize:8.5,color:P.accent,marginTop:1}}>⚡ Auto-pay mandate active</div>}
                  </div>
                  {m.primary&&<span style={{fontSize:8,color:P.accent,background:`${P.accent}10`,padding:"1px 6px",borderRadius:3,fontWeight:600}}>Primary</span>}
                </div>
              ))}
              <button style={{width:"100%",marginTop:10,padding:"7px 0",borderRadius:6,background:P.barBg,border:`1px solid ${P.border}`,color:P.sub,fontSize:10,fontWeight:500,cursor:"pointer",fontFamily:"'Sora'"}}>+ Add Payment Method</button>
            </div>

            {/* Billing Summary */}
            <div style={{background:P.surface,borderRadius:10,border:`1px solid ${P.border}`,padding:"14px 16px",marginTop:10}}>
              <div style={{fontSize:9,color:P.mute,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:10}}>Billing Summary</div>
              {[
                ["Total Invoiced",fmt(invoices.reduce((s,i)=>s+i.amount,0))],
                ["Total Paid",fmt(totalPaid)],
                ["Outstanding",fmt(outstanding)],
                ["Auto-pay saved",fmt(invoices.filter(i=>i.autopay&&i.status==="paid").reduce((s,i)=>s+i.amount,0))],
                ["Invoices",`${invoices.length} total`],
              ].map(([l,v],i)=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<4?`1px solid ${P.border}`:"none"}}>
                  <span style={{fontSize:10.5,color:P.sub}}>{l}</span>
                  <span style={{fontSize:10.5,fontWeight:600,color:P.text}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {detail&&<InvoiceDetail inv={detail} onClose={()=>setDetail(null)} onPay={handlePay} P={P}/>}
      {paying&&<PayModal inv={paying} onClose={()=>setPaying(null)} onConfirm={confirmPay} P={P}/>}

      <style>{`
        *{box-sizing:border-box;margin:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.1);border-radius:2px}
        @keyframes au{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.au{animation:au .3s cubic-bezier(.25,.46,.45,.94) both}
        @keyframes fi{from{opacity:0}to{opacity:1}}.fi{animation:fi .2s ease both}
        @keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}.pulse{animation:pulse 1.2s ease-in-out infinite}
        input::placeholder{color:${P.mute}}
        select{appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%237B8DB0' d='M4 6L0 2h8z'/%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right 7px center;padding-right:22px!important}
      `}</style>
    </div>
  );
}
