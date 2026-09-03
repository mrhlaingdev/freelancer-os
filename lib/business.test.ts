import { filterByQuery, formatMinutes, invoiceTotals, toggleInvoicePaid } from "./business";

describe("business rules", () => {
  it("calculates invoice totals by payment status", () => {
    expect(invoiceTotals([{ amount: 100, paid: true }, { amount: 250, paid: false }])).toEqual({ total: 350, paid: 100, unpaid: 250 });
  });
  it("toggles only the requested invoice", () => {
    expect(toggleInvoicePaid([{ id: "a", paid: false }, { id: "b", paid: true }], "a")).toEqual([{ id: "a", paid: true }, { id: "b", paid: true }]);
  });
  it("filters case-insensitively and supports empty queries", () => {
    const items = [{ name: "Atlas Site" }, { name: "Northstar" }];
    expect(filterByQuery(items, "atlas", (item) => [item.name])).toHaveLength(1);
    expect(filterByQuery(items, "", (item) => [item.name])).toHaveLength(2);
  });
  it("formats tracked minutes", () => expect(formatMinutes(145)).toBe("2h 25m"));
});