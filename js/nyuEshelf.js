// To do:
// - ~~Pre-check already saved records~~
// - Link to login in "login to save permanently"
// - Have logged in user text when there is a session
// - Clicking in either full or brief should show selected in the other ($watch the other element from this one)
angular.module('nyuEshelf', [])
  .config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;

    //Remove the header containing XMLHttpRequest used to identify ajax call
    //that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .constant('nyuEshelfConfig', {
    addToEshelf: "Add to e-Shelf",
    inEshelf: "In e-Shelf",
    inGuestEshelf: "In guest e-Shelf",
    loginToSave: "login to save permanently",
    adding: "Adding to e-Shelf...",
    deleting: "Removing from e-Shelf...",
    error: "Could not connect to e-Shelf",
    eshelfBaseUrl: 'http://localhost:3000',
    pdsUrl: {
      base: 'https://pdsdev.library.nyu.edu/pds',
      callingSystem: 'primo',
      institution: 'NYU-NUI'
    }
  })
  .factory('csrfTokenService', function() {
    return {
      token: ''
    };
  })
  .controller('nyuEshelfController', ['csrfTokenService', 'nyuEshelfConfig', '$scope', '$http', '$location', function(csrfTokenService, config, $scope, $http, $location) {
    this.$onInit = function() {
      $scope.elementText = config.addToEshelf;
      $scope.externalId = this.prmSearchResultAvailabilityLine.result.pnx.control.recordid[0];
      if (this.prmSearchResultAvailabilityLine.isFullView) {
        $scope.elementId = "eshelf_" + $scope.externalId + "_full";
      } else {
        $scope.elementId = "eshelf_" + $scope.externalId + "_brief";
      }

      $scope.eshelfBaseUrl = config.eshelfBaseUrl;
      $scope.recordData = { "record": { "external_system": "primo", "external_id": $scope.externalId }};
      $scope.running = false;
      $scope.checkEshelf();
    }

    $scope.generateRequest = function(httpMethod) {
      if (!/^(DELETE|POST)$/.test(httpMethod.toUpperCase())) {
        return {};
      }
      let headers = { 'X-CSRF-Token': csrfTokenService.token, 'Content-type': 'application/json;charset=utf-8' }
      let request = {
        method: httpMethod.toUpperCase(),
        url: $scope.eshelfBaseUrl+ "/records.json",
        headers: headers,
        data: $scope.recordData
      }
      return request;
    }

    $scope.inEshelfText = function() {
      return config.inGuestEshelf + " (<a href=\"" + $scope.pdsUrl() + "\">" + config.loginToSave + "</a>)";
    };

    $scope.pdsUrl = function() {
      return config.pdsUrl.base + "?func=load-login&calling_system=" + config.pdsUrl.callingSystem + "&institute=" + config.pdsUrl.institution + "&url=" + $location.absUrl();
    };

    $scope.checkEshelf = function() {
      var url = $scope.eshelfBaseUrl+ "/records/from/primo.json?per=all&external_id[]=" + $scope.externalId;

      $http.get(url).then(
          function(response){
            console.log(response)
            console.log(response.cookies)
            csrfTokenService.token = response.headers('x-csrf-token');
            if (response.data.length > 0) {
              if (response.data.filter(item => item["external_id"] == $scope.externalId)) {
                $scope.inEshelf = true;
                $scope.elementText = $scope.inEshelfText();
              }
            }
          },
          function(response){
            $scope.elementText = config.error;
          }
       );
    }

    $scope.addToEshelf = function() {
      $scope.elementText = config.adding;
      $http($scope.generateRequest('post'))
        .then(
          function(response){
            $scope.running = false;
            $scope.elementText = $scope.inEshelfText();
            csrfTokenService.token = response.headers('x-csrf-token');
          },
          function(response){
            $scope.elementText = config.error;
          }
        );
    }

    $scope.removeFromEshelf = function() {
      $scope.elementText = config.deleting;
      $http($scope.generateRequest('delete'))
        .then(
          function(response){
            $scope.running = false;
            $scope.elementText = config.addToEshelf;
            csrfTokenService.token = response.headers('x-csrf-token');
          },
          function(response){
            $scope.elementText = config.error;
          }
        );
    }

    $scope.eshelfCheckBoxTrigger = function() {
      if(document.getElementById($scope.elementId).checked == true){
        $scope.addToEshelf();
      } else {
        $scope.removeFromEshelf();
      }
    }

  }])
  .component('nyuEshelf', {
    controller: 'nyuEshelfController',
    bindings: {
      parentCtrl: '<'
    },
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    template: '<div class="nyu-eshelf"><button class="neutralized-button md-button md-primoExplore-theme" >' +
      '<input ng-checked="inEshelf" ng-disabled="running" id="{{ elementId }}" type="checkbox" data-eshelf-external-id="{{ externalId }}" ng-click="running = true; eshelfCheckBoxTrigger()" >' +
      '<label for="{{ elementId }}"><span ng-bind-html="elementText"></span></label>' +
    '</button></div>'

  })
