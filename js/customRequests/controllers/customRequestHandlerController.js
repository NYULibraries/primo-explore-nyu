prmLocationItemsAfterController.$inject = ['customRequestsConfigService', '$element', 'customLoginService', 'customRequestService'];
export default function prmLocationItemsAfterController(config, $element, customLoginService, customRequestService) {
  const ctrl = this;

  ctrl.cssCustomRequest = css => idx => {
    const $el = $element.parent().parent().queryAll('prm-location-item-after')[idx]
    $el ? $el.css(css) : null;
  }

  ctrl.cssRequest = css => idx => {
    const $el = $element.parent().parent().queryAll('.md-list-item-text')[idx];
    $el ? $el.children().eq(2).css(css) : null;
  }

  ctrl.hideRequest = ctrl.cssRequest({ display: 'none' });
  ctrl.hideCustomRequest = ctrl.cssCustomRequest({ display: 'none' });
  ctrl.revealRequest = ctrl.cssRequest({ display: 'flex' });
  ctrl.revealCustomRequest = ctrl.cssCustomRequest({ display: 'flex' });

  ctrl.runAvailabilityCheck = () => {
    const loggedIn = !ctrl.parentCtrl.userSessionManagerService.isGuest();
    customRequestService.setState({ loggedIn });

    if (!loggedIn) {
      return Promise.resolve(undefined);
    }

    return customLoginService.fetchPDSUser()
      .then(user => {
        const item = ctrl.parentCtrl.item;
        const links = config.links.reduce((arr, link) => {
          const show = config.showLinks[link]({ config, user, item  });
          const makeLink = () => ({
            label: config.linkText[link],
            href: config.linkGenerators[link]({ base: config.baseUrls[link], item, config })
          });

          return arr.concat(show ? [ makeLink() ] : [])
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