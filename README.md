# 🌽 Lokos Street Food — Unified POS

A full-featured point-of-sale & management system built for **Lokos Street Food** at El Rancho Supermarket, McKinney TX.

---

## Features

| Screen | Role | Description |
|--------|------|-------------|
| **Login** | All | PIN-based auth (4-digit) — Admin PIN `0000`, workers use their own PIN |
| **POS** | Worker + Admin | Menu grid, cart, tax calc, cash/card payment modal |
| **Dashboard** | Admin | Live KPIs, weekly sales bar chart, category pie chart, recent orders |
| **Inventory** | Admin | Stock tracking, low-stock alerts, edit/add items |
| **Compras** | Admin | Purchase orders, supplier management, mark-received workflow |
| **Clock In/Out** | Worker + Admin | Real-time clock, per-worker in/out log, hours tracking |
| **Reports** | Admin | Revenue & order volume charts, top-5 items by sales |
| **Team** | Admin | Worker roster, PIN/role management, active/inactive toggle |

---

## Tech Stack

- **React 18** (Vite)
- **Recharts** — charts
- **Tailwind CSS** (optional, Barlow Condensed + Nunito via Google Fonts)
- **Railway** — hosting
- **Node 20+**

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/your-org/lokos-pos.git
cd lokos-pos

# 2. Install
npm install

# 3. Run dev server
npm run dev
# → http://localhost:5173
```

---

## Project Structure

```
lokos-pos/
├── src/
│   ├── App.jsx          ← Main app (all screens)
│   ├── main.jsx         ← React entry point
│   └── index.css        ← Minimal global reset
├── index.html
├── vite.config.js
├── package.json
└── railway.toml         ← Railway deploy config
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001` |
| `VITE_APP_NAME` | App display name | `Lokos POS` |

Set these in Railway → **Variables** tab before deploying.

---

## Connecting to Your Backend (Elotes Control / Railway API)

Replace the mock data arrays in `App.jsx` with API calls:

```js
// Example: fetch menu items from your Railway backend
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/menu`)
    .then(r => r.json())
    .then(setMenuItems);
}, []);
```

Your existing Railway app at `elotescontrol.up.railway.app` can serve as the API backend — just expose REST endpoints for menu, inventory, sales, and clock records.

---

## PIN Authentication

Default PINs (change in production):

| User | PIN | Role |
|------|-----|------|
| Admin | `0000` | Full access |
| Maria Garcia | `1234` | Cashier |
| Juan Lopez | `5678` | Cook |
| Carlos Rivera | `3456` | Manager |

> ⚠️ For production: store PINs hashed in your database, never in frontend code.

---

## License

Private — Lokos Street Food © 2026
