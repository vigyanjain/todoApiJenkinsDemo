const express = require('express');
const TodosService = require('./TodosService');

const router = express.Router();

router.get('/todos', (req, res, n) => {
    const {db} = req;
    const todoService = new TodosService(db);
    todoService.listTodos().then(todos => res.status(200).json({todos})).catch(n);
});

router.post('/todos', (req, res, n) => {
    const {db, body} = req;
    const todoService = new TodosService(db);
    todoService.createTodo(body).then(todo => res.status(200).json({todo})).catch(n);
});

module.exports = router;