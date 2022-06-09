const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// APLICACAO ===========================================================================================

// cria lista de usuários em memória
const users = [];


// função para verificar se usuário existe
function checksExistsUserAccount(request, response, next) {
  // pega o username do request headers
  const { username } = request.headers;
  // faz a busca usando o username no array de usuários
  const user = users.find(user => user.username === username);
  // se usuário não existe, retorna 404
  if (!user) {
    return response.status(404).json({
      error: 'User not found'
    });
  }
  // se existe, coloca ele no request
  response.user = user;
  // empurra para frente o request
  return next();
}

app.post('/users', checksExistsUserAccount,(request, response) => {
  // pega nome e username do bady
  const { name, username } = request.body;
  // cria usuário para inserir
  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }
  // insere na lista
  users.push(user);
  // envia resposta
  response.status(200).send();

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // pega username do headers
  const { username } = request.headers;
  // busca usuário na lista
  const user = users.find(user => user.username === username);
  // retorna a lista de to-dos do usuário 
  const list = user.todo;
  return response.status(200).json({list});
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // pega title, deadline do body
  const { title, deadline } = request.body;
  // pega username do headers
  const { username } = request.headers;
  // busca na lista pelo username
  const user = users.find(user => user.username === username);
  // cria a to-do
  const todo = {
    id: uuidv4(),
	  title,
	  done: false, 
	  deadline: new Date(deadline), 
	  created_at: new Date()
  }
  user.todos.push(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;