import { saveDB } from '../utils/mongo';
import { Request } from 'express';
import { Issuer, generators, custom } from 'openid-client';

custom.setHttpOptionsDefaults({
  timeout: 5000
});

export const register = async (req: Request, res, next) => {
  // tslint:disable-next-line:object-literal-sort-keys

  try {
    const { url } = req.query;

    // generate the code challenge
    const code_verifier = generators.codeVerifier();
    const state = generators.state();
    const code_challenge = generators.codeChallenge(code_verifier);

    // get the wellKnown from the host
    const issuer = await Issuer.discover(url);

    // generate the state and internal id for the host
    const [{ insertedId: id }] = await Promise.all([
      saveDB(issuer, 'wellKnows'),
      saveDB({ code_verifier, code_challenge, state }, 'state')
    ]);

    const redirect_uri = `http://${req.headers.host}/callback/${id}`;

    // TODO report typing error
    const Client: any = issuer.Client;

    // register the client
    const client = await Client.register({
      ...issuer.metadata,
      redirect_uris: [redirect_uri],
      application_type: 'web',
      token_endpoint_auth_method: 'client_secret_basic'
    });

    Promise.all([saveDB({ ...client, _id: id }, 'clients')]);

    return await res.json(client);
  } catch (error) {
    console.error(error);
    res.status(400).send('can not register client');
  }
};
