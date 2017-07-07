import { viewName } from './viewName';

// Add Clickable Logo
class chatWidgetController {

}

export let chatWidgetConfig = {
  name: 'prmExploreMainAfter',
  config: {
    bindings: {
      parentCtrl: '<'
    },
    controller: chatWidgetController,
    templateUrl: 'custom/' + viewName + '/html/chatWidget.html'
  }
};
