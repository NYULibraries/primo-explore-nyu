angular.module('nyuEshelf', [])
  // .config(function($sceDelegateProvider) {
  //   $sceDelegateProvider.resourceUrlWhitelist([
  //     'self',
  //     '**.eshelf.library.nyu.edu/**',
  //     'eshelf.library.nyu.edu'
  //   ])
  // })
  .filter('trust', ['$sce', function($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    }
  }])
  .constant('nyuEshelfConfig', {
    addToEshelf: "Add to e-Shelf",
    inEshelf: "In e-Shelf",
    inGuestEshelf: "In guest e-Shelf (<a href=\"#\">login to save permanently</a>)",
    adding: "Adding to e-Shelf...",
    deleting: "Removing from e-Shelf...",
    error: "Could not connect to e-Shelf"
  })
  .controller('nyuEshelfController', ['nyuEshelfConfig', '$scope', '$http', '$sce', function(config, $scope, $http, $sce) {
    this.$onInit = function() {
      $scope.elementText = config.addToEshelf;
      $scope.externalId = this.prmSearchResultAvailabilityLine.result.pnx.control.recordid[0];
      $scope.elementId = "eshelf_" + this.externalId;

      $scope.eshelfUrl = 'https://qa.eshelf.library.nyu.edu/records.json';
      $scope.recordData = { "record": { "external_system": "primo", "external_id": $scope.externalId }};
      $scope.checkEshelf();
    }

    $scope.checkEshelf = function() {
      var url = "https://qa.eshelf.library.nyu.edu/records/from/primo.json?per=all&external_id[]=" + $scope.externalId;
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
      $http.post($scope.eshelfUrl, $scope.recordData)
        .then(
          function(response){
            $scope.elementText = config.inGuestEshelf;
          },
          function(response){
            $scope.elementText = config.error;
          }
        );
    }

    $scope.removeFromEshelf = function() {
      $scope.elementText = config.deleting;
      $http.delete($scope.eshelfUrl , $scope.recordData)
        .then(
          function(response){
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
      '<input id="{{ elementId }}" type="checkbox" data-eshelf-external-id="{{ externalId }}" ng-click="eshelfCheckBoxTrigger()" >' +
      '<label for="{{ elementId }}">{{ elementText | trust }}</label>' +
    '</button></div>'

  })
