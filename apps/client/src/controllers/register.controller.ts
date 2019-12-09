import { saveDB } from '../utils/mongo';
import { Request } from 'express';
const { Issuer, generators } = require('openid-client');

export const register = async (req: Request, res, next) => {
  // tslint:disable-next-line:object-literal-sort-keys

  const { url, uid } = req.query;
  const issuer = await Issuer.discover(url);
  issuer.registration_endpoint = issuer.badgeConnectAPI[0].registrationUrl;
  issuer.authorization_endpoint = issuer.badgeConnectAPI[0].authorizationUrl;
  issuer.token_endpoint = issuer.badgeConnectAPI[0].tokenUrl;
  issuer.issuer = 'http://localhost:5000';
  issuer.jwks_uri = 'http://localhost:5000/jwks';
  issuer.userinfo_endpoint = 'http://localhost:5000/me';

  const { insertedId } = await saveDB(issuer, 'wellKnows');
  const redirect_uri = `http://${req.headers.host}/callback/${insertedId}`;
  console.log(redirect_uri);

  const client = await issuer.Client.register({
    redirect_uris: [redirect_uri],
    application_type: 'native',
    token_endpoint_auth_method: 'client_secret_basic'
  });

  const code_verifier = 'davXRxc9zXNz6ZvdUL79ORSmXDEMe6TpM2AuL3bqz8t'; // generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);
  console.log(code_verifier, code_challenge, client.redirect_uris);

  const authUrl = client.authorizationUrl({
    redirect_uri,
    code_challenge,
    code_challenge_method: 'S256',
    scope:
      'openid https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly'
  });

  const cl = await Promise.all([
    saveDB({ ...client, _id: insertedId }, 'clients')
  ]);

  res.json({ authUrl });
  //   await saveDB(data , 'clients');
};
