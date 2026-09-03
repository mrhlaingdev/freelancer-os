"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

type ProjectStatus = "Active" | "Completed" | "On Hold";

type Project = {
  id: number;
  name: string;
  client: string;
  initials: string;
  color: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  due: string;
  members: number;
};

const startingProjects: Project[] = [
  { id: 1, name: "Northstar Brand System", client: "Northstar Labs", initials: "NL", color: "bg-rose-100 text-rose-700", status: "Active", progress: 72, budget: 18000, spent: 12640, due: "Jun 18, 2025", members: 4 },
  { id: 2, name: "Atlas Commerce Site", client: "Atlas Goods", initials: "AG", color: "bg-amber-100 text-amber-700", status: "Active", progress: 48, budget: 24000, spent: 10200, due: "Jul 02, 2025", members: 6 },
  { id: 3, name: "Field Notes Campaign", client: "Field Notes Co.", initials: "FN", color: "bg-sky-100 text-sky-700", status: "On Hold", progress: 31, budget: 12500, spent: 4850, due: "Jul 14, 2025", members: 3 },
  { id: 4, name: "Morrow App Prototype", client: "Morrow Health", initials: "MH", color: "bg-violet-100 text-violet-700", status: "Completed", progress: 100, budget: 9800, spent: 9340, due: "May 28, 2025", members: 5 },
  { id: 5, name: "Common Ground Editorial", client: "Common Ground", initials: "CG", color: "bg-emerald-100 text-emerald-700", status: "Active", progress: 86, budget: 7600, spent: 6120, due: "Jun 24, 2025", members: 2 },
];

const statusStyles: Record<ProjectStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Completed: "bg-sky-50 text-sky-700 ring-sky-600/15",
  "On Hold": "bg-amber-50 text-amber-700 ring-amber-600/15",
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function formatBudget(value: number) {
  return money.format(value);
}

function ProjectCard({ project, onComplete }: { project: Project; onComplete: (id: number) => void }) {
  const remaining = project.budget - project.spent;

  return (
    <article className="group border-t border-[#ddd9d0] py-5 first:border-t-0 sm:grid sm:grid-cols-[minmax(0,1.5fr)_minmax(180px,1fr)_minmax(150px,.7fr)_auto] sm:items-center sm:gap-6">
      <div className="flex min-w-0 items-start gap-3">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${project.color}`}>{project.initials}</div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#252525]">{project.name}</h3>
          <p className="mt-1 truncate text-xs text-[#87847d]">{project.client}</p>
          <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[project.status]}`}>
            <span className="mr-1.5">{project.status === "Active" ? "●" : project.status === "Completed" ? "✓" : "Ⅱ"}</span>{project.status}
          </span>
        </div>
      </div>
      <div className="mt-5 sm:mt-0">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-[#65625b]">Progress</span><span className="font-semibold text-[#252525]">{project.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#ebe8e1]"><div className="h-full rounded-full bg-[#d6593f] transition-all" style={{ width: `${project.progress}%` }} /></div>
        <p className="mt-2 text-[11px] text-[#9a968d]">Due {project.due}</p>
      </div>
      <div className="mt-5 flex items-end justify-between sm:mt-0 sm:block">
        <div><p className="text-xs font-medium text-[#65625b]">Budget used</p><p className="mt-1 text-sm font-semibold text-[#252525]">{formatBudget(project.spent)} <span className="font-normal text-[#9a968d]">/ {formatBudget(project.budget)}</span></p></div>
        <p className="text-[11px] text-[#9a968d] sm:mt-2">{formatBudget(remaining)} left</p>
      </div>
      <div className="mt-4 flex items-center justify-between sm:mt-0 sm:justify-end sm:gap-4">
        <div className="flex -space-x-2"><div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#252525] text-[9px] font-bold text-white">{project.initials[0]}</div><div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#e5ddd3] text-[9px] font-bold text-[#716a60]">+{project.members - 1}</div></div>
        <button onClick={() => onComplete(project.id)} aria-label={`Mark ${project.name} complete`} className="rounded-lg p-2 text-[#8c887f] transition hover:bg-[#f0ede7] hover:text-[#252525]"><MoreHorizontal className="size-4" /></button>
      </div>
    </article>
  );
}

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>(startingProjects);
  const [filter, setFilter] = useState<"All" | ProjectStatus>("All");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("powerhouse-projects");
    window.setTimeout(() => {
      if (saved) setProjects(JSON.parse(saved));
      setHydrated(true);
      trackEvent("dashboard_viewed", { page: "projects" });
    }, 0);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem("powerhouse-projects", JSON.stringify(projects));
    }
  }, [hydrated, projects]);

  const visibleProjects = useMemo(() => projects.filter((project) => (filter === "All" || project.status === filter) && `${project.name} ${project.client}`.toLowerCase().includes(query.toLowerCase())), [filter, projects, query]);
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const activeProjects = projects.filter((project) => project.status === "Active").length;

  function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "Untitled project");
    const client = String(form.get("client") || "New client");
    const budget = Number(form.get("budget") || 0);
    const newProject: Project = { id: Date.now(), name, client, initials: client.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), color: "bg-orange-100 text-orange-700", status: "Active", progress: 0, budget, spent: 0, due: String(form.get("due") || "TBD"), members: 1 };
    setProjects((current) => [newProject, ...current]);
    trackEvent("project_created", { project_name: name, client });
    setDialogOpen(false);
    event.currentTarget.reset();
  }

  function completeProject(id: number) {
    setProjects((current) => current.map((project) => project.id === id ? { ...project, status: "Completed", progress: 100 } : project));
    trackEvent("project_completed", { project_id: id });
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#252525]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-[#e4e0d8] bg-[#f1eee7] px-5 py-7 lg:flex lg:flex-col">
          <div className="flex items-center gap-2.5 px-2"><div className="flex size-9 items-center justify-center rounded-xl bg-[#d6593f] text-white"><Sparkles className="size-5" /></div><span className="font-semibold tracking-tight">powerhouse<span className="text-[#d6593f]">.</span></span></div>
          <p className="mb-3 mt-12 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#a39e93]">Workspace</p>
          <nav className="space-y-1">
            {[[LayoutDashboard, "Overview"], [FolderKanban, "Projects"], [Users, "Clients"], [CalendarDays, "Calendar"]].map(([Icon, label]) => <a key={String(label)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${label === "Projects" ? "bg-white font-semibold text-[#d6593f] shadow-sm" : "text-[#77736b] hover:bg-white/70"}`} href={label === "Projects" ? "/projects" : "#"}><Icon className="size-[17px]" />{String(label)}</a>)}
          </nav>
          <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#a39e93]">Manage</p>
          <nav className="space-y-1"><a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#77736b] hover:bg-white/70" href="#"><BriefcaseBusiness className="size-[17px]" />Invoices</a><a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#77736b] hover:bg-white/70" href="#"><Settings2 className="size-[17px]" />Settings</a></nav>
          <div className="mt-auto rounded-2xl bg-[#292928] p-4 text-white"><p className="text-xs font-semibold">Need a hand?</p><p className="mt-1 text-[11px] leading-5 text-white/55">Your workspace is looking good.</p><button className="mt-4 text-xs font-semibold text-[#f0a18e]">Visit help center <ArrowUpRight className="ml-1 inline size-3" /></button></div>
        </aside>
        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-[#e4e0d8] px-5 sm:px-8 lg:px-12"><div><p className="text-xs text-[#99948a]">Wednesday, June 11, 2025</p><h1 className="mt-1 text-lg font-semibold tracking-tight">Good morning, Alex</h1></div><div className="flex items-center gap-3"><button aria-label="Search" className="rounded-xl p-2.5 text-[#77736b] hover:bg-white"><Search className="size-[18px]" /></button><div className="flex size-9 items-center justify-center rounded-full bg-[#292928] text-xs font-bold text-white">AM</div></div></header>
          <div className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#d6593f]">Workspace / Projects</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Projects</h2><p className="mt-2 text-sm text-[#87847d]">Keep your work moving forward.</p></div><Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogTrigger className="inline-flex h-11 items-center justify-center rounded-xl bg-[#d6593f] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_#d6593f] hover:bg-[#bb4933]"><Plus className="mr-2 size-4" />Add project</DialogTrigger><DialogContent className="rounded-2xl border-[#e4e0d8] bg-[#fbfaf7] sm:max-w-[480px]"><DialogHeader><DialogTitle className="text-xl">Add a new project</DialogTitle><DialogDescription className="text-[#87847d]">Create a project to start tracking delivery and budget.</DialogDescription></DialogHeader><form onSubmit={addProject} className="space-y-4 pt-3"><label className="block text-sm font-medium">Project name<input required name="name" placeholder="e.g. Summer campaign" className="mt-2 h-11 w-full rounded-xl border border-[#ddd9d0] bg-white px-3 text-sm outline-none focus:border-[#d6593f]" /></label><label className="block text-sm font-medium">Client<input required name="client" placeholder="e.g. Acme Inc." className="mt-2 h-11 w-full rounded-xl border border-[#ddd9d0] bg-white px-3 text-sm outline-none focus:border-[#d6593f]" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium">Budget<input required min="0" name="budget" type="number" placeholder="12000" className="mt-2 h-11 w-full rounded-xl border border-[#ddd9d0] bg-white px-3 text-sm outline-none focus:border-[#d6593f]" /></label><label className="block text-sm font-medium">Due date<input name="due" type="date" className="mt-2 h-11 w-full rounded-xl border border-[#ddd9d0] bg-white px-3 text-sm outline-none focus:border-[#d6593f]" /></label></div><Button type="submit" className="mt-2 h-11 w-full rounded-xl bg-[#292928] font-semibold text-white hover:bg-[#3c3c3a]">Create project <Check className="ml-2 size-4" /></Button></form></DialogContent></Dialog></div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#292928] p-5 text-white"><div className="flex items-center justify-between"><p className="text-xs text-white/55">Active projects</p><FolderKanban className="size-4 text-[#f0a18e]" /></div><p className="mt-5 text-3xl font-semibold tracking-tight">{activeProjects}</p><p className="mt-1 text-xs text-white/50">{projects.length} total projects</p></div><div className="rounded-2xl border border-[#e4e0d8] bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs text-[#87847d]">Total budget</p><CircleDollarSign className="size-4 text-[#d6593f]" /></div><p className="mt-5 text-3xl font-semibold tracking-tight">{formatBudget(totalBudget)}</p><p className="mt-1 text-xs text-[#87847d]">Across all projects</p></div><div className="rounded-2xl border border-[#e4e0d8] bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs text-[#87847d]">Budget spent</p><Clock3 className="size-4 text-[#d6593f]" /></div><p className="mt-5 text-3xl font-semibold tracking-tight">{formatBudget(totalSpent)}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ebe8e1]"><div className="h-full w-[57%] rounded-full bg-[#e7a04b]" /></div></div></div>
            <div className="mt-10 flex flex-col gap-4 border-b border-[#ddd9d0] pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-1 overflow-x-auto">{(["All", "Active", "Completed", "On Hold"] as const).map((item) => <button key={item} onClick={() => { setFilter(item); trackEvent("filter_used", { page: "projects", filter: item }); }} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${filter === item ? "bg-[#292928] text-white" : "text-[#87847d] hover:bg-[#ebe8e1]"}`}>{item}</button>)}</div><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#aaa59b]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" className="h-9 w-full rounded-lg border border-[#ddd9d0] bg-white pl-9 pr-8 text-xs outline-none focus:border-[#d6593f] sm:w-52" /><ChevronDown className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 rotate-[-90deg] text-[#aaa59b]" /></div></div>
            <div className="mt-2 rounded-2xl border border-[#e4e0d8] bg-white px-5 sm:px-6"><div className="hidden border-b border-[#ebe8e1] py-4 text-[10px] font-bold uppercase tracking-[.15em] text-[#aaa59b] sm:grid sm:grid-cols-[minmax(0,1.5fr)_minmax(180px,1fr)_minmax(150px,.7fr)_auto] sm:gap-6"><span>Project</span><span>Delivery</span><span>Financials</span><span>Team</span></div>{visibleProjects.length ? visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onComplete={completeProject} />) : <div className="py-16 text-center text-sm text-[#87847d]">No projects match your search.</div>}</div>
          </div>
        </section>
      </div>
    </main>
  );
}