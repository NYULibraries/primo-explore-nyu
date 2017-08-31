import 'primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-custom-no-search-results';
import 'primo-explore-libraryh3lp-widget';
import 'primo-explore-getit-to-link-resolver';

import { viewName } from './viewName';
import { customActionsConfig } from './customActions';
import { customLibraryCardMenuItemsConfig } from './customLibraryCardMenu';
import { clickableLogoLinkConfig } from './clickableLogoToAnyLink';
import { libraryh3lpWidgetConfig } from './libraryh3lpWidget';
import { getitToLinkResolverConfig } from './getitToLinkResolver'

  angular.module('nyuEshelf', [])
    .controller('nyuEshelfController', ['$scope', '$http', function($scope, $http){
      this.$onInit = function() {
        $scope.elementText = "Add to e-Shelf";

        $scope.externalId = this.parentCtrl.result.pnx.control.recordid[0];
        $scope.elementId = "eshelf_" + $scope.externalId;

        $scope.eshelfUrl = 'https://dev.eshelf.library.nyu.edu/records.json';
        $scope.recordData = { "record": { "external_system": "primo", "external_id": $scope.externalId }};
        $scope.checkEshelf();
      }

      $scope.checkEshelf = function() {
        var url = "https://dev.eshelf.library.nyu.edu/records/from/primo.json?";
        var data = {"per":"all", "external_id[]":[$scope.externalId]};
        $http.get(url , data).then(
            function(response){
              console.log("Success");
              console.log(response);
            },
            function(response){
              console.log("Failure");
              console.log(response);
            }
         );
      }

      $scope.addToEshelf = function() {
        $scope.elementText = "Adding to e-Shelf..."
        $http.post($scope.eshelfUrl , $scope.recordData)
          .then(
            function(response){
              $scope.elementText = "In guest e-Shelf (login to save permanently)";
            },
            function(response){
              $scope.elementText = "Could not connect to e-Shelf";
            }
          );
      }

      $scope.removeFromEshelf = function() {
        $scope.elementText = "Removing from e-Shelf..."
        $http.delete($scope.eshelfUrl , $scope.recordData)
          .then(
            function(response){
              $scope.elementText = "Add to e-Shelf";
            },
            function(response){
              $scope.elementText = "Could not connect to e-Shelf";
            }
          );
      }

      $scope.eshelfCheckBoxTrigger = function() {
        if(document.getElementById($scope.elementId).checked == true){
          console.log("Clicked when unchecked ");
          $scope.addToEshelf();
        } else {

          console.log("Clicked when checked ");
          $scope.removeFromEshelf();
        }
      }
    }])
    .component('prmSearchResultAvailabilityLineAfter', {
      controller: 'nyuEshelfController',
      bindings: {
        parentCtrl: '<'
      },
      template: '<button class="neutralized-button md-button md-primoExplore-theme" >' +
        '<input id="{{ elementId }}" type="checkbox" data-eshelf-external-id="{{ externalId }}" ng-click="eshelfCheckBoxTrigger()" >' +
        '<label for="{{ elementId }}">{{ elementText }}</label>' +
      '</button>'

    })

let app = angular.module('viewCustom', [
                                        'angularLoad',
                                        'customActions',
                                        'customLibraryCardMenu',
                                        'clickableLogoToAnyLink',
                                        'customNoSearchResults',
                                        'libraryh3lpWidget',
                                        // 'getitToLinkResolver'
                                        'nyuEshelf'
                                      ]);

app
  .constant(customActionsConfig.name, customActionsConfig.config)
  .constant(customLibraryCardMenuItemsConfig.name, customLibraryCardMenuItemsConfig.config)
  .constant(clickableLogoLinkConfig.name, clickableLogoLinkConfig.config)
  .constant(libraryh3lpWidgetConfig.name, libraryh3lpWidgetConfig.config)
  .constant(getitToLinkResolverConfig.name, getitToLinkResolverConfig.config)
  .value('customNoSearchResultsTemplateUrl', 'custom/' + viewName + '/html/noSearchResults.html')
  // .component('prmSearchResultAvailabilityLineAfter', {
  //   template: '<getit-to-link-resolver-brief></getit-to-link-resolver-brief>'
  // })
  .component('prmOpacAfter', {
    template: '<getit-to-link-resolver-full></getit-to-link-resolver-full>'
  })
