import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ─── FONT INJECTION ─────────────────────────────────────── */
const style = document.createElement("style");
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0D0D0D; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1A1A1A; }
  ::-webkit-scrollbar-thumb { background: #E8640A; border-radius: 2px; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes slideIn { from { transform:translateX(-20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes scaleIn { from { transform:scale(0.95); opacity:0; } to { transform:scale(1); opacity:1; } }
`;
document.head.appendChild(style);

/* ─── THEME ──────────────────────────────────────────────── */
const T = {
  bg: "#0D0D0D",
  surface: "#161616",
  elevated: "#1F1F1F",
  card: "#242424",
  border: "#2E2E2E",
  orange: "#E8640A",
  orangeLight: "#FF7820",
  orangeDim: "rgba(232,100,10,0.15)",
  orangeGlow: "rgba(232,100,10,0.4)",
  text: "#F2EDE8",
  textSec: "#9A8878",
  textDim: "#5A4A3A",
  green: "#22C55E",
  red: "#EF4444",
  blue: "#3B82F6",
  yellow: "#F59E0B",
};

/* ─── MOCK DATA ──────────────────────────────────────────── */
const MENU_ITEMS = [
  { id:1, name:"Crepe Nutella", cat:"Crepes", price:8.00, emoji:"🥞", stock:40 },
  { id:2, name:"Crepe Strawberry", cat:"Crepes", price:8.50, emoji:"🍓", stock:35 },
  { id:3, name:"Crepe Ham & Cheese", cat:"Crepes", price:9.00, emoji:"🧀", stock:28 },
  { id:4, name:"Crepe Chicken", cat:"Crepes", price:10.00, emoji:"🍗", stock:22 },
  { id:5, name:"Elote en Vaso", cat:"Elotes", price:6.00, emoji:"🌽", stock:50 },
  { id:6, name:"Elote Preparado", cat:"Elotes", price:7.50, emoji:"🌽", stock:45 },
  { id:7, name:"Esquite", cat:"Elotes", price:6.50, emoji:"🥣", stock:40 },
  { id:8, name:"Agua Fresca", cat:"Drinks", price:3.50, emoji:"🥤", stock:60 },
  { id:9, name:"Horchata", cat:"Drinks", price:4.00, emoji:"🥛", stock:55 },
  { id:10, name:"Jarritos", cat:"Drinks", price:3.00, emoji:"🍾", stock:70 },
  { id:11, name:"Michelada", cat:"Drinks", price:7.00, emoji:"🍺", stock:30 },
  { id:12, name:"Tostilocos", cat:"Snacks", price:5.00, emoji:"🌮", stock:25 },
];

const CATEGORIES = ["All", "Crepes", "Elotes", "Drinks", "Snacks"];

const WORKERS = [
  { id:1, name:"Maria Garcia", role:"Cashier", pin:"1234", active:true, hourlyRate:15 },
  { id:2, name:"Juan Lopez", role:"Cook", pin:"5678", active:true, hourlyRate:16 },
  { id:3, name:"Sofia Martinez", role:"Cashier", pin:"9012", active:false, hourlyRate:15 },
  { id:4, name:"Carlos Rivera", role:"Manager", pin:"3456", active:true, hourlyRate:18 },
];

const SALES_DATA = [
  { day:"Mon", sales:412, orders:58 },
  { day:"Tue", sales:538, orders:74 },
  { day:"Wed", sales:390, orders:52 },
  { day:"Thu", sales:620, orders:88 },
  { day:"Fri", sales:845, orders:112 },
  { day:"Sat", sales:1240, orders:165 },
  { day:"Sun", sales:980, orders:128 },
];

const INVENTORY = [
  { id:1, item:"Flour (kg)", unit:"kg", stock:12, minStock:5, cost:1.20, supplier:"FoodCo" },
  { id:2, item:"Nutella (jar)", unit:"jar", stock:3, minStock:4, cost:8.50, supplier:"Sysco" },
  { id:3, item:"Corn (ears)", unit:"unit", stock:200, minStock:50, cost:0.35, supplier:"Local Farm" },
  { id:4, item:"Mayonnaise (qt)", unit:"qt", stock:8, minStock:3, cost:4.20, supplier:"Sysco" },
  { id:5, item:"Cotija Cheese", unit:"lb", stock:6, minStock:3, cost:5.50, supplier:"FoodCo" },
  { id:6, item:"Tajin (btl)", unit:"btl", stock:2, minStock:3, cost:3.00, supplier:"Mexgrocer" },
  { id:7, item:"Strawberries", unit:"lb", stock:10, minStock:5, cost:2.80, supplier:"Local Farm" },
  { id:8, item:"Ham (lb)", unit:"lb", stock:7, minStock:4, cost:6.00, supplier:"Sysco" },
];

const COMPRAS = [
  { id:1, date:"2026-03-14", supplier:"Sysco", items:"Nutella x6, Ham x10", total:98.50, status:"Received" },
  { id:2, date:"2026-03-12", supplier:"FoodCo", items:"Flour x20kg", total:24.00, status:"Received" },
  { id:3, date:"2026-03-10", supplier:"Local Farm", items:"Corn x300, Strawberries x20lb", total:161.00, status:"Pending" },
];

const CLOCK_RECORDS = [
  { id:1, worker:"Maria Garcia", in:"08:02", out:"16:05", hours:8.1 },
  { id:2, worker:"Juan Lopez", in:"09:15", out:null, hours:null },
];

/* ─── SHARED COMPONENTS ──────────────────────────────────── */
const Badge = ({ color, children }) => (
  <span style={{
    background: color === "green" ? "rgba(34,197,94,0.15)" : color === "red" ? "rgba(239,68,68,0.15)" : color === "yellow" ? "rgba(245,158,11,0.15)" : T.orangeDim,
    color: color === "green" ? T.green : color === "red" ? T.red : color === "yellow" ? T.yellow : T.orange,
    border: `1px solid ${color === "green" ? "rgba(34,197,94,0.3)" : color === "red" ? "rgba(239,68,68,0.3)" : color === "yellow" ? "rgba(245,158,11,0.3)" : "rgba(232,100,10,0.3)"}`,
    borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700,
    fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5, textTransform: "uppercase",
  }}>{children}</span>
);

const Btn = ({ children, onClick, variant="primary", size="md", style: s = {} }) => {
  const [hover, setHover] = useState(false);
  const base = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700, letterSpacing: 0.5,
    border: "none", cursor: "pointer", borderRadius: 6,
    transition: "all 0.15s ease",
    padding: size === "sm" ? "6px 14px" : size === "lg" ? "14px 28px" : "10px 20px",
    fontSize: size === "sm" ? 13 : size === "lg" ? 17 : 14,
    textTransform: "uppercase",
  };
  const variants = {
    primary: { background: hover ? T.orangeLight : T.orange, color: "#fff", boxShadow: hover ? `0 4px 16px ${T.orangeGlow}` : "none" },
    ghost: { background: hover ? T.orangeDim : "transparent", color: T.orange, border: `1px solid ${T.border}` },
    danger: { background: hover ? "#FF4444" : T.red, color: "#fff" },
    dark: { background: hover ? T.elevated : T.card, color: T.text, border: `1px solid ${T.border}` },
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...s }}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type="text", placeholder="" }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display:"block", color: T.textSec, fontSize: 12, fontFamily:"'Barlow Condensed'", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width:"100%", background: T.elevated, border: `1px solid ${T.border}`,
        borderRadius:6, padding:"10px 14px", color: T.text, fontSize:14,
        fontFamily:"'Nunito', sans-serif", outline:"none",
      }} />
  </div>
);

const Card = ({ children, style: s = {} }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20, ...s }}>
    {children}
  </div>
);

const KPI = ({ label, value, sub, color = T.orange, icon }) => (
  <Card style={{ animation: "fadeIn 0.4s ease", minWidth: 0 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <div style={{ color: T.textSec, fontFamily:"'Barlow Condensed'", fontSize:12, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>{label}</div>
        <div style={{ color, fontFamily:"'Barlow Condensed'", fontWeight:800, fontSize:32, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ color: T.textSec, fontSize:12, marginTop:6, fontFamily:"'Nunito'" }}>{sub}</div>}
      </div>
      <div style={{ fontSize:28, opacity:0.6 }}>{icon}</div>
    </div>
  </Card>
);

/* ─── SIDEBAR NAV ────────────────────────────────────────── */
const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:"📊" },
  { id:"pos", label:"POS", icon:"🛒" },
  { id:"inventory", label:"Inventory", icon:"📦" },
  { id:"compras", label:"Compras", icon:"🧾" },
  { id:"clock", label:"Clock I/O", icon:"⏱" },
  { id:"reports", label:"Reports", icon:"📈" },
  { id:"users", label:"Team", icon:"👥" },
];

const Sidebar = ({ screen, setScreen, userRole, onLogout }) => {
  const items = userRole === "worker" ? [NAV_ITEMS[1], NAV_ITEMS[4]] : NAV_ITEMS;
  return (
    <div style={{
      width: 200, minHeight:"100vh", background: T.surface,
      borderRight: `1px solid ${T.border}`,
      display:"flex", flexDirection:"column",
      position:"sticky", top:0,
    }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 20px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ fontFamily:"'Barlow Condensed'", fontWeight:800, fontSize:22, color: T.orange, letterSpacing:1 }}>🌽 LOKOS</div>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color: T.textDim, letterSpacing:2, textTransform:"uppercase" }}>Street Food POS</div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 0" }}>
        {items.map(item => {
          const active = screen === item.id;
          return (
            <button key={item.id} onClick={() => setScreen(item.id)}
              style={{
                display:"flex", alignItems:"center", gap:10,
                width:"100%", padding:"11px 20px", background: active ? T.orangeDim : "transparent",
                border:"none", cursor:"pointer", borderLeft: active ? `3px solid ${T.orange}` : "3px solid transparent",
                color: active ? T.orange : T.textSec,
                fontFamily:"'Barlow Condensed'", fontWeight: active ? 700 : 500,
                fontSize:15, letterSpacing:0.3, textTransform:"uppercase",
                transition:"all 0.15s ease",
              }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding:"16px 20px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ color: T.textSec, fontSize:11, fontFamily:"'Barlow Condensed'", letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>
          {userRole === "admin" ? "👑 Admin" : "👤 Worker"}
        </div>
        <Btn onClick={onLogout} variant="ghost" size="sm" style={{ width:"100%", marginTop:8 }}>Logout</Btn>
      </div>
    </div>
  );
};

/* ─── LOGIN ──────────────────────────────────────────────── */
const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePin = (d) => {
    if (pin.length < 4) setPin(p => p + d);
  };
  const handleBackspace = () => setPin(p => p.slice(0, -1));
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (pin === "0000") { onLogin("admin"); return; }
      const worker = WORKERS.find(w => w.pin === pin);
      if (worker) { onLogin("worker", worker); return; }
      setError("Invalid PIN — try again"); setPin(""); setLoading(false);
    }, 600);
  };

  useEffect(() => { if (pin.length === 4) handleLogin(); }, [pin]);

  const DIGITS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div style={{
      minHeight:"100vh", background: T.bg,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Nunito', sans-serif",
    }}>
      <div style={{ animation:"scaleIn 0.4s ease", textAlign:"center", width:340 }}>
        {/* Logo */}
        <div style={{ marginBottom:40 }}>
          <div style={{ fontSize:56, marginBottom:8 }}>🌽</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontWeight:800, fontSize:40, color: T.orange, letterSpacing:2 }}>LOKOS POS</div>
          <div style={{ color: T.textDim, fontSize:13, letterSpacing:3, textTransform:"uppercase", marginTop:4 }}>Street Food · McKinney TX</div>
        </div>

        <Card style={{ padding:"32px 28px" }}>
          <div style={{ fontFamily:"'Barlow Condensed'", color: T.textSec, fontSize:13, letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>Enter PIN</div>

          {/* PIN dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:14, marginBottom:32 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width:16, height:16, borderRadius:"50%",
                background: pin.length > i ? T.orange : T.border,
                boxShadow: pin.length > i ? `0 0 10px ${T.orangeGlow}` : "none",
                transition:"all 0.2s ease",
              }} />
            ))}
          </div>

          {/* Numpad */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {DIGITS.map((d, i) => (
              <button key={i} onClick={() => d === "⌫" ? handleBackspace() : d !== "" && handlePin(d)}
                style={{
                  background: d === "" ? "transparent" : T.elevated,
                  border: `1px solid ${d === "" ? "transparent" : T.border}`,
                  borderRadius:8, padding:"16px 0",
                  color: d === "⌫" ? T.orange : T.text,
                  fontFamily:"'Barlow Condensed'", fontWeight:700, fontSize:22,
                  cursor: d === "" ? "default" : "pointer",
                  transition:"all 0.1s ease",
                }}>
                {d}
              </button>
            ))}
          </div>

          {error && <div style={{ color: T.red, fontSize:13, marginTop:16, fontFamily:"'Nunito'" }}>{error}</div>}
          {loading && <div style={{ color: T.orange, fontSize:13, marginTop:16, animation:"pulse 1s infinite", fontFamily:"'Barlow Condensed'", letterSpacing:2 }}>LOGGING IN...</div>}

          <div style={{ marginTop:24, padding:"12px", background: T.elevated, borderRadius:6, fontSize:12, color: T.textDim, fontFamily:"'Barlow Condensed'", letterSpacing:1 }}>
            ADMIN: 0000 &nbsp;·&nbsp; DEMO WORKER: 1234
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ─── POS SCREEN ─────────────────────────────────────────── */
const POS = () => {
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [payModal, setPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState("cash");
  const [cashGiven, setCashGiven] = useState("");
  const [orderDone, setOrderDone] = useState(false);

  const items = MENU_ITEMS.filter(m =>
    (cat === "All" || m.cat === cat) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item) => {
    setCart(c => {
      const ex = c.find(x => x.id === item.id);
      if (ex) return c.map(x => x.id === item.id ? { ...x, qty: x.qty+1 } : x);
      return [...c, { ...item, qty:1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(c => c.map(x => x.id === id ? { ...x, qty: x.qty+delta } : x).filter(x => x.qty > 0));
  };

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const tax = total * 0.0825;
  const grandTotal = total + tax;
  const change = parseFloat(cashGiven) - grandTotal;

  const processOrder = () => {
    setOrderDone(true);
    setTimeout(() => { setCart([]); setPayModal(false); setOrderDone(false); setCashGiven(""); }, 2500);
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Nunito', sans-serif" }}>
      {/* Menu panel */}
      <div style={{ flex:1, overflow:"auto", padding:24 }}>
        <div style={{ marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Barlow Condensed'", fontWeight:800, fontSize:28, color: T.text, letterSpacing:1 }}>POINT OF SALE</h2>
          <input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", background: T.elevated, border:`1px solid ${T.border}`, borderRadius:6,
              padding:"10px 14px", color: T.text, fontSize:14, fontFamily:"'Nunito'", outline:"none", marginTop:12 }} />
        </div>

        {/* Category tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{
                padding:"7px 16px", borderRadius:20, border: `1px solid ${cat===c ? T.orange : T.border}`,
                background: cat===c ? T.orangeDim : "transparent",
                color: cat===c ? T.orange : T.textSec,
                fontFamily:"'Barlow Condensed'", fontWeight:700, fontSize:13, letterSpacing:0.5,
                cursor:"pointer", textTransform:"uppercase", transition:"all 0.15s",
              }}>{c}</button>
          ))}
        </div>

        {/* Menu grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:12 }}>
          {items.map(item => (
            <button key={item.id} onClick={() => addToCart(item)}
              style={{
                background: T.card, border:`1px solid ${T.border}`, borderRadius:10,
                padding:"16px 12px", cursor:"pointer", textAlign:"center",
                transition:"all 0.15s ease", animation:"fadeIn 0.3s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=T.orange; e.currentTarget.style.background=T.elevated; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.card; }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{item.emoji}</div>
              <div style={{ color: T.text, fontFamily:"'Barlow Condensed'", fontWeight:700, fontSize:14, marginBottom:4 }}>{item.name}</div>
              <div style={{ color: T.orange, fontFamily:"'Barlow Condensed'", fontWeight:800, fontSize:18 }}>${item.price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart panel */}
      <div style={{ width:320, background: T.surface, borderLeft:`1px solid ${T.border}`, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"20px 20px 12px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontWeight:800, fontSize:20, color: T.text }}>ORDER #{Math.floor(Math.random()*9000)+1000}</div>
          <div style={{ color: T.textSec, fontSize:12, fontFamily:"'Barlow Condensed'", letterSpacing:1, textTransform:"uppercase" }}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div style={{ flex:1, overflow:"auto", padding:"12px 20px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign:"center", marginTop:60, color: T.textDim, fontFamily:"'Barlow Condensed'", letterSpacing:1 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
              NO ITEMS YET
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, animation:"slideIn 0.2s ease" }}>
              <div style={{ fontSize:20 }}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ color: T.text, fontSize:13, fontFamily:"'Nunito'", fontWeight:600 }}>{item.name}</div>
                <div style={{ color: T.orange, fontSize:13, fontFamily:"'Barlow Condensed'", fontWeight:700 }}>${(item.price*item.qty).toFixed(2)}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => updateQty(item.id,-1)} style={{ width:26,height:26,borderRadius:4,background:T.elevated,border:`1px solid ${T.border}`,color:T.text,cursor:"pointer",fontWeight:700,fontSize:16 }}>-</button>
                <span style={{ color:T.text,fontWeight:700,fontSize:14,fontFamily:"'Barlow Condensed'",width:16,textAlign:"center" }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id,1)} style={{ width:26,height:26,borderRadius:4,background:T.elevated,border:`1px solid ${T.border}`,color:T.orange,cursor:"pointer",fontWeight:700,fontSize:16 }}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ padding:"16px 20px", borderTop:`1px solid ${T.border}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <span style={{ color:T.textSec,fontSize:13,fontFamily:"'Nunito'" }}>Subtotal</span>
            <span style={{ color:T.text,fontSize:13,fontFamily:"'Nunito'",fontWeight:600 }}>${total.toFixed(2)}</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
            <span style={{ color:T.textSec,fontSize:13,fontFamily:"'Nunito'" }}>Tax (8.25%)</span>
            <span style={{ color:T.text,fontSize:13,fontFamily:"'Nunito'",fontWeight:600 }}>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16,paddingTop:12,borderTop:`1px solid ${T.border}` }}>
            <span style={{ color:T.text,fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:20,letterSpacing:0.5 }}>TOTAL</span>
            <span style={{ color:T.orange,fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:24 }}>${grandTotal.toFixed(2)}</span>
          </div>
          <Btn onClick={() => cart.length && setPayModal(true)} size="lg" style={{ width:"100%" }} variant={cart.length?"primary":"dark"}>
            💳 Charge
          </Btn>
          {cart.length > 0 && <Btn onClick={() => setCart([])} variant="ghost" size="sm" style={{ width:"100%",marginTop:8 }}>Clear Order</Btn>}
        </div>
      </div>

      {/* Payment Modal */}
      {payModal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100 }}>
          <div style={{ background:T.card,borderRadius:14,padding:32,width:380,border:`1px solid ${T.border}`,animation:"scaleIn 0.25s ease" }}>
            {orderDone ? (
              <div style={{ textAlign:"center",padding:"20px 0" }}>
                <div style={{ fontSize:56 }}>✅</div>
                <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:28,color:T.green,marginTop:12 }}>ORDER COMPLETE</div>
              </div>
            ) : (
              <>
                <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:24,color:T.text,marginBottom:20 }}>PAYMENT</div>
                <div style={{ display:"flex",gap:10,marginBottom:20 }}>
                  {["cash","card"].map(m => (
                    <button key={m} onClick={() => setPayMethod(m)}
                      style={{
                        flex:1,padding:"12px",borderRadius:8,border:`2px solid ${payMethod===m?T.orange:T.border}`,
                        background:payMethod===m?T.orangeDim:T.elevated,color:payMethod===m?T.orange:T.textSec,
                        fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:15,cursor:"pointer",textTransform:"uppercase"
                      }}>{m === "cash" ? "💵 Cash" : "💳 Card"}</button>
                  ))}
                </div>
                <div style={{ background:T.elevated,borderRadius:8,padding:"14px 16px",marginBottom:16 }}>
                  <div style={{ display:"flex",justifyContent:"space-between" }}>
                    <span style={{ color:T.textSec,fontFamily:"'Nunito'",fontSize:14 }}>Total Due</span>
                    <span style={{ color:T.orange,fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:22 }}>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                {payMethod === "cash" && (
                  <>
                    <Input label="Cash Given" value={cashGiven} onChange={setCashGiven} type="number" placeholder="0.00" />
                    {cashGiven && (
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16,background:change>=0?T.orangeDim:"rgba(239,68,68,0.15)",padding:"10px 14px",borderRadius:6 }}>
                        <span style={{ fontFamily:"'Barlow Condensed'",color:T.textSec }}>CHANGE</span>
                        <span style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:18,color:change>=0?T.green:T.red }}>${Math.abs(change).toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                <div style={{ display:"flex",gap:10,marginTop:8 }}>
                  <Btn onClick={() => setPayModal(false)} variant="dark" style={{ flex:1 }}>Cancel</Btn>
                  <Btn onClick={processOrder} style={{ flex:2 }}>Complete Order</Btn>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── DASHBOARD ──────────────────────────────────────────── */
const Dashboard = () => (
  <div style={{ padding:32, fontFamily:"'Nunito', sans-serif", animation:"fadeIn 0.4s ease" }}>
    <div style={{ marginBottom:28 }}>
      <h1 style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:34,color:T.text,letterSpacing:1 }}>DASHBOARD</h1>
      <p style={{ color:T.textSec,fontSize:14 }}>Monday, March 16, 2026 · Lokos Street Food · El Rancho McKinney</p>
    </div>

    <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28 }}>
      <KPI label="Today's Sales" value="$847.50" sub="+12% vs yesterday" icon="💰" />
      <KPI label="Orders" value="112" sub="Avg $7.57/order" icon="🛒" color={T.blue} />
      <KPI label="Top Item" value="Elote" sub="38 sold today" icon="🌽" color={T.green} />
      <KPI label="Clocked In" value="3 / 4" sub="Juan, Maria, Carlos" icon="👥" color={T.yellow} />
    </div>

    <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20 }}>
      <Card>
        <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:16,color:T.text,letterSpacing:0.5,marginBottom:16,textTransform:"uppercase" }}>Weekly Sales</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={SALES_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="day" stroke={T.textDim} fontSize={12} fontFamily="Barlow Condensed" />
            <YAxis stroke={T.textDim} fontSize={12} />
            <Tooltip contentStyle={{ background:T.elevated,border:`1px solid ${T.border}`,borderRadius:6,color:T.text,fontFamily:"Nunito" }} />
            <Bar dataKey="sales" fill={T.orange} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:16,color:T.text,letterSpacing:0.5,marginBottom:16,textTransform:"uppercase" }}>Sales by Category</div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={[
              {name:"Crepes",value:38},{name:"Elotes",value:32},{name:"Drinks",value:22},{name:"Snacks",value:8}
            ]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
              {["#E8640A","#FF9A50","#F59E0B","#22C55E"].map((c,i) => <Cell key={i} fill={c} />)}
            </Pie>
            <Tooltip contentStyle={{ background:T.elevated,border:`1px solid ${T.border}`,borderRadius:6,fontFamily:"Nunito" }} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center" }}>
          {[["Crepes","#E8640A"],["Elotes","#FF9A50"],["Drinks","#F59E0B"],["Snacks","#22C55E"]].map(([l,c]) => (
            <div key={l} style={{ display:"flex",alignItems:"center",gap:4 }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:c }} />
              <span style={{ color:T.textSec,fontSize:11,fontFamily:"'Barlow Condensed'" }}>{l}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Recent orders */}
    <Card>
      <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:16,color:T.text,letterSpacing:0.5,marginBottom:16,textTransform:"uppercase" }}>Recent Orders</div>
      <table style={{ width:"100%",borderCollapse:"collapse" }}>
        <thead>
          <tr>{["Order","Items","Total","Method","Time","Status"].map(h => (
            <th key={h} style={{ textAlign:"left",padding:"8px 12px",color:T.textDim,fontFamily:"'Barlow Condensed'",fontSize:11,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${T.border}` }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {[
            ["#4521","Crepe x2, Horchata","$21.00","Cash","3:14 PM","Completed"],
            ["#4520","Elote x3","$22.50","Card","3:09 PM","Completed"],
            ["#4519","Crepe x1, Jarritos","$11.00","Cash","2:58 PM","Completed"],
          ].map(([id,items,total,method,time,status]) => (
            <tr key={id} style={{ borderBottom:`1px solid ${T.border}` }}>
              <td style={{ padding:"12px",color:T.orange,fontFamily:"'Barlow Condensed'",fontWeight:700 }}>{id}</td>
              <td style={{ padding:"12px",color:T.text,fontSize:13 }}>{items}</td>
              <td style={{ padding:"12px",color:T.text,fontWeight:700,fontFamily:"'Barlow Condensed'",fontSize:15 }}>{total}</td>
              <td style={{ padding:"12px" }}><Badge color={method==="Card"?"blue":"orange"}>{method}</Badge></td>
              <td style={{ padding:"12px",color:T.textSec,fontSize:13 }}>{time}</td>
              <td style={{ padding:"12px" }}><Badge color="green">{status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

/* ─── INVENTORY ──────────────────────────────────────────── */
const Inventory = () => {
  const [inv, setInv] = useState(INVENTORY);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({item:"",unit:"",stock:0,minStock:0,cost:0,supplier:""});

  const save = () => {
    if (modal === "add") setInv(i => [...i,{...form,id:Date.now()}]);
    else setInv(i => i.map(x => x.id===modal.id ? {...form,id:x.id} : x));
    setModal(null);
  };

  return (
    <div style={{ padding:32, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:34,color:T.text,letterSpacing:1 }}>INVENTORY</h1>
          <p style={{ color:T.textSec,fontSize:14 }}>{inv.filter(i=>i.stock<=i.minStock).length} items need restock</p>
        </div>
        <Btn onClick={() => { setForm({item:"",unit:"",stock:0,minStock:0,cost:0,supplier:""}); setModal("add"); }}>+ Add Item</Btn>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24 }}>
        <KPI label="Total SKUs" value={inv.length} icon="📦" />
        <KPI label="Low Stock" value={inv.filter(i=>i.stock<=i.minStock).length} icon="⚠️" color={T.red} />
        <KPI label="Est. Value" value={`$${inv.reduce((s,i)=>s+i.stock*i.cost,0).toFixed(0)}`} icon="💵" color={T.green} />
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.elevated }}>
              {["Item","Unit","Stock","Min","Cost","Supplier","Status",""].map(h => (
                <th key={h} style={{ textAlign:"left",padding:"12px 16px",color:T.textDim,fontFamily:"'Barlow Condensed'",fontSize:11,letterSpacing:1,textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inv.map(item => {
              const low = item.stock <= item.minStock;
              return (
                <tr key={item.id} style={{ borderTop:`1px solid ${T.border}`,animation:"slideIn 0.2s ease" }}>
                  <td style={{ padding:"14px 16px",color:T.text,fontWeight:600 }}>{item.item}</td>
                  <td style={{ padding:"14px 16px",color:T.textSec,fontSize:13 }}>{item.unit}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:18,color:low?T.red:T.green }}>{item.stock}</span>
                  </td>
                  <td style={{ padding:"14px 16px",color:T.textDim,fontSize:13 }}>{item.minStock}</td>
                  <td style={{ padding:"14px 16px",color:T.textSec,fontSize:13 }}>${item.cost.toFixed(2)}</td>
                  <td style={{ padding:"14px 16px",color:T.textSec,fontSize:13 }}>{item.supplier}</td>
                  <td style={{ padding:"14px 16px" }}><Badge color={low?"red":"green"}>{low?"Low Stock":"OK"}</Badge></td>
                  <td style={{ padding:"14px 16px" }}>
                    <button onClick={() => { setForm(item); setModal(item); }}
                      style={{ background:"transparent",border:`1px solid ${T.border}`,color:T.orange,borderRadius:4,padding:"4px 10px",cursor:"pointer",fontFamily:"'Barlow Condensed'",fontSize:12,letterSpacing:0.5 }}>
                      EDIT
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Modal */}
      {modal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100 }}>
          <div style={{ background:T.card,borderRadius:14,padding:32,width:420,border:`1px solid ${T.border}`,animation:"scaleIn 0.2s ease" }}>
            <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:22,color:T.text,marginBottom:20 }}>{modal==="add"?"ADD ITEM":"EDIT ITEM"}</div>
            <Input label="Item Name" value={form.item} onChange={v=>setForm(f=>({...f,item:v}))} />
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Input label="Unit" value={form.unit} onChange={v=>setForm(f=>({...f,unit:v}))} />
              <Input label="Supplier" value={form.supplier} onChange={v=>setForm(f=>({...f,supplier:v}))} />
              <Input label="Stock" type="number" value={form.stock} onChange={v=>setForm(f=>({...f,stock:+v}))} />
              <Input label="Min Stock" type="number" value={form.minStock} onChange={v=>setForm(f=>({...f,minStock:+v}))} />
              <Input label="Cost" type="number" value={form.cost} onChange={v=>setForm(f=>({...f,cost:+v}))} />
            </div>
            <div style={{ display:"flex",gap:10,marginTop:8 }}>
              <Btn onClick={() => setModal(null)} variant="dark" style={{ flex:1 }}>Cancel</Btn>
              <Btn onClick={save} style={{ flex:2 }}>Save</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── COMPRAS ────────────────────────────────────────────── */
const Compras = () => {
  const [purchases, setPurchases] = useState(COMPRAS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ supplier:"", items:"", total:"", date:new Date().toISOString().split("T")[0] });

  const save = () => {
    setPurchases(p => [{ ...form, id:Date.now(), status:"Pending", total:parseFloat(form.total) }, ...p]);
    setModal(false); setForm({ supplier:"",items:"",total:"",date:new Date().toISOString().split("T")[0] });
  };

  return (
    <div style={{ padding:32, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:34,color:T.text,letterSpacing:1 }}>COMPRAS</h1>
          <p style={{ color:T.textSec,fontSize:14 }}>Purchase orders & supplier management</p>
        </div>
        <Btn onClick={() => setModal(true)}>+ New Order</Btn>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24 }}>
        <KPI label="This Month" value={`$${purchases.reduce((s,p)=>s+p.total,0).toFixed(2)}`} icon="📋" />
        <KPI label="Pending" value={purchases.filter(p=>p.status==="Pending").length} icon="⏳" color={T.yellow} />
        <KPI label="Suppliers" value="4" icon="🏪" color={T.green} />
      </div>

      <Card style={{ padding:0,overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.elevated }}>
              {["Date","Supplier","Items","Total","Status",""].map(h => (
                <th key={h} style={{ textAlign:"left",padding:"12px 16px",color:T.textDim,fontFamily:"'Barlow Condensed'",fontSize:11,letterSpacing:1,textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id} style={{ borderTop:`1px solid ${T.border}` }}>
                <td style={{ padding:"14px 16px",color:T.textSec,fontSize:13 }}>{p.date}</td>
                <td style={{ padding:"14px 16px",color:T.text,fontWeight:600 }}>{p.supplier}</td>
                <td style={{ padding:"14px 16px",color:T.textSec,fontSize:13 }}>{p.items}</td>
                <td style={{ padding:"14px 16px",color:T.orange,fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:16 }}>${p.total.toFixed(2)}</td>
                <td style={{ padding:"14px 16px" }}><Badge color={p.status==="Received"?"green":"yellow"}>{p.status}</Badge></td>
                <td style={{ padding:"14px 16px" }}>
                  {p.status === "Pending" && (
                    <button onClick={() => setPurchases(ps => ps.map(x=>x.id===p.id?{...x,status:"Received"}:x))}
                      style={{ background:T.orangeDim,border:`1px solid rgba(232,100,10,0.3)`,color:T.orange,borderRadius:4,padding:"4px 10px",cursor:"pointer",fontFamily:"'Barlow Condensed'",fontSize:12 }}>
                      MARK RECEIVED
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100 }}>
          <div style={{ background:T.card,borderRadius:14,padding:32,width:420,border:`1px solid ${T.border}`,animation:"scaleIn 0.2s ease" }}>
            <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:22,color:T.text,marginBottom:20 }}>NEW PURCHASE ORDER</div>
            <Input label="Supplier" value={form.supplier} onChange={v=>setForm(f=>({...f,supplier:v}))} />
            <Input label="Items" value={form.items} onChange={v=>setForm(f=>({...f,items:v}))} placeholder="Item x qty, ..." />
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Input label="Total ($)" type="number" value={form.total} onChange={v=>setForm(f=>({...f,total:v}))} />
              <Input label="Date" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} />
            </div>
            <div style={{ display:"flex",gap:10,marginTop:8 }}>
              <Btn onClick={() => setModal(false)} variant="dark" style={{ flex:1 }}>Cancel</Btn>
              <Btn onClick={save} style={{ flex:2 }}>Create Order</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── CLOCK IN/OUT ───────────────────────────────────────── */
const Clock = () => {
  const [records, setRecords] = useState(CLOCK_RECORDS);
  const [time, setTime] = useState(new Date());
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const isClockedIn = (name) => records.some(r => r.worker === name && !r.out);

  const handleClock = (worker) => {
    const ci = isClockedIn(worker.name);
    if (!ci) {
      setRecords(r => [...r, { id:Date.now(), worker:worker.name, in:time.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}), out:null, hours:null }]);
    } else {
      const outTime = time.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
      setRecords(r => r.map(x => x.worker===worker.name&&!x.out ? {...x,out:outTime,hours:8.0} : x));
    }
    setConfirm(null); setSelected(null);
  };

  return (
    <div style={{ padding:32, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease" }}>
      <h1 style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:34,color:T.text,letterSpacing:1,marginBottom:8 }}>CLOCK IN / OUT</h1>

      {/* Big clock */}
      <Card style={{ textAlign:"center",marginBottom:28,padding:"32px" }}>
        <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:72,color:T.orange,letterSpacing:4,lineHeight:1 }}>
          {time.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"})}
        </div>
        <div style={{ color:T.textSec,fontSize:15,marginTop:8 }}>
          {time.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </div>
      </Card>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24 }}>
        {/* Worker cards */}
        <div>
          <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:16,color:T.text,letterSpacing:0.5,marginBottom:14,textTransform:"uppercase" }}>Select Worker</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {WORKERS.filter(w=>w.active).map(w => {
              const ci = isClockedIn(w.name);
              return (
                <Card key={w.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer",border:`1px solid ${selected?.id===w.id?T.orange:T.border}`,transition:"all 0.15s" }}
                  onClick={() => setSelected(w)}>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ width:40,height:40,borderRadius:"50%",background:ci?T.orangeDim:T.elevated,border:`2px solid ${ci?T.orange:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>
                      {w.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ color:T.text,fontWeight:600,fontSize:14 }}>{w.name}</div>
                      <div style={{ color:T.textSec,fontSize:12 }}>{w.role}</div>
                    </div>
                  </div>
                  <Badge color={ci?"green":"yellow"}>{ci?"Clocked In":"Out"}</Badge>
                </Card>
              );
            })}
          </div>
          {selected && (
            <div style={{ marginTop:16 }}>
              <Btn onClick={() => handleClock(selected)} style={{ width:"100%" }} size="lg"
                variant={isClockedIn(selected.name)?"danger":"primary"}>
                {isClockedIn(selected.name) ? "⏹ Clock Out — "+selected.name : "▶ Clock In — "+selected.name}
              </Btn>
            </div>
          )}
        </div>

        {/* Today's log */}
        <div>
          <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:16,color:T.text,letterSpacing:0.5,marginBottom:14,textTransform:"uppercase" }}>Today's Log</div>
          <Card style={{ padding:0,overflow:"hidden" }}>
            <table style={{ width:"100%",borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:T.elevated }}>
                  {["Worker","In","Out","Hours"].map(h => (
                    <th key={h} style={{ textAlign:"left",padding:"10px 14px",color:T.textDim,fontFamily:"'Barlow Condensed'",fontSize:11,letterSpacing:1,textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id} style={{ borderTop:`1px solid ${T.border}` }}>
                    <td style={{ padding:"12px 14px",color:T.text,fontSize:13,fontWeight:600 }}>{r.worker}</td>
                    <td style={{ padding:"12px 14px",color:T.green,fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:700 }}>{r.in}</td>
                    <td style={{ padding:"12px 14px",color:r.out?T.red:T.textDim,fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:700 }}>
                      {r.out || <span style={{ animation:"pulse 1s infinite" }}>ACTIVE</span>}
                    </td>
                    <td style={{ padding:"12px 14px",color:T.orange,fontFamily:"'Barlow Condensed'",fontWeight:800 }}>{r.hours||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─── REPORTS ────────────────────────────────────────────── */
const Reports = () => {
  const [range, setRange] = useState("week");

  return (
    <div style={{ padding:32, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:34,color:T.text,letterSpacing:1 }}>REPORTS</h1>
          <p style={{ color:T.textSec,fontSize:14 }}>Sales analytics & performance</p>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          {["day","week","month"].map(r => (
            <button key={r} onClick={() => setRange(r)}
              style={{ padding:"8px 18px",borderRadius:6,border:`1px solid ${range===r?T.orange:T.border}`,background:range===r?T.orangeDim:"transparent",color:range===r?T.orange:T.textSec,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:13,cursor:"pointer",textTransform:"uppercase" }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
        <KPI label="Total Sales" value="$5,025" sub="7-day period" icon="💰" />
        <KPI label="Orders" value="677" sub="Avg 96.7/day" icon="🛒" color={T.blue} />
        <KPI label="Avg Ticket" value="$7.42" sub="+$0.32 vs last wk" icon="📊" color={T.green} />
        <KPI label="Labor Cost" value="$840" sub="16.7% of sales" icon="👥" color={T.yellow} />
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20 }}>
        <Card>
          <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:16,color:T.text,marginBottom:16,textTransform:"uppercase",letterSpacing:0.5 }}>Daily Revenue</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="day" stroke={T.textDim} fontSize={11} fontFamily="Barlow Condensed" />
              <YAxis stroke={T.textDim} fontSize={11} />
              <Tooltip contentStyle={{ background:T.elevated,border:`1px solid ${T.border}`,borderRadius:6,fontFamily:"Nunito" }} />
              <Line type="monotone" dataKey="sales" stroke={T.orange} strokeWidth={2.5} dot={{ fill:T.orange,r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:16,color:T.text,marginBottom:16,textTransform:"uppercase",letterSpacing:0.5 }}>Order Volume</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="day" stroke={T.textDim} fontSize={11} fontFamily="Barlow Condensed" />
              <YAxis stroke={T.textDim} fontSize={11} />
              <Tooltip contentStyle={{ background:T.elevated,border:`1px solid ${T.border}`,borderRadius:6,fontFamily:"Nunito" }} />
              <Bar dataKey="orders" fill={T.blue} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top items */}
      <Card>
        <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:16,color:T.text,marginBottom:16,textTransform:"uppercase",letterSpacing:0.5 }}>Top Selling Items</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12 }}>
          {[
            {name:"Elote en Vaso",sold:218,rev:"$1,308",emoji:"🌽"},
            {name:"Crepe Nutella",sold:189,rev:"$1,512",emoji:"🥞"},
            {name:"Horchata",sold:145,rev:"$580",emoji:"🥛"},
            {name:"Crepe Strawberry",sold:132,rev:"$1,122",emoji:"🍓"},
            {name:"Esquite",sold:98,rev:"$637",emoji:"🥣"},
          ].map((item,i) => (
            <Card key={i} style={{ textAlign:"center",padding:"16px 12px",background:T.elevated }}>
              <div style={{ fontSize:28,marginBottom:8 }}>{item.emoji}</div>
              <div style={{ color:T.text,fontSize:12,fontFamily:"'Nunito'",fontWeight:600,marginBottom:4 }}>{item.name}</div>
              <div style={{ color:T.orange,fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:20 }}>{item.rev}</div>
              <div style={{ color:T.textSec,fontSize:11,marginTop:2 }}>{item.sold} sold</div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ─── USER MANAGEMENT ────────────────────────────────────── */
const Users = () => {
  const [workers, setWorkers] = useState(WORKERS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:"",role:"Cashier",pin:"",hourlyRate:15,active:true });

  const save = () => {
    if (modal === "add") setWorkers(w => [...w,{...form,id:Date.now()}]);
    else setWorkers(w => w.map(x => x.id===modal.id ? {...form,id:x.id} : x));
    setModal(null);
  };

  const ROLES = ["Cashier","Cook","Manager","Admin"];

  return (
    <div style={{ padding:32, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:34,color:T.text,letterSpacing:1 }}>TEAM</h1>
          <p style={{ color:T.textSec,fontSize:14 }}>{workers.filter(w=>w.active).length} active · {workers.filter(w=>!w.active).length} inactive</p>
        </div>
        <Btn onClick={() => { setForm({name:"",role:"Cashier",pin:"",hourlyRate:15,active:true}); setModal("add"); }}>+ Add Worker</Btn>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16 }}>
        {workers.map(w => (
          <Card key={w.id} style={{ display:"flex",alignItems:"center",gap:16,animation:"fadeIn 0.3s ease" }}>
            <div style={{
              width:56,height:56,borderRadius:"50%",background:w.active?T.orangeDim:T.elevated,
              border:`2px solid ${w.active?T.orange:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:20,color:w.active?T.orange:T.textDim,flexShrink:0
            }}>
              {w.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:T.text,fontWeight:700,fontSize:15,marginBottom:3 }}>{w.name}</div>
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <Badge color={w.role==="Admin"||w.role==="Manager"?"orange":"yellow"}>{w.role}</Badge>
                <Badge color={w.active?"green":"red"}>{w.active?"Active":"Inactive"}</Badge>
              </div>
              <div style={{ color:T.textSec,fontSize:12,marginTop:4 }}>${w.hourlyRate}/hr · PIN: {w.pin}</div>
            </div>
            <Btn onClick={() => { setForm(w); setModal(w); }} variant="ghost" size="sm">Edit</Btn>
          </Card>
        ))}
      </div>

      {modal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100 }}>
          <div style={{ background:T.card,borderRadius:14,padding:32,width:420,border:`1px solid ${T.border}`,animation:"scaleIn 0.2s ease" }}>
            <div style={{ fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:22,color:T.text,marginBottom:20 }}>{modal==="add"?"ADD WORKER":"EDIT WORKER"}</div>
            <Input label="Full Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} />
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block",color:T.textSec,fontSize:12,fontFamily:"'Barlow Condensed'",letterSpacing:1,textTransform:"uppercase",marginBottom:6 }}>Role</label>
              <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}
                style={{ width:"100%",background:T.elevated,border:`1px solid ${T.border}`,borderRadius:6,padding:"10px 14px",color:T.text,fontSize:14,fontFamily:"'Nunito'",outline:"none" }}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Input label="PIN (4 digits)" value={form.pin} onChange={v=>setForm(f=>({...f,pin:v}))} />
              <Input label="Hourly Rate ($)" type="number" value={form.hourlyRate} onChange={v=>setForm(f=>({...f,hourlyRate:+v}))} />
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
              <input type="checkbox" id="active" checked={form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} />
              <label htmlFor="active" style={{ color:T.textSec,fontSize:14,fontFamily:"'Nunito'",cursor:"pointer" }}>Active</label>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <Btn onClick={() => setModal(null)} variant="dark" style={{ flex:1 }}>Cancel</Btn>
              <Btn onClick={save} style={{ flex:2 }}>Save Worker</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── APP ROOT ───────────────────────────────────────────── */
export default function App() {
  const [auth, setAuth] = useState(null); // { role, worker? }
  const [screen, setScreen] = useState("dashboard");

  const handleLogin = (role, worker) => {
    setAuth({ role, worker });
    setScreen(role === "admin" ? "dashboard" : "pos");
  };

  if (!auth) return <Login onLogin={handleLogin} />;

  const SCREENS = { dashboard:<Dashboard />, pos:<POS />, inventory:<Inventory />, compras:<Compras />, clock:<Clock />, reports:<Reports />, users:<Users /> };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background: T.bg, fontFamily:"'Nunito',sans-serif" }}>
      <Sidebar screen={screen} setScreen={setScreen} userRole={auth.role} onLogout={() => { setAuth(null); setScreen("dashboard"); }} />
      <div style={{ flex:1, overflow:"auto", minHeight:"100vh" }}>
        {SCREENS[screen] || <Dashboard />}
      </div>
    </div>
  );
}
