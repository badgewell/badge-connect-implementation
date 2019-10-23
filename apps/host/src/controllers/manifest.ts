import { Request, Response } from 'express';

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
  BADGE_CONNECT_VERSION,
} = process.env;

export const wellKnown = (req: Request, res: Response) => {
  const scopes =  [
    'openid',
    'profile',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.create',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.readonly',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.update',
    'offline_access',
  ];
  const { host  } = req.headers;
  const {protocol} = req;
  res.json({
    id: `${protocol}://${host}/.well-known/badgeconnect.json`,
    type: 'Manifest',
    badgeConnectAPI: [
      {
        id: `${protocol}://${host}/.well-known/badgeconnect.json`,
        type: 'BadgeConnectAPI',
        apiBase: API_BASE,
        authorizationUrl: AUTHORIZATION_URL,
        image: LOGO_URL,
        name: NAME,
        privacyPolicyUrl: PRIVACY_POLICY_URL,
        registrationUrl: REGISTRATION_URL,
        scopesOffered: scopes ,
        termsOfServiceUrl: TERMS_OF_SERVICE_URL,
        tokenUrl: AUTHORIZATION_TOKEN_URL,
        version: BADGE_CONNECT_VERSION,
      },
    ],
  });
};
