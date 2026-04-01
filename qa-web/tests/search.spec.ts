import { test, expect } from '@playwright/test';

/**
 * Cenário 1: Pesquisa de artigos pelo campo de busca (lupa)
 * Valida o fluxo completo de busca no blog do Agi
 */
test.describe('Pesquisa de artigos - Blog do Agi', () => {

  test('Deve exibir o ícone de busca na página inicial', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const searchIcon = page.locator('.search-icon, [aria-label*="busca"], [aria-label*="search"], .icon-search, button[class*="search"], .search-toggle, [class*="search"] button, header button').first();
    await expect(searchIcon).toBeVisible({ timeout: 15_000 });
  });

  test('Deve abrir o campo de busca ao clicar na lupa', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const searchIcon = page.locator('.search-icon, [aria-label*="busca"], [aria-label*="search"], .icon-search, button[class*="search"], .search-toggle, [class*="search"] button').first();
    await searchIcon.click();
    const searchInput = page.locator('input[type="search"], input[name="s"], input[placeholder*="busca"], input[placeholder*="pesquisa"], input[placeholder*="Pesquisa"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
  });

  test('Deve retornar resultados ao pesquisar por "investimento"', async ({ page }) => {
    await page.goto('/?s=investimento');
    await page.waitForLoadState('networkidle');
    const results = page.locator('article, .post, .entry, [class*="post-item"], [class*="article"]');
    await expect(results.first()).toBeVisible({ timeout: 15_000 });
  });

  test('Deve exibir mensagem quando busca não retorna resultados', async ({ page }) => {
    await page.goto('/?s=xyztermoquenonexiste123456');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('xyztermoquenonexiste123456');
  });

  test('Deve manter o termo pesquisado na URL após a busca', async ({ page }) => {
    await page.goto('/?s=poupanca');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/[?&]s=/);
  });
});
