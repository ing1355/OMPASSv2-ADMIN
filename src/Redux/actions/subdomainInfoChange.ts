import types from '../types';

export function subdomainInfoChange(subdomainInfo: SubDomainInfoDataType|null) {
  return {
    type: types.subdomainInfoChange,
    payload: subdomainInfo
  }
}