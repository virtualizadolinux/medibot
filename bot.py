import discord
from discord.ext import commands, tasks
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import datetime
import os
import database

TOKEN = os.getenv("TOKEN")

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="/", intents=intents)

scheduler = AsyncIOScheduler()

@bot.event
async def on_ready():
    print(f"✅ MediBot está online como {bot.user}")
    scheduler.start()
    enviar_lembretes.start()

@bot.command(name="lembrar")
async def lembrar(ctx, hora: str, *, descricao: str):
    user_id = str(ctx.author.id)
    database.adicionar_tarefa(user_id, hora, descricao)
    await ctx.send(f"✅ Lembrete salvo: `{descricao}` às `{hora}`")

@bot.command(name="ver-tarefas")
async def ver_tarefas(ctx):
    user_id = str(ctx.author.id)
    tarefas = database.listar_tarefas(user_id)
    if not tarefas:
        await ctx.send("📭 Você não tem tarefas.")
        return
    for tarefa in tarefas:
        status = "✅" if tarefa[3] else "⏰"
        await ctx.send(f"{status} {tarefa[2]} às {tarefa[1]} (ID {tarefa[0]})")

@tasks.loop(minutes=1)
async def enviar_lembretes():
    agora = datetime.datetime.now().strftime("%H:%M")
    tarefas = database.tarefas_para_enviar(agora)
    for tarefa in tarefas:
        try:
            user = await bot.fetch_user(int(tarefa[1]))
            await user.send(f"🔔 Lembrete: {tarefa[2]} (ID {tarefa[0]})")
            database.marcar_como_feito(tarefa[0])
        except Exception as e:
            print(f"Erro ao enviar lembrete: {e}")

bot.run(TOKEN)
