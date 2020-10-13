

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, AUTH_EVENTS, $state, urdaService, $http) {
  // Form data for the login modal

   
  $scope.loginDropBox = function(){
      return urdaService.login({provider:'dropbox-oauth2'});
  };

  $scope.loginTwitter = function(){
    return  urdaService.login({provider:'twitter'})
  };

  $scope.loginGithub = function(){
    return  urdaService.login({provider:'github'})
  };

  $scope.logout = function(){
    return urdaService.logout();
  }

  


  $scope.logged = false;


  $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(evt, data){
    $timeout(function(){
      $scope.logged = false;
      console.log("xx", $state.current);
      $state.go("app.login");
    })
    
  });


  $rootScope.$on(AUTH_EVENTS.loginSuccess, function(evt, data){
    $timeout(function(){
      $scope.logged = true;
    });

    $http.get("http://127.0.0.1:8000/me/")
    .then(function(resp){
      //#TODO: move to a service!
      $scope.me = resp.data;
      var auths = {};
      angular.forEach($scope.me.auths, function(auth){
        console.log(auth);
        auths[auth.provider] = auth;
      })
      $scope.auths = auths;

    });

    $state.go("app.schemas.new");


  });

  $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(evt, next, toParams){
    $scope.logged = false;
    $state.go("app.login")
  });

  

  
})

.controller('LoginCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', '$state', 'urdaService', function ($scope, $rootScope,AUTH_EVENTS, $state, urdaService) {

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(evt, data){
      console.log("xx", $state.current);
    });
}])






.controller('SchemaCtrl', ['$scope', 'schemaRegistry', function ($scope, schemaRegistry) {

  var fieldSchema = {

    name : "Field",
    description : "a field for our schemas",
    properties : [

      {
        name : "name",
        type : "string",
        required : true
      },
      {
        name : "type",
        type : "string",
        enum : ["string", "number", "integer", "array", "object"],
        required : true
      },
      {
        name : "min",
        type : "integer",
        when : { equals : ["type", "integer"]}
      },
      {
        name : "max",
        type : "integer",
        when : { equals : ["type", "integer"]}
      }

    ]

  };


  schemaRegistry.registerSchema(fieldSchema);


  $scope.entitySchema = {
    name : "Schema",
    description : "Our schema schema!",
    properties : [
      {
        name : "name",
        type : "string",
        required : true
      },
      {
        name : "description",
        type : "string"
      },
      {
        name : "properties",
        type : "array",
        arrayType : "schema:Field"
      }
    ]
  };


  $scope.data = { entityModel : { } }
  
  
}])

