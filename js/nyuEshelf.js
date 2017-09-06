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
    inGuestEshelf: "In guest e-Shelf (<a href=\"#\">login to save permanently</a>)",
    adding: "Adding to e-Shelf...",
    deleting: "Removing from e-Shelf...",
    error: "Could not connect to e-Shelf",
    eshelfBase: 'http://localhost:3000'
  })
  .factory('csrfTokenService', function() {
    return {
      token: ''
    };
  })
  .controller('nyuEshelfController', ['csrfTokenService', 'nyuEshelfConfig', '$scope', '$http', '$sce', function(csrfTokenService, config, $scope, $http, $sce) {
    this.$onInit = function() {
      $scope.elementText = config.addToEshelf;
      $scope.externalId = this.prmSearchResultAvailabilityLine.result.pnx.control.recordid[0];
      if (this.prmSearchResultAvailabilityLine.isFullView) {
        $scope.elementId = "eshelf_" + $scope.externalId + "_full";
      } else {
        $scope.elementId = "eshelf_" + $scope.externalId + "_brief";
      }

      $scope.eshelfBase = config.eshelfBase;
      $scope.recordData = { "record": { "external_system": "primo", "external_id": $scope.externalId }};
      $scope.running = false;
      $scope.checkEshelf();
    }

    $scope.checkEshelf = function() {
      var url = $scope.eshelfBase + "/records/from/primo.json?per=all&external_id[]=" + $scope.externalId;

      $http.get(url).then(
          function(response){
            // console.log("Success");
            // console.log(response.headers('x-csrf-token'));
            // console.log(response);
            csrfTokenService.token = response.headers('x-csrf-token');
            // console.log(csrfTokenService.token)
          },
          function(response){
            console.log("Failure");
            console.log(response);
          }
       );
    }

    $scope.addToEshelf = function() {
      $scope.elementText = config.adding;
      let headers = { 'X-CSRF-Token': csrfTokenService.token, 'Content-type': 'application/json;charset=utf-8' }
      let request = {
        method: 'POST',
        url: $scope.eshelfBase + "/records.json",
        headers: headers,
        data: $scope.recordData
      }
      $http(request)
        .then(
          function(response){
            $scope.running = false;
            $scope.elementText = config.inGuestEshelf;
            csrfTokenService.token = response.headers('x-csrf-token');
          },
          function(response){
            $scope.elementText = config.error;
          }
        );
    }

    $scope.removeFromEshelf = function() {
      $scope.elementText = config.deleting;
      let headers = { 'X-CSRF-Token': csrfTokenService.token, 'Content-type': 'application/json;charset=utf-8' }
      let request = {
        method: 'DELETE',
        url: $scope.eshelfBase + "/records.json",
        headers: headers,
        data: $scope.recordData
      }
      $http(request, config)
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
      '<input ng-disabled="running" id="{{ elementId }}" type="checkbox" data-eshelf-external-id="{{ externalId }}" ng-click="running = true; eshelfCheckBoxTrigger()" >' +
      '<label for="{{ elementId }}"><span ng-bind-html="elementText"></span></label>' +
    '</button></div>'

  })
