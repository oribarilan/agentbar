import { expect, test } from "@playwright/test";

test("simulator root renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#app")).toBeVisible();
});

test("simulator heading is visible", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /agentbar simulator/i }),
  ).toBeVisible();
});

test("simulator renders tray summary", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[aria-label="Tray summary"]')).toBeVisible();
});

test("simulator renders instance cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".instance-card")).toHaveCount(5);
});
