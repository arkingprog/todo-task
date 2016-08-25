var express = require('express');
var router = express.Router();
var passport = require('passport');
var signupController = require('../controllers/signupController');
var models = require('../models');
var _ = require('lodash');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('rest api');
});

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/')
};
var destroySession = function (req, res, next) {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
};
router.post('/login', passport.authenticate('local', {
        successRedirect: '/api/todo_list',
        failureRedirect: '/api/login'
    })
);
router.get('/signup', signupController.show);
router.post('/signup', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    models.user.find({where: {email: req.email}}).then(function (user) {
        if (!user) {
            models.user.create({username, password, email})
        } else {
            res.send('user already exist');
        }

    })
});
router.get('/logout', destroySession);
// get all user's todo_list
router.get('/todo_list', isAuthenticated, function (req, res) {
    let user_id = req.user.dataValues.id;
    models.todo_list.findAll({where: {user_id}}).then(function (todo_lists) {
        res.send(todo_lists);
    });
});
router.post('/todo_list', isAuthenticated, function (req, res) {
    let title = req.body.title;
    let user_id = req.user.dataValues.id;
    models.todo_list.create({title, user_id}).then(function (todo_lists) {
        res.send(todo_lists)
    });
});
router.get('/todo_list/:id', isAuthenticated, function (req, res) {
    let user_id = req.user.dataValues.id;
    let id = req.params.id;
    models.todo_list.findAll({where: {user_id, id}}).then(function (todo_lists) {
        res.send(todo_lists)
    });
});
router.put('/todo_list/:id', isAuthenticated, function (req, res) {
    let title = req.body.title;
    let id = req.params.id;
    let todo_list = models.todo_list.find({where: {id}});
    todo_list.update({title}).then(function () {
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
        res.send(todo_items)
    });
});
router.post('/todo_list/:todo_list_id/todo_item', isAuthenticated, function (req, res) {
    let todo_list_id = req.params.todo_list_id;
    var newTodoItem = Object.assign({}, req.body, {todo_list_id});
    models.todo_item.create(newTodoItem).then(function (todo_item) {
        res.send(todo_item)
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
        res.send(todo_items)
    })
});
router.put('/todo_list/:todo_list_id/todo_item/:todo_item_id', isAuthenticated, function (req, res) {
    let todo_list_id = req.params.todo_list_id;
    let id = req.params.todo_item_id;
    var updateTodoItem = Object.assign({}, req.body);
    let todo_item = models.todo_item.find({where: {todo_list_id,id}});
    todo_item.update(updateTodoItem).then(function () {
        res.send({status: 'success'});
    }).catch(function () {
        res.send({status: 'error'});
    });
});
router.delete('/todo_list/:todo_list_id/todo_item/:todo_item_id', isAuthenticated, function (req, res) {
    let id = req.params.todo_item_id;
    let todo_list_id = req.params.todo_list_id;
    models.todo_item.destroy({where: {id,todo_list_id}}).then(function () {
        res.send({status: 'success'});
    });
});
module.exports = router;
