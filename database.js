const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./lembretes.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS lembretes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hora TEXT NOT NULL,
        texto TEXT NOT NULL
    )`);
});

module.exports = {
    adicionarLembrete(hora, texto) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO lembretes (hora, texto) VALUES (?, ?)`, [hora, texto], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    getTodosLembretes() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM lembretes ORDER BY hora ASC`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getLembretesPorHora(hora) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM lembretes WHERE hora = ?`, [hora], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    removerLembrete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM lembretes WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};
