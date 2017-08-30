import 'primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-custom-no-search-results';
import 'primo-explore-libraryh3lp-widget';

import { viewName } from './viewName';
import { customActionsConstant } from './customActions';

angular
  .module('getitToLinkResolver', [])
  .controller('getitToLinkResolverController', ['$scope', function($scope) {
    this.$onInit = function() {
      this.getitLinkField = 'lln10';
      $scope.getitLink = this.parentCtrl.item.delivery.link.filter(link => link["displayLabel"] == this.getitLinkField)[0]["linkURL"]
    };
    $scope.checkAvailabilityLinkText = 'Check Availability';
  }])
  .component('prmOpacAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'getitToLinkResolverController',
    template: '<a ng-href="{{ getitLink }}" class="arrow-link check-avail-link" target="_blank">{{ checkAvailabilityLinkText }} '+
              '<prm-icon style="z-index:1" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>'+
              '<prm-icon link-arrow="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"></prm-icon>'+
              '</a> '
  });

let app = angular.module('viewCustom', [
                                        'angularLoad',
                                        'customActions',
                                        'customLibraryCardMenu',
                                        'clickableLogoToAnyLink',
                                        'customNoSearchResults',
                                        'libraryh3lpWidget',
                                        'getitToLinkResolver'
                                      ]);

app.constant(customActionsConstant.name, customActionsConstant.config)

app.constant('customLibraryCardMenuItems',
  [
    {
      name: "{nui.menu.librarycard}",
      description: "Go to {nui.menu.librarycard}",
      action: "{urls.eshelf}/account",
      icon: {
        set: 'social',
        icon: 'ic_person_outline_24px'
      }
    }
  ]
)

app.constant('clickableLogoLinkConfig', {
  url: '{urls.library}',
  altText: '{nui.header.logoAlt}'
});

app.value('customNoSearchResultsTemplateUrl', 'custom/' + viewName + '/html/noSearchResults.html')

app.constant('libraryh3lpWidgetConfig', {
  url: 'https://us.libraryh3lp.com/chat/askbobst@chat.libraryh3lp.com?skin=23106',
  prompt: 'Chat with us',
  icon: {
    set: 'communication',
    icon: 'ic_chat_24px'
  }
});
