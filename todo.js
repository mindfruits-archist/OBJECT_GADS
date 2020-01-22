/*
  var app = angular.module('todoApp', [])
app.controller('TodoListController', function() {
  var todoList = this;
  // todoList.tests = adsParams;
  todoList.todos = [
    {text:'learn AngularJS', done:true},
    {text:'build an AngularJS app', done:false}];
});
*/
  angular.module('todoApp', [])
  .factory('okFactory', function() {
    var fac = [{
      ok: "okok"
    }]
    return fac
  })
  .controller('TodoListController', function($scope, okFactory) {
    var todoList = this;
    $scope.todos = [
      {text:'learn AngularJS', done:true},
      {text:'build an AngularJS app', done:false}
    ];
    $scope.test = [{un:'ununununnu', deux:"plplplpl", oui:"ouiouioui"}]
    $scope.testt = function(){alert('ok');$scope.test.push({unn:'---', deuxx:"____", ouiii:"xxxxxx"});console.log(test)}

    todoList.addTodo = function() {
      todoList.todos.push({text:todoList.todoText, done:false});
      todoList.todoText = '';
    };

    todoList.doit = function() {
      console.log(okFactory)
      okFactory.fac.push({text:"un", done:'test'});
    };

    todoList.remaining = function() {
      var count = 0;
      angular.forEach(todoList.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    todoList.archive = function() {
      var oldTodos = todoList.todos;
      todoList.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.todos.push(todo);
      });
    };
  });
