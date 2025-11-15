const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('banco.db');

db.all('SELECT id, usuario, senha, tipo FROM usuarios', (err, rows) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('=== USUÁRIOS NO BANCO ===');
    rows.forEach(row => {
      console.log('ID:', row.id, '| Usuário:', row.usuario, '| Senha:', row.senha, '| Tipo:', row.tipo);
    });
  }
  db.close();
});
