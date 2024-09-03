import * as langChange from './langChange';
import * as userChange from './userChange';
import * as subdomainInfoChange from './subdomainInfoChange';
import * as globalDatasChange from './globalDatasChange';

const ActionCreators = Object.assign(
  {},
  langChange,
  userChange,
  subdomainInfoChange,
  globalDatasChange
);

export default ActionCreators;