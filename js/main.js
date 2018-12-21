import '@orbis-cascade/primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-libraryh3lp-widget';
import 'primo-explore-nyu-eshelf';
import 'primo-explore-search-bar-sub-menu';
import 'primo-explore-google-analytics';
import './customLogin';
import './customRequests';

import { customActionsConfig } from './customActions';
import { customLibraryCardMenuItemsConfig } from './customLibraryCardMenu';
import { clickableLogoLinkConfig } from './clickableLogoToAnyLink';
import { libraryh3lpWidgetConfig } from './libraryh3lpWidget';
import { nyuEshelfConfig } from './nyuEshelf';
import { searchBarSubMenuItemsConfig } from './searchBarSubMenu';
import { googleAnalyticsConfig } from './googleAnalyticsConfig';
import { customLoginConfig } from './customLoginConfig';
import { customRequestsConfig } from './customRequestsConfig';

let app = angular.module('viewCustom', [
                                        'angularLoad',
                                        'customActions',
                                        'customLibraryCardMenu',
                                        'clickableLogoToAnyLink',
                                        'libraryh3lpWidget',
                                        'nyuEshelf',
                                        'searchBarSubMenu',
                                        'googleAnalytics',
                                        'customLoginService',
                                        'customRequests',
                                      ]);

app
  .constant(customLibraryCardMenuItemsConfig.name, customLibraryCardMenuItemsConfig.config)
  .constant(clickableLogoLinkConfig.name, clickableLogoLinkConfig.config)
  .constant(libraryh3lpWidgetConfig.name, libraryh3lpWidgetConfig.config)
  .constant(nyuEshelfConfig.name, nyuEshelfConfig.config)
  .constant(searchBarSubMenuItemsConfig.name, searchBarSubMenuItemsConfig.config)
  .constant(googleAnalyticsConfig.name, googleAnalyticsConfig.config)
  .constant(customLoginConfig.name, customLoginConfig.config)
  .constant(customRequestsConfig.name, customRequestsConfig.config)
  .component('prmActionListAfter', {
    template: customActionsConfig.template
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
    template: `<custom-login></custom-login>`
  })
  .component('prmLocationItemAfter', {
    template: `<custom-requests></custom-requests>`,
    controller: ['$element', function($element) {
      const ctrl = this;
      ctrl.$postLink = () => {
        const $target = $element.parent().query('div.md-list-item-text');
        const $el = $element.detach();
        $target.append($el);
        $element.addClass('layout-align-center-center layout-row');
      };
    }]
  })
  .component('prmLocationItemsAfter', {
    template: `
    <custom-requests-handler></custom-requests-handler>
    <div>
      <p>
        <prm-icon style="z-index:1" icon-type="svg" svg-icon-set="action" icon-definition="ic_help_24px"></prm-icon>
        <span>Request E-ZBorrow: Get item from one of our partner libraries in 3-6 days. Checkout period is 12 weeks, with no renewals.</span>
      </p>
      <p>
        <prm-icon style="z-index:1" icon-type="svg" svg-icon-set="action" icon-definition="ic_help_24px"></prm-icon>
        <span>Request ILL: Request a loan of this item via Interlibrary
          Loan. Most requests arrive within two weeks. Due dates and renewals are determined by the lending library.
          Article/chapter requests are typically delivered electronically in 3-5 days.
        </span>
      </p>
    </div>
    `
  })

app.run(runBlock);

runBlock.$inject = [
  'gaInjectionService',
  'nyuEshelfService'
];

function runBlock(gaInjectionService, nyuEshelfService) {
  gaInjectionService.injectGACode();
  nyuEshelfService.initEshelf();
}