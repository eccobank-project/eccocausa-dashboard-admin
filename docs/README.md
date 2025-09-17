# 📚 Índice de Documentación

Documentación técnica completa del **EccoBank Dashboard Admin**

## 🏗️ **Arquitectura y Optimizaciones**

### **Sistema de Rutas**

- 📖 [**Optimización React Router DOM**](./react-router-optimization.md)

  - Implementación de loaders para data fetching
  - Componentes Suspense y Await
  - Skeletons específicos por página
  - Separación de responsabilidades

- ⚡ [**Arquitectura Híbrida: Loaders + TanStack Query**](./loader-tanstack-query-hybrid.md)

  - Integración optimizada de React Router Loaders con TanStack Query
  - Navegación instantánea con cache inteligente
  - Pre-población de cache para performance superior
  - Estado reactivo y background updates

- 🛡️ [**Arquitectura de Middlewares**](./middleware-architecture.md)

  - Sistema de middlewares para autenticación
  - Middleware para rutas protegidas y públicas
  - Composición y reutilización de middlewares
  - Performance y seguridad mejorada

- 🎨 [**Optimización del Router**](./router-optimization.md)
  - Route components con Suspense integrado
  - Skeletons optimizados por feature
  - Error boundaries a nivel de ruta
  - Arquitectura limpia y mantenible

## 🗺️ **Integración de Datos**

### **Mapas y Geolocalización**

- 🗺️ [**Map Data Integration**](./map-data-integration.md)
  - Integración con servicios de mapas
  - Manejo de datos geográficos
  - Optimización de rendimiento en mapas

## ⚙️ **Configuración y Deploy**

### **GitHub Pages**

- 📖 [**Setup GitHub Pages**](./github-pages-setup.md)
  - Configuración de documentación con GitHub Pages
  - Options: Docusaurus, VitePress, o Markdown simple
  - GitHub Actions para deploy automático

## 🧩 **Componentes y Features**

### **Por Feature**

```
📁 Features Documentadas:
├── 👥 Customers - Gestión de clientes
├── 🧑‍💼 Collectors - Administración de colectores
├── 🏢 Sectors - Organización por sectores
├── 🗺️ Map - Visualización geográfica
├── 📊 Dashboard - Panel de control principal
└── ⚙️ Settings - Configuraciones del sistema
```

### **Shared Components**

```
📁 Componentes Compartidos:
├── 🎨 UI Components (Shadcn/UI)
├── 💀 Loading Skeletons
├── 🛡️ Route Protection
├── 📱 Responsive Layouts
└── 🔄 Error Boundaries
```

## 🛠️ **Desarrollo**

### **Estándares de Código**

- **TypeScript** - Configuración y mejores prácticas
- **ESLint/Biome** - Reglas de linting
- **Testing** - Estrategias de testing por feature
- **Performance** - Optimizaciones y métricas

### **Workflows**

- **Git Flow** - Estrategia de branching
- **CI/CD** - Pipelines de integración continua
- **Code Review** - Guías para revisión de código

## 📊 **Métricas y Analytics**

### **Performance**

- Bundle size optimization
- Lighthouse scores
- Core Web Vitals
- Loading performance

### **Business Metrics**

- User engagement
- Feature adoption
- Error tracking
- Usage analytics

## 🔗 **Enlaces Rápidos**

### **Repositorio**

- [🏠 Home](../README.md) - Información principal del proyecto
- [📦 Package.json](../package.json) - Dependencias y scripts
- [⚙️ Configuración](../biome.jsonc) - Configuración de herramientas

### **Demos y Ejemplos**

- [🎯 Demo Live](#) - Aplicación en funcionamiento
- [📱 Screenshots](#) - Capturas de pantalla
- [🎥 Video Demos](#) - Demostraciones en video

---

## 🤝 **Contribuir a la Documentación**

### **Estructura de Archivos**

```
docs/
├── README.md                     # 📋 Este índice
├── react-router-optimization.md  # 📖 Optimizaciones React Router
├── loader-tanstack-query-hybrid.md # ⚡ Arquitectura Híbrida Loaders+TanStack Query
├── middleware-architecture.md    # 🛡️ Sistema de middlewares
├── router-optimization.md        # 🎨 Optimización de rutas
├── map-data-integration.md       # 🗺️ Integración de mapas
└── github-pages-setup.md         # ⚙️ Configuración GitHub Pages
```

### **Convenciones**

- **Archivos en kebab-case**: `feature-name-docs.md`
- **Títulos descriptivos**: Use emojis para categorización visual
- **Código con syntax highlighting**: Especificar lenguaje en code blocks
- **Enlaces relativos**: Para navegación entre documentos
- **Ejemplos prácticos**: Incluir código funcional

### **Template para Nueva Documentación**

```markdown
# 🎯 Título del Feature

## 📋 Resumen

Descripción breve del feature o concepto.

## 🚀 Implementación

Código y ejemplos prácticos.

## 💡 Mejores Prácticas

Recomendaciones y patrones.

## 🔗 Referencias

Enlaces a recursos adicionales.
```

---

**📚 Documentación mantenida por el equipo de EccoBank**
