# Lista de Produtos

[![Deploy](https://img.shields.io/badge/deploy-render-green)](https://lista-produtos.onrender.com)
![Node.js](https://img.shields.io/badge/node-%3E=18.x-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-21.1%25-yellow)
![HTML](https://img.shields.io/badge/HTML-78.1%25-orange)

**🌐 Acesse o sistema online:** [https://lista-produtos.onrender.com](https://lista-produtos.onrender.com)

## 📋 Sobre o projeto

Aplicação web para gerenciamento de produtos, com autenticação de usuários (admin/funcionário), exportação de dados e interface moderna.

**🔑 Login padrão:**  
- Usuário: `admin`  
- Senha: `123`

---

## Funcionalidades
- Cadastro, edição e exclusão de produtos (nome, preço, quantidade, unidade)
- Exportação para CSV e PDF
- Autenticação de usuários (admin/funcionário)
- Interface responsiva e fácil de usar

## Como rodar localmente
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
3. Acesse em [http://localhost:3000](http://localhost:3000)

## Deploy
- Deploy automático via [Render](https://render.com/): push no GitHub já publica online.
- Também pode ser rodado via Docker (`Dockerfile` incluso) ou em VPS.

## Observações
- O banco de dados é SQLite local (`banco.db`). Em ambientes gratuitos, os dados podem ser apagados após reinicialização.
- Para produção, use Postgres ou outro banco persistente.

## Contribuição
Pull requests são bem-vindos! Abra uma issue para sugestões ou problemas.

## Autor
- AlisonGabriel235
- [alison.gabriel@uni9.edu.br](mailto:alison.gabriel@uni9.edu.br)

---

<p align="center">Feito com S2 e Node.js</p>
