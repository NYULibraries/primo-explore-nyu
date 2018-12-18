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

prmLocationItemAfterController.$inject = [];

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
  .constant('customRequestsConfig', {
    baseUrls: {
      ezborrow: 'http://login.library.nyu.edu/ezborrow/nyu',
      ill: 'http://ill.library.nyu.edu/illiad/illiad.dll/OpenURL',
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
      ill: ({ base, item }) => `${base}?${encodeURIComponent(item.link.lln10)}`
    },
    linkText: {
      ezborrow: 'Request E-ZBorrow',
      ill: 'Request ILL',
    },
    links: [
      {
        type: 'ezborrow',
        show: ({ user, item, config, allUnavailable }) => {
          const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
          const borStatus = user && user['bor-status'];
          return isBook && allUnavailable && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
        },
      },
      {
        type: 'ill',
        show: ({ user, item, config, allUnavailable }) => {
          const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
          const borStatus = user && user['bor-status'];
          const ezborrow = isBook && allUnavailable && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
          return !ezborrow && allUnavailable && config.values.authorizedStatuses.ill.indexOf(borStatus) > -1
        },
      }
    ]
  })
  .service('customRequestsService', ['customRequestsConfig', function(config) {
    return config ? config : console.warn('the constant customRequestsConfig is not defined');
  }])
  .component('prmLocationItemAfter', {
    controller: prmLocationItemAfterController,
    bindings: {
      parentCtrl: '<',
    },
    template: `
      <div class="md-list-item-text" ng-if="$ctrl.allUnavailable">
        <span ng-if="$ctrl.showLoadingText">Retrieving request options...</span>
        <span ng-if="$ctrl.showFailureText">Unable to retrieve request options</span>
        <a ng-if="!$ctrl.loggedIn" ng-click="$ctrl.handleLogin($event)">Login to see request options</a>
        <a ng-repeat="link in $ctrl.links" href="link.href" target="_blank">{{ link.label }}</a>
        </div>
      </div>
    `
  })
  // Injects prmAuthentication's handleLogin as a global service
  .service('customLoginService', ['$window', '$http', function($window, $http) {
    const svc = this;
    svc.store = {
      user: undefined,
      login: undefined,
      logout: undefined,
    }


    svc.fetchPDSUser = (store) => {
      store.user = { id: '123456', 'bor-status': '55'};
      const later = (delay, value) => new Promise((resolve) => setTimeout(resolve, delay, value));
      return later(1000, store.user);
      // return Promise.reject('something went wrong');
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

      return $http.get(`https://pdsdev.library.nyu.edu/pds?func=get-attribute&attribute=bor_info&pds_handle=${cookies.PDS_HANDLE}`, {
        timeout: 6000,
      })
        .then(response => {
          const xml = response.data;
          const getXMLProp = prop => (new $window.DOMParser).parseFromString(xml, 'text/xml').querySelector(prop).textContent
          const user = ['id', 'bor-status'].reduce((res, prop) => Object.assign(res, {
            [prop]: getXMLProp(prop)
          }), {});

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
  .service('availabilityService', function() {
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

    svc.state = {};
    svc.setState = newState => Object.assign(svc.state, newState);

    return {
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

app.run(runBlock);

runBlock.$inject = [
  'gaInjectionService',
  'nyuEshelfService'
];

function runBlock(gaInjectionService, nyuEshelfService) {
  gaInjectionService.injectGACode();
  nyuEshelfService.initEshelf();
}

authenticationController.$inject = ['customLoginService']
function authenticationController(customLoginService) {
  const ctrl = this;
  ctrl.$onInit = function () {
    customLoginService.setLogin(ctrl.parentCtrl.handleLogin.bind(ctrl.parentCtrl));
    customLoginService.setLogout(ctrl.parentCtrl.handleLogout.bind(ctrl.parentCtrl));
  };
}

prmLocationItemAfterController.$inject = ['customRequestsService', 'customLoginService', 'availabilityService', '$window', '$element']
function prmLocationItemAfterController(config, customLoginService, availabilityService, $window, $element) {
  const ctrl = this;
  const parentCtrl = ctrl.parentCtrl;

  ctrl.revealRequest = (idx) => $element.parent().parent().queryAll('.md-list-item-text')[idx].children().eq(2).css({ display: 'block' });

  ctrl.handleLogin = function (event) {
    customLoginService.login();
    event.stopPropagation();
  }

  ctrl.$onInit = () => {
    const availabilities = ctrl.parentCtrl.currLoc.items.map(availabilityService.checkIsAvailable);
    availabilities.forEach((isAvailable, idx) => isAvailable ? ctrl.revealRequest(idx) : null);
    ctrl.allUnavailable = availabilities.every(status => status === false);

    ctrl.loggedIn = !parentCtrl.userSessionManagerService.isGuest();

    if (ctrl.loggedIn) {
      customLoginService.fetchPDSUser()
        .then(user => {
          ctrl.user = user;

          ctrl.links = config.links.reduce((arr, link) => {
            const show = link.show({
              config,
              user: ctrl.user,
              item: parentCtrl.item,
              allUnavailable: ctrl.allUnavailable
            });

            if (show) {
              return arr.concat({
                label: config.linkText[link.type],
                href: config.linkGenerators[link.type]({
                  base: config.baseUrls[link.type],
                  item: parentCtrl.item,
                })
              });
            } else {
              return arr;
            }
          }, []);
        },
        rejectedResponse => {
          console.error(rejectedResponse);
          ctrl.userFailure = true;
        })
    }
  }

  ctrl.$doCheck = () => {
    ctrl.showLoadingText = ctrl.loggedIn && !ctrl.user && !ctrl.userFailure;
    ctrl.showFailureText = ctrl.userFailure;
  };
}