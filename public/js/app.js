var app = angular.module('ReferencesApp', []);


app.factory("$Http", function($http, $q) {

    function CodedError(code, msg) {
        if (!msg) { code = 500; msg = code; }
        var e = new Error(msg);
        e.code = code;
        return e;
    }

    var self = {};
    
    ['get', 'post', 'put', 'delete'].forEach(function(name) {
        self[name] = function() {        
            var res = $http[name].apply($http, arguments);
            return res.then(function(res) {
                if (res.status !== 200)  
                    return $q.reject(CodedError(res.status, res.data.message));
                return res.data;
            });
        };
    });
    
    return self;
});

app.factory('posts', function($q, $Http) {

    var self = {
        list: [],
        synchronizing: false,
    };

    self.create = function(text) {
        if (self.synchronizing)
            return $q.reject(new Error('Unable to create post while synchronizing.'));
        return $Http.post('/posts', { text: text }).then(function(res) {
            self.list.push({ text: text });
            return res;
        });
    }

    self.fetch = function() {
        self.synchronizing = true;
        return $Http.get('/posts').then(function(posts) {
            self.synchronizing = false;
            return self.list = posts;
        });
    }

    return self;
})

app.factory('notification', function() {
    var self = {
        active: false,
        type: null,
        message: ''
    };
    self.set = function(type, message) {
        self.active = true;
        self.message = message;
        self.type = type;
    };
    self.reportError = function(e) {
        self.set('danger', e.message);
    }
    self.clear = function() {
        self.active = false;
    }
    return self;

});

app.controller('submitCtrl', function($scope, posts, notification) {
    $scope.posts = posts;
    $scope.submit = function() {
        posts.create($scope.text).then(function(res) {
            notification.set('success', res.message);
        }).catch(notification.reportError);
    }
})

app.controller('listCtrl', function($scope, posts, notification) {
    $scope.posts = posts;
    posts.fetch().catch(notification.reportError);
})

app.controller('notificationCtrl', function($scope, notification) {
    $scope.notification = notification;
})
