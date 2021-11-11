const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const ToDo = require('../dataBase/models/ToDo.model.');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.post('/', asyncHandler(requireToken), asyncHandler(createToDo));
    router.get('/', asyncHandler(requireToken), asyncHandler(getToDos));
    router.get('/:id', asyncHandler(requireToken), asyncHandler(getToDoById));
    router.delete('/:id', asyncHandler(requireToken), asyncHandler(deleteToDoById));
    router.delete('/', asyncHandler(requireToken), asyncHandler(deleteToDos));
    router.patch('/:id', asyncHandler(requireToken), asyncHandler(updateToDoById));
}

async function createToDo(req, res) {
    const userId = req.userId
    const {title, description, isDone, isFavourite, priority} = req.body
    
    //Создание todo
    const todo = await ToDo.create({title, userId, description, isDone, isFavourite, priority})
    console.log(todo)
    
    res.status(200).json({message: "ok"});
}

async function getToDos(req, res) {
    const userId = req.userId
    
    //Получение всех todo пользователя
    const todos = await ToDo.findAll({where: {userId: userId}});

    res.status(200).json({ todos });
}

async function getToDoById(req, res) {
    const userId = req.userId
    const todo = await ToDo.findOne({ where: {
        id: req.params.id,
        userId: userId
    }})

    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }

    res.status(200).json({todo});
}

async function updateToDoById(req, res) {
    const userId = req.userId
    const {title, description, isDone, isFavourite, priority} = req.body

    const todo = await ToDo.findOne({ where: {
        id: req.params.id,
        userId: userId
    }})
    if (!todo) {
        throw new ErrorResponse('Todo not found', 404);
    }
    console.log('todo ' + todo)
    if(title) {
        await todo.update({title})
    }

    if(description) {
        todo.update({description})
    }

    if(isDone) {
        await todo.update({isDone})
    }

    if(isFavourite) {
        await todo.update({isFavourite})
    }

    if(priority) {
        await todo.update({priority})
    }
   
    res.status(200).json({message: "ok"});
}

async function deleteToDoById(req, res, next) {
    const userId = req.userId
    const todo = await ToDo.destroy({
        where: {
            id: req.params.id,
            userId: userId
        }
    })
    if(!todo) {
        throw new ErrorResponse('Todo not found', 404);
    }
    res.status(200).json({message: "ok"});
}

async function deleteToDos(req, res, next) {
    const userId = req.userId
    const todo = await ToDo.destroy({
        truncate: true,
        where: {
            userId: userId
        }
    })
    res.status(200).json({message: "ok"});
}

initRoutes();

module.exports = router;