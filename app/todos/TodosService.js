const ValidationError = require('../errors/ValidationError');

module.exports = class TodosService {
    constructor(db) {
        this.db = db;
    }

    async listTodos() {
        const todos = await this.db.collection('todos')
            .find({})
            .toArray();

        return todos;
    }

    async createTodo(todo){
        if(!todo.title){
            throw new ValidationError({title: 'required'});
        }

        if(typeof todo.title !== 'string'){
            throw new ValidationError({title: 'must be a string'});
        }

        if(!todo.desc || typeof todo.desc !== 'string'){
            todo.desc = 'generic description (just a place holder)'
        }

        todo.title = todo.title.trim();

        const result = await this.db.collection('todos').insertOne({
            title: todo.title,
            desc: todo.desc,
            completed: false,
            createdAt: new Date()
        });

        return result.ops[0];
    }
};