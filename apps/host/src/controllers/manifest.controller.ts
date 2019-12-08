import { Request, Response } from 'express';
import { IManifestResponse, scope } from '../types/manifest.type';

// TODO Add an API for each end point

// TODO Add default values for environment variables

const {
  AUTHORIZATION_URL,
  LOGO_URL,
  NAME,
  API_BASE,
  PRIVACY_POLICY_URL,
  REGISTRATION_URL,
  TERMS_OF_SERVICE_URL,
  AUTHORIZATION_TOKEN_URL,
  BADGE_CONNECT_VERSION
} = process.env;

export const wellKnown = (req: Request, res: Response) => {
  const scopes: scope[] = [
    'openid',
    'profile',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.create',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.readonly',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.update',
    'offline_access'
  ];
  const { host } = req.headers;
  const { protocol } = req;
  res.json({
    badgeConnectAPI: [
      {
        apiBase: API_BASE,
        authorizationUrl: AUTHORIZATION_URL,
        id: `${protocol}://${host}/.well-known/badgeconnect.json`,
        image: LOGO_URL,
        name: NAME,
        privacyPolicyUrl: PRIVACY_POLICY_URL,
        registration_endpoint: REGISTRATION_URL,
        registrationUrl: REGISTRATION_URL,
        termsOfServiceUrl: TERMS_OF_SERVICE_URL,
        tokenUrl: AUTHORIZATION_TOKEN_URL,
        type: 'BadgeConnectAPI',
        version: BADGE_CONNECT_VERSION
      }
    ],
    id: `${protocol}://${host}/.well-known/badgeconnect.json`,
    type: 'Manifest'
  } as IManifestResponse);
};
