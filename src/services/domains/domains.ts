import { API_ROOT } from 'src/constants';
import store from 'src/store';
import { deleteDomain as _deleteDomain, upsertDomain } from 'src/store/domains/domains.actions';
import Request, { setData, setMethod, setParams, setURL, setXFilter } from '../index';
import { createDomainSchema, importZoneSchema, updateDomainSchema } from './domains.schema';

type Page<T> = Linode.ResourcePage<T>;
type Domain = Linode.Domain;

/**
 * Returns a paginated list of Domains.
 *
 */
export const getDomains = (params?: any, filters?: any) =>
  Request<Page<Domain>>(
    setURL(`${API_ROOT}/domains`),
    setMethod('GET'),
    setParams(params),
    setXFilter(filters),
  )
    .then(response => response.data);

/**
 * Returns all of the information about a specified Domain.
 *
 * @param domainId { number } The ID of the Domain to access.
 */
export const getDomain = (domainId: number) =>
  Request<Domain>(
    setURL(`${API_ROOT}/domains/${domainId}`),
    setMethod('GET'),
  )
    .then(response => response.data);

/**
 * Adds a new Domain to Linode's DNS Manager.
 *
 * @param data { object } Options for type, status, etc.
 */
export const createDomain = (data: Partial<Linode.Domain>) =>
  Request<Domain>(
    setData(data, createDomainSchema),
    setURL(`${API_ROOT}/domains`),
    setMethod('POST'),
  )
    .then(response => response.data)
    .then(domain => {
      store.dispatch(upsertDomain(domain));
      return domain;
    });

/**
 * Update information about a Domain in Linode's DNS Manager.
 *
 * @param domainId { number } The ID of the Domain to access.
 * @param data { object } Options for type, status, etc.
 */
export const updateDomain = (domainId: number, data: Partial<Linode.Domain>) =>
  Request<Domain>(
    setURL(`${API_ROOT}/domains/${domainId}`),
    setMethod('PUT'),
    setData(data, updateDomainSchema),
  )
    .then(response => response.data)
    .then(domain => {
      store.dispatch(upsertDomain(domain));
      return domain;
    })

/**
 * Deletes a Domain from Linode's DNS Manager. The Domain will be removed from Linode's nameservers shortly after this
 * operation completes. This also deletes all associated Domain Records.
 *
 * @param domainId { number } The ID of the Domain to delete.
 */
export const deleteDomain = (domainID: number) =>
  Request<{}>(
    setURL(`${API_ROOT}/domains/${domainID}`),
    setMethod('DELETE'),
  )
    .then(response => {
      store.dispatch(_deleteDomain(domainID));
      return response.data;
    });

/**
 * Clones a Domain.
 *
 * @param domainID { number } The ID of the Domain to clone.
 * @param cloneName { string } The name of the new domain.
 */
export const cloneDomain = (domainID: number, cloneName: string) =>
  Request<Domain>(
    setData({ domain: cloneName }),
    setURL(`${API_ROOT}/domains/${domainID}/clone`),
    setMethod('POST'),
  )
    .then(response => response.data);

/**
 * Imports a domain zone from a remote nameserver.
 *
 * @param domain { string } The domain to import.
 * @param remote_nameserver { string } The remote nameserver that allows zone transfers (AXFR).
 */
export const importZone = (domain: string, remote_nameserver: string) =>
  Request<Domain>(
    setData({ domain, remote_nameserver }, importZoneSchema),
    setURL(`${API_ROOT}/domains/import`),
    setMethod('POST'),
  )
    .then(response => response.data);
