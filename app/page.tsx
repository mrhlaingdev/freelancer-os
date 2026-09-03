import type { Metadata } from "next";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, FileText, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Powerhouse | Freelance operations",
  description: "A focused workspace for projects, invoices, and tracked time.",
};

const workspaces = [
  {
    href: "/projects",
    eyebrow: "Delivery",
    title: "Projects",
    description: "See what is moving, what is waiting, and what needs your attention next.",
    icon: BriefcaseBusiness,
    accent: "bg-[#f3ded7] text-[#c34f39]",
    metric: "5 active workstreams",
  },
  {
    href: "/invoices",
    eyebrow: "Finance",
    title: "Invoices",
    description: "Keep your cash flow visible with simple, client-ready billing.",
    icon: FileText,
    accent: "bg-[#f5e8c9] text-[#ac771e]",
    metric: "$11,650 outstanding",
  },
  {
    href: "/time-tracking",
    eyebrow: "Operations",
    title: "Time tracking",
    description: "Capture focused work and connect every hour to the right project.",
    icon: Clock3,
    accent: "bg-[#dcebe5] text-[#397461]",
    metric: "7h 25m this week",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#292928]">
      <div className="mx-auto min-h-screen max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <header className="flex h-20 items-center justify-between border-b border-[#e4e0d8]">
          <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-[#d6593f] text-white"><Sparkles className="size-5" /></div><span className="font-semibold tracking-tight">powerhouse<span className="text-[#d6593f]">.</span></span></div>
          <div className="flex items-center gap-3 text-xs text-[#87847d]"><span className="hidden sm:inline">Wednesday, June 11, 2025</span><div className="flex size-9 items-center justify-center rounded-full bg-[#292928] text-[11px] font-bold text-white">AM</div></div>
        </header>
        <section className="py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl"><p className="flex items-center gap-2 text-sm font-semibold text-[#d6593f]"><span className="h-px w-7 bg-[#d6593f]" />Your freelance command center</p><h1 className="mt-5 text-5xl font-semibold leading-[.98] tracking-[-.06em] sm:text-7xl">Make good work.<br /><span className="text-[#d6593f]">Keep it moving.</span></h1><p className="mt-7 max-w-xl text-base leading-7 text-[#77736b] sm:text-lg">One calm place to see your projects, follow the money, and protect the time that makes everything possible.</p></div>
          <div className="mt-16 grid gap-4 md:grid-cols-3">{workspaces.map((workspace) => { const Icon = workspace.icon; return <a key={workspace.href} href={workspace.href} className="group flex min-h-[255px] flex-col justify-between rounded-2xl border border-[#e4e0d8] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#d8b0a5] hover:shadow-[0_16px_35px_-25px_#7b4a3d] sm:p-7"><div><div className={`flex size-11 items-center justify-center rounded-xl ${workspace.accent}`}><Icon className="size-5" /></div><p className="mt-8 text-[10px] font-bold uppercase tracking-[.18em] text-[#aaa59b]">{workspace.eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{workspace.title}</h2><p className="mt-2 text-sm leading-6 text-[#87847d]">{workspace.description}</p></div><div className="flex items-center justify-between border-t border-[#ebe8e1] pt-4 text-xs"><span className="font-medium text-[#65625b]">{workspace.metric}</span><span className="flex size-8 items-center justify-center rounded-full bg-[#f4f1eb] transition group-hover:bg-[#d6593f] group-hover:text-white"><ArrowUpRight className="size-4" /></span></div></a>; })}</div>
          <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-[#292928] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#f0a18e]" /><div><p className="text-sm font-semibold">Your workspace is in good shape.</p><p className="mt-1 text-xs text-white/50">Jump into a view to pick up where you left off.</p></div></div><a href="/projects" className="text-xs font-semibold text-[#f0a18e] hover:text-white">View all projects <ArrowUpRight className="ml-1 inline size-3" /></a></div>
        </section>
      </div>
    </main>
  );
}
