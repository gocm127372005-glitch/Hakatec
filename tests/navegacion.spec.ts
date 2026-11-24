import { test, expect } from "@playwright/test";

const RUTAS_DASHBOARD = [
  "/dashboard",
  "/dashboard/mapa",
  "/dashboard/calidad-agua",
  "/dashboard/humedales",
  "/dashboard/dispositivos",
  "/dashboard/camaras",
  "/dashboard/alertas",
  "/dashboard/incidentes",
  "/dashboard/informes",
  "/dashboard/usuarios",
  "/dashboard/configuracion",
  "/dashboard/auditoria",
];

test.describe("Redirección y login", () => {
  test("la raíz redirige a /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("el login muestra el formulario y el acceso de demostración", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel("Correo electrónico")).toBeVisible();
    await expect(page.getByLabel("Contraseña", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver demostración/ })).toBeVisible();
  });

  test("el acceso de demostración lleva al dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /Ver demostración/ }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Centro de operaciones" })).toBeVisible();
  });
});

test.describe("Navegación real por rutas", () => {
  for (const ruta of RUTAS_DASHBOARD) {
    test(`${ruta} carga sin 404 y se puede recargar directo`, async ({ page }) => {
      const respuesta = await page.goto(ruta);
      expect(respuesta?.status(), `status de ${ruta}`).toBeLessThan(400);
      await expect(page.locator("body")).not.toContainText("404");

      // Recarga directa de la misma ruta (sin pasar por /login primero)
      const respuestaRecarga = await page.reload();
      expect(respuestaRecarga?.status(), `status al recargar ${ruta}`).toBeLessThan(400);
    });
  }

  test("el botón atrás del navegador funciona entre rutas", async ({ page }) => {
    await page.goto("/dashboard");
    await page.goto("/dashboard/humedales");
    await expect(page).toHaveURL(/\/dashboard\/humedales$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});

test.describe("Tema claro/oscuro", () => {
  test("cambia de verdad y persiste tras recargar", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByTitle("Claro").click();
    const bgClaro = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    await page.reload();
    const bgTrasRecargar = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bgTrasRecargar).toBe(bgClaro);

    await page.getByTitle("Oscuro").click();
    const bgOscuro = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bgOscuro).not.toBe(bgClaro);
  });
});

test.describe("Mapa", () => {
  test("el mapa de Leaflet se renderiza con marcadores", async ({ page }) => {
    await page.goto("/dashboard/mapa");
    await expect(page.locator(".leaflet-container")).toBeVisible();
    const marcadores = page.locator("path.leaflet-interactive");
    await expect(marcadores.first()).toBeVisible({ timeout: 10_000 });
    expect(await marcadores.count()).toBeGreaterThanOrEqual(10);
  });
});

test.describe("Consola sin errores críticos", () => {
  test("/dashboard no genera errores de consola", async ({ page }) => {
    const errores: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errores.push(msg.text());
    });
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    expect(errores, errores.join("\n")).toHaveLength(0);
  });
});

test.describe("Reportes ciudadanos (público, sin sesión)", () => {
  test("el formulario público carga y se puede enviar", async ({ page }) => {
    await page.goto("/reportes-ciudadanos");
    await page.getByPlaceholder(/puente sobre el río/).fill("Puente La Providencia");
    await page.getByPlaceholder(/Describe lo que observaste/).fill("Mucha basura acumulada junto al puente.");
    await page.getByRole("button", { name: "Enviar reporte" }).click();
    await expect(page.getByText(/modo demostración|Reporte recibido/)).toBeVisible();
  });
});
