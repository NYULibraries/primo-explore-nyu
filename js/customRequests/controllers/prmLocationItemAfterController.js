prmLocationItemAfterController.$inject = ['$window', '$scope', 'customRequestService', 'customLoginService']
export default function prmLocationItemAfterController($window, $scope, customRequestService, customLoginService) {
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

  ctrl.$doCheck = () => {
    if (ctrl.serviceState !== customRequestService.getState()) {
      ctrl.refreshAvailability();
      ctrl.serviceState = customRequestService.getState();
    }
  }
}