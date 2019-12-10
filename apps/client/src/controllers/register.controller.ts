import { saveDB } from '../utils/mongo';
import { Request } from 'express';
const { Issuer, generators } = require('openid-client');

export const register = async (req: Request, res, next) => {
  // tslint:disable-next-line:object-literal-sort-keys

  const { url, uid } = req.query;

  // generate the code challenge
  // TODO use the generators instead of hard coding the code_verifier
  const code_verifier = generators.codeVerifier(); // 'davXRxc9zXNz6ZvdUL79ORSmXDEMe6TpM2AuL3bqz8t'; //;
  const code_challenge = generators.codeChallenge(code_verifier);

  // get the wellKnown from the host
  const issuer = await Issuer.discover(url);

  // generate the state and internal id for the host
  const [{ insertedId: id }, { insertedId: state }] = await Promise.all([
    saveDB(issuer, 'wellKnows'),
    saveDB({ code_verifier, code_challenge, uid }, 'codeChallenges')
  ]);

  const redirect_uri = `http://${req.headers.host}/callback/${id}?uid=${uid}`;

  // register a new client for this host
  const client = await issuer.Client.register({
    redirect_uris: [redirect_uri],
    application_type: 'web',
    token_endpoint_auth_method: 'client_secret_basic'
  });

  // generate the redirect url
  const authUrl = client.authorizationUrl({
    redirect_uri,
    code_challenge,
    state,
    code_challenge_method: 'S256',
    scope:
      'openid https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly'
  });

  Promise.all([saveDB({ ...client, _id: id }, 'clients')]);

  await res.json({ authUrl });
};
