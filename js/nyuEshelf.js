angular.module('nyuEshelf', [])
  .constant('nyuEshelfConfig', {
    addToEshelf: "Add to e-Shelf",
    inEshelf: "In e-Shelf",
    inGuestEshelf: "In guest e-Shelf (<a href=\"#\">login to save permanently</a>)",
    adding: "Adding to e-Shelf...",
    deleting: "Removing from e-Shelf...",
    error: "Could not connect to e-Shelf",
    eshelfBase: 'https://qa.eshelf.library.nyu.edu'
  })
  .controller('nyuEshelfController', ['nyuEshelfConfig', '$scope', '$http', '$sce', function(config, $scope, $http, $sce) {
    this.$onInit = function() {
      $scope.elementText = config.addToEshelf;
      $scope.externalId = this.prmSearchResultAvailabilityLine.result.pnx.control.recordid[0];
      $scope.elementId = "eshelf_" + $scope.externalId;

      $scope.eshelfBase = config.eshelfBase;
      $scope.recordData = { "record": { "external_system": "primo", "external_id": $scope.externalId }};
      $scope.running = false;
      $scope.checkEshelf();
    }

    $scope.checkEshelf = function() {
      var url = $scope.eshelfBase + "/records/from/primo.json?per=all&external_id[]=" + $scope.externalId;
      var config =
      {
        "xsrfCookieName": "X-CSRF-Token",
        "withCredentials": true,
        "xsrfHeaderName": "X-CSRF-Token",
      };
      $http.get(url, config).then(
          function(response){
            console.log("Success");
            console.log(response.headers());
            console.log(response);
          },
          function(response){
            console.log("Failure");
            console.log(response);
          }
       );
    }

    $scope.addToEshelf = function() {
      $scope.elementText = config.adding;
      $http.post($scope.eshelfBase + "/records.json", $scope.recordData)
        .then(
          function(response){
            $scope.running = false;
            $scope.elementText = config.inGuestEshelf;
          },
          function(response){
            $scope.elementText = config.error;
          }
        );
    }

    $scope.removeFromEshelf = function() {
      $scope.elementText = config.deleting;
      $http.delete($scope.eshelfBase + "/records.json", $scope.recordData)
        .then(
          function(response){
            $scope.running = false;
            $scope.elementText = config.addToEshelf;
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
