import 'primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-custom-no-search-results';
import 'primo-explore-libraryh3lp-widget';

import { viewName } from './viewName';
import { customActionsConfig } from './customActions';
import { customLibraryCardMenuItemsConfig } from './customLibraryCardMenu';
import { clickableLogoLinkConfig } from './clickableLogoToAnyLink';
import { libraryh3lpWidgetConfig } from './libraryh3lpWidget';

angular
  .module('getitToLinkResolver', [])
  .factory('getitToLinkResolverService', ['getitToLinkResolverConfig', '$filter', function(getitToLinkResolverConfig, $filter) {
    return {
      translate: function(original) {
        return original.replace(/\{(.+)\}/g, (match, p1) => $filter('translate')(p1));
      },
      config: {
        linkField: getitToLinkResolverConfig.linkField,
        linkText: getitToLinkResolverConfig.linkText,
        iconBefore: getitToLinkResolverConfig.iconBefore,
        iconAfter: getitToLinkResolverConfig.iconAfter,
        showInBriefResults: getitToLinkResolverConfig.showInBriefResults
      }
    }
  }])
  .controller('getitToLinkResolverFullController', ['getitToLinkResolverService', '$scope', function(getitToLinkResolverService, $scope) {
    this.$onInit = function() {
      $scope.config = getitToLinkResolverService.config;
    }
    $scope.getitLink = this.parentCtrl.item.delivery.link.filter(link => link["displayLabel"] == getitToLinkResolverService.config.linkField)[0]["linkURL"];
    $scope.translate = (original) => getitToLinkResolverService.translate(original);
  }])
  .controller('getitToLinkResolverBriefController', ['getitToLinkResolverService', '$scope', function(getitToLinkResolverService, $scope) {
    this.$onInit = function() {
      $scope.config = getitToLinkResolverService.config;
    }
    $scope.getitLink = this.parentCtrl.result.link[getitToLinkResolverService.config.linkField];
    $scope.translate = (original) => getitToLinkResolverService.translate(original);
  }])
  .component('prmOpacAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'getitToLinkResolverFullController',
    template: '<a ng-href="{{ getitLink }}" class="arrow-link check-avail-link check-avail-link-full" target="_blank">'+
              '<prm-icon style="z-index:1" icon-type="svg" svg-icon-set="{{config.iconBefore.set}}" icon-definition="{{config.iconBefore.icon}}"></prm-icon>'+
              ' {{ translate(config.linkText) }} '+
              '<prm-icon style="z-index:1" icon-type="svg" svg-icon-set="{{config.iconAfter.set}}" icon-definition="{{config.iconAfter.icon}}"></prm-icon>'+
              '<prm-icon link-arrow="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"></prm-icon>'+
              '</a> '
  })
  .component('prmSearchResultAvailabilityLineAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'getitToLinkResolverBriefController',
    template: '<a ng-if="config.showInBriefResults" ng-href="{{ getitLink }}" class="arrow-link check-avail-link check-avail-link-brief" target="_blank">'+
              '<prm-icon style="z-index:1" icon-type="svg" svg-icon-set="{{config.iconBefore.set}}" icon-definition="{{config.iconBefore.icon}}"></prm-icon>'+
              ' {{ translate(config.linkText) }} '+
              '<prm-icon style="z-index:1" icon-type="svg" svg-icon-set="{{config.iconAfter.set}}" icon-definition="{{config.iconAfter.icon}}"></prm-icon>'+
              '<prm-icon link-arrow="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"></prm-icon>'+
              '</a> '
  });

let app = angular.module('viewCustom', [
                                        'angularLoad',
                                        'customActions',
                                        'customLibraryCardMenu',
                                        'clickableLogoToAnyLink',
                                        'customNoSearchResults',
                                        'libraryh3lpWidget',
                                        'getitToLinkResolver'
                                      ]);

app
  .constant(customActionsConfig.name, customActionsConfig.config)
  .constant(customLibraryCardMenuItemsConfig.name, customLibraryCardMenuItemsConfig.config)
  .constant(clickableLogoLinkConfig.name, clickableLogoLinkConfig.config)
  .constant(libraryh3lpWidgetConfig.name, libraryh3lpWidgetConfig.config)
  .value('customNoSearchResultsTemplateUrl', 'custom/' + viewName + '/html/noSearchResults.html')


app.constant('getitToLinkResolverConfig', {
  linkField: 'lln10',
  linkText: '{fulldisplay.availabilty.check_holdings}',
  iconBefore: {
    set: 'primo-ui',
    icon: 'book-open'
  },
  iconAfter: {
    set: 'primo-ui',
    icon: 'open-in-new'
  },
  showInBriefResults: true
});
