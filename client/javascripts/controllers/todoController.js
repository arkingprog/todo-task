todoApp.controller('todoController', function ($http, $scope, $rootScope, $state, $uibModal, todoService) {
    if (!$rootScope.isAuth) {
        $state.go('login', {}, {reload: true});
        return;
    }
    this.todo_lists = [];
    var self = this;
    this.addNewTodoList = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/addTodoList.html',
            controller: 'addTodoListController',
            controllerAs: 'addTodoListController',
            resolve: {
                todo_lists: function () {
                    return self.todo_lists;
                }
            }
        });
    }
    this.editTodoList = function (todo_list) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/editTodoList.html',
            controller: 'editTodoListController',
            controllerAs: 'editTodoListController',
            resolve: {
                todo_list: function () {
                    return todo_list;
                }
            }
        });

    }
    this.removeTodoList = function (todo_list) {
        todoService.deleteTodoList(todo_list.id).then(function () {
            _.remove(self.todo_lists, todo_list);
        })
    }
    todoService.getTodoListAll().then(function (data) {
        console.log(data)
        data.data.forEach(function (todo_list, index) {
            self.todo_lists.push(todo_list);
            todoService.getTodoItemAll(todo_list.id).then(function (data) {
                _.forEach(data.data, function (item) {
                    if (!item.deadline) {
                        item.deadline_text = 'No deadline';
                        item.isDeadlineExpired = false;
                    }
                    else {
                        item.deadline_text = moment().to(item.deadline);
                        item.isDeadlineExpired = !moment(item.deadline).isAfter(moment());
                    }
                })
                self.todo_lists[index].todo_items = data.data;
                self.sortTodoList(self.todo_lists[index].id);
            });
        });
    });
    this.editTodoItem = function (todo_item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/editTodoItem.html',
            controller: 'editTodoItemController',
            controllerAs: 'editTodoItemController',
            resolve: {
                todo_item: function () {
                    return todo_item;
                }
            }
        });

    }
    this.sortTodoList = function (id) {
        _.orderBy(self.todo_lists, ['created_at'])
        var currentTodoList = _.find(self.todo_lists, {id: id});
        currentTodoList.todo_items = _.orderBy(currentTodoList.todo_items, ['priority', 'created_at'], ['desc', 'desc']);
    };
    this.setPriorityTask = function (id, todo_item) {
        todoService.changeTodoItem(id, todo_item.id, {priority: (todo_item.priority == '0') ? "1" : "0"}).then(function (data) {
            todo_item.priority = (todo_item.priority == '0') ? "1" : "0";
            self.sortTodoList(id);
        })
    };
    this.setComplitedTask = function (id, todo_item) {
        // console.log(todo_item.compiled_at);
        todoService.changeTodoItem(id, todo_item.id, {compiled_at: todo_item.compiled_at}).then(function (data) {
            todo_item.compiled_at = todo_item.compiled_at;

            self.sortTodoList(id);

        })
    };
    this.deleteTask = function (id, todo_item) {
        todoService.deleteTodoItem(id, todo_item.id).then(function (data) {
            _.remove(_.find(self.todo_lists, {id: id}).todo_items, todo_item);
        });
    };
    this.addTask = function (id) {
        todoService.postTodoItem(id, {
            content: self.todoItem[id],
            priority: '0',
            compiled_at: false
        }).then(function (data) {
            self.todoItem[id] = '';
            var tmp = _.find(self.todo_lists, {id: id});
            if (!tmp.todo_items) tmp.todo_items = [];
            tmp.todo_items.push(data.data);
            self.sortTodoList(id);

        })
    }
});
