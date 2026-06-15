import { useState } from "react";
import { useFirestoreData } from "../hooks/useFirestoreData";

const CATEGORY_STYLES: Record<string, { color: string; bg: string; emoji: string }> = {
  "Flower/Leaf Vegetables":   { color: "#4ade80", bg: "#052e16", emoji: "🥦" },
  "Edible Mushroom":          { color: "#fb923c", bg: "#1c0a00", emoji: "🍄" },
  "Capsicum":                 { color: "#f87171", bg: "#1e0505", emoji: "🌶️" },
  "Aquatic Tuberous Vegetables": { color: "#60a5fa", bg: "#030f1e", emoji: "🌿" },
  "Solanum":                  { color: "#c084fc", bg: "#13071e", emoji: "🍆" },
  "Cabbage":                  { color: "#facc15", bg: "#1a1200", emoji: "🥬" },
};

const MONTHLY_DATA = [
  { month: "Jan", items: 38 }, { month: "Feb", items: 42 }, { month: "Mar", items: 51 },
  { month: "Apr", items: 47 }, { month: "May", items: 63 }, { month: "Jun", items: 58 },
  { month: "Jul", items: 72 }, { month: "Aug", items: 69 }, { month: "Sep", items: 55 },
  { month: "Oct", items: 80 }, { month: "Nov", items: 78 }, { month: "Dec", items: 91 },
];
const MAX_MONTHLY = Math.max(...MONTHLY_DATA.map(d => d.items));

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          width: 4, borderRadius: 2,
          height: `${(v / max) * 28}px`,
          background: color,
          opacity: i === data.length - 1 ? 1 : 0.45,
        }} />
      ))}
    </div>
  );
}

// ── Category Badge ────────────────────────────────────────────────────────────
function CategoryBadge({ name, count, total }: { name: string; count: number; total: number }) {
  const style = CATEGORY_STYLES[name] ?? { color: "#9ca3af", bg: "#111318", emoji: "🌱" };
  const pct   = Math.round((count / total) * 100);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "#111318", border: "1px solid #1e2028",
      borderRadius: 10, padding: "10px 14px",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: style.bg, border: `1px solid ${style.color}33`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>
        {style.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, color: "#6b7280", marginBottom: 2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: "#1e2028", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: style.color, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: style.color, fontWeight: 600, minWidth: 28 }}>{count}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardUI() {
  const { products, categories, loading, error } = useFirestoreData();

  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]  = useState("");
  const [sortBy, setSortBy]            = useState<"name" | "category">("name");

  // ── Loading ──
  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#0a0c10",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{ fontSize: 32 }}>🔥</div>
      <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 14 }}>
        Cargando datos desde Firebase...
      </div>
      <div style={{ color: "#374151", fontFamily: "monospace", fontSize: 11 }}>
        dashboard-1bdc5.firebaseapp.com
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div style={{
      minHeight: "100vh", background: "#0a0c10",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 12,
    }}>
      <div style={{ fontSize: 32 }}>❌</div>
      <div style={{ color: "#f87171", fontFamily: "monospace", fontSize: 14 }}>
        {error}
      </div>
    </div>
  );

  // ── Derived data ──
  const TOTAL = products.length;

  const topCat = [...categories].sort((a, b) => b.count - a.count)[0];

  const avgPerCat = categories.length > 0
    ? (TOTAL / categories.length).toFixed(1)
    : "0";

  const filtered = products
    .filter(p =>
      (!selectedCat || p.categoryName === selectedCat) &&
      (p.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       p.itemCode.includes(searchQuery))
    )
    .sort((a, b) =>
      sortBy === "name"
        ? a.itemName.localeCompare(b.itemName)
        : a.categoryName.localeCompare(b.categoryName)
    );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0c10",
      color: "#e2e8f0",
      fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111318; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 4px; }
        .card { background: #0e1015; border: 1px solid #1a1d27; border-radius: 12px; padding: 20px; }
        .stat-card { background: #0e1015; border: 1px solid #1a1d27; border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; gap: 8px; }
        .table-row:hover { background: #13151c; }
        input[type="text"] { background: #111318; border: 1px solid #1e2028; color: #e2e8f0; border-radius: 8px; padding: 8px 14px; font-family: inherit; font-size: 13px; outline: none; transition: border-color 0.2s; }
        input[type="text"]:focus { border-color: #4ade80; }
        select { background: #111318; border: 1px solid #1e2028; color: #e2e8f0; border-radius: 8px; padding: 8px 10px; font-family: inherit; font-size: 13px; outline: none; cursor: pointer; }
        .pill-btn { border: 1px solid #1e2028; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-family: inherit; cursor: pointer; transition: all 0.2s; white-space: nowrap; background: transparent; color: #6b7280; }
        .pill-btn:hover { border-color: #4ade80; color: #4ade80; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        borderBottom: "1px solid #1a1d27", padding: "16px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "#0a0c10", zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #052e16, #4ade80)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🥬</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>
              VegCatalog <span style={{ color: "#4ade80" }}>Dashboard</span>
            </div>
            <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.5px" }}>
              PRODUCT INTELLIGENCE · ANNEX 1
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            fontSize: 11, color: "#4ade80", background: "#052e16",
            border: "1px solid #14532d", borderRadius: 6, padding: "4px 10px",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            Firebase live
          </div>
          <div style={{ fontSize: 11, color: "#4b5563" }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── KPIs ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { label: "Total SKUs",       value: TOTAL,            sub: `${categories.length} categories`, color: "#4ade80", spark: [38,42,51,47,63,58,72,69,55,80,78,TOTAL] },
            { label: "Categories",       value: categories.length, sub: "active groups",                  color: "#fb923c", spark: [1,2,3,4,4,5,5,6,6,6,6,categories.length] },
            { label: "Top Category",     value: topCat?.count ?? 0, sub: topCat?.categoryName ?? "-",     color: "#60a5fa", spark: [40,50,60,70,75,80,85,88,90,95,98,topCat?.count ?? 0] },
            { label: "Avg per Category", value: avgPerCat,         sub: "items / category",              color: "#c084fc", spark: [20,25,30,33,36,38,40,40,41,41,41,Number(avgPerCat)] },
          ].map(({ label, value, sub, color, spark }) => (
            <div key={label} className="stat-card">
              <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontSize: 11, color: "#4b5563" }}>{sub}</span>
                <Sparkline data={spark} color={color} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Chart + Categories ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14 }}>

          {/* Bar chart */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700 }}>SKU Additions</div>
                <div style={{ fontSize: 11, color: "#4b5563" }}>Monthly product catalog growth</div>
              </div>
              <div style={{ fontSize: 11, color: "#4ade80", background: "#052e16", borderRadius: 6, padding: "3px 8px" }}>
                +139% YoY
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 130 }}>
              {MONTHLY_DATA.map((d, i) => (
                <div
                  key={d.month}
                  title={`${d.month}: ${d.items} items`}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}
                >
                  <div style={{
                    width: "100%",
                    height: `${(d.items / MAX_MONTHLY) * 110}px`,
                    background: i === MONTHLY_DATA.length - 1
                      ? "linear-gradient(180deg, #4ade80, #166534)"
                      : "linear-gradient(180deg, #1e4d2b, #0d2018)",
                    borderRadius: "4px 4px 0 0",
                    opacity: 0.85,
                  }} />
                  <div style={{ fontSize: 9, color: "#374151" }}>{d.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              By Category
            </div>
            {categories
              .sort((a, b) => b.count - a.count)
              .map(cat => (
                <CategoryBadge
                  key={cat.categoryCode}
                  name={cat.categoryName}
                  count={cat.count}
                  total={TOTAL}
                />
              ))
            }
          </div>
        </div>

        {/* ── Table ── */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>

          {/* Controls */}
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid #1a1d27",
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, marginRight: 4 }}>
              Product Catalog
            </div>
            <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
              <button
                className="pill-btn"
                style={{ borderColor: selectedCat === null ? "#4ade80" : "#1e2028", color: selectedCat === null ? "#4ade80" : "#6b7280", background: selectedCat === null ? "#052e16" : "transparent" }}
                onClick={() => setSelectedCat(null)}
              >
                All ({TOTAL})
              </button>
              {categories.sort((a, b) => b.count - a.count).map(cat => {
                const s = CATEGORY_STYLES[cat.categoryName] ?? { color: "#9ca3af", bg: "#111318" };
                const active = selectedCat === cat.categoryName;
                return (
                  <button
                    key={cat.categoryCode}
                    className="pill-btn"
                    style={{
                      background: active ? s.bg : "transparent",
                      color: active ? s.color : "#6b7280",
                      borderColor: active ? s.color + "80" : "#1e2028",
                    }}
                    onClick={() => setSelectedCat(active ? null : cat.categoryName)}
                  >
                    {cat.categoryName.split(" ")[0]} ({cat.count})
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="Search SKU or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: 200 }}
            />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
              <option value="name">Sort: Name</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1a1d27" }}>
                  {["Item Code", "Product Name", "Category"].map(h => (
                    <th key={h} style={{
                      padding: "10px 20px", textAlign: "left",
                      fontSize: 10, color: "#4b5563", fontWeight: 500,
                      letterSpacing: "0.6px", textTransform: "uppercase",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const s = CATEGORY_STYLES[item.categoryName] ?? { color: "#9ca3af", bg: "#111318" };
                  return (
                    <tr
                      key={item.itemCode}
                      className="table-row"
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid #111318" : "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <td style={{ padding: "12px 20px", color: "#4b5563", fontSize: 11 }}>
                        {item.itemCode}
                      </td>
                      <td style={{ padding: "12px 20px", color: "#e2e8f0", fontWeight: 500 }}>
                        {item.itemName}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{
                          fontSize: 11, borderRadius: 4, padding: "2px 8px",
                          background: s.bg, color: s.color,
                          border: `1px solid ${s.color}33`,
                        }}>
                          {item.categoryName}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: 40, textAlign: "center", color: "#374151", fontSize: 13 }}>
                      No products match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: "10px 20px", borderTop: "1px solid #1a1d27",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 11, color: "#4b5563" }}>
              Showing {filtered.length} of {TOTAL} SKUs
              {selectedCat && ` · "${selectedCat}"`}
            </span>
            <span style={{ fontSize: 11, color: "#4ade80" }}>
              🔥 Live · dashboard-1bdc5
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
