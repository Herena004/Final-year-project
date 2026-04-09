import { useState } from "react";
import "./app.css";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "admin" | "staff" | "hod" | null;
type AuthScreen = "login" | "signup" | "forgot";
type Page =
  | "dashboard" | "users" | "documents" | "leave" | "od-bonafide" | "certificates"
  | "scholarship-first" | "scholarship-bcmbc" | "scholarship-postmatric"
  | "scholarship-reservation" | "scholarship-merit" | "scholarship-feeconcession"
  | "timetable" | "examination" | "settings";

// ─── Seed Data ────────────────────────────────────────────────────────────────
type Doc = { id: number; name: string; type: string; dept: string; date: string; size: string };
const initDocs: Doc[] = [
  { id: 1, name: "Rahul Kumar", type: "Bonafide Certificate", dept: "CSE", date: "2024-01-15", size: "245 KB" },
  { id: 2, name: "Anita Sharma", type: "ID Proof", dept: "ECE", date: "2024-01-18", size: "180 KB" },
  { id: 3, name: "John Doe", type: "Marks Sheet", dept: "MECH", date: "2024-02-01", size: "320 KB" },
  { id: 4, name: "Priya Singh", type: "Transfer Certificate", dept: "CIVIL", date: "2024-02-10", size: "290 KB" },
  { id: 5, name: "Vikram Nair", type: "Bonafide Certificate", dept: "IT", date: "2024-02-14", size: "260 KB" },
];

type LeaveReq = { id: number; name: string; type: string; dept: string; from: string; to: string; days: number; status: string; role: string };
const initLeaves: LeaveReq[] = [
  { id: 1, name: "Priya S.", type: "Medical Leave", dept: "CSE", from: "2024-03-10", to: "2024-03-12", days: 3, status: "pending", role: "Student" },
  { id: 2, name: "Vikram R.", type: "OD Request", dept: "ECE", from: "2024-03-15", to: "2024-03-15", days: 1, status: "pending", role: "Student" },
  { id: 3, name: "Anjali M.", type: "Bonafide Request", dept: "IT", from: "2024-03-16", to: "2024-03-16", days: 1, status: "approved", role: "Student" },
  { id: 4, name: "Dr. Kumar", type: "Casual Leave", dept: "CSE", from: "2024-03-18", to: "2024-03-19", days: 2, status: "approved", role: "Staff" },
  { id: 5, name: "Ravi Shankar", type: "Medical Leave", dept: "MECH", from: "2024-03-20", to: "2024-03-22", days: 3, status: "rejected", role: "Staff" },
];

type SchApp = { id: number; name: string; roll: string; dept: string; income: string; marks: string; status: string };
const scholarshipData: Record<string, { title: string; description: string; eligibility: string; amount: string; applications: SchApp[] }> = {
  "scholarship-first": {
    title: "First Graduate Scholarship",
    description: "Scholarship for first-generation college graduates from Tamil Nadu",
    eligibility: "Family income < ₹2.5 Lakhs, First graduate in family, 60% marks",
    amount: "₹12,000 per year",
    applications: [
      { id: 1, name: "Ramesh P.", roll: "21CS001", dept: "CSE", income: "₹1.8L", marks: "78%", status: "approved" },
      { id: 2, name: "Lakshmi K.", roll: "21EC045", dept: "ECE", income: "₹2.1L", marks: "72%", status: "pending" },
      { id: 3, name: "Murugan S.", roll: "21ME012", dept: "MECH", income: "₹2.3L", marks: "65%", status: "pending" },
    ],
  },
  "scholarship-bcmbc": {
    title: "BC / MBC Scholarship",
    description: "Scholarship for Backward Class and Most Backward Class students",
    eligibility: "BC/MBC community, Family income < ₹5 Lakhs, Valid community certificate",
    amount: "₹10,000 per year",
    applications: [
      { id: 1, name: "Senthil N.", roll: "21CS055", dept: "CSE", income: "₹3.2L", marks: "70%", status: "approved" },
      { id: 2, name: "Geetha M.", roll: "21IT023", dept: "IT", income: "₹4.5L", marks: "68%", status: "pending" },
    ],
  },
  "scholarship-postmatric": {
    title: "Post Matric Scholarship",
    description: "Government of India Post Matric Scholarship for SC/ST students",
    eligibility: "SC/ST community, Income < ₹2.5 Lakhs, Full-time course enrollment",
    amount: "₹15,000 per year + Fee reimbursement",
    applications: [
      { id: 1, name: "Selvi A.", roll: "21CS067", dept: "CSE", income: "₹1.2L", marks: "76%", status: "approved" },
      { id: 2, name: "Kumar D.", roll: "21ME089", dept: "MECH", income: "₹2.0L", marks: "69%", status: "pending" },
    ],
  },
  "scholarship-reservation": {
    title: "7.5% Reservation Scholarship",
    description: "Special scholarship for government school students under 7.5% reservation",
    eligibility: "Studied in government schools, Scored > 50% in +2, Sports/NCC preferred",
    amount: "Full fee waiver",
    applications: [
      { id: 1, name: "Mani K.", roll: "21CS044", dept: "CSE", income: "₹1.5L", marks: "58%", status: "approved" },
      { id: 2, name: "Radha L.", roll: "22ME033", dept: "MECH", income: "₹2.0L", marks: "54%", status: "pending" },
    ],
  },
  "scholarship-merit": {
    title: "Merit Scholarship",
    description: "Scholarship for academically excellent students",
    eligibility: "First class throughout, Scored > 85%, Good conduct",
    amount: "₹5,000 per semester",
    applications: [
      { id: 1, name: "Deepa R.", roll: "21CS099", dept: "CSE", income: "₹6L", marks: "91%", status: "approved" },
      { id: 2, name: "Arjun M.", roll: "21ECE077", dept: "ECE", income: "₹4.5L", marks: "88%", status: "approved" },
    ],
  },
  "scholarship-feeconcession": {
    title: "Fee Concession Scholarship",
    description: "Fee concession for economically weaker students",
    eligibility: "Family income < ₹3 Lakhs, No other scholarship, Min 60% attendance",
    amount: "25–75% fee concession",
    applications: [
      { id: 1, name: "Vinoth K.", roll: "21ME056", dept: "MECH", income: "₹2.8L", marks: "67%", status: "approved" },
      { id: 2, name: "Preethi J.", roll: "22IT067", dept: "IT", income: "₹1.9L", marks: "71%", status: "pending" },
    ],
  },
};

type User = { id: number; name: string; role: string; dept: string; email: string; phone: string; status: string };
const initUsers: User[] = [
  { id: 1, name: "Dr. A. Krishnamurthy", role: "HOD", dept: "CSE", email: "hod.cse@college.edu", phone: "9876543210", status: "active" },
  { id: 2, name: "Prof. S. Venkatesh", role: "Staff", dept: "ECE", email: "venkatesh@college.edu", phone: "9876543211", status: "active" },
  { id: 3, name: "Admin User", role: "Admin", dept: "Administration", email: "admin@college.edu", phone: "9876543212", status: "active" },
  { id: 4, name: "Prof. M. Rajan", role: "Staff", dept: "MECH", email: "rajan@college.edu", phone: "9876543213", status: "inactive" },
];

type Exam = { id: number; subject: string; dept: string; sem: string; date: string; time: string; hall: string; students: number };
const initExams: Exam[] = [
  { id: 1, subject: "Data Structures", dept: "CSE", sem: "3rd", date: "2024-04-15", time: "9:00 AM", hall: "A101", students: 65 },
  { id: 2, subject: "Signals & Systems", dept: "ECE", sem: "4th", date: "2024-04-16", time: "9:00 AM", hall: "B202", students: 58 },
  { id: 3, subject: "Thermodynamics", dept: "MECH", sem: "3rd", date: "2024-04-17", time: "2:00 PM", hall: "C303", students: 72 },
];

const DEPTS = ["CSE", "ECE", "MECH", "IT", "CIVIL"];
const DOC_TYPES = ["Bonafide Certificate", "ID Proof", "Marks Sheet", "Transfer Certificate", "Fee Receipt"];
const LEAVE_TYPES = ["Medical Leave", "Casual Leave", "Emergency Leave", "OD Request", "Bonafide Request", "Casual Leave"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function downloadFile(name: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
type Account = { name: string; email: string; password: string; role: "admin" | "staff" | "hod" };
const BUILT_IN: Account[] = [
  { name: "Admin User", email: "admin@college.edu", password: "admin123", role: "admin" },
  { name: "Staff Member", email: "staff@college.edu", password: "staff123", role: "staff" },
  { name: "Head of Dept", email: "hod@college.edu", password: "hod123", role: "hod" },
];

function AuthPage({ onLogin }: { onLogin: (role: Role, name: string) => void }) {
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [selectedRole, setSelectedRole] = useState<"admin" | "staff" | "hod">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(BUILT_IN);

  const hints: Record<string, string> = { admin: "admin@college.edu / admin123", staff: "staff@college.edu / staff123", hod: "hod@college.edu / hod123" };

  function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    setTimeout(() => {
      const match = accounts.find(a => a.email === email && a.password === password && a.role === selectedRole);
      if (match) { onLogin(match.role, match.name); }
      else { setError("Invalid credentials. Check the hint below."); setLoading(false); }
    }, 700);
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (password !== confirmPwd) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (accounts.find(a => a.email === email)) { setError("Email already registered."); return; }
    setLoading(true);
    setTimeout(() => {
      setAccounts(prev => [...prev, { name, email, password, role: selectedRole }]);
      setSuccess("Account created! You can now sign in.");
      setScreen("login"); setLoading(false); setPassword(""); setConfirmPwd("");
    }, 700);
  }

  function handleForgot(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    setTimeout(() => {
      const match = accounts.find(a => a.email === email);
      if (match) { setSuccess(`Password reset link sent to ${email}. (Demo: your password is "${match.password}")`); }
      else { setError("No account found with that email."); }
      setLoading(false);
    }, 700);
  }

  function generate() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#";
    let pwd = "";
    for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pwd); setConfirmPwd(pwd);
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">🏛️</div>
          <div className="auth-brand-name">EduAdmin Portal</div>
          <div className="auth-brand-sub">Secure Academic Management</div>
        </div>
        <div className="auth-features">
          {[
            ["📁", "Document Management & Download"],
            ["📋", "Leave & Certificate Approvals"],
            ["🎓", "Scholarship Module"],
            ["📊", "Performance Prediction"],
            ["🔒", "Role-Based Secure Access"],
          ].map(([icon, text]) => (
            <div className="auth-feature" key={text}>
              <span className="auth-feature-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          {screen === "login" && (
            <>
              <div className="auth-title">Welcome back 👋</div>
              <div className="auth-subtitle">Sign in to your account to continue</div>
              <div className="role-tabs">
                {(["admin", "staff", "hod"] as const).map(r => (
                  <button key={r} className={`role-tab ${selectedRole === r ? "active" : ""}`}
                    onClick={() => { setSelectedRole(r); setError(""); setEmail(""); setPassword(""); }}>
                    <span>{r === "admin" ? "🛡️" : r === "staff" ? "👨‍💼" : "🎓"}</span>
                    <span>{r.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="auth-error">{error}</div>}
              <div className="alert alert-info" style={{ marginBottom: 16 }}>Hint: {hints[selectedRole]}</div>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrap">
                    <span className="input-icon">✉️</span>
                    <input type="email" className="form-input" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">🔒</span>
                    <input type="password" className="form-input" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="auth-link" style={{ textAlign: "right", marginTop: -8, marginBottom: 16 }}>
                  <a onClick={() => { setScreen("forgot"); setError(""); setSuccess(""); }}>Forgot password?</a>
                </div>
                <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Sign In"}
                </button>
              </form>
              <div className="divider"><span className="divider-text">OR</span></div>
              <div className="auth-link" style={{ textAlign: "center" }}>
                Don't have an account? <a onClick={() => { setScreen("signup"); setError(""); setSuccess(""); }}>Sign Up</a>
              </div>
            </>
          )}

          {screen === "signup" && (
            <>
              <div className="auth-title">Create account 🎉</div>
              <div className="auth-subtitle">Register as a college portal user</div>
              <div className="role-tabs">
                {(["admin", "staff", "hod"] as const).map(r => (
                  <button key={r} className={`role-tab ${selectedRole === r ? "active" : ""}`}
                    onClick={() => { setSelectedRole(r); setError(""); }}>
                    <span>{r === "admin" ? "🛡️" : r === "staff" ? "👨‍💼" : "🎓"}</span>
                    <span>{r.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleSignUp}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input className="form-input" placeholder="Enter full name" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrap">
                    <span className="input-icon">✉️</span>
                    <input type="email" className="form-input" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">🔒</span>
                    <input type="password" className="form-input" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">🔒</span>
                    <input type="password" className="form-input" placeholder="Confirm password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
                  </div>
                </div>
                <button type="button" className="btn btn-outline btn-sm" style={{ marginBottom: 14 }} onClick={generate}>
                  ⚡ Generate Strong Password
                </button>
                <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Create Account"}
                </button>
              </form>
              <div className="auth-link" style={{ textAlign: "center", marginTop: 12 }}>
                Already have an account? <a onClick={() => { setScreen("login"); setError(""); }}>Sign In</a>
              </div>
            </>
          )}

          {screen === "forgot" && (
            <>
              <div className="auth-title">Forgot password 🔑</div>
              <div className="auth-subtitle">Enter your email to reset your password</div>
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleForgot}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrap">
                    <span className="input-icon">✉️</span>
                    <input type="email" className="form-input" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Send Reset Link"}
                </button>
              </form>
              <div className="auth-link" style={{ textAlign: "center", marginTop: 12 }}>
                <a onClick={() => { setScreen("login"); setError(""); setSuccess(""); }}>← Back to Sign In</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const NAV = [
  { label: "User Management", icon: "👥", key: "user-mgmt", children: [
    { label: "Manage Users", icon: "👤", page: "users" as Page },
  ]},
  { label: "Document Management", icon: "📁", key: "doc-mgmt", children: [
    { label: "Upload & Search", icon: "📄", page: "documents" as Page },
  ]},
  { label: "Leave & Certificates", icon: "📋", key: "leave-cert", children: [
    { label: "Leave Requests", icon: "🗓️", page: "leave" as Page },
    { label: "OD / Bonafide", icon: "📝", page: "od-bonafide" as Page },
    { label: "Certificates", icon: "🏅", page: "certificates" as Page },
  ]},
  { label: "Scholarship Module", icon: "🎓", key: "scholarship", children: [
    { label: "First Graduate", icon: "⭐", page: "scholarship-first" as Page },
    { label: "BC / MBC", icon: "📜", page: "scholarship-bcmbc" as Page },
    { label: "Post Matric", icon: "📜", page: "scholarship-postmatric" as Page },
    { label: "7.5% Reservation", icon: "📜", page: "scholarship-reservation" as Page },
    { label: "Merit", icon: "🏆", page: "scholarship-merit" as Page },
    { label: "Fee Concession", icon: "💰", page: "scholarship-feeconcession" as Page },
  ]},
  { label: "Timetable", icon: "📅", key: "timetable", children: [
    { label: "Auto Generator", icon: "⚙️", page: "timetable" as Page },
  ]},
  { label: "Examination", icon: "📊", key: "examination", children: [
    { label: "Manage Exams", icon: "📝", page: "examination" as Page },
  ]},
  { label: "Settings", icon: "⚙️", key: "settings", children: [
    { label: "Preferences", icon: "🛠️", page: "settings" as Page },
  ]},
];

function Sidebar({ activePage, onNavigate, role, name, onLogout, collapsed, setCollapsed }: any) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "user-mgmt": true, "doc-mgmt": true, "leave-cert": true, "scholarship": false, "timetable": false, "examination": false, "settings": false });
  function toggle(key: string) { setOpenGroups(p => ({ ...p, [key]: !p[key] })); }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <span className="brand-icon">🏛️</span>
            <div>
              <div className="brand-name">EduAdmin</div>
              <div className="brand-role">{role?.toUpperCase()} PANEL</div>
            </div>
          </div>
        )}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>{collapsed ? "▶" : "◀"}</button>
      </div>
      <div className="sidebar-body">
        <div className={`nav-single ${activePage === "dashboard" ? "active" : ""}`} onClick={() => onNavigate("dashboard")}>
          <span className="nav-icon">📊</span>
          {!collapsed && <span className="nav-label">Dashboard</span>}
        </div>
        {NAV.map(item => (
          <div key={item.key} className="nav-group">
            <div className="nav-group-header" onClick={() => toggle(item.key)}>
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  <span className={`nav-chevron ${openGroups[item.key] ? "open" : ""}`}>▾</span>
                </>
              )}
            </div>
            {!collapsed && openGroups[item.key] && (
              <div className="nav-children">
                {item.children.map((c: any) => (
                  <div key={c.page} className={`nav-child ${activePage === c.page ? "active" : ""}`} onClick={() => onNavigate(c.page)}>
                    <span className="nav-child-icon">{c.icon}</span>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{role === "admin" ? "🛡️" : role === "staff" ? "👨‍💼" : "🎓"}</div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{name}</div>
              <div className="user-role">{role?.toUpperCase()}</div>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={onLogout}>🚪{!collapsed && " Logout"}</button>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, change }: any) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="stat-icon" style={{ background: color + "18", color }}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && <div className="stat-change">{change}</div>}
      </div>
    </div>
  );
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="mini-chart" style={{ flex: 1 }}>
      <div className="mini-chart-bars">
        {data.map((v, i) => (
          <div key={i} className="mini-bar-wrap">
            <div className="mini-bar" style={{ height: `${(v / max) * 100}%`, background: color }} title={String(v)} />
          </div>
        ))}
      </div>
      <div className="mini-chart-months">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let cum = 0;
  const sz = 110, r = 44, cx = 55, cy = 55;
  function pt(angle: number, radius: number) {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }
  const arcs = segments.map(seg => {
    const start = (cum / total) * 360;
    cum += seg.value;
    const end = (cum / total) * 360;
    const large = end - start > 180 ? 1 : 0;
    const s = pt(start, r), e = pt(end, r);
    return { ...seg, path: `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z` };
  });
  return (
    <div className="donut-chart">
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} />)}
        <circle cx={cx} cy={cy} r={r - 16} fill="white" />
      </svg>
      <div className="donut-legend">
        {segments.map((s, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: s.color }} />
            <span>{s.label}: {s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ role }: { role: Role }) {
  const [marks, setMarks] = useState("72, 68, 55, 60, 75, 75");
  const [attendance, setAttendance] = useState("82%");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [leaves, setLeaves] = useState(initLeaves.slice(0, 3));

  function predict() {
    const arr = marks.split(",").map(m => parseFloat(m.trim())).filter(n => !isNaN(n));
    if (!arr.length) return;
    const avg = arr.reduce((s, x) => s + x, 0) / arr.length;
    const att = parseFloat(attendance);
    if (avg < 60 || att < 75) setPrediction("At Risk");
    else if (avg >= 80 && att >= 85) setPrediction("Excellent");
    else setPrediction("Average");
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">📊 Dashboard</div>
          <div className="page-subtitle">Welcome back! Here's your college overview.</div>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard icon="👨‍🎓" label="Total Students" value="1,254" color="#2563eb" change="↑ 12 this month" />
        <StatCard icon="📋" label="Pending Leaves" value={leaves.filter(l => l.status === "pending").length} color="#d97706" change="Needs attention" />
        <StatCard icon="🎓" label="Scholarships Applied" value="432" color="#16a34a" change="↑ 28 this semester" />
        <StatCard icon="⚠️" label="Low Attendance" value="24" color="#dc2626" change="Requires action" />
      </div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">🤖 Student Performance Prediction</span></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Past Marks (comma separated)</label>
              <input className="form-input no-icon" value={marks} onChange={e => setMarks(e.target.value)} placeholder="e.g. 72, 68, 55, 60, 75" />
            </div>
            <div className="form-group">
              <label className="form-label">Attendance Percentage</label>
              <input className="form-input no-icon" value={attendance} onChange={e => setAttendance(e.target.value)} placeholder="e.g. 82%" />
            </div>
            <button className="btn btn-primary" onClick={predict}>Predict Performance</button>
            {prediction && (
              <div className={`prediction-result ${prediction === "At Risk" ? "risk" : prediction === "Excellent" ? "excellent" : "average"}`}>
                Result: <strong>{prediction}</strong>
                {prediction === "At Risk" && " — Student needs academic counseling."}
                {prediction === "Excellent" && " — Student is performing exceptionally."}
                {prediction === "Average" && " — Student is on track. Keep monitoring."}
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">📈 Attendance Analytics</span></div>
          <div className="card-body">
            <div className="quick-stats-grid">
              <MiniChart data={[72, 68, 75, 80, 78, 85]} color="#2563eb" />
              <DonutChart segments={[
                { value: 40, color: "#2563eb", label: "CSE" },
                { value: 25, color: "#16a34a", label: "ECE" },
                { value: 20, color: "#d97706", label: "MECH" },
                { value: 15, color: "#dc2626", label: "IT" },
              ]} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">📁 Recent Documents</span></div>
          <div className="card-body p-0">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Type</th><th>Action</th></tr></thead>
              <tbody>
                {initDocs.slice(0, 4).map(doc => (
                  <tr key={doc.id}>
                    <td className="font-medium">{doc.name}</td>
                    <td className="text-muted">{doc.type}</td>
                    <td>
                      <button className="btn btn-xs btn-primary" onClick={() => downloadFile(`${doc.name}.txt`, `Document: ${doc.name}\nType: ${doc.type}\nDept: ${doc.dept}\nDate: ${doc.date}`)}>
                        ⬇️ Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">📋 Leave Approvals</span></div>
          <div className="card-body p-0">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Type</th><th>Action</th></tr></thead>
              <tbody>
                {leaves.map(lv => (
                  <tr key={lv.id}>
                    <td className="font-medium">{lv.name}</td>
                    <td><span className="badge">{lv.type}</span></td>
                    <td>
                      {lv.status === "pending"
                        ? <div className="action-btns">
                            <button className="btn btn-xs btn-success" onClick={() => setLeaves(p => p.map(l => l.id === lv.id ? { ...l, status: "approved" } : l))}>Approve</button>
                            <button className="btn btn-xs btn-danger" onClick={() => setLeaves(p => p.map(l => l.id === lv.id ? { ...l, status: "rejected" } : l))}>Reject</button>
                          </div>
                        : <span className={`status-badge ${lv.status}`}>{lv.status}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Documents ────────────────────────────────────────────────────────────────
function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>(initDocs);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editDoc, setEditDoc] = useState<Doc | null>(null);
  const [form, setForm] = useState({ name: "", type: DOC_TYPES[0], dept: DEPTS[0] });
  const [success, setSuccess] = useState("");

  const types = ["All", ...DOC_TYPES];
  const depts = ["All", ...DEPTS];
  const filtered = docs.filter(d => {
    const s = d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    const t = filterType === "All" || d.type === filterType;
    const dept = filterDept === "All" || d.dept === filterDept;
    return s && t && dept;
  });

  function openAdd() { setForm({ name: "", type: DOC_TYPES[0], dept: DEPTS[0] }); setEditDoc(null); setModal("add"); }
  function openEdit(doc: Doc) { setForm({ name: doc.name, type: doc.type, dept: doc.dept }); setEditDoc(doc); setModal("edit"); }

  function handleSave() {
    if (!form.name) return;
    if (modal === "edit" && editDoc) {
      setDocs(p => p.map(d => d.id === editDoc.id ? { ...d, ...form } : d));
      setSuccess("Document updated successfully!");
    } else {
      const newDoc: Doc = { id: Date.now(), name: form.name, type: form.type, dept: form.dept, date: new Date().toISOString().slice(0, 10), size: "200 KB" };
      setDocs(p => [newDoc, ...p]);
      setSuccess("Document added successfully!");
    }
    setModal(null);
    setTimeout(() => setSuccess(""), 3000);
  }

  function handleDelete(id: number) {
    setDocs(p => p.filter(d => d.id !== id));
    setSuccess("Document deleted."); setTimeout(() => setSuccess(""), 2000);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div><div className="page-title">📁 Document Management</div></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Document</button>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Documents ({filtered.length})</span>
          <div className="filter-row">
            <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="form-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              {depts.map(d => <option key={d}>{d}</option>)}
            </select>
            <input className="form-input no-icon sm" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card-body p-0">
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Type</th><th>Dept</th><th>Date</th><th>Size</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr key={doc.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td className="font-medium">{doc.name}</td>
                  <td><span className="badge">{doc.type}</span></td>
                  <td><span className="badge accent">{doc.dept}</span></td>
                  <td className="text-muted">{doc.date}</td>
                  <td className="text-muted">{doc.size}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-xs btn-ghost" onClick={() => openEdit(doc)}>✏️ Edit</button>
                      <button className="btn btn-xs btn-primary" onClick={() => downloadFile(`${doc.name}.txt`, `Document: ${doc.name}\nType: ${doc.type}\nDept: ${doc.dept}\nDate: ${doc.date}`)}>⬇️</button>
                      <button className="btn btn-xs btn-danger" onClick={() => handleDelete(doc.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="empty-row">No documents found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add Document" : "Edit Document"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></>}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input no-icon" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Student/Staff name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Document Type</label>
              <select className="form-select" style={{ width: "100%" }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-select" style={{ width: "100%" }} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Leave Page ───────────────────────────────────────────────────────────────
function LeavePage({ type }: { type: "leave" | "od-bonafide" | "certificates" }) {
  const [reqs, setReqs] = useState<LeaveReq[]>(initLeaves);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editReq, setEditReq] = useState<LeaveReq | null>(null);
  const [success, setSuccess] = useState("");
  const leaveTypesByPage: Record<string, string[]> = {
    leave: ["Medical Leave", "Casual Leave", "Emergency Leave"],
    "od-bonafide": ["OD Request", "Bonafide Request"],
    certificates: ["Bonafide Certificate", "Transfer Certificate", "Course Completion"],
  };
  const ltypes = leaveTypesByPage[type];
  const blank = { name: "", type: ltypes[0], dept: DEPTS[0], from: "", to: "", days: 1, status: "pending", role: "Student" };
  const [form, setForm] = useState<any>(blank);

  const filtered = type === "leave"
    ? reqs.filter(r => ["Medical Leave", "Casual Leave", "Emergency Leave"].includes(r.type))
    : type === "od-bonafide"
    ? reqs.filter(r => ["OD Request", "Bonafide Request"].includes(r.type))
    : reqs;

  const titles = { leave: "Leave Requests", "od-bonafide": "OD / Bonafide Requests", certificates: "Certificate Requests" };

  function openEdit(req: LeaveReq) { setForm({ ...req }); setEditReq(req); setModal("edit"); }
  function openAdd() { setForm({ ...blank, type: ltypes[0] }); setEditReq(null); setModal("add"); }

  function handleSave() {
    if (!form.name || !form.from) return;
    if (modal === "edit" && editReq) {
      setReqs(p => p.map(r => r.id === editReq.id ? { ...r, ...form } : r));
      setSuccess("Request updated!");
    } else {
      setReqs(p => [{ ...form, id: Date.now() }, ...p]);
      setSuccess("Request added!");
    }
    setModal(null); setTimeout(() => setSuccess(""), 2500);
  }

  function action(id: number, s: string) { setReqs(p => p.map(r => r.id === id ? { ...r, status: s } : r)); }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">📋 {titles[type]}</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Request</button>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="stats-row">
        {["pending", "approved", "rejected"].map(s => (
          <div key={s} className={`mini-stat ${s}`}>
            <div className="mini-stat-value">{reqs.filter(r => r.status === s).length}</div>
            <div className="mini-stat-label">{s}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Type</th><th>Dept</th><th>Role</th><th>From</th><th>To</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {(filtered.length ? filtered : reqs).map(req => (
                <tr key={req.id}>
                  <td className="font-medium">{req.name}</td>
                  <td><span className="badge">{req.type}</span></td>
                  <td><span className="badge accent">{req.dept}</span></td>
                  <td className="text-muted">{req.role}</td>
                  <td className="text-muted">{req.from}</td>
                  <td className="text-muted">{req.to}</td>
                  <td><span className={`status-badge ${req.status}`}>{req.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-xs btn-ghost" onClick={() => openEdit(req)}>✏️ Edit</button>
                      {req.status === "pending"
                        ? <><button className="btn btn-xs btn-success" onClick={() => action(req.id, "approved")}>Approve</button>
                           <button className="btn btn-xs btn-danger" onClick={() => action(req.id, "rejected")}>Reject</button></>
                        : <button className="btn btn-xs btn-ghost" onClick={() => action(req.id, "pending")}>Reset</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add Request" : "Edit Request"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></>}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input no-icon" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" style={{ width: "100%" }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {ltypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dept</label>
              <select className="form-select" style={{ width: "100%" }} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" style={{ width: "100%" }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option>Student</option><option>Staff</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">From</label>
              <input type="date" className="form-input no-icon" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">To</label>
              <input type="date" className="form-input no-icon" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Scholarship ──────────────────────────────────────────────────────────────
function ScholarshipPage({ page }: { page: keyof typeof scholarshipData }) {
  const data = scholarshipData[page];
  const [apps, setApps] = useState<SchApp[]>(data.applications);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editApp, setEditApp] = useState<SchApp | null>(null);
  const [form, setForm] = useState({ name: "", roll: "", dept: DEPTS[0], income: "", marks: "" });
  const [success, setSuccess] = useState("");

  function openAdd() { setForm({ name: "", roll: "", dept: DEPTS[0], income: "", marks: "" }); setEditApp(null); setModal("add"); }
  function openEdit(app: SchApp) { setForm({ name: app.name, roll: app.roll, dept: app.dept, income: app.income, marks: app.marks }); setEditApp(app); setModal("edit"); }

  function handleSave() {
    if (!form.name || !form.roll) return;
    if (modal === "edit" && editApp) {
      setApps(p => p.map(a => a.id === editApp.id ? { ...a, ...form } : a));
      setSuccess("Application updated!");
    } else {
      setApps(p => [...p, { id: Date.now(), ...form, status: "pending" }]);
      setSuccess("Application submitted!");
    }
    setModal(null); setTimeout(() => setSuccess(""), 2500);
  }

  function action(id: number, s: string) { setApps(p => p.map(a => a.id === id ? { ...a, status: s } : a)); }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">🎓 {data.title}</div>
        <button className="btn btn-primary" onClick={openAdd}>+ New Application</button>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="scholarship-info-card">
        <div className="info-item"><span className="info-icon">📝</span><div><div className="info-label">Description</div><div className="info-value">{data.description}</div></div></div>
        <div className="info-item"><span className="info-icon">✅</span><div><div className="info-label">Eligibility</div><div className="info-value">{data.eligibility}</div></div></div>
        <div className="info-item"><span className="info-icon">💰</span><div><div className="info-label">Amount</div><div className="info-value highlight">{data.amount}</div></div></div>
      </div>
      <div className="stats-row">
        {["pending", "approved", "rejected"].map(s => (
          <div key={s} className={`mini-stat ${s}`}>
            <div className="mini-stat-value">{apps.filter(a => a.status === s).length}</div>
            <div className="mini-stat-label">{s}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Roll No.</th><th>Dept</th><th>Income</th><th>Marks</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id}>
                  <td className="font-medium">{app.name}</td>
                  <td className="text-muted">{app.roll}</td>
                  <td><span className="badge accent">{app.dept}</span></td>
                  <td className="text-muted">{app.income}</td>
                  <td className="text-muted">{app.marks}</td>
                  <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-xs btn-ghost" onClick={() => openEdit(app)}>✏️ Edit</button>
                      {app.status === "pending"
                        ? <><button className="btn btn-xs btn-success" onClick={() => action(app.id, "approved")}>Approve</button>
                           <button className="btn btn-xs btn-danger" onClick={() => action(app.id, "rejected")}>Reject</button></>
                        : <button className="btn btn-xs btn-ghost" onClick={() => action(app.id, "pending")}>Reset</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
              {apps.length === 0 && <tr><td colSpan={7} className="empty-row">No applications yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "New Application" : "Edit Application"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></>}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Student Name</label>
              <input className="form-input no-icon" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input className="form-input no-icon" value={form.roll} onChange={e => setForm({ ...form, roll: e.target.value })} placeholder="e.g. 22CS001" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-select" style={{ width: "100%" }} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Family Income</label>
              <input className="form-input no-icon" value={form.income} onChange={e => setForm({ ...form, income: e.target.value })} placeholder="e.g. ₹2.5L" />
            </div>
            <div className="form-group">
              <label className="form-label">Marks %</label>
              <input className="form-input no-icon" value={form.marks} onChange={e => setForm({ ...form, marks: e.target.value })} placeholder="e.g. 78%" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Users Page ───────────────────────────────────────────────────────────────
function UsersPage({ role }: { role: Role }) {
  const [users, setUsers] = useState<User[]>(initUsers);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", role: "Staff", dept: DEPTS[0], email: "", phone: "", status: "active" });
  const [success, setSuccess] = useState("");

  function openAdd() { setForm({ name: "", role: "Staff", dept: DEPTS[0], email: "", phone: "", status: "active" }); setEditUser(null); setModal("add"); }
  function openEdit(u: User) { setForm({ name: u.name, role: u.role, dept: u.dept, email: u.email, phone: u.phone, status: u.status }); setEditUser(u); setModal("edit"); }

  function handleSave() {
    if (!form.name || !form.email) return;
    if (modal === "edit" && editUser) {
      setUsers(p => p.map(u => u.id === editUser.id ? { ...u, ...form } : u));
      setSuccess("User updated!");
    } else {
      setUsers(p => [...p, { id: Date.now(), ...form }]);
      setSuccess("User added!");
    }
    setModal(null); setTimeout(() => setSuccess(""), 2500);
  }

  function handleDelete(id: number) { setUsers(p => p.filter(u => u.id !== id)); setSuccess("User removed."); setTimeout(() => setSuccess(""), 2000); }

  const roleIcon = (r: string) => r === "Admin" ? "🛡️" : r === "HOD" ? "🎓" : "👨‍💼";

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">👥 User Management</div>
        {role === "admin" && <button className="btn btn-primary" onClick={openAdd}>+ Add User</button>}
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <div className="card-body p-0">
          {users.map(u => (
            <div key={u.id} className="user-card">
              <div className="user-card-avatar">{roleIcon(u.role)}</div>
              <div className="user-card-info">
                <div className="user-card-name">{u.name}</div>
                <div className="user-card-role">{u.role} · {u.dept} · {u.email} · {u.phone}</div>
              </div>
              <span className={`status-badge ${u.status === "active" ? "approved" : "rejected"}`}>{u.status}</span>
              {role === "admin" && (
                <div className="user-card-actions">
                  <button className="btn btn-xs btn-ghost" onClick={() => openEdit(u)}>✏️ Edit</button>
                  <button className="btn btn-xs btn-danger" onClick={() => handleDelete(u.id)}>🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add User" : "Edit User"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></>}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input no-icon" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" style={{ width: "100%" }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option>Admin</option><option>Staff</option><option>HOD</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-select" style={{ width: "100%" }} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                {[...DEPTS, "Administration"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input no-icon" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@college.edu" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input no-icon" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" style={{ width: "100%" }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Timetable ────────────────────────────────────────────────────────────────
function TimetablePage() {
  const [dept, setDept] = useState("CSE");
  const [sem, setSem] = useState("3rd");
  const [table, setTable] = useState<string[][] | null>(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4"];
  const subjects: Record<string, string[]> = {
    CSE: ["DS", "DBMS", "OS", "CN", "SE", "ML", "WEB"],
    ECE: ["SS", "EC", "DSP", "VLSI", "EMF", "CN", "ES"],
    MECH: ["TD", "FM", "ME", "MFG", "DM", "HT", "CAD"],
    IT: ["WEB", "SE", "DBMS", "AI", "CN", "IoT", "SEC"],
    CIVIL: ["SM", "FM", "GE", "TE", "SD", "HE", "CM"],
  };

  function generate() {
    const subjs = subjects[dept] || subjects["CSE"];
    const t = days.map(() => periods.map((_, pi) => pi === 3 ? "LUNCH" : subjs[Math.floor(Math.random() * subjs.length)]));
    setTable(t);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">📅 Timetable Generator</div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="filter-row" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ margin: 0, flex: 1, maxWidth: 200 }}>
              <label className="form-label">Department</label>
              <select className="form-select" style={{ width: "100%" }} value={dept} onChange={e => { setDept(e.target.value); setTable(null); }}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0, flex: 1, maxWidth: 180 }}>
              <label className="form-label">Semester</label>
              <select className="form-select" style={{ width: "100%" }} value={sem} onChange={e => { setSem(e.target.value); setTable(null); }}>
                {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <button className="btn btn-primary" onClick={generate}>⚙️ Generate Timetable</button>
            </div>
          </div>
          {table && (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th>Day / Period</th>
                    {periods.map(p => <th key={p}>{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, di) => (
                    <tr key={day}>
                      <td className="font-medium">{day}</td>
                      {table[di].map((subj, pi) => (
                        <td key={pi} className={`timetable-cell ${subj === "LUNCH" ? "lunch" : ""}`}>{subj}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!table && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)" }}>Click "Generate Timetable" to create a schedule for {dept} — {sem} Semester</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Examination ──────────────────────────────────────────────────────────────
function ExaminationPage() {
  const [exams, setExams] = useState<Exam[]>(initExams);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [form, setForm] = useState({ subject: "", dept: DEPTS[0], sem: "3rd", date: "", time: "9:00 AM", hall: "", students: 60 });
  const [success, setSuccess] = useState("");

  function openAdd() { setForm({ subject: "", dept: DEPTS[0], sem: "3rd", date: "", time: "9:00 AM", hall: "", students: 60 }); setEditExam(null); setModal("add"); }
  function openEdit(e: Exam) { setForm({ subject: e.subject, dept: e.dept, sem: e.sem, date: e.date, time: e.time, hall: e.hall, students: e.students }); setEditExam(e); setModal("edit"); }

  function handleSave() {
    if (!form.subject) return;
    if (modal === "edit" && editExam) {
      setExams(p => p.map(e => e.id === editExam.id ? { ...e, ...form } : e));
      setSuccess("Exam updated!");
    } else {
      setExams(p => [...p, { id: Date.now(), ...form }]);
      setSuccess("Exam scheduled!");
    }
    setModal(null); setTimeout(() => setSuccess(""), 2500);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">📊 Examination Management</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Schedule Exam</button>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <div className="card-body p-0">
          <table className="data-table">
            <thead><tr><th>#</th><th>Subject</th><th>Dept</th><th>Sem</th><th>Date</th><th>Time</th><th>Hall</th><th>Students</th><th>Actions</th></tr></thead>
            <tbody>
              {exams.map((exam, i) => (
                <tr key={exam.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td className="font-medium">{exam.subject}</td>
                  <td><span className="badge accent">{exam.dept}</span></td>
                  <td className="text-muted">{exam.sem}</td>
                  <td className="text-muted">{exam.date}</td>
                  <td className="text-muted">{exam.time}</td>
                  <td className="text-muted">{exam.hall}</td>
                  <td className="text-muted">{exam.students}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-xs btn-ghost" onClick={() => openEdit(exam)}>✏️ Edit</button>
                      <button className="btn btn-xs btn-primary" onClick={() => downloadFile(`${exam.subject}.txt`, `Exam: ${exam.subject}\nDept: ${exam.dept}\nDate: ${exam.date}\nHall: ${exam.hall}\nStudents: ${exam.students}`)}>⬇️ Export</button>
                      <button className="btn btn-xs btn-danger" onClick={() => setExams(p => p.filter(e => e.id !== exam.id))}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Schedule Exam" : "Edit Exam"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></>}>
          <div className="form-group">
            <label className="form-label">Subject Name</label>
            <input className="form-input no-icon" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Data Structures" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-select" style={{ width: "100%" }} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <select className="form-select" style={{ width: "100%" }} value={form.sem} onChange={e => setForm({ ...form, sem: e.target.value })}>
                {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input no-icon" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input className="form-input no-icon" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 9:00 AM" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hall No.</label>
              <input className="form-input no-icon" value={form.hall} onChange={e => setForm({ ...form, hall: e.target.value })} placeholder="e.g. A101" />
            </div>
            <div className="form-group">
              <label className="form-label">No. of Students</label>
              <input type="number" className="form-input no-icon" value={form.students} onChange={e => setForm({ ...form, students: Number(e.target.value) })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsPage() {
  const [college, setCollege] = useState({ name: "Sri Venkateswara College of Engineering", email: "admin@svce.ac.in", phone: "+91 44 2715 5000", address: "Pennalur, Sriperumbudur, Chennai - 602 117" });
  const [prefs, setPrefs] = useState({ notifications: true, emailAlerts: true, autoApprove: false, showHints: true });
  const [saved, setSaved] = useState(false);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500); }

  return (
    <div className="page">
      <div className="page-header"><div className="page-title">⚙️ Settings</div></div>
      {saved && <div className="alert alert-success">Settings saved successfully!</div>}
      <div className="settings-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">🏛️ College Information</span></div>
          <div className="card-body">
            {[
              { label: "College Name", key: "name", placeholder: "College name" },
              { label: "Admin Email", key: "email", placeholder: "email@college.edu" },
              { label: "Phone", key: "phone", placeholder: "Phone number" },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input className="form-input no-icon" value={(college as any)[f.key]} onChange={e => setCollege({ ...college, [f.key]: e.target.value })} placeholder={f.placeholder} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-input no-icon" rows={3} value={college.address} onChange={e => setCollege({ ...college, address: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={save}>Save Changes</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">🔔 Preferences</span></div>
          <div className="card-body">
            {[
              { key: "notifications", label: "Push Notifications", desc: "Get alerts for leave requests and approvals" },
              { key: "emailAlerts", label: "Email Alerts", desc: "Receive important updates via email" },
              { key: "autoApprove", label: "Auto-Approve Leaves", desc: "Automatically approve standard leave requests" },
              { key: "showHints", label: "Show Login Hints", desc: "Display credential hints on login screen" },
            ].map(p => (
              <div className="pref-item" key={p.key}>
                <div><div className="pref-label">{p.label}</div><div className="pref-desc">{p.desc}</div></div>
                <label className="toggle">
                  <input type="checkbox" checked={(prefs as any)[p.key]} onChange={e => setPrefs({ ...prefs, [p.key]: e.target.checked })} />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<Role>(null);
  const [userName, setUserName] = useState("");
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  if (!role) return <AuthPage onLogin={(r, n) => { setRole(r); setUserName(n); setActivePage("dashboard"); }} />;

  function renderPage() {
    switch (activePage) {
      case "dashboard": return <Dashboard role={role} />;
      case "users": return <UsersPage role={role} />;
      case "documents": return <DocumentsPage />;
      case "leave": return <LeavePage type="leave" />;
      case "od-bonafide": return <LeavePage type="od-bonafide" />;
      case "certificates": return <LeavePage type="certificates" />;
      case "scholarship-first":
      case "scholarship-bcmbc":
      case "scholarship-postmatric":
      case "scholarship-reservation":
      case "scholarship-merit":
      case "scholarship-feeconcession":
        return <ScholarshipPage page={activePage as keyof typeof scholarshipData} />;
      case "timetable": return <TimetablePage />;
      case "examination": return <ExaminationPage />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard role={role} />;
    }
  }

  const pageName = activePage === "dashboard" ? "Dashboard" : activePage.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={setActivePage} role={role} name={userName}
        onLogout={() => { setRole(null); setUserName(""); }} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="main-content">
        <div className="topbar">
          <div className="breadcrumb">{pageName}</div>
          <div className="topbar-right">
            <div className="topbar-badge"><span>🔔</span><span className="badge-dot" /></div>
            <div className="topbar-user">
              <span>{role === "admin" ? "🛡️" : role === "staff" ? "👨‍💼" : "🎓"}</span>
              <span>{userName}</span>
            </div>
          </div>
        </div>
        <div className="page-content">{renderPage()}</div>
      </main>
    </div>
  );
}
