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

requestUnavailableController.$inject = [];

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
  .constant('requestUnavailableConfig', {
    ezBorrowUrl: 'http://login.library.nyu.edu/ezborrow/nyu',
    illiadUrl: 'http://ill.library.nyu.edu',
    authorizedStatuses: {
      ezBorrow: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
      ill: ["30", "31", "32", "34", "35", "37", "50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82"]
    }
  })
  .component('prmLocationItemAfter', {
    controller: requestUnavailableController,
    bindings: {
      parentCtrl: '<',
    },
    require: {
      primoExploreCtrl: '^primoExplore'
    },
    template: `
      <div class="md-list-item-text">
        <span ng-if="$ctrl.unavailable && !$ctrl.loggedIn && !$ctrl.user && !$ctrl.userFailure">Retrieving request options...</span>
        <span ng-if="$ctrl.unavailable && $ctrl.userFailure">Unable to retrieve request options</span>
        <a ng-if="$ctrl.unavailable && $ctrl.ezBorrowEligible" href="{{ $ctrl.ezBorrowLink }}" target="_blank">Request E-ZBorrow </a>
        <a ng-if="$ctrl.unavailable && !$ctrl.ezBorrowEligible && $ctrl.illEligible" href="{{ $ctrl.illLink }}" target="_blank">Request ILL</a>
        <a ng-if="$ctrl.loggedIn" ng-click="$ctrl.handleLogin($event)">Login to see request options</a>
      </div>
    `
  })
  .component('prmLocationItemsAfter', {
    controller: checkUnavailabilityController,
    bindings: {
      parentCtrl: '<',
    }
  })
  // Injects prmAuthentication's handleLogin as a global service
  .service('customLoginService', ['$window', '$http', function($window, $http) {
    const svc = this;
    svc.store = {
      user: undefined,
    }

    svc.fetchPDSUser = (store) => {
      // source: https://gist.github.com/rendro/525bbbf85e84fa9042c2
      const cookies = $window.document.cookie
        .split(';')
        .reduce((res, c) => {
          const [key, val] = c.trim().split('=').map(decodeURIComponent)
          const allNumbers = str => /^\d+$/.test(str);
          try {
            return Object.assign(res, { [key]: allNumbers(val) ? val : JSON.parse(val) })
          } catch (e) {
            return Object.assign(res, { [key]: val })
          }
        }, {});

      cookies.PDS_HANDLE = '13122018162114816496745208944470';
      return $http.get(`https://pdsdev.library.nyu.edu/pds?func=get-attribute&attribute=bor_info&pds_handle=${cookies.PDS_HANDLE}`)
        .then(response => {
          const xml = response.data;
          const getXMLProp = prop => (new $window.DOMParser).parseFromString(xml, 'text/xml').querySelector(prop).textContent
          return ['id', 'bor-status'].reduce((res, prop) => Object.assign(res, {
            [prop]: getXMLProp(prop)
          }), {});
        })
    }

    return {
      login: () => {},
      logout: () => {},
      fetchPDSUser: () => svc.store.user ? Promise.resolve(svc.store.user) : svc.fetchPDSUser(svc.store),
    };
  }])
  .service('checkUnavailableService', function() {
    const svc = this;
    svc.store = {
      status: undefined,
    };

    svc.isUnavailable = items => items.every(item => {
      const hasPattern = (patterns, target) => patterns.some(str => target.match(new RegExp(str)))
      const [circulationStatus, ...otherStatusFields] = item.itemFields;
      return hasPattern([
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
    });

    return {
      checkUnavailable(items) {
        if (items !== undefined) {
          svc.status = svc.isUnavailable(items) ? 'unavailable' : 'available';
        }
        return svc.status === 'unavailable';
      },
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
    customLoginService.login = ctrl.parentCtrl.handleLogin.bind(ctrl.parentCtrl);
    customLoginService.logout = ctrl.parentCtrl.handleLogout.bind(ctrl.parentCtrl);
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

checkUnavailabilityController.$inject = ['requestUnavailableConfig', 'checkUnavailableService'];
function checkUnavailabilityController(config, checkUnavailableService) {
  const ctrl = this;
  const parentCtrl = ctrl.parentCtrl;

  ctrl.$doCheck = function () {
    checkUnavailableService.checkUnavailable(parentCtrl.currLoc ? parentCtrl.currLoc.items : []);
  }
}

requestUnavailableController.$inject = ['requestUnavailableConfig', 'customLoginService', 'checkUnavailableService', '$window']
function requestUnavailableController(config, customLoginService, checkUnavailableService, $window) {
  const ctrl = this;
  const parentCtrl = ctrl.parentCtrl;

  ctrl.EZBorrowLinkGenerator = (base, title, author) => {
    const ti = $window.encodeURIComponent(`ti=${title}`);
    const au = $window.encodeURIComponent(`au=${author}`);
    return `${base}?query=${ti}+and+${au}`;
  }

  ctrl.illLinkGenerator = (base, openurl) => `${base}/illiad/illiad.dll/OpenURL?${$window.encodeURIComponent(openurl)}`

  ctrl.revealDefaultRequestOptions = () => {
    angular.element(document.querySelector('prm-location-items .md-list-item-text div:nth-child(3)')).css({
      display: 'block'
    });
  }

  ctrl.hideDefaultRequestOptions = () => {
    angular.element(document.querySelector('prm-location-items .md-list-item-text div:nth-child(3)')).css({
      display: 'none'
    });
  }

  ctrl.$onInit = function() {
    ctrl.title = parentCtrl.item.pnx.addata.btitle ? parentCtrl.item.pnx.addata.btitle[0] : '';
    ctrl.author = parentCtrl.item.pnx.addata.au ? parentCtrl.item.pnx.addata.au[0] : '';
    ctrl.ezBorrowLink = ctrl.EZBorrowLinkGenerator(config.ezBorrowUrl, ctrl.title, ctrl.author);
    ctrl.handleLogin = function(event) {
      customLoginService.login();
      event.stopPropagation();
    }

    ctrl.loggedIn = !parentCtrl.userSessionManagerService.isGuest();
    ctrl.unavailable = checkUnavailableService.checkUnavailable();

    if (ctrl.loggedIn) {
      customLoginService.fetchPDSUser()
        .then(user => {
          ctrl.user = user;

          const isBook = ['BOOK', 'BOOKS'].some(type => parentCtrl.item.pnx.addata.ristype.indexOf(type) > -1);
          const borStatus = ctrl.user && ctrl.user['bor-status'];
          ctrl.illEligible = ctrl.unavailable && config.authorizedStatuses.ill.indexOf(borStatus) > -1;
          ctrl.ezBorrowEligible = isBook && ctrl.unavailable && config.authorizedStatuses.ezBorrow.indexOf(borStatus) > -1;
        },
        rejectedResponse => {
          console.error(rejectedResponse);
          ctrl.userFailure = true;
        })
    }
  }

  ctrl.$doCheck = function() {
    ctrl.unavailable = checkUnavailableService.checkUnavailable();
    console.log(ctrl.unavailable, 'unavailable?')
    if (!ctrl.unavailable) {
      ctrl.revealDefaultRequestOptions();
    } else {
      ctrl.hideDefaultRequestOptions();
    }
  }
}