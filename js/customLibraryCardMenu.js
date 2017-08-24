import { viewName } from './viewName';

angular
  .module('customLibraryCardMenu', [])
  .factory('customLibraryCardMenuFactory', ['$filter', ($filter) => {
    class CustomLibraryCardMenuItem {
      constructor(item) {
        this.item = item;
        this.itemText = this.translate(this.item.name);
        this.itemUrl = this.translate(this.item.action);
        this.itemDescription = this.translate(this.item.description);
      }
      translate(original) {
        return original.replace(/\{(.+)\}/g, (match, p1) => $filter('translate')(p1));
      }
      goToUrl() {
        window.open(this.itemUrl, '_blank');
      }
    }
    return CustomLibraryCardMenuItem;
  }])
  .controller('customLibraryCardMenuController', ['customLibraryCardMenuItems', 'customLibraryCardMenuFactory', '$scope', function(customLibraryCardMenuItems, customLibraryCardMenuFactory, $scope) {
    this.$onInit = () => {
      $scope.customLibraryCardMenuItemsArray = customLibraryCardMenuItems.map(item => new customLibraryCardMenuFactory(item));
    }
  }])
  .component('prmLibraryCardMenuAfter', {
    bindings: {
      parentCtrl: '<'
    },
    require: { prmLibraryCardMenuCtrl: '^prmLibraryCardMenu' },
    controller: 'customLibraryCardMenuController',
    templateUrl: 'custom/' + viewName + '/html/libraryCardMenu.html'
  });
