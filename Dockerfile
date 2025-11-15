# Imagem leve para rodar app Node.js
FROM node:20-alpine

# Criar diretório de trabalho
WORKDIR /app

# Copiar apenas package.json e package-lock (se existir) para instalar dependências
COPY package*.json ./

# Instalar dependências (productions)
RUN npm ci --only=production || npm install --production

# Copiar o resto do código
COPY . .

# Expor porta usada pelo app
EXPOSE 3000

# Comando padrão
CMD ["node", "server.js"]
