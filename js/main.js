import 'primo-explore-custom-actions';
import 'primo-explore-custom-library-card-menu';
import 'primo-explore-clickable-logo-to-any-link';
import 'primo-explore-custom-no-search-results';
import 'primo-explore-libraryh3lp-widget';
import 'primo-explore-getit-to-link-resolver';

import { viewName } from './viewName';
import { customActionsConfig } from './customActions';
import { customLibraryCardMenuItemsConfig } from './customLibraryCardMenu';
import { clickableLogoLinkConfig } from './clickableLogoToAnyLink';
import { libraryh3lpWidgetConfig } from './libraryh3lpWidget';
import { getitToLinkResolverConfig } from './getitToLinkResolver'

let app = angular.module('viewCustom', [
                                        'angularLoad',
                                        'customActions',
                                        'customLibraryCardMenu',
                                        'clickableLogoToAnyLink',
                                        'customNoSearchResults',
                                        'libraryh3lpWidget',
                                        'getitToLinkResolver'
                                      ]);

app
  .constant(customActionsConfig.name, customActionsConfig.config)
  .constant(customLibraryCardMenuItemsConfig.name, customLibraryCardMenuItemsConfig.config)
  .constant(clickableLogoLinkConfig.name, clickableLogoLinkConfig.config)
  .constant(libraryh3lpWidgetConfig.name, libraryh3lpWidgetConfig.config)
  .constant(getitToLinkResolverConfig.name, getitToLinkResolverConfig.config)
  .value('customNoSearchResultsTemplateUrl', 'custom/' + viewName + '/html/noSearchResults.html')
  // .component('prmSearchResultAvailabilityLineAfter', {
  //   template: '<getit-to-link-resolver-brief></getit-to-link-resolver-brief>'
  // })
  .component('prmOpacAfter', {
    template: '<getit-to-link-resolver-full></getit-to-link-resolver-full>'
  })
