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
    $el ? $el.children().eq(2).css({
      display: 'none'
    }) : null;
  }

  ctrl.hideCustomRequest = idx => {
    const $el = $element.parent().queryAll('prm-location-item-after')[idx]
    $el ? $el.css({
      display: 'none'
    }) : null;
  }

  ctrl.runAvailabilityCheck = () => {
    const loggedIn = !parentCtrl.userSessionManagerService.isGuest();
    customRequestService.setState({
      loggedIn
    });

    if (loggedIn) {
      return customLoginService.fetchPDSUser().then(user => {
          customRequestService.setState({
            user
          });
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

          customRequestService.setState({
            links
          });
        })
        .catch(err => {
          console.error(err);
          customRequestService.setState({
            userFailure: true
          })
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
        config.hideDefault({
          items: ctrl.trackedItems,
          config
        }).forEach((toHide, idx) => toHide ? ctrl.hideRequest(idx) : null);
        config.hideCustom({
          items: ctrl.trackedItems,
          config
        }).forEach((toHide, idx) => toHide ? ctrl.hideCustomRequest(idx) : null)
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
    const {
      loggedIn
    } = customRequestService.getState();
    Object.assign(ctrl, {
      loggedIn
    });

    if (ctrl.loggedIn) {
      $scope.$applyAsync(() => {
        const {
          user,
          userFailure,
          links
        } = customRequestService.getState();
        Object.assign(ctrl, {
          user,
          userFailure,
          links
        });
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