"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, CircleDollarSign, Download, FileText, MoreHorizontal, Plus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

type Invoice = { id: string; client: string; project: string; amount: number; issued: string; due: string; paid: boolean };
const initialInvoices: Invoice[] = [
  { id: "INV-1042", client: "Northstar Labs", project: "Northstar Brand System", amount: 4320, issued: "Jun 02, 2025", due: "Jun 16, 2025", paid: true },
  { id: "INV-1041", client: "Atlas Goods", project: "Atlas Commerce Site", amount: 6800, issued: "May 28, 2025", due: "Jun 11, 2025", paid: false },
  { id: "INV-1040", client: "Morrow Health", project: "Morrow App Prototype", amount: 2340, issued: "May 20, 2025", due: "Jun 03, 2025", paid: true },
  { id: "INV-1039", client: "Field Notes Co.", project: "Field Notes Campaign", amount: 4850, issued: "May 12, 2025", due: "May 26, 2025", paid: false },
];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function InvoicesDashboard() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [filter, setFilter] = useState<"All" | "Paid" | "Unpaid">("All");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("powerhouse-invoices");
    if (saved) setInvoices(JSON.parse(saved));
  }, []);
  useEffect(() => { window.localStorage.setItem("powerhouse-invoices", JSON.stringify(invoices)); }, [invoices]);

  const visible = invoices.filter((invoice) => (filter === "All" || (filter === "Paid" ? invoice.paid : !invoice.paid)) && `${invoice.id} ${invoice.client} ${invoice.project}`.toLowerCase().includes(query.toLowerCase()));
  const outstanding = invoices.filter((invoice) => !invoice.paid).reduce((sum, invoice) => sum + invoice.amount, 0);
  const collected = invoices.filter((invoice) => invoice.paid).reduce((sum, invoice) => sum + invoice.amount, 0);

  function togglePaid(invoice: Invoice) {
    setInvoices((current) => current.map((item) => item.id === invoice.id ? { ...item, paid: !item.paid } : item));
    if (!invoice.paid) trackEvent("invoice_paid", { invoice_id: invoice.id, amount: invoice.amount });
  }
  function generateInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount") || 0);
    const invoice = { id: `INV-${1043 + invoices.length}`, client: String(data.get("client")), project: String(data.get("project")), amount, issued: "Jun 11, 2025", due: "Jun 25, 2025", paid: false };
    setInvoices((current) => [invoice, ...current]);
    trackEvent("invoice_generated", { invoice_id: invoice.id, amount });
    setDialogOpen(false);
  }
  function exportPdf(invoice?: Invoice) {
    trackEvent("pdf_exported", { invoice_id: invoice?.id ?? "invoice-list" });
    window.print();
  }

  return <main className="min-h-screen bg-[#f7f5f0] text-[#252525]"><div className="mx-auto min-h-screen max-w-[1200px] px-5 py-7 sm:px-8 lg:px-12"><header className="flex items-center justify-between border-b border-[#e4e0d8] pb-7"><div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-[#d6593f] text-white"><Sparkles className="size-5" /></div><span className="font-semibold tracking-tight">powerhouse<span className="text-[#d6593f]">.</span></span></div><div className="flex items-center gap-3"><a className="text-xs text-[#87847d] hover:text-[#252525]" href="/projects">Projects</a><a className="text-xs font-semibold text-[#d6593f]" href="/time-tracking">Time tracking</a><div className="flex size-9 items-center justify-center rounded-full bg-[#292928] text-xs font-bold text-white">AM</div></div></header><section className="py-9"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#d6593f]">Workspace / Finance</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Invoices</h1><p className="mt-2 text-sm text-[#87847d]">Keep cash flow clear and clients in the loop.</p></div><div className="flex gap-2"><Button onClick={() => exportPdf()} variant="outline" className="h-11 rounded-xl border-[#ddd9d0] bg-white"><Download className="mr-2 size-4" />Export PDF</Button><Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogTrigger className="inline-flex h-11 items-center justify-center rounded-xl bg-[#d6593f] px-5 text-sm font-semibold text-white hover:bg-[#bb4933]"><Plus className="mr-2 size-4" />New invoice</DialogTrigger><DialogContent className="rounded-2xl border-[#e4e0d8] bg-[#fbfaf7]"><DialogHeader><DialogTitle>Generate invoice</DialogTitle><DialogDescription>Add a mock invoice to your workspace.</DialogDescription></DialogHeader><form onSubmit={generateInvoice} className="space-y-4 pt-3"><label className="block text-sm font-medium">Client<input required name="client" className="mt-2 h-11 w-full rounded-xl border border-[#ddd9d0] bg-white px-3 text-sm" placeholder="Client name" /></label><label className="block text-sm font-medium">Project<input required name="project" className="mt-2 h-11 w-full rounded-xl border border-[#ddd9d0] bg-white px-3 text-sm" placeholder="Project name" /></label><label className="block text-sm font-medium">Amount<input required min="1" name="amount" type="number" className="mt-2 h-11 w-full rounded-xl border border-[#ddd9d0] bg-white px-3 text-sm" placeholder="2500" /></label><Button className="h-11 w-full rounded-xl bg-[#292928] text-white">Generate invoice <Check className="ml-2 size-4" /></Button></form></DialogContent></Dialog></div></div><div className="mt-9 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#292928] p-5 text-white"><p className="text-xs text-white/55">Outstanding</p><p className="mt-5 text-3xl font-semibold">{money.format(outstanding)}</p><p className="mt-1 text-xs text-white/50">{invoices.filter((invoice) => !invoice.paid).length} invoices awaiting payment</p></div><div className="rounded-2xl border border-[#e4e0d8] bg-white p-5"><p className="text-xs text-[#87847d]">Collected</p><p className="mt-5 text-3xl font-semibold">{money.format(collected)}</p><p className="mt-1 text-xs text-[#87847d]">{invoices.filter((invoice) => invoice.paid).length} paid invoices</p></div><div className="rounded-2xl border border-[#e4e0d8] bg-white p-5"><p className="text-xs text-[#87847d]">Total invoices</p><p className="mt-5 text-3xl font-semibold">{invoices.length}</p><p className="mt-1 text-xs text-[#87847d]">This workspace</p></div></div><div className="mt-10 flex flex-col gap-4 border-b border-[#ddd9d0] pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-1">{(["All", "Paid", "Unpaid"] as const).map((item) => <button key={item} onClick={() => { setFilter(item); trackEvent("filter_used", { page: "invoices", filter: item }); }} className={`rounded-lg px-3 py-2 text-xs font-semibold ${filter === item ? "bg-[#292928] text-white" : "text-[#87847d] hover:bg-[#ebe8e1]"}`}>{item}</button>)}</div><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#aaa59b]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoices" className="h-9 w-full rounded-lg border border-[#ddd9d0] bg-white pl-9 text-xs sm:w-56" /></div></div><div className="mt-2 overflow-hidden rounded-2xl border border-[#e4e0d8] bg-white"><div className="hidden grid-cols-[1fr_1.2fr_.8fr_1fr_auto] gap-4 border-b border-[#ebe8e1] px-5 py-4 text-[10px] font-bold uppercase tracking-[.15em] text-[#aaa59b] sm:grid"><span>Invoice</span><span>Client / project</span><span>Amount</span><span>Status</span><span /></div>{visible.map((invoice) => <div key={invoice.id} className="grid gap-3 border-b border-[#ebe8e1] px-5 py-5 last:border-0 sm:grid-cols-[1fr_1.2fr_.8fr_1fr_auto] sm:items-center sm:gap-4"><div><p className="text-sm font-semibold">{invoice.id}</p><p className="mt-1 text-xs text-[#9a968d]">Due {invoice.due}</p></div><div><p className="text-sm font-medium">{invoice.client}</p><p className="mt-1 text-xs text-[#9a968d]">{invoice.project}</p></div><p className="text-sm font-semibold">{money.format(invoice.amount)}</p><div><button onClick={() => togglePaid(invoice)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${invoice.paid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{invoice.paid ? "Paid" : "Unpaid"}</button><p className="mt-2 text-[11px] text-[#aaa59b]">Issued {invoice.issued}</p></div><div className="flex gap-1"><button onClick={() => exportPdf(invoice)} aria-label={`Export ${invoice.id} as PDF`} className="rounded-lg p-2 text-[#87847d] hover:bg-[#f0ede7]"><FileText className="size-4" /></button><button aria-label={`More options for ${invoice.id}`} className="rounded-lg p-2 text-[#87847d] hover:bg-[#f0ede7]"><MoreHorizontal className="size-4" /></button></div></div>)}</div></section></div></main>;
}