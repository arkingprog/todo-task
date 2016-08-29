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
