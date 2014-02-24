var app = angular.module('ReferencesApp', []);

app.factory('posts', function($http) {

    var self = {
        list: [],
    };

    self.create = function(text) {
        return $http.post('/posts', { text: text }).success(function(res) {
            self.list.push({ text: text });
        });
    }

    self.fetch = function() {
        return $http.get('/posts').success(function(posts) {
            return self.list = posts;
        });
    }

    return self;
})

app.factory('notification', function() {
    return {
        active: false,
        type: null,
        message: '' ,
        set: function(type, message) {
            this.active = true;
            this.message = message;
            this.type = type;
        },
        clear: function() {
            this.active = false;
        }
    };
});

app.controller('submitCtrl', function($scope, posts, notification) {
    $scope.submit = function() {
        posts.create($scope.text).success(function(res) {
            notification.set('success', res.message);
        }).error(function(err) {
            notification.set('error', err.message);
        });
    }
})

app.controller('listCtrl', function($scope, posts) {
    $scope.posts = posts;
    posts.fetch();
})

app.controller('notificationCtrl', function($scope, notification) {
    $scope.notification = notification;
})
