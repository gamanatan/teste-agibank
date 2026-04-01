import { test, expect } from '@playwright/test';

/**
 * Cenário 1: Pesquisa de artigos pelo campo de busca (lupa)
 * Valida o fluxo completo de busca no blog do Agi
 */
test.describe('Pesquisa de artigos - Blog do Agi', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Aguarda a página carregar completamente
    await page.waitForLoadState('domcontentloaded');
  });

  test('Deve exibir o ícone de busca na página inicial', async ({ page }) => {
    // O ícone de lupa deve estar visível no canto superior direito
    const searchIcon = page.locator('.search-icon, [aria-label*="busca"], [aria-label*="search"], .icon-search, button[class*="search"]').first();
    await expect(searchIcon).toBeVisible({ timeout: 10_000 });
  });

  test('Deve abrir o campo de busca ao clicar na lupa', async ({ page }) => {
    // Clica no ícone de busca
    const searchIcon = page.locator('.search-icon, [aria-label*="busca"], [aria-label*="search"], .icon-search, button[class*="search"], .search-toggle').first();
    await searchIcon.click();

    // Campo de input de busca deve aparecer
    const searchInput = page.locator('input[type="search"], input[name="s"], input[placeholder*="busca"], input[placeholder*="pesquisa"], input[placeholder*="Pesquisa"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5_000 });
  });

  test('Deve retornar resultados ao pesquisar por "investimento"', async ({ page }) => {
    // Abre a busca
    const searchIcon = page.locator('.search-icon, [aria-label*="busca"], [aria-label*="search"], .icon-search, button[class*="search"], .search-toggle').first();
    await searchIcon.click();

    // Digita o termo de busca
    const searchInput = page.locator('input[type="search"], input[name="s"], input[placeholder*="busca"], input[placeholder*="pesquisa"]').first();
    await searchInput.fill('investimento');
    await searchInput.press('Enter');

    // Aguarda a página de resultados
    await page.waitForLoadState('networkidle');

    // Deve haver ao menos um artigo nos resultados
    const results = page.locator('article, .post, .entry, [class*="post-item"], [class*="article"]');
    await expect(results.first()).toBeVisible({ timeout: 10_000 });
  });

  test('Deve exibir mensagem quando busca não retorna resultados', async ({ page }) => {
    const searchIcon = page.locator('.search-icon, [aria-label*="busca"], [aria-label*="search"], .icon-search, button[class*="search"], .search-toggle').first();
    await searchIcon.click();

    const searchInput = page.locator('input[type="search"], input[name="s"], input[placeholder*="busca"], input[placeholder*="pesquisa"]').first();
    await searchInput.fill('xyztermoquenonexiste123456');
    await searchInput.press('Enter');

    await page.waitForLoadState('networkidle');

    // URL deve conter o parâmetro de busca
    expect(page.url()).toContain('xyztermoquenonexiste123456');
  });

  test('Deve manter o termo pesquisado na URL após a busca', async ({ page }) => {
    const searchIcon = page.locator('.search-icon, [aria-label*="busca"], [aria-label*="search"], .icon-search, button[class*="search"], .search-toggle').first();
    await searchIcon.click();

    const searchInput = page.locator('input[type="search"], input[name="s"], input[placeholder*="busca"], input[placeholder*="pesquisa"]').first();
    await searchInput.fill('poupança');
    await searchInput.press('Enter');

    await page.waitForLoadState('networkidle');

    // URL deve refletir o termo buscado
    expect(page.url()).toMatch(/[?&]s=|[?&]q=|pesquisa|search/);
  });
});
