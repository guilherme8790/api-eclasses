require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    realtime: {
      transport: WebSocket
    }
  }
);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'Bem vindo à API GamerClass',
    status: 'sucesso',
    rotas: ['/api/jogos', '/api/times', '/api/competidores', '/api/confrontos'],
  });
});

// ===== JOGOS =====
app.get('/api/jogos', async (req, res) => {
  const { data, error } = await supabase.from('games').select('*').order('id');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data.map(g => ({ id: g.id, name: g.name, genre: g.genre })));
});

app.get('/api/jogos/:id', async (req, res) => {
  const { data, error } = await supabase.from('games').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ erro: 'Jogo não encontrado' });
  res.json({ id: data.id, name: data.name, genre: data.genre });
});

app.post('/api/jogos', async (req, res) => {
  const { name, genre } = req.body;
  if (!name || !genre) return res.status(400).json({ erro: 'name e genre são obrigatórios' });
  const { data, error } = await supabase.from('games').insert({ name, genre }).select().single();
  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json({ id: data.id, name: data.name, genre: data.genre });
});

app.put('/api/jogos/:id', async (req, res) => {
  const { name, genre } = req.body;
  const { data, error } = await supabase.from('games').update({ name, genre }).eq('id', req.params.id).select().single();
  if (error || !data) return res.status(404).json({ erro: 'Jogo não encontrado' });
  res.json({ id: data.id, name: data.name, genre: data.genre });
});

app.delete('/api/jogos/:id', async (req, res) => {
  const { error } = await supabase.from('games').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ erro: error.message });
  res.status(204).send();
});

// ===== TIMES =====
app.get('/api/times', async (req, res) => {
  const { data, error } = await supabase.from('teams').select('*').order('id');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data.map(t => ({ id: t.id, name: t.name, color: t.color })));
});

app.get('/api/times/:id', async (req, res) => {
  const { data, error } = await supabase.from('teams').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ erro: 'Time não encontrado' });
  res.json({ id: data.id, name: data.name, color: data.color });
});

app.post('/api/times', async (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ erro: 'name é obrigatório' });
  const { data, error } = await supabase.from('teams').insert({ name, color: color || '#6366f1' }).select().single();
  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json({ id: data.id, name: data.name, color: data.color });
});

app.put('/api/times/:id', async (req, res) => {
  const { name, color } = req.body;
  const { data, error } = await supabase.from('teams').update({ name, color }).eq('id', req.params.id).select().single();
  if (error || !data) return res.status(404).json({ erro: 'Time não encontrado' });
  res.json({ id: data.id, name: data.name, color: data.color });
});

app.delete('/api/times/:id', async (req, res) => {
  const { error } = await supabase.from('teams').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ erro: error.message });
  res.status(204).send();
});

// ===== COMPETIDORES =====
app.get('/api/competidores', async (req, res) => {
  const { data, error } = await supabase.from('competitors').select('*').order('id');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data.map(c => ({ id: c.id, name: c.name, nickname: c.nickname, teamId: c.team_id })));
});

app.get('/api/competidores/:id', async (req, res) => {
  const { data, error } = await supabase.from('competitors').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ erro: 'Competidor não encontrado' });
  res.json({ id: data.id, name: data.name, nickname: data.nickname, teamId: data.team_id });
});

app.post('/api/competidores', async (req, res) => {
  const { name, nickname, teamId } = req.body;
  if (!name || !nickname) return res.status(400).json({ erro: 'name e nickname são obrigatórios' });
  const { data, error } = await supabase.from('competitors').insert({ name, nickname, team_id: teamId || null }).select().single();
  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json({ id: data.id, name: data.name, nickname: data.nickname, teamId: data.team_id });
});

app.put('/api/competidores/:id', async (req, res) => {
  const { name, nickname, teamId } = req.body;
  const { data, error } = await supabase.from('competitors').update({ name, nickname, team_id: teamId }).eq('id', req.params.id).select().single();
  if (error || !data) return res.status(404).json({ erro: 'Competidor não encontrado' });
  res.json({ id: data.id, name: data.name, nickname: data.nickname, teamId: data.team_id });
});

app.delete('/api/competidores/:id', async (req, res) => {
  const { error } = await supabase.from('competitors').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ erro: error.message });
  res.status(204).send();
});

// ===== CONFRONTOS =====
app.get('/api/confrontos', async (req, res) => {
  const { data, error } = await supabase.from('matches').select('*').order('id');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data.map(m => ({
    id: m.id,
    gameId: m.game_id,
    team1Id: m.team1_id,
    team2Id: m.team2_id,
    score1: m.score1,
    score2: m.score2,
    status: m.status,
    date: m.date
  })));
});

app.get('/api/confrontos/:id', async (req, res) => {
  const { data, error } = await supabase.from('matches').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ erro: 'Confronto não encontrado' });
  res.json({
    id: data.id,
    gameId: data.game_id,
    team1Id: data.team1_id,
    team2Id: data.team2_id,
    score1: data.score1,
    score2: data.score2,
    status: data.status,
    date: data.date
  });
});

app.post('/api/confrontos', async (req, res) => {
  const { gameId, team1Id, team2Id, score1, score2, status, date } = req.body;
  if (!gameId || !team1Id || !team2Id) return res.status(400).json({ erro: 'gameId, team1Id e team2Id são obrigatórios' });
  const { data, error } = await supabase.from('matches').insert({
    game_id: gameId,
    team1_id: team1Id,
    team2_id: team2Id,
    score1: score1 ?? 0,
    score2: score2 ?? 0,
    status: status || 'scheduled',
    date: date || new Date().toISOString()
  }).select().single();
  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json({
    id: data.id,
    gameId: data.game_id,
    team1Id: data.team1_id,
    team2Id: data.team2_id,
    score1: data.score1,
    score2: data.score2,
    status: data.status,
    date: data.date
  });
});

app.put('/api/confrontos/:id', async (req, res) => {
  const { gameId, team1Id, team2Id, score1, score2, status, date } = req.body;
  const update = {};
  if (gameId !== undefined) update.game_id = gameId;
  if (team1Id !== undefined) update.team1_id = team1Id;
  if (team2Id !== undefined) update.team2_id = team2Id;
  if (score1 !== undefined) update.score1 = score1;
  if (score2 !== undefined) update.score2 = score2;
  if (status !== undefined) update.status = status;
  if (date !== undefined) update.date = date;
  const { data, error } = await supabase.from('matches').update(update).eq('id', req.params.id).select().single();
  if (error || !data) return res.status(404).json({ erro: 'Confronto não encontrado' });
  res.json({
    id: data.id,
    gameId: data.game_id,
    team1Id: data.team1_id,
    team2Id: data.team2_id,
    score1: data.score1,
    score2: data.score2,
    status: data.status,
    date: data.date
  });
});

app.delete('/api/confrontos/:id', async (req, res) => {
  const { error } = await supabase.from('matches').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ erro: error.message });
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
