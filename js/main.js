import { viewName } from './viewName';
import { prmLogoAfterConfig } from './prmLogoAfter';
import { prmBriefResultContainerAfterConfig } from './prmBriefResultContainerAfter';
import { chatWidgetConfig } from './chatWidget';

let app = angular.module('viewCustom', ['angularLoad']);

app.component(prmLogoAfterConfig.name, prmLogoAfterConfig.config)
   .component(prmBriefResultContainerAfterConfig.name, prmBriefResultContainerAfterConfig.config)
   .component(chatWidgetConfig.name, chatWidgetConfig.config)
  //  .controller('prmBriefResults', function ($scope, $controller) {
  //   'use strict';
  //   $controller('prmBriefResults', {$scope: $scope});
  //   $scope.handleDetails=function(){}
  // });
