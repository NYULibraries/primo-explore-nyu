import { viewName } from './viewName';
import { prmLogoAfterConfig } from './prmLogoAfter';
// import { PrmTopbarAfterConfig } from './prmTopbarAfter';

let app = angular.module('viewCustom', ['angularLoad']);

app.component(prmLogoAfterConfig.name, prmLogoAfterConfig.config);
