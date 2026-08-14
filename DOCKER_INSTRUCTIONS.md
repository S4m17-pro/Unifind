# Comandos útiles de Docker Compose para UniFind

# 1. Iniciar la base de datos en segundo plano
docker compose up -d

# 2. Verificar el estado del contenedor
docker compose ps

# 3. Aplicar migraciones y schema de Prisma a la BD en Docker
npx prisma db push

# 4. (Opcional) Abrir Prisma Studio para ver los datos visualmente
npx prisma studio

# 5. Detener la base de datos
docker compose down

# 6. Detener la base de datos eliminando volúmenes (reiniciar datos desde cero)
docker compose down -v
