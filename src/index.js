"use strict";
exports.__esModule = true;
var express = require('express');
var cors = require('cors');
var uuid_1 = require("uuid");
var app = express();
exports["default"] = app;
app.use(cors());
app.use(express.json());
app.get("/", function (req, res) {
    return res.json({
        message: "Servidor ta ON!"
    });
});
// APLICACAO ===========================================================================================
// cria lista de usuários em memória
var users = [];
// função para verificar se usuário existe
function checksExistsUserAccount(request, response, next) {
    // pega o username do request headers
    var username = request.headers.username;
    // faz a busca usando o username no array de usuários
    var user = users.find(function (user) { return user.username === username; });
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
app.post('/users', function (request, response) {
    // pega nome e username do bady
    var _a = request.body, name = _a.name, username = _a.username;
    // cria usuário para inserir
    var user = {
        id: (0, uuid_1.v4)(),
        name: name,
        username: username,
        todos: []
    };
    // verifica se já está cadastrado
    var userExists = users.some(function (user) { return user.username === username; });
    if (userExists) {
        return response.status(400).json({
            error: "Client already exists"
        });
    }
    // insere na lista
    users.push(user);
    // envia resposta
    response.status(201).json(user);
});
app.get('/todos', checksExistsUserAccount, function (request, response) {
    // pega username do headers
    var username = request.headers.username;
    // pega user da lista
    var user = users.find(function (user) { return username === user.username; });
    var list = user === null || user === void 0 ? void 0 : user.todos;
    // retorna a lista de to-dos do usuário 
    return response.status(201).json(list);
});
app.post('/todos', checksExistsUserAccount, function (request, response) {
    // pega title, deadline do body
    var _a = request.body, title = _a.title, deadline = _a.deadline;
    // pega username do headers
    var username = request.headers.username;
    // busca na lista pelo username
    var user = users.find(function (user) { return user.username === username; });
    // cria a to-do
    var todo = {
        id: (0, uuid_1.v4)(),
        title: title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    };
    user === null || user === void 0 ? void 0 : user.todos.push(todo);
    return response.status(201).json(todo);
});
app.put('/todos/:id', checksExistsUserAccount, function (request, response) {
    // pega title, deadline do body
    var _a = request.body, title = _a.title, deadline = _a.deadline;
    // pega username do headers
    var username = request.headers.username;
    // pega o id da tarefa
    var id = request.params.id;
    var user = users.find(function (user) { return user.username === username; });
    var todo = user === null || user === void 0 ? void 0 : user.todos.find(function (todo) { return todo.id === id; });
    if (todo) {
        todo.title = title;
        todo.deadline = deadline;
        return response.status(201).json(todo);
    }
    else {
        return response.status(404).json({
            error: "Todo does not exists"
        });
    }
});
app.patch('/todos/:id/done', checksExistsUserAccount, function (request, response) {
    // pega o username do headers
    var username = request.headers.username;
    // pega o id da tarefa
    var id = request.params.id;
    // pego o usuario e o todo
    var user = users.find(function (user) { return user.username === username; });
    var todo = user === null || user === void 0 ? void 0 : user.todos.find(function (todo) { return todo.id === id; });
    // se encontra o todo, altera done: true
    if (todo) {
        todo.done = true;
        return response.status(201).json(todo);
    }
    else {
        return response.status(404).json({
            error: "Todo does not exists"
        });
    }
});
app["delete"]('/todos/:id', checksExistsUserAccount, function (request, response) {
    // pega o username do headers
    var username = request.headers.username;
    // pega o id da tarefa
    var id = request.params.id;
    // pego o usuario e o todo
    var user = users.find(function (user) { return user.username === username; });
    var todo = user === null || user === void 0 ? void 0 : user.todos.find(function (todo) { return todo.id === id; });
    if (todo && user) {
        var todoIndex = user === null || user === void 0 ? void 0 : user.todos.indexOf(todo);
        user.todos.splice(todoIndex, 1);
        return response.status(204).send();
    }
    else {
        return response.status(404).json({
            error: "Todo does not exists"
        });
    }
});
module.exports = app;
