import { viewName } from './viewName';

class prmSearchResultAvailabilityLineAfterController {
  getGetitLink() {
    // This is the PNX path to get the correct OpenURL for GetIt
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
