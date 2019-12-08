export interface IBadgeConnectAPI {
  id: string;
  type: string;
  apiBase: string;
  authorizationUrl: string;
  image: string;
  name: string;
  privacyPolicyUrl: string;
  registration_endpoint: string;
  scopesOffered: string[];
  termsOfServiceUrl: string;
  tokenUrl: string;
  version: string;
}

export interface IManifestResponse {
  id: string;
  type: string;
  badgeConnectAPI: IBadgeConnectAPI[];
}

export type scope =
  | 'openid'
  | 'profile'
  | 'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly'
  | 'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.create'
  | 'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.readonly'
  | 'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.update'
  | 'offline_access';
