const express = require('express');
const cors = require('cors');
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

const app = express();
export default app;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Servidor ta ON!"
  });
})
// SERVIDOR ========================================================


interface IUser {
  id: string;
  name: string;
  username: string;
  todos: ITodo[];
}

interface ITodo {
  id: string;
  title: string;
  done: boolean;
  deadline: Date;
  created_at: Date
}

// APLICACAO ===========================================================================================

// cria lista de usuários em memória
const users: IUser[] = [];

// função para verificar se usuário existe
function checksExistsUserAccount(request: Request, response: Response, next: NextFunction) {
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
  request.user = user;
  // empurra para frente o request
  return next();
}

app.post('/users', (request: Request, response: Response) => {
  // pega nome e username do bady
  const { name, username } = request.body;
  // cria usuário para inserir
  const user: IUser = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }
  // verifica se já está cadastrado
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return response.status(400).json({
      error: "Client already exists"
    });
  }
  // insere na lista
  users.push(user);
  // envia resposta
  response.status(200).json(user);
});

app.get('/todos', checksExistsUserAccount, (request: Request, response: Response) => {
  // pega username do headers
  const { username } = request.headers;
  // pega user da lista
  const user = users.find((user) => username === user.username);
  const list = user?.todos
  // retorna a lista de to-dos do usuário 
  return response.status(200).json(list);
});

app.post('/todos', checksExistsUserAccount, (request: Request, response: Response) => {
  // pega title, deadline do body
  const { title, deadline } = request.body;
  // pega username do headers
  const { username } = request.headers;
  // busca na lista pelo username
  const user = users.find(user => user.username === username);
  // cria a to-do
  const todo: ITodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user?.todos.push(todo);
  return response.status(200).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request: Request, response: Response) => {
  // pega title, deadline do body
  const { title, deadline } = request.body;
  // pega username do headers
  const { username } = request.headers;
  // pega o id da tarefa
  const { id } = request.params;
  const user = users.find(user => user.username === username);
  const todo = user?.todos.find(todo => todo.id === id);
  if (todo) {
    todo.title = title;
    todo.deadline = deadline;
    return response.status(201).send();
  } else {
    return response.status(400).json({
      error: "Todo does not exists"
    });
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request: Request, response: Response) => {
  // pega o username do headers
  const { username } = request.headers;
  // pega o id da tarefa
  const { id } = request.params;
  // pego o usuario e o todo
  const user = users.find(user => user.username === username);
  const todo = user?.todos.find(todo => todo.id === id);
  // se encontra o todo, altera done: true
  if (todo) {
    todo.done = true;
    return response.status(201).send();
  } else {
    return response.status(400).json({
      error: "Todo does not exists"
    });
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request: Request, response: Response) => {
  // pega o username do headers
  const { username } = request.headers;
  // pega o id da tarefa
  const { id } = request.params;
  // pego o usuario e o todo
  const user = users.find(user => user.username === username);
  const todo = user?.todos.find(todo => todo.id === id);
  if (todo && user) {
    const todoIndex = user?.todos.indexOf(todo);
    user.todos.splice(todoIndex, 1);
    return response.status(201).json({
      deleted: todo
    });
  } else {
    return response.status(400).json({
      error: "Todo does not exists"
    });
  }
  });

module.exports = app;