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
