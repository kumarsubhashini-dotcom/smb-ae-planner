import { useState } from "react";

const C = {
  slate: "#1e293b", slateLight: "#334155", slateMid: "#475569", muted: "#94a3b8",
  surface: "#f8fafc", surfaceAlt: "#f1f5f9", white: "#ffffff",
  teal50: "#f0fdfa", teal100: "#ccfbf1", teal200: "#99f6e4", teal500: "#14b8a6", teal600: "#0d9488", teal700: "#0f766e",
  blue50: "#eff6ff", blue100: "#dbeafe", blue500: "#3b82f6", blue600: "#2563eb",
  amber50: "#fffbeb", amber100: "#fef3c7", amber500: "#f59e0b", amber600: "#d97706", amber700: "#b45309",
  red50: "#fef2f2", red500: "#ef4444", red600: "#dc2626",
  green50: "#f0fdf4", green500: "#22c55e", green600: "#16a34a",
  purple50: "#faf5ff", purple100: "#f3e8ff", purple500: "#a855f7", purple600: "#9333ea",
  border: "#e2e8f0",
};

const fmtK = (n) => n >= 1000000 ? "$" + (n / 1000000).toFixed(1) + "M" : "$" + Math.round(n / 1000).toLocaleString() + "K";
const fmt = (n) => "$" + Math.round(n).toLocaleString();

function Tag({ value, thresholds, labels }) {
  let bg, color, label;
  if (value >= thresholds[0]) { bg = C.green50; color = C.green600; label = labels[0]; }
  else if (value >= thresholds[1]) { bg = C.green50; color = C.green600; label = labels[1]; }
  else if (value >= thresholds[2]) { bg = C.amber50; color = C.amber700; label = labels[2]; }
  else { bg = C.red50; color = C.red600; label = labels[3]; }
  return <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: bg, color, fontWeight: 500, marginLeft: 8 }}>{label}</span>;
}

function Slider({ label, min, max, step, value, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <label style={{ fontSize: 14, color: C.slateMid, minWidth: 170, flexShrink: 0 }}>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          flex: 1, height: 6, borderRadius: 3, appearance: "none", WebkitAppearance: "none",
          background: `linear-gradient(to right, ${C.teal500} 0%, ${C.teal500} ${pct}%, ${C.border} ${pct}%, ${C.border} 100%)`,
          outline: "none", cursor: "pointer",
        }}
      />
      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 80, textAlign: "right", color: C.slate }}>{format(value)}</span>
    </div>
  );
}

function SL({ children }) {
  return <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, margin: "20px 0 8px", fontWeight: 600 }}>{children}</div>;
}

function Card({ label, value, sub, bg, accent }) {
  return (
    <div style={{ background: bg || C.surface, borderRadius: 12, padding: "18px 20px", border: `1px solid ${accent || C.border}22`, flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, color: C.slateMid, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.slate, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: bold ? C.slate : C.slateMid }}>
      <span>{label}</span>
      <span style={{ fontWeight: bold ? 600 : 500, color: C.slate }}>{value}</span>
    </div>
  );
}

function Section({ title, children, bg, accent }) {
  return (
    <div style={{ background: bg || C.white, borderRadius: 12, padding: "16px 20px", border: `1px solid ${accent || C.border}`, marginBottom: 14 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: accent || C.muted, fontWeight: 700, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>{title}</div>
      {children}
    </div>
  );
}

function SubLabel({ children, color }) {
  return <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: color || C.muted, fontWeight: 600, marginBottom: 6 }}>{children}</div>;
}

function useCalc(s) {
  const quotaDeals = Math.round(s.quota / s.acv);
  const actualDeals = Math.round(quotaDeals * (s.attain / 100));
  const effectivePerRep = s.quota * (s.attain / 100);
  const quotaOte = s.quota / s.ote;
  const variablePay = s.ote * ((100 - s.split) / 100);
  const basePay = s.ote * (s.split / 100);
  const commission = variablePay / s.quota;
  const reps100 = Math.ceil(s.arr / s.quota);
  const repsNeeded = Math.ceil((s.arr / s.quota) / (s.attain / 100));
  const actualEarnings = basePay + variablePay * (s.attain / 100);
  const salesEarnings = effectivePerRep / actualEarnings;
  const actualLoaded = Math.round(actualEarnings * 1.25);
  const oteLoaded = Math.round(s.ote * 1.25);
  const totalCompExcl = repsNeeded * actualEarnings;
  const totalCompIncl = repsNeeded * actualLoaded;
  const totalComp100Excl = reps100 * s.ote;
  const totalComp100Incl = reps100 * oteLoaded;
  const compPctArr = totalCompExcl / s.arr;
  return {
    quotaDeals, actualDeals, effectivePerRep, quotaOte, salesEarnings,
    variablePay, basePay, commission, reps100, repsNeeded,
    actualEarnings, actualLoaded, oteLoaded,
    totalCompExcl, totalCompIncl, totalComp100Excl, totalComp100Incl, compPctArr,
  };
}

function Tab1({ state: s, setState }) {
  const m = useCalc(s);
  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        <Card
          label={<span>Quota : OTE ratio <Tag value={m.quotaOte} thresholds={[5, 3, 2, 0]} labels={["excellent", "healthy", "tight", "danger zone"]} /></span>}
          value={m.quotaOte.toFixed(1) + "x"}
          sub={`${m.quotaDeals} deals/AE/yr at quota · Commission: ${(m.commission * 100).toFixed(1)}%`}
          bg={C.teal50} accent={C.teal500}
        />
        <Card
          label={<span>Sales to earnings ratio <Tag value={s.attain} thresholds={[80, 70, 50, 0]} labels={["excellent", "healthy", "below target", "problem"]} /></span>}
          value={m.salesEarnings.toFixed(1) + "x"}
          sub={`${fmtK(m.effectivePerRep)} avg. sales ÷ ${fmtK(m.actualEarnings)} avg. earnings at ${s.attain}%`}
          bg={C.blue50} accent={C.blue500}
        />
        <Card
          label="AE comp (excl. benefits)"
          value={`${(m.compPctArr * 100).toFixed(0)}% of new ARR`}
          sub={`${fmtK(m.totalCompExcl)} total · ${m.repsNeeded} AEs · ${fmtK(m.actualEarnings)} avg. earnings at ${s.attain}%`}
          bg={C.purple50} accent={C.purple500}
        />
      </div>

      <SL>Targets</SL>
      <Slider label="New ARR target" min={1000000} max={20000000} step={500000} value={s.arr} onChange={(v) => setState({ ...s, arr: v })} format={fmtK} />
      <Slider label="ACV" min={1000} max={50000} step={500} value={s.acv} onChange={(v) => setState({ ...s, acv: v })} format={fmt} />

      <SL>AE economics</SL>
      <Slider label="AE OTE" min={60000} max={250000} step={5000} value={s.ote} onChange={(v) => setState({ ...s, ote: v })} format={fmtK} />
      <Slider label="AE quota" min={200000} max={1500000} step={25000} value={s.quota} onChange={(v) => setState({ ...s, quota: v })} format={fmtK} />
      <Slider label="Base / variable split" min={40} max={70} step={5} value={s.split} onChange={(v) => setState({ ...s, split: v })} format={(v) => v + " / " + (100 - v)} />

      <SL>Team assumptions</SL>
      <Slider label="Quota attainment %" min={40} max={100} step={5} value={s.attain} onChange={(v) => setState({ ...s, attain: v })} format={(v) => v + "%"} />
    </div>
  );
}

function Tab2({ state: s }) {
  const m = useCalc(s);
  return (
    <div>
      <div style={{ width: 1200, maxWidth: "100%", background: C.white, padding: 32, borderRadius: 16, border: `1px solid ${C.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.slate }}>SMB AE capacity plan</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{fmtK(s.arr)} new ARR target · {fmt(s.acv)} ACV · {s.attain}% attainment</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Section title="Quota capacity plan" bg={C.teal50} accent={C.teal600}>
            <Row label="ARR target" value={fmtK(s.arr)} />
            <Row label="÷ Quota per AE" value={fmtK(s.quota)} />
            <div style={{ borderTop: `1px solid ${C.teal200}`, marginTop: 6, paddingTop: 6 }}>
              <Row label="AEs required at 100% attainment" value={m.reps100} bold />
              <Row label={`AEs required at ${s.attain}% attainment`} value={m.repsNeeded} bold />
            </div>
          </Section>

          <Section title="AE economics" bg={C.blue50} accent={C.blue600}>
            <Row label="Quota per AE" value={fmtK(s.quota)} />
            <Row label="ACV" value={fmt(s.acv)} />
            <Row label="Deals per AE at 100% attainment" value={`${m.quotaDeals}/yr (~${Math.round(m.quotaDeals / 12)}/mo)`} />
            <Row label={`Deals per AE at ${s.attain}% attainment`} value={`${m.actualDeals}/yr (~${Math.round(m.actualDeals / 12)}/mo)`} />
            <Row label="Commission rate" value={(m.commission * 100).toFixed(1) + "%"} />
          </Section>

          <Section title="Avg. annual earnings" bg={C.amber50} accent={C.amber600}>
            <Row label="AE OTE" value={fmtK(s.ote)} />
            <Row label={`Base (${s.split}%) / Variable (${100 - s.split}%)`} value={`${fmtK(m.basePay)} / ${fmtK(m.variablePay)}`} />
            <div style={{ borderTop: `1px solid ${C.amber100}`, marginTop: 6, paddingTop: 6 }}>
              <Row label="Earnings at 100% attainment" value={fmtK(s.ote)} bold />
              <Row label={`Earnings at ${s.attain}% attainment`} value={fmtK(m.actualEarnings)} bold />
            </div>
          </Section>

          <Section title="AE comp expense" bg={C.purple50} accent={C.purple600}>
            <div style={{ marginBottom: 8 }}>
              <SubLabel color={C.purple600}>Excl. benefits</SubLabel>
              <Row label={`At 100% attainment (${m.reps100} AEs × ${fmtK(s.ote)})`} value={fmtK(m.totalComp100Excl)} bold />
              <Row label={`At ${s.attain}% attainment (${m.repsNeeded} AEs × ${fmtK(m.actualEarnings)})`} value={fmtK(m.totalCompExcl)} bold />
            </div>
            <div style={{ borderTop: `1px solid ${C.purple100}`, paddingTop: 8 }}>
              <SubLabel color={C.purple600}>Incl. benefits (1.25×)</SubLabel>
              <Row label={`At 100% attainment (${m.reps100} AEs × ${fmtK(m.oteLoaded)})`} value={fmtK(m.totalComp100Incl)} bold />
              <Row label={`At ${s.attain}% attainment (${m.repsNeeded} AEs × ${fmtK(m.actualLoaded)})`} value={fmtK(m.totalCompIncl)} bold />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Tab3({ state: s, wState: w, setWState }) {
  const m = useCalc(s);
  const totalPct = w.q1 + w.q2 + w.q3 + w.q4;
  const q1Arr = s.arr * (w.q1 / 100);
  const q2Arr = s.arr * (w.q2 / 100);
  const q3Arr = s.arr * (w.q3 / 100);
  const q4Arr = s.arr * (w.q4 / 100);

  return (
    <div>
      <div style={{
        background: totalPct !== 100 ? C.amber50 : C.green50,
        border: `1px solid ${totalPct !== 100 ? C.amber500 : C.green500}`,
        borderRadius: 10, padding: "12px 18px", marginBottom: 20, fontSize: 13,
        color: totalPct !== 100 ? C.amber700 : C.green600, fontWeight: 500,
      }}>
        Quarterly split: {w.q1}% + {w.q2}% + {w.q3}% + {w.q4}% = {totalPct}%
        {totalPct !== 100 && " (should equal 100%)"}
        {totalPct === 100 && " — balanced"}
      </div>

      <SL>Quarterly ARR split (% of {fmtK(s.arr)})</SL>
      <Slider label={`Q1 (${fmtK(q1Arr)})`} min={5} max={50} step={5} value={w.q1} onChange={(v) => setWState({ ...w, q1: v })} format={(v) => v + "%"} />
      <Slider label={`Q2 (${fmtK(q2Arr)})`} min={5} max={50} step={5} value={w.q2} onChange={(v) => setWState({ ...w, q2: v })} format={(v) => v + "%"} />
      <Slider label={`Q3 (${fmtK(q3Arr)})`} min={5} max={50} step={5} value={w.q3} onChange={(v) => setWState({ ...w, q3: v })} format={(v) => v + "%"} />
      <Slider label={`Q4 (${fmtK(q4Arr)})`} min={5} max={50} step={5} value={w.q4} onChange={(v) => setWState({ ...w, q4: v })} format={(v) => v + "%"} />

      <SL>Ramp and team</SL>
      <Slider label="AE ramp months" min={1} max={6} step={1} value={w.rampMonths} onChange={(v) => setWState({ ...w, rampMonths: v })} format={(v) => v + " mo"} />
      <Slider label="Current fully ramped AEs" min={0} max={30} step={1} value={w.currentReps} onChange={(v) => setWState({ ...w, currentReps: v })} format={(v) => "" + v} />
      <Slider label="Annual attrition %" min={0} max={50} step={5} value={w.attrition} onChange={(v) => setWState({ ...w, attrition: v })} format={(v) => v + "%"} />

      <div style={{ background: C.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}`, marginTop: 20 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, fontWeight: 600, marginBottom: 10 }}>
          Waterfall assumptions summary
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
          <div style={{ color: C.slateMid }}>Annual ARR target</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{fmtK(s.arr)}</div>
          <div style={{ color: C.slateMid }}>Q1 / Q2 / Q3 / Q4</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{fmtK(q1Arr)} / {fmtK(q2Arr)} / {fmtK(q3Arr)} / {fmtK(q4Arr)}</div>
          <div style={{ color: C.slateMid }}>AE quota</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{fmtK(s.quota)}</div>
          <div style={{ color: C.slateMid }}>Quota attainment</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{s.attain}%</div>
          <div style={{ color: C.slateMid }}>Effective ARR per AE</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{fmtK(m.effectivePerRep)}</div>
          <div style={{ color: C.slateMid }}>AE ramp months</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{w.rampMonths} mo</div>
          <div style={{ color: C.slateMid }}>Current fully ramped AEs</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{w.currentReps}</div>
          <div style={{ color: C.slateMid }}>Annual attrition</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{w.attrition}%</div>
          <div style={{ color: C.slateMid }}>AE OTE</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{fmtK(s.ote)}</div>
          <div style={{ color: C.slateMid }}>Avg. earnings at {s.attain}%</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{fmtK(m.actualEarnings)}</div>
          <div style={{ color: C.slateMid }}>Base / variable split</div>
          <div style={{ textAlign: "right", fontWeight: 500, color: C.slate }}>{s.split} / {100 - s.split}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [state, setState] = useState({
    arr: 5000000, acv: 5000,
    ote: 110000, quota: 450000, split: 50, attain: 75,
  });
  const [wState, setWState] = useState({
    q1: 15, q2: 20, q3: 30, q4: 35,
    rampMonths: 2, currentReps: 0, attrition: 20,
  });

  const tabs = ["Assumptions", "Detailed math", "Waterfall assumptions"];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", maxWidth: 760, margin: "0 auto", padding: "0 4px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.slate, margin: 0 }}>SMB AE capacity planner</h1>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: C.surfaceAlt, borderRadius: 10, padding: 4 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            flex: 1, padding: "10px 16px", border: "none", borderRadius: 8, cursor: "pointer",
            fontSize: 13, fontWeight: 600, transition: "all 0.2s",
            background: tab === i ? C.white : "transparent",
            color: tab === i ? C.teal700 : C.muted,
            boxShadow: tab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{t}</button>
        ))}
      </div>

      {tab === 0 && <Tab1 state={state} setState={setState} />}
      {tab === 1 && <Tab2 state={state} />}
      {tab === 2 && <Tab3 state={state} wState={wState} setWState={setWState} />}
    </div>
  );
}
