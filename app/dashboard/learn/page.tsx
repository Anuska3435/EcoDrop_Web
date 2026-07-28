"use client";

import { useState } from "react";
import { FiBatteryCharging, FiCheckCircle, FiChevronDown, FiCpu, FiMonitor } from "react-icons/fi";

const lessons = [
    { title: "Prepare a device before recycling", icon: FiCpu, body: "Back up files, sign out of your accounts, remove SIM cards, and factory-reset the device. This keeps personal information protected." },
    { title: "Handle batteries safely", icon: FiBatteryCharging, body: "Never put loose batteries in household waste. Tape exposed terminals and bring them to a certified battery collection point." },
    { title: "Repair, donate, or recycle?", icon: FiMonitor, body: "If an item still works, consider repair or donation first. Certified recyclers are the best option for damaged or obsolete electronics." },
    { title: "Remove sensitive data", icon: FiCpu, body: "Use secure erase tools for laptops and phones, and remove external storage before handing devices over." },
    { title: "What recyclers accept", icon: FiMonitor, body: "Different centers accept different materials — ask about batteries, screens, cords, and accessories before dropping off." },
    { title: "Sustainable repair tips", icon: FiCpu, body: "Small repairs like replacing batteries or connectors can extend a device's life and reduce waste." },
];

const books = [
    {
        title: "Waste to Wealth: The Circular Economy Advantage",
        author: "Peter Lacy",
        description: "An overview of circular economy principles and how businesses can turn waste into value.",
        link: "https://example.com/waste-to-wealth"
    },
    {
        title: "The New Ecology of Things",
        author: "M. Green",
        description: "Explores the lifecycle of consumer electronics and practical steps for sustainability.",
        link: "https://example.com/new-ecology"
    },
    {
        title: "Repairability Matters",
        author: "A. Maker",
        description: "A practical guide to repairing common electronics and advocating for right-to-repair policies.",
        link: "https://example.com/repairability"
    },
    {
        title: "Green Tech Handbook",
        author: "S. Patel",
        description: "Technical and policy guidance for designing devices with end-of-life reuse in mind.",
        link: "https://example.com/green-tech"
    }
];

export default function LearnPage() {
    const [openLesson, setOpenLesson] = useState<number | null>(0);
    const [completed, setCompleted] = useState<number[]>([]);
    const toggleCompleted = (index: number) => setCompleted((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index]);
    return (
        <main className="min-h-screen bg-[#fafbf8] px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-4xl">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6d9839]">Eco learning</p>
                <h1 className="mt-2 text-3xl font-bold text-[#263129]">Learn to recycle better</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#596159]">Short, practical lessons to make every device disposal safer and more sustainable.</p>
                <p className="mt-6 text-sm font-semibold text-[#648c37]">{completed.length} of {lessons.length} lessons completed</p>

                <section className="mt-5 space-y-3">
                    {lessons.map((lesson, index) => {
                        const Icon = lesson.icon;
                        const isOpen = openLesson === index;
                        const isDone = completed.includes(index);
                        return (
                            <article key={lesson.title} className="overflow-hidden rounded-[18px] bg-white shadow-[0_8px_28px_rgba(39,59,38,.06)]">
                                <button onClick={() => setOpenLesson(isOpen ? null : index)} className="flex w-full items-center gap-4 p-5 text-left">
                                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf3df] text-[#648c37]"><Icon /></span>
                                    <span className="flex-1 font-semibold text-[#263129]">{lesson.title}</span>
                                    <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isOpen && (
                                    <div className="border-t border-[#edf0eb] px-5 pb-5 pt-4">
                                        <p className="text-sm leading-6 text-[#596159]">{lesson.body}</p>
                                        <button onClick={() => toggleCompleted(index)} className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${isDone ? "bg-[#eaf3df] text-[#648c37]" : "bg-[#6f9a3c] text-white"}`}><FiCheckCircle /> {isDone ? "Completed" : "Mark lesson complete"}</button>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </section>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold text-[#263129]">Recommended books</h2>
                    <p className="mt-2 text-sm text-[#596159]">Further reading on circular design, repair, and sustainable electronics.</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {books.map((b) => (
                            <article key={b.title} className="rounded-[14px] bg-white p-4 shadow-[0_6px_20px_rgba(39,59,38,.04)]">
                                <h3 className="text-sm font-bold text-[#263129]">{b.title}</h3>
                                <p className="mt-1 text-xs text-[#6b6f64]">by {b.author}</p>
                                <p className="mt-3 text-sm text-[#596159]">{b.description}</p>
                                <a href={b.link} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-[#4f7d2f]">Learn more</a>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
