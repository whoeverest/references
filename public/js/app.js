var app = angular.module('ReferencesApp', []);

app.service('posts', function($http) {

    this.create = function(text) {
        return $http.post('/posts', { text: text });
    }

    this.list = function() {
        return $http.get('/posts');
    }

})

app.controller('submitCtrl', function($rootScope, $scope, posts) {
    $scope.submit = function() {
        posts.create($scope.text).success(function(res) {
            $rootScope.$emit('post_submited.success', res.message);
        }).error(function(err) {
            $rootScope.$emit('post_submited.error', err.message);
        });
    }
})

app.controller('listCtrl', function($rootScope, $scope, posts) {
    $rootScope.$on('post_submited.success', function() {
        $scope.list();
    })

    $scope.list = function() {
        posts.list().success(function(posts) {
            $scope.posts = posts;
        })
    }

    $scope.list();
})

app.controller('notificationCtrl', function($rootScope, $scope) {
    // $rootScope.$on('post_submited.success', function(ev, text) {
    //     $scope.notificationType = 'success';
    //     $scope.notification = text;
    // })
    $rootScope.$on('post_submited.error', function(ev, err) {
        $scope.notificationType = 'error';
        $scope.notification = err;
    })
})
