import 'primo-explore-custom-actions';

import { viewName } from './viewName';
import { prmLogoAfterConfig } from './prmLogoAfter';
import { prmExploreMainAfterConfig } from './prmExploreMainAfter';
import { prmSearchResultAvailabilityLineAfterConfig } from './prmSearchResultAvailabilityLineAfter';
import { prmNoSearchResultAfterConfig } from './prmNoSearchResultAfter';
import { customActionsConstant } from './customActions';
import { customLibraryCardMenu } from './customLibraryCardMenu';

let app = angular.module('viewCustom', ['angularLoad', 'customActions', 'customLibraryCardMenu']);

app.component(prmLogoAfterConfig.name, prmLogoAfterConfig.config)
   .component(prmExploreMainAfterConfig.name, prmExploreMainAfterConfig.config)
   .component(prmSearchResultAvailabilityLineAfterConfig.name, prmSearchResultAvailabilityLineAfterConfig.config)
   .component(prmNoSearchResultAfterConfig.name, prmNoSearchResultAfterConfig.config)

app.constant(customActionsConstant.name, customActionsConstant.config)
app.constant('customLibraryCardMenuItems',
  [
    {
      name: "{nui.menu.librarycard}",
      description: "Go to {nui.menu.librarycard}",
      action: "{urls.eshelf}/account"
    }
  ]
)
