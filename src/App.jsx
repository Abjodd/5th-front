import { useState, useEffect, useMemo } from "react";
import { DARK, LIGHT, AppContext, useApp } from "./context";

// Import each page
import OverviewPage from "./pages/Overview";
import CampaignsPage from "./pages/Campaigns";
import RegionalMapPage from "./pages/RegionalMap";
import NotificationsPage from "./pages/Notifications";
import BillingPage from "./pages/Billing";
import SettingsPage from "./pages/Settings";

// ═══ SHARED CONSTANTS ═══
const FONT = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap";

const NAV_ITEMS = [
  { id:"overview",      label:"Overview",       icon:"◎" },
  { id:"campaigns",     label:"Campaigns",      icon:"▤" },
  { id:"regional",      label:"Regional Map",   icon:"◯" },
  { id:"notifications", label:"Notifications",  icon:"⚑", badgeKey:"unread" },
  { id:"billing",       label:"Billing",        icon:"₹", badgeKey:"unpaid" },
  { id:"settings",      label:"Settings",       icon:"◈" },
];

// ═══ SIDEBAR ═══
function Sidebar({ collapsed, setCollapsed, badges }) {
  const { P, page, setPage, theme, setTheme, role } = useApp();

  return (
    <aside style={{
      width: collapsed ? 56 : 220, flexShrink: 0,
      background: P.surface, borderRight: `1px solid ${P.border}`,
      display: "flex", flexDirection: "column",
      transition: "width 0.2s ease",
      position: "sticky", top: 0, height: "100vh", zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "18px 12px" : "18px 18px",
        borderBottom: `1px solid ${P.border}`,
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between", gap: 8,
      }}>
        {!collapsed && (
          <span style={{
            fontFamily: "'Newsreader',serif", fontSize: 14, fontWeight: 600,
            color: P.white, letterSpacing: "0.06em",
          }}>5th Avenue</span>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: 22, height: 22, borderRadius: 5,
          background: P.barBg, border: `1px solid ${P.border}`,
          color: P.sub, fontSize: 10, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Sora'",
        }}>{collapsed ? "›" : "‹"}</button>
      </div>

      {/* Client switcher */}
      {!collapsed && (
        <div style={{
          padding: "12px 14px", borderBottom: `1px solid ${P.border}`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: `${P.accent}15`, border: `1px solid ${P.accent}20`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: P.accent, flexShrink: 0,
          }}>FB</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: P.text, fontWeight: 500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>FreshBite Foods</div>
            <div style={{ fontSize: 9, color: P.mute, marginTop: 1 }}>Pvt. Ltd.</div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const isActive = page === item.id;
          const badge = item.badgeKey ? badges[item.badgeKey] : null;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: collapsed ? "9px" : "9px 12px",
              marginBottom: 2, borderRadius: 7,
              background: isActive ? `${P.accent}12` : "transparent",
              border: "none", color: isActive ? P.accent : P.sub,
              fontSize: 11.5, fontWeight: 500, fontFamily: "'Sora'",
              cursor: "pointer", textAlign: "left",
              justifyContent: collapsed ? "center" : "flex-start",
              position: "relative", transition: "all 0.15s",
            }}
              onMouseOver={e => { if (!isActive) e.currentTarget.style.background = P.hover; }}
              onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              title={collapsed ? item.label : undefined}
            >
              <span style={{
                fontSize: 14, width: 18, textAlign: "center", flexShrink: 0,
                color: isActive ? P.accent : P.sub,
              }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badge > 0 && (
                    <span style={{
                      fontSize: 8.5, fontWeight: 700,
                      background: item.id === "billing" ? P.amber : P.accent,
                      color: "#050A18",
                      padding: "1px 6px", borderRadius: 8, lineHeight: 1.5,
                    }}>{badge}</span>
                  )}
                </>
              )}
              {collapsed && badge > 0 && (
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  width: 6, height: 6, borderRadius: "50%",
                  background: item.id === "billing" ? P.amber : P.accent,
                }}/>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 8px", borderTop: `1px solid ${P.border}`, display:"flex", flexDirection:"column", gap:6 }}>
        {!collapsed && (
          <div style={{ padding: "8px 10px", background: P.bg, borderRadius: 7, border: `1px solid ${P.border}`, display:"flex", alignItems:"center", gap:8 }}>
            <div style={{
              width:26, height:26, borderRadius:7,
              background:`${P.accent}15`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:10, fontWeight:700, color:P.accent,
              flexShrink:0,
            }}>RS</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize: 10.5, color: P.text, fontWeight: 600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Rahul Sharma</div>
              <div style={{ fontSize: 8.5, color: P.accent, textTransform: "capitalize" }}>{role}</div>
            </div>
          </div>
        )}
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
          padding: collapsed ? "7px" : "7px 10px", borderRadius: 6,
          fontSize: 10, fontWeight: 500,
          background: P.barBg, border: `1px solid ${P.border}`,
          color: P.sub, cursor: "pointer", fontFamily: "'Sora'",
          display: "flex", alignItems: "center", gap: 6,
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <span>{theme === "dark" ? "☀" : "☾"}</span>
          {!collapsed && (theme === "dark" ? "Light mode" : "Dark mode")}
        </button>
      </div>
    </aside>
  );
}

// ═══ MAIN APP ═══
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [role, setRole] = useState("owner"); // owner | admin | member
  const [page, setPageState] = useState("overview");
  const [navParams, setNavParams] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const P = theme === "dark" ? DARK : LIGHT;

  // Navigation helper — lets any page jump to another with params
  const setPage = (newPage, params = {}) => {
    setPageState(newPage);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load fonts once
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONT}"]`)) {
      const l = document.createElement("link");
      l.href = FONT;
      l.rel = "stylesheet";
      document.head.appendChild(l);
    }
  }, []);

  // Badges (in production: fetched from API)
  const badges = useMemo(() => ({
    unread: 5,   // unread notifications count
    unpaid: 3,   // unpaid invoices count
  }), []);

  const ctxValue = { theme, setTheme, role, setRole, page, setPage, navParams, P };

  return (
    <AppContext.Provider value={ctxValue}>
      <div style={{
        fontFamily: "'Sora',sans-serif",
        background: P.bg, color: P.text,
        minHeight: "100vh",
        display: "flex",
      }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} badges={badges} />

        {/* Main content area */}
        <main style={{
          flex: 1, minWidth: 0,
          display: "flex", flexDirection: "column",
        }}>
          {page === "overview" && <OverviewPage />}
          {page === "campaigns" && <CampaignsPage />}
          {page === "regional" && <RegionalMapPage />}
          {page === "notifications" && <NotificationsPage />}
          {page === "billing" && <BillingPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body { font-family: 'Sora', -apple-system, sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.15); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.25); }
        @keyframes au { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .au { animation: au 0.3s cubic-bezier(.25,.46,.45,.94) both; }
        @keyframes fi { from { opacity: 0; } to { opacity: 1; } }
        .fi { animation: fi 0.2s ease both; }
        @keyframes pulse { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        .pulse { animation: pulse 1.2s ease-in-out infinite; }
        select {
          appearance: none; -webkit-appearance: none; -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%237B8DB0' d='M4 6L0 2h8z'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 7px center;
          padding-right: 22px !important;
        }
        input::placeholder { color: ${P.mute}; }
      `}</style>
    </AppContext.Provider>
  );
}
