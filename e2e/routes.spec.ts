import { expect, test } from "@playwright/test";

test("primary workspace routes load", async ({ page }) => {
  for (const route of ["/projects", "/invoices", "/time-tracking"]) {
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
  }
});

test("projects can open the add project dialog", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: /add project/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: /add a new project/i })).toBeVisible();
});