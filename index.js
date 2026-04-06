const express = require('express');
const app = express();

app.use(express.json());

// Array simulando o banco de dados
let users = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    idade: 28
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    idade: 34
  }
];

const getNextId = () => {
  return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
};

// ==================== ROTAS ====================

// GET raiz - Mensagem de boas-vindas
app.get('/', (req, res) => {
  res.send(`Bem vindo à API E-Clas! Existem ${users.length} usuários cadastrados.`);
});

// GET todos os usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// GET usuário por nome (busca parcial, case insensitive)
app.get('/users/:name', (req, res) => {
  const nomeBusca = req.params.name.toLowerCase();
  const usuariosEncontrados = users.filter(user => 
    user.name.toLowerCase().includes(nomeBusca)
  );

  if (usuariosEncontrados.length === 0) {
    return res.status(404).json({ mensagem: "Nenhum usuário encontrado com esse nome." });
  }

  res.json(usuariosEncontrados);
});

// POST criar usuário
app.post('/users', (req, res) => {
  const { name, email, idade } = req.body;

  if (!name || !email) {
    return res.status(400).json({ mensagem: "Nome e email são obrigatórios." });
  }

  const novoUsuario = {
    id: getNextId(),
    name,
    email,
    idade: idade || null
  };

  users.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

// PUT atualizar usuário por ID
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, idade } = req.body;

  const index = users.findIndex(user => user.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  if (name) users[index].name = name;
  if (email) users[index].email = email;
  if (idade !== undefined) users[index].idade = idade;

  res.json(users[index]);
});

// DELETE deletar usuário por ID
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(user => user.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  users.splice(index, 1);
  res.json({ mensagem: "Usuário deletado com sucesso!" });
});

// ==================== SERVIDOR ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor E-Clas rodando em http://localhost:${PORT}`);
});