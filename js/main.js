import 'primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-custom-no-search-results';
import 'primo-explore-libraryh3lp-widget';

import { viewName } from './viewName';
import { prmSearchResultAvailabilityLineAfterConfig } from './prmSearchResultAvailabilityLineAfter';
import { customActionsConstant } from './customActions';

let app = angular.module('viewCustom', [
                                        'angularLoad',
                                        'customActions',
                                        'customLibraryCardMenu',
                                        'clickableLogoToAnyLink',
                                        'customNoSearchResults',
                                        'libraryh3lpWidget'
                                      ]);

app
   .component(prmSearchResultAvailabilityLineAfterConfig.name, prmSearchResultAvailabilityLineAfterConfig.config)

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
