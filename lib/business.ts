export type InvoiceRecord = { amount: number; paid: boolean };

export function invoiceTotals(invoices: InvoiceRecord[]) {
  return invoices.reduce(
    (totals, invoice) => {
      totals.total += invoice.amount;
      if (invoice.paid) totals.paid += invoice.amount;
      else totals.unpaid += invoice.amount;
      return totals;
    },
    { total: 0, paid: 0, unpaid: 0 },
  );
}

export function toggleInvoicePaid<T extends { id: string; paid: boolean }>(invoices: T[], id: string) {
  return invoices.map((invoice) => invoice.id === id ? { ...invoice, paid: !invoice.paid } : invoice);
}

export function filterByQuery<T>(items: T[], query: string, fields: (item: T) => string[]) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;
  return items.filter((item) => fields(item).join(" ").toLowerCase().includes(normalizedQuery));
}

export function formatMinutes(minutes: number) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}