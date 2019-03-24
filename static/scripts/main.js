// var angular = require('angular')

// $(document).ready(function () {

//     var data = [];
//     var activeIdx = -1;
  
//     // kick off getting the questions
//     getQuestions();
//     // now do it  every 2.5 seconds
//     setInterval(getQuestions, 2500);
  
//     function getQuestions() {
//       // TODO: make an ajax request to /api/getQuestions. on success
//       //       set  the data variable equal to the response and render
//       //       out the question previews (by callingrenderPreviews())
//       //       Later on in the writeup, also render the active question 
//       //       (to update it) with renderactive()
//       $.ajax({
//         url: '/api/getQuestions',
//         type: 'GET',
//         success: function(res) {
//           data = res
//           renderPreviews()
//           renderActive()
//         }
//       })
//     }
  
//     // makes a list  of questions which all have the question text and a data-qid attribute
//     // that allows you to access their _id by doing $whateverjQueryObjectYouHave.data('qid')
//     function renderPreviews() {
//       $('#questions').html(
//           data.map((i) => '<li data-qid="' + i._id + '">' + i.questionText + '</li>').join('')
//       )
//     }
  
//     function renderActive() {
//       if (activeIdx > -1) {
//         var active = data[activeIdx];
//         $('#show-question').css('display', 'block');
//         $('#question').text(active.questionText ? active.questionText: '');
//         $('#author').text(active.author ? active.author: '');
//         $('#answer-text').text(active.answer ? active.answer : '');
//       } else {
//         $('#show-question').css('display', 'none');
//       }
//     }
  
//     $('#questions').on('click', 'li', function () {
//       var _id = $(this).data('qid');
//       for(var i = 0; i < data.length; i++) {
//           if (data[i]._id === _id) {
//               activeIdx = i;
//               break;
//           }
//       }
//       // TODO: When a question is clicked, set the `active` variable equal to
//       //       the data of the question that is active (hint: look through the 
//       //       data array. If an array entry has the same _id as the _id we just
//       //       declared here, it is the active question
     
      
//       // we now render out the active question
//       renderActive();
//     })
  
//     $('#show-question').on('click', '#submitAnswer', function () {
//       var answer = $('#answer').val();
//       // TODO: When we submit a new answer, send a POST request to
//       //      /api/answerQuestion with  the question answer and the active question's
//       //      _id.
//       $.ajax({
//         url: '/api/answerQuestion',
//         data: { answer: answer, qid: data[activeIdx]._id },
//         type: 'POST',
//         success: function(res) {
//           console.log(res)
//         }
//       })
      
//     })
  
//     // when we want to make a new question, show the modal
//       $('#new-question').on('click', function () {
//       $('.modal').css('display', 'block');
//     })
  
  
//     $('#close-modal').on('click', function () {
//       $('.modal').css('display', 'none');
//     })
  
  
//     $('#submit-question').on('click', function () {
//       // TODO: make a post request to /api/addQuestion with the qText as the 
//       // questionText attribute. On success, hide the modal
//       var qText = $('#question-text').val();
//       $.ajax({
//         url: '/api/addQuestion',
//         data: { questionText: qText },
//         type: 'POST',
//         success: function(res) {
//           $('.modal').css('display', 'none');
//         }
//       })
      
//     })
//   })



  var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
    $scope.current=0;
    $scope.pref = {val: undefined}
    $scope.rated = false
    $scope.Submit = function() {
        var r = $http.get('/'+$scope.user);
        r.success(function(data) {
            $scope.voted = data[0].finishedRatings
        })
        var request = $http.get('/valid/'+$scope.user);
        request.success(function(data) {
            if (data.length > 0 && !$scope.voted) {
                var request1 = $http.get('/all/'+$scope.user);
                request1.success(function(d1) {
                    $scope.data = d1;
                })
                request1.error(function(data){
                    console.log('err');
                });
            }

            if (data.length > 0 && $scope.voted) {
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


        });
        request.error(function(data){
            console.log('err');
        });
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

  