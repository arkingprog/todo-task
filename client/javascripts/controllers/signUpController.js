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
