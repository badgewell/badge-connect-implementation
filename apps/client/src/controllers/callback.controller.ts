import { getById, saveDB } from '../utils/mongo';
const { Issuer } = require('openid-client');

export const callback = async (req, res, next) => {
  const { id } = req.params;
  const { userUid } = req.query;

  const redirect_uri = `http://${req.headers.host}/callback/${id}?userUid=${userUid}`;

  // get both the client and wellKnown from the database
  const [wellKnownMetadata, clientMetadata] = await Promise.all([
    getById(id, 'wellKnows'),
    getById(id, 'clients')
  ]);

  // reget the wellKnown manifest from the host
  const issuer = await Issuer.discover(wellKnownMetadata.badgeConnectAPI[0].id);

  const client = new issuer.Client(clientMetadata);

  // TODO remove hard coded code_verifier
  const code_verifier = 'davXRxc9zXNz6ZvdUL79ORSmXDEMe6TpM2AuL3bqz8t'; // generators.codeVerifier();

  // get the request params for use with the callback
  const params = client.callbackParams(req);

  // get the access_token
  if (Object.keys(params).length) {
    const tokenSet = await client.callback(redirect_uri, params, {
      code_verifier,
      response_type: 'code'
    });

    // get the user profile
    const userinfo = await client.userinfo(tokenSet); // get user profile

    await Promise.all([
      saveDB({ ...userinfo, _id: userUid }, 'hostProfiles'),
      saveDB({ ...tokenSet, _id: userUid }, 'accessTokens')
    ]);

    // TODO get the awards using the accessToken
    await res.json({ userinfo });
  }
};
