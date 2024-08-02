import * as langChange from './langChange';
import * as userChange from './userChange';
import * as subdomainInfoChange from './subdomainInfoChange';

const ActionCreators = Object.assign(
  {},
  langChange,
  userChange,
  subdomainInfoChange
);

export default ActionCreators;