# Configuración de GitHub Pages para Documentación

## Opción 1: Usando Docusaurus (Recomendado)

### Crear sitio de documentación

```bash
# En una carpeta separada o branch gh-pages
npx create-docusaurus@latest eccobank-docs classic --typescript

# Mover documentación existente
mv docs/ eccobank-docs/docs/
```

### Configurar GitHub Actions para deploy automático

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths: ["docs/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install and Build
        run: |
          cd eccobank-docs
          npm install
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./eccobank-docs/build
```

## Opción 2: Usando VitePress

```bash
# Instalar VitePress
npm add -D vitepress

# Crear estructura
mkdir docs-site
cd docs-site
npm init -y
npm install vitepress
```

### Configuración simple de VitePress

```javascript
// docs-site/.vitepress/config.js
export default {
  title: "EccoBank Dashboard",
  description: "Documentación del dashboard administrativo",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Arquitectura", link: "/architecture/" },
      { text: "API", link: "/api/" },
    ],

    sidebar: [
      {
        text: "Optimizaciones",
        items: [
          { text: "React Router", link: "/react-router-optimization" },
          { text: "Middlewares", link: "/middleware-architecture" },
          { text: "Router", link: "/router-optimization" },
        ],
      },
    ],
  },
};
```

## Opción 3: GitHub Pages Simple

### Solo con archivos markdown existentes

```yaml
# .github/workflows/pages.yml
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./docs"
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
