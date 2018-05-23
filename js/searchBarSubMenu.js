export let searchBarSubMenuItemsConfig = {
  name: 'searchBarSubMenuItems',
  config: [
    {
      name: "Back to BobCat Classic",
      description: "Back to BobCat Classic",
      action: "http://bobcat.library.nyu.edu/primo_library/libweb/action/search.do?vid=" + "NYU-BKUP",
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
