const express = require('express');
const app = express();

app.use(express.json());

// Permite o front-end (arquivo local) acessar a API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ==================== BANCO DE DADOS (arrays) ====================

let jogos = [
  { id: 1, nome: "CS2", genero: "FPS" },
  { id: 2, nome: "FIFA 25", genero: "Esporte" },
  { id: 3, nome: "Valorant", genero: "FPS" }
];

let times = [
  { id: 1, nome: "Ninjas da Noite", cor: "#6366f1" },
  { id: 2, nome: "Dragões de Fogo", cor: "#ef4444" }
];

let competidores = [
  { id: 1, nome: "Carlos Souza", apelido: "CarlosX", idTime: 1 },
  { id: 2, nome: "Ana Lima", apelido: "AnaFire", idTime: 2 }
];

let confrontos = [
  { id: 1, idJogo: 1, idTime1: 1, idTime2: 2, data: "2026-06-10T14:00", placar1: 0, placar2: 0, situacao: "agendado" }
];

const proximoId = (array) => array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;

// ==================== ROTAS: JOGOS ====================

app.get('/jogos', (req, res) => res.json(jogos));

app.post('/jogos', (req, res) => {
  const { nome, genero } = req.body;
  const novoJogo = { id: proximoId(jogos), nome, genero };
  jogos.push(novoJogo);
  res.status(201).json(novoJogo);
});

// ==================== ROTAS: TIMES ====================

app.get('/times', (req, res) => res.json(times));

app.post('/times', (req, res) => {
  const { nome, cor } = req.body;
  const novoTime = { id: proximoId(times), nome, cor };
  times.push(novoTime);
  res.status(201).json(novoTime);
});

// ==================== ROTAS: COMPETIDORES ====================

app.get('/competidores', (req, res) => res.json(competidores));

app.post('/competidores', (req, res) => {
  const { nome, apelido, idTime } = req.body;
  const novoCompetidor = { id: proximoId(competidores), nome, apelido, idTime: Number(idTime) };
  competidores.push(novoCompetidor);
  res.status(201).json(novoCompetidor);
});

// ==================== ROTAS: CONFRONTOS ====================

app.get('/confrontos', (req, res) => res.json(confrontos));

app.post('/confrontos', (req, res) => {
  const { idJogo, idTime1, idTime2, data, placar1, placar2, situacao } = req.body;
  const novoConfronto = {
    id: proximoId(confrontos),
    idJogo: Number(idJogo),
    idTime1: Number(idTime1),
    idTime2: Number(idTime2),
    data,
    placar1: Number(placar1) || 0,
    placar2: Number(placar2) || 0,
    situacao: situacao || 'agendado'
  };
  confrontos.push(novoConfronto);
  res.status(201).json(novoConfronto);
});

app.put('/confrontos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = confrontos.findIndex(c => c.id === id);
  const { placar1, placar2, situacao } = req.body;
  confrontos[index].placar1 = Number(placar1);
  confrontos[index].placar2 = Number(placar2);
  confrontos[index].situacao = situacao;
  res.json(confrontos[index]);
});

// ==================== ROTA RAIZ ====================

app.get('/', (req, res) => {
  res.send(`Bem-vindo à API E-Classes! Times: ${times.length} | Jogos: ${jogos.length} | Competidores: ${competidores.length} | Confrontos: ${confrontos.length}`);
});

// ==================== SERVIDOR ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor E-Classes rodando em http://localhost:${PORT}`);
});