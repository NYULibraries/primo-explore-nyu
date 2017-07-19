import { viewName } from './viewName';

class checkAvailLinkController {
  getGetitLink() {
    return this.parentCtrl.result.link['lln10'];
  };
}

export let checkAvailLinkConfig = {
  name: 'prmSearchResultAvailabilityLineAfter',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: checkAvailLinkController,
    templateUrl: 'custom/' + viewName + '/html/checkAvailLink.html'
  }
};
