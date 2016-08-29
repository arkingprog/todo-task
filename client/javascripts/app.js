var todoApp = angular.module('todoApp', ['ui.router', 'ui.bootstrap', 'moment-picker']);
todoApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'loginController as vm'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: 'signUpController as signUpController'
        })
        .state('todo', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'todoController as todoController'
        })

});
todoApp.controller('signUpController', function ($scope, $http, $location, $rootScope, $state) {
    this.signUp = function () {
        var email = $scope.signupForm.email.$modelValue;
        var password = $scope.signupForm.password.$modelValue;
        var username = $scope.signupForm.username.$modelValue;
        $http.post('/api/signup', {email: email, password: password,username:username})
            .then(function (data) {
                if (data.data.status == 'success') {
                    $state.go('login',{},{reload:true});
                }
            });
    }
});
todoApp.controller('headerController', function ($scope, $http, $location, $rootScope, $state) {
    $rootScope.current_user = '';
    $rootScope.isAuth = '';
    $http.get('/api/success').then(function (data) {
        if (data.data.user) {
            $rootScope.current_user = data.data.user.username;
            $rootScope.isAuth = true;
            $state.go('todo', {}, {reload: true});
        }
        else {
            $state.go('login');
        }
    });
    this.logout = function () {
        $http.get('/api/logout')
            .then(function (data) {
                $rootScope.isAuth = false;
                $rootScope.current_user = '';
                $state.go('login', {}, {reload: true})
            });
    };
});


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

todoApp.controller('addTodoListController', function ($scope, $uibModalInstance, todoService, todo_lists) {
    this.sendTodoList = function () {
        if (this.titleTodoList != undefined)
            todoService.postTodoList({title: this.titleTodoList}).then(function (data) {
                data.data.todo_items = [];
                todo_lists.push(data.data);
                $uibModalInstance.close();
            });

    };
});

todoApp.controller('editTodoListController', function ($scope, $uibModalInstance, $http, todoService, todo_list) {
    this.todo_list = todo_list;
    this.editTodoList = function () {
        if (this.todo_list.title != undefined) {
            todoService.changeTodoList(todo_list.id, {title: todo_list.title}).then(function () {
                $uibModalInstance.close();
            })
        }
    };
});
todoApp.controller('editTodoItemController', function ($scope, $uibModalInstance, $http, todoService, todo_item) {
    this.todo_item = todo_item;
    this.change = function (newDate, oldDate) {
    }
    this.editTodoItem = function () {

    };
    this.ok = function () {
        todoService.changeTodoItem(todo_item.todo_list_id, todo_item.id, todo_item).then(function () {
            $uibModalInstance.close();
        })
    }
    this.cancel=function () {
        $uibModalInstance.dismiss('cancel');
    }
});

todoApp.controller('loginController', function ($scope, $http, $location, $rootScope, $state) {
    this.submitLogin = function () {
        var email = $scope.loginForm.email.$modelValue;
        var password = $scope.loginForm.password.$modelValue;
        $http.post('/api/login', {email: email, password: password})
            .then(function (data) {
                if (data.data.status == 'success') {
                    $rootScope.isAuth = true;
                    $rootScope.current_user = data.data.user.username;
                    $state.go('todo')
                }
            });
    }
});
todoApp.service('todoService', function ($http) {
    this.getTodoListAll = function () {
        return $http.get('/api/todo_list').then(function (data) {
            return data.data;
        });
    };
    this.getTodoListById = function (id) {
        return $http.get('/api/todo_list/' + id).then(function (data) {
            return data.data;
        });
    };
    this.postTodoList = function (data) {
        return $http.post('/api/todo_list', data).then(function (data) {
            return data.data;
        });
    };
    this.changeTodoList = function (id, data) {
        return $http.put('/api/todo_list/' + id, data).then(function (data) {
            return data.data;
        });
    };
    this.deleteTodoList = function (id) {
        return $http.delete('/api/todo_list/' + id).then(function (data) {
            return data.data;
        });
    };
    //////////////////////////////////////////////
    // todo_item
    /////////////////////////////////////////////
    this.getTodoItemAll = function (todo_list_id) {
        return $http.get('/api/todo_list/' + todo_list_id + '/todo_item').then(function (data) {
            return data.data;
        });
    };
    this.getTodoItemById = function (todo_list_id, todo_item_id) {
        return $http.get('/api/todo_list/' + todo_list_id + '/todo_item/' + todo_item_id).then(function (data) {
            return data.data;
        });
    };
    this.postTodoItem = function (todo_list_id, data) {
        return $http.post('/api/todo_list/' + todo_list_id + '/todo_item', Object.assign(data, {todo_list_id: todo_list_id})).then(function (data) {
            return data.data;
        });
    };
    this.changeTodoItem = function (todo_list_id, todo_item_id, data) {
        return $http.put('/api/todo_list/' + todo_list_id + '/todo_item/' + todo_item_id, data).then(function (data) {
            return data.data;
        });
    };
    this.deleteTodoItem = function (todo_list_id, todo_item_id) {
        return $http.delete('/api/todo_list/' + todo_list_id + '/todo_item/' + todo_item_id).then(function (data) {
            return data.data;
        });
    };
});