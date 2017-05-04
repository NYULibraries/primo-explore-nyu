import { viewName } from './viewName';
import { prmLogoAfterConfig } from './prmLogoAfter';
import { prmBriefResultAfterConfig } from './prmBriefResultAfter';

let app = angular.module('viewCustom', ['angularLoad']);

app.component(prmLogoAfterConfig.name, prmLogoAfterConfig.config)
   .component(prmBriefResultAfterConfig.name, prmBriefResultAfterConfig.config);
