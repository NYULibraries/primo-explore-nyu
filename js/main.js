import * as Sentry from '@sentry/browser';

import '@orbis-cascade/primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-libraryh3lp-widget';
import 'primo-explore-getit-to-link-resolver';
import 'primo-explore-nyu-eshelf';
import 'primo-explore-search-bar-sub-menu';
import 'primo-explore-google-analytics';
import 'primo-explore-custom-requests';
import 'primo-explore-custom-login';

import customActionsConfig from './customActions';
import customLibraryCardMenuItemsConfig from './customLibraryCardMenu';
import clickableLogoLinkConfig from './clickableLogoToAnyLink';
import libraryh3lpWidgetConfig from './libraryh3lpWidget';
import getitToLinkResolverConfig from './getitToLinkResolver';
import nyuEshelfConfig from './nyuEshelf';
import searchBarSubMenuItemsConfig from './searchBarSubMenu';
import googleAnalyticsConfig from './googleAnalyticsConfig';
import customRequestsConfig from './customRequestsConfig';
import customLoginConfig from './customLoginConfig';

import customRequestsRequestInformationTemplate from '../html/custom_requests_request_information.html';

let app = angular.module('viewCustom', [
  'angularLoad',
  'customActions',
  'customLibraryCardMenu',
  'clickableLogoToAnyLink',
  'libraryh3lpWidget',
  'getitToLinkResolver',
  'nyuEshelf',
  'searchBarSubMenu',
  'googleAnalytics',
  'primoExploreCustomLogin',
  'primoExploreCustomRequests',
]);

app
  .constant(customLibraryCardMenuItemsConfig.name, customLibraryCardMenuItemsConfig.config)
  .constant(clickableLogoLinkConfig.name, clickableLogoLinkConfig.config)
  .constant(libraryh3lpWidgetConfig.name, libraryh3lpWidgetConfig.config)
  .constant(getitToLinkResolverConfig.name, getitToLinkResolverConfig.config)
  .constant(nyuEshelfConfig.name, nyuEshelfConfig.config)
  .constant(searchBarSubMenuItemsConfig.name, searchBarSubMenuItemsConfig.config)
  .constant(googleAnalyticsConfig.name, googleAnalyticsConfig.config)
  .constant(customRequestsConfig.name, customRequestsConfig.config)
  .constant(customLoginConfig.name, customLoginConfig.config)
  .component('prmActionListAfter', {
    template: customActionsConfig.template
  })
  .component('prmFullViewServiceContainerAfter', {
    template: '<getit-to-link-resolver-full></getit-to-link-resolver-full>'
  })
  .component('prmSearchResultAvailabilityLineAfter', {
    template: '<nyu-eshelf></nyu-eshelf>'
  })
  .component('prmSearchBookmarkFilterAfter', {
    template: '<nyu-eshelf-toolbar></nyu-eshelf-toolbar>'
  })
  .component('prmSearchBarAfter', {
    template: '<search-bar-sub-menu></search-bar-sub-menu>'
  })
  .component('prmAuthenticationAfter', {
    template: `<primo-explore-custom-login></primo-explore-custom-login>`
  })
  .component('prmLocationItemAfter', {
    template: `<primo-explore-custom-requests layout="row" layout-align="end center" layout-wrap></primo-explore-custom-requests>`,
    controller: ['$element', function($element) {
      const ctrl = this;
      ctrl.$postLink = () => {
        const $target = $element.parent().query('div.md-list-item-text');
        const $el = $element.detach();
        $target.append($el);
        $element.addClass('layout-row flex-sm-30 flex-xs-100');
      };
    }]
  })
  .component('prmLocationItemsAfter', {
    template: `${customRequestsRequestInformationTemplate}`
  });

app.run(runBlock);

runBlock.$inject = ['gaInjectionService', 'nyuEshelfService'];
function runBlock(gaInjectionService, nyuEshelfService) {
  Sentry.init({
    dsn: 'https://7527da50c7da4590ae8dcd1d6b56ee55@sentry.io/1394419'
  });
  gaInjectionService.injectGACode();
  nyuEshelfService.initEshelf();

}