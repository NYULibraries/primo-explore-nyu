import 'primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-custom-no-search-results';

import { viewName } from './viewName';
import { prmExploreMainAfterConfig } from './prmExploreMainAfter';
import { prmSearchResultAvailabilityLineAfterConfig } from './prmSearchResultAvailabilityLineAfter';
import { customActionsConstant } from './customActions';

let app = angular.module('viewCustom', [
                                        'angularLoad',
                                        'customActions',
                                        'customLibraryCardMenu',
                                        'clickableLogoToAnyLink',
                                        'customNoSearchResults'
                                      ]);

app
   .component(prmExploreMainAfterConfig.name, prmExploreMainAfterConfig.config)
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
