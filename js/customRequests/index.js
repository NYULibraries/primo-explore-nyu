import prmLocationItemAfterController from './controllers/prmLocationItemAfterController'
import prmLocationItemsAfterController from './controllers/prmLocationItemsAfterController'

angular
  .module('customRequests', [])
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
  .service('customRequestsConfigService', ['customRequestsConfig', function (config) {
    return config ? config : console.warn('the constant customRequestsConfig is not defined');
  }])
  .component('customRequests', {
    controller: prmLocationItemAfterController,
    require: {
      parentCtrl: '^prmLocationItemAfter'
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