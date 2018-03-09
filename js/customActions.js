export let customActionsConfig = {
  name: 'customActions',
  template: `
          <custom-action name="feedback"
                label="Feedback"
                index=3
                icon="ic_forum_24px"
                icon-set="communication"
                link="https://nyu.qualtrics.com/jfe/form/SV_blQ3OFOew9vl6Pb?Source=NYU" />
          <custom-action name="export_endnote"
                label="EndNote"
                index=4
                icon="ic_description_24px"
                icon-set="action"
                link="http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution=NYU&local_id={pnx.search.recordid[0]}&cite_to=endnote" />
            <custom-action name="export_refworks"
                  label="RefWorks"
                  index=5
                  icon="ic_description_24px"
                  icon-set="action"
                  link="http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution=NYU&local_id={pnx.search.recordid[0]}&cite_to=refworks" />
            <custom-action name="download_ris"
                  label="RIS"
                  index=6
                  icon="ic_file_download_24px"
                  icon-set="file"
                  link="http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution=NYU&local_id={pnx.search.recordid[0]}&cite_to=ris" />
            <custom-action name="download_bibtex"
                  label="BibTeX"
                  index=7
                  icon="ic_file_download_24px"
                  icon-set="file"
                  link="http://nyu-pushtocite.herokuapp.com/?calling_system=primo&institution=NYU&local_id={pnx.search.recordid[0]}&cite_to=bibtex" />
              `
};
