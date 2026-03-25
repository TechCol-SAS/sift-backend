# Sift Backend

Backend del proyecto Sift construido con NestJS, PostgreSQL y TypeScript. Sistema de autenticación JWT con refresh tokens y arquitectura modular escalable.

## 📋 Descripción

API RESTful que proporciona servicios de autenticación, gestión de usuarios y endpoints para el sistema Sift. Implementa autenticación basada en JWT con refresh tokens, validación de datos robusta y conexión a base de datos PostgreSQL.

## 🚀 Tecnologías Principales

- **NestJS 11.x** - Framework progresivo de Node.js
- **TypeScript 5.7.x** - Lenguaje tipado
- **PostgreSQL** - Base de datos relacional
- **TypeORM 0.3.28** - ORM para gestión de datos
- **JWT** - Autenticación con tokens
- **Bcrypt 6.x** - Hashing de contraseñas

## 📁 Estructura del Proyecto

```
sift-backend/
├── src/
│   ├── app.module.ts              # Módulo raíz
│   ├── main.ts                    # Punto de entrada
│   ├── auth/                      # Módulo de autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts      # Guard JWT global
│   │   ├── dto/
│   │   └── interfaces/
│   ├── user/                      # Módulo de usuarios
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   ├── database/                  # Configuración de BD
│   │   └── database.module.ts
│   ├── health/                    # Health check
│   │   ├── health.controller.ts
│   │   └── health.service.ts
│   └── common/                    # Utilidades compartidas
│       └── decorators/
├── .env.example                   # Plantilla de variables
├── package.json
└── README.md
```

## ⚙️ Configuración

### Prerrequisitos

- Node.js 18.x o superior
- PostgreSQL 14.x o superior
- npm o yarn

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# Entorno
NODE_ENV=development

# Aplicación
PORT=3000

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=sift_db

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
```

### Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd sift-backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Iniciar la aplicación:

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Registro (Sign-Up):**
   - Usuario envía datos (nombre, email, password)
   - Sistema valida y hashea la contraseña
   - Crea usuario en base de datos
   - Genera access token (1h) y refresh token (4h)
   - Retorna tokens y datos del usuario

2. **Inicio de Sesión (Sign-In):**
   - Usuario envía email y password
   - Sistema verifica credenciales
   - Genera nuevos tokens
   - Retorna tokens y datos del usuario

3. **Renovación de Token:**
   - Cliente envía refresh token
   - Sistema valida y genera nuevos tokens
   - Retorna nuevos access y refresh tokens

4. **Protección de Rutas:**
   - AuthGuard global verifica JWT en todas las rutas
   - Rutas públicas marcadas con decorador `@Public()`
   - Token válido adjunta payload a `request.user`

### Configuración de Tokens

- **Access Token:** Expira en 1 hora
- **Refresh Token:** Expira en 4 horas
- **Hash:** bcrypt con 10 rounds
- **Storage:** Refresh tokens hasheados en base de datos

## 📡 API Endpoints

### Salud

- `GET /api/health` - Health check del servidor (público)

### Autenticación

- `POST /api/auth/sign-up` - Registro de usuarios (público)

  ```json
  {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "Password123",
    "isActive": true
  }
  ```

- `POST /api/auth/sign-in` - Inicio de sesión (público)

  ```json
  {
    "email": "juan@example.com",
    "password": "Password123"
  }
  ```

- `POST /api/auth/refresh-token` - Renovación de tokens (protegido)
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Respuesta de Autenticación

```json
{
  "user": {
    "id": "uuid",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "isActive": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🗄️ Base de Datos

### Entidad User

```typescript
{
  id: string (UUID)
  firstName: string (50 caracteres)
  lastName: string (50 caracteres)
  email: string (100 caracteres, único)
  password: string (hasheado)
  refreshToken: string | null (único)
  isActive: boolean (default: true)
}
```

### Configuración TypeORM

- **Sincronización automática** en desarrollo
- **Auto-carga de entidades**
- **3 reintentos** de conexión con 5s de delay
- ⚠️ **Importante:** Desactivar `synchronize` en producción

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Inicia servidor con watch mode

# Producción
npm run build          # Compila TypeScript
npm run start:prod     # Inicia servidor en producción

# Código
npm run lint           # Ejecuta ESLint
npm run format         # Formatea código con Prettier

# Testing
npm run test           # Ejecuta tests unitarios
npm run test:watch     # Tests en modo watch
npm run test:cov       # Tests con cobertura
npm run test:e2e       # Tests end-to-end
```

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ Refresh tokens hasheados en base de datos
- ✅ Validación de DTOs con class-validator
- ✅ Guard JWT global en todas las rutas
- ✅ ValidationPipe global con whitelist
- ✅ Variables de entorno con validación Joi

## 📦 Características Implementadas

- ✅ Autenticación JWT con refresh tokens
- ✅ Registro y login de usuarios
- ✅ Protección de rutas con guards
- ✅ Validación exhaustiva de datos
- ✅ Conexión a PostgreSQL con TypeORM
- ✅ Health check endpoint
- ✅ Configuración centralizada
- ✅ CI/CD con GitHub Actions

## 🚧 Próximas Funcionalidades

- [ ] Endpoints de gestión de usuarios (CRUD)
- [ ] Sistema de roles y permisos
- [ ] Documentación Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Logout con invalidación de tokens
- [ ] Soft delete de usuarios
- [ ] Paginación en listados
- [ ] Tests unitarios y e2e completos

## 📝 Convenciones de Código

- **Linting:** ESLint con configuración de NestJS
- **Formateo:** Prettier
- **Commits:** Conventional Commits con emojis
- **TypeScript:** Strict mode habilitado

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feat/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'feat: ✨ Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feat/nueva-funcionalidad`)
5. Abrir Pull Request

## 👥 Autores

TechCol SAS

---

**Versión:** 0.0.1  
**Última actualización:** Marzo 2026
