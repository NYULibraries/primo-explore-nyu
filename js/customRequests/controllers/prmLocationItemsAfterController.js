prmLocationItemsAfterController.$inject = ['customRequestsConfigService', '$element', 'customLoginService', 'customRequestService', '$compile', '$scope'];
export default function prmLocationItemsAfterController(config, $element, customLoginService, customRequestService, $compile, $scope) {
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

    if (!loggedIn) return Promise.resolve(undefined);
    return customLoginService.fetchPDSUser()
    .then(user => {
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