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
