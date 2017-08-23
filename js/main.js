import 'primo-explore-custom-actions';

import { viewName } from './viewName';
import { prmLogoAfterConfig } from './prmLogoAfter';
import { prmExploreMainAfterConfig } from './prmExploreMainAfter';
import { prmSearchResultAvailabilityLineAfterConfig } from './prmSearchResultAvailabilityLineAfter';
import { prmNoSearchResultAfterConfig } from './prmNoSearchResultAfter';
import { customActionsConstant } from './customActions';

angular
  .module('customLibraryCardMenu', [])
  .controller('customLibraryCardMenuController', ['$scope', '$window', ($scope, $window) => {
    parentCtrl = () => {
      return this.parentCtrl;
    }
    url = () => {
      console.log('{{"urls.eshelf" | translate}}' + '/account');
      let url = '{{"urls.eshelf" | translate}}' + '/account';
      return url;
    }
  }])
  .component('prmLibraryCardMenuAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'customLibraryCardMenuController',
    templateUrl: 'custom/' + viewName + '/html/library_card_menu.html'
  });

let app = angular.module('viewCustom', ['angularLoad', 'customActions', 'customLibraryCardMenu']);

app.component(prmLogoAfterConfig.name, prmLogoAfterConfig.config)
   .component(prmExploreMainAfterConfig.name, prmExploreMainAfterConfig.config)
   .component(prmSearchResultAvailabilityLineAfterConfig.name, prmSearchResultAvailabilityLineAfterConfig.config)
   .component(prmNoSearchResultAfterConfig.name, prmNoSearchResultAfterConfig.config)

app.constant(customActionsConstant.name, customActionsConstant.config)
