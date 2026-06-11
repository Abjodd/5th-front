import { useState, useEffect, useMemo } from "react";
import { useApp, DARK, LIGHT } from "../context";

const TYPES = {
  approval: { label:"Creator Approval", icon:"👤", color:"amber", filter:"action" },
  brief:    { label:"Brief Sign-off",   icon:"📋", color:"accent", filter:"action" },
  chat:     { label:"New Message",       icon:"💬", color:"accent", filter:"message" },
  content:  { label:"Content Upload",    icon:"🎬", color:"pink",   filter:"content" },
  milestone:{ label:"Milestone",         icon:"🎯", color:"green",  filter:"update" },
  live:     { label:"Campaign Live",     icon:"🟢", color:"green",  filter:"update" },
  budget:   { label:"Budget Alert",      icon:"⚠",  color:"amber",  filter:"update" },
  system:   { label:"System",            icon:"⚙",  color:"mute",   filter:"update" },
};

const FILTERS = [
  { id:"all", label:"All" },
  { id:"action", label:"Action Required" },
  { id:"message", label:"Messages" },
  { id:"content", label:"Content" },
  { id:"update", label:"Updates" },
];

const INIT_NOTIFS = [
  // Today
  { id:1, type:"approval", campaign:"Diwali Festive Push", campaignId:1,
    title:"Kerala Food Tales needs your decision",
    desc:"@keralafood is pending your approval. Exec has approved ✓. Your turn.",
    time:"10 min ago", date:"Today", read:false, resolved:false,
    creatorName:"Kerala Food Tales", creatorHandle:"@keralafood",
    actionType:"approve_creator" },
  { id:2, type:"content", campaign:"Diwali Festive Push", campaignId:1,
    title:"South Foodie uploaded a draft video",
    desc:"Longform_Draft_v2.mp4 is ready for your review.",
    time:"32 min ago", date:"Today", read:false, resolved:false,
    fileName:"Longform_Draft_v2.mp4", fileUrl:"#",
    actionType:"review_content" },
  { id:3, type:"chat", campaign:"Diwali Festive Push", campaignId:1,
    title:"Priya sent a message",
    desc:"\"Reel #4 from @tasteofmadras is in production. Should be ready by Thursday.\"",
    time:"1 hr ago", date:"Today", read:false, resolved:false,
    sender:"Priya", senderRole:"Management",
    actionType:"view_chat" },
  { id:4, type:"approval", campaign:"Diwali Festive Push", campaignId:1,
    title:"Foodie Hyderabad needs your decision",
    desc:"@foodiehyd is in negotiation. Both approvals needed before locking.",
    time:"2 hrs ago", date:"Today", read:false, resolved:false,
    creatorName:"Foodie Hyderabad", creatorHandle:"@foodiehyd",
    actionType:"approve_creator" },
  { id:5, type:"brief", campaign:"Summer Launch Teaser", campaignId:4,
    title:"Brief variables pending your sign-off",
    desc:"Target Audience and Key Messages need your review before 5th Avenue can proceed.",
    time:"3 hrs ago", date:"Today", read:false, resolved:false,
    pendingVars:["Target Audience","Key Messages"],
    actionType:"signoff_brief" },
  // Yesterday
  { id:6, type:"content", campaign:"Diwali Festive Push", campaignId:1,
    title:"Anjali Kitchen uploaded a concept doc",
    desc:"Concept_Anjali_v3.docx — updated concept after your feedback.",
    time:"Yesterday, 4:30 PM", date:"Yesterday", read:true, resolved:false,
    fileName:"Concept_Anjali_v3.docx", fileUrl:"#",
    actionType:"review_content" },
  { id:7, type:"chat", campaign:"Snack Box — Paid Ads", campaignId:5,
    title:"Arjun sent a message",
    desc:"\"New creative set A/B test results are in. Click-through up 18%.\"",
    time:"Yesterday, 2:15 PM", date:"Yesterday", read:true, resolved:false,
    sender:"Arjun", senderRole:"Execution",
    actionType:"view_chat" },
  { id:8, type:"milestone", campaign:"Diwali Festive Push", campaignId:1,
    title:"Campaign entered Production phase",
    desc:"All shortlisted creators are briefed. Content production has begun.",
    time:"Yesterday, 11:00 AM", date:"Yesterday", read:true, resolved:true },
  { id:9, type:"budget", campaign:"Snack Box — Paid Ads", campaignId:5,
    title:"Budget 74% utilized",
    desc:"₹11.1L of ₹15L spent. Consider reviewing spend pacing.",
    time:"Yesterday, 10:00 AM", date:"Yesterday", read:true, resolved:false,
    actionType:"view_campaign" },
  // Earlier
  { id:10, type:"live", campaign:"Delhi Street Food Collab", campaignId:102,
    title:"Campaign is now Live",
    desc:"Delhi Street Food Collab went live across 5 creators.",
    time:"Apr 12", date:"Earlier", read:true, resolved:true },
  { id:11, type:"approval", campaign:"Diwali Festive Push", campaignId:1,
    title:"Anjali Kitchen — approved & locked",
    desc:"Both Exec and Mgmt approved. Creator is now locked in.",
    time:"Apr 11", date:"Earlier", read:true, resolved:true,
    creatorName:"Anjali Kitchen", creatorHandle:"@anjalikitchen" },
  { id:12, type:"brief", campaign:"Brand Visibility Sprint", campaignId:2,
    title:"Brief locked by 5th Avenue",
    desc:"All variables approved. AEO campaign brief is now final.",
    time:"Apr 10", date:"Earlier", read:true, resolved:true },
  { id:13, type:"system", campaign:"—", campaignId:null,
    title:"Welcome to 5th Avenue",
    desc:"Your client portal is set up. Explore Campaigns and Regional Map.",
    time:"Mar 28", date:"Earlier", read:true, resolved:true },
  { id:14, type:"chat", campaign:"Micro-Influencer Wave", campaignId:3,
    title:"System: Campaign completed",
    desc:"\"Final report for Micro-Influencer Wave is now available.\"",
    time:"Mar 15", date:"Earlier", read:true, resolved:true,
    sender:"System", senderRole:"System",
    actionType:"view_chat" },
];

const Dot = ({color,sz=6}) => <span style={{width:sz,height:sz,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}}/>;

/* ═══ NOTIFICATION CARD ═══ */
function NotifCard({ n, P, onResolve, onMarkRead, onCampaignClick }) {
  const t = TYPES[n.type] || TYPES.system;
  const typeColor = P[t.color] || P.mute;
  const isUnread = !n.read;
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="au"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        background: isUnread ? `${P.accent}04` : P.surface,
        border: `1px solid ${isUnread ? `${P.accent}12` : P.border}`,
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 6,
        transition: "all 0.2s",
        borderLeft: isUnread ? `3px solid ${typeColor}` : `3px solid transparent`,
        position: "relative",
      }}
    >
      {/* Top row: icon + title + time */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        {/* Type icon */}
        <div style={{
          width:34, height:34, borderRadius:9, flexShrink:0,
          background:`${typeColor}12`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:15, marginTop:1,
        }}>{t.icon}</div>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
            <span style={{
              fontSize:13, fontWeight:isUnread?600:500, color:P.text,
              fontFamily:"'Sora'",
            }}>{n.title}</span>
            {isUnread && <Dot color={typeColor} sz={5}/>}
          </div>

          <p style={{
            fontSize:11.5, color:P.sub, lineHeight:1.55, margin:"0 0 6px",
            fontStyle: n.type==="chat" ? "italic" : "normal",
          }}>{n.desc}</p>

          {/* Campaign tag + time */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            {n.campaign !== "—" && (
              <button onClick={() => onCampaignClick(n)}
                style={{
                  padding:"2px 8px", borderRadius:4, fontSize:9, fontWeight:500,
                  background:P.barBg, border:`1px solid ${P.border}`,
                  color:P.accent, cursor:"pointer", fontFamily:"'Sora'",
                  display:"flex", alignItems:"center", gap:3,
                }}>
                {n.campaign} →
              </button>
            )}
            <span style={{ fontSize:9.5, color:P.mute }}>{n.time}</span>
            <span style={{
              fontSize:8, color:typeColor, fontWeight:600,
              textTransform:"uppercase", letterSpacing:"0.05em",
              background:`${typeColor}10`, padding:"1px 6px", borderRadius:3,
            }}>{t.label}</span>
          </div>
        </div>

        {/* Read/unread toggle on hover */}
        {hovering && !n.resolved && (
          <button onClick={() => onMarkRead(n.id)}
            style={{
              position:"absolute", top:8, right:8,
              padding:"3px 7px", borderRadius:4, fontSize:8, fontWeight:500,
              background:P.barBg, border:`1px solid ${P.border}`,
              color:P.mute, cursor:"pointer", fontFamily:"'Sora'",
            }}>
            {isUnread ? "Mark read" : "Mark unread"}
          </button>
        )}
      </div>

      {/* Quick actions */}
      {!n.resolved && n.actionType && (
        <div style={{
          marginTop:10, paddingTop:10, borderTop:`1px solid ${P.border}`,
          display:"flex", gap:6, alignItems:"center", flexWrap:"wrap",
        }}>
          {/* Creator Approval */}
          {n.actionType === "approve_creator" && (<>
            <button onClick={() => onResolve(n.id, "approved")} style={{
              padding:"6px 14px", borderRadius:6, fontSize:10.5, fontWeight:500,
              background:`${P.green}08`, border:`1px solid ${P.green}20`,
              color:P.green, cursor:"pointer", fontFamily:"'Sora'",
              display:"flex", alignItems:"center", gap:4,
            }}>✓ Approve</button>
            <button onClick={() => onResolve(n.id, "rejected")} style={{
              padding:"6px 14px", borderRadius:6, fontSize:10.5, fontWeight:500,
              background:`${P.red}06`, border:`1px solid ${P.red}15`,
              color:P.red, cursor:"pointer", fontFamily:"'Sora'",
              display:"flex", alignItems:"center", gap:4,
            }}>✗ Reject</button>
            <span style={{ marginLeft:"auto", fontSize:9, color:P.mute }}>
              {n.creatorHandle}
            </span>
          </>)}

          {/* Brief sign-off */}
          {n.actionType === "signoff_brief" && (<>
            <button onClick={() => onResolve(n.id, "signed")} style={{
              padding:"6px 14px", borderRadius:6, fontSize:10.5, fontWeight:500,
              background:`${P.accent}08`, border:`1px solid ${P.accent}20`,
              color:P.accent, cursor:"pointer", fontFamily:"'Sora'",
              display:"flex", alignItems:"center", gap:4,
            }}>✓ Sign Off</button>
            <div style={{ display:"flex", gap:4, marginLeft:4 }}>
              {n.pendingVars?.map(v => (
                <span key={v} style={{
                  fontSize:9, color:P.amber, background:`${P.amber}10`,
                  padding:"2px 6px", borderRadius:3,
                }}>{v}</span>
              ))}
            </div>
          </>)}

          {/* Content review */}
          {n.actionType === "review_content" && (<>
            <a href={n.fileUrl || "#"} target="_blank" rel="noopener noreferrer"
              style={{
                padding:"6px 14px", borderRadius:6, fontSize:10.5, fontWeight:500,
                background:`${P.pink}08`, border:`1px solid ${P.pink}20`,
                color:P.pink, cursor:"pointer", fontFamily:"'Sora'",
                textDecoration:"none", display:"flex", alignItems:"center", gap:4,
              }}>
              {n.fileName?.endsWith(".mp4") ? "🎬" : "📄"} View {n.fileName?.endsWith(".mp4") ? "Video" : "Doc"}
            </a>
            <button onClick={() => onResolve(n.id, "reviewed")} style={{
              padding:"6px 14px", borderRadius:6, fontSize:10.5, fontWeight:500,
              background:`${P.green}08`, border:`1px solid ${P.green}20`,
              color:P.green, cursor:"pointer", fontFamily:"'Sora'",
            }}>✓ Mark Reviewed</button>
            <span style={{ fontSize:9, color:P.mute, marginLeft:"auto" }}>{n.fileName}</span>
          </>)}

          {/* Chat — view link */}
          {n.actionType === "view_chat" && (
            <button onClick={() => onCampaignClick(n)} style={{
              padding:"6px 14px", borderRadius:6, fontSize:10.5, fontWeight:500,
              background:`${P.accent}08`, border:`1px solid ${P.accent}20`,
              color:P.accent, cursor:"pointer", fontFamily:"'Sora'",
              display:"flex", alignItems:"center", gap:4,
            }}>Open Chat →</button>
          )}

          {/* Budget — view campaign */}
          {n.actionType === "view_campaign" && (
            <button onClick={() => onCampaignClick(n)} style={{
              padding:"6px 14px", borderRadius:6, fontSize:10.5, fontWeight:500,
              background:`${P.amber}08`, border:`1px solid ${P.amber}20`,
              color:P.amber, cursor:"pointer", fontFamily:"'Sora'",
              display:"flex", alignItems:"center", gap:4,
            }}>Review Budget →</button>
          )}

          {/* Full context link — always present */}
          <button onClick={() => onCampaignClick(n)} style={{
            marginLeft: n.actionType === "view_chat" || n.actionType === "view_campaign" ? 0 : "auto",
            padding:"5px 10px", borderRadius:5, fontSize:9, fontWeight:500,
            background:"transparent", border:`1px solid ${P.border}`,
            color:P.sub, cursor:"pointer", fontFamily:"'Sora'",
          }}>Full Context →</button>
        </div>
      )}

      {/* Resolved state */}
      {n.resolved && (
        <div style={{
          marginTop:8, paddingTop:8, borderTop:`1px solid ${P.border}`,
          display:"flex", alignItems:"center", gap:5,
        }}>
          <Dot color={P.green} sz={5}/>
          <span style={{ fontSize:9.5, color:P.doneTxt }}>Resolved</span>
        </div>
      )}
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function NotificationsPage() {
  const { P, theme, setTheme, setPage } = useApp();
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showResolved, setShowResolved] = useState(true);

  const handleResolve = (id, result) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, resolved: true, read: true, result } : n));
  };

  const handleMarkRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleCampaignClick = (n) => {
    // In production: navigate to campaigns page with campaignId pre-selected
    if (n.campaignId) setPage("campaigns", { campaignId: n.campaignId });
  };

  // Filtering
  const filtered = notifs.filter(n => {
    if (!showResolved && n.resolved) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.campaign.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "all") return true;
    const t = TYPES[n.type];
    return t?.filter === filter;
  });

  // Group by date
  const groups = {};
  filtered.forEach(n => {
    if (!groups[n.date]) groups[n.date] = [];
    groups[n.date].push(n);
  });
  const dateOrder = ["Today", "Yesterday", "Earlier"];

  // Stats
  const unreadCount = notifs.filter(n => !n.read).length;
  const actionCount = notifs.filter(n => !n.resolved && TYPES[n.type]?.filter === "action").length;
  const contentCount = notifs.filter(n => !n.resolved && TYPES[n.type]?.filter === "content").length;
  const msgCount = notifs.filter(n => !n.resolved && TYPES[n.type]?.filter === "message").length;

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", background:P.bg, color:P.text, minHeight:"100vh" }}>
      <div style={{ maxWidth:820, margin:"0 auto", padding:"0 28px" }}>

        {/* Header */}
        <header style={{ padding:"24px 0 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:10 }}>
            <div>
              <h1 style={{
                fontFamily:"'Newsreader',serif", fontSize:28, fontWeight:400,
                color:P.white, margin:0, fontStyle:"italic",
              }}>Notifications</h1>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                padding:"5px 12px", borderRadius:6, fontSize:10, fontWeight:500,
                background:P.barBg, border:`1px solid ${P.border}`,
                color:P.sub, cursor:"pointer", fontFamily:"'Sora'",
              }}>Mark all read</button>
            )}
          </div>
        </header>

        {/* Summary cards */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8,
          marginBottom:16,
        }}>
          {[
            ["Unread", unreadCount, P.accent, unreadCount > 0],
            ["Action Required", actionCount, P.amber, actionCount > 0],
            ["New Content", contentCount, P.pink, contentCount > 0],
            ["Messages", msgCount, P.accent, msgCount > 0],
          ].map(([label, count, color, active]) => (
            <div key={label} style={{
              background: active ? `${color}06` : P.surface,
              border: `1px solid ${active ? `${color}15` : P.border}`,
              borderRadius:9, padding:"12px 14px", textAlign:"center",
            }}>
              <div style={{ fontSize:22, fontWeight:700, color: active ? color : P.doneTxt }}>{count}</div>
              <div style={{ fontSize:8.5, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          marginBottom:16, gap:10, flexWrap:"wrap",
        }}>
          <div style={{ display:"flex", gap:3 }}>
            {FILTERS.map(f => {
              const count = f.id === "all" ? filtered.length
                : notifs.filter(n => TYPES[n.type]?.filter === f.id && (!n.resolved || showResolved)).length;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding:"5px 12px", borderRadius:6, fontSize:10, fontWeight:500,
                  background: filter === f.id ? `${P.accent}10` : "transparent",
                  border: `1px solid ${filter === f.id ? `${P.accent}25` : P.border}`,
                  color: filter === f.id ? P.accent : P.mute,
                  cursor:"pointer", fontFamily:"'Sora'",
                  display:"flex", alignItems:"center", gap:4,
                }}>
                  {f.label}
                  <span style={{
                    fontSize:8, fontWeight:700,
                    background: filter === f.id ? `${P.accent}15` : P.barBg,
                    color: filter === f.id ? P.accent : P.mute,
                    padding:"1px 4px", borderRadius:4,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            {/* Search */}
            <div style={{
              display:"flex", alignItems:"center", gap:5,
              background:P.surface, border:`1px solid ${P.border}`,
              borderRadius:6, padding:"5px 9px", width:160,
            }}>
              <span style={{ color:P.mute, fontSize:11 }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                style={{ background:"none", border:"none", outline:"none", color:P.text, fontSize:10, fontFamily:"'Sora'", width:"100%" }} />
            </div>

            {/* Show resolved toggle */}
            <button onClick={() => setShowResolved(!showResolved)} style={{
              padding:"5px 10px", borderRadius:6, fontSize:9.5, fontWeight:500,
              background: showResolved ? `${P.accent}08` : "transparent",
              border: `1px solid ${showResolved ? `${P.accent}20` : P.border}`,
              color: showResolved ? P.accent : P.mute,
              cursor:"pointer", fontFamily:"'Sora'",
            }}>
              {showResolved ? "Hide" : "Show"} resolved
            </button>
          </div>
        </div>

        {/* Notification feed */}
        <div style={{ paddingBottom:40 }}>
          {dateOrder.map(date => {
            const items = groups[date];
            if (!items || items.length === 0) return null;
            return (
              <div key={date} style={{ marginBottom:20 }}>
                <div style={{
                  fontSize:9, color:P.mute, textTransform:"uppercase",
                  letterSpacing:"0.1em", fontWeight:600, marginBottom:8,
                  paddingLeft:4,
                }}>{date}</div>
                {items.map((n, i) => (
                  <NotifCard key={n.id} n={n} P={P}
                    onResolve={handleResolve}
                    onMarkRead={handleMarkRead}
                    onCampaignClick={handleCampaignClick} />
                ))}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"48px 20px" }}>
              <div style={{ fontSize:28, marginBottom:8, opacity:0.15 }}>🔔</div>
              <div style={{ fontSize:13, color:P.sub, fontWeight:500 }}>No notifications</div>
              <div style={{ fontSize:11, color:P.mute, marginTop:3 }}>
                {filter !== "all" ? "Try a different filter." : "You're all caught up!"}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        * { box-sizing:border-box; margin:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(128,128,128,0.1); border-radius:2px; }
        @keyframes au { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .au { animation: au 0.3s cubic-bezier(.25,.46,.45,.94) both; }
        input::placeholder { color:${P.mute}; }
      `}</style>
    </div>
  );
}
