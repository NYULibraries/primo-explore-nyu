import { viewName } from './viewName';
export let customActionsConfig = {
  name: 'customActions',
  config: [
    {
      name: "EndNote",
      type: 'template',
      icon: {
          set: 'action',
          name: 'ic_description_24px'
      },
      action: "http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution="+viewName+"&local_id={recordId}&cite_to=endnote"
    },
    {
      name: "RefWorks",
      type: 'template',
      icon: {
          set: 'action',
          name: 'ic_description_24px'
      },
      action: "http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution="+viewName+"&local_id={recordId}&cite_to=refworks"
    },
    {
      name: "EasyBIB",
      type: 'template',
      icon: {
          set: 'action',
          name: 'ic_description_24px'
      },
      action: "http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution="+viewName+"&local_id={recordId}&cite_to=easybibpush"
    },
    {
      name: "RIS",
      type: "template",
      icon: {
        set: "file",
        name: "ic_file_download_24px"
      },
      action: "http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution="+viewName+"&local_id={recordId}&cite_to=ris"
    },
    {
      name: "BibTeX",
      type: "template",
      icon: {
        set: "file",
        name: "ic_file_download_24px"
      },
      action: "http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution="+viewName+"&local_id={recordId}&cite_to=bibtex"
    }
  ]
};
