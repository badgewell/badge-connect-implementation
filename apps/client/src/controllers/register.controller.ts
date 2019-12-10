import { saveDB } from '../utils/mongo';
import { Request } from 'express';
const { Issuer, generators } = require('openid-client');

export const register = async (req: Request, res, next) => {
  // tslint:disable-next-line:object-literal-sort-keys

  const { url, userUid } = req.query; 

  // get the wellKnown from the host
  const issuer = await Issuer.discover(url);

  const { insertedId } = await saveDB(issuer, 'wellKnows');

  const redirect_uri = `http://${req.headers.host}/callback/${insertedId}?userUid=${userUid}`; 

  // register a new client for this host
  const client = await issuer.Client.register({
    redirect_uris: [redirect_uri],
    application_type: 'web',
    token_endpoint_auth_method: 'client_secret_basic'
  });

  // generate teh code challenge 
  const code_verifier = 'davXRxc9zXNz6ZvdUL79ORSmXDEMe6TpM2AuL3bqz8t'; // generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);

  // generate the redirect url
  const authUrl = client.authorizationUrl({
    redirect_uri,
    code_challenge,
    code_challenge_method: 'S256',
    scope:
      'openid https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly'
  });

  await saveDB({ ...client, _id: insertedId }, 'clients');

  res.json({ authUrl });
};
