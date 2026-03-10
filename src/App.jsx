import { useState, useCallback } from "react";

/*
 ═══════════════════════════════════════════════
  PRODUCT DATA — Replace this section when
  the product refresh is ready. Everything
  below this block reads from these objects.
 ═══════════════════════════════════════════════
*/
const PRODUCTS = {
  lift5c: {
    id: "lift5c", name: "LIFT5", subtitle: "Carbon", badge: null,
    tagline: "The most refined eFoil ever built.",
    basePrice: 10999, construction: "Carbon Fiber", mast: '28" LCS Carbon',
    sizes: [
      { id: "54", label: '5\'4"', volume: "82L", weight: "19 lbs", maxRider: "220+ lbs", note: "Max stability. Beginners & families." },
      { id: "49", label: '4\'9"', volume: "67L", weight: "17.5 lbs", maxRider: "200 lbs", note: "The sweet spot. Most riders." },
      { id: "44", label: '4\'4"', volume: "55L", weight: "16 lbs", maxRider: "180 lbs", note: "Performance. Intermediate to advanced." },
    ],
    colors: [
      { id: "offwhite", name: "Off-White", hex: "#F5F0E8" },
      { id: "steelblue", name: "Steel Blue", hex: "#4A6D8C" },
      { id: "sunkissed", name: "Sun Kissed", hex: "#E8A84C" },
      { id: "carbonblack", name: "Carbon Black", hex: "#1C1C1E" },
    ],
    wingGroup: "lift5",
  },
  lift5pro: {
    id: "lift5pro", name: "LIFT5", subtitle: "Pro", badge: "PRO",
    tagline: "Uncompromising. Premium carbon layup & pro-tuned components.",
    basePrice: 14999, construction: "Premium Carbon Fiber", mast: '28" LCS Carbon Pro',
    sizes: [
      { id: "54", label: '5\'4"', volume: "82L", weight: "18.5 lbs", maxRider: "220+ lbs", note: "Pro stability. Premium construction." },
      { id: "49", label: '4\'9"', volume: "67L", weight: "17 lbs", maxRider: "200 lbs", note: "Pro all-rounder. Refined response." },
      { id: "44", label: '4\'4"', volume: "55L", weight: "15.5 lbs", maxRider: "180 lbs", note: "Lightest setup. Ultimate carving." },
    ],
    colors: [
      { id: "offwhite", name: "Off-White", hex: "#F5F0E8" },
      { id: "steelblue", name: "Steel Blue", hex: "#4A6D8C" },
      { id: "sunkissed", name: "Sun Kissed", hex: "#E8A84C" },
      { id: "carbonblack", name: "Carbon Black", hex: "#1C1C1E" },
    ],
    wingGroup: "lift5",
  },
  liftx: {
    id: "liftx", name: "LIFTX", subtitle: "Standard", badge: "NEW",
    tagline: "Power when you want it. Pure glide when you don't.",
    basePrice: 12999, construction: "Carbon Fiber", mast: '32" LCS Carbon 55',
    sizes: [
      { id: "52", label: '5\'2"', volume: "64L", weight: "16.5 lbs", maxRider: "200 lbs", note: "Lifts early. Bigger riders & longer runs." },
      { id: "48", label: '4\'8"', volume: "52L", weight: "15.5 lbs", maxRider: "185 lbs", note: "Crossover. Surf agility + efficiency." },
      { id: "43", label: '4\'3"', volume: "42L", weight: "14.5 lbs", maxRider: "175 lbs", note: "Max agility. Powered to unassisted." },
    ],
    colors: [
      { id: "sparkblue", name: "Spark Blue", hex: "#2E6B9E" },
      { id: "dawnpatrol", name: "Dawn Patrol", hex: "#D4956A" },
      { id: "offwhite", name: "Off-White", hex: "#F5F0E8" },
    ],
    wingGroup: "liftx",
  },
  liftxPyzel: {
    id: "liftxPyzel", name: "LIFTX", subtitle: "Pyzel Edition", badge: "PYZEL",
    tagline: "Shaped by Jon Pyzel. Powered by Lift.",
    basePrice: 14999, construction: "Carbon Fiber + Pyzel Shape", mast: '32" LCS Carbon 55',
    sizes: [
      { id: "52", label: '5\'2"', volume: "64L", weight: "16.5 lbs", maxRider: "200 lbs", note: "Pyzel-shaped. Max glide." },
      { id: "48", label: '4\'8"', volume: "52L", weight: "15.5 lbs", maxRider: "185 lbs", note: "Pyzel crossover. Carves like a surfboard." },
      { id: "43", label: '4\'3"', volume: "42L", weight: "14.5 lbs", maxRider: "175 lbs", note: "Pyzel pro. Ultimate wave agility." },
    ],
    colors: [
      { id: "sparkblue", name: "Spark Blue", hex: "#2E6B9E" },
      { id: "dawnpatrol", name: "Dawn Patrol", hex: "#D4956A" },
      { id: "offwhite", name: "Off-White", hex: "#F5F0E8" },
    ],
    wingGroup: "liftx",
  },
};

const WINGS = {
  lift5: [
    { id: "270camber", name: "270 Camber Pro LCS", note: "All-around. Stability + speed.", price: 0, default: true },
    { id: "210camber", name: "210 Camber Pro LCS", note: "High speed carving.", price: 299 },
    { id: "170surf", name: "170 Surf LCS", note: "Tight turns, wave riding.", price: 399 },
  ],
  liftx: [
    { id: "148havoc", name: "148 Havoc LCS", note: "Surf-style performance.", price: 0, default: true },
    { id: "120havoc", name: "120 Havoc LCS", note: "High-aspect downwind.", price: 349 },
  ],
};

const CONTROLLERS = [
  { id: "elite", name: "Elite Hand Controller", note: "Bluetooth, data tracking, Lift app.", price: 0, default: true },
  { id: "standard", name: "Lift Controller", note: "Standard wireless.", price: -200 },
];

const ACCESSORIES = [
  { id: "blowfish", name: "Blowfish Platform", price: 399, note: "Inflatable floating dock.", compat: { products: ["lift5c", "lift5pro"], sizes: ["49", "54"] } },
  { id: "extrabattery", name: "Extra Gen5 Battery", price: 2499, note: "Double your session time.", compat: null },
  { id: "travelcase", name: "Board Travel Case", price: 449, note: "Airline-approved protection.", compat: null },
  { id: "wingpack", name: "Extra Wing Set", price: 599, note: "Additional front + rear wings.", compat: null },
  { id: "backpack", name: "Battery Backpack", price: 199, note: "Carry battery + gear.", compat: null },
];

const DEALER_TIERS = [
  { name: "Authorized", margin: "25-30%", min: "$25K", exclusivity: "Non-exclusive", demo: "Available", mktg: "Digital assets" },
  { name: "Premier", margin: "30-35%", min: "$75K/yr", exclusivity: "Regional", demo: "Included", mktg: "Co-op funds" },
  { name: "Experience Center", margin: "35-40%", min: "Shop-in-shop", exclusivity: "Territorial", demo: "Included + training", mktg: "Co-op + events" },
];

const T = { bg: "#000000", card: "#0d0d0d", surface: "#161616", border: "#222", borderLt: "#333", text: "#f2f2f2", sub: "#8a8a8a", dim: "#555", accent: "#C4501A", accentDk: "#A03E12", accentLt: "#D4652F", blue: "#4a8db7", green: "#4daa5f", red: "#cc4444" };
const ff = "'Outfit', sans-serif";
const fd = "'Outfit', sans-serif";
const fmt = n => "$" + n.toLocaleString();
const uid = () => Math.random().toString(36).slice(2, 9);

function Badge({ text, color }) {
  return text ? <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, padding: "3px 8px", borderRadius: 4, background: color || T.accent, color: "#000" }}>{text}</span> : null;
}

export default function App() {
  const [page, setPage] = useState("products");
  const [productId, setProductId] = useState(null);
  const [cfg, setCfg] = useState({});
  const [cart, setCart] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [dealerForm, setDealerForm] = useState({ company: "", name: "", email: "", phone: "", website: "", city: "", state: "", country: "US", type: "", message: "" });
  const [dealerDone, setDealerDone] = useState(false);

  const startConfig = (pid) => {
    const p = PRODUCTS[pid];
    const dw = WINGS[p.wingGroup].find(w => w.default);
    setProductId(pid);
    setCfg({ size: p.sizes[1]?.id || p.sizes[0].id, color: p.colors[0].id, wing: dw?.id, controller: "elite", accessories: [], qty: 1 });
    setEditIdx(null);
    setPage("configure");
  };

  const editItem = (idx) => {
    const item = cart[idx];
    setProductId(item.productId);
    setCfg({ size: item.size, color: item.color, wing: item.wing, controller: item.controller, accessories: [...item.accessories], qty: item.qty });
    setEditIdx(idx);
    setPage("configure");
  };

  const itemPrice = useCallback((pid, c) => {
    const p = PRODUCTS[pid]; if (!p) return 0;
    let tot = p.basePrice;
    const w = WINGS[p.wingGroup]?.find(w => w.id === c.wing); if (w) tot += w.price;
    const ct = CONTROLLERS.find(x => x.id === c.controller); if (ct) tot += ct.price;
    c.accessories?.forEach(aid => { const a = ACCESSORIES.find(x => x.id === aid); if (a) tot += a.price; });
    return tot;
  }, []);

  const unitPrice = productId ? itemPrice(productId, cfg) : 0;
  const lineTotal = unitPrice * (cfg.qty || 1);
  const cartTotal = cart.reduce((s, i) => s + itemPrice(i.productId, i) * i.qty, 0);
  const cartUnits = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = () => {
    const item = { id: uid(), productId, ...cfg };
    if (editIdx !== null) setCart(prev => prev.map((c, i) => i === editIdx ? { ...item, id: c.id } : c));
    else setCart(prev => [...prev, item]);
    setEditIdx(null);
    setPage("cart");
  };

  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const duplicateItem = (idx) => setCart(prev => [...prev, { ...prev[idx], id: uid() }]);
  const updateQty = (idx, delta) => setCart(prev => prev.map((c, i) => i === idx ? { ...c, qty: Math.max(1, c.qty + delta) } : c));

  const desc = (item) => {
    const p = PRODUCTS[item.productId];
    const sz = p.sizes.find(s => s.id === item.size);
    const cl = p.colors.find(c => c.id === item.color);
    const wg = WINGS[p.wingGroup]?.find(w => w.id === item.wing);
    const ct = CONTROLLERS.find(c => c.id === item.controller);
    const accs = item.accessories.map(aid => ACCESSORIES.find(a => a.id === aid)).filter(Boolean);
    return { p, sz, cl, wg, ct, accs, unit: itemPrice(item.productId, item), line: itemPrice(item.productId, item) * item.qty };
  };

  const generateOrder = () => {
    const lines = []; const ns = [];
    cart.forEach(item => {
      const { p, sz, cl, wg, ct, accs, unit } = desc(item);
      const label = `${p.name} ${p.subtitle} ${sz?.label} - ${cl?.name}`;
      lines.push({ title: label, quantity: item.qty, price: p.basePrice.toFixed(2), sku: `${p.id}-${sz?.id}-${cl?.id}`, properties: [{ name: "Wing", value: wg?.name }, { name: "Controller", value: ct?.name }, ...accs.map(a => ({ name: "Accessory", value: a.name }))] });
      if (wg?.price > 0) lines.push({ title: `Wing: ${wg.name}`, quantity: item.qty, price: wg.price.toFixed(2), sku: `WING-${wg.id}` });
      accs.forEach(a => lines.push({ title: a.name, quantity: item.qty, price: a.price.toFixed(2), sku: `ACC-${a.id}` }));
      ns.push({ item: `${p.id}-${sz?.id}`, quantity: item.qty, rate: unit, description: `${label} | ${wg?.name} | ${ct?.name}${accs.length ? " | " + accs.map(a => a.name).join(", ") : ""}` });
    });
    return { shopify_draft_order: { line_items: lines, total_price: cartTotal.toFixed(2), note: `Dealer Portal: ${cartUnits} units, ${cart.length} configs`, tags: "B2B, Dealer Portal" }, netsuite_sales_order: { entity: "PENDING_DEALER", trandate: new Date().toISOString().split("T")[0], memo: `Dealer Portal - ${cartUnits} units - ${fmt(cartTotal)}`, item: ns, subtotal: cartTotal } };
  };

  const inputSt = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, fontFamily: ff, boxSizing: "border-box", outline: "none" };
  const qtyBtn = { width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.text, fontSize: 16, cursor: "pointer", fontFamily: ff, display: "inline-flex", alignItems: "center", justifyContent: "center" };
  const qtyBtnSm = { ...qtyBtn, width: 26, height: 26, fontSize: 13 };

  return (
    <div style={{ fontFamily: ff, background: T.bg, color: T.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,6,6,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 52, padding: "0 24px" }}>
          <div onClick={() => { setPage("products"); setSubmitted(false); }} style={{ cursor: "pointer" }}>
            <span style={{ fontFamily: ff, fontSize: 20, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Lift</span>
            <span style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginLeft: 4, fontWeight: 300 }}>Foils</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {[["products", "Products"], ["dealer", "Become a Dealer"]].map(([pg, lb]) => (
              <button key={pg} onClick={() => { setPage(pg); setSubmitted(false); }} style={{ background: "none", border: "none", color: page === pg ? T.accent : T.sub, fontSize: 11, fontWeight: 500, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: ff }}>{lb}</button>
            ))}
            <button onClick={() => { setPage("cart"); setSubmitted(false); }} style={{ background: cart.length ? `${T.accent}20` : "none", border: `1px solid ${cart.length ? T.accent : T.border}`, color: cart.length ? T.accent : T.sub, fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "5px 12px", borderRadius: 6, fontFamily: ff, display: "flex", alignItems: "center", gap: 6 }}>
              Order {cart.length > 0 && <span style={{ background: T.accent, color: "#000", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{cartUnits}</span>}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* ═══ PRODUCTS ═══ */}
        {page === "products" && (
          <div style={{ padding: "40px 0 60px" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p style={{ fontFamily: fd, fontSize: 38, fontWeight: 300, margin: 0, lineHeight: 1.2, letterSpacing: -0.5 }}>Configure Your <span style={{ fontWeight: 600, color: T.accent }}>Fleet</span></p>
              <p style={{ fontSize: 13, color: T.sub, marginTop: 10 }}>Select a model. Configure it. Add to order. Repeat for each board.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
              {Object.values(PRODUCTS).map(p => (
                <div key={p.id} onClick={() => startConfig(p.id)} style={{ background: T.card, borderRadius: 12, cursor: "pointer", border: `1px solid ${T.border}`, transition: "border-color 0.25s, transform 0.25s", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ height: 130, background: `linear-gradient(145deg, ${T.surface}, ${T.card})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexDirection: "column" }}>
                    <span style={{ fontFamily: fd, fontSize: 28, fontWeight: 700 }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: T.accent, letterSpacing: 3, textTransform: "uppercase" }}>{p.subtitle}</span>
                    {p.badge && <Badge text={p.badge} />}
                  </div>
                  <div style={{ padding: "14px 18px 18px" }}>
                    <p style={{ fontSize: 12, color: T.sub, margin: "0 0 12px", lineHeight: 1.5 }}>{p.tagline}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 20, fontWeight: 600 }}>{fmt(p.basePrice)}<span style={{ fontSize: 11, color: T.sub, fontWeight: 400 }}> from</span></span>
                      <span style={{ fontSize: 11, color: T.accent }}>Configure &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CONFIGURATOR ═══ */}
        {page === "configure" && productId && (() => {
          const P = PRODUCTS[productId]; const wings = WINGS[P.wingGroup] || [];
          return (
            <div style={{ padding: "28px 0 60px" }}>
              <button onClick={() => setPage(editIdx !== null ? "cart" : "products")} style={{ background: "none", border: "none", color: T.sub, fontSize: 12, cursor: "pointer", marginBottom: 16, fontFamily: ff }}>&larr; {editIdx !== null ? "Back to order" : "Back to products"}</button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: fd, fontSize: 28, fontWeight: 700 }}>{P.name}</span>
                    <span style={{ fontSize: 13, color: T.accent, letterSpacing: 3 }}>{P.subtitle}</span>
                    {P.badge && <Badge text={P.badge} />}
                  </div>
                  <p style={{ fontSize: 12, color: T.sub, margin: "0 0 24px" }}>{P.tagline}</p>

                  <Sec label="Board Size">
                    <div style={{ display: "flex", gap: 8 }}>
                      {P.sizes.map(s => (
                        <div key={s.id} onClick={() => setCfg(c => ({ ...c, size: s.id, accessories: c.accessories.filter(aid => { const acc = ACCESSORIES.find(a => a.id === aid); return !acc?.compat || ((!acc.compat.products || acc.compat.products.includes(productId)) && (!acc.compat.sizes || acc.compat.sizes.includes(s.id))); }) }))} style={{ flex: 1, padding: "12px 14px", borderRadius: 10, cursor: "pointer", background: cfg.size === s.id ? T.surface : T.card, border: `2px solid ${cfg.size === s.id ? T.accent : T.border}`, transition: "all 0.2s" }}>
                          <div style={{ fontSize: 17, fontWeight: 600 }}>{s.label}</div>
                          <div style={{ fontSize: 10, color: T.sub, marginTop: 2 }}>{s.volume} &middot; {s.weight}</div>
                          <div style={{ fontSize: 10, color: T.dim, marginTop: 3 }}>Max: {s.maxRider}</div>
                          <div style={{ fontSize: 10, color: T.accent, marginTop: 2 }}>{s.note}</div>
                        </div>
                      ))}
                    </div>
                  </Sec>

                  <Sec label="Color">
                    <div style={{ display: "flex", gap: 16 }}>
                      {P.colors.map(c => (
                        <div key={c.id} onClick={() => setCfg(cf => ({ ...cf, color: c.id }))} style={{ cursor: "pointer", textAlign: "center" }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.hex, margin: "0 auto 5px", border: cfg.color === c.id ? `3px solid ${T.accent}` : `2px solid ${T.border}`, boxShadow: cfg.color === c.id ? `0 0 10px ${T.accent}50` : "none", transition: "all 0.2s" }} />
                          <div style={{ fontSize: 10, color: cfg.color === c.id ? T.text : T.sub }}>{c.name}</div>
                        </div>
                      ))}
                    </div>
                  </Sec>

                  <Sec label="Wing Package">
                    {wings.map(w => (
                      <ORow key={w.id} sel={cfg.wing === w.id} onClick={() => setCfg(c => ({ ...c, wing: w.id }))} label={w.name} note={w.note} right={w.default ? "Included" : `+${fmt(w.price)}`} rc={w.default ? T.green : T.text} />
                    ))}
                  </Sec>

                  <Sec label="Controller">
                    {CONTROLLERS.map(c => (
                      <ORow key={c.id} sel={cfg.controller === c.id} onClick={() => setCfg(cf => ({ ...cf, controller: c.id }))} label={c.name} note={c.note} right={c.default ? "Included" : `Save ${fmt(Math.abs(c.price))}`} rc={c.default ? T.green : T.blue} />
                    ))}
                  </Sec>

                  <Sec label="Accessories">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {ACCESSORIES.map(a => {
                        const compatible = !a.compat || (
                          (!a.compat.products || a.compat.products.includes(productId)) &&
                          (!a.compat.sizes || a.compat.sizes.includes(cfg.size))
                        );
                        const sel = cfg.accessories.includes(a.id);
                        if (!compatible && sel) {
                          // Auto-remove if they changed size/product and it's no longer compatible
                          setTimeout(() => setCfg(c => ({ ...c, accessories: c.accessories.filter(x => x !== a.id) })), 0);
                        }
                        return (
                          <div key={a.id} onClick={() => { if (!compatible) return; setCfg(c => ({ ...c, accessories: sel ? c.accessories.filter(x => x !== a.id) : [...c.accessories, a.id] })); }} style={{ padding: "11px 13px", borderRadius: 9, cursor: compatible ? "pointer" : "not-allowed", background: !compatible ? T.bg : sel ? T.surface : T.card, border: `1px solid ${!compatible ? T.border : sel ? T.accent : T.border}`, transition: "all 0.2s", opacity: compatible ? 1 : 0.4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                              <span style={{ fontWeight: 500 }}>{a.name}</span><span style={{ color: compatible ? T.accent : T.dim, fontSize: 11 }}>+{fmt(a.price)}</span>
                            </div>
                            <div style={{ fontSize: 10, color: T.sub, marginTop: 2 }}>{a.note}</div>
                            {!compatible && a.compat && (
                              <div style={{ fontSize: 9, color: T.red, marginTop: 4, fontWeight: 500 }}>
                                {a.compat.products && !a.compat.products.includes(productId)
                                  ? `Only available for ${a.compat.products.map(pid => PRODUCTS[pid]?.name + " " + PRODUCTS[pid]?.subtitle).join(", ")}`
                                  : a.compat.sizes
                                    ? `Only fits ${a.compat.sizes.map(sid => { const p = PRODUCTS[productId]; return p?.sizes.find(s => s.id === sid)?.label; }).filter(Boolean).join(" & ")} boards`
                                    : "Not compatible with this configuration"}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Sec>

                  <Sec label="Quantity">
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <button onClick={() => setCfg(c => ({ ...c, qty: Math.max(1, c.qty - 1) }))} style={qtyBtn}>-</button>
                      <span style={{ fontSize: 18, fontWeight: 600, minWidth: 28, textAlign: "center" }}>{cfg.qty}</span>
                      <button onClick={() => setCfg(c => ({ ...c, qty: c.qty + 1 }))} style={qtyBtn}>+</button>
                      {cfg.qty > 1 && <span style={{ fontSize: 12, color: T.sub }}>{cfg.qty} x {fmt(unitPrice)} = {fmt(lineTotal)}</span>}
                    </div>
                  </Sec>
                </div>

                {/* Right panel */}
                <div style={{ position: "sticky", top: 68, alignSelf: "start" }}>
                  <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                    <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.sub, marginBottom: 10 }}>Summary</div>
                      {[[P.name + " " + P.subtitle, P.sizes.find(s => s.id === cfg.size)?.label], ["Color", P.colors.find(c => c.id === cfg.color)?.name], ["Wing", wings.find(w => w.id === cfg.wing)?.name], ["Controller", CONTROLLERS.find(c => c.id === cfg.controller)?.name], ...cfg.accessories.map(aid => ["+ " + (ACCESSORIES.find(a => a.id === aid)?.name || ""), ""])].filter(([, v]) => v !== undefined).map(([l, v], i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 0", color: T.sub }}><span>{l}</span><span style={{ color: T.text }}>{v}</span></div>
                      ))}
                      {cfg.qty > 1 && <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>Qty: {cfg.qty}</div>}
                    </div>
                    <div style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: 12, color: T.sub }}>{cfg.qty > 1 ? "Unit" : "Total"}</span>
                        <span style={{ fontSize: 18, fontWeight: 600 }}>{fmt(unitPrice)}</span>
                      </div>
                      {cfg.qty > 1 && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span style={{ fontSize: 12, color: T.sub }}>Line ({cfg.qty}x)</span><span style={{ fontSize: 20, fontWeight: 700, color: T.accent }}>{fmt(lineTotal)}</span></div>}
                      <div style={{ fontSize: 10, color: T.dim, textAlign: "right", marginTop: 4 }}>from {fmt(Math.round(unitPrice / 60))}/mo with Affirm</div>
                      <button onClick={addToCart} style={{ width: "100%", marginTop: 14, padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDk})`, color: "#000", fontSize: 13, fontWeight: 600, fontFamily: ff }}>
                        {editIdx !== null ? "Update in Order" : `Add to Order${cfg.qty > 1 ? ` (${cfg.qty})` : ""}`}
                      </button>
                      {editIdx === null && <button onClick={() => { addToCart(); startConfig(productId); }} style={{ width: "100%", marginTop: 6, padding: "10px", borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", color: T.sub, fontSize: 11, cursor: "pointer", fontFamily: ff }}>Add &amp; Configure Another</button>}
                    </div>
                    {cart.length > 0 && <div style={{ padding: "10px 20px", borderTop: `1px solid ${T.border}`, background: T.surface, display: "flex", justifyContent: "space-between", fontSize: 11, color: T.sub }}><span>Order: {cartUnits} units</span><span style={{ color: T.accent, fontWeight: 600 }}>{fmt(cartTotal)}</span></div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ CART ═══ */}
        {page === "cart" && (
          <div style={{ padding: "36px 0 60px" }}>
            <p style={{ fontFamily: fd, fontSize: 28, fontWeight: 300, margin: "0 0 6px" }}>{submitted ? "Order Submitted" : "Review Your Order"}</p>
            <p style={{ fontSize: 13, color: T.sub, marginBottom: 24 }}>{submitted ? "Sent to the Lift sales team." : `${cart.length} config${cart.length !== 1 ? "s" : ""}, ${cartUnits} units`}</p>

            {cart.length === 0 && !submitted && (
              <div style={{ textAlign: "center", padding: 48, background: T.card, borderRadius: 12, border: `1px solid ${T.border}` }}>
                <p style={{ color: T.sub }}>Your order is empty. <span onClick={() => setPage("products")} style={{ color: T.accent, cursor: "pointer" }}>Start configuring</span>.</p>
              </div>
            )}

            {cart.map((item, idx) => {
              const { p, sz, cl, wg, ct, accs, unit, line } = desc(item);
              return (
                <div key={item.id} style={{ background: T.card, borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 10, padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>{p.name} {p.subtitle}</span>
                        {p.badge && <Badge text={p.badge} />}
                      </div>
                      <div style={{ fontSize: 11, color: T.sub, marginTop: 3 }}>
                        {sz?.label} &middot; {cl?.name} &middot; {wg?.name} &middot; {ct?.name}
                        {accs.length > 0 && <span> &middot; +{accs.length} acc</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {!submitted && <button onClick={() => updateQty(idx, -1)} style={qtyBtnSm}>-</button>}
                      <span style={{ fontSize: 15, fontWeight: 600, minWidth: 22, textAlign: "center" }}>{item.qty}</span>
                      {!submitted && <button onClick={() => updateQty(idx, 1)} style={qtyBtnSm}>+</button>}
                      <span style={{ fontSize: 12, color: T.sub }}>&times; {fmt(unit)}</span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: T.accent, minWidth: 80, textAlign: "right" }}>{fmt(line)}</span>
                    </div>
                    {!submitted && (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => editItem(idx)} style={{ background: "none", border: `1px solid ${T.border}`, color: T.sub, fontSize: 10, padding: "3px 8px", borderRadius: 5, cursor: "pointer", fontFamily: ff }}>Edit</button>
                        <button onClick={() => duplicateItem(idx)} style={{ background: "none", border: `1px solid ${T.border}`, color: T.sub, fontSize: 10, padding: "3px 8px", borderRadius: 5, cursor: "pointer", fontFamily: ff }}>Dupe</button>
                        <button onClick={() => removeFromCart(idx)} style={{ background: "none", border: `1px solid ${T.red}50`, color: T.red, fontSize: 10, padding: "3px 8px", borderRadius: 5, cursor: "pointer", fontFamily: ff }}>&times;</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {cart.length > 0 && (
              <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, padding: "18px 22px", marginTop: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, color: T.sub }}>Order Total &middot; {cartUnits} units</span>
                  <span style={{ fontFamily: fd, fontSize: 26, fontWeight: 700, color: T.accent }}>{fmt(cartTotal)}</span>
                </div>
                {!submitted ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button onClick={() => setPage("products")} style={{ flex: 1, padding: 11, borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", color: T.sub, fontSize: 12, cursor: "pointer", fontFamily: ff }}>+ Add Another Board</button>
                    <button onClick={() => setSubmitted(true)} style={{ flex: 2, padding: 11, borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDk})`, color: "#000", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: ff }}>Submit Order to Cliff Johnson</button>
                  </div>
                ) : (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}40`, borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.green }}>Order submitted successfully</div>
                      <div style={{ fontSize: 11, color: T.sub, marginTop: 3 }}>Cliff Johnson will contact you within 24 hours.</div>
                    </div>
                    <details style={{ marginTop: 10 }}>
                      <summary style={{ fontSize: 11, color: T.dim, cursor: "pointer" }}>View Shopify + NetSuite order JSON</summary>
                      <pre style={{ background: T.surface, borderRadius: 8, padding: 10, fontSize: 9, overflow: "auto", maxHeight: 250, color: T.dim, border: `1px solid ${T.border}`, marginTop: 6 }}>{JSON.stringify(generateOrder(), null, 2)}</pre>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ DEALER APP ═══ */}
        {page === "dealer" && (
          <div style={{ padding: "40px 0 60px", maxWidth: 780, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p style={{ fontFamily: fd, fontSize: 32, fontWeight: 300, margin: 0 }}>Become a <span style={{ fontWeight: 600, color: T.accent }}>Lift Dealer</span></p>
              <p style={{ fontSize: 13, color: T.sub, marginTop: 8 }}>30% global share. 15 patents. The most refined eFoil platform in water sports.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 30 }}>
              {DEALER_TIERS.map((t, i) => (
                <div key={t.name} style={{ background: T.card, borderRadius: 10, padding: "18px 14px", border: `1px solid ${i === 1 ? T.accent : T.border}` }}>
                  {i === 1 && <div style={{ fontSize: 8, color: T.accent, letterSpacing: 2, marginBottom: 4 }}>RECOMMENDED</div>}
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.accent, margin: "4px 0 10px" }}>{t.margin}</div>
                  {Object.entries({ "Min Order": t.min, Exclusivity: t.exclusivity, Demo: t.demo, Marketing: t.mktg }).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${T.border}`, fontSize: 10 }}><span style={{ color: T.sub }}>{k}</span><span>{v}</span></div>
                  ))}
                </div>
              ))}
            </div>
            {!dealerDone ? (
              <div style={{ background: T.card, borderRadius: 12, padding: 24, border: `1px solid ${T.border}` }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 18px" }}>Dealer Application</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[{ k: "company", l: "Company" }, { k: "name", l: "Name" }, { k: "email", l: "Email" }, { k: "phone", l: "Phone" }, { k: "website", l: "Website" }, { k: "city", l: "City" }, { k: "state", l: "State" }, { k: "country", l: "Country" }].map(f => (
                    <div key={f.k}><label style={{ fontSize: 10, color: T.sub, display: "block", marginBottom: 4 }}>{f.l}</label><input value={dealerForm[f.k]} onChange={e => setDealerForm(p => ({ ...p, [f.k]: e.target.value }))} style={inputSt} /></div>
                  ))}
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ fontSize: 10, color: T.sub, display: "block", marginBottom: 4 }}>Business Type</label>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {["Surf Retailer", "Marine Dealer", "Sporting Goods", "Rental/Lessons", "Resort", "Kite/Foil Shop", "Other"].map(t => (
                        <button key={t} onClick={() => setDealerForm(p => ({ ...p, type: t }))} style={{ padding: "6px 12px", borderRadius: 16, border: `1px solid ${dealerForm.type === t ? T.accent : T.border}`, background: dealerForm.type === t ? `${T.accent}18` : "transparent", color: dealerForm.type === t ? T.accent : T.sub, fontSize: 10, cursor: "pointer", fontFamily: ff }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 10, color: T.sub, display: "block", marginBottom: 4 }}>Why you'd be a great Lift dealer</label><textarea value={dealerForm.message} onChange={e => setDealerForm(p => ({ ...p, message: e.target.value }))} rows={3} style={{ ...inputSt, resize: "vertical" }} /></div>
                </div>
                <button onClick={() => setDealerDone(true)} style={{ marginTop: 18, width: "100%", padding: 12, borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDk})`, color: "#000", fontSize: 13, fontWeight: 600, fontFamily: ff }}>Submit Application</button>
              </div>
            ) : (
              <div style={{ background: T.card, borderRadius: 12, padding: 32, border: `1px solid ${T.green}`, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>&#10003;</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: T.green, margin: "0 0 8px" }}>Application Submitted</h3>
                <p style={{ fontSize: 12, color: T.sub }}>Thank you, {dealerForm.name}. We'll contact you within 48 hours.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: 20, marginTop: 24 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", fontSize: 10, color: T.dim }}>
          <span><span style={{ fontFamily: fd, fontWeight: 700 }}>LIFT</span> FOILS</span>
          <span>cliff.johnson@liftfoils.com</span>
          <span>&copy; 2026 Lift Foils USA Inc.</span>
        </div>
      </footer>
    </div>
  );
}

function Sec({ label, children }) {
  return <div style={{ marginBottom: 24 }}><div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.accent, marginBottom: 10, fontWeight: 500 }}>{label}</div>{children}</div>;
}
function ORow({ sel, onClick, label, note, right, rc }) {
  return <div onClick={onClick} style={{ padding: "11px 14px", borderRadius: 9, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: sel ? T.surface : T.card, border: `1px solid ${sel ? T.accent : T.border}`, marginBottom: 5, transition: "all 0.2s" }}><div><div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div><div style={{ fontSize: 10, color: T.sub }}>{note}</div></div><div style={{ fontSize: 11, color: rc || T.text, fontWeight: 500 }}>{right}</div></div>;
}
