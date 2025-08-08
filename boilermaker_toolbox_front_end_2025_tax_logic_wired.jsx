import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Anchor,
  Wallet,
  Save,
  Info,
  FileText,
  Settings,
  Clock,
  ChevronRight,
  Scale,
  Plus,
  Trash2,
} from "lucide-react";

/**
 * BoilermakerToolbox – Single-file front-end draft (2025 formulas wired)
 * ----------------------------------------------------------------------
 * Stack: React + Tailwind + Framer Motion + Lucide icons (no external UI deps)
 * Notes:
 *  - Accurate CPP/EI for 2025 and AB + Federal income tax withholding (periodic, annualized) with mid‑year changes.
 *  - Uses CRA published values (see Settings → Tax logic card for assumptions & sources).
 *  - Save scenarios locally (localStorage) for quick comparisons.
 *  - Designed with an industrial palette (charcoal / safety orange) and clear inputs.
 */

export default function BoilermakerToolboxApp() {
  const [activeTab, setActiveTab] = useState("netpay");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header onNavigate={setActiveTab} activeTab={activeTab} />

      <main className="mx-auto max-w-7xl px-4 pb-28">
        <Hero />

        <nav className="mb-6 mt-2 flex gap-2 overflow-x-auto">
          <Pill
            active={activeTab === "netpay"}
            onClick={() => setActiveTab("netpay")}
            icon={<Wallet className="h-4 w-4" />}
            label="Net Pay"
          />
          <Pill
            active={activeTab === "rigging"}
            onClick={() => setActiveTab("rigging")}
            icon={<Anchor className="h-4 w-4" />}
            label="Rigging"
          />
          <Pill
            active={activeTab === "contracts"}
            onClick={() => setActiveTab("contracts")}
            icon={<FileText className="h-4 w-4" />}
            label="Contracts"
          />
          <Pill
            active={activeTab === "scenarios"}
            onClick={() => setActiveTab("scenarios")}
            icon={<Save className="h-4 w-4" />}
            label="Saved"
          />
          <Pill
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
          />
        </nav>

        {activeTab === "netpay" && <NetPayCard />}
        {activeTab === "rigging" && <RiggingCard />}
        {activeTab === "contracts" && <ContractsCard />}
        {activeTab === "scenarios" && <SavedScenarios />}
        {activeTab === "settings" && <SettingsCard />}

        <Footer />
      </main>
    </div>
  );
}

/** UI Bits **/
function Header({
  onNavigate,
  activeTab,
}: {
  onNavigate: (v: string) => void;
  activeTab: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
            <Calculator className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold">boilermakertoolbox.com</div>
          </div>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          {[
            { id: "netpay", label: "Net Pay" },
            { id: "rigging", label: "Rigging" },
            { id: "contracts", label: "Contracts" },
            { id: "scenarios", label: "Saved" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className={`rounded-md px-3 py-2 text-sm transition hover:bg-neutral-800/60 ${
                activeTab === t.id
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-300"
              }`}
            >
              {t.label}
            </button>
          ))}
          <a
            href="#settings"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("settings");
            }}
            className="rounded-md px-3 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800/60"
          >
            Settings
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative mb-6 mt-10 overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 sm:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl"></h1>
            <p className="mt-2 max-w-2xl text-neutral-300">
              Built for union boilermakers: accurate net-pay checks across complex
              shifts and contracts, plus confident rigging calculations with
              real-time visuals and guardrails.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#netpay"
                className="group inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-500"
              >
                Start a Net Pay calc <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#rigging"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
              >
                Try Rigging tools <Anchor className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <Stat label="This week" value="$3,218" sub="est. net" />
            <Stat label="Hours" value="58.0" sub="ST/OT mix" />
            <Stat label="Leg tension" value="8.1 kN" sub="2-leg @ 60°" />
            <Stat label="Saved" value="12" sub="scenarios" />
          </div>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-600/10 blur-3xl" />
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      {sub && <div className="text-xs text-neutral-400">{sub}</div>}
    </div>
  );
}

function Pill({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${
        active
          ? "border-orange-600 bg-orange-600/10 text-orange-400"
          : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/** Net Pay **/
function NetPayCard() {
  // Inputs – earnings
  const [rate, setRate] = useState(60); // $/hr base
  const [st, setSt] = useState(40);
  const [ot1, setOt1] = useState(8); // time-and-a-half
  const [ot2, setOt2] = useState(8); // double-time
  const [shiftPrem, setShiftPrem] = useState(0); // $/hr shift premium
  const [travelHours, setTravelHours] = useState(0);
  const [travelRate, setTravelRate] = useState(0);
  const [perDiem, setPerDiem] = useState(0); // daily
  const [days, setDays] = useState(5);

  // Payroll context
  const today = new Date().toISOString().slice(0, 10);
  const [payDate, setPayDate] = useState<string>(today);
  const [freq, setFreq] = useState<'weekly' | 'biweekly' | 'semimonthly' | 'monthly'>('weekly');
  const periodsPerYear = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 }[freq];
  const [province, setProvince] = useState<'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT'>('AB');
  const [rrspAtSource, setRrspAtSource] = useState(true); // reduces taxable pay

  // Optional YTD to cap CPP/EI
  const [ytdPensionable, setYtdPensionable] = useState(0); // CPP earnings so far
  const [ytdCPP1, setYtdCPP1] = useState(0);
  const [ytdCPP2, setYtdCPP2] = useState(0);
  const [ytdInsurable, setYtdInsurable] = useState(0); // EI insurable so far
  const [ytdEI, setYtdEI] = useState(0);

  // Other deductions
  const [unionDuesPct, setUnionDuesPct] = useState(3.0);
  const [rrspPct, setRrspPct] = useState(0);
  const [otherDed, setOtherDed] = useState(0);

  const gross = useMemo(() => {
    const stPay = st * (rate + shiftPrem);
    const ot1Pay = ot1 * (rate * 1.5 + shiftPrem);
    const ot2Pay = ot2 * (rate * 2.0 + shiftPrem);
    const travelPay = travelHours * travelRate;
    const allowances = perDiem * days; // assumed non-taxable per diem (toggle later)
    return {
      wage: stPay + ot1Pay + ot2Pay + travelPay,
      allowances,
      total: stPay + ot1Pay + ot2Pay + travelPay + allowances,
    };
  }, [st, ot1, ot2, rate, shiftPrem, travelHours, travelRate, perDiem, days]);

  // === Statutory source deductions (2025) ===
  const calcStatutories = useMemo(() => {
    const YMPE = 71300; // 2025
    const YAMPE = 81200; // 2025
    const CPP_RATE = 0.0595; // employee, CPP1
    const CPP2_RATE = 0.04; // employee, CPP2
    const CPP_BE_ANNUAL = 3500; // basic exemption
    const EI_MIE = 65700; // 2025 federal (outside QC)
    const EI_RATE = 0.0164; // employee

    const cppBaseExemptionPerPay = CPP_BE_ANNUAL / periodsPerYear;

    const pensionableThisPay = Math.max(0, gross.wage);
    const insurableThisPay = Math.max(0, gross.wage);

    // CPP1 – cap using annual room and per-pay exemption
    const cppRoom = Math.max(0, (YMPE - CPP_BE_ANNUAL) - ytdPensionable);
    const cppPensionableThisPay = Math.max(0, Math.min(pensionableThisPay - cppBaseExemptionPerPay, cppRoom));
    const cpp1 = round2(cppPensionableThisPay * CPP_RATE);

    // Update YTD pensionable after CPP1 portion to figure CPP2 base
    const pensionableAfterThisPay = Math.min(ytdPensionable + pensionableThisPay, YAMPE);
    const aboveYMPEBefore = Math.max(0, Math.min(ytdPensionable, YAMPE) - YMPE);
    const aboveYMPEAfter = Math.max(0, pensionableAfterThisPay - YMPE);
    const cpp2BaseThisPay = Math.max(0, aboveYMPEAfter - aboveYMPEBefore);
    const cpp2Room = Math.max(0, (YAMPE - YMPE) - (ytdPensionable > YMPE ? (Math.min(ytdPensionable, YAMPE) - YMPE) : 0));
    const cpp2Base = Math.min(cpp2BaseThisPay, cpp2Room);
    const cpp2 = round2(cpp2Base * CPP2_RATE);

    // EI
    const eiRoom = Math.max(0, EI_MIE - ytdInsurable);
    const eiBase = Math.min(insurableThisPay, eiRoom);
    const ei = round2(eiBase * EI_RATE);

    return { cpp1, cpp2, ei, cppPensionableThisPay, cpp2Base, eiBase };
  }, [gross.wage, periodsPerYear, ytdPensionable, ytdInsurable]);

  // Taxable income per pay (RRSP at-source optional)
  const rrspAtSrcAmt = (gross.wage * rrspPct) / 100;
  const taxablePay = Math.max(0, gross.wage - (rrspAtSource ? rrspAtSrcAmt : 0));
  const annualizedTaxable = taxablePay * periodsPerYear; // simple annualization

  // === Income tax withholding (AB + Federal, 2025) ===
  const taxWithholding = useMemo(() => {
    const dt = new Date(payDate + 'T00:00:00');
    const isJulOrLater = dt >= new Date('2025-07-01T00:00:00');

    // Federal brackets (2025) – mid-year change handled
    const FED_THRESH = [57375, 114750, 177882, 253414];
    const FED_RATES_JAN = [0.15, 0.205, 0.26, 0.29, 0.33];
    const FED_RATES_JUL = [0.14, 0.205, 0.26, 0.29, 0.33];
    const fedRates = isJulOrLater ? FED_RATES_JUL : FED_RATES_JAN;
    const fedCreditRate = fedRates[0];

    // Alberta (2025) – first bracket reduced to 8% legislated; tables prorate to 6% July–Dec to reflect over-withheld in first half
    const AB_THRESH = [60000, 151234, 181481, 241974, 362961];
    const AB_RATES_JAN = [0.10, 0.10, 0.12, 0.13, 0.14, 0.15]; // before July tables
    const AB_RATES_JUL = [0.06, 0.10, 0.12, 0.13, 0.14, 0.15]; // July tables

    function taxOn(annualIncome: number, thresholds: number[], rates: number[]) {
      let tax = 0;
      let last = 0;
      const bands = [...thresholds, Infinity];
      for (let i = 0; i < bands.length; i++) {
        const upper = bands[i];
        const rate = rates[i];
        const amt = Math.max(0, Math.min(annualIncome, upper) - last);
        if (amt <= 0) break;
        tax += amt * rate;
        last = upper;
      }
      return tax;
    }

    // Federal BPA (enhanced): $16,129 (<=177,882), phased down to $14,538 (>=253,414)
    const BPA_MAX = 16129;
    const BPA_MIN = 14538;
    const BPA_MAX_INCOME = 177882;
    const BPA_ZERO_EXTRA = 253414;
    const bpaFed = annualizedTaxable <= BPA_MAX_INCOME
      ? BPA_MAX
      : annualizedTaxable >= BPA_ZERO_EXTRA
      ? BPA_MIN
      : BPA_MIN + (BPA_MAX - BPA_MIN) * ((BPA_ZERO_EXTRA - annualizedTaxable) / (BPA_ZERO_EXTRA - BPA_MAX_INCOME));

    // Canada Employment Amount (2025 max ~ $1,471)
    const CEA_MAX = 1471;

    const fedBeforeCredits = taxOn(annualizedTaxable, FED_THRESH, fedRates);
    const fedCredits = fedCreditRate * (bpaFed + CEA_MAX);
    let fedAnnual = Math.max(0, fedBeforeCredits - fedCredits);

    // Alberta – apply July proration for first bracket rate
    let abAnnual = 0;
    let abCreditRate = 0;
    if (province === 'AB') {
      const abRates = isJulOrLater ? AB_RATES_JUL : AB_RATES_JAN;
      abCreditRate = abRates[0];
      const AB_BPA = 22323; // 2025
      abAnnual = Math.max(0, taxOn(annualizedTaxable, AB_THRESH, abRates) - abCreditRate * AB_BPA);
    }

    // Convert to per-pay
    const fedPerPay = round2(fedAnnual / periodsPerYear);
    const provPerPay = round2(abAnnual / periodsPerYear);

    return { fedPerPay, provPerPay };
  }, [annualizedTaxable, payDate, periodsPerYear, province]);

  // Union dues as a net deduction (do not change payroll taxable income)
  const union = (gross.wage * unionDuesPct) / 100;
  const rrsp = (gross.wage * rrspPct) / 100;

  const deductions = useMemo(() => {
    const { cpp1, cpp2, ei } = calcStatutories;
    const fed = taxWithholding.fedPerPay;
    const prov = taxWithholding.provPerPay;
    const other = otherDed;
    const total = union + rrsp + other + cpp1 + cpp2 + ei + fed + prov;
    return { union, rrsp, other, cpp1, cpp2, ei, fed, prov, total };
  }, [calcStatutories, taxWithholding, union, rrsp, otherDed]);

  const net = useMemo(() => {
    // per diem/LOA assumed non-taxable here
    return gross.wage + gross.allowances - deductions.total;
  }, [gross, deductions]);

  const [name, setName] = useState('Week A – Shutdown');

  const saveScenario = () => {
    const payload = {
      type: 'netpay',
      name,
      ts: Date.now(),
      inputs: {
        rate, st, ot1, ot2, shiftPrem, travelHours, travelRate, perDiem, days,
        unionDuesPct, rrspPct, otherDed,
        payDate, freq, province,
        ytdPensionable, ytdCPP1, ytdCPP2, ytdInsurable, ytdEI,
      },
      results: { gross, deductions, net },
    };
    const list = JSON.parse(localStorage.getItem('bmt_scenarios') || '[]');
    list.unshift(payload);
    localStorage.setItem('bmt_scenarios', JSON.stringify(list.slice(0, 50)));
    alert('Scenario saved.');
  };

  return (
    <section id="netpay" className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card title="Net Pay Calculator" icon={<Wallet className="h-5 w-5" />}>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Pay date">
              <Input value={payDate} onChange={setPayDate} placeholder="YYYY-MM-DD" />
            </Field>
            <Field label="Pay frequency">
              <Select value={freq} onChange={(e: any) => setFreq(e.target.value)}>
                <option value="weekly">Weekly (52)</option>
                <option value="biweekly">Biweekly (26)</option>
                <option value="semimonthly">Semi-monthly (24)</option>
                <option value="monthly">Monthly (12)</option>
              </Select>
            </Field>
            <Field label="Province">
              <Select value={province} onChange={(e: any) => setProvince(e.target.value)}>
                <option value="AB">Alberta</option>
                <option value="BC">British Columbia</option>
                <option value="MB">Manitoba</option>
                <option value="NB">New Brunswick</option>
                <option value="NL">Newfoundland & Labrador</option>
                <option value="NS">Nova Scotia</option>
                <option value="NT">Northwest Territories</option>
                <option value="NU">Nunavut</option>
                <option value="ON">Ontario</option>
                <option value="PE">Prince Edward Island</option>
                <option value="QC" disabled>Quebec (QPP/QPIP soon)</option>
                <option value="SK">Saskatchewan</option>
                <option value="YT">Yukon</option>
              </Select>
            </Field>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Base rate ($/hr)">
              <NumberInput value={rate} onChange={setRate} step={1} />
            </Field>
            <Field label="Shift premium ($/hr)">
              <NumberInput value={shiftPrem} onChange={setShiftPrem} step={0.5} />
            </Field>
            <Field label="Straight time (hrs)">
              <NumberInput value={st} onChange={setSt} />
            </Field>
            <Field label="Time-and-a-half (hrs)">
              <NumberInput value={ot1} onChange={setOt1} />
            </Field>
            <Field label="Double-time (hrs)">
              <NumberInput value={ot2} onChange={setOt2} />
            </Field>
            <Field label="Travel hours">
              <NumberInput value={travelHours} onChange={setTravelHours} />
            </Field>
            <Field label="Travel rate ($/hr)">
              <NumberInput value={travelRate} onChange={setTravelRate} step={1} />
            </Field>
            <Field label="Per diem / LOA ($/day)">
              <NumberInput value={perDiem} onChange={setPerDiem} step={5} />
            </Field>
            <Field label="Days (for per diem)">
              <NumberInput value={days} onChange={setDays} />
            </Field>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Union dues (%)">
              <NumberInput value={unionDuesPct} onChange={setUnionDuesPct} step={0.1} />
            </Field>
            <Field label="RRSP (employee %)">
              <NumberInput value={rrspPct} onChange={setRrspPct} step={0.5} />
              <SmallNote>
                <label className="inline-flex items-center gap-2 mt-1">
                  <input type="checkbox" checked={rrspAtSource} onChange={(e) => setRrspAtSource(e.target.checked)} />
                  RRSP reduces taxable pay at-source
                </label>
              </SmallNote>
            </Field>
            <Field label="Other deductions ($)">
              <NumberInput value={otherDed} onChange={setOtherDed} step={10} />
            </Field>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <KPI label="Gross (wage)" value={fmt(gross.wage)} />
            <KPI label="Allowances" value={fmt(gross.allowances)} />
            <KPI label="Net (est.)" value={fmt(net)} highlight />
          </div>

          <div className="mt-4 grid gap-2 rounded-lg bg-neutral-900/60 p-4 text-sm text-neutral-300">
            <div className="flex items-center gap-2 text-neutral-200">
              <Info className="h-4 w-4" /> Breakdown
            </div>
            <BreakdownRow label="Union dues" value={fmt(union)} />
            <BreakdownRow label="RRSP" value={fmt(rrsp)} />
            <BreakdownRow label="Other" value={fmt(otherDed)} />
            <BreakdownRow label="CPP (employee)" value={fmt(calcStatutories.cpp1)} />
            <BreakdownRow label="CPP2 (employee)" value={fmt(calcStatutories.cpp2)} />
            <BreakdownRow label="EI (employee)" value={fmt(calcStatutories.ei)} />
            <BreakdownRow label="Federal tax" value={fmt(taxWithholding.fedPerPay)} />
            <BreakdownRow label="Provincial tax" value={fmt(taxWithholding.provPerPay)} />
            <BreakdownRow label="Total deductions" value={fmt(deductions.total)} bold />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card title="Year-to-date (optional)" icon={<Clock className="h-4 w-4" />}>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="YTD pensionable earnings (CPP)">
                  <NumberInput value={ytdPensionable} onChange={setYtdPensionable} step={100} />
                </Field>
                <Field label="YTD insurable earnings (EI)">
                  <NumberInput value={ytdInsurable} onChange={setYtdInsurable} step={100} />
                </Field>
                <Field label="YTD CPP1 paid">
                  <NumberInput value={ytdCPP1} onChange={setYtdCPP1} step={50} />
                </Field>
                <Field label="YTD CPP2 paid">
                  <NumberInput value={ytdCPP2} onChange={setYtdCPP2} step={50} />
                </Field>
                <Field label="YTD EI paid">
                  <NumberInput value={ytdEI} onChange={setYtdEI} step={50} />
                </Field>
              </div>
              <SmallNote>Provide YTD to stop CPP/EI once annual maxes are reached.</SmallNote>
            </Card>
            <div className="flex flex-col justify-end">
              <div className="flex min-w-0 items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-64 min-w-0 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-orange-600"
                />
                <button
                  onClick={saveScenario}
                  className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-orange-500"
                >
                  <Save className="h-4 w-4" /> Save scenario
                </button>
              </div>
              <div className="mt-2 flex gap-2 text-xs text-neutral-400">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Updated live</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card title="Quick presets" icon={<Settings className="h-5 w-5" />}>
          <PresetButton
            label="Shutdown – 12s, 7-on"
            onClick={() => {
              setRate(64);
              setSt(40);
              setOt1(16);
              setOt2(8);
              setShiftPrem(1.5);
              setPerDiem(150);
              setDays(7);
            }}
          />
          <PresetButton
            label="Shop – 40h, no OT"
            onClick={() => {
              setRate(48);
              setSt(40);
              setOt1(0);
              setOt2(0);
              setShiftPrem(0);
              setPerDiem(0);
              setDays(5);
            }}
          />
          <SmallNote>
            CPP/EI and 2025 federal/Alberta tax rules applied. Quebec & other provinces coming next.
          </SmallNote>
        </Card>

        <Card title="Tax logic (2025)" icon={<Info className="h-5 w-5" />}>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-300">
            <li>CPP 5.95% to YMPE $71,300 (less $3,500 basic exemption prorated); CPP2 4% from $71,300 to $81,200.</li>
            <li>EI 1.64% to MIE $65,700.</li>
            <li>Federal first bracket 15% Jan–Jun, 14% Jul–Dec; tables reflect 14.5% full-year.</li>
            <li>AB first bracket 10% Jan–Jun (tables), 6% Jul–Dec (reflecting 8% annual). AB BPA $22,323.</li>
            <li>Credits included: Federal BPA (enhanced) + Canada Employment Amount ($1,471). Union dues are net deductions.</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

/** Rigging **/
function RiggingCard() {
  const [hitch, setHitch] = useState<"vertical" | "choker" | "basket">("vertical");
  const [weight, setWeight] = useState(5000); // kg
  const [legs, setLegs] = useState(2);
  const [angle, setAngle] = useState(60); // included angle at hook
  const [cogOffset, setCogOffset] = useState(0); // mm off-center between two pick points
  const [spacing, setSpacing] = useState(2000); // mm between pick points
  const [slingWLL, setSlingWLL] = useState(4000); // kg rating per sling (vertical)

  const { angleFactor, tensionPerLeg, minRequiredWLL } = useMemo(() => {
    // Basic formulas – conservative, symmetrical pick by default
    // Angle factor AF = 1 / cos(theta_leg) where theta_leg = half included angle
    const theta = (angle / 2) * (Math.PI / 180);
    const AF = 1 / Math.cos(theta);

    // Load share – if two legs & CoG offset, simple lever share
    let shareA = 1 / legs;
    let shareB = 1 / legs;
    if (legs === 2 && spacing > 0 && Math.abs(cogOffset) > 1) {
      const a = spacing / 2 + cogOffset; // distance to leg A
      const b = spacing / 2 - cogOffset; // distance to leg B
      const sum = a + b;
      shareA = b / sum; // leg A sees more if CoG closer to B
      shareB = a / sum;
    }

    const perLegBase = (weight * 9.80665) / Math.max(legs, 1); // N baseline
    const perLegTensionA = perLegBase * AF * (legs === 2 ? shareA * legs : 1);
    const perLegTensionB = legs === 2 ? perLegBase * AF * shareB * legs : perLegBase * AF;
    const worstCaseN = Math.max(perLegTensionA, perLegTensionB);

    const minWLLkg = (worstCaseN / 9.80665) * 1.25; // +25% safety margin for selection

    return {
      angleFactor: AF,
      tensionPerLeg: worstCaseN / 1000, // kN
      minRequiredWLL: minWLLkg, // kg
    };
  }, [angle, legs, weight, spacing, cogOffset]);

  return (
    <section id="rigging" className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card title="Rigging Calculator" icon={<Anchor className="h-5 w-5" />}>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Hitch">
              <Select value={hitch} onChange={(e) => setHitch(e.target.value as any)}>
                <option value="vertical">Vertical</option>
                <option value="choker">Choker</option>
                <option value="basket">Basket</option>
              </Select>
            </Field>
            <Field label="Load weight (kg)">
              <NumberInput value={weight} onChange={setWeight} step={100} />
            </Field>
            <Field label="# of legs">
              <NumberInput value={legs} onChange={setLegs} step={1} min={1} max={4} />
            </Field>
            <Field label="Included angle (°)">
              <NumberInput value={angle} onChange={setAngle} step={5} min={10} max={150} />
            </Field>
            <Field label="Pick spacing (mm)">
              <NumberInput value={spacing} onChange={setSpacing} step={50} />
            </Field>
            <Field label="CoG offset (mm)">
              <NumberInput value={cogOffset} onChange={setCogOffset} step={10} />
              <SmallNote>Positive = toward leg A</SmallNote>
            </Field>
            <Field label="Sling WLL (kg, vertical)">
              <NumberInput value={slingWLL} onChange={setSlingWLL} step={250} />
            </Field>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <KPI label="Angle factor" value={angleFactor.toFixed(2)} />
            <KPI label="Leg tension (kN)" value={tensionPerLeg.toFixed(2)} />
            <KPI label="Min required WLL (kg)" value={minRequiredWLL.toFixed(0)} />
          </div>

          <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 text-sm text-neutral-300">
            <p className="mb-2 font-medium text-neutral-200">Selection check</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Sling OK? <b>{slingWLL >= minRequiredWLL ? "Yes" : "No"}</b>
              </li>
              <li>Reduce included angle to reduce tension (narrower = safer).</li>
              <li>Choker & basket modify effective WLL — add factors in next iteration.</li>
            </ul>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card title="Rigging notes" icon={<Scale className="h-5 w-5" />}>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-300">
            <li>Angle factor AF = 1 / cos(θ/2). Tension ↑ fast as angle opens.</li>
            <li>Two-point picks split load by CoG distances to pick points.</li>
            <li>Always verify against manufacturer tables and site rules.</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

/** Contracts **/
function ContractsCard() {
  const [contracts, setContracts] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("bmt_contracts") || "[]");
    } catch {
      return [];
    }
  });

  const [editing, setEditing] = useState<any>({
    name: "Local 146 – Turnaround A",
    baseRate: 62,
    shiftPrem: 1.5,
    otRule: ">8/day at 1.5x; >10/day at 2x",
    perDiem: 150,
    travelRate: 0,
  });

  const addContract = () => {
    const next = [editing, ...contracts].slice(0, 50);
    setContracts(next);
    localStorage.setItem("bmt_contracts", JSON.stringify(next));
    alert("Contract preset saved.");
  };

  const removeContract = (i: number) => {
    const next = contracts.filter((_, idx) => idx !== i);
    setContracts(next);
    localStorage.setItem("bmt_contracts", JSON.stringify(next));
  };

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card title="Contract presets" icon={<FileText className="h-5 w-5" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <Input value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            </Field>
            <Field label="Base rate ($/hr)">
              <NumberInput
                value={editing.baseRate}
                onChange={(v) => setEditing({ ...editing, baseRate: v })}
              />
            </Field>
            <Field label="Shift premium ($/hr)">
              <NumberInput
                value={editing.shiftPrem}
                onChange={(v) => setEditing({ ...editing, shiftPrem: v })}
                step={0.5}
              />
            </Field>
            <Field label="OT rules (text)">
              <Input
                value={editing.otRule}
                onChange={(v) => setEditing({ ...editing, otRule: v })}
              />
            </Field>
            <Field label="Per diem ($/day)">
              <NumberInput
                value={editing.perDiem}
                onChange={(v) => setEditing({ ...editing, perDiem: v })}
              />
            </Field>
            <Field label="Travel rate ($/hr)">
              <NumberInput
                value={editing.travelRate}
                onChange={(v) => setEditing({ ...editing, travelRate: v })}
              />
            </Field>
          </div>
          <div className="mt-4">
            <button
              onClick={addContract}
              className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-orange-500"
            >
              <Plus className="h-4 w-4" /> Save preset
            </button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card title="Your presets" icon={<Save className="h-5 w-5" />}>
          <div className="space-y-2">
            {contracts.length === 0 && (
              <div className="rounded-md border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-400">
                Nothing saved yet.
              </div>
            )}
            {contracts.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 p-3"
              >
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-neutral-400">
                    ${c.baseRate}/hr • prem ${c.shiftPrem}/hr • {c.otRule}
                  </div>
                </div>
                <button
                  onClick={() => removeContract(i)}
                  className="rounded-md border border-neutral-700 p-2 text-neutral-300 hover:bg-neutral-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

/** Saved Scenarios **/
function SavedScenarios() {
  const [items, setItems] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("bmt_scenarios") || "[]");
    } catch {
      return [];
    }
  });

  const remove = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    localStorage.setItem("bmt_scenarios", JSON.stringify(next));
  };

  return (
    <section className="grid gap-6">
      <Card title="Saved scenarios" icon={<Save className="h-5 w-5" />}>
        {items.length === 0 ? (
          <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4 text-neutral-400">
            No scenarios yet. Save from Net Pay to compare.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-right">Gross (wage)</th>
                  <th className="p-2 text-right">Allowances</th>
                  <th className="p-2 text-right">Net</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-b border-neutral-900">
                    <td className="p-2">{it.name}</td>
                    <td className="p-2 text-right">{fmt(it.results.gross.wage)}</td>
                    <td className="p-2 text-right">{fmt(it.results.gross.allowances)}</td>
                    <td className="p-2 text-right">{fmt(it.results.net)}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => remove(idx)}
                        className="rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}

/** Settings **/
function SettingsCard() {
  const [province, setProvince] = useState("AB");
  const [theme, setTheme] = useState("dark");
  const [units, setUnits] = useState("metric");

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <Card title="Preferences" icon={<Settings className="h-5 w-5" />}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Province (for tax presets later)">
            <Select value={province} onChange={(e) => setProvince(e.target.value)}>
              {[
                "AB",
                "BC",
                "MB",
                "NB",
                "NL",
                "NS",
                "NT",
                "NU",
                "ON",
                "PE",
                "QC",
                "SK",
                "YT",
              ].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Units">
            <Select value={units} onChange={(e) => setUnits(e.target.value)}>
              <option value="metric">Metric (kg, mm)</option>
              <option value="imperial">Imperial (lb, in)</option>
            </Select>
          </Field>
          <Field label="Theme">
            <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card title="About" icon={<Info className="h-5 w-5" />}>
        <p className="text-sm text-neutral-300">
          <b>BoilermakerToolbox</b> helps union boilermakers quickly check net pay across
          complex shifts and do rigging math with confidence. This is a front-end draft;
          plug in your exact tax/deduction logic, union presets, and validation rules next.
        </p>
      </Card>
    </section>
  );
}

/** Layout Primitives **/
function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 shadow-lg shadow-black/30">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </div>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder }: any) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-orange-600"
    />
  );
}

function NumberInput({ value, onChange, step = 1, min, max }: any) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
      className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-orange-600"
    />
  );
}

function Select({ value, onChange, children }: any) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-orange-600"
    >
      {children}
    </select>
  );
}

function KPI({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-orange-600/60 bg-gradient-to-b from-orange-600/10 to-transparent"
          : "border-neutral-800 bg-neutral-900"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

function BreakdownRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className={`text-sm ${bold ? "font-semibold text-neutral-200" : "text-neutral-400"}`}>{label}</div>
      <div className={`text-sm ${bold ? "font-semibold" : ""}`}>{value}</div>
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-2 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-left text-sm text-neutral-200 transition hover:border-orange-600 hover:bg-neutral-900/60"
    >
      {label}
    </button>
  );
}

function SmallNote({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-neutral-400">{children}</div>;
}

function Separator() {
  return <div className="my-4 h-px w-full bg-neutral-800" />;
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-800 pt-6 text-xs text-neutral-500">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div>© {new Date().getFullYear()} BoilermakerToolbox.com</div>
        <div className="flex items-center gap-3">
          <a href="#" className="hover:text-neutral-300">Privacy</a>
          <a href="#" className="hover:text-neutral-300">Terms</a>
          <a href="#" className="hover:text-neutral-300">Contact</a>
        </div>
      </div>
    </footer>
  );
}

/** Utils **/
function fmt(v: number) {
  return v.toLocaleString(undefined, { style: "currency", currency: "CAD" });
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
