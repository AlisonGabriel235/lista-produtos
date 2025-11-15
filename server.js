const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(express.json());

// Redirecionar todas as requisições da raiz para a página de login
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------
// CONEXÃO COM O BANCO
// ------------------------------------------
const db = new sqlite3.Database("banco.db", (err) => {
    if (err) {
        console.error("❌ Erro ao conectar no banco:", err);
        return;
    }
    console.log("💾 Banco conectado!");
    // ------------------------------------------
    // USUÁRIOS - ALTERAR TIPO (ADMIN APENAS)
    // ------------------------------------------
});

// ------------------------------------------
// CRIAR TABELA USUÁRIOS SE NÃO EXISTIR
// ------------------------------------------
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        senha TEXT,
        tipo TEXT DEFAULT 'func'
    )
`);

// Criar tabela produtos caso não exista (com campo quantidade para unidades)
db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        preco REAL,
        quantidade INTEGER DEFAULT 0
    )
`);

// Garantir que a coluna 'unidade' exista (adiciona se estiver faltando)
db.all("PRAGMA table_info(produtos)", (err, cols) => {
    if (err) return;
    const hasUnidade = cols && cols.some(c => c.name === 'unidade');
    if (!hasUnidade) {
        db.run("ALTER TABLE produtos ADD COLUMN unidade TEXT DEFAULT ''", (err2) => {
            if (err2) console.error('Erro ao adicionar coluna unidade:', err2.message);
            else console.log("Campo 'unidade' adicionado à tabela produtos (default '')");
        });
    }
});

// Criar usuário admin caso nenhum exista
db.get("SELECT * FROM usuarios WHERE usuario = 'admin'", (err, row) => {
    if (!row) {
        db.run("INSERT INTO usuarios (usuario, senha, tipo) VALUES ('admin', '123', 'admin')");
        console.log("👤 Usuário padrão criado: admin / 123");
    }
});

// ------------------------------------------
// LOGIN
// ------------------------------------------
app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?",
        [usuario, senha],
        (err, user) => {
            if (user) {
                res.json({
                    ok: true,
                    tipo: user.tipo  // ★ AGORA ENVIA O TIPO DO USUÁRIO ★
                });
            } else {
                res.json({ ok: false, erro: "Usuário ou senha incorretos" });
            }
        }
    );
});

// ------------------------------------------
// PRODUTOS - LISTAR
// ------------------------------------------
app.get("/produtos", (req, res) => {
    db.all("SELECT * FROM produtos ORDER BY nome ASC", (err, rows) => {
        res.json(rows);
    });
});

// ------------------------------------------
// PRODUTOS - ADICIONAR
// ------------------------------------------
app.post("/produtos", (req, res) => {
    const { nome, preco, quantidade } = req.body;

    db.run(
        "INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)",
        [nome, preco, quantidade],
        function () {
            res.json({ ok: true, id: this.lastID });
        }
    );
});

// ------------------------------------------
// PRODUTOS - EDITAR
// ------------------------------------------
app.put("/produtos/:id", (req, res) => {
    const { id } = req.params;
    const { nome, preco, quantidade } = req.body;

    db.run(
        "UPDATE produtos SET nome = ?, preco = ?, quantidade = ? WHERE id = ?",
        [nome, preco, quantidade, id],
        () => res.json({ ok: true })
    );
});

// ------------------------------------------
// PRODUTOS - EXCLUIR INDIVIDUAL
// ------------------------------------------
app.delete("/produtos/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM produtos WHERE id = ?", [id], () => {
        res.json({ ok: true });
    });
});

// ------------------------------------------
// PRODUTOS - EXCLUIR TODOS
// ------------------------------------------
app.delete("/produtos", (req, res) => {
    db.run("DELETE FROM produtos", () => {
        res.json({ ok: true });
    });
});

// ------------------------------------------
// ENDPOINT PARA ADMIN LISTAR USUÁRIOS
// ------------------------------------------
app.get("/usuarios", (req, res) => {
    const tipo = req.headers["x-tipo"];

    if (tipo !== "admin") {
        return res.json({ erro: "Usuário não autenticado" });
    }

    db.all("SELECT id, usuario, tipo FROM usuarios ORDER BY usuario ASC", (err, rows) => {
        res.json(rows);
    });
});

// ------------------------------------------
// USUÁRIOS - ADICIONAR (ADMIN APENAS)
// ------------------------------------------
app.post('/usuarios', (req, res) => {
    const tipoReq = req.headers['x-tipo'];
    if (tipoReq !== 'admin') return res.status(403).json({ erro: 'Acesso negado' });

    const { usuario, senha, tipo } = req.body;
    if (!usuario || !senha) return res.status(400).json({ erro: 'usuario e senha são obrigatórios' });

    db.run("INSERT INTO usuarios (usuario, senha, tipo) VALUES (?, ?, ?)", [usuario, senha, tipo || 'func'], function(err) {
        if (err) return res.status(500).json({ erro: 'Erro ao criar usuário' });
        res.json({ ok: true, id: this.lastID });
    });
});

// ------------------------------------------
// USUÁRIOS - EDITAR (ADMIN APENAS)
// ------------------------------------------
app.put('/usuarios/:id', (req, res) => {
    const tipoReq = req.headers['x-tipo'];
    if (tipoReq !== 'admin') return res.status(403).json({ erro: 'Acesso negado' });

    const { id } = req.params;
    const { usuario, senha, tipo } = req.body || {};

    // Montar update dinâmico: atualiza apenas os campos enviados
    const updates = [];
    const params = [];
    if (usuario !== undefined) { updates.push('usuario = ?'); params.push(usuario); }
    if (senha !== undefined && senha !== '') { updates.push('senha = ?'); params.push(senha); }
    if (tipo !== undefined) { updates.push('tipo = ?'); params.push(tipo); }

    if (updates.length === 0) {
        return res.json({ ok: true, message: 'Nada para atualizar' });
    }

    const sql = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
        res.json({ ok: true, changes: this.changes });
    });
});

// ------------------------------------------
// USUÁRIOS - EXCLUIR (ADMIN APENAS)
// ------------------------------------------
app.delete('/usuarios/:id', (req, res) => {
    const tipoReq = req.headers['x-tipo'];
    if (tipoReq !== 'admin') return res.status(403).json({ erro: 'Acesso negado' });

    const { id } = req.params;
    db.run("DELETE FROM usuarios WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ erro: 'Erro ao excluir usuário' });
        res.json({ ok: true, changes: this.changes });
    });
});

// ------------------------------------------
// INICIAR SERVIDOR
// ------------------------------------------
// ------------------------------------------
// EXPORTAÇÕES (CSV / PDF simples sem dependências)
// ------------------------------------------
function escapeCsvCell(value) {
    if (value === null || value === undefined) return '';
    const s = String(value);
    if (s.includes(',') || s.includes('\n') || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

app.get('/produtos/export.csv', (req, res) => {
    db.all('SELECT * FROM produtos ORDER BY nome ASC', (err, rows) => {
        if (err) return res.status(500).json({ erro: 'Erro ao gerar CSV' });

        const headers = ['id', 'nome', 'preco', 'quantidade'];
        const lines = [headers.join(',')];
        rows.forEach(r => {
            lines.push([
                escapeCsvCell(r.id),
                escapeCsvCell(r.nome),
                escapeCsvCell(r.preco),
                escapeCsvCell(r.quantidade)
            ].join(','));
        });

        const csv = lines.join('\n');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="produtos.csv"');
        res.send(csv);
    });
});

// Gera um PDF muito simples (texto puro) sem depender de bibliotecas externas.
function buildSimplePdfBuffer(lines) {
    // Monta um PDF básico com fontes Type1 (Helvetica)
    const objs = [];

    // Helper para escapar parênteses
    const esc = s => String(s).replace(/([\\()])/g, '\\$1');

    // Conteúdo (fluxo)
    let contentText = 'BT /F1 12 Tf 50 750 Td\n';
    lines.forEach((ln, idx) => {
        const safe = esc(ln);
        contentText += '(' + safe + ') Tj 0 -14 Td\n';
    });
    contentText += 'ET\n';

    // Objetos do PDF
    objs.push('1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n');
    objs.push('2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n');
    objs.push('3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources<< /Font<< /F1 4 0 R >> >> /Contents 5 0 R >>endobj\n');
    objs.push('4 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n');

    const contentStream = Buffer.from(contentText, 'utf8');
    objs.push('5 0 obj<< /Length ' + contentStream.length + ' >>stream\n');
    objs.push(contentStream);
    objs.push('\nendstream\nendobj\n');

    // Monta arquivo e xref
    const header = Buffer.from('%PDF-1.1\n%âãÏÓ\n', 'utf8');
    const bodyParts = [];
    let offset = header.length;
    const offsets = [];

    objs.forEach(o => {
        offsets.push(offset);
        if (Buffer.isBuffer(o)) {
            bodyParts.push(o);
            offset += o.length;
        } else {
            const b = Buffer.from(o, 'utf8');
            bodyParts.push(b);
            offset += b.length;
        }
    });

    const body = Buffer.concat(bodyParts);

    // Monta xref
    let xref = 'xref\n0 ' + (offsets.length + 1) + '\n0000000000 65535 f \n';
    offsets.forEach(off => {
        xref += String(off).padStart(10, '0') + ' 00000 n \n';
    });

    const trailer = 'trailer<< /Size ' + (offsets.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + (header.length + body.length) + '\n%%EOF\n';

    return Buffer.concat([header, body, Buffer.from(xref + trailer, 'utf8')]);
}

app.get('/produtos/export.pdf', (req, res) => {
    db.all('SELECT * FROM produtos ORDER BY nome ASC', (err, rows) => {
        if (err) return res.status(500).json({ erro: 'Erro ao gerar PDF' });

        const lines = ['Lista de Produtos', ''];
        rows.forEach(r => {
            lines.push(`${r.id} - ${r.nome} - R$ ${r.preco != null ? Number(r.preco).toFixed(2) : ''} - Qtd: ${r.quantidade}`);
        });

        const pdfBuf = buildSimplePdfBuffer(lines);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="produtos.pdf"');
        res.send(pdfBuf);
    });
});

app.listen(3000, () => {
    console.log("🚀 Servidor rodando em http://localhost:3000");
});
