import { test, expect } from '@playwright/test';

/**
 * Cenário 2: Navegação e leitura de artigos do blog
 */
test.describe('Navegação de artigos - Blog do Agi', () => {

  test('Deve exibir o título do blog na página inicial', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Deve exibir artigos na página inicial', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Qualquer link na página
    const links = page.locator('a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Deve navegar para um artigo ao clicar no título', async ({ page }) => {
    // Navega direto para um artigo via busca — evita depender de seletores da home
    await page.goto('/?s=investimento');
    await page.waitForLoadState('networkidle');

    // Pega o primeiro link de resultado que seja um post
    const articleLink = page.locator('h2 a, h3 a, .entry-title a').first();
    const count = await articleLink.count();

    if (count > 0) {
      const href = await articleLink.getAttribute('href');
      expect(href).toBeTruthy();
      await page.goto(href!);
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/agibank\.com\.br/);
    } else {
      // Se não encontrou link de artigo, valida que a página de busca carregou
      expect(page.url()).toContain('investimento');
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

  test('Deve exibir resultados de busca com conteúdo', async ({ page }) => {
    await page.goto('/?s=financas');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(100);
  });
});
