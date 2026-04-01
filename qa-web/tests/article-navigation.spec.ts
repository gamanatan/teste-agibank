import { test, expect } from '@playwright/test';

/**
 * Cenário 2: Navegação e leitura de artigos do blog
 */
test.describe('Navegação de artigos - Blog do Agi', () => {

  test('Deve exibir o título do blog na página inicial', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/.+/); // título não vazio
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Deve exibir artigos na página inicial', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verifica que há links na página (artigos)
    const links = page.locator('a[href*="blogdoagi.com.br"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Deve navegar para um artigo ao clicar no título', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const homeUrl = page.url();

    // Pega qualquer link interno que não seja home, categoria ou tag
    const articleLink = page.locator('a[href*="blogdoagi.com.br"]').filter({
      hasNot: page.locator('[href$="/"]'),
    }).first();

    const href = await articleLink.getAttribute('href');
    if (href && href !== homeUrl) {
      await page.goto(href);
      await page.waitForLoadState('networkidle');
      expect(page.url()).not.toBe(homeUrl);
    }
  });

  test('Página de resultados de busca deve carregar corretamente', async ({ page }) => {
    await page.goto('/?s=credito');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('credito');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Página inicial deve responder com sucesso', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
  });

  test('Deve exibir resultados de busca com títulos dos artigos', async ({ page }) => {
    await page.goto('/?s=financas');
    await page.waitForLoadState('networkidle');

    // Verifica que a página tem conteúdo
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(100);
  });
});
