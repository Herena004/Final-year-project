import { useState, useEffect, useRef } from "react";
import "./app.css";

type Role = "admin" | "staff" | "hod" | null;
type Page =
  | "dashboard"
  | "users"
  | "documents"
  | "leave"
  | "od-bonafide"
  | "certificates"
  | "scholarship-first"
  | "scholarship-bcmbc"
  | "scholarship-postmatric"
  | "scholarship-reservation"
  | "scholarship-merit"
  | "scholarship-feeconcession"
  | "timetable"
  | "examination"
  | "settings";

const COLORS = {
  dark: "#1e2a3a",
  darker: "#162030",
  sidebar: "#1a2535",
  accent: "#2196f3",
  accentDark: "#1565c0",
  success: "#4caf50",
  warning: "#ff9800",
  danger: "#f44336",
  text: "#e0e6f0",
  textMuted: "#8a9bbf",
  cardBg: "#243447",
  border: "#2d3f55",
  white: "#ffffff",
};

function LoginPage({ onLogin }: { onLogin: (role: Role) => void }) {
  const [selectedRole, setSelectedRole] = useState<"admin" | "staff" | "hod">("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const credentials: Record<string, { user: string; pass: string }> = {
    admin: { user: "admin", pass: "admin123" },
    staff: { user: "staff", pass: "staff123" },
    hod: { user: "hod", pass: "hod123" },
  };

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const cred = credentials[selectedRole];
      if (username === cred.user && password === cred.pass) {
        onLogin(selectedRole);
      } else {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
      }
    }, 800);
  }

  const roleLabels = { admin: "Administrator", staff: "Staff Member", hod: "Head of Department" };
  const roleIcons = { admin: "🛡️", staff: "👨‍💼", hod: "🎓" };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-shape shape1" />
        <div className="login-shape shape2" />
        <div className="login-shape shape3" />
      </div>
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">🏛️</span>
          </div>
          <h1 className="login-title">College Admin Portal</h1>
          <p className="login-subtitle">Secure Academic Management System</p>
        </div>
        <div className="role-tabs">
          {(["admin", "staff", "hod"] as const).map((r) => (
            <button
              key={r}
              className={`role-tab ${selectedRole === r ? "active" : ""}`}
              onClick={() => { setSelectedRole(r); setError(""); setUsername(""); setPassword(""); }}
            >
              <span>{roleIcons[r]}</span>
              <span>{r.toUpperCase()}</span>
            </button>
          ))}
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-subtitle">{roleIcons[selectedRole]} Login as {roleLabels[selectedRole]}</div>
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                className="form-input"
                placeholder={`Enter ${selectedRole} username`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-hint">Hint: {credentials[selectedRole].user}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-hint">Hint: {credentials[selectedRole].pass}</div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>
        <div className="login-footer">
          <span>© 2024 College Administration System. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}

const documents = [
  { id: 1, name: "Rahul Kumar", type: "Bonafide Certificate", dept: "CSE", date: "2024-01-15", size: "245 KB" },
  { id: 2, name: "Anita Sharma", type: "ID Proof", dept: "ECE", date: "2024-01-18", size: "180 KB" },
  { id: 3, name: "John Doe", type: "Marks Sheet", dept: "MECH", date: "2024-02-01", size: "320 KB" },
  { id: 4, name: "Priya Singh", type: "Transfer Certificate", dept: "CIVIL", date: "2024-02-10", size: "290 KB" },
  { id: 5, name: "Vikram Nair", type: "Bonafide Certificate", dept: "IT", date: "2024-02-14", size: "260 KB" },
  { id: 6, name: "Meena Patel", type: "Fee Receipt", dept: "CSE", date: "2024-02-20", size: "150 KB" },
  { id: 7, name: "Suresh Kumar", type: "Marks Sheet", dept: "ECE", date: "2024-03-01", size: "310 KB" },
  { id: 8, name: "Divya Reddy", type: "ID Proof", dept: "MECH", date: "2024-03-05", size: "175 KB" },
];

const leaveRequests = [
  { id: 1, name: "Priya S.", type: "Medical Leave", dept: "CSE", from: "2024-03-10", to: "2024-03-12", days: 3, status: "pending", role: "Student" },
  { id: 2, name: "Vikram R.", type: "OD Request", dept: "ECE", from: "2024-03-15", to: "2024-03-15", days: 1, status: "pending", role: "Student" },
  { id: 3, name: "Anjali M.", type: "Bonafide Request", dept: "IT", from: "2024-03-16", to: "2024-03-16", days: 1, status: "pending", role: "Student" },
  { id: 4, name: "Dr. Kumar", type: "Casual Leave", dept: "CSE", from: "2024-03-18", to: "2024-03-19", days: 2, status: "approved", role: "Staff" },
  { id: 5, name: "Ravi Shankar", type: "Medical Leave", dept: "MECH", from: "2024-03-20", to: "2024-03-22", days: 3, status: "rejected", role: "Staff" },
  { id: 6, name: "Sneha Verma", type: "OD Request", dept: "ECE", from: "2024-03-25", to: "2024-03-26", days: 2, status: "pending", role: "Student" },
];

const scholarships = {
  "scholarship-first": {
    title: "First Graduate Scholarship",
    description: "Scholarship for first-generation college graduates from Tamil Nadu",
    eligibility: "Family income < ₹2.5 Lakhs, First graduate in family, 60% marks",
    amount: "₹12,000 per year",
    applications: [
      { id: 1, name: "Ramesh P.", roll: "21CS001", dept: "CSE", income: "₹1.8L", marks: "78%", status: "approved" },
      { id: 2, name: "Lakshmi K.", roll: "21EC045", dept: "ECE", income: "₹2.1L", marks: "72%", status: "pending" },
      { id: 3, name: "Murugan S.", roll: "21ME012", dept: "MECH", income: "₹2.3L", marks: "65%", status: "pending" },
      { id: 4, name: "Kavitha R.", roll: "22CS034", dept: "CSE", income: "₹1.5L", marks: "81%", status: "approved" },
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
      { id: 3, name: "Arun V.", roll: "22ECE011", dept: "ECE", income: "₹2.9L", marks: "74%", status: "approved" },
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
      { id: 3, name: "Parvathi S.", roll: "22IT045", dept: "IT", income: "₹1.8L", marks: "82%", status: "approved" },
      { id: 4, name: "Balan R.", roll: "22CS078", dept: "CSE", income: "₹2.4L", marks: "63%", status: "rejected" },
    ],
  },
  "scholarship-reservation": {
    title: "7.5% Reservation Scholarship",
    description: "Special scholarship for government school students under 7.5% reservation",
    eligibility: "Studied in government schools, Scored > 50% in +2, Sports/NCC participation preferred",
    amount: "Full fee waiver",
    applications: [
      { id: 1, name: "Mani K.", roll: "21CS044", dept: "CSE", income: "₹1.5L", marks: "58%", status: "approved" },
      { id: 2, name: "Radha L.", roll: "22ME033", dept: "MECH", income: "₹2.0L", marks: "54%", status: "pending" },
    ],
  },
  "scholarship-merit": {
    title: "Merit Scholarship",
    description: "Scholarship for academically excellent students",
    eligibility: "First class throughout, Scored > 85% in previous semester, Good conduct",
    amount: "₹5,000 per semester",
    applications: [
      { id: 1, name: "Deepa R.", roll: "21CS099", dept: "CSE", income: "₹6L", marks: "91%", status: "approved" },
      { id: 2, name: "Arjun M.", roll: "21ECE077", dept: "ECE", income: "₹4.5L", marks: "88%", status: "approved" },
      { id: 3, name: "Nithya S.", roll: "22CS015", dept: "CSE", income: "₹5.2L", marks: "86%", status: "pending" },
    ],
  },
  "scholarship-feeconcession": {
    title: "Fee Concession Scholarship",
    description: "Fee concession for economically weaker students",
    eligibility: "Family income < ₹3 Lakhs, No other scholarship, Minimum 60% attendance",
    amount: "25-75% fee concession",
    applications: [
      { id: 1, name: "Vinoth K.", roll: "21ME056", dept: "MECH", income: "₹2.8L", marks: "67%", status: "approved" },
      { id: 2, name: "Preethi J.", roll: "22IT067", dept: "IT", income: "₹1.9L", marks: "71%", status: "pending" },
      { id: 3, name: "Saravanan P.", roll: "21CS033", dept: "CSE", income: "₹2.5L", marks: "73%", status: "approved" },
    ],
  },
};

const navItems = [
  { label: "User Management", icon: "👥", key: "user-mgmt", children: [
    { label: "Admin", icon: "🛡️", page: "users" as Page },
    { label: "Staff", icon: "👨‍💼", page: "users" as Page },
    { label: "HOD", icon: "🎓", page: "users" as Page },
  ]},
  { label: "Document Management", icon: "📁", key: "doc-mgmt", children: [
    { label: "Upload Documents", icon: "📤", page: "documents" as Page },
    { label: "Search / Filter", icon: "🔍", page: "documents" as Page },
    { label: "Download", icon: "⬇️", page: "documents" as Page },
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
  { label: "Examination", icon: "📊", key: "examination", children: [] as { label: string; icon: string; page: Page }[], page: "examination" as Page },
  { label: "Settings", icon: "⚙️", key: "settings", children: [] as { label: string; icon: string; page: Page }[], page: "settings" as Page },
];

function Sidebar({ activePage, onNavigate, role, onLogout, collapsed, setCollapsed }: {
  activePage: Page;
  onNavigate: (page: Page) => void;
  role: Role;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "user-mgmt": true,
    "doc-mgmt": true,
    "leave-cert": true,
    "scholarship": true,
    "timetable": false,
  });

  function toggleGroup(key: string) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }

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
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
      <div className="sidebar-body">
        <div
          className={`nav-single ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          <span className="nav-icon">📊</span>
          {!collapsed && <span className="nav-label">Dashboard</span>}
        </div>
        {navItems.map((item) => {
          if (item.children.length === 0) {
            return (
              <div
                key={item.key}
                className={`nav-single ${activePage === (item as any).page ? "active" : ""}`}
                onClick={() => item.page && onNavigate(item.page)}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </div>
            );
          }
          return (
            <div key={item.key} className="nav-group">
              <div className="nav-group-header" onClick={() => toggleGroup(item.key)}>
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
                  {item.children.map((child) => (
                    <div
                      key={child.label}
                      className={`nav-child ${activePage === child.page ? "active" : ""}`}
                      onClick={() => onNavigate(child.page)}
                    >
                      <span className="nav-child-icon">{child.icon}</span>
                      <span>{child.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{role === "admin" ? "🛡️" : role === "staff" ? "👨‍💼" : "🎓"}</div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{role === "admin" ? "Admin User" : role === "staff" ? "Staff Member" : "HOD"}</div>
              <div className="user-role">{role?.toUpperCase()}</div>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={onLogout} title="Logout">
          🚪{!collapsed && " Logout"}
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ background: color + "22", color }}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function MiniChart({ data, color, label }: { data: number[]; color: string; label: string }) {
  const max = Math.max(...data);
  return (
    <div className="mini-chart">
      <div className="mini-chart-label">{label}</div>
      <div className="mini-chart-bars">
        {data.map((v, i) => (
          <div key={i} className="mini-bar-wrap">
            <div
              className="mini-bar"
              style={{ height: `${(v / max) * 100}%`, background: color }}
              title={String(v)}
            />
          </div>
        ))}
      </div>
      <div className="mini-chart-months">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let cumulative = 0;
  const size = 120;
  const r = 48;
  const cx = size / 2;
  const cy = size / 2;

  function polarToXY(angle: number, radius: number) {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const arcs = segments.map((seg) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 360;
    const large = endAngle - startAngle > 180 ? 1 : 0;
    const start = polarToXY(startAngle, r);
    const end = polarToXY(endAngle, r);
    return { ...seg, path: `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z` };
  });

  return (
    <div className="donut-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r - 12} fill={COLORS.cardBg} />
        {arcs.map((arc, i) => (
          <path key={i} d={arc.path} fill={arc.color} />
        ))}
        <circle cx={cx} cy={cy} r={r - 20} fill={COLORS.cardBg} />
      </svg>
      <div className="donut-legend">
        {segments.map((s, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: s.color }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ role }: { role: Role }) {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [marks, setMarks] = useState("72, 68, 55, 60, 75, 75");
  const [attendance, setAttendance] = useState("82%");
  const [leaves, setLeaves] = useState(leaveRequests.slice(0, 3));

  function predict() {
    const marksArr = marks.split(",").map((m) => parseFloat(m.trim()));
    const avg = marksArr.reduce((s, x) => s + x, 0) / marksArr.length;
    const att = parseFloat(attendance);
    if (avg < 60 || att < 75) setPrediction("At Risk");
    else if (avg >= 80 && att >= 85) setPrediction("Excellent");
    else setPrediction("Average");
  }

  function handleLeave(id: number, action: "approved" | "rejected") {
    setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status: action } : l));
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">📊 Dashboard</h2>
        <div className="page-subtitle">Welcome back, {role?.toUpperCase()}! Here's your overview.</div>
      </div>

      <div className="stats-grid">
        <StatCard icon="👨‍🎓" label="Total Students" value="1,254" color={COLORS.accent} />
        <StatCard icon="📋" label="Pending Leaves" value="18" color={COLORS.warning} />
        <StatCard icon="🎓" label="Scholarships Applied" value="432" color={COLORS.success} />
        <StatCard icon="⚠️" label="Low Attendance Alerts" value="24" color={COLORS.danger} />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Student Performance Prediction</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Enter Past Marks:</label>
              <input
                className="form-input dark"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 72, 68, 55, 60, 75"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Enter Attendance:</label>
              <input
                className="form-input dark"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                placeholder="e.g. 82%"
              />
            </div>
            <button className="btn btn-primary" onClick={predict}>Predict</button>
            {prediction && (
              <div className={`prediction-result ${prediction === "At Risk" ? "risk" : prediction === "Excellent" ? "excellent" : "average"}`}>
                Prediction: <strong>{prediction}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Stats</h3>
            <div className="card-subtitle">Attendance Analysis</div>
          </div>
          <div className="card-body">
            <div className="quick-stats-grid">
              <MiniChart
                data={[72, 68, 75, 80, 78, 85]}
                color={COLORS.accent}
                label="CSE"
              />
              <DonutChart segments={[
                { value: 40, color: COLORS.accent, label: "CSE" },
                { value: 25, color: COLORS.success, label: "ECE" },
                { value: 20, color: COLORS.warning, label: "MECH" },
                { value: 15, color: COLORS.danger, label: "IT" },
              ]} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Document Management</h3>
          </div>
          <div className="card-body">
            <div className="doc-filter-row">
              <select className="form-select dark">
                <option>All</option>
                <option>Bonafide Certificate</option>
                <option>Marks Sheet</option>
                <option>ID Proof</option>
              </select>
              <input className="form-input dark" placeholder="Search..." />
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.slice(0, 4).map((doc) => (
                  <tr key={doc.id}>
                    <td className="font-medium">{doc.name}</td>
                    <td className="text-muted">{doc.type}</td>
                    <td>
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          const content = `Document: ${doc.name}\nType: ${doc.type}\nDepartment: ${doc.dept}\nDate: ${doc.date}\nSize: ${doc.size}`;
                          const blob = new Blob([content], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${doc.name.replace(/\s/g, "_")}_${doc.type.replace(/\s/g, "_")}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Leave Approvals</h3>
          </div>
          <div className="card-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Leave Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((lv) => (
                  <tr key={lv.id}>
                    <td className="font-medium">{lv.name}</td>
                    <td className="text-muted">{lv.type}</td>
                    <td>
                      {lv.status === "pending" ? (
                        <div className="action-btns">
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => handleLeave(lv.id, "approved")}
                          >Approve</button>
                          <button
                            className="btn btn-xs btn-danger"
                            onClick={() => handleLeave(lv.id, "rejected")}
                          >Reject</button>
                        </div>
                      ) : (
                        <span className={`status-badge ${lv.status}`}>{lv.status}</span>
                      )}
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

function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [docs, setDocs] = useState(documents);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("Bonafide Certificate");
  const [uploadDept, setUploadDept] = useState("CSE");
  const fileRef = useRef<HTMLInputElement>(null);

  const types = ["All", ...Array.from(new Set(docs.map((d) => d.type)))];
  const depts = ["All", ...Array.from(new Set(docs.map((d) => d.dept)))];

  const filtered = docs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || d.type === filterType;
    const matchDept = filterDept === "All" || d.dept === filterDept;
    return matchSearch && matchType && matchDept;
  });

  function handleDownload(doc: typeof documents[0]) {
    const content = `COLLEGE ADMINISTRATION SYSTEM\n${"=".repeat(40)}\nDocument: ${doc.name}\nType: ${doc.type}\nDepartment: ${doc.dept}\nDate: ${doc.date}\nFile Size: ${doc.size}\n${"=".repeat(40)}\nThis is a simulated document download.\nGenerated on: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name.replace(/\s/g, "_")}_${doc.type.replace(/\s/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadName) return;
    const newDoc = {
      id: docs.length + 1,
      name: uploadName,
      type: uploadType,
      dept: uploadDept,
      date: new Date().toISOString().slice(0, 10),
      size: "200 KB",
    };
    setDocs([newDoc, ...docs]);
    setUploadName("");
    setShowUpload(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">📁 Document Management</h2>
        <button className="btn btn-primary" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? "✕ Cancel" : "📤 Upload Document"}
        </button>
      </div>

      {showUpload && (
        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title">Upload New Document</h3></div>
          <div className="card-body">
            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student/Staff Name</label>
                  <input className="form-input dark" value={uploadName} onChange={(e) => setUploadName(e.target.value)} placeholder="Enter name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Document Type</label>
                  <select className="form-select dark" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                    <option>Bonafide Certificate</option>
                    <option>ID Proof</option>
                    <option>Marks Sheet</option>
                    <option>Transfer Certificate</option>
                    <option>Fee Receipt</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select dark" value={uploadDept} onChange={(e) => setUploadDept(e.target.value)}>
                    {["CSE", "ECE", "MECH", "IT", "CIVIL"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload File</label>
                <input type="file" ref={fileRef} className="form-input dark" />
              </div>
              <button type="submit" className="btn btn-primary">Upload Document</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Documents</h3>
          <div className="filter-row">
            <select className="form-select dark sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="form-select dark sm" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
              {depts.map((d) => <option key={d}>{d}</option>)}
            </select>
            <input className="form-input dark sm" placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card-body p-0">
          <table className="data-table full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Document Type</th>
                <th>Department</th>
                <th>Date</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
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
                    <button className="btn btn-xs btn-primary" onClick={() => handleDownload(doc)}>
                      ⬇️ Download
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="empty-row">No documents found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LeavePage({ type }: { type: "leave" | "od-bonafide" | "certificates" }) {
  const [requests, setRequests] = useState(leaveRequests);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "Medical Leave", dept: "CSE", from: "", to: "", role: "Student" as const });

  const titles = { leave: "Leave Requests", "od-bonafide": "OD / Bonafide Requests", certificates: "Certificate Requests" };
  const typeFilters: Record<string, string[]> = {
    leave: ["All", "Medical Leave", "Casual Leave", "Emergency Leave"],
    "od-bonafide": ["All", "OD Request", "Bonafide Request"],
    certificates: ["All", "Bonafide Certificate", "Transfer Certificate", "Course Completion"],
  };
  const defaultTypes: Record<string, string> = {
    leave: "Medical Leave",
    "od-bonafide": "OD Request",
    certificates: "Bonafide Certificate",
  };

  const filtered = requests.filter((r) => {
    if (type === "leave") return ["Medical Leave", "Casual Leave", "Emergency Leave"].includes(r.type) && (filter === "All" || r.type === filter);
    if (type === "od-bonafide") return ["OD Request", "Bonafide Request"].includes(r.type) && (filter === "All" || r.type === filter);
    return true;
  });

  function handleAction(id: number, action: "approved" | "rejected") {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newReq = {
      id: requests.length + 1,
      name: formData.name,
      type: formData.type,
      dept: formData.dept,
      from: formData.from,
      to: formData.to,
      days: 1,
      status: "pending",
      role: formData.role,
    };
    setRequests([newReq, ...requests]);
    setShowForm(false);
    setFormData({ name: "", type: defaultTypes[type], dept: "CSE", from: "", to: "", role: "Student" });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">📋 {titles[type]}</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ New Request"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title">Submit New Request</h3></div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input dark" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select dark" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    {typeFilters[type].filter((t) => t !== "All").map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select dark" value={formData.dept} onChange={(e) => setFormData({ ...formData, dept: e.target.value })}>
                    {["CSE", "ECE", "MECH", "IT", "CIVIL"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">From Date</label>
                  <input type="date" className="form-input dark" value={formData.from} onChange={(e) => setFormData({ ...formData, from: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">To Date</label>
                  <input type="date" className="form-input dark" value={formData.to} onChange={(e) => setFormData({ ...formData, to: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-select dark" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}>
                    <option>Student</option>
                    <option>Staff</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      <div className="stats-row">
        {["pending", "approved", "rejected"].map((s) => (
          <div key={s} className={`mini-stat ${s}`}>
            <div className="mini-stat-value">{requests.filter((r) => r.status === s).length}</div>
            <div className="mini-stat-label">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Requests</h3>
          <div className="filter-row">
            <select className="form-select dark sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
              {typeFilters[type].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="card-body p-0">
          <table className="data-table full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Department</th>
                <th>Role</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(filtered.length > 0 ? filtered : requests).map((req) => (
                <tr key={req.id}>
                  <td className="font-medium">{req.name}</td>
                  <td><span className="badge">{req.type}</span></td>
                  <td><span className="badge accent">{req.dept}</span></td>
                  <td className="text-muted">{req.role}</td>
                  <td className="text-muted">{req.from}</td>
                  <td className="text-muted">{req.to}</td>
                  <td><span className={`status-badge ${req.status}`}>{req.status}</span></td>
                  <td>
                    {req.status === "pending" ? (
                      <div className="action-btns">
                        <button className="btn btn-xs btn-success" onClick={() => handleAction(req.id, "approved")}>Approve</button>
                        <button className="btn btn-xs btn-danger" onClick={() => handleAction(req.id, "rejected")}>Reject</button>
                      </div>
                    ) : (
                      <button className="btn btn-xs btn-ghost" onClick={() => handleAction(req.id, "pending")}>Reset</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ScholarshipPage({ page }: { page: keyof typeof scholarships }) {
  const data = scholarships[page];
  const [apps, setApps] = useState(data.applications);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", roll: "", dept: "CSE", income: "", marks: "" });

  function handleAction(id: number, action: "approved" | "rejected") {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: action } : a));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newApp = { id: apps.length + 1, ...formData, status: "pending" };
    setApps([...apps, newApp]);
    setShowForm(false);
    setFormData({ name: "", roll: "", dept: "CSE", income: "", marks: "" });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">🎓 {data.title}</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Apply"}
        </button>
      </div>

      <div className="scholarship-info-card">
        <div className="info-item">
          <span className="info-icon">📝</span>
          <div>
            <div className="info-label">Description</div>
            <div className="info-value">{data.description}</div>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">✅</span>
          <div>
            <div className="info-label">Eligibility</div>
            <div className="info-value">{data.eligibility}</div>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">💰</span>
          <div>
            <div className="info-label">Amount</div>
            <div className="info-value highlight">{data.amount}</div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title">New Application</h3></div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student Name</label>
                  <input className="form-input dark" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input className="form-input dark" value={formData.roll} onChange={(e) => setFormData({ ...formData, roll: e.target.value })} placeholder="e.g. 22CS001" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select dark" value={formData.dept} onChange={(e) => setFormData({ ...formData, dept: e.target.value })}>
                    {["CSE", "ECE", "MECH", "IT", "CIVIL"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Family Income</label>
                  <input className="form-input dark" value={formData.income} onChange={(e) => setFormData({ ...formData, income: e.target.value })} placeholder="e.g. ₹2.5L" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Marks %</label>
                  <input className="form-input dark" value={formData.marks} onChange={(e) => setFormData({ ...formData, marks: e.target.value })} placeholder="e.g. 78%" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      <div className="stats-row">
        {["pending", "approved", "rejected"].map((s) => (
          <div key={s} className={`mini-stat ${s}`}>
            <div className="mini-stat-value">{apps.filter((a) => a.status === s).length}</div>
            <div className="mini-stat-label">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Applications</h3></div>
        <div className="card-body p-0">
          <table className="data-table full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>Family Income</th>
                <th>Marks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id}>
                  <td className="font-medium">{app.name}</td>
                  <td className="text-muted">{app.roll}</td>
                  <td><span className="badge accent">{app.dept}</span></td>
                  <td className="text-muted">{app.income}</td>
                  <td className="text-muted">{app.marks}</td>
                  <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                  <td>
                    {app.status === "pending" ? (
                      <div className="action-btns">
                        <button className="btn btn-xs btn-success" onClick={() => handleAction(app.id, "approved")}>Approve</button>
                        <button className="btn btn-xs btn-danger" onClick={() => handleAction(app.id, "rejected")}>Reject</button>
                      </div>
                    ) : (
                      <button className="btn btn-xs btn-ghost" onClick={() => handleAction(app.id, "pending")}>Reset</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersPage({ role }: { role: Role }) {
  const users = [
    { id: 1, name: "Dr. A. Krishnamurthy", role: "HOD", dept: "CSE", email: "hod.cse@college.edu", status: "active" },
    { id: 2, name: "Prof. S. Venkatesh", role: "Staff", dept: "ECE", email: "venkatesh@college.edu", status: "active" },
    { id: 3, name: "Admin User", role: "Admin", dept: "Administration", email: "admin@college.edu", status: "active" },
    { id: 4, name: "Prof. M. Rajan", role: "Staff", dept: "MECH", email: "rajan@college.edu", status: "inactive" },
    { id: 5, name: "Dr. P. Suresh", role: "HOD", dept: "IT", email: "hod.it@college.edu", status: "active" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">👥 User Management</h2>
        {role === "admin" && <button className="btn btn-primary">+ Add User</button>}
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="data-table full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td className="font-medium">{user.name}</td>
                  <td><span className="badge">{user.role}</span></td>
                  <td className="text-muted">{user.dept}</td>
                  <td className="text-muted">{user.email}</td>
                  <td><span className={`status-badge ${user.status === "active" ? "approved" : "rejected"}`}>{user.status}</span></td>
                  {role === "admin" && (
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-xs btn-ghost">Edit</button>
                        <button className="btn btn-xs btn-danger">Remove</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TimetablePage() {
  const [generated, setGenerated] = useState(false);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00"];
  const subjects = ["DS", "DBMS", "OS", "CN", "SE", "ML", "WEB", "LUNCH"];
  const timetable = days.map(() => periods.map((p, pi) => pi === 3 ? "LUNCH" : subjects[Math.floor(Math.random() * (subjects.length - 1))]));

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">📅 Timetable Auto Generator</h2>
        <button className="btn btn-primary" onClick={() => setGenerated(true)}>⚙️ Generate Timetable</button>
      </div>
      {generated && (
        <div className="card">
          <div className="card-header"><h3 className="card-title">Generated Timetable — CSE Department</h3></div>
          <div className="card-body p-0" style={{ overflowX: "auto" }}>
            <table className="data-table full timetable">
              <thead>
                <tr>
                  <th>Day / Period</th>
                  {periods.map((p) => <th key={p}>{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {days.map((day, di) => (
                  <tr key={day}>
                    <td className="font-medium">{day}</td>
                    {timetable[di].map((subj, pi) => (
                      <td key={pi} className={`timetable-cell ${subj === "LUNCH" ? "lunch" : ""}`}>
                        {subj}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ExaminationPage() {
  const exams = [
    { id: 1, subject: "Data Structures", dept: "CSE", sem: "3rd", date: "2024-04-15", time: "9:00 AM", hall: "A101", students: 65 },
    { id: 2, subject: "Signals & Systems", dept: "ECE", sem: "4th", date: "2024-04-16", time: "9:00 AM", hall: "B202", students: 58 },
    { id: 3, subject: "Thermodynamics", dept: "MECH", sem: "3rd", date: "2024-04-17", time: "2:00 PM", hall: "C303", students: 72 },
    { id: 4, subject: "DBMS", dept: "CSE", sem: "5th", date: "2024-04-18", time: "9:00 AM", hall: "A102", students: 60 },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">📊 Examination Management</h2>
        <button className="btn btn-primary">+ Schedule Exam</button>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="data-table full">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Date</th>
                <th>Time</th>
                <th>Hall</th>
                <th>Students</th>
                <th>Action</th>
              </tr>
            </thead>
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
                      <button className="btn btn-xs btn-ghost">Edit</button>
                      <button className="btn btn-xs btn-primary" onClick={() => {
                        const content = `EXAM SCHEDULE\n${"=".repeat(40)}\nSubject: ${exam.subject}\nDepartment: ${exam.dept}\nSemester: ${exam.sem}\nDate: ${exam.date}\nTime: ${exam.time}\nHall: ${exam.hall}\nStudents: ${exam.students}`;
                        const blob = new Blob([content], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${exam.subject}_schedule.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}>Export</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ role }: { role: Role }) {
  const [settings, setSettings] = useState({
    collegeName: "Sri Venkateswara College of Engineering",
    email: "admin@svce.ac.in",
    phone: "+91 44 2715 5000",
    address: "Pennalur, Sriperumbudur Tk., Chennai - 602 117",
    notifications: true,
    emailAlerts: true,
    darkMode: true,
  });

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">⚙️ Settings</h2>
      </div>
      <div className="settings-grid">
        <div className="card">
          <div className="card-header"><h3 className="card-title">College Information</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">College Name</label>
              <input className="form-input dark" value={settings.collegeName} onChange={(e) => setSettings({ ...settings, collegeName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input dark" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input dark" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-input dark" rows={3} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </div>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Preferences</h3></div>
          <div className="card-body">
            {[
              { key: "notifications", label: "Push Notifications", desc: "Get alerts for leave requests and approvals" },
              { key: "emailAlerts", label: "Email Alerts", desc: "Receive important updates via email" },
              { key: "darkMode", label: "Dark Mode", desc: "Use dark theme throughout the application" },
            ].map((pref) => (
              <div key={pref.key} className="pref-item">
                <div>
                  <div className="pref-label">{pref.label}</div>
                  <div className="pref-desc">{pref.desc}</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={(settings as any)[pref.key]}
                    onChange={(e) => setSettings({ ...settings, [pref.key]: e.target.checked })}
                  />
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

export default function App() {
  const [role, setRole] = useState<Role>(null);
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  function handleLogin(r: Role) {
    setRole(r);
    setActivePage("dashboard");
  }

  function handleLogout() {
    setRole(null);
    setActivePage("dashboard");
  }

  if (!role) return <LoginPage onLogin={handleLogin} />;

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
        return <ScholarshipPage page={activePage as keyof typeof scholarships} />;
      case "timetable": return <TimetablePage />;
      case "examination": return <ExaminationPage />;
      case "settings": return <SettingsPage role={role} />;
      default: return <Dashboard role={role} />;
    }
  }

  return (
    <div className={`app ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        role={role}
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <div className="breadcrumb">
              {activePage === "dashboard" ? "Dashboard" : activePage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-badge">
              <span>🔔</span>
              <span className="badge-dot" />
            </div>
            <div className="topbar-user">
              <span>{role === "admin" ? "🛡️" : role === "staff" ? "👨‍💼" : "🎓"}</span>
              <span className="topbar-username">{role?.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="page-content">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
