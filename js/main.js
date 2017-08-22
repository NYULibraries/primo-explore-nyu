import 'primo-explore-custom-actions';

import { viewName } from './viewName';
import { prmLogoAfterConfig } from './prmLogoAfter';
import { prmExploreMainAfterConfig } from './prmExploreMainAfter';
import { prmSearchResultAvailabilityLineAfterConfig } from './prmSearchResultAvailabilityLineAfter';
import { prmNoSearchResultAfterConfig } from './prmNoSearchResultAfter';
import { customActionsConstant } from './customActions'

let app = angular.module('viewCustom', ['angularLoad', 'customActions']);

app.component(prmLogoAfterConfig.name, prmLogoAfterConfig.config)
   .component(prmExploreMainAfterConfig.name, prmExploreMainAfterConfig.config)
   .component(prmSearchResultAvailabilityLineAfterConfig.name, prmSearchResultAvailabilityLineAfterConfig.config)
   .component(prmNoSearchResultAfterConfig.name, prmNoSearchResultAfterConfig.config)
  //  .controller('prmBriefResults', function ($scope, $controller) {
  //   'use strict';
  //   $controller('prmBriefResults', {$scope: $scope});
  //   $scope.handleDetails=function(){}
  // });

app.constant(customActionsConstant.name, customActionsConstant.config)
