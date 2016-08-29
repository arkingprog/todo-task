var express = require('express');
var router = express.Router();
var passport = require('passport');
var signupController = require('../controllers/signupController');
var models = require('../models');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('rest api');
});

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.send({status: 'failure'});
};
var destroySession = function (req, res, next) {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
};
router.get('/success', function (req, res) {
    var user = req.user ? req.user : null;
    if (user) user.password = '';
    res.send({status: 'success', user: user});
});
router.get('/failure', function (req, res) {
    res.send({state: 'failure', user: null, message: "Invalid username or password"});
});
router.post('/login', passport.authenticate('local', {
        successRedirect: '/api/success',
        failureRedirect: '/api/failure'
    })
);
router.get('/signup', signupController.show);
router.post('/signup', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    models.user.find({where: {email}}).then(function (user) {
        if (!user) {
            models.user.create({username, password, email}).then(function () {
                res.send({status:'success'});
            })
        } else {
            res.redirect('/api/failure');
        }

    })
});
router.get('/logout', destroySession);
// get all user's todo_list
router.get('/todo_list', isAuthenticated, function (req, res) {
    let user_id = req.user.dataValues.id;
    models.todo_list.findAll({where: {user_id}}).then(function (todo_lists) {
        todo_lists.todo_items=[]
        let result = Object.assign({}, {data: todo_lists}, {count: todo_lists.length});
        res.send(result);
    });
});
router.post('/todo_list', isAuthenticated, function (req, res) {
    let title = req.body.title;
    let user_id = req.user.dataValues.id;
    models.todo_list.create({title, user_id}).then(function (todo_lists) {
        let result = Object.assign({}, {data: todo_lists}, {count: todo_lists.length});
        res.send(result);
    });
});
router.get('/todo_list/:id', isAuthenticated, function (req, res) {
    let user_id = req.user.dataValues.id;
    let id = req.params.id;
    models.todo_list.findAll({where: {user_id, id}}).then(function (todo_lists) {
        let result = Object.assign({}, {data: todo_lists}, {count: todo_lists.length});
        res.send(result);
    });
});
router.put('/todo_list/:id', isAuthenticated, function (req, res) {
    //   res.send({test:'test'});
    let title = req.body.title;
    let id = req.params.id;
    models.todo_list.update({title}, {where: {id}})
        .then(function () {
            res.send({status: 'success'});
        }).catch(function () {
        res.send({status: 'error'});
    });
});
router.delete('/todo_list/:id', isAuthenticated, function (req, res) {
    let id = req.params.id;
    models.todo_list.destroy({where: {id}}).then(function () {
        res.send({status: 'success'});
    });
});
///////////////////
// todo_item
//////////////////
router.get('/todo_list/:id/todo_item', isAuthenticated, function (req, res) {
    let todo_list_id = req.params.id;
    models.todo_item.findAll({where: {todo_list_id}}).then(function (todo_items) {
        let result = Object.assign({}, {data: todo_items}, {count: todo_items.length});

        res.send(result);
    });
});
router.post('/todo_list/:todo_list_id/todo_item', isAuthenticated, function (req, res) {
    let todo_list_id = req.params.todo_list_id;
    var newTodoItem = Object.assign({}, req.body, {todo_list_id});
    models.todo_item.create(newTodoItem).then(function (todo_items) {
        let result = Object.assign({}, {data: todo_items}, {count: todo_items.length});
        res.send(result);
    });
});
router.get('/todo_list/:todo_list_id/todo_item/:todo_item_id', isAuthenticated, function (req, res) {
    let todo_list_id = req.params.todo_list_id;
    let id = req.params.todo_item_id;
    models.todo_item.findAll({where: {todo_list_id, id}}).then(function (todo_items) {
        if (todo_items.length == 0) {
            res.send({status: 'error'});
            return;
        }
        let result = Object.assign({}, {data: todo_items}, {count: todo_items.length});
        res.send(result);
    })
});
router.put('/todo_list/:todo_list_id/todo_item/:todo_item_id', isAuthenticated, function (req, res) {
    let todo_list_id = req.params.todo_list_id;
    let id = req.params.todo_item_id;
    var updateTodoItem = Object.assign({}, req.body);
    console.log(updateTodoItem,todo_list_id,id);
    models.todo_item.update(updateTodoItem, {where: {todo_list_id, id}})
        .then(function () {
            res.send({status: 'success'});
        }).catch(function (err) {
        res.send({status: 'error',err:err});
    });
});
router.delete('/todo_list/:todo_list_id/todo_item/:todo_item_id', isAuthenticated, function (req, res) {
    let id = req.params.todo_item_id;
    let todo_list_id = req.params.todo_list_id;
    models.todo_item.destroy({where: {id, todo_list_id}}).then(function () {
        res.send({status: 'success'});
    });
});
module.exports = router;
