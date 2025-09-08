"use client";
import React, {
  useEffect,
  useMemo,
  useState,
  useDeferredValue,
  memo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Bell,
  Plus,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  CheckCircle2,
  AlertCircle,
  Mail,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

/* -------------------------------- THEME ---------------------------------- */
const defaultLightTheme = {
  surface: "#ffffff",
  surfaceAlt: "#f8fafc",
  surfaceSoft: "#f3f4f6",
  border: "#e5e7eb",
  text: "#0b1220",
  textSoft: "#475569",
  primary: "#3b82f6",
  primaryText: "#ffffff",
  accent: "#22c55e",
  warn: "#f59e0b",
  danger: "#ef4444",
  radius: "16px",
  shadow: "0 4px 16px 0 rgba(2,6,23,0.06)",
};

const defaultDarkTheme = {
  surface: "#0b1220",
  surfaceAlt: "#0f172a",
  surfaceSoft: "#111827",
  border: "#1f2937",
  text: "#e5e7eb",
  textSoft: "#94a3b8",
  primary: "#60a5fa",
  primaryText: "#0b1220",
  accent: "#22d3ee",
  warn: "#f59e0b",
  danger: "#f87171",
  radius: "16px",
  shadow: "0 6px 22px 0 rgba(0,0,0,0.35)",
};

function applyTheme(vars) {
  const out = {};
  for (const [k, v] of Object.entries(vars)) out[`--${k}`] = String(v);
  return out;
}

/* ------------------------------ MOCK DATA -------------------------------- */
const chartData = [
  { name: "Jan", sales: 1200, users: 300 },
  { name: "Feb", sales: 1800, users: 380 },
  { name: "Mar", sales: 1500, users: 420 },
  { name: "Apr", sales: 2200, users: 460 },
  { name: "May", sales: 2800, users: 520 },
  { name: "Jun", sales: 2500, users: 590 },
  { name: "Jul", sales: 3200, users: 650 },
];

const initialOrders = [
  { id: "ORD-1024", customer: "Elena M.", date: "2025-08-30", total: 129.9, status: "Paid" },
  { id: "ORD-1025", customer: "John D.", date: "2025-08-31", total: 59.0, status: "Pending" },
  { id: "ORD-1026", customer: "Arezoo K.", date: "2025-09-01", total: 349.0, status: "Paid" },
  { id: "ORD-1027", customer: "Nima R.", date: "2025-09-02", total: 89.99, status: "Failed" },
  { id: "ORD-1028", customer: "Sara H.", date: "2025-09-03", total: 210.0, status: "Paid" },
  { id: "ORD-1029", customer: "Liam P.", date: "2025-09-04", total: 42.5, status: "Refunded" },
  { id: "ORD-1030", customer: "Yousef S.", date: "2025-09-05", total: 640.0, status: "Paid" },
];

const initialCustomers = [
  { id: "CUS-2001", name: "Elena M.", email: "elena@example.com", joined: "2025-07-21", status: "Active" },
  { id: "CUS-2002", name: "John D.", email: "john@example.com", joined: "2025-08-02", status: "Active" },
  { id: "CUS-2003", name: "Arezoo K.", email: "arezoo@example.com", joined: "2025-08-29", status: "Active" },
  { id: "CUS-2004", name: "Nima R.", email: "nima@example.com", joined: "2025-09-01", status: "Banned" },
  { id: "CUS-2005", name: "Sara H.", email: "sara@example.com", joined: "2025-09-03", status: "Active" },
];

/* ------------------------------ BADGES ----------------------------------- */
const StatusBadge = memo(function StatusBadge({ status }) {
  const map = {
    Paid: { bg: "bg-[var(--accent)]/15", text: "text-[var(--accent)]", border: "border-[var(--accent)]/30", Icon: CheckCircle2 },
    Pending: { bg: "bg-[var(--warn)]/15", text: "text-[var(--warn)]", border: "border-[var(--warn)]/30", Icon: AlertCircle },
    Failed: { bg: "bg-[var(--danger)]/15", text: "text-[var(--danger)]", border: "border-[var(--danger)]/30", Icon: AlertCircle },
    Refunded: { bg: "bg-[var(--primary)]/10", text: "text-[var(--primary)]", border: "border-[var(--primary)]/30", Icon: CheckCircle2 },
    Active: { bg: "bg-[var(--accent)]/15", text: "text-[var(--accent)]", border: "border-[var(--accent)]/30", Icon: CheckCircle2 },
    Banned: { bg: "bg-[var(--danger)]/15", text: "text-[var(--danger)]", border: "border-[var(--danger)]/30", Icon: AlertCircle },
  };
  const conf = map[status] ?? { bg: "bg-[var(--surfaceSoft)]", text: "text-[var(--textSoft)]", border: "border-[var(--border)]", Icon: CheckCircle2 };
  const { Icon } = conf;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${conf.bg} ${conf.text} ${conf.border}`}>
      <Icon className="h-3.5 w-3.5" /> {status}
    </span>
  );
});

/* --------------------------- SMALL UI HELPERS ---------------------------- */
const SortBtn = memo(function SortBtn({ label, active, dir, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs transition",
        "hover:bg-[var(--surfaceSoft)]",
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primaryText)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--textSoft)]",
      ].join(" ")}
      aria-pressed={active}
      title={`Sort by ${label} (${active ? dir : "none"})`}
    >
      <span className="font-medium">{label}</span>
      {active ? <span className="text-[10px] opacity-90">{dir === "asc" ? "↑" : "↓"}</span> : null}
    </button>
  );
});

const SideLink = memo(function SideLink({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-[var(--surfaceSoft)] text-[var(--text)]"
          : "text-[var(--textSoft)] hover:bg-[var(--surfaceSoft)]",
      ].join(" ")}
    >
      <motion.span
        initial={false}
        animate={active ? { scale: 1.05, rotate: 0, color: "var(--primary)" } : { scale: 1, rotate: 0 }}
        whileTap={{ scale: 0.95, rotate: -10 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="grid place-items-center"
      >
        <Icon className="h-4 w-4 transition-colors group-hover:text-[var(--primary)]" />
      </motion.span>
      <span>{label}</span>
    </button>
  );
});

/*  Card: فقط وقتی grow=true باشه ارتفاع رو پر کنه (برای هم‌قدی دسکتاپ)  */
const Card = memo(function Card({
  title,
  subtitle,
  right,
  children,
  padded = true,
  className = "",
  grow = false,
}) {
  const shell = [
    "rounded-2xl border border-[var(--border)] bg-[var(--surface)]",
    grow ? "flex h-full flex-col" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const body = [(padded ? "p-4 " : ""), grow ? "flex-1" : ""].join("");
  return (
    <div className={shell} style={{ boxShadow: "var(--shadow)" }}>
      {(title || right) && (
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3">
          <div>
            {title && <div className="text-sm font-semibold text-[var(--text)]">{title}</div>}
            {subtitle && <div className="text-xs text-[var(--textSoft)]">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div className={body}>{children}</div>
    </div>
  );
});

const KpiCard = memo(function KpiCard({ title, value, delta, sub }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
      style={{ boxShadow: "var(--shadow)" }}
    >
      <div className="text-xs text-[var(--textSoft)]">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">{value}</div>
      <div className="mt-1 text-xs text-[var(--accent)]">{delta}</div>
      <div className="text-xs text-[var(--textSoft)]">{sub}</div>
    </motion.div>
  );
});

const EmptyState = memo(function EmptyState({ title="No data", subtitle="There is nothing to show yet.", action=null }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <div className="text-center">
        <div className="text-sm font-medium text-[var(--text)]">{title}</div>
        <div className="mt-1 text-xs text-[var(--textSoft)]">{subtitle}</div>
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
});

/* ------------------------------- VIEWS ----------------------------------- */
/* pagination helper */
function usePagination(list, pageSize = 10) {
  const [page, setPage] = useState(1);
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages, page]);
  const start = (page - 1) * pageSize;
  const slice = list.slice(start, start + pageSize);
  return { page, setPage, pages, slice, total };
}

function Pager({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-50"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="text-xs text-[var(--textSoft)]">
        Page <b>{page}</b> / {pages}
      </span>
      <button
        className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-50"
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
      >
        Next
      </button>
    </div>
  );
}

function OrdersView({ orders, filtered, q, setQ, sortKey, sortDir, toggleSort, onAddClick }) {
  const [pageSize, setPageSize] = useState(10);
  const { page, setPage, pages, slice, total } = usePagination(filtered, pageSize);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-[var(--textSoft)]">Manage and review recent orders</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search orders..."
              className="w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-9 py-2 text-sm outline-none transition focus:border-[var(--primary)]"
            />
          </div>
          <select
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            title="Rows per page"
          >
            {[5,10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--primaryText)] hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Order
          </button>
        </div>
      </div>

      <Card
        title="Recent Orders"
        right={
          <div className="flex items-center gap-2">
            <SortBtn label="Date" active={sortKey === "date"} dir={sortDir} onClick={() => { toggleSort("date"); setPage(1); }} />
            <SortBtn label="Total" active={sortKey === "total"} dir={sortDir} onClick={() => { toggleSort("total"); setPage(1); }} />
            <SortBtn label="Status" active={sortKey === "status"} dir={sortDir} onClick={() => { toggleSort("status"); setPage(1); }} />
            <Pager page={page} pages={pages} onChange={setPage} />
          </div>
        }
        padded={false}
        /* grow={false}  ← جدول نباید قد بکشه */
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surfaceSoft)]">
              <tr className="text-xs uppercase text-[var(--textSoft)]">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6">
                    <EmptyState
                      title="No orders found"
                      subtitle="Try changing filters or add a new order."
                      action={<button onClick={onAddClick} className="rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-medium text-[var(--primaryText)] hover:opacity-90">Add Order</button>}
                    />
                  </td>
                </tr>
              ) : (
                slice.map((o) => (
                  <tr key={o.id} className="border-t border-[var(--border)] last:border-b">
                    <td className="px-4 py-3 font-mono">{o.id}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3">{o.date}</td>
                    <td className="px-4 py-3">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 text-xs text-[var(--textSoft)]">
            <span>Showing {(page-1)*pageSize + 1}–{Math.min(page*pageSize, total)} of {total}</span>
            <Pager page={page} pages={pages} onChange={setPage} />
          </div>
        )}
      </Card>
    </>
  );
}

function CustomersView({ customers, setCustomers }) {
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const deferredQ = useDeferredValue(q);

  const filtered = useMemo(() => {
    const term = deferredQ.trim().toLowerCase();
    return customers.filter(
      c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.id.toLowerCase().includes(term)
    );
  }, [customers, deferredQ]);

  const addCustomer = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const id = `CUS-${Math.floor(Math.random()*9000+1000)}`;
    const joined = new Date().toISOString().slice(0,10);
    setCustomers(prev => [{ id, name, email, joined, status: "Active" }, ...prev]);
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-[var(--textSoft)]">All customers and membership status</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search customers..."
              className="w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-9 py-2 text-sm outline-none transition focus:border-[var(--primary)]"
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--primaryText)] hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>
      </div>

      <Card title="Customer List" padded={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surfaceSoft)]">
              <tr className="text-xs uppercase text-[var(--textSoft)]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-[var(--border)] last:border-b">
                  <td className="px-4 py-3 font-mono">{c.id}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">
                    <a className="inline-flex items-center gap-1 hover:underline" href={`mailto:${c.email}`}>
                      <Mail className="h-3.5 w-3.5" />{c.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">{c.joined}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <button
                      className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:bg-[var(--surfaceSoft)]"
                      onClick={() =>
                        setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, status: x.status === "Active" ? "Banned" : "Active" } : x))
                      }
                    >
                      {c.status === "Active" ? "Ban" : "Unban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: "var(--shadow)" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Add Customer</h3>
                <button className="rounded-xl p-2 hover:bg-[var(--surfaceSoft)]" onClick={() => setModalOpen(false)} aria-label="Close Modal">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form className="space-y-3" onSubmit={addCustomer}>
                <div>
                  <label className="mb-1 block text-xs text-[var(--textSoft)]">Name</label>
                  <input name="name" required className="w-full rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--textSoft)]">Email</label>
                  <input type="email" name="email" required className="w-full rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--primaryText)] hover:opacity-90">
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AnalyticsView() {
  const stacked = chartData.map(d => ({ ...d, returns: Math.max(0, Math.round(d.sales * 0.15)) }));
  return (
    <>
      <div className="mb-2">
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-[var(--textSoft)]">Trends and KPIs overview</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Sales vs Users" subtitle="Last 7 months" grow>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--textSoft)', fontSize: 12 }} stroke="var(--border)" />
                <YAxis tick={{ fill: 'var(--textSoft)', fontSize: 12 }} stroke="var(--border)" />
                <Tooltip />
                <Legend wrapperStyle={{ color: 'var(--textSoft)' }} />
                <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="users" stroke="var(--accent)" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Sales vs Returns" subtitle="Stacked bars" grow>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stacked} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--textSoft)', fontSize: 12 }} stroke="var(--border)" />
                <YAxis tick={{ fill: 'var(--textSoft)', fontSize: 12 }} stroke="var(--border)" />
                <Tooltip />
                <Legend wrapperStyle={{ color: 'var(--textSoft)' }} />
                <Bar dataKey="sales" stackId="a" fill="var(--primary)" />
                <Bar dataKey="returns" stackId="a" fill="var(--danger)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}

/* ---------- Settings (color pickers stay open during drag) --------------- */
function SettingsView({ themeState, setThemeState, darkThemeState, setDarkThemeState, rootRef }) {
  const [localLight, setLocalLight] = useState(themeState);
  const [localDark, setLocalDark] = useState(darkThemeState);

  useEffect(() => setLocalLight(themeState), [themeState]);
  useEffect(() => setLocalDark(darkThemeState), [darkThemeState]);

  const livePreview = useCallback((key, value) => {
    if (!rootRef?.current) return;
    rootRef.current.style.setProperty(`--${key}`, String(value));
  }, [rootRef]);

  const commit = (mode, key, value) => {
    if (mode === "light") setLocalLight(prev => ({ ...prev, [key]: value }));
    else setLocalDark(prev => ({ ...prev, [key]: value }));
  };

  const persist = () => {
    setThemeState(localLight);
    setDarkThemeState(localDark);
  };

  const reset = () => {
    setLocalLight(defaultLightTheme);
    setLocalDark(defaultDarkTheme);
    if (rootRef?.current) {
      Object.entries(defaultLightTheme).forEach(([k,v]) => rootRef.current.style.setProperty(`--${k}`, String(v)));
    }
  };

  const InputRow = ({ label, children }) => (
    <div className="grid grid-cols-[120px_1fr] items-center gap-3">
      <div className="text-xs text-[var(--textSoft)]">{label}</div>
      <div>{children}</div>
    </div>
  );

  const ColorField = memo(function ColorField({ mode, label, varKey, value }) {
    const [val, setVal] = useState(value);
    useEffect(() => setVal(value), [value]);
    return (
      <InputRow label={label}>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={val}
            onInput={(e) => { const v = e.currentTarget.value; livePreview(varKey, v); setVal(v); }}
            onChange={(e) => { const v = e.currentTarget.value; commit(mode, varKey, v); }}
          />
          <input
            className="w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs"
            value={val}
            onInput={(e) => { const v = e.currentTarget.value; livePreview(varKey, v); setVal(v); }}
            onChange={(e) => { const v = e.currentTarget.value; commit(mode, varKey, v); }}
          />
          <span className="inline-block h-5 w-5 rounded-lg border border-[var(--border)]" style={{ background: val }} />
        </div>
      </InputRow>
    );
  });

  const RangeField = memo(function RangeField({ mode, label, varKey, value, min=8, max=28 }) {
    const [val, setVal] = useState(parseInt(value));
    useEffect(() => setVal(parseInt(value)), [value]);
    return (
      <InputRow label={label}>
        <div className="flex items-center gap-2">
          <input
            type="range" min={min} max={max}
            value={val}
            onInput={(e) => { const v = parseInt(e.currentTarget.value); livePreview(varKey, `${v}px`); setVal(v); }}
            onChange={(e) => { const v = parseInt(e.currentTarget.value); commit(mode, varKey, `${v}px`); }}
          />
          <div className="w-10 text-right text-xs">{val}px</div>
        </div>
      </InputRow>
    );
  });

  const SelectField = memo(function SelectField({ mode, label, varKey, value, options }) {
    return (
      <InputRow label={label}>
        <select
          value={value}
          onChange={(e) => { commit(mode, varKey, e.target.value); livePreview(varKey, e.target.value); }}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </InputRow>
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--textSoft)]">Customize theme and appearance (live preview)</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Light Theme">
          <div className="space-y-3">
            <ColorField mode="light" label="Primary" varKey="primary" value={localLight.primary} />
            <ColorField mode="light" label="Accent" varKey="accent" value={localLight.accent} />
            <ColorField mode="light" label="Surface" varKey="surface" value={localLight.surface} />
            <ColorField mode="light" label="Text" varKey="text" value={localLight.text} />
            <RangeField  mode="light" label="Radius" varKey="radius" value={localLight.radius} />
            <SelectField mode="light" label="Shadow" varKey="shadow" value={localLight.shadow} options={[
              { label:"Soft", value:"0 4px 16px 0 rgba(2,6,23,0.06)" },
              { label:"Medium", value:"0 8px 24px rgba(0,0,0,0.08)" },
              { label:"Strong", value:"0 12px 32px rgba(0,0,0,0.18)" },
            ]} />
          </div>
        </Card>

        <Card title="Dark Theme">
          <div className="space-y-3">
            <ColorField mode="dark" label="Primary" varKey="primary" value={localDark.primary} />
            <ColorField mode="dark" label="Accent" varKey="accent" value={localDark.accent} />
            <ColorField mode="dark" label="Surface" varKey="surface" value={localDark.surface} />
            <ColorField mode="dark" label="Text" varKey="text" value={localDark.text} />
            <RangeField  mode="dark" label="Radius" varKey="radius" value={localDark.radius} />
            <SelectField mode="dark" label="Shadow" varKey="shadow" value={localDark.shadow} options={[
              { label:"Soft", value:"0 6px 22px 0 rgba(0,0,0,0.35)" },
              { label:"Medium", value:"0 10px 26px rgba(0,0,0,0.45)" },
              { label:"Strong", value:"0 14px 34px rgba(0,0,0,0.6)" },
            ]} />
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={persist} className="rounded-xl bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--primaryText)] hover:opacity-90">Apply</button>
        <button onClick={reset} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm hover:bg-[var(--surfaceSoft)]">Reset</button>
      </div>
    </div>
  );
}

/* ------------------------------- MAIN ------------------------------------ */
export default function AdminPanel({
  theme = defaultLightTheme,
  darkTheme = defaultDarkTheme,
  title = "Yousef Admin",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [section, setSection] = useState("Dashboard"); // Dashboard, Orders, Customers, Analytics, Settings
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [themeState, setThemeState] = useState({ ...defaultLightTheme, ...theme });
  const [darkThemeState, setDarkThemeState] = useState({ ...defaultDarkTheme, ...darkTheme });

  const rootRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin-dark");
    if (stored) setDark(stored === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("admin-dark", dark ? "1" : "0");
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const vars = dark ? applyTheme(darkThemeState) : applyTheme(themeState);
  const deferredQ = useDeferredValue(q);

  const filtered = useMemo(() => {
    const term = deferredQ.trim().toLowerCase();
    let list = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.customer.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term)
    );
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "date") return (new Date(a.date) - new Date(b.date)) * dir;
      if (sortKey === "total") return (a.total - b.total) * dir;
      return String(a[sortKey]).localeCompare(String(b[sortKey])) * dir;
    });
    return list;
  }, [orders, deferredQ, sortKey, sortDir]);

  const addMockOrder = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const customer = String(form.get("customer") || "");
    const total = Number(form.get("total"));
    const status = String(form.get("status") || "Pending");
    const id = `ORD-${Math.floor(Math.random() * 9000 + 1000)}`;
    const date = new Date().toISOString().slice(0, 10);
    setOrders((prev) => [{ id, customer, total, status, date }, ...prev ]);
    setModalOpen(false);
  };

  const toggleSort = useCallback((key) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return key;
    });
  }, []);

  const nav = [
    { key: "Dashboard", icon: LayoutDashboard },
    { key: "Orders", icon: ShoppingCart },
    { key: "Customers", icon: Users },
    { key: "Analytics", icon: BarChart3 },
    { key: "Settings", icon: SettingsIcon },
  ];

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[var(--surfaceAlt)] text-[var(--text)]"
      style={vars}
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color:oklch(from_var(--surface)/0.85)] backdrop-blur-md"
        style={{ boxShadow: "0 1px 0 0 var(--border)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              className="rounded-xl p-2 hover:bg-[var(--surfaceSoft)] lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-semibold">{title}</span>
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <button className="rounded-xl p-2 hover:bg-[var(--surfaceSoft)]" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              className="rounded-xl p-2 hover:bg-[var(--surfaceSoft)]"
              aria-label="Toggle Theme"
              title={dark ? "Switch to light" : "Switch to dark"}
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="rounded-xl p-2 hover:bg-[var(--surfaceSoft)]" aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Shell (بدون grow) */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside
          className="hidden h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 lg:block"
          style={{ boxShadow: "var(--shadow)" }}
        >
          <nav className="space-y-1">
            {nav.map((item) => (
              <SideLink
                key={item.key}
                icon={item.icon}
                label={item.key}
                active={section === item.key}
                onClick={() => setSection(item.key)}
              />
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="space-y-4">
          {section === "Dashboard" && (
            <>
              {/* Quick */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Dashboard Overview</h1>
                  <p className="text-sm text-[var(--textSoft)]">Snapshot of sales, users, and recent orders</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--primaryText)] shadow-sm hover:opacity-90 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" /> Add Order
                  </button>
                </div>
              </div>

              {/* KPI */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard title="Total Sales" value="$12,480" delta="↑ 12%" sub="vs last month" />
                <KpiCard title="Orders" value={`${orders.length}`} delta="↑ 5%" sub="in the last 30 days" />
                <KpiCard title="Active Users" value="650" delta="↑ 8%" sub="currently online" />
                <KpiCard title="Conversion" value="2.6%" delta="↑ 0.4%" sub="store average" />
              </div>

              {/* Charts & Feed — اینجا grow=true تا دو کارت هم‌قد بشن */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card title="Sales vs Users" subtitle="Last 7 months" className="lg:col-span-2" grow>
                  <div className="h-[320px] lg:h-[360px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" tick={{ fill: 'var(--textSoft)', fontSize: 12 }} stroke="var(--border)" />
                        <YAxis tick={{ fill: 'var(--textSoft)', fontSize: 12 }} stroke="var(--border)" />
                        <Tooltip />
                        <Legend wrapperStyle={{ color: 'var(--textSoft)' }} />
                        <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="users" stroke="var(--accent)" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="Notifications" className="lg:col-span-1" grow>
                  <ul className="flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
                    <li className="rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] p-3 shadow-sm">
                      New user <b>sam.dev</b> signed up
                    </li>
                    <li className="rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] p-3 shadow-sm">
                      Payment refunded for <b>ORD-1029</b>
                    </li>
                    <li className="rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] p-3 shadow-sm">
                      Server usage normal
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Recent Orders — بدون grow تا به اندازهٔ محتوا باشه */}
              <Card title="Recent Orders" padded={false}>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[var(--surfaceSoft)]">
                      <tr className="text-xs uppercase text-[var(--textSoft)]">
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-6"><EmptyState title="No recent orders" subtitle="You haven't added any orders yet." /></td></tr>
                      ) : (
                        orders.slice(0, 8).map((o) => (
                          <tr key={o.id} className="border-t border-[var(--border)] last:border-b">
                            <td className="px-4 py-3 font-mono">{o.id}</td>
                            <td className="px-4 py-3">{o.customer}</td>
                            <td className="px-4 py-3">{o.date}</td>
                            <td className="px-4 py-3">${o.total.toFixed(2)}</td>
                            <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {section === "Orders" && (
            <OrdersView
              orders={orders}
              filtered={filtered}
              q={q}
              setQ={setQ}
              sortKey={sortKey}
              sortDir={sortDir}
              toggleSort={toggleSort}
              onAddClick={() => setModalOpen(true)}
            />
          )}

          {section === "Customers" && (
            <CustomersView customers={customers} setCustomers={setCustomers} />
          )}

          {section === "Analytics" && <AnalyticsView />}

          {section === "Settings" && (
            <SettingsView
              themeState={themeState}
              setThemeState={setThemeState}
              darkThemeState={darkThemeState}
              setDarkThemeState={setDarkThemeState}
              rootRef={rootRef}
            />
          )}
        </main>
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="absolute left-0 top-0 h-full w-72 border-r border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--text)]"
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: "var(--shadow)" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="font-semibold">{title}</span>
                </div>
                <button className="rounded-xl p-2 hover:bg-[var(--surfaceSoft)]" onClick={() => setSidebarOpen(false)} aria-label="Close Sidebar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {nav.map((item) => (
                  <SideLink
                    key={item.key}
                    icon={item.icon}
                    label={item.key}
                    active={section === item.key}
                    onClick={() => { setSection(item.key); setSidebarOpen(false); }}
                  />
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Order Modal (global) */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: "var(--shadow)" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Add Order</h3>
                <button className="rounded-xl p-2 hover:bg-[var(--surfaceSoft)]" onClick={() => setModalOpen(false)} aria-label="Close Modal">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form className="space-y-3" onSubmit={addMockOrder}>
                <div>
                  <label className="mb-1 block text-xs text-[var(--textSoft)]">Customer</label>
                  <input name="customer" required className="w-full rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--textSoft)]">Total (USD)</label>
                  <input type="number" step="0.01" name="total" required className="w-full rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--textSoft)]">Status</label>
                  <select name="status" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surfaceAlt)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]">
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Failed</option>
                    <option>Refunded</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2 text-sm font-medium text-[var(--primaryText)] hover:opacity-90">
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
