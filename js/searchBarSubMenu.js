export let searchBarSubMenuItemsConfig = {
  name: 'searchBarSubMenuItems',
  config: [
    {
      name: "Back to Primo Classic",
      description: "Back to Primo Classic",
      action: "http://bobcatdev.library.nyu.edu",
      icon: {
        set: 'navigation',
        icon: 'ic_arrow_back_24px'
      },
      show_xs: true
    },
    {
      name: "Provide Feedback",
      description: "Provide Feedback",
      action: "https://nyu.qualtrics.com/jfe/form/SV_blQ3OFOew9vl6Pb?Source=NYU",
      icon: {
        set: 'communication',
        icon: 'ic_forum_24px'
      }
    },
    {
      name: "Library Hours",
      description: "Library Hours",
      action: "https://guides.nyu.edu/library-hours",
      icon: {
        set: 'av',
        icon: 'ic_av_timer_24px'
      }
    }
  ]
};


angular
  .module('searchBarSubMenu', [])
  .constant(searchBarSubMenuItemsConfig.name, searchBarSubMenuItemsConfig.config)
  .controller('searchBarSubMenuController', ['searchBarSubMenuItems', '$scope', '$filter', function(items, $scope, $filter) {
    this.$onInit = () => {
      $scope.items = items;
    }
    $scope.translate = (original) => {
      return original.replace(/\{(.+)\}/g, (match, p1) => $filter('translate')(p1));
    }
    $scope.goToUrl = (url) => {
      window.open(url, '_blank');
    }
  }])
  .component('searchBarSubMenu', {
    controller: 'searchBarSubMenuController',
    template: `<div class="layout-align-end-center layout-row flex search-bar-sub-menu">
                <ul>
                  <li ng-repeat="item in items">
                  <button aria-label="{{ translate(item.description) }}" ng-click="goToUrl(translate(item.action))" class="button-with-icon zero-margin md-button md-small {{item.cssClasses}}" type="button">
                    <md-tooltip md-direction="bottom" md-delay="500">{{ translate(item.description) }}</md-tooltip><prm-icon style="z-index:1" icon-type="svg" svg-icon-set="{{item.icon.set}}" icon-definition="{{item.icon.icon}}"></prm-icon>
                    <span class="search-bar-sub-menu-item" ng-class="(item.show_xs) ? '' : 'hide-xs'">{{ translate(item.name) }}</span>
                  </button>
                  </li>
                </ul>
              </div>`

  });
