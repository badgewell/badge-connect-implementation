import { getById, saveDB } from '../utils/mongo';
const { Issuer } = require('openid-client');

export const callback = async (req, res, next) => {
  // uid

  const { id } = req.params;

  const redirect_uri = `http://${req.headers.host}/callback/${id}`;

  const [wellKnownMetadata, clientMetadata] = await Promise.all([
    getById(id, 'wellKnows'),
    getById(id, 'clients')
  ]);

  // TODO remove hard coded code_verifier
  // const { uid } = req.query;

  const issuer = await Issuer.discover(wellKnownMetadata.badgeConnectAPI[0].id);

  const client = new issuer.Client(clientMetadata);

  const code_verifier = 'davXRxc9zXNz6ZvdUL79ORSmXDEMe6TpM2AuL3bqz8t'; // generators.codeVerifier();

  const params = client.callbackParams(req);

  if (Object.keys(params).length) {
    const tokenSet = await client.callback(redirect_uri, params, {
      code_verifier,
      response_type: 'code'
    });

    const userinfo = await client.userinfo(tokenSet);
    await saveDB(userinfo, 'userinfo');

    res.json({ userinfo });
  }
};
