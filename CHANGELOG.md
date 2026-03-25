# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Sin Versión] - 2026-03-25

### ✨ Añadido

#### Sistema de Autenticación

- Implementación completa del sistema de autenticación JWT
- Endpoint `POST /api/auth/sign-up` para registro de usuarios
- Endpoint `POST /api/auth/sign-in` para inicio de sesión
- Endpoint `POST /api/auth/refresh-token` para renovación de tokens
- AuthGuard global para protección de rutas
- Decorador `@Public()` para rutas públicas
- Generación de access tokens (expiración: 1 hora)
- Generación de refresh tokens (expiración: 4 horas)
- Hash de contraseñas con bcrypt (10 rounds)
- Hash de refresh tokens antes de almacenar en base de datos
- Validación de refresh tokens en proceso de renovación

#### Módulo de Usuarios

- Creación del módulo User con controlador y servicio
- Entidad User con TypeORM
  - Campos: id (UUID), firstName, lastName, email, password, refreshToken, isActive
  - Email único e indexado
  - Refresh token único
- UserService con métodos:
  - `findByTerm()` - Búsqueda por UUID o email
  - `create()` - Creación de usuarios
  - `updateRefreshToken()` - Actualización de refresh token
- DTOs de validación:
  - SignUpDto (firstName, lastName, email, password, isActive)
  - SignInDto (email, password)
  - RefreshTokenDto (refreshToken)

#### Base de Datos

- Configuración del módulo Database con TypeORM
- Integración con PostgreSQL
- Configuración asíncrona con variables de entorno
- Auto-carga de entidades en desarrollo
- Sincronización automática en desarrollo
- Sistema de reintentos de conexión (3 intentos, 5s delay)
- Validación de variables de entorno de base de datos

#### Configuración y Estructura

- Configuración global de la aplicación con @nestjs/config
- Validación de variables de entorno con Joi
- ValidationPipe global con opciones:
  - `whitelist: true` - Elimina propiedades no decoradas
  - `forbidNonWhitelisted: true` - Rechaza propiedades extras
  - `transform: true` - Transforma payloads automáticamente
- Prefijo global de API: `/api`
- Módulo Health con endpoint `GET /api/health`
- Archivo `.env.example` con plantilla de configuración

#### Documentación

- Integración de Swagger/OpenAPI para documentación interactiva
- Swagger UI disponible en `/api/docs`
- Especificación OpenAPI en formato JSON en `/api/docs-json`
- Documentación automática de todos los endpoints
- Esquemas de DTOs documentados
- Configuración de autenticación Bearer JWT en Swagger
- Tags organizados por módulos (Auth, Health)

#### Integración Continua

- Workflow de GitHub Actions para CI
- Verificación automática de builds
- Ejecución de linters en PRs y commits

### 🔧 Cambiado

- Renombrado de DTOs para mejor organización
- Reestructuración de módulos siguiendo arquitectura de NestJS
- Actualización de prefijo global a `/api` para todos los endpoints

### 🗑️ Eliminado

- Limpieza del boilerplate inicial de NestJS
- Eliminación de código de ejemplo no utilizado

### 🔒 Seguridad

- Implementación de hashing de contraseñas con bcrypt
- Almacenamiento seguro de refresh tokens (hasheados)
- Validación exhaustiva de inputs con class-validator
- Protección de rutas con JWT authentication guard
- Variables sensibles manejadas a través de variables de entorno

### 📚 Documentación

- Creación de README.md completo en español
- Documentación de arquitectura del proyecto
- Guía de instalación y configuración
- Documentación de endpoints de API
- Explicación del flujo de autenticación
- Listado de scripts disponibles
- Documentación interactiva con Swagger/OpenAPI

---

## Notas de la Versión

Esta es la primera iteración funcional del backend de Sift. El sistema incluye:

1. **Autenticación Robusta:** Sistema completo de JWT con refresh tokens, permitiendo sesiones seguras y renovables.

2. **Arquitectura Modular:** Estructura basada en módulos de NestJS que facilita el mantenimiento y escalabilidad.

3. **Validación Completa:** Validación de datos en múltiples niveles (DTOs, guards, variables de entorno).

4. **Base Sólida:** Configuración de base de datos con TypeORM lista para expandir con nuevas entidades.

### Próximos Pasos

- Implementar endpoints CRUD para gestión de usuarios
- Agregar sistema de roles y permisos
- Agregar rate limiting para prevenir abuso
- Implementar funcionalidad de logout
- Agregar tests unitarios y e2e
- Implementar soft delete para usuarios
- Agregar logging más robusto

---

**Formato de Commits Utilizados:**

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento
- `ci:` - Cambios en CI/CD

---

_Este changelog será actualizado con cada versión nueva del proyecto._
