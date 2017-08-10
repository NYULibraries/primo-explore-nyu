import 'primo-explore-custom-actions';

import { viewName } from './viewName';
import { prmLogoAfterConfig } from './prmLogoAfter';
import { prmBriefResultContainerAfterConfig } from './prmBriefResultContainerAfter';
import { prmExploreMainAfterConfig } from './prmExploreMainAfter';
import { prmSearchResultAvailabilityLineAfterConfig } from './prmSearchResultAvailabilityLineAfter';
import { customActionsConstant } from './customActions'

let app = angular.module('viewCustom', ['angularLoad', 'customActions']);

app.component(prmLogoAfterConfig.name, prmLogoAfterConfig.config)
   .component(prmBriefResultContainerAfterConfig.name, prmBriefResultContainerAfterConfig.config)
   .component(prmExploreMainAfterConfig.name, prmExploreMainAfterConfig.config)
   .component(prmSearchResultAvailabilityLineAfterConfig.name, prmSearchResultAvailabilityLineAfterConfig.config)
  //  .controller('prmBriefResults', function ($scope, $controller) {
  //   'use strict';
  //   $controller('prmBriefResults', {$scope: $scope});
  //   $scope.handleDetails=function(){}
  // });

app.constant(customActionsConstant.name, customActionsConstant.config)
