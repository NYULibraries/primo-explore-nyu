import { viewName } from './viewName';

class prmBriefResultAfterController {
  // Get the image url
  getIconLink() {
    return this.parentCtrl.iconLink;
  };
}

export let prmBriefResultAfterConfig = {
  name: 'prmBriefResultAfter',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: prmBriefResultAfterController,
    templateUrl: 'custom/' + viewName + '/html/prmBriefResultAfter.html'
  }
};
