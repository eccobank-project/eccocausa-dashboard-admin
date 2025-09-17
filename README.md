# 🏦 EccoBank Dashboard Admin

**Dashboard administrativo moderno construido con React + TypeScript + Vite**

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)
![React Router](https://img.shields.io/badge/React_Router-DOM-red?logo=reactrouter)

## 🚀 **Características Principales**

- ⚡ **Performance Optimizada** - Arquitectura híbrida React Router + TanStack Query
- 🚀 **Navegación Instantánea** - Cache inteligente para navegación subsecuente
- 🎨 **UI Moderna** - Shadcn/UI + Tailwind CSS
- 🛡️ **Seguridad** - Sistema de autenticación con Supabase
- 📊 **Dashboard Completo** - Gestión de clientes, colectores, sectores y mapas
- 🧩 **Arquitectura Modular** - Features organizadas por dominio
- 🔄 **Estado Global** - TanStack Query para manejo de datos reactivo
- 💀 **Loading States** - Skeletons específicos para cada página

## 📁 **Estructura del Proyecto**

```
src/
├── features/           # 🎯 Features organizadas por dominio
│   ├── authentication/
│   ├── customers/
│   ├── dashboard/
│   ├── map/
│   └── sectors/
├── shared/            # 🔧 Componentes y utilidades compartidas
│   ├── components/
│   ├── router/        # Sistema de rutas con middlewares
│   └── layouts/
└── components/        # 🎨 UI Components (Shadcn/UI)
```

## 📚 **Documentación**

### **Arquitectura y Optimizaciones**

- 📖 [**Optimización React Router DOM**](./docs/react-router-optimization.md) - Loaders, Suspense y Await
- ⚡ [**Arquitectura Híbrida: Loaders + TanStack Query**](./docs/loader-tanstack-query-hybrid.md) - Navegación instantánea con cache inteligente
- 🛡️ [**Arquitectura de Middlewares**](./docs/middleware-architecture.md) - Sistema de autenticación y rutas
- 🗺️ [**Router Optimization**](./docs/router-optimization.md) - Skeletons y componentes optimizados

### **Integración de Datos**

- 🗺️ [**Map Data Integration**](./docs/map-data-integration.md) - Integración con mapas y geolocalización

## 🛠️ **Tecnologías Utilizadas**

### **Core**

- **React 18** - Framework principal con Concurrent Features
- **TypeScript** - Tipado estático para mejor developer experience
- **Vite** - Build tool ultrarrápido con HMR

### **Routing & State**

- **React Router DOM** - Routing con loaders y middlewares
- **TanStack Query** - Manejo de estado del servidor
- **Zustand** - Estado global ligero (si necesario)

### **UI & Styling**

- **Shadcn/UI** - Componentes accesibles y customizables
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Iconos modernos y consistentes

### **Data & Auth**

- **Supabase** - Backend as a Service (Auth + Database)
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas

## 🚀 **Quick Start**

### **Prerequisitos**

- Node.js 18+ o Bun
- npm, yarn, pnpm o bun

### **Instalación**

\`\`\`bash

# Clonar repositorio

git clone https://github.com/eccobank-project/eccobank-dashboard-admin.git
cd eccobank-dashboard-admin

# Instalar dependencias

bun install

# Configurar variables de entorno

cp .env.example .env.local

# Editar .env.local con tus credenciales de Supabase

\`\`\`

### **Desarrollo**

\`\`\`bash

# Iniciar servidor de desarrollo

bun dev

# Construir para producción

bun build

# Preview de producción

bun preview

# Linting y formateo

bun lint
bun format
\`\`\`

## 🏗️ **Arquitectura Destacada**

### **⚡ Navegación Híbrida Instantánea**

```typescript
// Combina React Router Loaders + TanStack Query para performance superior
export const customersLoader = createQueryLoader(
  ["clientList"], // 🔑 Query key compartido
  fetchClientList, // 📊 Función de fetch
  {
    staleTime: ONE_HOUR, // Cache de 1 hora
    gcTime: TWO_HOURS, // Garbage collection
  }
);

// Resultado: Navegación instantánea después de la primera carga
// ✅ Primera visita: Carga normal + cache pre-poblado
// ⚡ Visitas subsecuentes: Instantáneas (datos del cache)
```

### **🛡️ Sistema de Middlewares**

```typescript
// Rutas protegidas con middleware automático
export const dashboardLoader = createLoaderWithMiddlewares(
  [authProtectedMiddleware], // 🛡️ Verificar auth
  async () => ({
    // 📊 Cargar datos
    stats: await fetchDashboardStats(),
  })
);
```

### **💀 Loading States Específicos**

```typescript
// Cada página tiene su skeleton optimizado
export const DashboardRoute = () => (
  <RouteWrapper fallback={<DashboardSkeleton />}>
    <DashboardView />
  </RouteWrapper>
);
```

### **🧩 Componentización Modular**

```typescript
// Features organizadas por dominio
features/customers/
├── components/     # Componentes específicos
├── hooks/          # Custom hooks
├── actions/        # Queries y mutations
├── utils/          # Utilidades de negocio
└── types/          # TypeScript types
```

## 🤝 **Contribución**

1. Fork el proyecto
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add: nueva funcionalidad'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🔗 **Enlaces Útiles**

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [Supabase Documentation](https://supabase.com/docs)

---

**Desarrollado con ❤️ por el equipo de EccoBank**
