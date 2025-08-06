import sqlite3

conn = sqlite3.connect("tarefas.db")
c = conn.cursor()

c.execute("""CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    hora TEXT,
    descricao TEXT,
    feito INTEGER DEFAULT 0
)""")

conn.commit()

def adicionar_tarefa(user_id, hora, descricao):
    c.execute("INSERT INTO tarefas (user_id, hora, descricao) VALUES (?, ?, ?)", (user_id, hora, descricao))
    conn.commit()

def listar_tarefas(user_id):
    c.execute("SELECT id, hora, descricao, feito FROM tarefas WHERE user_id = ?", (user_id,))
    return c.fetchall()

def marcar_como_feito(tarefa_id):
    c.execute("UPDATE tarefas SET feito = 1 WHERE id = ?", (tarefa_id,))
    conn.commit()

def tarefas_para_enviar(hora_atual):
    c.execute("SELECT id, user_id, descricao FROM tarefas WHERE hora = ? AND feito = 0", (hora_atual,))
    return c.fetchall()
