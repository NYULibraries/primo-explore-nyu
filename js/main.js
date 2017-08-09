import 'primo-explore-custom-actions';

import { viewName } from './viewName';
import { prmLogoAfterConfig } from './prmLogoAfter';
import { prmBriefResultContainerAfterConfig } from './prmBriefResultContainerAfter';
import { chatWidgetConfig } from './chatWidget';
import { checkAvailLinkConfig } from './checkAvailLink';
import { customActionsConstant } from './constants/customActionsConstant'

let app = angular.module('viewCustom', ['angularLoad', 'customActions']);

app.component(prmLogoAfterConfig.name, prmLogoAfterConfig.config)
   .component(prmBriefResultContainerAfterConfig.name, prmBriefResultContainerAfterConfig.config)
   .component(chatWidgetConfig.name, chatWidgetConfig.config)
   .component(checkAvailLinkConfig.name, checkAvailLinkConfig.config)
  //  .controller('prmBriefResults', function ($scope, $controller) {
  //   'use strict';
  //   $controller('prmBriefResults', {$scope: $scope});
  //   $scope.handleDetails=function(){}
  // });

app.constant(customActionsConstant.name, customActionsConstant.definition)
