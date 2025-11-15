# Lista de Produtos

Aplicação simples de gerenciamento de produtos (frontend estático + servidor Node/Express + SQLite local).

Funcionalidades principais:
- CRUD de produtos (nome, preço, quantidade, unidade)
- Autenticação simples de usuário (admin/func)
- Exportação CSV/PDF

Como rodar localmente

1. Instale dependências:

```powershell
npm install
```

2. Inicie o servidor:

```powershell
npm start
# ou
node server.js
```

3. Abra no navegador:

http://localhost:3000

Notas importantes
- O projeto usa SQLite (`banco.db`) como armazenamento local. Em ambientes de produção prefira um banco remoto (Postgres) ou um volume persistente.
- Não comite arquivos sensíveis (já existe `.gitignore` que exclui `node_modules` e `banco.db`).

Deploy
- Há um `Dockerfile` e `Procfile` no repositório. Para deploy rápido, pode usar serviços como Render ou Railway; para produção com persistência, use um VPS ou configure um volume persistente.

Contato
- Autor: AlisonGabriel235

Se quiser, eu atualizo este README com instruções específicas de deploy (Render / DigitalOcean) ou adiciono um arquivo `deploy.md` com passos automáticos. Basta pedir.
# Lista de Produtos — Deploy

Este repositório contém um pequeno app Node.js + Express que usa SQLite para persistência (arquivo `banco.db`). Abaixo as instruções para subir o projeto na internet.

## Preparação local

1. Instale dependências:

```powershell
# no Windows PowerShell (ou use cmd se ocorrer bloqueio de execução)
npm install
```

2. Inicie localmente:

```powershell
node server.js
# ou
npm start
```

O app escuta em `http://localhost:3000`.

---

## Deploy rápido (Render ou Railway)

Recomendado para testes rápidos. Atenção: plataformas serverless costumam ter armazenamento efêmero — `banco.db` pode não persistir entre deploys/instâncias.

Passos genéricos:

1. Suba o projeto em um repositório GitHub.
2. No Render: `New -> Web Service` → conecte GitHub → escolha o repositório.
3. Configure `Build Command` (ou deixe vazio) e `Start Command` como:

```
node server.js
```

4. Crie o serviço — Render fará build e fornecerá uma URL pública.

## Deploy com persistência (VPS)

Se precisa que `banco.db` seja persistente, use um VPS (DigitalOcean, Hetzner, etc.) e siga:

```bash
# no servidor (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update
sudo apt install -y nodejs git build-essential

# clonar e instalar
git clone https://github.com/SEU_USUARIO/SEU_REPO.git
cd SEU_REPO
npm install

# usar PM2 para manter app rodando
sudo npm install -g pm2
pm2 start server.js --name lista-produtos
pm2 startup
pm2 save
```

Configure Nginx como proxy reverso e certbot para SSL (opcional).

---

## Docker

Este repositório inclui um `Dockerfile`. Você pode construir e rodar uma imagem:

```bash
# construir
docker build -t lista-produtos:latest .
# rodar
docker run -p 3000:3000 lista-produtos:latest
```

---

## GitHub / criar repo automaticamente

Posso preparar tudo (adicionar `start`, `Procfile`, `Dockerfile`) — já adicionei esses arquivos. Se quiser, posso também criar um repositório no GitHub e enviar o código para você, mas para isso precisarei que você me forneça um token de acesso pessoal (PAT) com permissões `repo` ou me autorize de outra forma. Se preferir, eu te passo os comandos `git` para executar localmente.

---

 

