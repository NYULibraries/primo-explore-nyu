export let customActionsConstant = {
  name: 'customActions',
  config: [
    {
      name: "EndNote",
      type: 'template',
      icon: {
          set: 'action',
          name: 'ic_description_24px'
      },
      action: "/primo_library/libweb/action/PushToAction.do?indx=1&doc={recordId}&recId={recordId}&docs={recordId}&pushToType=EndNote&fromEshelf=false"
    },
    {
      name: "RefWorks",
      type: 'template',
      icon: {
          set: 'action',
          name: 'ic_description_24px'
      },
      action: "/primo_library/libweb/action/PushToAction.do?indx=1&doc={recordId}&recId={recordId}&docs={recordId}&pushToType=RefWorks&fromEshelf=false"
    },
    {
      name: "EasyBIB",
      type: 'template',
      icon: {
          set: 'action',
          name: 'ic_description_24px'
      },
      action: "/primo_library/libweb/action/PushToAction.do?indx=1&doc={recordId}&recId={recordId}&docs={recordId}&pushToType=EasyBIB&fromEshelf=false"
    },
    {
      name: "RIS",
      type: "template",
      icon: {
        set: "file",
        name: "ic_file_download_24px"
      },
      action: "/primo_library/libweb/action/PushToAction.do?doc={recordId}&recId={recordId}&docs={recordId}&pushToType=RIS&fromEshelf=false"
    },
    {
      name: "BibTeX",
      type: "template",
      icon: {
        set: "file",
        name: "ic_file_download_24px"
      },
      action: "/primo_library/libweb/action/PushToAction.do?doc={recordId}&recId={recordId}&docs={recordId}&pushToType=BibTeX&fromEshelf=false"
    }
  ]
};
