# PawFinds: conectar la interfaz existente a funciones reales

Sin rediseño: se reutilizan AppShell, AlertCard, páginas y estilos actuales. Solo se añaden pantallas mínimas que los flujos requieren (acceso, formulario de reporte, ficha, Mis reportes), con el mismo estilo de tarjetas, vidrio y colores.

## Inventario actual

Funciona hoy (solo navegación o estado local):
- Enlaces de navegación (inicio, menú lateral, barra móvil).
- Modo oscuro.
- Pestañas de estado en Alertas; filtros de tipo, radio y especie en el Mapa; abrir un pin del mapa en el panel lateral.

Solo visual (sin función):
- "Log in" y avatar "YM" del encabezado.
- Botón "Reportar mascota" (inicio y botón + móvil).
- Buscador del encabezado.
- En tarjetas y panel del mapa: Guardar, Compartir, Contactar, Avistamiento.
- Comunidad: publicar, me gusta, comentar, unirse a grupos.
- Menú lateral marcado "Soon".
- Todos los datos (mascotas, cifras, publicaciones) son de ejemplo.

## Qué se va a conectar

1. Cuentas: activar Lovable Cloud. Página `/auth` con registro (nombre, correo, contraseña) e inicio de sesión; recuperar contraseña con página `/reset-password`. El encabezado muestra "Log in" o el menú de usuario real (iniciales, Mis reportes, Cerrar sesión).
2. Reportar: el botón "Reportar mascota" y el + móvil abren `/report/new` (requiere sesión). Formulario validado: tipo (perdida/encontrada/avistamiento), nombre, especie, descripción, barrio/zona, ubicación en el mapa, fecha, urgencia, hasta 4 fotos (jpg/png/webp, máx. 5 MB). Opciones de contacto: mostrar teléfono, mostrar correo, o solo mensajes dentro de la app.
3. Listado real: Alertas, Mapa, Dashboard (sección de recientes) y la sección de alertas del inicio leen de la base de datos. Estados de carga, error y lista vacía con el estilo actual. Se eliminan los datos de ejemplo de reportes; las cifras falsas del inicio/dashboard se reemplazan por conteos reales o se retiran.
4. Buscar y filtrar: el buscador del encabezado lleva a Alertas con `?q=`; en Alertas se añaden filtros de tipo y especie junto a las pestañas existentes (en la URL). Clic en una tarjeta abre `/reports/$id` con la ficha completa: galería, datos, mapa, estado, fecha y contacto.
5. Mis reportes: `/my-reports` (sustituye el "Soon" de "My Pets"). Editar (mismo formulario), cambiar estado (pendiente/activo/reunido) y eliminar con confirmación.
6. Contacto seguro: el teléfono/correo nunca se envían al navegador salvo que el autor lo autorizó y quien consulta ha iniciado sesión. Siempre disponible "Enviar mensaje": se guarda en la base y el autor lo ve en Mis reportes (bandeja simple por reporte).
7. Botones restantes: Compartir usa compartir nativo / copiar enlace de la ficha. "Avistamiento" abre el formulario de reporte con tipo avistamiento vinculado. "Guardar" y la Comunidad (publicar, me gusta, comentar, unirse) no entran en este alcance: se ocultan para no dejar botones sin función; los "Soon" del menú permanecen como están (ya indicados como no disponibles). Comunidad mantiene su aviso de contenido de ejemplo.

## Detalles técnicos

- Tablas: `profiles` (nombre, teléfono; trigger al registrarse), `reports` (owner_id, tipo, especie, nombre, descripción, zona, lat/lng, fecha, urgencia, estado, fotos[], share_phone, share_email, contact_phone, contact_email, linked_report_id), `report_messages` (report_id, sender_id, cuerpo).
- RLS: lectura pública de reports solo vía vista `reports_public` sin columnas de contacto; insert/update/delete solo si `owner_id = auth.uid()`. Contacto se obtiene con función `get_report_contact(id)` SECURITY DEFINER que devuelve solo lo autorizado y exige sesión. Mensajes: insert por usuarios autenticados; lectura por remitente o dueño del reporte. GRANTs explícitos en cada tabla.
- Storage: bucket público `report-photos`; subir/borrar solo en carpeta `{auth.uid()}/`.
- Server functions (`createServerFn` + `requireSupabaseAuth`) para escritura; lecturas públicas con cliente publicable. Rutas privadas bajo `_authenticated/` (`report/new`, `reports/$id/edit`, `my-reports`).
- Validación con zod en cliente y servidor.
- Actualizar AGENTS.md (ya no es prototipo solo-UI). Pruebas pequeñas de validación del formulario y de la regla de contacto.
- Verificación con navegador: registrarse, publicar con foto, verlo en Alertas/Mapa, abrir ficha, contactar desde otra cuenta, editar/estado/eliminar.

## Configuración pendiente para ti

- Ninguna credencial externa: Lovable Cloud se activa sin cuentas. Por defecto el registro pide confirmar el correo; dime si prefieres entrar sin confirmación.
- Inicio con Google es opcional; no se incluye salvo que lo pidas.
