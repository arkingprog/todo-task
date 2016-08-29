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
