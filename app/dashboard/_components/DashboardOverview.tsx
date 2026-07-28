"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiBatteryCharging, FiCheckSquare, FiChevronRight, FiClock, FiMapPin, FiMonitor, FiNavigation, FiPackage, FiSmartphone, FiX } from "react-icons/fi";
import ReportUploadForm from "@/app/dashboard/_components/ReportUploadForm";
import type { DashboardSummary, DashboardUser, ReportRecord } from "@/lib/api/protected";
import type { ElectronicItem } from "@/app/dashboard/_components/ElectronicItem";
import UploadElectronicItemDialog from "@/app/dashboard/_components/UploadElectronicItemDialog";
import UploadedItemCard from "@/app/dashboard/_components/UploadedItemCard";

type DashboardOverviewProps = { user: DashboardUser; summary: DashboardSummary; reports: ReportRecord[] };

const categoryIcons = { Battery: FiBatteryCharging, Mobile: FiSmartphone, Laptop: FiMonitor };

function reportPoints(category: string) {
    return ({ Laptop: 50, Mobile: 120, Battery: 20, Monitor: 70, Appliance: 80, Accessory: 30 } as Record<string, number>)[category] ?? 30;
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function DashboardOverview({ user, summary, reports }: DashboardOverviewProps) {
    const searchParams = useSearchParams();
    const [isUploadOpen, setIsUploadOpen] = useState(() => searchParams.get("openUpload") === "1");
    const [isItemUploadOpen, setIsItemUploadOpen] = useState(false);
    const [uploadedItems, setUploadedItems] = useState<ElectronicItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [missionComplete, setMissionComplete] = useState(false);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [activeDialog, setActiveDialog] = useState<"learn" | "terms" | "privacy" | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const name = user.firstName || user.username || "EcoDrop member";
    const points = reports.reduce((total, report) => total + reportPoints(report.category), 0);
    const level = Math.max(1, Math.floor(points / 250) + 1);
    const levelProgress = Math.min(100, Math.round((points % 250) / 2.5));
    const learningReport = reports[0];

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (!file) return;
        setSelectedFile(file);
        // Open the item upload dialog (AI-powered flow)
        setIsItemUploadOpen(true);
    };

    const handleSaveItem = (item: ElectronicItem) => {
        setUploadedItems((current) => [item, ...current]);
        setSelectedFile(null);
        setIsUploadOpen(false);
    };

    const handleDeleteItem = (id: string) => {
        setUploadedItems((current) => current.filter((item) => item.id !== id));
    };

    const handleCancelUpload = () => {
        setSelectedFile(null);
        setIsUploadOpen(false);
    };

    return (
        <main className="min-h-screen bg-[#fafbf8] text-[#263129]">
            <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-5 sm:px-8 lg:px-10">
                <section className="relative overflow-hidden rounded-[22px] bg-[#dce3d8] px-6 py-7 sm:px-9 sm:py-9">
                    <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:7px_7px]" />
                    <div className="relative max-w-xl"><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good Morning, {name}</h1><p className="mt-2 text-sm leading-6 text-[#596159]">Your positive choices are making a tangible difference today. Your Eco Tree is flourishing!</p></div>
                </section>

                <section id="impact" className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(290px,.84fr)]">
                    <article className="rounded-[22px] bg-white p-5 shadow-[0_8px_28px_rgba(39,59,38,.06)] sm:p-7">
                        <div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-[#edf4e8] px-3 py-1 text-[10px] font-bold text-[#57743c]">Level {level} Explorer</span><h2 className="mt-3 text-2xl font-bold">Eco Tree Progression</h2></div><div className="text-right"><strong className="text-xl text-[#577b37]">{summary.totalReports} Items</strong><p className="mt-1 text-[11px] text-[#313b34]">Electronic devices recycled</p></div></div>
                        <div className="relative mx-auto mt-8 h-44 max-w-xs"><span className="absolute left-[62%] top-1 text-xl text-[#8ab54d]">⌁</span><span className="absolute left-[36%] top-8 text-xl text-[#8ab54d]">⌁</span><div className="absolute bottom-0 left-1/2 h-13 w-10 -translate-x-1/2 rounded-t-full bg-[#55752e]" /><div className="tree-crown absolute bottom-10 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-[#b6e97d]" /></div>
                        <div className="mt-4 flex items-center justify-between text-[11px] font-medium"><span>Progress to Level {level + 1}</span><span className="text-[#587936]">{levelProgress}%</span></div><div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#edf0ed]"><div className="h-full rounded-full bg-[#97c756]" style={{ width: `${levelProgress}%` }} /></div><div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#657065]"><span>{summary.categoriesTracked} categories tracked</span><span>Top category: {summary.mostUsedCategory || "None yet"}</span><span>{points} total XP</span></div>
                    </article>

                    <div className="space-y-4"><article className={`rounded-[22px] p-6 text-[#32451e] ${missionComplete ? "bg-[#b7d987]" : "bg-[#9ac553]"}`}><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide"><FiCheckSquare /> Today&apos;s mission</div><h2 className="mt-4 text-xl font-semibold leading-tight">{missionComplete ? "Mission complete!" : "Recycle one unused electronic device"}</h2><button onClick={() => setMissionComplete((complete) => !complete)} className="mt-6 h-10 w-full rounded-full bg-white text-xs font-bold text-[#6d9938]">{missionComplete ? "Mark as incomplete" : "Mark as Completed"}</button></article>
                        <article id="learn" className="overflow-hidden rounded-[18px] border border-[#dce2d9] bg-white p-3"><div className="relative h-28 overflow-hidden rounded-xl bg-[#d9ded8]">{learningReport ? <Image src={learningReport.imageUrl} alt={learningReport.title} fill className="object-cover" /> : <div className="grid h-full place-items-center text-[#789754]"><FiBatteryCharging className="text-5xl" /></div>}</div><p className="mt-3 text-[10px] font-bold text-[#6a9738]">Learning Corner</p><h3 className="mt-1 text-lg font-semibold leading-tight">{learningReport ? `What happens to ${learningReport.title.toLowerCase()}?` : "What happens to old batteries?"}</h3><button onClick={() => setActiveDialog("learn")} className="mt-2 inline-flex items-center text-xs font-semibold text-[#6a9738]">Read More <FiChevronRight className="ml-1" /></button></article></div>
                </section>

                <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(250px,.8fr)_minmax(0,1.7fr)]">
                    <article id="centers" className="rounded-[22px] bg-white p-5 shadow-[0_8px_28px_rgba(39,59,38,.06)]"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Nearby Center</h2><FiMapPin className="text-[#648b38]" /></div><div className="mt-4 flex gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#edf1ec] text-[#638b3a]"><FiPackage /></span><div><p className="text-sm font-semibold">Green Earth Recycling</p><p className="text-[11px] text-[#586158]">1.5km away · Open until 6PM</p></div></div><div className="map-grid relative mt-4 h-28 overflow-hidden rounded-lg bg-[#eceeeb]"><span className="absolute left-[55%] top-[44%] grid h-7 w-7 place-items-center rounded-full bg-white text-[#638b3a] shadow"><FiMapPin /></span><span className="absolute left-[30%] top-[35%] text-[9px] text-[#859084]">Your location</span></div><a href="https://www.google.com/maps/search/e-waste+recycling+near+me" target="_blank" rel="noreferrer" className="mt-4 flex h-10 items-center justify-center gap-2 rounded-full border border-[#83b33e] text-xs font-semibold text-[#648c37]"><FiNavigation /> Open Map</a></article>
                    <article className="rounded-[22px] bg-white p-5 shadow-[0_8px_28px_rgba(39,59,38,.06)]"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Recent Activity</h2><div className="flex gap-3"><button onClick={() => setShowAllActivities((show) => !show)} className="text-[10px] font-bold text-[#668e3c]">{showAllActivities ? "Show Less" : "View Full History"}</button><button onClick={() => setIsUploadOpen(true)} className="text-[10px] font-bold text-[#668e3c]">Log New Item</button></div></div><div className="mt-4 space-y-2">{reports.length ? (showAllActivities ? reports : reports.slice(0, 3)).map((report) => { const Icon = categoryIcons[report.category as keyof typeof categoryIcons] ?? FiPackage; return <div key={report._id} className="flex items-center gap-3 rounded-xl border border-[#edf0eb] bg-[#fafbf9] px-3 py-2.5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#d8f0a6] text-[#6c9c35]"><Icon /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{report.title}</p><p className="text-[11px] text-[#5d655d]">Recycled · {report.category}</p></div><div className="text-right"><p className="text-xs font-bold text-[#6d9839]">+{reportPoints(report.category)} XP</p><p className="mt-1 text-[10px] text-[#657065]">{formatDate(report.createdAt)}</p></div></div>; }) : <div className="rounded-xl border border-dashed border-[#d9e2d5] p-8 text-center"><FiClock className="mx-auto text-xl text-[#70963e]" /><p className="mt-2 text-sm text-[#596159]">No activity yet. Start by recycling an item.</p></div>}</div></article>
                </section>

                <section className="mt-4 rounded-[22px] bg-white p-5 shadow-[0_8px_28px_rgba(39,59,38,.06)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Your Uploaded Items</h2>
                            <p className="mt-1 text-[11px] text-[#657065]">Photos and report details from every item you have logged.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={openFilePicker} className="rounded-full border border-[#83b33e] px-4 py-2 text-xs font-semibold text-[#648c37] transition hover:bg-[#f1f7ea]">
                                Upload Item
                            </button>
                            <button onClick={() => setShowGallery((show) => !show)} className="rounded-full border border-[#83b33e] px-4 py-2 text-xs font-semibold text-[#648c37] transition hover:bg-[#f1f7ea]">
                                {showGallery ? "Hide Gallery" : `View Gallery (${reports.length})`}
                            </button>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={onFileSelected}
                        className="hidden"
                    />

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {uploadedItems.length ? (
                            uploadedItems.map((item) => (
                                <UploadedItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
                            ))
                        ) : (
                            <div className="col-span-full rounded-[20px] border border-dashed border-[#d9e2d5] bg-[#f8faf3] p-8 text-center text-sm text-[#596159]">
                                No uploaded electronic items yet.
                            </div>
                        )}
                    </div>

                    {showGallery && (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {reports.length ? (
                                reports.map((report) => (
                                    <article key={report._id} className="overflow-hidden rounded-xl border border-[#e8ece6] bg-[#fafbf9]">
                                        <div className="relative h-32 bg-[#e8ede6]">
                                            <Image src={report.imageUrl} alt={report.title} fill className="object-cover" />
                                        </div>
                                        <div className="p-3">
                                            <p className="truncate text-sm font-semibold">{report.title}</p>
                                            <p className="mt-1 text-[11px] text-[#657065]">{report.category} · {formatDate(report.createdAt)}</p>
                                            <p className="mt-2 line-clamp-2 text-[11px] text-[#586158]">{report.description}</p>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p className="col-span-full rounded-xl border border-dashed border-[#d9e2d5] p-6 text-center text-sm text-[#596159]">
                                    Upload your first report to see it here.
                                </p>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <footer className="border-t border-[#e0e4df] bg-[#f3f5f2]"><div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 sm:grid-cols-[1.6fr_1fr_1fr] sm:px-8 lg:px-10"><div><p className="font-bold text-[#567a34]">EcoDrop</p><p className="mt-4 max-w-xs text-xs leading-5 text-[#697269]">Building a sustainable future through community action and smart recycling rewards.</p></div><div><p className="text-[10px] font-bold uppercase text-[#587836]">Platform</p><div className="mt-4 grid gap-2 text-xs text-[#697269]"><Link href="/dashboard">Dashboard</Link><Link href="/dashboard/centers">Centers</Link><Link href="/dashboard/learn">Learn</Link></div></div><div><p className="text-[10px] font-bold uppercase text-[#587836]">Support</p><div className="mt-4 grid gap-2 text-xs text-[#697269]"><a href="mailto:support@ecodrop.com">Contact Us</a><button onClick={() => setActiveDialog("terms")} className="w-fit text-left">Terms of Service</button><button onClick={() => setActiveDialog("privacy")} className="w-fit text-left">Privacy Policy</button></div></div></div><div className="border-t border-[#dce1dc] px-5 py-4 text-[10px] text-[#697269] sm:px-8 lg:px-10">© {new Date().getFullYear()} EcoDrop Sustainability. All rights reserved.</div></footer>

            {isUploadOpen && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><div className="relative mx-auto my-8 max-w-2xl"><button aria-label="Close upload form" onClick={() => setIsUploadOpen(false)} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#eff2ed] text-[#526052]"><FiX /></button><ReportUploadForm /></div></div>}
            {selectedFile && isItemUploadOpen && <UploadElectronicItemDialog file={selectedFile} onSave={handleSaveItem} onCancel={handleCancelUpload} />}
            {activeDialog && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4 backdrop-blur-sm"><section role="dialog" aria-modal="true" aria-labelledby="dashboard-dialog-title" className="relative w-full max-w-lg rounded-[22px] bg-white p-7 shadow-2xl"><button aria-label="Close dialog" onClick={() => setActiveDialog(null)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#eff2ed] text-[#526052]"><FiX /></button>{activeDialog === "learn" ? <><p className="text-[10px] font-bold uppercase tracking-wide text-[#6a9738]">Learning Corner</p><h2 id="dashboard-dialog-title" className="mt-2 pr-8 text-2xl font-bold">Recycle electronics safely</h2><p className="mt-4 text-sm leading-6 text-[#596159]">Old electronics contain recoverable metals and materials. Take batteries, cables, phones, and laptops to a certified collection center so they can be repaired, reused, or processed safely. Before dropping off a device, back up and erase your personal information.</p></> : <><p className="text-[10px] font-bold uppercase tracking-wide text-[#6a9738]">EcoDrop policy</p><h2 id="dashboard-dialog-title" className="mt-2 pr-8 text-2xl font-bold">{activeDialog === "terms" ? "Terms of Service" : "Privacy Policy"}</h2><p className="mt-4 text-sm leading-6 text-[#596159]">EcoDrop uses your account and recycling-report information to provide the dashboard, track your submissions, and improve recycling services. Keep your account details accurate and only upload content you have permission to share.</p></>}<button onClick={() => setActiveDialog(null)} className="mt-6 h-10 rounded-full bg-[#6f9a3c] px-5 text-xs font-bold text-white">Got it</button></section></div>}
        </main>
    );
}
