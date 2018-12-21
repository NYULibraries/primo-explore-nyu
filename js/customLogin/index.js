angular
  .module('customLoginService', [])
  .constant('customLoginConfig', {
    pdsUrl: "https://pdsdev.library.nyu.edu/pds",
    pdsUserInfo: {
      queryString: 'func=get-attribute&attribute=bor_info',
      selectors: ['id', 'bor-status'],
    },
  })
  .component('prmAuthenticationAfter', {
    controller: authenticationController,
    bindings: {
      parentCtrl: '<',
    }
  })
  // Injects prmAuthentication's handleLogin as a global service
  .service('customLoginService', ['$window', '$http', 'customLoginConfig', function ($window, $http, config) {
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

      store.user = $http.get(`${config.pdsUrl}?${config.pdsUserInfo.queryString}&pds_handle=${getCookie('PDS_HANDLE')}`, {
          timeout: 6000
        })
        .then(response => {
          const xml = response.data;
          const getXMLProp = prop => (new $window.DOMParser).parseFromString(xml, 'text/xml').querySelector(prop).textContent
          const user = config.pdsUserInfo.selectors.reduce((res, prop) => Object.assign(res, {
            [prop]: getXMLProp(prop)
          }), {});

          store.user = user;
          return user;
        })

      return store.user;
    }

    return {
      setLogin: fxn => {
        svc.store.login = fxn;
        return fxn;
      },
      setLogout: fxn => {
        svc.store.logout = fxn;
        return fxn;
      },

      // Written as a function to encapsulate changable login/logout functions
      login: () => svc.store.login(),
      logout: () => svc.store.logout(),
      fetchPDSUser: () => svc.store.user ? Promise.resolve(svc.store.user) : svc.fetchPDSUser(svc.store),
    };
  }])


authenticationController.$inject = ['customLoginService']
function authenticationController(customLoginService) {
  const ctrl = this;
  ctrl.$onInit = function () {
    customLoginService.setLogin(ctrl.parentCtrl.handleLogin.bind(ctrl.parentCtrl));
    customLoginService.setLogout(ctrl.parentCtrl.handleLogout.bind(ctrl.parentCtrl));
  };
}