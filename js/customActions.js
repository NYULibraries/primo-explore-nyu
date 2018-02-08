import { viewName } from './viewName';
export let customActionsConfig = {
  name: 'customActions',
  config: [
    {
      name: "Feedback",
      type: 'template',
      icon: {
          set: 'communication',
          name: 'ic_forum_24px'
      },
      action: "https://nyu.qualtrics.com/jfe/form/SV_blQ3OFOew9vl6Pb?Source=NYU"
    },
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
