import * as langChange from './langChange';
import * as userChange from './userChange';

const ActionCreators = Object.assign(
  {},
  langChange,
  userChange
);

export default ActionCreators;