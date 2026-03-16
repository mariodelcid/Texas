import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ─── FONT + GLOBAL STYLES ───────────────────────────────── */
const styleEl = document.createElement("style");
styleEl.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0D0D0D; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1A1A1A; }
  ::-webkit-scrollbar-thumb { background: #E8640A; border-radius: 2px; }
  @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); }  to { opacity:1; transform:translateY(0); } }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  @keyframes scaleIn { from { transform:scale(0.95); opacity:0; }       to { transform:scale(1); opacity:1; } }
  @keyframes slideIn { from { transform:translateX(-16px); opacity:0; } to { transform:translateX(0); opacity:1; } }
  input[type=number]::-webkit-inner-spin-button { opacity:1; }
`;
document.head.appendChild(styleEl);

/* ─── THEME ──────────────────────────────────────────────── */
const T = {
  bg:"#0D0D0D", surface:"#161616", elevated:"#1F1F1F", card:"#242424", border:"#2E2E2E",
  orange:"#E8640A", orangeLight:"#FF7820", orangeDim:"rgba(232,100,10,0.15)", orangeGlow:"rgba(232,100,10,0.4)",
  text:"#F2EDE8", textSec:"#9A8878", textDim:"#5A4A3A",
  green:"#22C55E", red:"#EF4444", blue:"#3B82F6", yellow:"#F59E0B",
};

/* ─── REAL MENU FROM LOKOSSTREETFOOD.COM ─────────────────── */
const MENU_ITEMS = [
  // ELOTES — real items from lokosstreetfood.com
  { id:1,  name:"Vaso Chico",         cat:"Elotes",  price:5.00, emoji:"🌽", stock:60, desc:"Small elote cup" },
  { id:2,  name:"Vaso Grande",        cat:"Elotes",  price:7.50, emoji:"🌽", stock:55, desc:"Large elote cup" },
  { id:3,  name:"Taki-Loko",          cat:"Elotes",  price:8.00, emoji:"🔥", stock:40, desc:"Elote with Takis" },
  { id:4,  name:"Tosti-Loko",         cat:"Elotes",  price:8.00, emoji:"🌮", stock:40, desc:"Elote with Tostilocos" },
  { id:5,  name:"Conchita Con Elote", cat:"Elotes",  price:8.50, emoji:"🍞", stock:30, desc:"Concha bread with elote" },
  // CREPES — real items from lokosstreetfood.com
  { id:6,  name:"Nutella & Banana",   cat:"Crepes",  price:9.00, emoji:"🥞", stock:35, desc:"Japanese crepe" },
  { id:7,  name:"Cream Cheese & Strawberry", cat:"Crepes", price:9.00, emoji:"🍓", stock:35, desc:"Japanese crepe" },
  { id:8,  name:"Nutella & Strawberry",cat:"Crepes", price:9.50, emoji:"🍓", stock:30, desc:"Japanese crepe" },
  { id:9,  name:"Ham & Cheese",       cat:"Crepes",  price:9.50, emoji:"🧀", stock:25, desc:"Savory Japanese crepe" },
  { id:10, name:"Chicken & Cheese",   cat:"Crepes",  price:10.00,emoji:"🍗", stock:22, desc:"Savory Japanese crepe" },
  // DRINKS — from Facebook & website
  { id:11, name:"Mangonada",          cat:"Drinks",  price:8.00, emoji:"🥭", stock:40, desc:"Mango chamoy drink" },
  { id:12, name:"Boba Tea",           cat:"Drinks",  price:6.50, emoji:"🧋", stock:50, desc:"Bubble tea" },
  { id:13, name:"Smoothie",           cat:"Drinks",  price:7.00, emoji:"🥤", stock:45, desc:"Fresh fruit smoothie" },
  { id:14, name:"Malteada",           cat:"Drinks",  price:7.00, emoji:"🥛", stock:40, desc:"Milkshake" },
  { id:15, name:"Agua Fresca",        cat:"Drinks",  price:4.00, emoji:"💧", stock:60, desc:"Fresh agua fresca" },
  { id:16, name:"Horchata",           cat:"Drinks",  price:4.00, emoji:"🍶", stock:55, desc:"Mexican horchata" },
  // NIEVES / SNACKS
  { id:17, name:"Nieve de Garrafa",   cat:"Nieves",  price:5.00, emoji:"🍧", stock:50, desc:"Artisan ice cream" },
  { id:18, name:"Tostilocos",         cat:"Snacks",  price:6.00, emoji:"🌶️", stock:30, desc:"Tostitos preparados" },
  { id:19, name:"Fruta Preparada",    cat:"Snacks",  price:6.50, emoji:"🍉", stock:25, desc:"Fresh fruit cup" },
];

const CATEGORIES = ["All","Elotes","Crepes","Drinks","Nieves","Snacks"];

const WORKERS = [
  { id:1, name:"Maria Garcia",   role:"Cashier", pin:"1234", active:true,  hourlyRate:15 },
  { id:2, name:"Juan Lopez",     role:"Cook",    pin:"5678", active:true,  hourlyRate:16 },
  { id:3, name:"Sofia Martinez", role:"Cashier", pin:"9012", active:false, hourlyRate:15 },
  { id:4, name:"Carlos Rivera",  role:"Manager", pin:"3456", active:true,  hourlyRate:18 },
];

const SALES_DATA = [
  { day:"Mon", sales:412, orders:58 },{ day:"Tue", sales:538, orders:74 },
  { day:"Wed", sales:390, orders:52 },{ day:"Thu", sales:620, orders:88 },
  { day:"Fri", sales:845, orders:112},{ day:"Sat", sales:1240,orders:165},
  { day:"Sun", sales:980, orders:128},
];

const INVENTORY = [
  { id:1, item:"Corn (ears)",      unit:"unit", stock:200, minStock:50,  cost:0.35, supplier:"Local Farm" },
  { id:2, item:"Nutella (jar)",    unit:"jar",  stock:3,   minStock:4,   cost:8.50, supplier:"Sysco" },
  { id:3, item:"Flour (kg)",       unit:"kg",   stock:12,  minStock:5,   cost:1.20, supplier:"FoodCo" },
  { id:4, item:"Strawberries (lb)",unit:"lb",   stock:10,  minStock:5,   cost:2.80, supplier:"Local Farm" },
  { id:5, item:"Cream Cheese",     unit:"pkg",  stock:8,   minStock:3,   cost:3.50, supplier:"Sysco" },
  { id:6, item:"Mayonnaise (qt)",  unit:"qt",   stock:8,   minStock:3,   cost:4.20, supplier:"Sysco" },
  { id:7, item:"Cotija Cheese",    unit:"lb",   stock:6,   minStock:3,   cost:5.50, supplier:"FoodCo" },
  { id:8, item:"Tajin (btl)",      unit:"btl",  stock:2,   minStock:3,   cost:3.00, supplier:"Mexgrocer" },
  { id:9, item:"Chamoy (btl)",     unit:"btl",  stock:5,   minStock:2,   cost:4.00, supplier:"Mexgrocer" },
  { id:10,item:"Boba Pearls (kg)", unit:"kg",   stock:3,   minStock:2,   cost:6.00, supplier:"AsianGrocer"},
];

const COMPRAS = [
  { id:1, date:"2026-03-14", supplier:"Sysco",      items:"Nutella x6, Cream Cheese x12", total:98.50,  status:"Received" },
  { id:2, date:"2026-03-12", supplier:"FoodCo",     items:"Flour x20kg, Cotija x5lb",     total:57.50,  status:"Received" },
  { id:3, date:"2026-03-10", supplier:"Local Farm",  items:"Corn x300, Strawberries x20lb",total:161.00, status:"Pending"  },
  { id:4, date:"2026-03-08", supplier:"Mexgrocer",  items:"Tajin x6, Chamoy x6",           total:42.00,  status:"Received" },
];

const CLOCK_RECORDS = [
  { id:1, worker:"Maria Garcia", in:"08:02", out:"16:05", hours:8.1 },
  { id:2, worker:"Juan Lopez",   in:"09:15", out:null,    hours:null },
];

/* ─── RESPONSIVE HOOK ────────────────────────────────────── */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
};

/* ─── SHARED COMPONENTS ──────────────────────────────────── */
const Badge = ({ color, children }) => {
  const colors = {
    green:  { bg:"rgba(34,197,94,0.15)",  fg:T.green,  b:"rgba(34,197,94,0.3)"  },
    red:    { bg:"rgba(239,68,68,0.15)",  fg:T.red,    b:"rgba(239,68,68,0.3)"  },
    yellow: { bg:"rgba(245,158,11,0.15)", fg:T.yellow, b:"rgba(245,158,11,0.3)" },
    blue:   { bg:"rgba(59,130,246,0.15)", fg:T.blue,   b:"rgba(59,130,246,0.3)" },
    orange: { bg:T.orangeDim,             fg:T.orange, b:"rgba(232,100,10,0.3)" },
  };
  const c = colors[color] || colors.orange;
  return <span style={{ background:c.bg, color:c.fg, border:`1px solid ${c.b}`, borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:0.5, textTransform:"uppercase", whiteSpace:"nowrap" }}>{children}</span>;
};

const Btn = ({ children, onClick, variant="primary", size="md", style:s={}, disabled=false }) => {
  const [hover, setHover] = useState(false);
  const base = { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:0.5, border:"none", cursor:disabled?"not-allowed":"pointer", borderRadius:6, transition:"all 0.15s ease", padding:size==="sm"?"7px 14px":size==="lg"?"14px 24px":"10px 20px", fontSize:size==="sm"?13:size==="lg"?17:14, textTransform:"uppercase", opacity:disabled?0.5:1 };
  const variants = {
    primary: { background:hover&&!disabled?T.orangeLight:T.orange, color:"#fff", boxShadow:hover&&!disabled?`0 4px 16px ${T.orangeGlow}`:"none" },
    ghost:   { background:hover?T.orangeDim:"transparent", color:T.orange, border:`1px solid ${T.border}` },
    danger:  { background:hover?"#FF4444":T.red, color:"#fff" },
    dark:    { background:hover?T.elevated:T.card, color:T.text, border:`1px solid ${T.border}` },
  };
  return <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{...base,...variants[variant],...s}}>{children}</button>;
};

const Input = ({ label, value, onChange, type="text", placeholder="" }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:"block", color:T.textSec, fontSize:11, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", background:T.elevated, border:`1px solid ${T.border}`, borderRadius:6, padding:"10px 14px", color:T.text, fontSize:14, fontFamily:"'Nunito',sans-serif", outline:"none" }} />
  </div>
);

const Card = ({ children, style:s={} }) => (
  <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:20, ...s }}>{children}</div>
);

const KPI = ({ label, value, sub, color=T.orange, icon }) => (
  <Card style={{ animation:"fadeIn 0.4s ease", minWidth:0 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ color:T.textSec, fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
        <div style={{ color, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ color:T.textSec, fontSize:11, marginTop:5, fontFamily:"'Nunito',sans-serif" }}>{sub}</div>}
      </div>
      <div style={{ fontSize:24, opacity:0.5, marginLeft:8 }}>{icon}</div>
    </div>
  </Card>
);

const Modal = ({ children, onClose }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 }}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{ background:T.card, borderRadius:14, padding:24, width:"100%", maxWidth:420, border:`1px solid ${T.border}`, animation:"scaleIn 0.2s ease", maxHeight:"90vh", overflowY:"auto" }}>
      {children}
    </div>
  </div>
);

/* ─── SIDEBAR / BOTTOM NAV ───────────────────────────────── */
const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:"📊" },
  { id:"pos",       label:"POS",       icon:"🛒" },
  { id:"inventory", label:"Inventory", icon:"📦" },
  { id:"compras",   label:"Compras",   icon:"🧾" },
  { id:"clock",     label:"Clock",     icon:"⏱"  },
  { id:"reports",   label:"Reports",   icon:"📈" },
  { id:"users",     label:"Team",      icon:"👥" },
];

const Sidebar = ({ screen, setScreen, userRole, onLogout }) => {
  const isMobile = useIsMobile();
  const items = userRole === "worker" ? [NAV_ITEMS[1], NAV_ITEMS[4]] : NAV_ITEMS;

  if (isMobile) {
    return (
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:T.surface, borderTop:`1px solid ${T.border}`, display:"flex", alignItems:"center", zIndex:100, height:60 }}>
        {items.map(item => {
          const active = screen === item.id;
          return (
            <button key={item.id} onClick={()=>setScreen(item.id)}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, height:"100%", background:"none", border:"none", cursor:"pointer", color:active?T.orange:T.textDim, padding:0 }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:0.5, fontWeight:active?700:500, textTransform:"uppercase" }}>{item.label}</span>
            </button>
          );
        })}
        <button onClick={onLogout} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, height:"100%", background:"none", border:"none", cursor:"pointer", color:T.textDim, padding:0 }}>
          <span style={{ fontSize:18 }}>🚪</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:0.5, textTransform:"uppercase" }}>Out</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ width:190, minHeight:"100vh", background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", position:"sticky", top:0, flexShrink:0 }}>
      <div style={{ padding:"22px 18px 18px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color:T.orange, letterSpacing:1 }}>🌽 LOKOS</div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:T.textDim, letterSpacing:2, textTransform:"uppercase", marginTop:2 }}>Street Food POS</div>
      </div>
      <nav style={{ flex:1, padding:"10px 0" }}>
        {items.map(item => {
          const active = screen === item.id;
          return (
            <button key={item.id} onClick={()=>setScreen(item.id)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 18px", background:active?T.orangeDim:"transparent", border:"none", cursor:"pointer", borderLeft:active?`3px solid ${T.orange}`:"3px solid transparent", color:active?T.orange:T.textSec, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:active?700:500, fontSize:14, letterSpacing:0.3, textTransform:"uppercase", transition:"all 0.15s ease" }}>
              <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"14px 18px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ color:T.textSec, fontSize:10, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>{userRole==="admin"?"👑 Admin":"👤 Worker"}</div>
        <Btn onClick={onLogout} variant="ghost" size="sm" style={{ width:"100%" }}>Logout</Btn>
      </div>
    </div>
  );
};

/* ─── LOGIN ──────────────────────────────────────────────── */
const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = (p) => {
    setLoading(true);
    setTimeout(() => {
      if (p === "0000") { onLogin("admin"); return; }
      const w = WORKERS.find(x => x.pin === p);
      if (w) { onLogin("worker", w); return; }
      setError("Invalid PIN — try again"); setPin(""); setLoading(false);
    }, 500);
  };

  const handlePin = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError("");
    if (next.length === 4) doLogin(next);
  };

  const DIGITS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ animation:"scaleIn 0.4s ease", textAlign:"center", width:"100%", maxWidth:340 }}>
        <div style={{ marginBottom:32 }}>
          <div style={{ fontSize:52, marginBottom:6 }}>🌽</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:38, color:T.orange, letterSpacing:2 }}>LOKOS POS</div>
          <div style={{ color:T.textDim, fontSize:12, letterSpacing:3, textTransform:"uppercase", marginTop:4, fontFamily:"'Barlow Condensed',sans-serif" }}>821 N McDonald · McKinney TX</div>
        </div>
        <Card style={{ padding:"28px 24px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", color:T.textSec, fontSize:12, letterSpacing:2, textTransform:"uppercase", marginBottom:18 }}>Enter PIN</div>
          <div style={{ display:"flex", justifyContent:"center", gap:14, marginBottom:28 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width:14, height:14, borderRadius:"50%", background:pin.length>i?T.orange:T.border, boxShadow:pin.length>i?`0 0 8px ${T.orangeGlow}`:"none", transition:"all 0.2s ease" }} />
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {DIGITS.map((d,i) => (
              <button key={i} onClick={()=>d==="⌫"?setPin(p=>p.slice(0,-1)):d!==""&&handlePin(d)}
                style={{ background:d===""?"transparent":T.elevated, border:`1px solid ${d===""?"transparent":T.border}`, borderRadius:8, padding:"15px 0", color:d==="⌫"?T.orange:T.text, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:22, cursor:d===""?"default":"pointer", WebkitTapHighlightColor:"transparent", transition:"all 0.1s ease" }}>
                {d}
              </button>
            ))}
          </div>
          {error && <div style={{ color:T.red, fontSize:13, marginTop:14, fontFamily:"'Nunito',sans-serif" }}>{error}</div>}
          {loading && <div style={{ color:T.orange, fontSize:12, marginTop:14, animation:"pulse 1s infinite", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:2 }}>LOGGING IN...</div>}
          <div style={{ marginTop:20, padding:"10px 12px", background:T.elevated, borderRadius:6, fontSize:11, color:T.textDim, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:0.5 }}>
            ADMIN: 0000 &nbsp;·&nbsp; DEMO: 1234
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ─── POS ────────────────────────────────────────────────── */
const POS = () => {
  const isMobile = useIsMobile();
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState("cash");
  const [cashGiven, setCashGiven] = useState("");
  const [orderDone, setOrderDone] = useState(false);

  const filteredItems = MENU_ITEMS.filter(m =>
    (cat === "All" || m.cat === cat) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item) => {
    setCart(c => {
      const ex = c.find(x=>x.id===item.id);
      return ex ? c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x) : [...c,{...item,qty:1}];
    });
  };

  const updateQty = (id, delta) => setCart(c=>c.map(x=>x.id===id?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0));

  const subtotal = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const tax = subtotal * 0.0825;
  const grandTotal = subtotal + tax;
  const change = parseFloat(cashGiven||0) - grandTotal;
  const cartCount = cart.reduce((s,x)=>s+x.qty,0);

  const processOrder = () => {
    setOrderDone(true);
    setTimeout(()=>{ setCart([]); setPayModal(false); setOrderDone(false); setCashGiven(""); setShowCart(false); }, 2500);
  };

  const CartPanel = () => (
    <div style={{ display:"flex", flexDirection:"column", height:isMobile?"100%":"100vh", background:T.surface, borderLeft:isMobile?"none":`1px solid ${T.border}`, width:isMobile?"100%":300 }}>
      <div style={{ padding:"16px 18px 10px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, color:T.text }}>ORDER</div>
          <div style={{ color:T.textSec, fontSize:11, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>{new Date().toLocaleTimeString()}</div>
        </div>
        {isMobile && <button onClick={()=>setShowCart(false)} style={{ background:"none", border:"none", color:T.textSec, fontSize:22, cursor:"pointer" }}>✕</button>}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 18px" }}>
        {cart.length===0 ? (
          <div style={{ textAlign:"center", marginTop:50, color:T.textDim, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🛒</div>NO ITEMS
          </div>
        ) : cart.map(item=>(
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, animation:"slideIn 0.2s ease" }}>
            <div style={{ fontSize:18 }}>{item.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:T.text, fontSize:12, fontFamily:"'Nunito',sans-serif", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.name}</div>
              <div style={{ color:T.orange, fontSize:13, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>${(item.price*item.qty).toFixed(2)}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <button onClick={()=>updateQty(item.id,-1)} style={{ width:24,height:24,borderRadius:4,background:T.elevated,border:`1px solid ${T.border}`,color:T.text,cursor:"pointer",fontWeight:700,fontSize:15 }}>-</button>
              <span style={{ color:T.text,fontWeight:700,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",width:16,textAlign:"center" }}>{item.qty}</span>
              <button onClick={()=>updateQty(item.id,1)} style={{ width:24,height:24,borderRadius:4,background:T.elevated,border:`1px solid ${T.border}`,color:T.orange,cursor:"pointer",fontWeight:700,fontSize:15 }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"14px 18px", borderTop:`1px solid ${T.border}` }}>
        {[["Subtotal",`$${subtotal.toFixed(2)}`],["Tax (8.25%)",`$${tax.toFixed(2)}`]].map(([l,v])=>(
          <div key={l} style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <span style={{ color:T.textSec,fontSize:13,fontFamily:"'Nunito',sans-serif" }}>{l}</span>
            <span style={{ color:T.text,fontSize:13,fontFamily:"'Nunito',sans-serif",fontWeight:600 }}>{v}</span>
          </div>
        ))}
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14,paddingTop:10,borderTop:`1px solid ${T.border}` }}>
          <span style={{ color:T.text,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18 }}>TOTAL</span>
          <span style={{ color:T.orange,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:22 }}>${grandTotal.toFixed(2)}</span>
        </div>
        <Btn onClick={()=>cart.length&&setPayModal(true)} size="lg" style={{ width:"100%" }} variant={cart.length?"primary":"dark"}>💳 Charge</Btn>
        {cart.length>0&&<Btn onClick={()=>setCart([])} variant="ghost" size="sm" style={{ width:"100%",marginTop:8 }}>Clear</Btn>}
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", height:isMobile?"calc(100vh - 60px)":"100vh", fontFamily:"'Nunito',sans-serif", position:"relative" }}>
      {/* Menu panel */}
      <div style={{ flex:1, overflowY:"auto", padding:isMobile?"12px 12px 12px":"20px" }}>
        <div style={{ marginBottom:14 }}>
          <input placeholder="🔍 Search items..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", background:T.elevated, border:`1px solid ${T.border}`, borderRadius:8, padding:"10px 14px", color:T.text, fontSize:14, fontFamily:"'Nunito',sans-serif", outline:"none" }} />
        </div>
        {/* Category chips */}
        <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:4 }}>
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${cat===c?T.orange:T.border}`, background:cat===c?T.orangeDim:"transparent", color:cat===c?T.orange:T.textSec, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap", flexShrink:0, WebkitTapHighlightColor:"transparent" }}>{c}</button>
          ))}
        </div>
        {/* Menu grid */}
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(3,1fr)":"repeat(auto-fill,minmax(140px,1fr))", gap:10 }}>
          {filteredItems.map(item=>(
            <button key={item.id} onClick={()=>addToCart(item)}
              style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:isMobile?"10px 8px":"14px 10px", cursor:"pointer", textAlign:"center", WebkitTapHighlightColor:"transparent", transition:"all 0.1s ease", position:"relative" }}>
              <div style={{ fontSize:isMobile?26:30, marginBottom:6 }}>{item.emoji}</div>
              <div style={{ color:T.text, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:isMobile?11:13, marginBottom:3, lineHeight:1.2 }}>{item.name}</div>
              <div style={{ color:T.orange, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?14:17 }}>${item.price.toFixed(2)}</div>
              {cart.find(x=>x.id===item.id) && (
                <div style={{ position:"absolute", top:5, right:5, width:18, height:18, borderRadius:"50%", background:T.orange, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {cart.find(x=>x.id===item.id).qty}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop cart panel */}
      {!isMobile && <CartPanel />}

      {/* Mobile cart FAB */}
      {isMobile && cartCount>0 && !showCart && (
        <button onClick={()=>setShowCart(true)}
          style={{ position:"fixed", bottom:70, right:16, background:T.orange, border:"none", borderRadius:50, padding:"14px 20px", color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15, cursor:"pointer", boxShadow:`0 4px 20px ${T.orangeGlow}`, display:"flex", alignItems:"center", gap:8, animation:"scaleIn 0.2s ease", zIndex:50 }}>
          🛒 {cartCount} · ${grandTotal.toFixed(2)}
        </button>
      )}

      {/* Mobile cart slide-up */}
      {isMobile && showCart && (
        <div style={{ position:"fixed", inset:0, zIndex:150, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <div style={{ flex:1, background:"rgba(0,0,0,0.5)" }} onClick={()=>setShowCart(false)} />
          <div style={{ background:T.surface, borderRadius:"14px 14px 0 0", maxHeight:"80vh", display:"flex", flexDirection:"column", animation:"slideUp 0.3s ease" }}>
            <CartPanel />
          </div>
        </div>
      )}

      {/* Payment modal */}
      {payModal && (
        <Modal onClose={()=>!orderDone&&setPayModal(false)}>
          {orderDone ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:52 }}>✅</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26, color:T.green, marginTop:10 }}>ORDER COMPLETE!</div>
            </div>
          ) : (
            <>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color:T.text, marginBottom:18 }}>PAYMENT</div>
              <div style={{ display:"flex", gap:10, marginBottom:18 }}>
                {["cash","card"].map(m=>(
                  <button key={m} onClick={()=>setPayMethod(m)}
                    style={{ flex:1, padding:"12px", borderRadius:8, border:`2px solid ${payMethod===m?T.orange:T.border}`, background:payMethod===m?T.orangeDim:T.elevated, color:payMethod===m?T.orange:T.textSec, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, cursor:"pointer", textTransform:"uppercase" }}>
                    {m==="cash"?"💵 Cash":"💳 Card"}
                  </button>
                ))}
              </div>
              <div style={{ background:T.elevated, borderRadius:8, padding:"12px 16px", marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:T.textSec, fontFamily:"'Nunito',sans-serif", fontSize:14 }}>Total Due</span>
                  <span style={{ color:T.orange, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22 }}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              {payMethod==="cash" && (
                <>
                  <Input label="Cash Given" value={cashGiven} onChange={setCashGiven} type="number" placeholder="0.00" />
                  {cashGiven && (
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, background:change>=0?T.orangeDim:"rgba(239,68,68,0.15)", padding:"10px 14px", borderRadius:6 }}>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", color:T.textSec, fontWeight:700 }}>CHANGE</span>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, color:change>=0?T.green:T.red }}>${Math.abs(change).toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <Btn onClick={()=>setPayModal(false)} variant="dark" style={{ flex:1 }}>Cancel</Btn>
                <Btn onClick={processOrder} style={{ flex:2 }}>Complete</Btn>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

/* ─── DASHBOARD ──────────────────────────────────────────── */
const Dashboard = () => {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding:isMobile?12:28, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease", paddingBottom:isMobile?80:28 }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?26:32, color:T.text, letterSpacing:1 }}>DASHBOARD</h1>
        <p style={{ color:T.textSec, fontSize:13 }}>Lokos Street Food · El Rancho McKinney</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <KPI label="Today's Sales" value="$847" sub="+12% vs yesterday" icon="💰" />
        <KPI label="Orders" value="112" sub="Avg $7.57" icon="🛒" color={T.blue} />
        <KPI label="Top Item" value="Vaso Grande" sub="38 sold" icon="🌽" color={T.green} />
        <KPI label="Clocked In" value="3/4" sub="Active now" icon="👥" color={T.yellow} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"2fr 1fr", gap:16, marginBottom:16 }}>
        <Card>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.text, letterSpacing:0.5, marginBottom:14, textTransform:"uppercase" }}>Weekly Sales</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="day" stroke={T.textDim} fontSize={11} fontFamily="Barlow Condensed" />
              <YAxis stroke={T.textDim} fontSize={11} />
              <Tooltip contentStyle={{ background:T.elevated, border:`1px solid ${T.border}`, borderRadius:6, color:T.text, fontFamily:"Nunito" }} />
              <Bar dataKey="sales" fill={T.orange} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.text, letterSpacing:0.5, marginBottom:14, textTransform:"uppercase" }}>By Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={[{name:"Elotes",value:38},{name:"Crepes",value:32},{name:"Drinks",value:22},{name:"Nieves",value:8}]} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                {["#E8640A","#FF9A50","#F59E0B","#22C55E"].map((c,i)=><Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background:T.elevated, border:`1px solid ${T.border}`, borderRadius:6, fontFamily:"Nunito" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card style={{ padding:0, overflowX:"auto" }}>
        <div style={{ padding:"16px 18px 10px", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.text, textTransform:"uppercase" }}>Recent Orders</div>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:480 }}>
          <thead>
            <tr>{["Order","Items","Total","Method","Status"].map(h=>(
              <th key={h} style={{ textAlign:"left", padding:"8px 14px", color:T.textDim, fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1, textTransform:"uppercase", borderBottom:`1px solid ${T.border}` }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {[["#4521","Taki-Loko x2, Boba Tea","$22.00","Cash","Done"],["#4520","Vaso Grande x3","$22.50","Card","Done"],["#4519","Crepe Nutella & Banana","$9.00","Cash","Done"]].map(([id,items,total,method,status])=>(
              <tr key={id} style={{ borderBottom:`1px solid ${T.border}` }}>
                <td style={{ padding:"12px 14px", color:T.orange, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{id}</td>
                <td style={{ padding:"12px 14px", color:T.text, fontSize:13 }}>{items}</td>
                <td style={{ padding:"12px 14px", color:T.text, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif" }}>{total}</td>
                <td style={{ padding:"12px 14px" }}><Badge color={method==="Card"?"blue":"orange"}>{method}</Badge></td>
                <td style={{ padding:"12px 14px" }}><Badge color="green">{status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─── INVENTORY ──────────────────────────────────────────── */
const Inventory = () => {
  const isMobile = useIsMobile();
  const [inv, setInv] = useState(INVENTORY);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({item:"",unit:"",stock:0,minStock:0,cost:0,supplier:""});

  const save = () => {
    if (modal==="add") setInv(i=>[...i,{...form,id:Date.now()}]);
    else setInv(i=>i.map(x=>x.id===modal.id?{...form,id:x.id}:x));
    setModal(null);
  };

  return (
    <div style={{ padding:isMobile?12:28, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease", paddingBottom:isMobile?80:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?26:32, color:T.text, letterSpacing:1 }}>INVENTORY</h1>
          <p style={{ color:T.textSec, fontSize:13 }}>{inv.filter(i=>i.stock<=i.minStock).length} items need restock</p>
        </div>
        <Btn onClick={()=>{setForm({item:"",unit:"",stock:0,minStock:0,cost:0,supplier:""});setModal("add");}}>+ Add</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(3,1fr)":"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        <KPI label="SKUs" value={inv.length} icon="📦" />
        <KPI label="Low Stock" value={inv.filter(i=>i.stock<=i.minStock).length} icon="⚠️" color={T.red} />
        <KPI label="Est. Value" value={`$${inv.reduce((s,i)=>s+i.stock*i.cost,0).toFixed(0)}`} icon="💵" color={T.green} />
      </div>
      {isMobile ? (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {inv.map(item=>{
            const low = item.stock<=item.minStock;
            return (
              <Card key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }}>
                <div style={{ flex:1 }}>
                  <div style={{ color:T.text, fontWeight:600, fontSize:14 }}>{item.item}</div>
                  <div style={{ color:T.textSec, fontSize:12, marginTop:2 }}>{item.supplier} · ${item.cost}/{item.unit}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color:low?T.red:T.green }}>{item.stock}</div>
                  <Badge color={low?"red":"green"}>{low?"Low":"OK"}</Badge>
                </div>
                <button onClick={()=>{setForm(item);setModal(item);}} style={{ background:T.elevated, border:`1px solid ${T.border}`, color:T.orange, borderRadius:4, padding:"6px 10px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11 }}>EDIT</button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:T.elevated }}>{["Item","Unit","Stock","Min","Cost","Supplier","Status",""].map(h=>(
              <th key={h} style={{ textAlign:"left", padding:"11px 14px", color:T.textDim, fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1, textTransform:"uppercase" }}>{h}</th>
            ))}</tr></thead>
            <tbody>
              {inv.map(item=>{
                const low = item.stock<=item.minStock;
                return (
                  <tr key={item.id} style={{ borderTop:`1px solid ${T.border}` }}>
                    <td style={{ padding:"13px 14px", color:T.text, fontWeight:600 }}>{item.item}</td>
                    <td style={{ padding:"13px 14px", color:T.textSec, fontSize:13 }}>{item.unit}</td>
                    <td style={{ padding:"13px 14px" }}><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, color:low?T.red:T.green }}>{item.stock}</span></td>
                    <td style={{ padding:"13px 14px", color:T.textDim, fontSize:13 }}>{item.minStock}</td>
                    <td style={{ padding:"13px 14px", color:T.textSec, fontSize:13 }}>${item.cost.toFixed(2)}</td>
                    <td style={{ padding:"13px 14px", color:T.textSec, fontSize:13 }}>{item.supplier}</td>
                    <td style={{ padding:"13px 14px" }}><Badge color={low?"red":"green"}>{low?"Low":"OK"}</Badge></td>
                    <td style={{ padding:"13px 14px" }}><button onClick={()=>{setForm(item);setModal(item);}} style={{ background:T.elevated, border:`1px solid ${T.border}`, color:T.orange, borderRadius:4, padding:"4px 10px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11 }}>EDIT</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
      {modal && (
        <Modal onClose={()=>setModal(null)}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20, color:T.text, marginBottom:18 }}>{modal==="add"?"ADD ITEM":"EDIT ITEM"}</div>
          <Input label="Item Name" value={form.item} onChange={v=>setForm(f=>({...f,item:v}))} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Input label="Unit" value={form.unit} onChange={v=>setForm(f=>({...f,unit:v}))} />
            <Input label="Supplier" value={form.supplier} onChange={v=>setForm(f=>({...f,supplier:v}))} />
            <Input label="Stock" type="number" value={form.stock} onChange={v=>setForm(f=>({...f,stock:+v}))} />
            <Input label="Min Stock" type="number" value={form.minStock} onChange={v=>setForm(f=>({...f,minStock:+v}))} />
            <Input label="Cost ($)" type="number" value={form.cost} onChange={v=>setForm(f=>({...f,cost:+v}))} />
          </div>
          <div style={{ display:"flex", gap:10, marginTop:6 }}>
            <Btn onClick={()=>setModal(null)} variant="dark" style={{ flex:1 }}>Cancel</Btn>
            <Btn onClick={save} style={{ flex:2 }}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── COMPRAS ────────────────────────────────────────────── */
const Compras = () => {
  const isMobile = useIsMobile();
  const [purchases, setPurchases] = useState(COMPRAS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ supplier:"", items:"", total:"", date:new Date().toISOString().split("T")[0] });
  const save = () => {
    setPurchases(p=>[{...form,id:Date.now(),status:"Pending",total:parseFloat(form.total)}, ...p]);
    setModal(false); setForm({ supplier:"", items:"", total:"", date:new Date().toISOString().split("T")[0] });
  };
  return (
    <div style={{ padding:isMobile?12:28, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease", paddingBottom:isMobile?80:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?26:32, color:T.text, letterSpacing:1 }}>COMPRAS</h1>
          <p style={{ color:T.textSec, fontSize:13 }}>Purchase orders & supplier management</p>
        </div>
        <Btn onClick={()=>setModal(true)}>+ New Order</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        <KPI label="This Month" value={`$${purchases.reduce((s,p)=>s+p.total,0).toFixed(0)}`} icon="📋" />
        <KPI label="Pending" value={purchases.filter(p=>p.status==="Pending").length} icon="⏳" color={T.yellow} />
        <KPI label="Suppliers" value="4" icon="🏪" color={T.green} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {purchases.map(p=>(
          <Card key={p.id} style={{ display:"flex", alignItems:isMobile?"flex-start":"center", gap:12, flexDirection:isMobile?"column":"row", padding:"14px 18px" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                <span style={{ color:T.text, fontWeight:600, fontSize:14 }}>{p.supplier}</span>
                <Badge color={p.status==="Received"?"green":"yellow"}>{p.status}</Badge>
              </div>
              <div style={{ color:T.textSec, fontSize:13 }}>{p.items}</div>
              <div style={{ color:T.textDim, fontSize:12, marginTop:2 }}>{p.date}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ color:T.orange, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20 }}>${p.total.toFixed(2)}</span>
              {p.status==="Pending"&&<Btn size="sm" onClick={()=>setPurchases(ps=>ps.map(x=>x.id===p.id?{...x,status:"Received"}:x))}>✓ Received</Btn>}
            </div>
          </Card>
        ))}
      </div>
      {modal && (
        <Modal onClose={()=>setModal(false)}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20, color:T.text, marginBottom:18 }}>NEW PURCHASE ORDER</div>
          <Input label="Supplier" value={form.supplier} onChange={v=>setForm(f=>({...f,supplier:v}))} />
          <Input label="Items" value={form.items} onChange={v=>setForm(f=>({...f,items:v}))} placeholder="Item x qty, ..." />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Input label="Total ($)" type="number" value={form.total} onChange={v=>setForm(f=>({...f,total:v}))} />
            <Input label="Date" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} />
          </div>
          <div style={{ display:"flex", gap:10, marginTop:6 }}>
            <Btn onClick={()=>setModal(false)} variant="dark" style={{ flex:1 }}>Cancel</Btn>
            <Btn onClick={save} style={{ flex:2 }}>Create Order</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── CLOCK ──────────────────────────────────────────────── */
const Clock = () => {
  const isMobile = useIsMobile();
  const [records, setRecords] = useState(CLOCK_RECORDS);
  const [time, setTime] = useState(new Date());
  const [selected, setSelected] = useState(null);
  useEffect(()=>{ const t=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(t); },[]);
  const isClockedIn = n => records.some(r=>r.worker===n&&!r.out);
  const handleClock = w => {
    const ci = isClockedIn(w.name);
    if (!ci) setRecords(r=>[...r,{id:Date.now(),worker:w.name,in:time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),out:null,hours:null}]);
    else setRecords(r=>r.map(x=>x.worker===w.name&&!x.out?{...x,out:time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),hours:8.0}:x));
    setSelected(null);
  };
  return (
    <div style={{ padding:isMobile?12:28, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease", paddingBottom:isMobile?80:28 }}>
      <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?26:32, color:T.text, letterSpacing:1, marginBottom:18 }}>CLOCK IN / OUT</h1>
      <Card style={{ textAlign:"center", marginBottom:20, padding:isMobile?"20px 12px":"28px" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?48:68, color:T.orange, letterSpacing:2, lineHeight:1 }}>
          {time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
        </div>
        <div style={{ color:T.textSec, fontSize:13, marginTop:8 }}>{time.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:20 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.text, letterSpacing:0.5, marginBottom:12, textTransform:"uppercase" }}>Select Worker</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {WORKERS.filter(w=>w.active).map(w=>{
              const ci = isClockedIn(w.name);
              return (
                <Card key={w.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", cursor:"pointer", border:`1px solid ${selected?.id===w.id?T.orange:T.border}`, transition:"all 0.15s" }} onClick={()=>setSelected(w)}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:ci?T.orangeDim:T.elevated, border:`2px solid ${ci?T.orange:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:ci?T.orange:T.textDim }}>
                      {w.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ color:T.text, fontWeight:600, fontSize:14 }}>{w.name}</div>
                      <div style={{ color:T.textSec, fontSize:12 }}>{w.role}</div>
                    </div>
                  </div>
                  <Badge color={ci?"green":"yellow"}>{ci?"In":"Out"}</Badge>
                </Card>
              );
            })}
          </div>
          {selected && (
            <div style={{ marginTop:14 }}>
              <Btn onClick={()=>handleClock(selected)} style={{ width:"100%" }} size="lg" variant={isClockedIn(selected.name)?"danger":"primary"}>
                {isClockedIn(selected.name)?"⏹ Clock Out":"▶ Clock In"} — {selected.name.split(" ")[0]}
              </Btn>
            </div>
          )}
        </div>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.text, letterSpacing:0.5, marginBottom:12, textTransform:"uppercase" }}>Today's Log</div>
          <Card style={{ padding:0, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:T.elevated }}>{["Worker","In","Out","Hrs"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"10px 12px", color:T.textDim, fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1, textTransform:"uppercase" }}>{h}</th>
              ))}</tr></thead>
              <tbody>
                {records.map(r=>(
                  <tr key={r.id} style={{ borderTop:`1px solid ${T.border}` }}>
                    <td style={{ padding:"12px", color:T.text, fontSize:13, fontWeight:600 }}>{r.worker.split(" ")[0]}</td>
                    <td style={{ padding:"12px", color:T.green, fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700 }}>{r.in}</td>
                    <td style={{ padding:"12px", color:r.out?T.red:T.textDim, fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700 }}>{r.out||<span style={{ animation:"pulse 1s infinite", fontSize:11 }}>ACTIVE</span>}</td>
                    <td style={{ padding:"12px", color:T.orange, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800 }}>{r.hours||"—"}</td>
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
  const isMobile = useIsMobile();
  const [range, setRange] = useState("week");
  return (
    <div style={{ padding:isMobile?12:28, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease", paddingBottom:isMobile?80:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?26:32, color:T.text, letterSpacing:1 }}>REPORTS</h1>
          <p style={{ color:T.textSec, fontSize:13 }}>Sales analytics & performance</p>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["day","week","month"].map(r=>(
            <button key={r} onClick={()=>setRange(r)} style={{ padding:"7px 14px", borderRadius:6, border:`1px solid ${range===r?T.orange:T.border}`, background:range===r?T.orangeDim:"transparent", color:range===r?T.orange:T.textSec, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", textTransform:"uppercase" }}>{r}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <KPI label="Total Sales" value="$5,025" sub="7-day period" icon="💰" />
        <KPI label="Orders" value="677" sub="96.7/day avg" icon="🛒" color={T.blue} />
        <KPI label="Avg Ticket" value="$7.42" sub="+$0.32 vs last wk" icon="📊" color={T.green} />
        <KPI label="Labor Cost" value="$840" sub="16.7% of sales" icon="👥" color={T.yellow} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.text, marginBottom:14, textTransform:"uppercase" }}>Daily Revenue</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="day" stroke={T.textDim} fontSize={11} fontFamily="Barlow Condensed" />
              <YAxis stroke={T.textDim} fontSize={11} />
              <Tooltip contentStyle={{ background:T.elevated, border:`1px solid ${T.border}`, borderRadius:6, fontFamily:"Nunito" }} />
              <Line type="monotone" dataKey="sales" stroke={T.orange} strokeWidth={2.5} dot={{ fill:T.orange,r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.text, marginBottom:14, textTransform:"uppercase" }}>Order Volume</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="day" stroke={T.textDim} fontSize={11} fontFamily="Barlow Condensed" />
              <YAxis stroke={T.textDim} fontSize={11} />
              <Tooltip contentStyle={{ background:T.elevated, border:`1px solid ${T.border}`, borderRadius:6, fontFamily:"Nunito" }} />
              <Bar dataKey="orders" fill={T.blue} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.text, marginBottom:14, textTransform:"uppercase" }}>Top Selling Items</div>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(3,1fr)":"repeat(5,1fr)", gap:10 }}>
          {[{name:"Vaso Grande",sold:218,rev:"$1,635",emoji:"🌽"},{name:"Taki-Loko",sold:189,rev:"$1,512",emoji:"🔥"},{name:"Mangonada",sold:145,rev:"$1,160",emoji:"🥭"},{name:"Nutella & Banana",sold:132,rev:"$1,188",emoji:"🥞"},{name:"Boba Tea",sold:98,rev:"$637",emoji:"🧋"}].map((item,i)=>(
            <Card key={i} style={{ textAlign:"center", padding:isMobile?"10px 8px":"14px 10px", background:T.elevated }}>
              <div style={{ fontSize:isMobile?24:28, marginBottom:6 }}>{item.emoji}</div>
              <div style={{ color:T.text, fontSize:isMobile?10:12, fontFamily:"'Nunito',sans-serif", fontWeight:600, marginBottom:3, lineHeight:1.2 }}>{item.name}</div>
              <div style={{ color:T.orange, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?14:18 }}>{item.rev}</div>
              <div style={{ color:T.textSec, fontSize:10, marginTop:2 }}>{item.sold} sold</div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ─── USERS ──────────────────────────────────────────────── */
const Users = () => {
  const isMobile = useIsMobile();
  const [workers, setWorkers] = useState(WORKERS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({name:"",role:"Cashier",pin:"",hourlyRate:15,active:true});
  const save = () => {
    if (modal==="add") setWorkers(w=>[...w,{...form,id:Date.now()}]);
    else setWorkers(w=>w.map(x=>x.id===modal.id?{...form,id:x.id}:x));
    setModal(null);
  };
  return (
    <div style={{ padding:isMobile?12:28, fontFamily:"'Nunito',sans-serif", animation:"fadeIn 0.4s ease", paddingBottom:isMobile?80:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:isMobile?26:32, color:T.text, letterSpacing:1 }}>TEAM</h1>
          <p style={{ color:T.textSec, fontSize:13 }}>{workers.filter(w=>w.active).length} active · {workers.filter(w=>!w.active).length} inactive</p>
        </div>
        <Btn onClick={()=>{setForm({name:"",role:"Cashier",pin:"",hourlyRate:15,active:true});setModal("add");}}>+ Add</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:14 }}>
        {workers.map(w=>(
          <Card key={w.id} style={{ display:"flex", alignItems:"center", gap:14, animation:"fadeIn 0.3s ease" }}>
            <div style={{ width:48,height:48,borderRadius:"50%",background:w.active?T.orangeDim:T.elevated,border:`2px solid ${w.active?T.orange:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:w.active?T.orange:T.textDim,flexShrink:0 }}>
              {w.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:T.text,fontWeight:700,fontSize:14,marginBottom:4 }}>{w.name}</div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                <Badge color={w.role==="Manager"?"orange":"yellow"}>{w.role}</Badge>
                <Badge color={w.active?"green":"red"}>{w.active?"Active":"Inactive"}</Badge>
              </div>
              <div style={{ color:T.textSec,fontSize:11,marginTop:4 }}>${w.hourlyRate}/hr · PIN: {w.pin}</div>
            </div>
            <Btn onClick={()=>{setForm(w);setModal(w);}} variant="ghost" size="sm">Edit</Btn>
          </Card>
        ))}
      </div>
      {modal && (
        <Modal onClose={()=>setModal(null)}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20, color:T.text, marginBottom:18 }}>{modal==="add"?"ADD WORKER":"EDIT WORKER"}</div>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} />
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block",color:T.textSec,fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,textTransform:"uppercase",marginBottom:5 }}>Role</label>
            <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={{ width:"100%",background:T.elevated,border:`1px solid ${T.border}`,borderRadius:6,padding:"10px 14px",color:T.text,fontSize:14,fontFamily:"'Nunito',sans-serif",outline:"none" }}>
              {["Cashier","Cook","Manager","Admin"].map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <Input label="PIN (4 digits)" value={form.pin} onChange={v=>setForm(f=>({...f,pin:v}))} />
            <Input label="Hourly Rate ($)" type="number" value={form.hourlyRate} onChange={v=>setForm(f=>({...f,hourlyRate:+v}))} />
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
            <input type="checkbox" id="active" checked={form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} />
            <label htmlFor="active" style={{ color:T.textSec,fontSize:14,fontFamily:"'Nunito',sans-serif",cursor:"pointer" }}>Active</label>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <Btn onClick={()=>setModal(null)} variant="dark" style={{ flex:1 }}>Cancel</Btn>
            <Btn onClick={save} style={{ flex:2 }}>Save Worker</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── APP ROOT ───────────────────────────────────────────── */
export default function App() {
  const [auth, setAuth] = useState(null);
  const [screen, setScreen] = useState("dashboard");
  const isMobile = useIsMobile();

  const handleLogin = (role, worker) => {
    setAuth({ role, worker });
    setScreen(role==="admin"?"dashboard":"pos");
  };

  if (!auth) return <Login onLogin={handleLogin} />;

  const SCREENS = { dashboard:<Dashboard />, pos:<POS />, inventory:<Inventory />, compras:<Compras />, clock:<Clock />, reports:<Reports />, users:<Users /> };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg, fontFamily:"'Nunito',sans-serif" }}>
      {!isMobile && <Sidebar screen={screen} setScreen={setScreen} userRole={auth.role} onLogout={()=>{setAuth(null);setScreen("dashboard");}} />}
      <div style={{ flex:1, overflowX:"hidden", minHeight:"100vh" }}>
        {SCREENS[screen]||<Dashboard />}
      </div>
      {isMobile && <Sidebar screen={screen} setScreen={setScreen} userRole={auth.role} onLogout={()=>{setAuth(null);setScreen("dashboard");}} />}
    </div>
  );
}
