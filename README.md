---

Observação importante: O repositório remoto foi criado com sucesso em:

`https://github.com/AlisonGabriel235/lista-produtos`

Eu tentei dar push do código automaticamente, mas o comando `git` não está disponível neste ambiente, então não consegui completar o push. Para enviar o código do seu computador local, execute os comandos abaixo no diretório do projeto.

```powershell
# (1) Inicializar git e commitar
git init
git add .
git commit -m "Initial commit"

# (2) Adicionar remote (URL sem token)
git remote add origin https://github.com/AlisonGabriel235/lista-produtos.git

# (3) Subir para o GitHub
git branch -M main
git push -u origin main
```

Se você preferir, pode inserir temporariamente o token no remote para subir sem inserir credenciais interativas (não recomendado para uso contínuo):

```powershell
git remote set-url origin https://<SEU_TOKEN>@github.com/AlisonGabriel235/lista-produtos.git
git push -u origin main
# depois remova o token da URL
git remote set-url origin https://github.com/AlisonGabriel235/lista-produtos.git
```

Depois de confirmar que o push foi realizado com sucesso, recomendo revogar o PAT que você gerou (Settings → Developer settings → Personal access tokens) para segurança.
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

Se quiser que eu: 
