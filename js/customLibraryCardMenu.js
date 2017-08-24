angular
  .module('customLibraryCardMenu', [])
  .controller('customLibraryCardMenuController', ['customLibraryCardMenuItems', '$scope', '$filter', function(customLibraryCardMenuItems, $scope, $filter) {
    this.$onInit = () => {
      $scope.customLibraryCardMenuItemsArray = customLibraryCardMenuItems.map(item => {
        return {
          name: item.name,
          action: item.action,
          description: item.description
        }
      });
    }
    $scope.translate = (original) => {
      return original.replace(/\{(.+)\}/g, (match, p1) => $filter('translate')(p1));
    }
    $scope.goToUrl = (url) => {
      window.open(url, '_blank');
    }
  }])
  .component('prmLibraryCardMenuAfter', {
    controller: 'customLibraryCardMenuController',
    template: '<button ng-repeat="item in customLibraryCardMenuItemsArray" aria-label="{{ translate(item.description) }}" ng-click="goToUrl(translate(item.action))" class="button-with-icon zero-margin md-button md-primoExplore-theme md-ink-ripple" type="button">'+
                '<prm-icon style="z-index:1" icon-type="svg" svg-icon-set="primo-ui" icon-definition="account-card-details"></prm-icon>'+
                '<span class="customLibraryCardMenuItem">{{ translate(item.name) }}</span>'+
              '</button>'

  });
