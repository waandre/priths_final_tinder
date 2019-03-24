var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
    $scope.current= 0;
    $scope.pref = {val: undefined}
    $scope.rated = false
    $scope.Submit = function() {
        if ($scope.user !== undefined && $scope.user !== null && !$scope.user !== '' ) {
            var request = $http.get('/valid/'+$scope.user);
            request.success(function(data) {
                if (data.length > 0) {
                    $scope.voted = data[0].finishedRatings
                    if (data[0].finishedRatings === false) {
                        var request1 = $http.get('/all/'+$scope.user);
                        request1.success(function(d1) {
                            $scope.data = d1;
                        })
                        request1.error(function(data){
                            console.log('err');
                        });
                    } else if (data[0].finishedRatings === true) {
                        var request1 = $http.get('/matches/'+$scope.user);
                        var request2 = $http.get('/'+$scope.user);
                        var arr = []
                        request1.success(function(d1) {
                            request2.success(function(d2) {
                                for (var i = 0; i < d1.length; i++) {
                                    if (d2[0].likes.includes(d1[i].name)) {
                                        arr.push(d1[i]);
                                    }
                                }
                                $scope.data = arr;
                            })       
                        })
                        request1.error(function(data){
                            console.log('err');
                        });
                    }
                }
            });
            request.error(function(data){
                console.log('err');
            });
        }
    }; 

    $scope.Next = function() {
        if ($scope.pref.val == 'true') {
            var request = $http.post('/adduser/'+$scope.user+'/'+$scope.data[$scope.current].name);
            request.success(function(data){
                console.log(data)
            });
            request.error(function(data){
                console.log('err');
            });
        }
        if ($scope.pref.val == 'true' || $scope.pref.val == 'false') {
            $scope.rated = true
            $scope.pref.val = undefined
        }

        if ($scope.rated) {
            $scope.current += 1
            $scope.rated = false
        }

        if ($scope.current == $scope.data.length) {
            $scope.data = []
            $scope.current = 0
            var request = $http.post('/finishratings/'+$scope.user);
            request.success(function(data){
                console.log(data)
            });
            request.error(function(data){
                console.log('err');
            });
        }
    }
});

  