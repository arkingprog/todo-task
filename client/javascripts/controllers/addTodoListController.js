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
