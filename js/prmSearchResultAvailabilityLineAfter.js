import { viewName } from './viewName';

class prmSearchResultAvailabilityLineAfterController {
  getGetitLink() {
    return this.parentCtrl.result.link['lln10'];
  };
}

export let prmSearchResultAvailabilityLineAfterConfig = {
  name: 'prmSearchResultAvailabilityLineAfter',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: prmSearchResultAvailabilityLineAfterController,
    templateUrl: 'custom/' + viewName + '/html/checkAvailLink.html'
  }
};
