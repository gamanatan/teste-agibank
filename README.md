# Teste Técnico QA — Agibank

Olá! Este repositório contém a entrega do meu teste técnico de QA para o Agibank. Organizei tudo em três módulos separados, cada um cobrindo uma das frentes solicitadas: testes de API, testes Web (E2E) e testes de Performance.

Tentei seguir boas práticas em cada módulo — código limpo, testes bem nomeados, relatórios gerados automaticamente e um pipeline de CI configurado no GitHub Actions pra garantir que tudo rode em qualquer máquina.

---

## Estrutura do projeto

```
teste-agibank/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline GitHub Actions
├── qa-api/                      # Testes de API - Dog API (Java)
├── qa-web/                      # Testes E2E - Blog do Agi (Playwright)
├── qa-performance/              # Testes de Performance - BlazDemo (JMeter)
└── README.md
```

---

## qa-api — Testes de API (Dog API)

### Sobre

Desenvolvi os testes para validar a integração com a [Dog API](https://dog.ceo/dog-api/documentation) usando Java com RestAssured. Escolhi essa stack porque é amplamente usada no mercado para testes de API em Java e tem uma sintaxe bem fluente e legível.

Para os relatórios, integrei o Allure, que gera uma visualização bem completa dos resultados com detalhes de cada requisição.

### Tecnologias

- Java 11
- RestAssured 5.4
- JUnit 5
- Allure Report
- Maven

### Endpoints testados

**GET /breeds/list/all**
- Retorna status 200 com `status: success`
- Mapa de raças não vazio
- Contém raças conhecidas (labrador, poodle, bulldog)
- Content-Type correto (application/json)
- Sub-raças retornadas como lista

**GET /breed/{breed}/images**
- Retorna imagens para raça válida (labrador)
- Teste parametrizado com múltiplas raças (labrador, poodle, beagle, husky)
- URLs das imagens apontam para o domínio correto
- Raça inválida retorna erro 404
- Suporte a sub-raças (bulldog/french)

**GET /breeds/image/random**
- Retorna status 200 com `status: success`
- URL da imagem é válida e termina em .jpg/.png
- Teste repetido 3x para validar aleatoriedade
- Resposta contém apenas os campos esperados

### Como executar

Pré-requisitos: Java 11+ e Maven 3.8+

```bash
cd qa-api

# Rodar os testes
mvn test

# Gerar e abrir relatório Allure no browser
mvn allure:serve
```

O relatório HTML também fica disponível em `target/site/allure-maven-plugin/index.html` após rodar `mvn allure:report`.

---

## qa-web — Testes E2E (Blog do Agi)

### Sobre

Para os testes do [Blog do Agi](https://blogdoagi.com.br/), escolhi Playwright com TypeScript. É uma ferramenta moderna, muito estável para testes E2E e funciona bem cross-browser. Levantei dois cenários que considerei mais relevantes para validar a funcionalidade de pesquisa do blog.

### Tecnologias

- TypeScript
- Playwright 1.43
- Node.js 18+

### Cenários cobertos

**Cenário 1 — Pesquisa de artigos (lupa)**

Esse foi o cenário principal pedido no teste. Validei o fluxo completo de busca:
- Ícone de busca está visível na página inicial
- Campo de busca abre ao clicar na lupa
- Pesquisa por "investimento" retorna resultados
- Busca por termo inexistente não quebra a aplicação
- Termo pesquisado é refletido na URL (importante para SEO e compartilhamento)

**Cenário 2 — Navegação e leitura de artigos**

Complementar ao primeiro, valida que o conteúdo do blog está acessível:
- Artigos são listados na página inicial
- Clicar no título navega para o artigo correto
- Artigo exibe título e conteúdo
- Título da página está correto
- Página carrega sem erros críticos de JavaScript
- Resultados de busca exibem títulos clicáveis

### Como executar

Pré-requisitos: Node.js 18+

```bash
cd qa-web

# Instalar dependências (primeira vez)
npm install

# Instalar o browser (primeira vez)
npx playwright install chromium

# Rodar os testes
npx playwright test

# Ver relatório HTML
npx playwright show-report
```

Para rodar com o browser visível (útil para debug):
```bash
npx playwright test --headed
```

O relatório HTML fica em `playwright-report/index.html`.

---

## qa-performance — Testes de Performance (BlazDemo)

### Sobre

Para o teste de performance, desenvolvi um script JMeter cobrindo o fluxo completo de compra de passagem aérea no [BlazDemo](https://www.blazedemo.com). Criei dois tipos de teste: carga e pico, ambos visando validar o critério de aceitação definido.

### Tecnologias

- Apache JMeter 5.6+

### Cenário testado

Fluxo completo de compra de passagem:
1. `GET /` — Acessar a home
2. `POST /reserve.php` — Selecionar origem (Paris) e destino (Buenos Aires)
3. `POST /purchase.php` — Escolher o voo
4. `POST /confirmation.php` — Confirmar a compra (validado com assertion na mensagem de sucesso)

### Critério de aceitação

> 250 requisições por segundo com tempo de resposta P90 inferior a 2 segundos

### Configuração dos testes

| Tipo de Teste | Usuários | Ramp-up | Iterações | Objetivo |
|---------------|----------|---------|-----------|----------|
| Carga | 250 | 60s | 10 | Simular uso sustentado |
| Pico | 500 | 10s | 5 | Simular pico repentino de acesso |

### Como executar

Pré-requisitos: [JMeter 5.6+](https://jmeter.apache.org/download_jmeter.cgi)

```bash
cd qa-performance

# Criar pasta de resultados
mkdir results

# Teste de Carga
jmeter -n -t blazedemo-load-test.jmx -l results/load.jtl -e -o results/load-report

# Teste de Pico
jmeter -n -t blazedemo-load-test.jmx -l results/spike.jtl -e -o results/spike-report
```

Após a execução, abra `results/load-report/index.html` no browser para visualizar o relatório completo.

> **Windows:** se o comando `jmeter` não for reconhecido, use o caminho completo: `C:\apache-jmeter-5.6.3\bin\jmeter.bat`

### Considerações sobre o critério de aceitação

O BlazDemo é um ambiente de demonstração público, então o comportamento pode variar dependendo da carga global no servidor no momento da execução. Em um ambiente real de homologação, o critério de 250 req/s com P90 < 2s seria mais controlável. Nos meus testes, o fluxo completo de compra respondeu dentro do esperado em condições normais, mas o teste de pico (500 usuários em 10s) tende a estressar mais o servidor e pode apresentar degradação — o que é exatamente o objetivo desse tipo de teste.

---

## CI/CD — GitHub Actions

Configurei um pipeline no GitHub Actions que roda automaticamente em todo push ou pull request para a branch `main`. Ele executa os três módulos de teste e publica os relatórios como artefatos para download.

O arquivo está em `.github/workflows/ci.yml`.

Os três jobs configurados são:

- `api-tests` — baixa o Java 11, roda `mvn test` e publica o relatório Allure como artefato
- `web-tests` — instala o Node 20, instala o Playwright com Chromium e roda os testes E2E, publicando o relatório HTML
- `performance-tests` — faz o download do JMeter 5.6.3 direto no runner, executa o teste de carga contra o BlazDemo e publica o relatório HTML do JMeter como artefato

Vale mencionar que o teste de performance pode demorar entre 5 e 10 minutos no CI dependendo da resposta do servidor BlazDemo, já que é um ambiente público. O script está configurado com 250 threads e 10 iterações para o teste de carga. Se quiser uma execução mais rápida no pipeline, é só reduzir as iterações no `.jmx`.

---

## Considerações finais

Procurei equilibrar cobertura de testes com clareza de código. Cada teste tem um nome descritivo, está organizado por feature e usa níveis de severidade no Allure para facilitar a triagem em caso de falhas.

Qualquer dúvida, fico à disposição!
