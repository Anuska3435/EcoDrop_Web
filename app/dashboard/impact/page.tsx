import { redirect } from "next/navigation";
import { FiAward, FiBarChart2, FiFeather, FiTrendingUp } from "react-icons/fi";
import type { IconType } from "react-icons";
import { getDashboardSummary, getUserReports, type DashboardSummary, type ReportRecord } from "@/lib/api/protected";
import { getTokenCookie } from "@/lib/cookies";

const weights: Record<string, number> = { Laptop: 25, Mobile: 12, Monitor: 18, Appliance: 22, Battery: 4, Accessory: 3 };

type StatValue = string | number;

function StatCard({ label, value, Icon }: { label: string; value: StatValue; Icon: IconType }) {
    return (
        <article className="rounded-[18px] bg-white p-5 shadow-[0_10px_30px_rgba(39,59,38,.06)]">
            <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#eef6e7] text-[#648c37]"><Icon size={20} /></span>
                <div className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#697269]">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-[#263129]">{value}</p>
                </div>
            </div>
        </article>
    );
}

function SavingsCard({ label, value }: { label: string; value: string }) {
    return <div className="rounded-[14px] bg-white p-4 text-center shadow-[0_6px_20px_rgba(39,59,38,.04)]"><p className="text-sm font-semibold text-[#263129]">{value}</p><p className="mt-1 text-xs text-[#6b6f64]">{label}</p></div>;
}

function ProgressBar({ progress = 30 }: { progress?: number }) {
    return <div className="mt-4 h-3 w-full rounded-full bg-[#eaf3df]"><div className="h-3 rounded-full bg-[#476f2e]" style={{ width: `${progress}%` }} /></div>;
}

async function loadImpactData(): Promise<{ summary: DashboardSummary | null; reports: ReportRecord[]; error: string | null }> {
    try {
        const [summary, reports] = await Promise.all([getDashboardSummary(), getUserReports()]);
        return { summary, reports, error: null };
    } catch (error: unknown) {
        return { summary: null, reports: [], error: error instanceof Error ? error.message : "Unable to load impact data." };
    }
}

export default async function ImpactPage() {
    if (!(await getTokenCookie())) redirect("/login");
    const { summary, reports, error } = await loadImpactData();
    if (!summary) return <main className="min-h-screen bg-[#fafbf8] px-5 py-16 text-center"><p className="text-sm text-[#596159]">{error || "We could not load your impact data. Please refresh and try again."}</p></main>;

    const diverted = reports.reduce((total, report) => total + (weights[report.category] ?? 6), 0);
    const points = reports.reduce((total, report) => total + (weights[report.category] ?? 6) * 5, 0);
    const stats = [
        { label: "Items recycled", value: summary.totalReports, icon: FiFeather },
        { label: "Material diverted", value: `${diverted} kg`, icon: FiTrendingUp },
        { label: "Eco points", value: points, icon: FiAward },
        { label: "Categories explored", value: summary.categoriesTracked, icon: FiBarChart2 },
    ];

    const communityPercent = 68;

    return (
        <main className="min-h-screen bg-[#fafbf8] px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6d9839]">Global Impact Report</p>
                        <h1 className="mt-2 text-3xl font-bold text-[#263129]">Your Recycling Impact</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#596159]">Every item you recycle helps reduce landfill waste, conserve valuable materials, and protect our planet.</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="rounded-full bg-white px-5 py-3 shadow-[0_8px_28px_rgba(39,59,38,.06)] text-center">
                            <p className="text-xs text-[#e8f5d6] font-semibold text-left">ECO SCORE</p>
                            <p className="mt-1 text-2xl font-bold text-[#2b3a20]">850</p>
                            <p className="text-xs text-[#6b6f64]">Platinum Level</p>
                        </div>
                    </div>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((s) => (
                        <StatCard key={s.label} label={s.label} value={s.value} Icon={s.icon} />
                    ))}
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(39,59,38,.06)]">
                        <h3 className="text-sm font-semibold text-[#263129]">Environmental Savings</h3>
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <SavingsCard label="Trees saved" value={`2.4`} />
                            <SavingsCard label="Water saved" value={`150 L`} />
                            <SavingsCard label="Energy saved" value={`45 kWh`} />
                            <SavingsCard label="CO2 prevented" value={`24 kg`} />
                        </div>

                        <div className="mt-6 flex gap-6 items-start">
                            <div className="w-3/4">
                                <div className="rounded-[12px] bg-[#f7faf6] p-4">
                                    <p className="text-sm font-semibold text-[#263129]">Recycle {Math.max(1, 10 - summary.totalReports)} more items to unlock Eco Explorer Badge</p>
                                    <ProgressBar progress={Math.min(100, Math.round((summary.totalReports % 10) * 10))} />
                                    <div className="mt-3">
                                        <a href="/dashboard?openUpload=1" className="rounded-full bg-[#4f7d2f] px-4 py-2 text-white inline-block">Recycle More</a>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/4">
                                <div className="rounded-[12px] bg-white p-4 shadow-[0_6px_20px_rgba(39,59,38,.04)]">
                                    <p className="text-sm font-semibold text-[#263129]">Community Position</p>
                                    <div className="mt-3 flex items-center justify-center">
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#f3faf0]">
                                            <div className="text-2xl font-bold text-[#2b3a20]">{communityPercent}%</div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-xs text-[#6b6f64] text-center">You recycle more than {communityPercent}% of users in your area.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(39,59,38,.06)]">
                        <h3 className="text-sm font-semibold text-[#263129]">Recent Activity</h3>
                        <ul className="mt-4 space-y-3">
                            {reports.slice(0, 4).map((r) => (
                                  <li key={r._id} className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#eef6e7]" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-[#263129]">{r.title ?? r.category}</p>
                                        <p className="text-xs text-[#6b6f64]">{new Date(r.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 rounded-[8px] bg-[#f1f6ef] p-3 text-sm text-[#55614b]">Tip: Remove batteries before recycling electronics to prevent leakage.</div>
                    </aside>
                </section>

                <section className="mt-8 rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(39,59,38,.06)]">
                    <h3 className="text-sm font-semibold text-[#263129]">Your Recycling Activity</h3>
                    <div className="mt-6 h-36 rounded-lg bg-[#f7faf6] flex items-end gap-3 px-4">
                        {/* Placeholder bars for activity chart */}
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
                               <div
                                  key={m}
                                  className={`flex-1 rounded-t-md`}
                                  style={{ height: `${20 + i * 10}%`, backgroundColor: i === 5 ? '#476f2e' : '#dfeee0' }}
                               />
                        ))}
                    </div>
                </section>

                <section className="mt-8 flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-[#263129]">Achievement Gallery</h3>
                    <div className="flex gap-4 overflow-x-auto py-3">
                        {["First Recycle", "Recycler", "Eco Warrior", "Planet Hero"].map((a, i) => (
                            <div key={a} className={`flex h-16 min-w-[120px] items-center justify-center rounded-full ${i === 1 ? "border-2 border-[#6f9a3c]" : "bg-white"}`}>{a}</div>
                        ))}
                    </div>
                </section>

                <section className="mt-8 rounded-[14px] bg-[#476f2e] p-8 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h4 className="text-xl font-bold">Every recycled device gives valuable materials a second life.</h4>
                            <p className="mt-2 text-sm text-[#e8f5d6]">Start your next session today and keep your streak alive. The planet thanks you.</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <a href="/dashboard?openUpload=1" className="rounded-full bg-white px-4 py-2 text-[#2b3a20] inline-block">Recycle Another Item</a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
