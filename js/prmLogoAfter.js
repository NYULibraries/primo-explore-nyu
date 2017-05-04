import { viewName } from './viewName';

// Add Clickable Logo
class prmLogoAfterController {
  // Get the image url
  getIconLink() {
    return this.parentCtrl.iconLink;
  };
}

export let prmLogoAfterConfig = {
  name: 'prmLogoAfter',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: prmLogoAfterController,
    templateUrl: 'custom/' + viewName + '/html/prmLogoAfter.html'
  }
};
