import { useState, useEffect, useMemo } from "react";
import { useApp, DARK, LIGHT } from "../context";

const ROLES = {
  owner:   { label:"Owner",   color:"accent", desc:"Full access — manage team, linked accounts, company details" },
  admin:   { label:"Admin",   color:"pink",   desc:"Manage team + notifications + own profile" },
  member:  { label:"Member",  color:"green",  desc:"View + manage own profile and notifications" },
};

const INIT_TEAM = [
  { id:1, name:"Rahul Sharma",  email:"rahul@freshbite.in",  phone:"+91 98765 43210", role:"owner",  avatar:"RS", lastActive:"Just now",   status:"active",   isMe:true },
  { id:2, name:"Priya Nair",    email:"priya@freshbite.in",  phone:"+91 98765 43211", role:"admin",  avatar:"PN", lastActive:"2 hrs ago",  status:"active" },
  { id:3, name:"Arjun Reddy",   email:"arjun@freshbite.in",  phone:"+91 98765 43212", role:"member", avatar:"AR", lastActive:"Yesterday",  status:"active" },
  { id:4, name:"Sneha Iyer",    email:"sneha@freshbite.in",  phone:"+91 98765 43213", role:"member", avatar:"SI", lastActive:"3 days ago", status:"active" },
  { id:5, name:"Vikram Das",    email:"vikram@freshbite.in", phone:"—",                role:"member", avatar:"VD", lastActive:"Pending",    status:"invited" },
];

const INIT_SESSIONS = [
  { id:1, device:"MacBook Pro — Chrome", location:"Bengaluru, India", ip:"49.37.xx.xx", lastSeen:"Active now", current:true },
  { id:2, device:"iPhone 15 — Safari",   location:"Bengaluru, India", ip:"49.37.xx.xx", lastSeen:"2 hours ago", current:false },
  { id:3, device:"Windows — Firefox",    location:"Mumbai, India",    ip:"27.58.xx.xx", lastSeen:"5 days ago",  current:false },
];

const INIT_NOTIF_PREFS = {
  creatorApproval: { email:true, whatsapp:true, inApp:true },
  briefSignoff:    { email:true, whatsapp:true, inApp:true },
  newContent:      { email:true, whatsapp:false, inApp:true },
  chatMessage:     { email:false, whatsapp:true, inApp:true },
  campaignUpdate:  { email:true, whatsapp:false, inApp:true },
  billing:         { email:true, whatsapp:true, inApp:true },
  weeklyDigest:    { email:true, whatsapp:false, inApp:false },
};

const NOTIF_TYPES = [
  { id:"creatorApproval", label:"Creator Approvals", desc:"When a creator needs your review" },
  { id:"briefSignoff",    label:"Brief Sign-offs",    desc:"When a variable needs your approval" },
  { id:"newContent",      label:"New Content Uploads", desc:"When creators upload concepts or videos" },
  { id:"chatMessage",     label:"Chat Messages",      desc:"New messages from agency team" },
  { id:"campaignUpdate",  label:"Campaign Updates",   desc:"Phase changes, milestones, live events" },
  { id:"billing",         label:"Billing & Invoices", desc:"New invoices, payment reminders, receipts" },
  { id:"weeklyDigest",    label:"Weekly Digest",      desc:"Summary of last 7 days — every Monday" },
];

const COMPANY = {
  name:"FreshBite Foods Pvt. Ltd.",
  gstin:"29ABCDE1234F1Z5",
  pan:"ABCDE1234F",
  industry:"FMCG — Snacks & Beverages",
  size:"50–200 employees",
  website:"https://freshbite.in",
  address:"12th Floor, Prestige Tower, MG Road, Bengaluru 560001, Karnataka, India",
  billingEmail:"accounts@freshbite.in",
  onboardedOn:"January 15, 2026",
  accountManager:"Priya Nair (5th Avenue)",
};

const Dot = ({color,sz=6}) => <span style={{width:sz,height:sz,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}}/>;

/* ═══ TOGGLE SWITCH ═══ */
function Toggle({ on, onChange, P, disabled }) {
  return (
    <button onClick={() => !disabled && onChange(!on)} disabled={disabled} style={{
      width:32, height:18, borderRadius:10, padding:2,
      background: on ? P.accent : P.barBg,
      border: `1px solid ${on ? P.accent : P.border}`,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s",
      opacity: disabled ? 0.4 : 1,
      position:"relative", flexShrink:0,
    }}>
      <div style={{
        width:12, height:12, borderRadius:"50%",
        background: on ? "#050A18" : P.sub,
        position:"absolute", top:2,
        left: on ? 16 : 2,
        transition: "left 0.2s",
      }}/>
    </button>
  );
}

/* ═══ SECTION WRAPPER ═══ */
function Section({ title, desc, children, P, readonly }) {
  return (
    <section className="au" style={{ marginBottom:20 }}>
      <div style={{ marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
        <h2 style={{ fontFamily:"'Newsreader',serif", fontSize:17, fontWeight:600, color:P.white, margin:0, fontStyle:"italic" }}>{title}</h2>
        {readonly && <span style={{ fontSize:8, color:P.mute, background:P.barBg, padding:"2px 6px", borderRadius:3, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.05em" }}>View Only</span>}
      </div>
      {desc && <p style={{ fontSize:10.5, color:P.sub, margin:"0 0 12px", lineHeight:1.5 }}>{desc}</p>}
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:10, padding:"16px 18px" }}>
        {children}
      </div>
    </section>
  );
}

/* ═══ PROFILE SECTION ═══ */
function ProfileSection({ me, setMe, P }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(me);
  const save = () => { setMe(form); setEditing(false); };

  const fieldStyle = {
    width:"100%", padding:"7px 10px", borderRadius:6,
    background:P.bg, border:`1px solid ${P.border}`,
    color:P.text, fontSize:11.5, fontFamily:"'Sora'", outline:"none",
  };

  return (
    <Section title="Profile" desc="Manage your personal information. Only you can edit this." P={P}>
      <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:14 }}>
        {/* Avatar */}
        <div style={{
          width:60, height:60, borderRadius:14,
          background:`${P.accent}15`, border:`2px solid ${P.accent}25`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:20, fontWeight:700, color:P.accent, flexShrink:0,
        }}>{form.avatar}</div>

        <div style={{ flex:1 }}>
          {editing ? (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div>
                <label style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:3, display:"block" }}>Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name:e.target.value})} style={fieldStyle}/>
              </div>
              <div>
                <label style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:3, display:"block" }}>Email</label>
                <input value={form.email} onChange={e => setForm({...form, email:e.target.value})} style={fieldStyle}/>
              </div>
              <div>
                <label style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:3, display:"block" }}>Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} style={fieldStyle}/>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:15, fontWeight:600, color:P.text, fontFamily:"'Sora'" }}>{me.name}</div>
              <div style={{ fontSize:10.5, color:P.sub, marginTop:3, lineHeight:1.6 }}>
                <div>{me.email}</div>
                <div>{me.phone}</div>
              </div>
              <div style={{ marginTop:6 }}>
                <span style={{ fontSize:8.5, color:P[ROLES[me.role].color], background:`${P[ROLES[me.role].color]}12`, padding:"2px 7px", borderRadius:4, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{ROLES[me.role].label}</span>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => editing ? save() : setEditing(true)} style={{
          padding:"6px 14px", borderRadius:6, fontSize:10, fontWeight:500,
          background: editing ? P.accent : P.barBg,
          border:`1px solid ${editing ? P.accent : P.border}`,
          color: editing ? "#050A18" : P.sub,
          cursor:"pointer", fontFamily:"'Sora'", flexShrink:0,
        }}>{editing ? "Save" : "Edit"}</button>

        {editing && <button onClick={() => { setForm(me); setEditing(false); }} style={{
          padding:"6px 10px", borderRadius:6, fontSize:10,
          background:"transparent", border:`1px solid ${P.border}`,
          color:P.mute, cursor:"pointer", fontFamily:"'Sora'",
        }}>Cancel</button>}
      </div>

      <div style={{ display:"flex", gap:8, marginTop:10 }}>
        <button style={{ padding:"5px 10px", borderRadius:5, fontSize:9, background:P.barBg, border:`1px solid ${P.border}`, color:P.sub, cursor:"pointer", fontFamily:"'Sora'" }}>Change Photo</button>
        <button style={{ padding:"5px 10px", borderRadius:5, fontSize:9, background:P.barBg, border:`1px solid ${P.border}`, color:P.sub, cursor:"pointer", fontFamily:"'Sora'" }}>Remove Photo</button>
      </div>
    </Section>
  );
}

/* ═══ TEAM SECTION ═══ */
function TeamSection({ team, setTeam, myRole, P }) {
  const [inviting, setInviting] = useState(false);
  const [newMember, setNewMember] = useState({ name:"", email:"", role:"member" });

  const canManage = myRole === "owner" || myRole === "admin";

  const invite = () => {
    if (!newMember.name || !newMember.email) return;
    const id = Date.now();
    const avatar = newMember.name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
    setTeam(prev => [...prev, { id, ...newMember, phone:"—", avatar, lastActive:"Pending", status:"invited" }]);
    setNewMember({ name:"", email:"", role:"member" });
    setInviting(false);
  };

  const removeMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const changeRole = (id, role) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  };

  return (
    <Section title="Team Members" desc={`${team.length} members · ${team.filter(m => m.status === "active").length} active · ${team.filter(m => m.status === "invited").length} pending invitations`} P={P}>
      {/* Invite row */}
      {canManage && (
        <div style={{ marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${P.border}` }}>
          {!inviting ? (
            <button onClick={() => setInviting(true)} style={{
              padding:"7px 14px", borderRadius:6, fontSize:10.5, fontWeight:500,
              background:`${P.accent}08`, border:`1px solid ${P.accent}25`,
              color:P.accent, cursor:"pointer", fontFamily:"'Sora'",
            }}>+ Invite Team Member</button>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:9, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Invite New Member</div>
              <div style={{ display:"flex", gap:6 }}>
                <input value={newMember.name} onChange={e => setNewMember({...newMember, name:e.target.value})} placeholder="Full name" style={{ flex:1, padding:"7px 10px", borderRadius:6, background:P.bg, border:`1px solid ${P.border}`, color:P.text, fontSize:11, fontFamily:"'Sora'", outline:"none" }}/>
                <input value={newMember.email} onChange={e => setNewMember({...newMember, email:e.target.value})} placeholder="email@company.com" style={{ flex:1.5, padding:"7px 10px", borderRadius:6, background:P.bg, border:`1px solid ${P.border}`, color:P.text, fontSize:11, fontFamily:"'Sora'", outline:"none" }}/>
                <select value={newMember.role} onChange={e => setNewMember({...newMember, role:e.target.value})} style={{ padding:"7px 10px", borderRadius:6, background:P.bg, border:`1px solid ${P.border}`, color:P.text, fontSize:11, fontFamily:"'Sora'", outline:"none" }}>
                  {myRole === "owner" && <option value="admin">Admin</option>}
                  <option value="member">Member</option>
                </select>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={invite} disabled={!newMember.name || !newMember.email} style={{
                  padding:"6px 14px", borderRadius:6, fontSize:10, fontWeight:600,
                  background: (newMember.name && newMember.email) ? P.accent : P.barBg,
                  border:"none", color: (newMember.name && newMember.email) ? "#050A18" : P.mute,
                  cursor: (newMember.name && newMember.email) ? "pointer" : "not-allowed",
                  fontFamily:"'Sora'",
                }}>Send Invite</button>
                <button onClick={() => { setInviting(false); setNewMember({ name:"", email:"", role:"member" }); }} style={{
                  padding:"6px 12px", borderRadius:6, fontSize:10, background:P.barBg,
                  border:`1px solid ${P.border}`, color:P.sub, cursor:"pointer", fontFamily:"'Sora'",
                }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Team list */}
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        {team.map(m => {
          const roleColor = P[ROLES[m.role].color];
          const canEditThis = canManage && !m.isMe && (myRole === "owner" || (myRole === "admin" && m.role === "member"));
          return (
            <div key={m.id} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:8,
              background: m.status === "invited" ? `${P.amber}04` : "transparent",
              border: `1px solid ${m.status === "invited" ? `${P.amber}15` : "transparent"}`,
            }}>
              {/* Avatar */}
              <div style={{
                width:32, height:32, borderRadius:8,
                background:`${roleColor}12`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10.5, fontWeight:700, color:roleColor, flexShrink:0,
              }}>{m.avatar}</div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:12, fontWeight:500, color:P.text }}>{m.name}</span>
                  {m.isMe && <span style={{ fontSize:7.5, color:P.accent, background:`${P.accent}10`, padding:"1px 5px", borderRadius:3, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>You</span>}
                  {m.status === "invited" && <span style={{ fontSize:7.5, color:P.amber, background:`${P.amber}10`, padding:"1px 5px", borderRadius:3, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Pending</span>}
                </div>
                <div style={{ fontSize:9.5, color:P.sub, marginTop:2 }}>{m.email} · {m.lastActive}</div>
              </div>

              {/* Role */}
              {canEditThis && !m.isMe ? (
                <select value={m.role} onChange={e => changeRole(m.id, e.target.value)} style={{
                  padding:"3px 6px", borderRadius:4, fontSize:9, fontWeight:600,
                  background: `${roleColor}10`, border:`1px solid ${roleColor}20`,
                  color: roleColor, cursor:"pointer", fontFamily:"'Sora'",
                  textTransform:"uppercase", letterSpacing:"0.04em",
                }}>
                  {myRole === "owner" && <option value="admin">Admin</option>}
                  <option value="member">Member</option>
                </select>
              ) : (
                <span style={{ fontSize:8.5, color:roleColor, background:`${roleColor}12`, padding:"2px 7px", borderRadius:4, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{ROLES[m.role].label}</span>
              )}

              {/* Remove */}
              {canEditThis && (
                <button onClick={() => removeMember(m.id)} style={{
                  padding:"4px 8px", borderRadius:4, fontSize:9,
                  background:"transparent", border:`1px solid ${P.border}`,
                  color:P.mute, cursor:"pointer", fontFamily:"'Sora'",
                }}>Remove</button>
              )}
            </div>
          );
        })}
      </div>

      {!canManage && (
        <div style={{ fontSize:10, color:P.mute, fontStyle:"italic", marginTop:10, paddingTop:10, borderTop:`1px solid ${P.border}` }}>
          Only Owners and Admins can invite or manage team members.
        </div>
      )}
    </Section>
  );
}

/* ═══ NOTIFICATIONS SECTION ═══ */
function NotificationsSection({ prefs, setPrefs, P }) {
  const toggle = (type, channel) => {
    setPrefs(prev => ({ ...prev, [type]: { ...prev[type], [channel]: !prev[type][channel] } }));
  };

  return (
    <Section title="Notification Preferences" desc="Choose how you want to be alerted. Changes apply only to your account." P={P}>
      {/* Header row */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 70px 70px 70px",
        gap:8, paddingBottom:10, borderBottom:`1px solid ${P.border}`,
      }}>
        <span style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Event</span>
        {["Email","WhatsApp","In-App"].map(h => (
          <span key={h} style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, textAlign:"center" }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {NOTIF_TYPES.map((n, i) => (
        <div key={n.id} style={{
          display:"grid", gridTemplateColumns:"1fr 70px 70px 70px",
          gap:8, padding:"10px 0",
          borderBottom: i < NOTIF_TYPES.length - 1 ? `1px solid ${P.border}` : "none",
          alignItems:"center",
        }}>
          <div>
            <div style={{ fontSize:11.5, fontWeight:500, color:P.text }}>{n.label}</div>
            <div style={{ fontSize:9.5, color:P.mute, marginTop:2 }}>{n.desc}</div>
          </div>
          <div style={{ display:"flex", justifyContent:"center" }}><Toggle on={prefs[n.id].email} onChange={() => toggle(n.id, "email")} P={P}/></div>
          <div style={{ display:"flex", justifyContent:"center" }}><Toggle on={prefs[n.id].whatsapp} onChange={() => toggle(n.id, "whatsapp")} P={P}/></div>
          <div style={{ display:"flex", justifyContent:"center" }}><Toggle on={prefs[n.id].inApp} onChange={() => toggle(n.id, "inApp")} P={P}/></div>
        </div>
      ))}

      <div style={{ fontSize:9.5, color:P.mute, fontStyle:"italic", marginTop:12, display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ color:P.green }}>💬</span>
        WhatsApp notifications sent via 5th Avenue's verified business number (+91 80 4567 8900).
      </div>
    </Section>
  );
}

/* ═══ SECURITY SECTION ═══ */
function SecuritySection({ sessions, setSessions, P }) {
  const [changingPw, setChangingPw] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [pw, setPw] = useState({ current:"", next:"", confirm:"" });

  const revokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const canSavePw = pw.current && pw.next && pw.next === pw.confirm && pw.next.length >= 8;

  return (
    <Section title="Security" desc="Your account security settings — only you can edit." P={P}>
      {/* Password */}
      <div style={{ paddingBottom:14, marginBottom:14, borderBottom:`1px solid ${P.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: changingPw ? 10 : 0 }}>
          <div>
            <div style={{ fontSize:11.5, fontWeight:500, color:P.text }}>Password</div>
            <div style={{ fontSize:9.5, color:P.mute, marginTop:2 }}>Last changed 23 days ago</div>
          </div>
          <button onClick={() => setChangingPw(!changingPw)} style={{
            padding:"6px 12px", borderRadius:6, fontSize:10,
            background: changingPw ? P.barBg : `${P.accent}08`,
            border:`1px solid ${changingPw ? P.border : `${P.accent}25`}`,
            color: changingPw ? P.sub : P.accent,
            cursor:"pointer", fontFamily:"'Sora'",
          }}>{changingPw ? "Cancel" : "Change Password"}</button>
        </div>

        {changingPw && (
          <div className="au" style={{ display:"flex", flexDirection:"column", gap:7, marginTop:10 }}>
            <input type="password" value={pw.current} onChange={e => setPw({...pw, current:e.target.value})} placeholder="Current password" style={{ padding:"7px 10px", borderRadius:6, background:P.bg, border:`1px solid ${P.border}`, color:P.text, fontSize:11, fontFamily:"'Sora'", outline:"none" }}/>
            <input type="password" value={pw.next} onChange={e => setPw({...pw, next:e.target.value})} placeholder="New password (min 8 characters)" style={{ padding:"7px 10px", borderRadius:6, background:P.bg, border:`1px solid ${P.border}`, color:P.text, fontSize:11, fontFamily:"'Sora'", outline:"none" }}/>
            <input type="password" value={pw.confirm} onChange={e => setPw({...pw, confirm:e.target.value})} placeholder="Confirm new password" style={{ padding:"7px 10px", borderRadius:6, background:P.bg, border:`1px solid ${P.border}`, color:P.text, fontSize:11, fontFamily:"'Sora'", outline:"none" }}/>
            {pw.next && pw.confirm && pw.next !== pw.confirm && <div style={{ fontSize:9, color:P.red }}>Passwords don't match</div>}
            <button onClick={() => canSavePw && (setChangingPw(false), setPw({ current:"", next:"", confirm:"" }))} disabled={!canSavePw} style={{
              padding:"7px 12px", borderRadius:6, fontSize:10, fontWeight:600, alignSelf:"flex-start",
              background: canSavePw ? P.accent : P.barBg, border:"none",
              color: canSavePw ? "#050A18" : P.mute,
              cursor: canSavePw ? "pointer" : "not-allowed", fontFamily:"'Sora'",
            }}>Update Password</button>
          </div>
        )}
      </div>

      {/* 2FA */}
      <div style={{ paddingBottom:14, marginBottom:14, borderBottom:`1px solid ${P.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11.5, fontWeight:500, color:P.text }}>Two-Factor Authentication</span>
            {twoFA && <span style={{ fontSize:7.5, color:P.green, background:`${P.green}12`, padding:"1px 5px", borderRadius:3, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Enabled</span>}
          </div>
          <div style={{ fontSize:9.5, color:P.mute, marginTop:2 }}>Via SMS to +91 98765 43210</div>
        </div>
        <Toggle on={twoFA} onChange={setTwoFA} P={P}/>
      </div>

      {/* Active sessions */}
      <div>
        <div style={{ fontSize:9, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:8 }}>Active Sessions</div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {sessions.map(s => (
            <div key={s.id} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:7,
              background: s.current ? `${P.green}05` : "transparent",
              border: `1px solid ${s.current ? `${P.green}15` : P.border}`,
            }}>
              <Dot color={s.current ? P.green : P.mute} sz={7}/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:11.5, fontWeight:500, color:P.text }}>{s.device}</span>
                  {s.current && <span style={{ fontSize:7.5, color:P.green, background:`${P.green}12`, padding:"1px 5px", borderRadius:3, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>This device</span>}
                </div>
                <div style={{ fontSize:9.5, color:P.mute, marginTop:2 }}>{s.location} · {s.ip} · {s.lastSeen}</div>
              </div>
              {!s.current && (
                <button onClick={() => revokeSession(s.id)} style={{
                  padding:"4px 9px", borderRadius:5, fontSize:9,
                  background:`${P.red}08`, border:`1px solid ${P.red}15`,
                  color:P.red, cursor:"pointer", fontFamily:"'Sora'",
                }}>Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══ LINKED ACCOUNTS (Owner only) ═══ */
function LinkedAccountsSection({ P }) {
  const [accounts, setAccounts] = useState([
    { id:1, type:"google",  label:"Google — rahul@freshbite.in",    connected:true,  color:"red",   icon:"G" },
    { id:2, type:"upi",     label:"UPI Mandate — rahul@okaxis",     connected:true,  color:"accent",icon:"📱", extra:"Auto-pay active for retainer" },
    { id:3, type:"bank",    label:"HDFC Bank — ****4521",           connected:true,  color:"green", icon:"🏦", extra:"Primary payment method" },
    { id:4, type:"whatsapp",label:"WhatsApp Business",              connected:true,  color:"green", icon:"💬", extra:"Notifications via +91 80 4567 8900" },
    { id:5, type:"slack",   label:"Slack",                          connected:false, color:"pink",  icon:"S" },
  ]);

  const toggle = (id) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, connected: !a.connected } : a));
  };

  return (
    <Section title="Linked Accounts" desc="Manage your connected services, payment mandates, and integrations. Owner-only access." P={P}>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {accounts.map(a => (
          <div key={a.id} style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"10px 12px", borderRadius:7,
            background:"transparent", border:`1px solid ${P.border}`,
          }}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background: a.connected ? `${P[a.color] || P.accent}15` : P.barBg,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize: typeof a.icon === "string" && a.icon.length > 1 ? 14 : 11,
              fontWeight:700, color: a.connected ? (P[a.color] || P.accent) : P.mute,
              flexShrink:0,
            }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11.5, fontWeight:500, color:P.text }}>{a.label}</div>
              {a.extra && <div style={{ fontSize:9.5, color:P.sub, marginTop:2 }}>{a.extra}</div>}
            </div>
            <button onClick={() => toggle(a.id)} style={{
              padding:"5px 12px", borderRadius:5, fontSize:9.5, fontWeight:500,
              background: a.connected ? P.barBg : `${P.accent}08`,
              border: `1px solid ${a.connected ? P.border : `${P.accent}25`}`,
              color: a.connected ? P.sub : P.accent,
              cursor:"pointer", fontFamily:"'Sora'",
            }}>{a.connected ? "Disconnect" : "Connect"}</button>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ═══ COMPANY DETAILS (read-only for Owner) ═══ */
function CompanyDetailsSection({ P }) {
  return (
    <Section title="Company Details" desc="Maintained by 5th Avenue account manager. Contact your AM to update." P={P} readonly>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[
          ["Company Name", COMPANY.name],
          ["Industry", COMPANY.industry],
          ["GSTIN", COMPANY.gstin],
          ["PAN", COMPANY.pan],
          ["Company Size", COMPANY.size],
          ["Website", COMPANY.website],
          ["Billing Email", COMPANY.billingEmail],
          ["Onboarded On", COMPANY.onboardedOn],
        ].map(([label, value]) => (
          <div key={label}>
            <div style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:3 }}>{label}</div>
            <div style={{ fontSize:11, color:P.text, fontFamily:"'Sora'" }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${P.border}` }}>
        <div style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:3 }}>Registered Address</div>
        <div style={{ fontSize:11, color:P.text, lineHeight:1.6 }}>{COMPANY.address}</div>
      </div>
      <div style={{ marginTop:14, padding:"10px 12px", background:`${P.accent}06`, border:`1px solid ${P.accent}12`, borderRadius:7, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:14 }}>👤</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, color:P.mute }}>Your Account Manager</div>
          <div style={{ fontSize:11, color:P.text, fontWeight:500, marginTop:1 }}>{COMPANY.accountManager}</div>
        </div>
        <button style={{ padding:"5px 11px", borderRadius:5, fontSize:9.5, background:P.accent, border:"none", color:"#050A18", fontWeight:600, cursor:"pointer", fontFamily:"'Sora'" }}>Contact →</button>
      </div>
    </Section>
  );
}

/* ═══ MAIN ═══ */
export default function SettingsPage() {
  const { P, theme, setTheme, setPage, role: appRole, setRole: setAppRole } = useApp();

  const [team, setTeam] = useState(INIT_TEAM);
  const [me, setMe] = useState(team.find(m => m.isMe));
  const myRole = me.role;

  const [notifPrefs, setNotifPrefs] = useState(INIT_NOTIF_PREFS);
  const [sessions, setSessions] = useState(INIT_SESSIONS);

  // Role switcher — bound to App-level role so sidebar reflects changes
  const demoRole = appRole;
  const setDemoRole = setAppRole;

  // Update my role when demo role changes (for preview)
  useEffect(() => {
    setMe(prev => ({ ...prev, role: demoRole }));
    setTeam(prev => prev.map(m => m.isMe ? { ...m, role: demoRole } : m));
  }, [demoRole]);

  const effectiveRole = demoRole;
  const isOwner = effectiveRole === "owner";

  const [section, setSection] = useState("profile");

  const navItems = [
    { id:"profile", label:"Profile", icon:"👤" },
    { id:"team", label:"Team Members", icon:"👥" },
    { id:"notifications", label:"Notifications", icon:"🔔" },
    { id:"security", label:"Security", icon:"🔒" },
    ...(isOwner ? [
      { id:"linked", label:"Linked Accounts", icon:"🔗" },
      { id:"company", label:"Company Details", icon:"🏢" },
    ] : []),
  ];

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", background:P.bg, color:P.text, minHeight:"100vh" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px" }}>

        {/* Header */}
        <header style={{ padding:"24px 0 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <h1 style={{ fontFamily:"'Newsreader',serif", fontSize:28, fontWeight:400, color:P.white, margin:0, fontStyle:"italic" }}>Settings</h1>
            {/* Role switcher — demo */}
            <div style={{ display:"flex", background:P.surface, borderRadius:5, border:`1px solid ${P.border}`, overflow:"hidden" }}>
              <span style={{ fontSize:8, color:P.mute, padding:"4px 8px", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.04em", alignSelf:"center" }}>Role preview:</span>
              {["owner","admin","member"].map(r => (
                <button key={r} onClick={() => setDemoRole(r)} style={{
                  padding:"4px 10px", fontSize:9, fontWeight:500,
                  background: demoRole === r ? `${P[ROLES[r].color]}12` : "transparent",
                  border:"none",
                  color: demoRole === r ? P[ROLES[r].color] : P.mute,
                  cursor:"pointer", fontFamily:"'Sora'",
                  textTransform:"uppercase", letterSpacing:"0.04em",
                }}>{ROLES[r].label}</button>
              ))}
            </div>
          </div>
        </header>

        {/* Layout: sidebar nav + content */}
        <div style={{ display:"flex", gap:24, paddingBottom:40 }}>
          {/* Sidebar */}
          <aside style={{ width:200, flexShrink:0, position:"sticky", top:20, alignSelf:"flex-start" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => setSection(item.id)} style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"8px 12px", borderRadius:7,
                  background: section === item.id ? `${P.accent}08` : "transparent",
                  border: `1px solid ${section === item.id ? `${P.accent}15` : "transparent"}`,
                  color: section === item.id ? P.accent : P.sub,
                  fontSize:11, fontWeight:500, fontFamily:"'Sora'",
                  cursor:"pointer", textAlign:"left",
                  transition:"all 0.15s",
                }}
                  onMouseOver={e => { if (section !== item.id) e.currentTarget.style.background = P.hover; }}
                  onMouseOut={e => { if (section !== item.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize:13 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Role info */}
            <div style={{ marginTop:20, padding:"10px 12px", background:P.surface, borderRadius:7, border:`1px solid ${P.border}` }}>
              <div style={{ fontSize:8, color:P.mute, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:4 }}>Your Role</div>
              <div style={{ fontSize:11, fontWeight:600, color:P[ROLES[effectiveRole].color] }}>{ROLES[effectiveRole].label}</div>
              <div style={{ fontSize:9, color:P.mute, marginTop:4, lineHeight:1.5 }}>{ROLES[effectiveRole].desc}</div>
            </div>
          </aside>

          {/* Content */}
          <main style={{ flex:1, minWidth:0 }}>
            {section === "profile" && <ProfileSection me={me} setMe={setMe} P={P}/>}
            {section === "team" && <TeamSection team={team} setTeam={setTeam} myRole={effectiveRole} P={P}/>}
            {section === "notifications" && <NotificationsSection prefs={notifPrefs} setPrefs={setNotifPrefs} P={P}/>}
            {section === "security" && <SecuritySection sessions={sessions} setSessions={setSessions} P={P}/>}
            {section === "linked" && isOwner && <LinkedAccountsSection P={P}/>}
            {section === "company" && isOwner && <CompanyDetailsSection P={P}/>}
          </main>
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
        select { appearance:none; -webkit-appearance:none; -moz-appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%237B8DB0' d='M4 6L0 2h8z'/%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:right 7px center; padding-right:22px !important; }
      `}</style>
    </div>
  );
}
