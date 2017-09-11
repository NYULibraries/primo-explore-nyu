angular.module('nyuEshelf', [])
  .config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Enable passing of cookies for CORS calls
    $httpProvider.defaults.withCredentials = true;

    //Remove the header containing XMLHttpRequest used to identify ajax call
    //that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .factory('nyuEshelfService', () => {
    return {
      csrfToken: '',
      loggedIn: false
    };
  })
  .run(['nyuEshelfService', 'nyuEshelfConfig', '$http', function(nyuEshelfService, config, $http){
    var url = config.eshelfBaseUrl+"/records/from/primo.json?per=all&external_id[]=";
    $http.get(url).then(
      function(response){
        nyuEshelfService.csrfToken = response.headers('x-csrf-token');
      }
    );
  }])
  .constant('nyuEshelfConfig', {
    addToEshelf: "Add to e-Shelf",
    inEshelf: "In e-Shelf",
    inGuestEshelf: "In guest e-Shelf",
    loginToSave: "login to save permanently",
    adding: "Adding to e-Shelf...",
    deleting: "Removing from e-Shelf...",
    error: "Could not connect to e-Shelf",
    pdsUrl: {
      base: 'https://pdsdev.library.nyu.edu/pds',
      callingSystem: 'primo',
      institution: 'NYU-NUI'
    },
    eshelfBaseUrl: 'http://localhost:3000'
  })
  .controller('nyuEshelfController', ['nyuEshelfService', 'nyuEshelfConfig', '$rootScope', '$scope', '$http', '$location', '$window', function(nyuEshelfService, config, $rootScope, $scope, $http, $location, $window) {
    this.$onInit = function() {
      $scope.elementText = config.addToEshelf;
      $scope.externalId = this.prmSearchResultAvailabilityLine.result.pnx.control.recordid[0];
      $scope.elementIdFull = "eshelf_" + $scope.externalId + "_full";
      $scope.elementIdBrief = "eshelf_" + $scope.externalId + "_brief";
      if (this.prmSearchResultAvailabilityLine.isFullView) {
        $scope.elementId = $scope.elementIdFull;
      } else {
        $scope.elementId = $scope.elementIdBrief;
      }

      $scope.eshelfBaseUrl = config.eshelfBaseUrl;
      $scope.recordData = { "record": { "external_system": "primo", "external_id": $scope.externalId }};
      $scope.running = false;
      nyuEshelfService.loggedIn = !this.prmBriefResultContainer.userSessionManagerService.isGuest();
      $scope.checkEshelf();
    };

    $scope.inEshelfText = function() {
      if (nyuEshelfService.loggedIn) {
        return config.inEshelf;
      } else {
        return config.inGuestEshelf + " (<a href=\"" + $scope.pdsUrl() + "\">" + config.loginToSave + "</a>)";
      }
    };

    $scope.pdsUrl = function() {
      return config.pdsUrl.base + "?func=load-login&calling_system=" + config.pdsUrl.callingSystem + "&institute=" + config.pdsUrl.institution + "&url=http://bobcatdev.library.nyu.edu:80/primo_library/libweb/pdsLogin?targetURL=" + $window.encodeURIComponent($location.absUrl()) + "&from-new-ui=1&authenticationProfile=BASE_PROFILE";
    };

    $scope.inEshelf = function() {
      return nyuEshelfService[$scope.externalId] == true;
    };

    $scope.setElementText = function() {
      if (nyuEshelfService[$scope.externalId]) {
        if ($scope.running) {
          return config.deleting;
        } else {
          return $scope.inEshelfText();
        }
      } else {
        if ($scope.running) {
          return config.adding;
        } else {
          return config.addToEshelf;
        }
      }
    };

    $scope.generateRequest = function(httpMethod) {
      if (!/^(DELETE|POST)$/.test(httpMethod.toUpperCase())) {
        return {};
      }
      let headers = { 'X-CSRF-Token': nyuEshelfService.csrfToken, 'Content-type': 'application/json;charset=utf-8' }
      let request = {
        method: httpMethod.toUpperCase(),
        url: $scope.eshelfBaseUrl+ "/records.json",
        headers: headers,
        data: $scope.recordData
      }
      return request;
    };

    $scope.checkEshelf = function() {
      var url = $scope.eshelfBaseUrl+ "/records/from/primo.json?per=all&external_id[]=" + $scope.externalId;

      $http.get(url).then(
          function(response){
            nyuEshelfService.csrfToken = response.headers('x-csrf-token');
            if (response.data.length > 0) {
              if (response.data.filter(item => item["external_id"] == $scope.externalId)) {
                nyuEshelfService[$scope.externalId] = true;
              }
            }
          },
          function(response){
            $scope.elementText = config.error;
          }
       );
    };

    $scope.addToEshelf = function() {
      $http($scope.generateRequest('post'))
        .then(
          function(response){
            nyuEshelfService.csrfToken = response.headers('x-csrf-token');
            nyuEshelfService[$scope.externalId] = true;
            $scope.running = false;
          },
          function(response){
            $scope.elementText = config.error;
          }
        );
    };

    $scope.removeFromEshelf = function() {
      $http($scope.generateRequest('delete'))
        .then(
          function(response){
            nyuEshelfService.csrfToken = response.headers('x-csrf-token');
            nyuEshelfService[$scope.externalId] = false;
            $scope.running = false;
          },
          function(response){
            $scope.elementText = config.error;
          }
        );
    };

    $scope.eshelfCheckBoxTrigger = function() {
      if($scope.inEshelf()){
        $scope.removeFromEshelf();
      } else {
        $scope.addToEshelf();
      }
    };

  }])
  .component('nyuEshelf', {
    controller: 'nyuEshelfController',
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine',
      prmBriefResultContainer: '^prmBriefResultContainer'
    },
    template: '<div class="nyu-eshelf"><button class="neutralized-button md-button md-primoExplore-theme" >' +
      '<input ng-checked="inEshelf()" ng-disabled="running" id="{{ elementId }}" type="checkbox" data-eshelf-external-id="{{ externalId }}" ng-click="running = true; eshelfCheckBoxTrigger()" >' +
      '<label for="{{ elementId }}"><span ng-bind-html="setElementText()"></span></label>' +
    '</button></div>'
  })
