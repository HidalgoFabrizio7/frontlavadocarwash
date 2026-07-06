# frontlavadocarwash — Frontend (Angular)

Frontend de un sistema de gestión de pedidos de lavado de muebles. Repo GitHub: `HidalgoFabrizio7/frontlavadocarwash` (rama de trabajo habitual: `FabrizioDev`, no `master`/`main` — confirmar rama activa con `git branch` antes de hacer push). Su contraparte backend vive en un repo hermano `backlavado` (carpeta `../backlavado` si ambos están clonados juntos, repo separado en GitHub), que expone la API en `http://localhost:8082` (ver `src/environments/environment.ts`).

## Stack y arranque

- Angular 19.2.0 standalone (sin NgModules, todo `imports: [...]` por componente).
- `@angular/material`/`@angular/cdk` están fijados en `^18.2.14` — **desalineados una versión major** respecto al resto de Angular. Es un riesgo conocido, no "arreglarlo" de pasada salvo que se pida explícitamente (requiere pruebas de regresión visual en todos los componentes Material).
- `npm start` (= `ng serve`), `npm run build` (= `ng build`).
- **El cache de disco de Angular (`.angular/cache`, basado en `lmdb`) puede romperse en este entorno con `Error: Not enough space` / `DataCloneError` durante builds concurrentes.** Si `ng build` falla así, revisar/deshabilitar `cli.cache.enabled` en `angular.json`, o evitar correr `ng build` y `ng serve` al mismo tiempo (compiten por memoria).
- SSR habilitado (`@angular/ssr`, `provideClientHydration()`) — cuidado con APIs de navegador (`localStorage`, `getUserMedia`) que no existen en el render de servidor; el patrón establecido es chequear `typeof window !== 'undefined'` antes de usarlas (ver `camera.component.ts`, `auth.service.ts`).

## Arquitectura

```
components/<dominio>/                    contenedor (ej. servicio.component.ts embebe RouterOutlet + Listar)
components/<dominio>/listar<dominio>/    tabla/cards de listado, filtros, paginación
components/<dominio>/registrar<dominio>/ formulario reactivo de alta/edición (mismo componente para ambos,
                                          decide por `edicion: boolean` resuelto desde route params)
services/<dominio>.service.ts            HttpClient wrapper, mismo shape: list/insertar/listId/update/eliminar
models/<Dominio>.ts                      clases TS espejo de los DTOs backend, con defaults inline
guards/auth.guard.ts                     CanActivateFn, solo valida token presente
services/auth.service.ts                 login/logout/token en localStorage (key "carwash_token")
interceptors/auth.interceptor.ts         adjunta "Authorization: Bearer ..." a cada request
```

Dominios: Cliente, Servicio (→Cliente), Mueble (→Servicio), Cobranza (→Servicio), Users/Role (auth, sin UI de administración construida todavía — la ruta `/usuarios` está comentada en `app.routes.ts`).

## Convenciones y gotchas conocidos (ya corregidos en esta sesión, no reintroducir)

- **Las pantallas de edición (`registrar*.component.ts`) deben llamar `update()` cuando `edicion=true`, no `insertar()`** — había un bug donde TODAS llamaban siempre a insertar y "funcionaban" solo por el `merge()` automático de JPA en el backend. Ya se corrigió para Cliente/Servicio/Mueble/Cobranza.
- **routerLink de edición debe ser relativo a la ruta padre o absoluto completo, nunca una ruta inventada** — había un bug en `listarservicio.component.html` con `['/ediciones', id]` (ruta absoluta que no existe) en vez de `['/servicio/ediciones', id]`.
- **`readonly="edicion"` y `disabled="edicion"` sin corchetes `[...]` son bugs de sintaxis** (atributo HTML literal siempre truthy, no property binding) — aparecen en varios formularios (`registrarservicio.component.html` en los campos de fecha, entre otros). El caso de `registrarservicio.component.html` se dejó tal cual a propósito (ver más abajo, es el comportamiento esperado para el rol Empleado); si ves el mismo patrón en otro componente y no es intencional, es candidato a arreglar.
- **En `registrarservicio.component.html`, en modo edición TODOS los campos del Servicio quedan bloqueados** (cliente, dirección, estado, tipo, fechas) — la pantalla de edición funciona en la práctica solo como contenedor para gestionar los Muebles del servicio (`<app-registrarmueble>`/`<app-listarmueble>` embebidos), no para modificar el Servicio en sí. Esto es una decisión de producto ya confirmada, no un bug a arreglar.
- **El botón "Aceptar" de `registrarservicio.component.html` tenía `*ngIf="!edicion"`** (invisible en modo edición) — ya corregido para que siempre se muestre.
- **`MuebleEtapasDTO`/`PATCH /muebles/etapaFecha/{id}`**: el frontend (`mueble.service.ts#actualizarEtapaYFecha`) ya llama bien a este endpoint; si el backend responde 404 para un id inexistente (fix reciente), confirmar que el manejo de error en `estadosmueble.component.ts` no rompe el flujo feliz.
- **Formularios con `formControlName` que no coinciden con el `FormGroup` real** causan `NG0304` en consola silenciosamente (el campo nunca se conecta, no truena visualmente) — pasó en `registrarcobranza.component.html`. Si un campo "no guarda" o un `mat-error` nunca aparece, sospecha de esto primero y compara el HTML contra el `formBuilder.group({...})` real.
- **Componentes de tabla (`mat-table`) con `displayedColumns` que declaran más columnas de las que el HTML define via `matColumnDef`** rompen el render silenciosamente (`Could not find column with id "X"`) — pasó en `listarcobranza.component.ts`.
- **Fechas con `[max]`/`[min]` mal calculadas** (ej. `moment().add(-1,'days')` como tope máximo, dejando fuera el día de hoy) — revisar la semántica del campo (¿es una fecha futura de "programación" o pasada de "registro"?) antes de copiar el patrón de otro formulario.

## Trabajo en curso: sistema de 4 roles + dashboard de Supervisor

Hay un plan multi-etapa aprobado para agregar navegación/permisos diferenciados por rol (`ADMIN`, `VENTAS`, `EMPLEADO`, `SUPERVISOR`, ya protegidos en el backend). Las etapas que tocan este repo (frontend) son: **0.2** (decodificar JWT con `@auth0/angular-jwt`, `AuthService.getRole()`/`hasRole()`, `role.guard.ts`), **1** (defaults de fecha/estado en `registrarservicio`), **2** (defaults de Mueble según tipo de Servicio padre en `registrarmueble`), **3** (reactivar `components/servicio/recojosycierre/` — hoy es scaffold vacío sin ruta, candidato para la vista de Empleados de "servicios pendientes de recojo"; filtrar `estadosmueble` para excluir muebles de servicios a domicilio; ocultar botón Editar de Servicio para Empleados salvo tipo domicilio), **5** (dashboard con `chart.js@^4.4.3` + `ng2-charts@^6.0.1` — versiones confirmadas contra el repo de referencia `Coragyps/urpetweb` rama `ArturoRojas`), **6** (menú y redirección post-login diferenciados por rol).

Decisiones ya cerradas (no volver a preguntar): decodificar el JWT con `@auth0/angular-jwt` (el claim ya se llama `"role"`, generado por el backend, no hace falta ningún endpoint `/me` nuevo), enforcement de reglas en backend Y frontend, "editar servicio" para Empleado = solo gestionar Muebles (no destrabar los campos bloqueados del Servicio). El detalle completo de cada etapa (snippets de código, pasos de verificación) está en el prompt que se usó para arrancar esta sesión — si no lo tienes a mano, pide al usuario que lo repita o revisa el CLAUDE.md hermano en `backlavado` para el contexto del lado servidor.

## Verificación

- `ng serve`, login, y probar cada flujo end-to-end en el navegador (no solo compilar) — varios de los bugs de esta sesión (`NG0304`, columnas de tabla rotas, rutas absolutas inválidas) solo se detectan interactuando con la UI real, no con `ng build`.
- Si vas a instalar una librería nueva (`@auth0/angular-jwt`, `chart.js`, `ng2-charts`), confirmar la versión exacta contra lo indicado arriba antes de dejar que npm resuelva otra.
