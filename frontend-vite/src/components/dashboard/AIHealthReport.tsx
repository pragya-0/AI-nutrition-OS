import { useState, type ElementType, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Info,
  Moon,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

const AI_BRAIN = "/assets/AI-Brain.png";
const HEALTH_SYMBOL = "/assets/Health Care Symbol.png";

type SummaryItem = {
  label: string;
  value: string;
  status: string;
  icon: ElementType;
  color: string;
};

type Achievement = {
  title: string;
  text: string;
  icon: ElementType;
  color: string;
};

type Highlight = {
  text: string;
  icon: ElementType;
  color: string;
};

type Comparison = {
  label: string;
  value: string;
  sub: string;
  icon: ElementType;
  color: string;
};

type Milestone = {
  label: string;
  progress: number;
};

const tabs = [
  "Overview",
  "Achievements",
  "Trends",
  "Comparisons",
  "Recommendations",
];

const weeklySummary: SummaryItem[] = [
  {
    label: "Consistency",
    value: "92%",
    status: "Excellent",
    icon: ShieldCheck,
    color: "#A6FF4D",
  },
  {
    label: "Nutrition",
    value: "85%",
    status: "Good",
    icon: HeartPulse,
    color: "#18D3D0",
  },
  {
    label: "Activity",
    value: "88%",
    status: "Excellent",
    icon: Dumbbell,
    color: "#A875FF",
  },
  {
    label: "Recovery",
    value: "84%",
    status: "Good",
    icon: Flame,
    color: "#FFB347",
  },
  {
    label: "Lifestyle",
    value: "90%",
    status: "Excellent",
    icon: Sparkles,
    color: "#A6FF4D",
  },
];

const achievements: Achievement[] = [
  {
    title: "7 Day Streak",
    text: "Logged your meals for 7 days in a row",
    icon: Trophy,
    color: "#FFB347",
  },
  {
    title: "Protein Goal Crusher",
    text: "Hit your protein goal 5 days this week",
    icon: Star,
    color: "#FFB347",
  },
  {
    title: "Hydration Hero",
    text: "Reached 80% hydration goal 6 days",
    icon: HeartPulse,
    color: "#18D3D0",
  },
  {
    title: "Early Bird",
    text: "Slept before 11 PM 5 nights this week",
    icon: Moon,
    color: "#7BE929",
  },
];

const highlights: Highlight[] = [
  {
    text: "Average calorie intake was in your target range",
    icon: ShieldCheck,
    color: "#7BE929",
  },
  {
    text: "Protein intake improved by 15% vs last week",
    icon: ArrowUp,
    color: "#A6FF4D",
  },
  {
    text: "Your sleep quality improved by 12%",
    icon: Moon,
    color: "#A875FF",
  },
  {
    text: "You burned 1,120 more calories through activity",
    icon: Flame,
    color: "#FFB347",
  },
  {
    text: "Hydration was consistent and on point",
    icon: HeartPulse,
    color: "#18D3D0",
  },
];

const comparisons: Comparison[] = [
  {
    label: "Calories",
    value: "-120",
    sub: "kcal/day",
    icon: Flame,
    color: "#FFB347",
  },
  {
    label: "Protein",
    value: "+18g",
    sub: "g/day",
    icon: Dumbbell,
    color: "#A6FF4D",
  },
  {
    label: "Workouts",
    value: "+6",
    sub: "sessions",
    icon: Footprints,
    color: "#18D3D0",
  },
  {
    label: "Steps",
    value: "+9,420",
    sub: "steps/day",
    icon: Footprints,
    color: "#7BE929",
  },
  {
    label: "Sleep",
    value: "+45m",
    sub: "hrs/night",
    icon: Moon,
    color: "#A875FF",
  },
];

const milestones: Milestone[] = [
  { label: "Reach 65 kg", progress: 60 },
  { label: "Hit 10k steps daily", progress: 80 },
  { label: "Sleep 7h average", progress: 70 },
];

export default function AIHealthReport() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [range, setRange] = useState("12 May – 18 May 2024");
  const [downloaded, setDownloaded] = useState(false);

  return (
    <section className="relative overflow-x-hidden bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 shadow-[0_0_80px_rgba(166,255,77,0.08)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />

        <div className="relative z-10">
          <Header
            range={range}
            setRange={setRange}
            downloaded={downloaded}
            onDownload={() => setDownloaded(true)}
          />

          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="mt-4 grid items-start gap-4 xl:grid-cols-[1.04fr_0.9fr_0.9fr_0.9fr_1fr]">
            <HealthScoreCard />
            <WeeklySummary />
            <TopAchievements />
            <WeekHighlights />
            <ReportSummary />
          </div>

          <div className="mt-4 grid items-start gap-4 xl:grid-cols-[1.16fr_0.85fr_1.2fr]">
            <HealthScoreTrend />
            <WeightProgress />
            <BodyComposition />
          </div>

          <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[1.35fr_0.62fr_0.95fr]">
            <MonthlyComparison />
            <NextMilestones />
            <AIRecommendationSummary />
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({
  range,
  setRange,
  downloaded,
  onDownload,
}: {
  range: string;
  setRange: (value: string) => void;
  downloaded: boolean;
  onDownload: () => void;
}) {
  const [shared, setShared] = useState(false);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
      

        <div>
          <h2 className="flex items-center gap-3 text-[28px] font-black uppercase leading-none tracking-[0.02em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
            AI Health Report
            <Sparkles className="text-[#A6FF4D]" size={24} />
          </h2>

          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
            Your personalized health report & achievements
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-bold text-white/85">
          <CalendarDays size={17} />
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="bg-transparent text-white outline-none"
          >
            <option className="bg-[#07110A]">12 May – 18 May 2024</option>
            <option className="bg-[#07110A]">19 May – 25 May 2024</option>
            <option className="bg-[#07110A]">This Month</option>
          </select>
        </label>

        <button
          onClick={() => setShared(true)}
          className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white transition hover:border-[#18D3D0]/40 hover:text-[#18D3D0]"
        >
          <Share2 size={17} />
          {shared ? "Shared" : "Share Report"}
        </button>

        <button
          onClick={onDownload}
          className="inline-flex items-center gap-3 rounded-2xl bg-[#A6FF4D] px-5 py-3 text-[13px] font-black text-black shadow-[0_0_34px_rgba(166,255,77,.28)] transition hover:scale-[1.02]"
        >
          <Download size={17} />
          {downloaded ? "Downloaded" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}

function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-4 border-b border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative flex items-center gap-2 px-3 pb-3 text-[13px] font-bold transition ${
            activeTab === tab
              ? "text-[#A6FF4D]"
              : "text-white/70 hover:text-white"
          }`}
        >
          {tab === "Overview" && <Sparkles size={15} />}
          {tab === "Achievements" && <Star size={15} />}
          {tab === "Trends" && <RefreshCcw size={15} />}
          {tab === "Comparisons" && <BarIcon />}
          {tab === "Recommendations" && <ShieldCheck size={15} />}

          {tab}

          {activeTab === tab && (
            <span className="absolute bottom-[-1px] left-0 h-[2px] w-full rounded-full bg-[#A6FF4D] shadow-[0_0_16px_rgba(166,255,77,.7)]" />
          )}
        </button>
      ))}
    </div>
  );
}

function HealthScoreCard() {
  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="Health Score" icon={Info} />

      <div className="grid place-items-center">
        <div
          className="grid h-[155px] w-[155px] place-items-center rounded-full shadow-[0_0_55px_rgba(166,255,77,.25)]"
          style={{
            background:
              "conic-gradient(#18D3D0 0deg 56deg,#A6FF4D 56deg 306deg,#F5E642 306deg 340deg,rgba(255,255,255,.08) 340deg)",
          }}
        >
          <div className="grid h-[116px] w-[116px] place-items-center rounded-full bg-[#07110A] text-center">
            <div>
              <p className="text-[42px] font-black leading-none text-white">
                87
              </p>
              <p className="mt-1.5 text-[14px] font-bold text-[#A6FF4D]">
                Excellent
              </p>
            </div>
          </div>
        </div>

        <p className="mt-2 rounded-xl bg-[#A6FF4D]/8 px-3 py-1 text-[11px] text-white/80">
          <span className="text-[#A6FF4D]">↑ 6 points</span> vs last week
        </p>
      </div>

      <MiniHealthChart />
    </Card>
  );
}

function WeeklySummary() {
  const [selected, setSelected] = useState("Consistency");

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="Weekly Summary" icon={Info} />

      <div className="space-y-2.5">
        {weeklySummary.map((item) => {
          const Icon = item.icon;
          const active = selected === item.label;

          return (
            <button
              key={item.label}
              onClick={() => setSelected(item.label)}
              className={`flex w-full items-center gap-3 border-b border-white/8 pb-2.5 text-left transition last:border-0 ${
                active ? "text-white" : "opacity-85 hover:opacity-100"
              }`}
            >
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-white/[0.04]"
                style={{
                  color: item.color,
                  borderColor: active ? item.color : `${item.color}30`,
                }}
              >
                <Icon size={15} />
              </div>

              <p className="min-w-0 flex-1 text-[13px] font-black text-white">
                {item.label}
              </p>

              <p className="text-[14px] font-black text-white">{item.value}</p>

              <p className="text-[11px] text-[#A6FF4D]">{item.status}</p>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[12px] text-white/75">
        <span className="mr-2 text-[#A6FF4D]">✧</span>
        Great week! Keep it up 💚
      </p>
    </Card>
  );
}

function TopAchievements() {
  const [checked, setChecked] = useState<string[]>(
    achievements.map((achievement) => achievement.title),
  );

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="Top Achievements" icon={Info} />

      <div className="space-y-2.5">
        {achievements.map((item) => {
          const Icon = item.icon;
          const isChecked = checked.includes(item.title);

          return (
            <button
              key={item.title}
              onClick={() =>
                setChecked((prev) =>
                  prev.includes(item.title)
                    ? prev.filter((title) => title !== item.title)
                    : [...prev, item.title],
                )
              }
              className="flex w-full gap-3 border-b border-white/8 pb-2.5 text-left transition hover:bg-white/[0.02] last:border-0"
            >
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border bg-white/[0.04]"
                style={{
                  color: item.color,
                  borderColor: `${item.color}40`,
                }}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-black text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-white/65">
                  {item.text}
                </p>
              </div>

              <CheckCircle2
                size={16}
                className={`shrink-0 ${
                  isChecked ? "text-[#A6FF4D]" : "text-white/20"
                }`}
              />
            </button>
          );
        })}
      </div>

      <button className="mt-2 flex w-full items-center justify-end gap-2 text-[12px] font-black text-[#A6FF4D]">
        View All Achievements <ArrowRight size={14} />
      </button>
    </Card>
  );
}

function WeekHighlights() {
  const [selected, setSelected] = useState(highlights[0].text);

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="This Week Highlights" />

      <div className="space-y-2.5">
        {highlights.map((item) => {
          const Icon = item.icon;
          const active = selected === item.text;

          return (
            <button
              key={item.text}
              onClick={() => setSelected(item.text)}
              className={`flex w-full gap-3 border-b border-white/8 pb-2.5 text-left transition last:border-0 ${
                active ? "opacity-100" : "opacity-80 hover:opacity-100"
              }`}
            >
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-white/[0.04]"
                style={{
                  color: item.color,
                  borderColor: active ? item.color : `${item.color}30`,
                }}
              >
                <Icon size={15} />
              </div>

              <p className="text-[12px] leading-5 text-white/75">
                {item.text}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function ReportSummary() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="Health Report Summary" />

      <img
        src={HEALTH_SYMBOL}
        alt="Health report trophy"
        className="mx-auto h-[175px] w-[175px] object-contain drop-shadow-[0_0_40px_rgba(166,255,77,.38)]"
      />

      <p className="mt-3 text-[12px] leading-5 text-white/75">
        You&apos;re building a strong, balanced and sustainable healthy
        lifestyle.
      </p>
      <p className="mt-1.5 text-[12px] leading-5 text-white/75">
        Keep going, Isha! You&apos;re doing amazing.
      </p>

      {open && (
        <p className="mt-2 rounded-xl border border-[#A6FF4D]/25 bg-[#A6FF4D]/5 px-3 py-2 text-[11px] leading-4 text-white/75">
          Detailed report unlocked: your strongest wins are consistency,
          protein improvement and sleep recovery.
        </p>
      )}

      <button
        onClick={() => setOpen((value) => !value)}
        className="mt-3 flex w-full items-center justify-between rounded-xl border border-[#A6FF4D]/30 bg-[#A6FF4D]/5 px-4 py-2.5 text-[12px] font-black text-[#A6FF4D]"
      >
        {open ? "Hide Detailed Report" : "View Detailed Report"}
        <ArrowRight size={15} />
      </button>
    </Card>
  );
}

function HealthScoreTrend() {
  return (
    <Card className="h-[250px] overflow-hidden">
      <CardTitle title="Health Score Trend" icon={Info} right="Last 8 Weeks" />
      <LineChart
        data={[62, 65, 68, 72, 75, 79, 81, 87]}
        color="#A6FF4D"
        labels={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]}
      />
      <p className="mt-1 text-[12px] text-white/75">
        <span className="mr-2 text-[#A6FF4D]">✧</span>
        Your health score improved by 25 points in 8 weeks{" "}
        <span className="text-[#A6FF4D]">↑</span>
      </p>
    </Card>
  );
}

function WeightProgress() {
  return (
    <Card className="h-[250px] overflow-hidden">
      <CardTitle title="Weight Progress" icon={Info} right="This Month" />

      <p className="text-[24px] font-black leading-none text-white">
        70.0 <span className="text-[14px] font-medium text-white/65">kg</span>
      </p>
      <p className="mt-1 text-[11px] font-bold text-[#A6FF4D]">
        ↓ 2.4 kg vs last month
      </p>

      <LineChart
        data={[72, 71, 70.8, 70.5, 70.7, 70.2, 70, 69.8, 70]}
        color="#18D3D0"
        labels={["20 Apr", "27 Apr", "4 May", "11 May", "18 May"]}
        compact
      />

      <div className="mt-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="mb-2 flex justify-between text-[11px]">
          <span className="text-white/65">Goal: 65.0 kg</span>
          <span className="font-bold text-white">Progress: 60%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div className="h-full w-[60%] rounded-full bg-[#18D3D0]" />
        </div>
      </div>
    </Card>
  );
}

function BodyComposition() {
  return (
    <Card className="h-[250px] overflow-hidden">
      <CardTitle
        title="Body Composition Overview"
        icon={Info}
        right="This Month"
      />

      <div className="grid items-center gap-4 md:grid-cols-[150px_1fr]">
        <div className="relative mx-auto h-[135px] w-[135px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(#A6FF4D 0deg 258deg,#FFB347 258deg 333deg,#38BDF8 333deg 360deg)",
            }}
          />
          <div className="absolute inset-[22px] grid place-items-center rounded-full bg-[#07110A] text-center">
            <div>
              <p className="text-[20px] font-black">70.0 kg</p>
              <p className="text-[11px] text-white/65">Total Weight</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <BodyLegend
            color="#A6FF4D"
            label="Muscle Mass"
            value="50.2 kg"
            sub="(71.7%)"
          />
          <BodyLegend
            color="#FFB347"
            label="Fat Mass"
            value="14.6 kg"
            sub="(20.9%)"
          />
          <BodyLegend
            color="#38BDF8"
            label="Water Weight"
            value="5.2 kg"
            sub="(7.4%)"
          />
        </div>
      </div>

      <div className="mt-3 grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-3">
        <CompositionStat label="Muscle Mass" value="↑ 0.8 kg" color="#A6FF4D" />
        <CompositionStat label="Fat Mass" value="↓ 1.6 kg" color="#FF6C7D" />
        <CompositionStat
          label="Water Weight"
          value="↑ 0.4 kg"
          color="#18D3D0"
        />
      </div>
    </Card>
  );
}

function MonthlyComparison() {
  const [selected, setSelected] = useState("Calories");

  return (
    <Card className="h-full min-h-[185px] overflow-hidden">
      <div className="mb-3 flex items-center gap-3">
        <p className="text-[14px] font-black uppercase tracking-[0.1em] text-[#A6FF4D]">
          Monthly Comparison
        </p>
        <Info size={14} className="text-white/55" />
        <span className="text-[11px] text-white/55">vs Previous Month</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {comparisons.map((item) => {
          const Icon = item.icon;
          const active = selected === item.label;

          return (
            <button
              key={item.label}
              onClick={() => setSelected(item.label)}
              className={`h-[104px] rounded-2xl border p-3.5 text-left transition ${
                active
                  ? "border-[#A6FF4D]/40 bg-[#A6FF4D]/8"
                  : "border-white/10 bg-white/[0.04] hover:border-[#A6FF4D]/25"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} style={{ color: item.color }} />
                <p className="text-[12px] font-bold text-white/80">
                  {item.label}
                </p>
              </div>

              <p className="mt-3 text-[21px] font-black leading-none text-white">
                {item.value}
              </p>

              <p className="mt-2 text-[11px] text-white/60">
                <span className="text-[#A6FF4D]">↑</span> {item.sub}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function NextMilestones() {
  const [completed, setCompleted] = useState<string[]>([]);

  return (
    <Card className="h-full min-h-[185px] overflow-hidden">
      <CardTitle title="Next Milestones" icon={Info} />

      <div className="space-y-2.5">
        {milestones.map((item) => {
          const done = completed.includes(item.label);

          return (
            <button
              key={item.label}
              onClick={() =>
                setCompleted((prev) =>
                  prev.includes(item.label)
                    ? prev.filter((label) => label !== item.label)
                    : [...prev, item.label],
                )
              }
              className="w-full text-left"
            >
              <div className="mb-1.5 flex justify-between text-[12px]">
                <p className={done ? "text-[#A6FF4D]" : "text-white/80"}>
                  {item.label}
                </p>
                <p className="font-black text-white">{item.progress}%</p>
              </div>

              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#A6FF4D] transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function AIRecommendationSummary() {
  const [selectedTip, setSelectedTip] = useState("Increase strength training");

  return (
    <Card className="h-full min-h-[185px] overflow-hidden">
      <div className="grid h-full items-center gap-3 md:grid-cols-[1fr_170px]">
        <div>
          <CardTitle title="AI Recommendation Summary" icon={Info} />

          <p className="mt-0 text-[11px] text-white/60">
            Based on your progress, AI suggests:
          </p>

          <div className="mt-2 space-y-1.5">
            <RecommendationLine
              icon={Sparkles}
              text="Increase strength training"
              sub="2–3 times per week"
              active={selectedTip === "Increase strength training"}
              onClick={() => setSelectedTip("Increase strength training")}
            />
            <RecommendationLine
              icon={ShieldCheck}
              text="Add more fiber-rich foods"
              sub="for better gut health"
              active={selectedTip === "Add more fiber-rich foods"}
              onClick={() => setSelectedTip("Add more fiber-rich foods")}
            />
            <RecommendationLine
              icon={Moon}
              text="Maintain your sleep routine"
              sub="for improved recovery"
              active={selectedTip === "Maintain your sleep routine"}
              onClick={() => setSelectedTip("Maintain your sleep routine")}
            />
          </div>
        </div>

        <img
          src={AI_BRAIN}
          alt="AI recommendation brain"
          className="mx-auto h-[160px] w-[160px] object-contain drop-shadow-[0_0_40px_rgba(24,211,208,.4)]"
        />
      </div>
    </Card>
  );
}

function RecommendationLine({
  icon: Icon,
  text,
  sub,
  active,
  onClick,
}: {
  icon: ElementType;
  text: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full gap-2 rounded-xl p-1 text-left transition ${
        active ? "bg-[#A6FF4D]/8" : "hover:bg-white/[0.04]"
      }`}
    >
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#A6FF4D]/10 text-[#A6FF4D]">
        <Icon size={14} />
      </div>

      <div>
        <p className="text-[11px] font-black leading-4 text-white">{text}</p>
        <p className="text-[10px] leading-4 text-white/60">{sub}</p>
      </div>
    </button>
  );
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[22px] border border-white/10 bg-[#07110A]/70 p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({
  title,
  icon: Icon,
  right,
}: {
  title: string;
  icon?: ElementType;
  right?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <p className="text-[14px] font-black uppercase tracking-[0.1em] text-[#A6FF4D]">
          {title}
        </p>
        {Icon && <Icon size={14} className="text-white/55" />}
      </div>

      {right && (
        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-bold text-white/75">
          {right}
          <ChevronDown size={13} />
        </button>
      )}
    </div>
  );
}

function MiniHealthChart() {
  const data = [58, 68, 70, 75, 80, 81, 87];

  return (
    <svg viewBox="0 0 300 78" className="mt-3 h-[78px] w-full overflow-visible">
      {[0, 1, 2].map((line) => (
        <line
          key={line}
          x1="20"
          x2="285"
          y1={16 + line * 22}
          y2={16 + line * 22}
          stroke="rgba(255,255,255,.08)"
        />
      ))}

      <path
        d={`M 22,68 ${data
          .map((value, index) => {
            const x = 22 + index * 43;
            const y = 68 - ((value - 40) / 60) * 52;
            return `L ${x},${y}`;
          })
          .join(" ")} L 280,68 Z`}
        fill="rgba(166,255,77,.12)"
      />

      <polyline
        points={data
          .map((value, index) => {
            const x = 22 + index * 43;
            const y = 68 - ((value - 40) / 60) * 52;
            return `${x},${y}`;
          })
          .join(" ")}
        fill="none"
        stroke="#A6FF4D"
        strokeWidth="2.5"
      />

      {data.map((value, index) => {
        const x = 22 + index * 43;
        const y = 68 - ((value - 40) / 60) * 52;
        return <circle key={index} cx={x} cy={y} r="4" fill="#A6FF4D" />;
      })}
    </svg>
  );
}

function LineChart({
  data,
  color,
  labels,
  compact,
}: {
  data: number[];
  color: string;
  labels: string[];
  compact?: boolean;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const viewHeight = compact ? 120 : 135;
  const chartBottom = compact ? 104 : 116;
  const chartRange = compact ? 70 : 82;

  return (
    <svg
      viewBox={`0 0 520 ${viewHeight}`}
      className={`${compact ? "h-[115px]" : "h-[130px]"} mt-2 w-full overflow-visible`}
    >
      {[0, 1, 2].map((line) => (
        <line
          key={line}
          x1="30"
          x2="500"
          y1={26 + line * 34}
          y2={26 + line * 34}
          stroke="rgba(255,255,255,.08)"
        />
      ))}

      <path
        d={`M 32,${chartBottom} ${data
          .map((value, index) => {
            const x = 32 + index * (450 / Math.max(data.length - 1, 1));
            const y =
              chartBottom -
              ((value - min) / (max - min || 1)) * chartRange;
            return `L ${x},${y}`;
          })
          .join(" ")} L 482,${chartBottom} Z`}
        fill={color}
        opacity="0.12"
      />

      <polyline
        points={data
          .map((value, index) => {
            const x = 32 + index * (450 / Math.max(data.length - 1, 1));
            const y =
              chartBottom -
              ((value - min) / (max - min || 1)) * chartRange;
            return `${x},${y}`;
          })
          .join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="3"
        filter={`drop-shadow(0 0 10px ${color})`}
      />

      {data.map((value, index) => {
        const x = 32 + index * (450 / Math.max(data.length - 1, 1));
        const y =
          chartBottom - ((value - min) / (max - min || 1)) * chartRange;
        return <circle key={index} cx={x} cy={y} r="5" fill={color} />;
      })}

      {labels.map((label, index) => (
        <text
          key={`${label}-${index}`}
          x={34 + index * (450 / Math.max(labels.length - 1, 1))}
          y={compact ? "118" : "132"}
          fill="rgba(255,255,255,.65)"
          fontSize="11"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

function BodyLegend({
  color,
  label,
  value,
  sub,
}: {
  color: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-3 text-[12px] text-white/80">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        {label}
      </p>
      <p className="text-[12px] font-black text-white">{value}</p>
      <p className="text-[11px] text-white/60">{sub}</p>
    </div>
  );
}

function CompositionStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <p className="text-[12px] text-white/70">
      {label}{" "}
      <span className="font-black" style={{ color }}>
        {value}
      </span>
    </p>
  );
}

function BarIcon() {
  return (
    <span className="grid h-[15px] w-[15px] place-items-center rounded border border-white/25 text-[9px]">
      ↔
    </span>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_22%_42%,rgba(24,211,208,0.08),transparent_34%),radial-gradient(circle_at_78%_58%,rgba(166,255,77,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}