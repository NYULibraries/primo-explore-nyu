prmLocationItemsAfterController.$inject = ['customRequestsConfigService', '$element', 'customLoginService', 'customRequestService', '$compile', '$scope'];
export default function prmLocationItemsAfterController(config, $element, customLoginService, customRequestService, $compile, $scope) {
  const ctrl = this;

  ctrl.hideRequest = idx => {
    const $el = $element.parent().parent().queryAll('.md-list-item-text')[idx];
    $el ? $el.children().eq(2).css({ display: 'none' }) : null;
  }

  ctrl.hideCustomRequest = idx => {
    const $el = $element.parent().parent().queryAll('prm-location-item-after')[idx]
    $el ? $el.css({ display: 'none' }) : null;
  }

  ctrl.revealRequest = idx => {
    const $el = $element.parent().parent().queryAll('.md-list-item-text')[idx];
    $el ? $el.children().eq(2).css({ display: 'flex' }) : null;
  }

  ctrl.revealCustomRequest = idx => {
    const $el = $element.parent().parent().queryAll('prm-location-item-after')[idx]
    $el ? $el.css({ display: 'flex' }) : null;
  }

  ctrl.runAvailabilityCheck = () => {
    const loggedIn = !ctrl.parentCtrl.userSessionManagerService.isGuest();
    customRequestService.setState({ loggedIn });

    if (!loggedIn) {
      return Promise.resolve(undefined);
    }

    return customLoginService.fetchPDSUser()
      .then(user => {
        const links = config.links.reduce((arr, link) => {
          const show = config.showLinks[link]({
            config,
            user,
            item: ctrl.parentCtrl.item
          });
          if (show) {
            return arr.concat({
              label: config.linkText[link],
              href: config.linkGenerators[link]({
                base: config.baseUrls[link],
                item: ctrl.parentCtrl.item,
              })
            });
          } else {
            return arr;
          }
        }, []);

        customRequestService.setState({ links, user });
      })
      .catch(err => {
        console.error(err);
        customRequestService.setState({ userFailure: true })
      });
  }

  ctrl.$doCheck = () => {
    if (ctrl.parentCtrl.currLoc === undefined) return;
    // manual check to see if items have changed
    if (ctrl.parentCtrl.currLoc.items !== ctrl.trackedItems) {
      ctrl.trackedItems = ctrl.parentCtrl.currLoc.items;
      ctrl.runAvailabilityCheck().then(() => {
        config.hideDefault({ items: ctrl.trackedItems, config }).forEach((toHide, idx) => toHide ? ctrl.hideRequest(idx) : null);
        config.hideCustom({ items: ctrl.trackedItems, config }).forEach((toHide, idx) => toHide ? ctrl.hideCustomRequest(idx) : null)
        // double-action required because of wonkiness when moving among locations
        config.hideDefault({ items: ctrl.trackedItems, config }).forEach((toHide, idx) => !toHide ? ctrl.revealRequest(idx) : null);
        config.hideCustom({ items: ctrl.trackedItems, config }).forEach((toHide, idx) => !toHide ? ctrl.revealCustomRequest(idx) : null)
        ctrl.hasCheckedReveal = false;
      });
    }
  };
}