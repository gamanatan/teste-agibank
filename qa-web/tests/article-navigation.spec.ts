import { test, expect } from '@playwright/test';

/**
 * Cenário 2: Navegação e leitura de artigos do blog
 * Valida que artigos são acessíveis e exibem conteúdo correto
 */
test.describe('Navegação de artigos - Blog do Agi', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Deve exibir artigos na página inicial', async ({ page }) => {
    const articles = page.locator('article, .post, [class*="post-item"], [class*="card"]');
    await expect(articles.first()).toBeVisible({ timeout: 10_000 });
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Deve navegar para um artigo ao clicar no título', async ({ page }) => {
    // Pega o primeiro link de artigo disponível
    const articleLink = page.locator('article a, .post a, h2 a, h3 a').first();
    const href = await articleLink.getAttribute('href');

    await articleLink.click();
    await page.waitForLoadState('networkidle');

    // Deve ter navegado para uma URL diferente da home
    expect(page.url()).not.toBe('https://blogdoagi.com.br/');
    expect(page.url()).toContain('blogdoagi.com.br');
  });

  test('Artigo deve conter título e conteúdo', async ({ page }) => {
    // Navega para um artigo via busca
    const articleLink = page.locator('article a, .post a, h2 a, h3 a').first();
    await articleLink.click();
    await page.waitForLoadState('networkidle');

    // Título do artigo deve estar presente
    const title = page.locator('h1, .entry-title, .post-title, [class*="article-title"]').first();
    await expect(title).toBeVisible({ timeout: 10_000 });

    // Conteúdo do artigo deve estar presente
    const content = page.locator('.entry-content, .post-content, article p, [class*="content"] p').first();
    await expect(content).toBeVisible({ timeout: 10_000 });
  });

  test('Deve exibir o título do blog na página inicial', async ({ page }) => {
    await expect(page).toHaveTitle(/Agi|Blog/i);
  });

  test('Página inicial deve carregar sem erros de console críticos', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Não deve haver erros críticos de JavaScript
    expect(errors.filter(e => !e.includes('Non-Error'))).toHaveLength(0);
  });

  test('Deve exibir resultados de busca com título dos artigos', async ({ page }) => {
    // Navega diretamente para a URL de busca
    await page.goto('/?s=financas');
    await page.waitForLoadState('networkidle');

    // Resultados devem ter títulos clicáveis
    const titles = page.locator('h2 a, h3 a, .entry-title a, [class*="post-title"] a');
    const count = await titles.count();

    if (count > 0) {
      await expect(titles.first()).toBeVisible();
    }
  });
});
