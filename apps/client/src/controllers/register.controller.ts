import {response} from 'express';
import fetch from 'node-fetch';
import {saveDB} from '../utils/mongo';

export const saveWellKnown = async (req , res , next) => {
    const result = await fetch(req.query.URL);
    const data = await result.json();
    await saveDB(data , 'wellknown');
    next();
};

export const register = async (req , res , next) => {
    // tslint:disable-next-line:object-literal-sort-keys
  const result = await fetch('http://localhost:5000/registration' ,
      {method: 'POST',
      // tslint:disable-next-line:object-literal-sort-keys
      body:
              JSON.stringify({
                  client_name: 'Badge Issuer',
                  client_uri: 'https://about.badgewell.com',
                  logo_uri: 'https://about.badgewell.com',
                  tos_uri: 'https://about.badgewell.com',
                  // tslint:disable-next-line:object-literal-sort-keys
                  policy_uri: 'https://about.badgewell.com',
                  software_id: '13dcdc83-fc0d-4c8d-9159-6461da297388',
                  software_version: '54dfc83-fc0d-4c8d-9159-6461da297388',
                  redirect_uris: [
                      'https://about.badgewell.com',
                  ],
                  token_endpoint_auth_method: 'client_secret_basic',
                  grant_types: [
                      'authorization_code',
                      'refresh_token', 'implicit',
                  ],
                  response_types: [
                      'id_token',
                  ],
                  scope: 'openid profile https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly',
              }),
              headers: { 'Content-Type': 'application/json' },
            });
  const data = await result.json();
  await saveDB(data , 'clients');
};
