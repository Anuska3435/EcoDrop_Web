import { FiClock, FiExternalLink, FiMapPin, FiNavigation, FiPhone } from "react-icons/fi";

const centers = [
    { name: "Green Earth Recycling", distance: "1.5 km away", hours: "Open until 6 PM", address: "Downtown Collection District" },
    { name: "EcoDrop Alpha", distance: "3.2 km away", hours: "Open until 5 PM", address: "Northside Community Hub" },
    { name: "Circular Tech Center", distance: "5.4 km away", hours: "Opens at 9 AM tomorrow", address: "Riverside Industrial Park" },
    { name: "North Ridge Collection", distance: "6.0 km away", hours: "Open until 7 PM", address: "North Ridge Mall" },
    { name: "Harbor Electronics Recycle", distance: "7.8 km away", hours: "Open until 4 PM", address: "Harbor Front Warehouse 3" },
    { name: "Campus Drop Zone", distance: "2.9 km away", hours: "Open until 8 PM", address: "University Service Center" },
    { name: "GreenLoop Depot", distance: "4.5 km away", hours: "Open until 6 PM", address: "Market Street Industrial" },
    { name: "RenewTech Center", distance: "8.1 km away", hours: "Opens at 10 AM", address: "Tech Park Building B" },
    { name: "Community Reuse Hub", distance: "3.6 km away", hours: "Open until 5:30 PM", address: "Westside Community Hall" },
    { name: "Valley E-Waste", distance: "12.0 km away", hours: "Open until 3 PM", address: "Valley Logistics Yard" },
];

export default function CentersPage() {
    return <main className="min-h-screen bg-[#fafbf8] px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-wider text-[#6d9839]">Find a drop-off location</p><h1 className="mt-2 text-3xl font-bold text-[#263129]">Recycling Centers</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#596159]">Find a responsible e-waste collection center near you. Confirm accepted materials before visiting.</p><a href="https://www.google.com/maps/search/e-waste+recycling+near+me" target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#6f9a3c] px-5 text-sm font-semibold text-white"><FiNavigation /> Search near my location <FiExternalLink /></a><section className="mt-8 grid gap-4 md:grid-cols-3">{centers.map((center) => <article key={center.name} className="rounded-[22px] bg-white p-5 shadow-[0_8px_28px_rgba(39,59,38,.06)]"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#eaf3df] text-[#648c37]"><FiMapPin /></span><h2 className="mt-5 text-lg font-semibold text-[#263129]">{center.name}</h2><p className="mt-2 text-xs text-[#596159]">{center.address}</p><p className="mt-4 flex items-center gap-2 text-xs font-medium text-[#526052]"><FiClock /> {center.hours}</p><p className="mt-2 text-xs text-[#648c37]">{center.distance}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name)}`} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 rounded-full border border-[#83b33e] px-4 py-2 text-xs font-semibold text-[#648c37]"><FiMapPin /> Directions</a><a href="tel:+10000000000" className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-[#596159]"><FiPhone /> Contact center</a></article>)}</section></div></main>;
}
