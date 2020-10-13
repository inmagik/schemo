// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'urda', 'schemas'])

.run(function($ionicPlatform, $rootScope, urdaService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });




  $rootScope.$on('$stateChangeStart', function (event, next, toParams ) {
      /*
      ngProgress.color('deeppink');
      ngProgress.height('6px');
      ngProgress.reset();
      ngProgress.start();
      */
      
      urdaService.checkRoute(next, toParams, event);
      
      
      
  
  });

  $rootScope.$on('$stateChangeSuccess', function () {
    //ngProgress.complete();
  });

  $rootScope.$on('$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {
        console.error(error, toState, toParams, fromState, fromParams);
        
    });

})

.config(function($stateProvider, $urlRouterProvider, urdaConfigProvider, $httpProvider) {

//cors config
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];


  urdaConfigProvider.setMode('social');
  urdaConfigProvider.setApiAuthMode('token');
  urdaConfigProvider.setSocialLoginUrl('http://127.0.0.1:8000/login/');
  urdaConfigProvider.setTokenVerifyUrl('http://127.0.0.1:8000/me/');

  


  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html"
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller : 'LoginCtrl'
        }
      },
      resolve : {
        autolog : function($http, urdaService){
            var tk = localStorage.getItem("xxx-token");
            if(tk){
              console.error("got a token....", tk)
              return urdaService.loginViaToken(tk);
            }
        }
      }
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
          
        }
      },
      auth : { requiresAuth : true },
      resolve : {
        
      }
    })

    .state('app.tour', {
      url: "/tour",
      views: {
        'menuContent' :{
          templateUrl: "templates/tour.html"
          
        }
      },
      auth : { requiresAuth : false },
      resolve : {
        
      }
    })


    .state('app.schemas', {
      abstract : true,
      views: {
        'menuContent' :{
          template : '<ion-nav-view name="menuContent" animation="slide-left-right"></ion-nav-view>',
          
        }
      },
      
      auth : { requiresAuth : true },
      resolve : {
        
      }
    })


    .state('app.schemas.list', {
      url: "/schemas/list",
      views: {
        'menuContent' :{
          templateUrl: "templates/schemas-list.html"
          
        }
      },
      auth : { requiresAuth : true },
      resolve : {
        
      }
    })


    .state('app.schemas.new', {
      url: "/schemas/new",
      views: {
        'menuContent' :{
          templateUrl: "templates/schemas-new.html",
          controller : "SchemaCtrl"
          
        }
      },
      auth : { requiresAuth : true },
      resolve : {
        
      }
    })






    
    .state('app.github', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/github.html",
          controller : function($scope, $http){
            console.log(111, $scope.auths.github.extra_data.access_token);
            $http.get('https://api.github.com/user/starred', {
              headers : {
                'Authorization' : "token "+$scope.auths.github.extra_data.access_token
              }
            })
              .then(function(resp){
              console.log(resp);
              $scope.repos = resp.data;
            })

          }
        }
      },
      auth : { requiresAuth : true },
      resolve : {
        
      }
    })




    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

