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
