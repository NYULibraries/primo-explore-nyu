import { viewName } from './viewName';

class prmBriefResultContainerAfterController {
  getGetitLink() {
    return this.parentCtrl.item.link['openurl'];
  };
}

export let prmBriefResultContainerAfterConfig = {
  name: 'prmBriefResultContainerAfter',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: prmBriefResultContainerAfterController,
    templateUrl: 'custom/' + viewName + '/html/prmBriefResultContainerAfter.html'
  }
};
