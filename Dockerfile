FROM node:20-alpine as builder

WORKDIR /app

# Aceptar argumento de build
ARG BUILD_MODE=development
ENV BUILD_MODE=$BUILD_MODE

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Buscar y eliminar archivos Vue vacíos
RUN echo "🔍 Buscando archivos Vue vacíos..." && \
    find src -name "*.vue" -size -10c -exec rm -v {} \; && \
    find src -name "*.vue" -exec sh -c 'test "$(cat {} | wc -l)" -lt 3 && rm -v {}' \; && \
    echo "✅ Archivos vacíos eliminados"

# Verificar archivos restantes
RUN echo "📝 Verificando archivos Vue restantes..." && \
    find src -name "*.vue" -exec echo "✓ {}" \;

# Modificar script de build con el modo especificado
RUN echo "📦 Configurando build en modo: $BUILD_MODE" && \
    npm pkg set scripts.build="vite build --mode $BUILD_MODE"

# Verificar que exista el archivo de entorno del modo seleccionado
RUN test -f ".env.$BUILD_MODE" && \
    echo "🔧 Usando configuración desde .env.$BUILD_MODE" || \
    (echo "❌ No existe .env.$BUILD_MODE" && exit 1)

# Construir
RUN npm run build

# Verificar build exitoso
RUN test -d dist && echo "✅ Build completado exitosamente" || (echo "❌ Build falló - dist no encontrado" && exit 1)

# Usar serve para servir la app
FROM node:20-alpine
RUN npm install -g serve

# Copiar los archivos construidos
COPY --from=builder /app/dist /app/dist

WORKDIR /app

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]