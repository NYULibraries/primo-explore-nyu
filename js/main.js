import '@orbis-cascade/primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-libraryh3lp-widget';
import 'primo-explore-nyu-eshelf';
import 'primo-explore-search-bar-sub-menu';
import 'primo-explore-google-analytics';

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
                                        'googleAnalytics'
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
    pdsUrl: "https://pdsdev.library.nyu.edu/pds",
    pdsUserInfo: {
      queryString: 'func=get-attribute&attribute=bor_info',
      selectors: ['id', 'bor-status'],
    },
    baseUrls: {
      ezborrow: 'http://dev.login.library.nyu.edu/ezborrow/nyu',
      ill: 'http://dev.ill.library.nyu.edu/illiad/illiad.dll/OpenURL',
    },
    values: {
      authorizedStatuses: {
        ezborrow: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
        ill: ["30", "31", "32", "34", "35", "37", "50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82"]
      }
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
      ezborrow: ({ user, item, config, unavailable }) => {
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        const borStatus = user && user['bor-status'];
        return isBook && unavailable && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
      },
      ill: ({ user, item, config, unavailable }) => {
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        const borStatus = user && user['bor-status'];
        const ezborrow = isBook && unavailable && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
        return !ezborrow && unavailable && config.values.authorizedStatuses.ill.indexOf(borStatus) > -1
      },
    },
    links: ['ezborrow', 'ill']
  })
  .service('customRequestsService', ['customRequestsConfig', function (config) {
    return config ? config : console.warn('the constant customRequestsConfig is not defined');
  }])
  .component('prmLocationItemAfter', {
    controller: prmLocationItemAfterController,
    bindings: {
      parentCtrl: '<',
    },
    template: `
      <div layout="row" layout-align="center center" ng-if="$ctrl.unavailable">
        <div layout="row" layout-align="center center" ng-repeat="link in $ctrl.links">
          <button class="button-as-link md-button md-primoExplore-theme md-ink-ripple" type="button" ng-click="$ctrl.open(link.href)"
            aria-label="Type"><span>{{ link.label }}</span>
          </button>
          <div class="skewed-divider" ng-if="!$last"></div>
        </div>
        <div layout="row" layout-align="center center" ng-if="!$ctrl.loggedIn">
          <div>
            <button class="button-as-link md-button md-primoExplore-theme md-ink-ripple" type="button" ng-click="$ctrl.handleLogin($event)"
              aria-label="Type"><span>Login to see request options</span>
            </button>
          </div>
        </div>

        <span ng-if="$ctrl.loggedIn && !$ctrl.user && !$ctrl.userFailure">Retrieving request options...</span>
        <span ng-if="$ctrl.userFailure">Unable to retrieve request options</span>
      </div>
    `
  })
  // Injects prmAuthentication's handleLogin as a global service
  .service('customLoginService', ['$window', '$http', 'customRequestsService', function ($window, $http, config) {
    const svc = this;
    svc.store = {
      user: undefined,
      login: undefined,
      logout: undefined,
    }

    svc.fetchPDSUser = (store) => {
      // source: https://stackoverflow.com/a/21125098/8603212
      const getCookie = function (name) {
        var match = $window.document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
      }

      return $http.get(`${config.pdsUrl}?${config.pdsUserInfo.queryString}&pds_handle=${getCookie('PDS_HANDLE')}`, {
        timeout: 6000
      })
      .then(response => {
        const xml = response.data;
        const getXMLProp = prop => (new $window.DOMParser).parseFromString(xml, 'text/xml').querySelector(prop).textContent
        const user = config.pdsUserInfo.selectors.reduce((res, prop) => Object.assign(res, { [prop]: getXMLProp(prop) }), {});

        store.user = user;
        return user;
      })
    }

    return {
      setLogin: fxn => { svc.store.login = fxn; return fxn; },
      setLogout: fxn => { svc.store.logout = fxn; return fxn; },

      // Written as a function to encapsulate changable login/logout functions
      login: () => svc.store.login(),
      logout: () => svc.store.logout(),
      fetchPDSUser: () => svc.store.user ? Promise.resolve(svc.store.user) : svc.fetchPDSUser(svc.store),
    };
  }])
  .service('availabilityService', function () {
    const svc = this;
    svc.hasPattern = (patterns, target) => patterns.some(str => target.match(new RegExp(str)));
    svc.checkIsAvailable = item => {
      const [circulationStatus, ...otherStatusFields] = item.itemFields;
      return !svc.hasPattern([
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
      ], circulationStatus);
    };
    svc.itemsAreUnique = items => items.some((item, _i, items) => item._additionalData.itemdescription !== items[0]._additionalData.itemdescription);

    svc.state = {};
    svc.setState = newState => Object.assign(svc.state, newState);

    return {
      itemsAreUnique: svc.itemsAreUnique,
      checkIsAvailable: svc.checkIsAvailable,
      getState: () => svc.state,
      setState: svc.setState,
    }
  })
  .component('prmAuthenticationAfter', {
    controller: authenticationController,
    bindings: {
      parentCtrl: '<',
    }
  })

authenticationController.$inject = ['customLoginService']
function authenticationController(customLoginService) {
  const ctrl = this;
  ctrl.$onInit = function () {
    customLoginService.setLogin(ctrl.parentCtrl.handleLogin.bind(ctrl.parentCtrl));
    customLoginService.setLogout(ctrl.parentCtrl.handleLogout.bind(ctrl.parentCtrl));
  };
}

prmLocationItemAfterController.$inject = ['customRequestsService', 'customLoginService', 'availabilityService', '$element', '$window', '$scope']
function prmLocationItemAfterController(config, customLoginService, availabilityService, $element, $window, $scope) {
  const ctrl = this;
  const parentCtrl = ctrl.parentCtrl;

  ctrl.hideRequest = (idx) => {
    const $el = $element.parent().parent().queryAll('.md-list-item-text')[idx];
    $el ? $el.children().eq(2).css({ display: 'none' }) : null;
  }

  ctrl.hideCustomRequests = (idx) => {
    const $el = $element.parent().parent().parent().parent().queryAll('prm-location-item-after')[idx]
    $el ? $el.css({ display: 'none' }) : null;
  }

  ctrl.handleLogin = function (event) {
    customLoginService.login();
    event.stopPropagation();
  }

  ctrl.open = (href) => $window.open(href)

  ctrl.runAvailabilityCheck = () => {
    ctrl.availabilityStatuses = ctrl.parentCtrl.currLoc.items.map(availabilityService.checkIsAvailable);
    ctrl.availabilityStatuses.forEach((isAvailable, idx) => !isAvailable ? ctrl.hideRequest(idx) : null);

    const itemsAreUnique = availabilityService.itemsAreUnique(parentCtrl.currLoc.items);
    const anyUnavailable = ctrl.availabilityStatuses.some(status => status === false);
    const allUnavailable = ctrl.availabilityStatuses.every(status => status === false);
    ctrl.unavailable = allUnavailable || (itemsAreUnique && anyUnavailable);

    ctrl.loggedIn = !parentCtrl.userSessionManagerService.isGuest();

    if (ctrl.loggedIn && ctrl.unavailable) {
      return customLoginService.fetchPDSUser().then(user => {
        $scope.$applyAsync(() => {
          ctrl.user = user;

          ctrl.links = config.links.reduce((arr, link) => {
            const show = config.showLinks[link]({
              config,
              user: ctrl.user,
              item: parentCtrl.item,
              unavailable: ctrl.unavailable
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
        })
      })
      .catch(err => {
        console.error(err);
        ctrl.userFailure = true;
      });
    } else {
      return Promise.resolve(undefined)
    }
  }

  ctrl.$postLink = () => {
    const $target = $element.parent().query('div.md-list-item-text');
    const $el = $element.detach();
    $target.append($el);
    $element.addClass('layout-align-center-center layout-row');

    // ctrl.availabilityStatuses.forEach((isAvailable, idx) => isAvailable ? ctrl.hideCustomRequests(idx) : null)
  };

  ctrl.$doCheck = () => {
    // manual check to see if items have changed
    if (parentCtrl.currLoc.items !== ctrl.trackedItems) {
      ctrl.runAvailabilityCheck().then(() => {
        ctrl.availabilityStatuses.forEach((isAvailable, idx) => isAvailable ? ctrl.hideCustomRequests(idx) : null)
      });
    }
    ctrl.trackedItems = parentCtrl.currLoc.items;
  };
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