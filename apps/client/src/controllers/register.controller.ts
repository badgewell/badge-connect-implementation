import { saveDB } from '../utils/mongo';
import { Request } from 'express';
import { Issuer, generators, Client as IClient } from 'openid-client';

export const register = async (req: Request, res, next) => {
  // tslint:disable-next-line:object-literal-sort-keys

  const { url, uid } = req.query;

  // generate the code challenge
  const code_verifier = generators.codeVerifier();
  const state = generators.state();
  const code_challenge = generators.codeChallenge(code_verifier);

  // get the wellKnown from the host
  const issuer = await Issuer.discover(url);

  // generate the state and internal id for the host
  const [{ insertedId: id }] = await Promise.all([
    saveDB(issuer, 'wellKnows'),
    saveDB({ code_verifier, code_challenge, uid, state }, 'state')
  ]);

  const redirect_uri = `http://${req.headers.host}/callback/${id}`;

  // TODO report typing error
  const Client:any = issuer.Client;

  // register the client 
  const client = await Client.register({
    ...issuer.metadata,
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
