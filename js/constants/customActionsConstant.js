export let customActionsConstant = {
  name: 'customActions',
  definition: [
    {
      name: "EasyBiB",
      type: 'template',
      icon: {
          set: 'action',
          name: 'ic_open_in_new_24px'
      },
      action: "/primo_library/libweb/action/PushToAction.do?doc={recordId}&recId={recordId}&docs={recordId}&pushToType=EasyBiB&fromEshelf=false"
    },
    {
      name: "RIS",
      type: "template",
      icon: {
        set: "action",
        name: "ic_visibility_24px"
      },
      action: "/primo_library/libweb/action/PushToAction.do?doc={recordId}&recId={recordId}&docs={recordId}&pushToType=RIS&fromEshelf=false"
    },
    {
      name: "BibTeX",
      type: "template",
      icon: {
        set: "content",
        name: "ic_gesture_24px"
      },
      action: "/primo_library/libweb/action/PushToAction.do?doc={recordId}&recId={recordId}&docs={recordId}&pushToType=BibTeX&fromEshelf=false"
    }
  ]
};
