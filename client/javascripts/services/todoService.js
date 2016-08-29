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