import { useState } from "react";

// ── Mock data derived from annex1.csv structure ──────────────────────────────
const CATEGORIES = [
  { code: "1011010101", name: "Flower/Leaf Vegetables", count: 100, color: "#4ade80", bg: "#052e16" },
  { code: "1011010102", name: "Edible Mushroom",        count: 72,  color: "#fb923c", bg: "#1c0a00" },
  { code: "1011010103", name: "Capsicum",               count: 45,  color: "#f87171", bg: "#1e0505" },
  { code: "1011010104", name: "Aquatic Tuberous",       count: 19,  color: "#60a5fa", bg: "#030f1e" },
  { code: "1011010105", name: "Solanum",                count: 10,  color: "#c084fc", bg: "#13071e" },
  { code: "1011010106", name: "Cabbage",                count: 5,   color: "#facc15", bg: "#1a1200" },
];

const SAMPLE_ITEMS = [
  { code: "102900005115168", name: "Niushou Shengcai",          category: "Flower/Leaf Vegetables", stock: 240, price: 3.5  },
  { code: "102900005115199", name: "Sichuan Red Cedar",         category: "Flower/Leaf Vegetables", stock: 88,  price: 4.2  },
  { code: "102900005115625", name: "Local Xiaomao Cabbage",     category: "Flower/Leaf Vegetables", stock: 310, price: 2.8  },
  { code: "102900005115748", name: "White Caitai",              category: "Flower/Leaf Vegetables", stock: 52,  price: 3.1  },
  { code: "102900005115762", name: "Amaranth",                  category: "Flower/Leaf Vegetables", stock: 170, price: 5.0  },
  { code: "102900011008492", name: "Big Broccoli",              category: "Capsicum",               stock: 95,  price: 6.5  },
  { code: "102900011007471", name: "Mint",                      category: "Flower/Leaf Vegetables", stock: 430, price: 8.9  },
  { code: "102900011007464", name: "Perilla",                   category: "Flower/Leaf Vegetables", stock: 65,  price: 7.2  },
  { code: "102900005116776", name: "Local Spinach",             category: "Flower/Leaf Vegetables", stock: 200, price: 2.5  },
  { code: "102900011006955", name: "Ice Grass",                 category: "Edible Mushroom",        stock: 30,  price: 12.0 },
  { code: "102900011008485", name: "Mustard",                   category: "Capsicum",               stock: 140, price: 3.8  },
  { code: "102900005115823", name: "Shanghaiqing",              category: "Flower/Leaf Vegetables", stock: 255, price: 2.9  },
];

const TOTAL_ITEMS = 251;

const MONTHLY_DATA = [
  { month: "Jan", items: 38 }, { month: "Feb", items: 42 }, { month: "Mar", items: 51 },
  { month: "Apr", items: 47 }, { month: "May", items: 63 }, { month: "Jun", items: 58 },
  { month: "Jul", items: 72 }, { month: "Aug", items: 69 }, { month: "Sep", items: 55 },
  { month: "Oct", items: 80 }, { month: "Nov", items: 78 }, { month: "Dec", items: 91 },
];
const MAX_MONTHLY = Math.max(...MONTHLY_DATA.map(d => d.items));

// ── Tiny bar sparkline ────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            width: 4, borderRadius: 2,
            height: `${(v / max) * 28}px`,
            background: color,
            opacity: i === data.length - 1 ? 1 : 0.45,
            transition: "height 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ── Category badge ────────────────────────────────────────────────────────────
function CategoryBadge({ cat }: { cat: typeof CATEGORIES[0] }) {
  const pct = Math.round((cat.count / TOTAL_ITEMS) * 100);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "#111318", border: "1px solid #1e2028",
      borderRadius: 10, padding: "10px 14px",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: cat.bg, border: `1px solid ${cat.color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
      }}>
        {cat.name.includes("Mushroom") ? "🍄"
          : cat.name.includes("Capsicum") ? "🌶️"
          : cat.name.includes("Aquatic") ? "🌿"
          : cat.name.includes("Solanum") ? "🍆"
          : cat.name.includes("Cabbage") ? "🥬"
          : "🥦"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cat.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: "#1e2028", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: cat.color, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: cat.color, fontWeight: 600, minWidth: 28 }}>{cat.count}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardUI() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "stock" | "price">("name");

  const filtered = SAMPLE_ITEMS
    .filter(item =>
      (!selectedCat || item.category === selectedCat) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.code.includes(searchQuery))
    )
    .sort((a, b) => {
      if (sortBy === "name")  return a.name.localeCompare(b.name);
      if (sortBy === "stock") return b.stock - a.stock;
      return b.price - a.price;
    });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0c10",
      color: "#e2e8f0",
      fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
      padding: 0,
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111318; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 4px; }

        .card {
          background: #0e1015;
          border: 1px solid #1a1d27;
          border-radius: 12px;
          padding: 20px;
        }

        .stat-card {
          background: #0e1015;
          border: 1px solid #1a1d27;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .table-row:hover { background: #13151c; }

        input[type="text"] {
          background: #111318;
          border: 1px solid #1e2028;
          color: #e2e8f0;
          border-radius: 8px;
          padding: 8px 14px;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        input[type="text"]:focus { border-color: #4ade80; }

        select {
          background: #111318;
          border: 1px solid #1e2028;
          color: #e2e8f0;
          border-radius: 8px;
          padding: 8px 10px;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .pill-btn {
          border: 1px solid #1e2028;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .pill-btn:hover { border-color: #4ade80; color: #4ade80; }
        .pill-btn.active { background: #052e16; border-color: #4ade80; color: #4ade80; }

        .bar-hover:hover > .bar-fill { opacity: 1 !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        borderBottom: "1px solid #1a1d27",
        padding: "16px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "#0a0c10", zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #052e16, #4ade80)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🥬</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>
              VegCatalog <span style={{ color: "#4ade80" }}>Dashboard</span>
            </div>
            <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.5px" }}>PRODUCT INTELLIGENCE · ANNEX 1</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            fontSize: 11, color: "#4ade80",
            background: "#052e16", border: "1px solid #14532d",
            borderRadius: 6, padding: "4px 10px",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            Firebase connected
          </div>
          <div style={{ fontSize: 11, color: "#4b5563" }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── KPI Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { label: "Total SKUs",     value: TOTAL_ITEMS, sub: "+12 this month",  color: "#4ade80", spark: [38,42,51,47,63,58,72,69,55,80,78,91] },
            { label: "Categories",     value: 6,           sub: "6 active groups", color: "#fb923c", spark: [4,4,5,5,6,6,6,6,6,6,6,6] },
            { label: "Top Category",   value: "100 SKUs",  sub: "Flower/Leaf Veg", color: "#60a5fa", spark: [60,65,70,80,85,88,90,92,95,98,99,100] },
            { label: "Avg per Category", value: "41.8",    sub: "items / category",color: "#c084fc", spark: [30,33,36,38,40,40,41,41,41,41,41,42] },
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

        {/* ── Middle row: Chart + Categories ── */}
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
                  className="bar-hover"
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
                    transition: "opacity 0.2s",
                    opacity: 0.85,
                  }} className="bar-fill" />
                  <div style={{ fontSize: 9, color: "#374151" }}>{d.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories sidebar */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              By Category
            </div>
            {CATEGORIES.map(cat => <CategoryBadge key={cat.code} cat={cat} />)}
          </div>
        </div>

        {/* ── Table section ── */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Table header / controls */}
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid #1a1d27",
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, marginRight: 4 }}>
              Product Catalog
            </div>
            <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
              <button
                className={`pill-btn${selectedCat === null ? " active" : ""}`}
                style={{ background: selectedCat === null ? "#052e16" : "transparent", color: selectedCat === null ? "#4ade80" : "#6b7280" }}
                onClick={() => setSelectedCat(null)}
              >
                All ({TOTAL_ITEMS})
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.code}
                  className={`pill-btn${selectedCat === cat.name ? " active" : ""}`}
                  style={{
                    background: selectedCat === cat.name ? cat.bg : "transparent",
                    color: selectedCat === cat.name ? cat.color : "#6b7280",
                    borderColor: selectedCat === cat.name ? cat.color + "80" : "#1e2028",
                  }}
                  onClick={() => setSelectedCat(selectedCat === cat.name ? null : cat.name)}
                >
                  {cat.name.split(" ")[0]} ({cat.count})
                </button>
              ))}
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
              <option value="stock">Sort: Stock</option>
              <option value="price">Sort: Price</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1a1d27" }}>
                  {["Item Code", "Product Name", "Category", "Stock", "Unit Price"].map(h => (
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
                  const cat = CATEGORIES.find(c => c.name === item.category);
                  return (
                    <tr
                      key={item.code}
                      className="table-row"
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid #111318" : "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <td style={{ padding: "12px 20px", color: "#4b5563", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                        {item.code}
                      </td>
                      <td style={{ padding: "12px 20px", color: "#e2e8f0", fontWeight: 500 }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{
                          fontSize: 11, borderRadius: 4, padding: "2px 8px",
                          background: cat?.bg ?? "#111",
                          color: cat?.color ?? "#888",
                          border: `1px solid ${(cat?.color ?? "#888") + "33"}`,
                        }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 60, height: 4, background: "#1e2028", borderRadius: 2, overflow: "hidden",
                          }}>
                            <div style={{
                              width: `${Math.min((item.stock / 430) * 100, 100)}%`,
                              height: "100%",
                              background: item.stock > 200 ? "#4ade80" : item.stock > 100 ? "#fb923c" : "#f87171",
                              borderRadius: 2,
                            }} />
                          </div>
                          <span style={{ color: item.stock > 200 ? "#4ade80" : item.stock > 100 ? "#fb923c" : "#f87171", fontSize: 12 }}>
                            {item.stock}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 20px", color: "#e2e8f0" }}>
                        ¥{item.price.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#374151", fontSize: 13 }}>
                      No products match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div style={{
            padding: "10px 20px", borderTop: "1px solid #1a1d27",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 11, color: "#4b5563" }}>
              Showing {filtered.length} of {TOTAL_ITEMS} total SKUs
              {selectedCat && ` · filtered by "${selectedCat}"`}
            </span>
            <span style={{ fontSize: 11, color: "#4b5563" }}>
              🔥 Connect Firebase to load full dataset
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
