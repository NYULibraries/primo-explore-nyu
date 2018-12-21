import '@orbis-cascade/primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-libraryh3lp-widget';
import 'primo-explore-nyu-eshelf';
import 'primo-explore-search-bar-sub-menu';
import 'primo-explore-google-analytics';
import './customLogin';

import { customActionsConfig } from './customActions';
import { customLibraryCardMenuItemsConfig } from './customLibraryCardMenu';
import { clickableLogoLinkConfig } from './clickableLogoToAnyLink';
import { libraryh3lpWidgetConfig } from './libraryh3lpWidget';
import { nyuEshelfConfig } from './nyuEshelf';
import { searchBarSubMenuItemsConfig } from './searchBarSubMenu';
import { googleAnalyticsConfig } from './googleAnalyticsConfig';

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
                                      ]);

app
  .constant(customLibraryCardMenuItemsConfig.name, customLibraryCardMenuItemsConfig.config)
  .constant(clickableLogoLinkConfig.name, clickableLogoLinkConfig.config)
  .constant(libraryh3lpWidgetConfig.name, libraryh3lpWidgetConfig.config)
  .constant(nyuEshelfConfig.name, nyuEshelfConfig.config)
  .constant(searchBarSubMenuItemsConfig.name, searchBarSubMenuItemsConfig.config)
  .constant(googleAnalyticsConfig.name, googleAnalyticsConfig.config)
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

app
  .config(['$httpProvider', function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Enable passing of cookies for CORS calls
    //Note: CORS will absolutely not work without this
    $httpProvider.defaults.withCredentials = true;
    //Remove the header containing XMLHttpRequest used to identify ajax call
    //that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])
  .constant('customRequestsConfig', {
    baseUrls: {
      ezborrow: 'http://dev.login.library.nyu.edu/ezborrow/nyu',
      ill: 'http://dev.ill.library.nyu.edu/illiad/illiad.dll/OpenURL',
    },
    values: {
      authorizedStatuses: {
        ezborrow: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
        ill: ["30", "31", "32", "34", "35", "37", "50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82"]
      },
      unavailablePatterns: [
        /Requested/g,
        /^\d{2}\/\d{2}\/\d{2}/g, // starts with dd/dd/dd
        'Requested',
        'Billed as Lost',
        'Claimed Returned',
        'In Processing',
        'In Transit',
        'On Hold',
        'Request ILL',
        'On Order',
      ]
    },
    linkGenerators: {
      ezborrow: ({ base, item }) => {
        const title = item.pnx.addata.btitle ? item.pnx.addata.btitle[0] : '';
        const author = item.pnx.addata.au ? item.pnx.addata.au[0] : '';
        const ti = encodeURIComponent(`ti=${title}`);
        const au = encodeURIComponent(`au=${author}`);
        return `${base}?query=${ti}+and+${au}`;
      },
      ill: ({ base, item }) => `${base}?${item.delivery.GetIt2.link.match(/resolve?(.*)/)}`
    },
    linkText: {
      ezborrow: 'Request E-ZBorrow',
      ill: 'Request ILL',
    },
    showLinks: {
      ezborrow: ({ user, config, item }) => {
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        const borStatus = user && user['bor-status'];
        return isBook && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
      },
      ill: ({ user, item, config }) => {
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        const borStatus = user && user['bor-status'];
        const ezborrow = isBook && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
        return !ezborrow && config.values.authorizedStatuses.ill.indexOf(borStatus) > -1
      },
    },
    hideDefault: ({ items, config }) => {
      const hasPattern = (patterns, target) => patterns.some(str => target.match(new RegExp(str)));
      const checkIsAvailable = item => {
        const [circulationStatus, ...otherStatusFields] = item.itemFields;
        return !hasPattern(config.values.unavailablePatterns, circulationStatus);
      };
      const checkAreItemsUnique = items => items.some((item, _i, items) => item._additionalData.itemdescription !== items[0]._additionalData.itemdescription);

      const availabilityStatuses = items.map(checkIsAvailable);
      const itemsAreUnique = checkAreItemsUnique(items);
      const allUnavailable = availabilityStatuses.every(status => status === false);

      return availabilityStatuses.map(isAvailable => allUnavailable || (itemsAreUnique && !isAvailable));
    },
    hideCustom: ({ items, config }) => config.hideDefault({ items, config }).map(boolean => !boolean),
    links: ['ezborrow', 'ill'],
    prmLocationItemsAfterTemplate: `
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
  .service('customRequestsConfigService', ['customRequestsConfig', function (config) {
    return config ? config : console.warn('the constant customRequestsConfig is not defined');
  }])
  .component('prmLocationItemAfter', {
    controller: prmLocationItemAfterController,
    bindings: {
      parentCtrl: '<',
    },
    template: `
      <div layout="row" layout-align="center center">
        <div layout="row" layout-align="center center" ng-repeat="link in $ctrl.links">
          <button class="button-as-link md-button md-primoExplore-theme md-ink-ripple" type="button" ng-click="$ctrl.open(link.href)"
            aria-label="Type"><span>{{ link.label }}</span>
          </button>
          <div class="skewed-divider" ng-if="!$last"></div>
        </div>
        <div layout="row" layout-align="center center" ng-if="!$ctrl.loggedIn">
          <div>
            <button class="button-as-link md-button md-primoExplore-theme md-ink-ripple" type="button" ng-click="$ctrl.handleLogin($event)"
              aria-label="Type"><span>Login for request options</span>
            </button>
          </div>
        </div>

        <span ng-if="$ctrl.loggedIn && !$ctrl.user && !$ctrl.userFailure">Retrieving request options...</span>
        <span ng-if="$ctrl.userFailure">Unable to retrieve request options</span>
        <span ng-if="$ctrl.user && $ctrl.links && $ctrl.links.length === 0">Request not available</span>
      </div>
    `
  })
  .component('prmLocationItemsAfter', {
    controller: prmLocationItemsAfterController,
    bindings: {
      parentCtrl: '<'
    }
  })
  .service('customRequestService', function () {
    const svc = this;
    svc.state = {}
    return ({
      setState: newState => {
        svc.state = angular.merge({}, svc.state, newState);
        return svc.state;
      },
      getState: () => svc.state,
    });
  });

prmLocationItemsAfterController.$inject = ['customRequestsConfigService', '$element', 'customLoginService', 'customRequestService', '$compile', '$scope'];
function prmLocationItemsAfterController(config, $element, customLoginService, customRequestService, $compile, $scope) {
const ctrl = this;
  const parentCtrl = ctrl.parentCtrl;

  ctrl.hideRequest = idx => {
    const $el = $element.parent().queryAll('.md-list-item-text')[idx];
    $el ? $el.children().eq(2).css({ display: 'none' }) : null;
  }

  ctrl.hideCustomRequest = idx => {
    const $el = $element.parent().queryAll('prm-location-item-after')[idx]
    $el ? $el.css({ display: 'none' }) : null;
  }

  ctrl.runAvailabilityCheck = () => {
    const loggedIn = !parentCtrl.userSessionManagerService.isGuest();
    customRequestService.setState({ loggedIn });

    if (loggedIn) {
      return customLoginService.fetchPDSUser().then(user => {
        customRequestService.setState({ user });
        const links = config.links.reduce((arr, link) => {
          const show = config.showLinks[link]({
            config,
            user: ctrl.user,
            item: parentCtrl.item
          });

          if (show) {
            return arr.concat({
              label: config.linkText[link],
              href: config.linkGenerators[link]({
                base: config.baseUrls[link],
                item: parentCtrl.item,
              })
            });
          } else {
            return arr;
          }
        }, []);

        customRequestService.setState({ links });
      })
      .catch(err => {
        console.error(err);
        customRequestService.setState({ userFailure: true })
      });
    } else {
      return Promise.resolve(undefined)
    }
  }

  ctrl.$doCheck = () => {
    if (parentCtrl.currLoc === undefined) return;
    // manual check to see if items have changed
    if (parentCtrl.currLoc.items !== ctrl.trackedItems) {
      ctrl.trackedItems = parentCtrl.currLoc.items;
      ctrl.runAvailabilityCheck().then(() => {
        config.hideDefault({ items: ctrl.trackedItems, config }).forEach((toHide, idx) => toHide ? ctrl.hideRequest(idx) : null);
        config.hideCustom({ items: ctrl.trackedItems, config }).forEach((toHide, idx) => toHide ? ctrl.hideCustomRequest(idx) : null)
        ctrl.hasCheckedReveal = false;
      });
    }
  };

  ctrl.$onInit = () => {
    $element.append($compile(config.prmLocationItemsAfterTemplate)($scope));
  }
}

prmLocationItemAfterController.$inject = ['$element', '$window', '$scope', 'customRequestService', 'customLoginService']
function prmLocationItemAfterController($element, $window, $scope, customRequestService, customLoginService) {
  const ctrl = this;

  ctrl.handleLogin = function (event) {
    customLoginService.login();
    event.stopPropagation();
  }

  ctrl.open = (href) => $window.open(href)

  ctrl.refreshAvailability = () => {
    const { loggedIn } = customRequestService.getState();
    Object.assign(ctrl, { loggedIn });

    if (ctrl.loggedIn) {
      $scope.$applyAsync(() => {
        const { user, userFailure, links } = customRequestService.getState();
        Object.assign(ctrl, { user, userFailure, links });
      });
    }
  }

  ctrl.$postLink = () => {
    const $target = $element.parent().query('div.md-list-item-text');
    const $el = $element.detach();
    $target.append($el);
    $element.addClass('layout-align-center-center layout-row');
  };

  ctrl.$doCheck = () => {
    if (ctrl.serviceState !== customRequestService.getState()) {
      ctrl.refreshAvailability();
      ctrl.serviceState = customRequestService.getState();
    }
  }
}

app.run(runBlock);

runBlock.$inject = [
  'gaInjectionService',
  'nyuEshelfService'
];

function runBlock(gaInjectionService, nyuEshelfService) {
  gaInjectionService.injectGACode();
  nyuEshelfService.initEshelf();
}