import types from '../types';

export function subdomainInfoChange(subdomainInfo: SubDomainInfoDataType) {
  return {
    type: types.subdomainInfoChange,
    payload: subdomainInfo
  }
}