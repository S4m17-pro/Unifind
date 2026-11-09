# Pruebas manuales pendientes

Estas pruebas necesitan servicios externos o hardware y no se pueden automatizar
en el entorno local/CI. Ejecútalas antes de marcar los RF restantes como
verificados en `AGENTS.md` (§10).

## 1. Fotos privadas — Cloudinary (RF-REC-02)

1. Crea una cuenta en https://cloudinary.com y copia las tres credenciales.
2. En tu `.env`:

   ```bash
   CLOUDINARY_CLOUD_NAME="tu_cloud_name"
   CLOUDINARY_API_KEY="tu_api_key"
   CLOUDINARY_API_SECRET="tu_api_secret"
   ```

3. Reinicia `npm run dev` y entra a `/admin/dashboard`.
4. Registra un objeto adjuntando una foto real.
5. Abre "Ver ficha privada" y confirma que la imagen se ve.

Criterios:

- [ ] La foto se sube con tipo `authenticated` a la carpeta `unifind_private_items`.
- [ ] La ficha del admin firma la URL en el servidor y la muestra.
- [ ] En `/` y `/objetos/[id]` **no** aparece la foto ni ninguna URL de Cloudinary.
- [ ] Con credenciales inválidas el objeto se guarda igual y se muestra el aviso.

## 2. Correo de reclamo — Resend (RF-RCL-02)

1. Crea una cuenta en https://resend.com y verifica un dominio (o usa el de pruebas).
2. En tu `.env`:

   ```bash
   RESEND_API_KEY="re_..."
   EMAIL_FROM="UniFind <soporte@tudominio.com>"
   ADMIN_NOTIFICATION_EMAIL="porteria.principal@unilibre.edu.co"
   ```

3. Reinicia `npm run dev` y envía un reclamo desde `/objetos/[id]/reclamar`.

Criterios:

- [ ] El reclamo se guarda en la base de datos.
- [ ] Llega el correo a `ADMIN_NOTIFICATION_EMAIL` con el detalle del reclamo.
- [ ] El estudiante recibe confirmación de "reclamo recibido".
- [ ] Al aprobar o rechazar en el panel, el estudiante recibe el correo de resultado.
- [ ] El correo de rechazo invita a volver a reclamar con más detalle.
- [ ] En los logs **no** aparecen correos completos ni datos sensibles.

## 3. Escaneo de QR con cámara (RF-ENT-01)

1. Genera un objeto desde `/admin/dashboard` y abre el QR generado.
2. Entra a `/admin/dashboard` desde un celular o tablet (misma red: usa
   `http://<IP-de-tu-PC>:3000`, que Next muestra como "Network").
3. En la bitácora de entrega, permite el acceso a la cámara y escanea el QR.
4. Completa la entrega con firma.

Criterios:

- [ ] El navegador pide permiso de cámara (requiere HTTPS en producción).
- [ ] El código se rellena automáticamente en el campo "Código QR escaneado".
- [ ] La entrega termina en `ENTREGADO` con firma persistida.

> Nota: en `localhost` la cámara funciona; desde una IP de red local puede
> requerir HTTPS. En Vercel ya es HTTPS.

## 4. Despliegue en Vercel (RNF-05)

1. Importa el repositorio en Vercel y conecta la rama principal.
2. Configura las variables de entorno: `DATABASE_URL`, `AUTH_SECRET`,
   `NEXTAUTH_SECRET`, `AUTH_URL`, `NEXTAUTH_URL`, `CRON_SECRET`,
   Cloudinary y Resend.
3. Usa un Postgres administrado (Neon, Supabase, Vercel Postgres…) y ejecuta:

   ```bash
   npx prisma migrate deploy
   ```

4. Verifica el cron de `vercel.json` (`/api/cron/check-expiration`, 06:00 UTC)
   y que sin token responda 401.

Criterios:

- [ ] Login y catálogo funcionan en el dominio de producción.
- [ ] Las migraciones están aplicadas.
- [ ] El cron responde 401 sin token y 200 con `Authorization: Bearer $CRON_SECRET`.
- [ ] `/bienestar/reporte` se imprime/guarda como PDF correctamente.

## 5. Rendimiento (RNF)

- [ ] Catálogo público responde en menos de 1.5 s.
- [ ] Generación del QR en menos de 2 s.
- [ ] Catálogo usable en pantalla de celular (Mobile-First).
- [ ] Panel de portería usable en tablet (botones grandes, firma cómoda).
