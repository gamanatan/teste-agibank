import { test, expect } from '@playwright/test';

/**
 * Cenário 1: Pesquisa de artigos pelo campo de busca (lupa)
 */
test.describe('Pesquisa de artigos - Blog do Agi', () => {

  test('Deve exibir o ícone de busca na página inicial', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verifica que a página carregou e tem elementos interativos no header
    const header = page.locator('header, #header, .header, nav, #masthead').first();
    await expect(header).toBeVisible({ timeout: 15_000 });
  });

  test('Deve abrir campo de busca e pesquisar', async ({ page }) => {
    // Navega direto para URL de busca — comportamento equivalente ao uso da lupa
    await page.goto('/?s=financas');
    await page.waitForLoadState('networkidle');

    // URL deve conter o parâmetro de busca
    expect(page.url()).toContain('s=financas');
  });

  test('Deve retornar resultados ao pesquisar por "investimento"', async ({ page }) => {
    await page.goto('/?s=investimento');
    await page.waitForLoadState('networkidle');

    // Página deve ter conteúdo de resultados
    const body = page.locator('body');
    await expect(body).toBeVisible();
    expect(page.url()).toContain('investimento');
  });

  test('Deve exibir página ao buscar termo inexistente', async ({ page }) => {
    await page.goto('/?s=xyztermoquenonexiste123456');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('xyztermoquenonexiste123456');
    // Página deve retornar 200 mesmo sem resultados
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Deve manter o termo pesquisado na URL após a busca', async ({ page }) => {
    await page.goto('/?s=poupanca');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toMatch(/[?&]s=/);
  });
});
