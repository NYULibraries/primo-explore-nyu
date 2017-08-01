# NYU Primo-explore package

This the NYU Consortium primo-explore view package.

The `master` branch represents the `CENTRAL_PACKAGE` and the branches named for each individual view, e.g. "NYU", "NYUAD", etc.

For more information about primo-explore views please review the example package that this package was cloned from: https://github.com/ExLibrisGroup/primo-explore-package.

For information about developing in the primo-explore UI please review that relevant repository: https://github.com/ExLibrisGroup/primo-explore-devenv

## Deploys

Deploys must be done through the back office UI with an uploaded zip package.

1. **Notify admins and devs** by scheduling a block in the appropriate Primo calendar. This ensures no conflicts between manual deploys and jobs.

1. **Build the zip file.** Run `scripts/build_package` to build a zip file of this customization package. The script also removes files that cause the upload to fail, specifically any files except `package.json` without the following extensions: `png`, `jpg`, `gif`, `js`, `html`, `css`.

1. **Verify that no deploys or pipes are running or scheduled.** Under Monitor Primo Status, check the following to ensure nothing is running or scheduled (Jobs need about 15 minutes after completion to finish before a deploy can be run.):
    - Schedule Tasks
    - Deploy Monitoring
    - Process Monitoring
    - Job Monitoring

1. **Upload zip file.** Navigate to Deploy & Utilities > Customization Manager. Select "New York University" as Owner and "NYU-NUI" as View. Download the existing package in case of failure. Choose file and click "Upload".

1. **Deploy** by clicking "Deploy." You can monitor progress under "Deploy Monitoring."
