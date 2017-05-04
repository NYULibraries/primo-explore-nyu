import { viewName } from './viewName';

class prmBriefResultContainerAfterController {
  getGetitLink() {
    let openUrlIndex = this.parentCtrl.item.delivery.link.findIndex( (element,index,array) => element.displayLabel === 'openurl');
    return this.parentCtrl.item.delivery.link[openUrlIndex].linkURL;
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
