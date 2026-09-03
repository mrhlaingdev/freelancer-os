import type { Metadata } from "next";
import InvoicesDashboard from "./invoices-dashboard";

export const metadata: Metadata = {
  title: "Invoices | Powerhouse",
  description: "Create, track, and export client invoices.",
};

export default function InvoicesPage() {
  return <InvoicesDashboard />;
}