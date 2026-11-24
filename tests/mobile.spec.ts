import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("el menú móvil abre, navega y se cierra", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Abrir menú de navegación" }).click();
  const enlaceMapa = page.getByRole("link", { name: "Mapa interactivo" });
  await expect(enlaceMapa).toBeVisible();
  await enlaceMapa.click();
  await expect(page).toHaveURL(/\/dashboard\/mapa$/);
});

test("no hay desplazamiento horizontal en 390x844", async ({ page }) => {
  await page.goto("/dashboard");
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});
