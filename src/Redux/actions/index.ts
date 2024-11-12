import * as langChange from './langChange';
import * as userChange from './userChange';
import * as subdomainInfoChange from './subdomainInfoChange';
import * as globalDatasChange from './globalDatasChange';
import * as sessionCheckChange from './sessionCheckChange';

const ActionCreators = Object.assign(
  {},
  langChange,
  userChange,
  subdomainInfoChange,
  globalDatasChange,
  sessionCheckChange
);

export default ActionCreators;